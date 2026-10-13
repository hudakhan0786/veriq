"""Authentication & Role-Based Access Control (RBAC) Layer.
Enforces RFC 7519 JWT, PBKDF2 credential verification, and statutory RBAC per
10_SECURITY_AND_AUDIT_SPECIFICATION.md and TS-WEB-02.
"""

from datetime import datetime, timedelta, timezone
import hashlib
import hmac
import json
import os
from typing import Dict, List, Optional, Set, Tuple, Union
import uuid

from fastapi import Depends, HTTPException, Header, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field
import jwt

try:
    from database import RoleEnum, User, get_db_session
except ImportError:
    from .database import RoleEnum, User, get_db_session

# Security Configuration
SECRET_KEY = os.environ.get(
    "NIRIKSHAK_SECRET_KEY",
    "Nirikshak-sec63-bsa2023-statutory-secret-key-prod-delhi-01"
)
ALGORITHM = "HS256"
DEFAULT_TOKEN_EXPIRY_HOURS = 8

# Role normalization aliases
ROLE_ALIASES = {
    "FIELD_LMO": RoleEnum.INSPECTOR.value,
    "INSPECTOR": RoleEnum.INSPECTOR.value,
    "CONTROLLER": RoleEnum.CONTROLLER.value,
    "ADJUDICATING_CONTROLLER": RoleEnum.CONTROLLER.value,
    "ZONAL_CONTROLLER": RoleEnum.CONTROLLER.value,
    "ADMIN": RoleEnum.ADMIN.value,
    "CENTRAL_ADMIN": RoleEnum.ADMIN.value,
    "VIEWER": RoleEnum.VIEWER.value,
    "FMCG_USER": RoleEnum.VIEWER.value,
}


class TokenPayload(BaseModel):
    sub: str  # user_id
    role: str
    jurisdiction_id: Optional[str] = None
    officer_name: Optional[str] = None
    badge_number: Optional[str] = None
    exp: Optional[int] = None
    iat: Optional[int] = None


class UserContext(BaseModel):
    user_id: str
    username: str
    role: str
    full_name: str
    badge_number: Optional[str] = None
    jurisdiction_id: Optional[str] = None
    is_active: bool = True


# -----------------------------------------------------------------------------
# Password Hashing & Verification (PBKDF2-HMAC-SHA256)
# -----------------------------------------------------------------------------

def hash_password(password: str, salt_bytes: Optional[bytes] = None, iterations: int = 100_000) -> str:
    """Hashes a password using PBKDF2-HMAC-SHA256 with 100,000 iterations.
    Format: pbkdf2_sha256$iterations$salt_hex$hash_hex
    """
    if salt_bytes is None:
        salt_bytes = os.urandom(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt_bytes, iterations)
    return f"pbkdf2_sha256${iterations}${salt_bytes.hex()}${dk.hex()}"


def verify_password(password: str, hashed_password: str) -> bool:
    """Verifies a plaintext password against a stored PBKDF2 hash using constant-time comparison."""
    try:
        parts = hashed_password.split("$")
        if len(parts) != 4 or parts[0] != "pbkdf2_sha256":
            return False
        iterations = int(parts[1])
        salt_bytes = bytes.fromhex(parts[2])
        expected_dk = bytes.fromhex(parts[3])
        actual_dk = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt_bytes, iterations)
        return hmac.compare_digest(actual_dk, expected_dk)
    except Exception:
        return False


# -----------------------------------------------------------------------------
# JWT Token Issuance and Decoding
# -----------------------------------------------------------------------------

