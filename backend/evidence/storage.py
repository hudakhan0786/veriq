"""Decoupled File Storage Manager & Upload Security Hardening (SIH26034)
Enforces ADL-19 (Storage Decoupling), 10_SECURITY_AND_AUDIT_SPECIFICATION.md, and TS-WEB-01.
Zero binary BLOBs in database tables; content-addressed storage keyed by SHA-256.
"""

from datetime import datetime, timezone
import hashlib
import os
from pathlib import Path
from typing import Optional, Tuple


class StorageSecurityError(Exception):
    """Base exception for storage security failures."""
    pass


class UnsupportedMediaTypeError(StorageSecurityError):
    """Raised when file magic bytes do not match permitted image or PDF specifications."""
    pass


class PayloadTooLargeError(StorageSecurityError):
    """Raised when uploaded file exceeds the statutory 15MB upload cap."""
    pass


try:
    from dotenv import load_dotenv
    load_dotenv()
    _repo_root = Path(__file__).resolve().parent.parent.parent
    if (_repo_root / ".env").exists():
        load_dotenv(_repo_root / ".env")
except Exception:
    pass


class SupabaseStorageAdapter:
    """Cloud Object Storage Adapter for Supabase Storage (S3-compatible).
    Provides permanent, resilient cloud storage for packaging evidence images,
    preventing data loss across container restarts on ephemeral platforms like Render.
    """
    def __init__(
        self,
        url: Optional[str] = None,
        key: Optional[str] = None,
        bucket: Optional[str] = None,
    ):
        self.url = (url or os.getenv("SUPABASE_URL", "")).rstrip("/")
        self.key = key or os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY") or ""
        self.bucket = bucket or os.getenv("SUPABASE_BUCKET", "evidence-images")
        self.is_configured = bool(self.url and self.key and self.bucket)
        self._headers = {
            "apikey": self.key,
            "Authorization": f"Bearer {self.key}",
        } if self.key else {}

    def upload_file(self, rel_path: str, raw_bytes: bytes, content_type: str = "image/jpeg") -> Optional[str]:
        """Uploads file to Supabase Storage. Returns public CDN URL or None on failure."""
        if not self.is_configured or not raw_bytes:
            return None
        clean_path = rel_path.lstrip("/").replace("\\", "/")
        if clean_path.startswith("storage/"):
            clean_path = clean_path[len("storage/"):]
        endpoint = f"{self.url}/storage/v1/object/{self.bucket}/{clean_path}"
        headers = {
            **self._headers,
            "Content-Type": content_type,
            "x-upsert": "true",
        }
        try:
            import httpx
            with httpx.Client(timeout=15.0) as client:
                res = client.post(endpoint, headers=headers, content=raw_bytes)
                if res.status_code in (200, 201):
                    return f"{self.url}/storage/v1/object/public/{self.bucket}/{clean_path}"
        except Exception:
            pass
        return None

    def delete_file(self, rel_path: str) -> bool:
        """Deletes file from Supabase Storage bucket."""
        if not self.is_configured or not rel_path:
            return False
        clean_path = rel_path.lstrip("/").replace("\\", "/")
        if clean_path.startswith("storage/"):
            clean_path = clean_path[len("storage/"):]
        endpoint = f"{self.url}/storage/v1/object/{self.bucket}"
        try:
            import httpx
            with httpx.Client(timeout=10.0) as client:
                res = client.request(
                    "DELETE",
                    endpoint,
                    headers={**self._headers, "Content-Type": "application/json"},
                    json={"prefixes": [clean_path]},
                )
                return res.status_code in (200, 204)
        except Exception:
            pass
        return False

    def download_file(self, rel_path: str) -> Optional[bytes]:
        """Downloads file bytes from Supabase Storage if missing locally."""
        if not self.is_configured or not rel_path:
            return None
        clean_path = rel_path.lstrip("/").replace("\\", "/")
        if clean_path.startswith("storage/"):
            clean_path = clean_path[len("storage/"):]
        pub_url = f"{self.url}/storage/v1/object/public/{self.bucket}/{clean_path}"
        try:
            import httpx
            with httpx.Client(timeout=15.0) as client:
                res = client.get(pub_url)
                if res.status_code == 200:
                    return res.content
        except Exception:
            pass
        return None

    def get_public_url(self, rel_path: str) -> Optional[str]:
        if not self.is_configured or not rel_path:
            return None
        clean_path = rel_path.lstrip("/").replace("\\", "/")
        if clean_path.startswith("storage/"):
            clean_path = clean_path[len("storage/"):]
        return f"{self.url}/storage/v1/object/public/{self.bucket}/{clean_path}"