def create_access_token(
    data: Dict[str, Union[str, int]],
    expires_delta: Optional[timedelta] = None
) -> str:
    """Issues an RFC 7519 JWT Bearer token signed with HMAC-SHA256."""
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(hours=DEFAULT_TOKEN_EXPIRY_HOURS)

    to_encode.update({
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
    })
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> TokenPayload:
    """Decodes and cryptographically validates a JWT token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub = payload.get("sub")
        role = payload.get("role")
        if not sub or not role:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload: missing sub or role claim",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return TokenPayload(**payload)
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token signature has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Cryptographic verification failed: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


def normalize_role(role_name: str) -> str:
    """Normalizes role strings across aliases (e.g. FIELD_LMO -> INSPECTOR)."""
    clean_role = role_name.strip().upper()
    return ROLE_ALIASES.get(clean_role, clean_role)


# -----------------------------------------------------------------------------
# Request Headers & Tracing Dependency
# -----------------------------------------------------------------------------

class RequestHeaders(BaseModel):
    request_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_version: str = "Nirikshak-Web/1.0.0"
    device_fingerprint: str = "CLIENT-WORKSTATION-DYNAMIC"
    user_agent: Optional[str] = None
    sec_ch_ua_platform: Optional[str] = None
    sec_ch_ua_model: Optional[str] = None
    x_device_model: Optional[str] = None
    x_device_os: Optional[str] = None
    x_device_browser: Optional[str] = None
    x_clock_source: Optional[str] = None


def resolve_client_device_telemetry(headers: Optional[RequestHeaders] = None) -> Tuple[str, str, str]:
    """
    Dynamically extracts client's actual device model, OS, and clock source from request headers
    (X-Device-Model, Sec-CH-UA-Model, Sec-CH-UA-Platform, User-Agent) with authentic runtime fallback
    to platform.platform() and platform.processor().
    """
    import platform
    import re

    device_model = ""
    os_name = ""
    clock_source = "LOCAL_DEVICE_MONOTONIC"

    if headers:
        if headers.x_clock_source and headers.x_clock_source.strip():
            raw_clock = headers.x_clock_source.strip().upper()
            if raw_clock in ("LOCAL_DEVICE_MONOTONIC", "NTP_SYNCHRONIZED", "MANUAL_DECLARED"):
                clock_source = raw_clock
            elif "NTP" in raw_clock or "NETWORK" in raw_clock:
                clock_source = "NTP_SYNCHRONIZED"
            elif "MANUAL" in raw_clock:
                clock_source = "MANUAL_DECLARED"
            else:
                clock_source = "LOCAL_DEVICE_MONOTONIC"

        # 1. Device Model Extraction
        if headers.x_device_model and headers.x_device_model.strip():
            device_model = headers.x_device_model.strip()
        elif headers.sec_ch_ua_model and headers.sec_ch_ua_model.strip().strip('"'):
            device_model = headers.sec_ch_ua_model.strip().strip('"')

        # 2. Operating System Extraction
        if headers.x_device_os and headers.x_device_os.strip():
            os_name = headers.x_device_os.strip()
        elif headers.sec_ch_ua_platform and headers.sec_ch_ua_platform.strip().strip('"'):
            os_name = headers.sec_ch_ua_platform.strip().strip('"')

        # 3. User-Agent parsing if needed
        ua = headers.user_agent or ""
        if ua:
            if not os_name:
                if "Windows NT 10.0" in ua:
                    os_name = "Windows 10 / 11"
                elif "Windows NT" in ua:
                    m = re.search(r"Windows NT ([\d\.]+)", ua)
                    os_name = f"Windows NT {m.group(1)}" if m else "Windows"
                elif "Mac OS X" in ua:
                    m = re.search(r"Mac OS X ([\d_]+)", ua)
                    ver = m.group(1).replace("_", ".") if m else ""
                    os_name = f"macOS {ver}".strip()
                elif "Android" in ua:
                    m = re.search(r"Android ([\d\.]+)", ua)
                    os_name = f"Android {m.group(1)}" if m else "Android"
                elif "iPhone OS" in ua or "iPad" in ua:
                    m = re.search(r"OS ([\d_]+)", ua)
                    ver = m.group(1).replace("_", ".") if m else ""
                    os_name = f"iOS {ver}".strip()
                elif "Linux" in ua:
                    os_name = "Linux"

            if not device_model:
                if "iPad" in ua:
                    device_model = "Apple iPad"
                elif "iPhone" in ua:
                    device_model = "Apple iPhone"
                elif "Android" in ua:
                    m = re.search(r"Android[^;]*;\s*([^;\)]+?)(?:\s+Build|\))", ua)
                    if m:
                        device_model = m.group(1).strip()
                    else:
                        device_model = "Android Mobile/Tablet"
                elif "Windows" in ua:
                    device_model = "Windows PC Workstation"
                elif "Macintosh" in ua:
                    device_model = "Macintosh Workstation"
                elif "Linux" in ua:
                    device_model = "Linux PC Workstation"

    # Runtime fallback if still unpopulated
    if not device_model or not device_model.strip():
        proc = platform.processor() or platform.machine()
        sys_name = platform.system()
        device_model = f"{sys_name} Workstation ({proc})" if proc else f"{sys_name} Workstation"

    if not os_name or not os_name.strip():
        os_name = platform.platform() or f"{platform.system()} {platform.release()}"

    return device_model, os_name, clock_source


def extract_request_headers(
    x_request_id: Optional[str] = Header(None, alias="X-Request-ID"),
    x_client_version: Optional[str] = Header(None, alias="X-Client-Version"),
    x_device_fingerprint: Optional[str] = Header(None, alias="X-Device-Fingerprint"),
    user_agent: Optional[str] = Header(None, alias="User-Agent"),
    sec_ch_ua_platform: Optional[str] = Header(None, alias="Sec-CH-UA-Platform"),
    sec_ch_ua_model: Optional[str] = Header(None, alias="Sec-CH-UA-Model"),
    x_device_model: Optional[str] = Header(None, alias="X-Device-Model"),
    x_device_os: Optional[str] = Header(None, alias="X-Device-OS"),
    x_device_browser: Optional[str] = Header(None, alias="X-Device-Browser"),
    x_clock_source: Optional[str] = Header(None, alias="X-Clock-Source"),
) -> RequestHeaders:
    """Extracts standard forensic telemetry headers per 07_API_AND_INTERFACE_CONTRACTS.md."""
    req_headers = RequestHeaders(
        request_id=x_request_id or str(uuid.uuid4()),
        client_version=x_client_version or "Nirikshak-Web/1.0.0",
        device_fingerprint=x_device_fingerprint or "CLIENT-WORKSTATION-DYNAMIC",
        user_agent=user_agent,
        sec_ch_ua_platform=sec_ch_ua_platform,
        sec_ch_ua_model=sec_ch_ua_model,
        x_device_model=x_device_model,
        x_device_os=x_device_os,
        x_device_browser=x_device_browser,
        x_clock_source=x_clock_source,
    )
    if not x_device_fingerprint or x_device_fingerprint in ("UNKNOWN-DEVICE-FINGERPRINT", "WEB-SPA-CLIENT-OFFICER-WORKSTATION"):
        d_model, d_os, _ = resolve_client_device_telemetry(req_headers)
        clean_model = d_model.replace(" ", "_")[:30]
        clean_os = d_os.replace(" ", "_")[:30]
        req_headers.device_fingerprint = f"CLI-{clean_os}-{clean_model}"

    return req_headers


# -----------------------------------------------------------------------------
# Authentication & Role Dependency
# -----------------------------------------------------------------------------

http_bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    auth_header: Optional[HTTPAuthorizationCredentials] = Depends(http_bearer_scheme),
) -> UserContext:
    """Extracts and verifies the current authenticated user from Bearer JWT."""
    if not auth_header or not auth_header.credentials:
        if os.environ.get("Nirikshak_ALLOW_ANON_LOCAL", "false").lower() in ("true", "1"):
            return UserContext(
                user_id="usr_01_rajesh",
                username="inspector_rajesh",
                role=RoleEnum.INSPECTOR.value,
                full_name="Rajesh Sharma",
                badge_number="INSP-DL-0842",
                jurisdiction_id="CIRCLE_DL_SOUTH_01",
                is_active=True,
            )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header or Bearer token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token_payload = decode_access_token(auth_header.credentials)
    norm_role = normalize_role(token_payload.role)

    # In-memory context constructed from verified cryptographic token claims
    return UserContext(
        user_id=token_payload.sub,
        username=token_payload.officer_name or token_payload.sub,
        role=norm_role,
        full_name=token_payload.officer_name or token_payload.sub,
        badge_number=token_payload.badge_number,
        jurisdiction_id=token_payload.jurisdiction_id,
        is_active=True,
    )


def require_role(*allowed_roles: str):
    """Enforces Role-Based Access Control (RBAC) on FastAPI endpoints.
    
    Raises HTTP 403 Forbidden if user's role does not match permitted roles (TS-WEB-02).
    """
    normalized_allowed: Set[str] = {normalize_role(r) for r in allowed_roles}
    # ADMIN is globally privileged
    normalized_allowed.add(RoleEnum.ADMIN.value)

    async def role_checker(current_user: UserContext = Depends(get_current_user)) -> UserContext:
        user_role = normalize_role(current_user.role)
        if user_role not in normalized_allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Forbidden: Role '{current_user.role}' is not authorized for this statutory operation. Required: {list(normalized_allowed)}",
            )
        return current_user

    return role_checker