class DecoupledStorageManager:
    """Manages secure filesystem storage decoupled from relational datastore."""

    MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB statutory limit (TS-WEB-01)

    ALLOWED_MIME_SIGNATURES = {
        "image/jpeg": (b"\xff\xd8\xff", ".jpg"),
        "image/png": (b"\x89PNG\r\n\x1a\n", ".png"),
        "application/pdf": (b"%PDF-", ".pdf"),
    }

    def __init__(self, base_dir: Optional[str] = None):
        if base_dir:
            self.base_dir = Path(base_dir).resolve()
        else:
            # Default to repo/storage
            repo_root = Path(__file__).resolve().parent.parent.parent
            self.base_dir = (repo_root / "backend" / "storage").resolve()

        self.uploads_dir = self.base_dir / "uploads"
        self.evidence_dir = self.base_dir / "evidence"

        # Ensure directories exist
        self.uploads_dir.mkdir(parents=True, exist_ok=True)
        self.evidence_dir.mkdir(parents=True, exist_ok=True)

        # Cloud storage adapter (Supabase)
        self.supabase = SupabaseStorageAdapter()

    @classmethod
    def detect_and_validate_mime(cls, data: bytes) -> Tuple[str, str]:
        """Inspects file magic bytes using strict zero-trust validation.
        
        Returns: (mime_type, file_extension)
        Raises: UnsupportedMediaTypeError if file is invalid or prohibited.
        """
        if not data:
            raise UnsupportedMediaTypeError("Empty file payload rejected.")

        # Prohibited signatures (Executables, scripts, SVG vectors)
        if data.startswith(b"MZ"):
            raise UnsupportedMediaTypeError("Executable payload rejected: Windows PE binary.")
        if data.startswith(b"\x7fELF"):
            raise UnsupportedMediaTypeError("Executable payload rejected: Linux ELF binary.")
        if data.startswith(b"#!"):
            raise UnsupportedMediaTypeError("Script payload rejected: Shell script.")
        if data.startswith(b"<?xml") or b"<svg" in data[:512].lower() or b"<script" in data[:1024].lower():
            raise UnsupportedMediaTypeError("SVG / XML script payload rejected per 10_SECURITY_AND_AUDIT_SPECIFICATION.md.")

        # Allowed signatures
        if data.startswith(b"\xff\xd8\xff"):
            return "image/jpeg", ".jpg"
        if data.startswith(b"\x89PNG\r\n\x1a\n"):
            return "image/png", ".png"
        if data.startswith(b"%PDF-"):
            return "application/pdf", ".pdf"

        # WebP signature: RIFF....WEBP
        if len(data) >= 12 and data[:4] == b"RIFF" and data[8:12] == b"WEBP":
            return "image/webp", ".webp"

        raise UnsupportedMediaTypeError("File signature not recognized as permitted image (JPEG/PNG/WebP) or PDF.")

    def save_upload(
        self,
        raw_bytes: bytes,
        original_filename: Optional[str] = None
    ) -> Tuple[str, str, str]:
        """Validates, hashes, and stores an incoming upload stream.
        
        Returns: (relative_file_path, sha256_hash, detected_mime)
        """
        if len(raw_bytes) > self.MAX_FILE_SIZE_BYTES:
            raise PayloadTooLargeError(
                f"File size {len(raw_bytes)} bytes exceeds maximum permitted limit of {self.MAX_FILE_SIZE_BYTES} bytes (15 MB)."
            )

        mime_type, ext = self.detect_and_validate_mime(raw_bytes)
        file_hash = hashlib.sha256(raw_bytes).hexdigest()

        now = datetime.now(timezone.utc)
        date_dir = self.uploads_dir / now.strftime("%Y") / now.strftime("%m") / now.strftime("%d")
        date_dir.mkdir(parents=True, exist_ok=True)

        target_file = date_dir / f"{file_hash}{ext}"
        if not target_file.resolve().is_relative_to(self.uploads_dir.resolve()):
            raise StorageSecurityError("Resolved upload path escapes the uploads directory.")
        if not target_file.exists():
            with target_file.open("wb") as f:
                f.write(raw_bytes)

        relative_path = str(target_file.relative_to(self.base_dir)).replace("\\", "/")

        # Cloud sync to Supabase Storage bucket
        if self.supabase and self.supabase.is_configured:
            try:
                self.supabase.upload_file(relative_path, raw_bytes, content_type=mime_type)
            except Exception:
                pass

        return relative_path, file_hash, mime_type

    def compress_for_archival_lossless(self, raw_bytes: bytes) -> bytes:
        """Lossless archive compression without data/pixel loss for secondary datastore archival.
        Guarantees 100% bitwise decompression fidelity without altering statutory pixel values."""
        import zlib
        return zlib.compress(raw_bytes, level=6)

    def decompress_archival_lossless(self, compressed_bytes: bytes) -> bytes:
        """Decompresses lossless archive bytes back to bitwise identical original image bytes."""
        import zlib
        return zlib.decompress(compressed_bytes)

    def save_evidence_document(
        self,
        doc_bytes: bytes,
        filename_prefix: str = "notice"
    ) -> Tuple[str, str]:
        """Stores a generated PDF evidence notice into the decoupled evidence directory."""
        if not doc_bytes.startswith(b"%PDF-"):
            raise UnsupportedMediaTypeError("Evidence document must be valid PDF bytes.")

        file_hash = hashlib.sha256(doc_bytes).hexdigest()
        now = datetime.now(timezone.utc)
        date_dir = self.evidence_dir / now.strftime("%Y") / now.strftime("%m") / now.strftime("%d")
        date_dir.mkdir(parents=True, exist_ok=True)

        safe_prefix = "".join(c for c in filename_prefix if c.isalnum() or c in ("-", "_"))
        target_file = date_dir / f"{safe_prefix}_{file_hash[:16]}.pdf"
        if not target_file.resolve().is_relative_to(self.evidence_dir.resolve()):
            raise StorageSecurityError("Resolved evidence path escapes the evidence directory.")

        with target_file.open("wb") as f:
            f.write(doc_bytes)

        relative_path = str(target_file.relative_to(self.base_dir)).replace("\\", "/")

        # Cloud sync notice PDF to Supabase Storage
        if self.supabase and self.supabase.is_configured:
            try:
                self.supabase.upload_file(relative_path, doc_bytes, content_type="application/pdf")
            except Exception:
                pass

        return relative_path, file_hash

    def resolve_absolute_path(self, relative_path: str) -> Path:
        """Resolves a stored relative path to its absolute filesystem location.
        If the file is missing locally (e.g. after container restart), automatically
        re-hydrates and restores it from Supabase Storage without 404 disruption.
        """
        clean_rel = relative_path.lstrip("/").replace("\\", "/")
        if clean_rel.startswith("storage/"):
            clean_rel = clean_rel[len("storage/"):]
        resolved = (self.base_dir / clean_rel).resolve()
        # Path traversal guard (Path comparison, not string prefix — a sibling
        # directory such as <base_dir>_external must not pass).
        if not resolved.is_relative_to(self.base_dir):
            raise StorageSecurityError("Illegal path traversal detected.")

        if not resolved.exists() and self.supabase and self.supabase.is_configured:
            try:
                cloud_bytes = self.supabase.download_file(clean_rel)
                if cloud_bytes:
                    resolved.parent.mkdir(parents=True, exist_ok=True)
                    with resolved.open("wb") as f:
                        f.write(cloud_bytes)
            except Exception:
                pass

        return resolved

    def get_file_path(self, relative_path: str) -> Path:
        """Alias for resolve_absolute_path."""
        return self.resolve_absolute_path(relative_path)

    def delete_file(self, relative_path: str) -> bool:
        """Permanently unlinks an evidence or upload file from both local storage and Supabase bucket."""
        if not relative_path:
            return False
        deleted = False
        try:
            clean_rel = relative_path.replace("\\", "/").lstrip("/")
            if clean_rel.startswith("storage/"):
                clean_rel = clean_rel[len("storage/"):]
            resolved = (self.base_dir / clean_rel).resolve()
            if resolved.exists() and resolved.is_file():
                resolved.unlink()
                deleted = True
        except Exception:
            pass

        # Also permanently delete from Supabase cloud storage bucket
        if self.supabase and self.supabase.is_configured:
            try:
                sb_deleted = self.supabase.delete_file(relative_path)
                if sb_deleted:
                    deleted = True
            except Exception:
                pass

        return deleted
