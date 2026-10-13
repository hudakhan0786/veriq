"""SQLAlchemy 2.0 Datastore & Cryptographic Audit Ledger (SIH26034 - Nirikshak)
Complete Relational DDL & Models conforming to 08_DATABASE_SPECIFICATION.md.
Dual-Engine compatibility: PostgreSQL 16+ (Mode A Server) & SQLite 3.45+ (Mode B Local).
"""

from datetime import datetime, timezone, timedelta
from enum import Enum
import hashlib
import json
import logging
import os
from pathlib import Path
from typing import Any, Dict, Generator, List, Optional, Tuple, Type
import uuid

logger = logging.getLogger("Nirikshak.database")

try:
    from dotenv import load_dotenv
    _db_dir = Path(__file__).resolve().parent
    _repo_root = _db_dir.parent.parent
    if (_repo_root / ".env").exists():
        load_dotenv(_repo_root / ".env")
    if (_repo_root / ".env.local").exists():
        load_dotenv(_repo_root / ".env.local", override=True)
    if (_db_dir.parent / ".env").exists():
        load_dotenv(_db_dir.parent / ".env", override=True)
    if (_db_dir.parent / ".env.local").exists():
        load_dotenv(_db_dir.parent / ".env.local", override=True)
    load_dotenv()
except Exception:
    pass

from sqlalchemy import (
    BigInteger,
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    create_engine,
    event,
    select,
)
from sqlalchemy.pool import QueuePool
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    Session,
    mapped_column,
    relationship,
    sessionmaker,
)


class RoleEnum(str, Enum):
    ADMIN = "ADMIN"
    CONTROLLER = "CONTROLLER"
    INSPECTOR = "INSPECTOR"
    VIEWER = "VIEWER"


class Base(DeclarativeBase):
    pass


class Jurisdiction(Base):
    __tablename__ = "jurisdictions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    state_code: Mapped[str] = mapped_column(String(10), nullable=False)  # 'DL', 'MH'
    district_name: Mapped[str] = mapped_column(String(100), nullable=False)
    zone: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    office_address: Mapped[str] = mapped_column(Text, nullable=False)
    contact_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        Index("idx_jurisdictions_state_district", "state_code", "district_name"),
    )


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    badge_number: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(150), nullable=False)
    role: Mapped[str] = mapped_column(String(30), nullable=False)  # 'INSPECTOR', 'CONTROLLER', 'DIRECTOR', 'ADMIN', 'VIEWER'
    jurisdiction_id: Mapped[Optional[str]] = mapped_column(String(64), ForeignKey("jurisdictions.id", ondelete="SET NULL"), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    last_login_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        Index("idx_users_role", "role"),
        Index("idx_users_badge", "badge_number"),
    )


class Inspection(Base):
    __tablename__ = "inspections"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    inspection_number: Mapped[str] = mapped_column(String(60), unique=True, nullable=False)  # 'INSP-YYYYMMDD-XXXX'
    officer_id: Mapped[str] = mapped_column(String(64), ForeignKey("users.id"), nullable=False)
    jurisdiction_id: Mapped[str] = mapped_column(String(64), ForeignKey("jurisdictions.id"), nullable=False)
    capture_source: Mapped[str] = mapped_column(String(30), nullable=False)  # 'PHYSICAL_FIELD', 'ECOMMERCE_URL', etc.
    product_name: Mapped[str] = mapped_column(String(255), nullable=False)
    brand_name: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    manufacturer_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    package_type: Mapped[str] = mapped_column(String(50), nullable=False)  # 'RECTANGULAR', 'CYLINDRICAL', 'FLEXIBLE_POUCH'
    declared_net_quantity: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    ecommerce_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    overall_status: Mapped[str] = mapped_column(String(20), nullable=False)  # 'PASS', 'FAIL', 'WARNING', 'PENDING_REVIEW'
    ai_verdict: Mapped[str] = mapped_column(String(20), nullable=False)  # 'PASS', 'FAIL', 'WARNING'
    adjudication_override: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    adjudication_officer_id: Mapped[Optional[str]] = mapped_column(String(64), ForeignKey("users.id"), nullable=True)
    adjudication_remarks: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    adjudication_timestamp: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    gps_latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    gps_longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    gps_altitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    clock_source: Mapped[str] = mapped_column(String(50), default="LOCAL_DEVICE_MONOTONIC", nullable=False)
    synced_to_central: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    device_fingerprint: Mapped[str] = mapped_column(String(255), nullable=False)
    inspection_timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        Index("idx_inspections_number", "inspection_number"),
        Index("idx_inspections_officer", "officer_id"),
        Index("idx_inspections_status", "overall_status"),
        Index("idx_inspections_timestamp", "inspection_timestamp"),
        Index("idx_inspections_jurisdiction_time", "jurisdiction_id", "inspection_timestamp"),
        Index("idx_inspections_category", "category"),
        Index("idx_inspections_jur_status", "jurisdiction_id", "overall_status"),
        Index("idx_inspections_prod_name", "product_name"),
    )


class EvidenceImage(Base):
    __tablename__ = "evidence_images"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    inspection_id: Mapped[str] = mapped_column(String(64), ForeignKey("inspections.id", ondelete="CASCADE"), nullable=False)
    panel_type: Mapped[str] = mapped_column(String(50), nullable=False)  # 'PDP_FRONT', 'BACK_LABEL', etc.
    file_path: Mapped[str] = mapped_column(Text, nullable=False)  # Relative filesystem path (NO BLOBs)
    raw_sha256: Mapped[str] = mapped_column(String(64), nullable=False)
    image_width: Mapped[int] = mapped_column(Integer, nullable=False)
    image_height: Mapped[int] = mapped_column(Integer, nullable=False)
    color_channels: Mapped[int] = mapped_column(Integer, default=3, nullable=False)
    calibration_method: Mapped[str] = mapped_column(String(50), nullable=False)
    calibration_reference_id: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    px_to_mm_scale: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    calibration_error_margin_pct: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    calibration_reference_box: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    blur_laplacian_variance: Mapped[float] = mapped_column(Float, nullable=False)
    glare_pixel_percentage: Mapped[float] = mapped_column(Float, nullable=False)
    perspective_skew_angle_deg: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        Index("idx_evidence_images_inspection", "inspection_id"),
        Index("idx_evidence_images_hash", "raw_sha256"),
        Index("idx_evidence_images_insp_panel", "inspection_id", "panel_type"),
    )


class BoundingBox(Base):
    __tablename__ = "bounding_boxes"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    image_id: Mapped[str] = mapped_column(String(64), ForeignKey("evidence_images.id", ondelete="CASCADE"), nullable=False)
    field_type: Mapped[str] = mapped_column(String(50), nullable=False)
    ymin_px: Mapped[int] = mapped_column(Integer, nullable=False)
    xmin_px: Mapped[int] = mapped_column(Integer, nullable=False)
    ymax_px: Mapped[int] = mapped_column(Integer, nullable=False)
    xmax_px: Mapped[int] = mapped_column(Integer, nullable=False)
    detection_confidence: Mapped[float] = mapped_column(Float, nullable=False)
    raw_ocr_text: Mapped[str] = mapped_column(Text, nullable=False)
    normalized_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    ocr_confidence: Mapped[float] = mapped_column(Float, nullable=False)
    measured_font_height_px: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    measured_font_height_mm: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    font_measurement_method: Mapped[str] = mapped_column(String(50), default="CONNECTED_COMPONENTS")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        Index("idx_bounding_boxes_image", "image_id"),
        Index("idx_bounding_boxes_field", "field_type"),
    )


class ComplianceEvaluation(Base):
    __tablename__ = "compliance_evaluations"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    inspection_id: Mapped[str] = mapped_column(String(64), ForeignKey("inspections.id", ondelete="CASCADE"), nullable=False)
    bounding_box_id: Mapped[Optional[str]] = mapped_column(String(64), ForeignKey("bounding_boxes.id", ondelete="SET NULL"), nullable=True)
    rule_code: Mapped[str] = mapped_column(String(50), nullable=False)
    rule_legal_citation: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False)  # 'PASS', 'FAIL', 'WARNING', 'NOT_APPLICABLE'
    severity: Mapped[str] = mapped_column(String(20), nullable=False)  # 'CRITICAL', 'MAJOR', 'MINOR'
    required_value: Mapped[str] = mapped_column(Text, nullable=False)
    measured_value: Mapped[str] = mapped_column(Text, nullable=False)
    discrepancy: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    penalty_provision: Mapped[str] = mapped_column(String(255), nullable=False)
    eval_timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        Index("idx_compliance_evals_inspection", "inspection_id"),
        Index("idx_compliance_evals_rule", "rule_code"),
        Index("idx_compliance_evals_status", "status"),
        Index("idx_compliance_evals_insp_status", "inspection_id", "status"),
    )


class BSACertificate(Base):
    __tablename__ = "bsa_certificates"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    certificate_number: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    inspection_id: Mapped[str] = mapped_column(String(64), ForeignKey("inspections.id"), unique=True, nullable=False)
    issuing_officer_id: Mapped[str] = mapped_column(String(64), ForeignKey("users.id"), nullable=False)
    statutory_law_ref: Mapped[str] = mapped_column(String(100), default="Section 63 of Bharatiya Sakshya Adhiniyam, 2023", nullable=False)
    device_make_model: Mapped[str] = mapped_column(String(150), nullable=False)
    device_serial_mac: Mapped[str] = mapped_column(String(150), nullable=False)
    operating_system: Mapped[str] = mapped_column(String(100), nullable=False)
    hash_algorithm: Mapped[str] = mapped_column(String(30), default="SHA-256", nullable=False)
    raw_images_merkle_root: Mapped[str] = mapped_column(String(64), nullable=False)
    evidence_bundle_sha256: Mapped[str] = mapped_column(String(64), nullable=False)
    officer_digital_signature: Mapped[str] = mapped_column(Text, nullable=False)
    certificate_pdf_path: Mapped[str] = mapped_column(Text, nullable=False)
    generated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        Index("idx_bsa_cert_inspection", "inspection_id"),
        Index("idx_bsa_cert_number", "certificate_number"),
    )


class LegalNotice(Base):
    __tablename__ = "legal_notices"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    notice_reference_number: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    inspection_id: Mapped[str] = mapped_column(String(64), ForeignKey("inspections.id"), nullable=False)
    bsa_certificate_id: Mapped[str] = mapped_column(String(64), ForeignKey("bsa_certificates.id"), nullable=False)
    issuing_officer_id: Mapped[str] = mapped_column(String(64), ForeignKey("users.id"), nullable=False)
    recipient_type: Mapped[str] = mapped_column(String(50), nullable=False)
    recipient_name: Mapped[str] = mapped_column(String(255), nullable=False)
    recipient_registered_address: Mapped[str] = mapped_column(Text, nullable=False)
    recipient_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    statutory_section: Mapped[str] = mapped_column(String(100), default="Section 36(1) of Legal Metrology Act, 2009", nullable=False)
    violations_summary: Mapped[str] = mapped_column(Text, nullable=False)
    compounding_fee_amount: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    reply_window_days: Mapped[int] = mapped_column(Integer, default=15, nullable=False)
    notice_dispatch_status: Mapped[str] = mapped_column(String(30), default="DRAFT", nullable=False)  # 'DRAFT', 'SIGNED', etc.
    generated_pdf_path: Mapped[str] = mapped_column(Text, nullable=False)
    dispatched_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        Index("idx_legal_notices_ref", "notice_reference_number"),
        Index("idx_legal_notices_inspection", "inspection_id"),
        Index("idx_legal_notices_status", "notice_dispatch_status"),
    )


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    sequence_number: Mapped[int] = mapped_column(Integer, unique=True, nullable=False)
    actor_id: Mapped[str] = mapped_column(String(64), ForeignKey("users.id"), nullable=False)
    action_type: Mapped[str] = mapped_column(String(50), nullable=False)
    entity_type: Mapped[str] = mapped_column(String(50), nullable=False)
    entity_id: Mapped[str] = mapped_column(String(64), nullable=False)
    payload_json: Mapped[str] = mapped_column(Text, nullable=False)
    previous_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    entry_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        Index("idx_audit_logs_seq", "sequence_number"),
        Index("idx_audit_logs_actor", "actor_id"),
        Index("idx_audit_logs_entity", "entity_type", "entity_id"),
    )


class AuditLedgerService:
    """Appends cryptographically chained audit log events (ADR-09, 08_DATABASE_SPECIFICATION.md)."""

    GENESIS_HASH = "0" * 64

    @classmethod
    def compute_entry_hash(
        cls,
        sequence_number: int,
        actor_id: str,
        action_type: str,
        payload_json: str,
        previous_hash: str,
    ) -> str:
        raw_msg = f"{sequence_number}:{actor_id}:{action_type}:{payload_json}:{previous_hash}"
        return hashlib.sha256(raw_msg.encode("utf-8")).hexdigest()

    @classmethod
    def record_action(
        cls,
        session: Session,
        actor_id: str,
        action_type: str,
        entity_type: str,
        entity_id: str,
        payload: Dict[str, Any],
    ) -> AuditLog:
        """Appends an event to the audit ledger, maintaining the SHA-256 chain."""
        last_entry = session.execute(
            select(AuditLog).order_by(AuditLog.sequence_number.desc()).limit(1)
        ).scalar_one_or_none()

        if last_entry is None:
            seq = 1
            prev_hash = cls.GENESIS_HASH
        else:
            seq = last_entry.sequence_number + 1
            prev_hash = last_entry.entry_hash

        payload_str = json.dumps(payload, sort_keys=True, separators=(",", ":"))
        entry_hash = cls.compute_entry_hash(seq, actor_id, action_type, payload_str, prev_hash)

        audit_entry = AuditLog(
            id=str(uuid.uuid4()),
            sequence_number=seq,
            actor_id=actor_id,
            action_type=action_type,
            entity_type=entity_type,
            entity_id=entity_id,
            payload_json=payload_str,
            previous_hash=prev_hash,
            entry_hash=entry_hash,
            created_at=datetime.now(timezone.utc),
        )
        session.add(audit_entry)
        session.flush()
        return audit_entry

    @classmethod
    def append_audit_entry(
        cls,
        session: Session,
        actor_id: str,
        action_type: str,
        payload_dict: Dict[str, Any],
        entity_type: str = "SYSTEM",
        entity_id: str = "GLOBAL",
        device_fingerprint: Optional[str] = None,
    ) -> AuditLog:
        """Convenience method for appending audit records with optional device fingerprint."""
        payload = dict(payload_dict)
        if device_fingerprint:
            payload["device_fingerprint"] = device_fingerprint
        return cls.record_action(
            session=session,
            actor_id=actor_id,
            action_type=action_type,
            entity_type=entity_type,
            entity_id=entity_id,
            payload=payload,
        )


    @classmethod
    def verify_audit_chain(cls, session: Session) -> Tuple[bool, Optional[int]]:
        """Verifies the unbroken cryptographic integrity of the entire audit trail."""
        entries = session.execute(select(AuditLog).order_by(AuditLog.sequence_number.asc())).scalars().all()
        if not entries:
            return True, None

        prev_hash = cls.GENESIS_HASH
        for entry in entries:
            expected_hash = cls.compute_entry_hash(
                entry.sequence_number,
                entry.actor_id,
                entry.action_type,
                entry.payload_json,
                entry.previous_hash,
            )
            if entry.previous_hash != prev_hash or entry.entry_hash != expected_hash:
                return False, entry.sequence_number
            prev_hash = entry.entry_hash

        return True, None


_global_engines: Dict[str, Any] = {}


def get_database_engine(url: Optional[str] = None):
    """Creates or returns a singleton pooled SQLAlchemy engine supporting SQLite and PostgreSQL.
    Configures high-throughput connection pooling (ADR-09) and SQLite concurrency PRAGMAs (WAL mode).
    """
    global _global_engines
    db_url = url or os.getenv("DATABASE_URL", "sqlite:///legal_metrology.db")
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    if db_url in _global_engines:
        return _global_engines[db_url]

    is_sqlite = "sqlite" in db_url
    if is_sqlite:
        connect_args = {"check_same_thread": False, "timeout": 30}
        engine = create_engine(
            db_url,
            connect_args=connect_args,
            poolclass=QueuePool,
            pool_size=10,
            max_overflow=20,
            pool_pre_ping=True,
            echo=False,
        )

        @event.listens_for(engine, "connect")
        def set_sqlite_pragma(dbapi_connection, connection_record):
            cursor = dbapi_connection.cursor()
            try:
                cursor.execute("PRAGMA journal_mode = WAL;")
                cursor.execute("PRAGMA synchronous = NORMAL;")
                cursor.execute("PRAGMA cache_size = -64000;")  # 64MB memory page cache
                cursor.execute("PRAGMA temp_store = MEMORY;")
                cursor.execute("PRAGMA busy_timeout = 5000;")
            finally:
                cursor.close()
    else:
        engine = create_engine(
            db_url,
            pool_size=20,
            max_overflow=10,
            pool_pre_ping=True,
            pool_recycle=3600,
            echo=False,
        )

    _global_engines[db_url] = engine
    return engine


def migrate_database_schema(engine_or_conn):
    """Executes idempotent schema migrations and database indexing across PostgreSQL and SQLite."""
    index_statements = [
        "CREATE INDEX IF NOT EXISTS idx_inspections_category ON inspections (category);",
        "CREATE INDEX IF NOT EXISTS idx_inspections_jur_status ON inspections (jurisdiction_id, overall_status);",
        "CREATE INDEX IF NOT EXISTS idx_inspections_prod_name ON inspections (product_name);",
        "CREATE INDEX IF NOT EXISTS idx_compliance_evals_insp_status ON compliance_evaluations (inspection_id, status);",
        "CREATE INDEX IF NOT EXISTS idx_evidence_images_insp_panel ON evidence_images (inspection_id, panel_type);",
    ]

    try:
        if hasattr(engine_or_conn, "exec_driver_sql"):
            conn = engine_or_conn
            dialect_name = getattr(conn.dialect, "name", "").lower()
            if "postgres" in dialect_name or "psycopg" in dialect_name:
                conn.exec_driver_sql("ALTER TABLE evidence_images ADD COLUMN IF NOT EXISTS calibration_reference_box TEXT;")
                conn.exec_driver_sql("ALTER TABLE inspections ADD COLUMN IF NOT EXISTS declared_net_quantity VARCHAR(100);")
            else:
                cols = [row[1] for row in conn.exec_driver_sql("PRAGMA table_info(evidence_images)").fetchall()]
                if cols and "calibration_reference_box" not in cols:
                    conn.exec_driver_sql("ALTER TABLE evidence_images ADD COLUMN calibration_reference_box TEXT;")
                insp_cols = [row[1] for row in conn.exec_driver_sql("PRAGMA table_info(inspections)").fetchall()]
                if insp_cols and "declared_net_quantity" not in insp_cols:
                    conn.exec_driver_sql("ALTER TABLE inspections ADD COLUMN declared_net_quantity VARCHAR(100);")
            for idx_stmt in index_statements:
                try:
                    conn.exec_driver_sql(idx_stmt)
                except Exception:
                    pass
            conn.commit()
        elif hasattr(engine_or_conn, "connect"):
            with engine_or_conn.connect() as conn:
                dialect_name = getattr(engine_or_conn.dialect, "name", "").lower()
                if "postgres" in dialect_name or "psycopg" in dialect_name:
                    conn.exec_driver_sql("ALTER TABLE evidence_images ADD COLUMN IF NOT EXISTS calibration_reference_box TEXT;")
                    conn.exec_driver_sql("ALTER TABLE inspections ADD COLUMN IF NOT EXISTS declared_net_quantity VARCHAR(100);")
                else:
                    cols = [row[1] for row in conn.exec_driver_sql("PRAGMA table_info(evidence_images)").fetchall()]
                    if cols and "calibration_reference_box" not in cols:
                        conn.exec_driver_sql("ALTER TABLE evidence_images ADD COLUMN calibration_reference_box TEXT;")
                    insp_cols = [row[1] for row in conn.exec_driver_sql("PRAGMA table_info(inspections)").fetchall()]
                    if insp_cols and "declared_net_quantity" not in insp_cols:
                        conn.exec_driver_sql("ALTER TABLE inspections ADD COLUMN declared_net_quantity VARCHAR(100);")
                for idx_stmt in index_statements:
                    try:
                        conn.exec_driver_sql(idx_stmt)
                    except Exception:
                        pass
                conn.commit()
    except Exception as exc:
        logger.warning(f"Database schema migration warning: {exc}")


def init_database(engine):
    """Initializes all database tables and ensures schema migrations."""
    Base.metadata.create_all(bind=engine)
    migrate_database_schema(engine)


def seed_default_platform_data(session: Session):
    """Seeds default jurisdiction circle and administrative accounts if database is fresh."""
    default_jurisdictions = [
        ("CIRCLE_DL_SOUTH_01", "DL", "South Delhi", "South Zone", "Office of the Assistant Controller of Legal Metrology, South Zone, Pushp Vihar, New Delhi - 110017", "aclm.south@dl.gov.in"),
        ("CIRCLE_DL_CENTRAL_02", "DL", "Central Delhi", "Central Zone", "Office of ACLM, Central Zone, Connaught Place, New Delhi - 110001", "aclm.central@dl.gov.in"),
        ("CIRCLE_UP_GBN_01", "UP", "Gautam Buddha Nagar", "Western Zone", "Collectorate Complex, Surajpur, Greater Noida, UP - 201306", "aclm.gbn@up.gov.in"),
        ("CIRCLE_MH_MUM_01", "MH", "Mumbai Suburban", "Konkan Division", "Old Secretariat Annex, Fort, Mumbai, MH - 400032", "aclm.mumbai@mh.gov.in"),
        ("CIRCLE_KA_BLR_01", "KA", "Bengaluru Urban", "Bengaluru Division", "Khandaya Bhavana, KG Road, Bengaluru, KA - 560009", "aclm.blr@ka.gov.in"),
    ]
    for jur_id, st, dist, zn, addr, email in default_jurisdictions:
        exists = session.execute(select(Jurisdiction).where(Jurisdiction.id == jur_id)).first()
        if not exists:
            session.add(Jurisdiction(
                id=jur_id,
                state_code=st,
                district_name=dist,
                zone=zn,
                office_address=addr,
                contact_email=email,
            ))
    session.flush()

    existing_user = session.execute(select(User)).first()
    if not existing_user:
        # Default pass: 'Officer@2026' -> hashed via hash_password('Officer@2026', salt_bytes=b'nirikshak_salt')
        pwd_hash = "pbkdf2_sha256$100000$6e79617961647269736874695f73616c74$037d6171d6dbc02d8740de592b43fb7c38f1844d238b1d719295a7900fcedd81"

        users = [
            User(
                id="usr_admin_01",
                username="admin_central",
                email="admin@doca.gov.in",
                password_hash=pwd_hash,
                badge_number="ADMIN-DOCA-0001",
                full_name="Dr. Alok Verma",
                role="ADMIN",
                jurisdiction_id="CIRCLE_DL_SOUTH_01",
            ),
            User(
                id="usr_ctrl_01",
                username="controller_south",
                email="controller.south@dl.gov.in",
                password_hash=pwd_hash,
                badge_number="CTRL-DL-0101",
                full_name="Sunita Deshmukh",
                role="CONTROLLER",
                jurisdiction_id="CIRCLE_DL_SOUTH_01",
            ),
            User(
                id="usr_01_rajesh",
                username="inspector_rajesh",
                email="rajesh.sharma@dl.gov.in",
                password_hash=pwd_hash,
                badge_number="INSP-DL-0842",
                full_name="Rajesh Sharma",
                role="INSPECTOR",
                jurisdiction_id="CIRCLE_DL_SOUTH_01",
            ),
            User(
                id="usr_viewer_01",
                username="viewer_analyst",
                email="analyst@doca.gov.in",
                password_hash=pwd_hash,
                badge_number="VIEW-DOCA-0042",
                full_name="Kavita Iyer",
                role="VIEWER",
                jurisdiction_id="CIRCLE_DL_SOUTH_01",
            ),
        ]
        session.add_all(users)
        session.commit()

    existing_insp = session.execute(select(Inspection)).first()
    if not existing_insp:
        now_utc = datetime.now(timezone.utc)
        golden_inspections = [
            Inspection(
                id="insp_demo_01_biscuit",
                inspection_number="INSP-20260910-B144",
                officer_id="usr_01_rajesh",
                jurisdiction_id="CIRCLE_DL_SOUTH_01",
                capture_source="PHYSICAL_FIELD",
                product_name="Premium Butter Cookies 200g",
                brand_name="Sunfeast Bakery",
                manufacturer_name="Sunfeast Foods India Pvt Ltd",
                category="FOOD_SNACKS",
                package_type="RECTANGULAR",
                overall_status="FAIL",
                ai_verdict="FAIL",
                device_fingerprint="WEB-SPA-CLIENT-OFFICER-WORKSTATION",
                inspection_timestamp=now_utc - timedelta(hours=2),
                created_at=now_utc - timedelta(hours=2),
            ),
            Inspection(
                id="insp_demo_02_curry",
                inspection_number="INSP-20260910-C202",
                officer_id="usr_01_rajesh",
                jurisdiction_id="CIRCLE_DL_SOUTH_01",
                capture_source="PHYSICAL_FIELD",
                product_name="Ready Curry Pouch 300g",
                brand_name="Haldiram's Minute Khana",
                manufacturer_name="Haldiram Snacks Pvt Ltd",
                category="FOOD_SNACKS",
                package_type="FLEXIBLE_POUCH",
                overall_status="FAIL",
                ai_verdict="FAIL",
                device_fingerprint="WEB-SPA-CLIENT-OFFICER-WORKSTATION",
                inspection_timestamp=now_utc - timedelta(hours=4),
                created_at=now_utc - timedelta(hours=4),
            ),
            Inspection(
                id="insp_demo_03_water",
                inspection_number="INSP-20260910-W303",
                officer_id="usr_01_rajesh",
                jurisdiction_id="CIRCLE_DL_SOUTH_01",
                capture_source="PHYSICAL_FIELD",
                product_name="Packaged Drinking Water 1000ml",
                brand_name="Bisleri Vedica",
                manufacturer_name="Bisleri International Pvt Ltd",
                category="FOOD_SNACKS",
                package_type="CYLINDRICAL",
                overall_status="PASS",
                ai_verdict="PASS",
                device_fingerprint="WEB-SPA-CLIENT-OFFICER-WORKSTATION",
                inspection_timestamp=now_utc - timedelta(hours=6),
                created_at=now_utc - timedelta(hours=6),
            ),
            Inspection(
                id="insp_demo_04_soap",
                inspection_number="INSP-20260910-S404",
                officer_id="usr_01_rajesh",
                jurisdiction_id="CIRCLE_DL_SOUTH_01",
                capture_source="PHYSICAL_FIELD",
                product_name="Herbal Bath Soap 125g",
                brand_name="Medimix Ayurvedic",
                manufacturer_name="Cholayil Pvt Ltd",
                category="COSMETICS_TOILETRIES",
                package_type="RECTANGULAR",
                overall_status="REVIEW",
                ai_verdict="REVIEW",
                device_fingerprint="WEB-SPA-CLIENT-OFFICER-WORKSTATION",
                inspection_timestamp=now_utc - timedelta(hours=8),
                created_at=now_utc - timedelta(hours=8),
            ),
            Inspection(
                id="insp_demo_05_chips",
                inspection_number="INSP-20260910-P505",
                officer_id="usr_01_rajesh",
                jurisdiction_id="CIRCLE_DL_SOUTH_01",
                capture_source="PHYSICAL_FIELD",
                product_name="Potato Chips Pouch 75g",
                brand_name="Lay's Classic Salted",
                manufacturer_name="PepsiCo India Holdings Pvt Ltd",
                category="FOOD_SNACKS",
                package_type="FLEXIBLE_POUCH",
                overall_status="UNABLE_TO_VERIFY",
                ai_verdict="UNABLE_TO_VERIFY",
                device_fingerprint="WEB-SPA-CLIENT-OFFICER-WORKSTATION",
                inspection_timestamp=now_utc - timedelta(hours=10),
                created_at=now_utc - timedelta(hours=10),
            ),
            Inspection(
                id="insp_demo_06_ecom",
                inspection_number="INSP-20260910-E606",
                officer_id="usr_01_rajesh",
                jurisdiction_id="CIRCLE_DL_SOUTH_01",
                capture_source="ECOMMERCE_URL",
                ecommerce_url="https://blinkit.com/prn/wagh-bakri-tea-500g/prid/148201",
                product_name="Premium Assam Tea 500g",
                brand_name="Wagh Bakri Tea",
                manufacturer_name="Gujarat Tea Processors and Packers Ltd",
                category="FOOD_SNACKS",
                package_type="RECTANGULAR",
                overall_status="FAIL",
                ai_verdict="FAIL",
                device_fingerprint="WEB-SPA-CLIENT-OFFICER-WORKSTATION",
                inspection_timestamp=now_utc - timedelta(hours=12),
                created_at=now_utc - timedelta(hours=12),
            ),
        ]
        session.add_all(golden_inspections)
        session.flush()

        evals = [
            ComplianceEvaluation(
                id="eval_demo_01_font",
                inspection_id="insp_demo_01_biscuit",
                rule_code="RULE_06_1_H_NET_QTY_FONT",
                rule_legal_citation="Rule 6(1)(h) read with Table-I, G.S.R. 629(E)",
                status="FAIL",
                severity="CRITICAL",
                required_value="Minimum font height 2.50 mm (PDP 144 cm2)",
                measured_value="Measured font height 1.84 mm",
                discrepancy="Deficit of 0.66 mm below statutory minimum height",
                penalty_provision="Section 36(1) of Legal Metrology Act, 2009",
            ),
            ComplianceEvaluation(
                id="eval_demo_01_unit",
                inspection_id="insp_demo_01_biscuit",
                rule_code="SECTION_11_RULE_12_PROHIBITED_UNITS",
                rule_legal_citation="Section 11 LM Act 2009 read with Rule 12 LMPC Rules 2011",
                status="FAIL",
                severity="MAJOR",
                required_value="Standard SI unit symbol 'g'",
                measured_value="Prohibited non-standard unit 'gms'",
                discrepancy="Use of banned non-SI unit symbol 'gms'",
                penalty_provision="Section 29 of Legal Metrology Act, 2009",
            ),
            ComplianceEvaluation(
                id="eval_demo_02_usp",
                inspection_id="insp_demo_02_curry",
                rule_code="RULE_06_1_E_UNIT_SALE_PRICE",
                rule_legal_citation="Rule 6(1)(e) read with Second Proviso LMPC Rules 2011",
                status="FAIL",
                severity="CRITICAL",
                required_value="Unit Sale Price Rs. 0.23 / g (MRP Rs. 70.00 / 300g)",
                measured_value="Declared Unit Sale Price Rs. 0.28 / g",
                discrepancy="Unit Sale Price mathematical inconsistency of Rs. 0.05 / g",
                penalty_provision="Section 36(1) of Legal Metrology Act, 2009",
            ),
            ComplianceEvaluation(
                id="eval_demo_03_comp",
                inspection_id="insp_demo_03_water",
                rule_code="RULE_06_MANDATORY_DECLARATIONS",
                rule_legal_citation="Rule 6(1) and Table-I LMPC Rules 2011",
                status="PASS",
                severity="MINOR",
                required_value="Full statutory compliance under Rule 6 and Table-I",
                measured_value="Font 4.10 mm >= 4.00 mm req, standard SI unit 'ml', USP valid",
                discrepancy="None - fully compliant",
                penalty_provision="None",
            ),
            ComplianceEvaluation(
                id="eval_demo_04_band",
                inspection_id="insp_demo_04_soap",
                rule_code="RULE_06_1_H_NET_QTY_FONT",
                rule_legal_citation="Rule 6(1)(h) read with Table-I, G.S.R. 629(E)",
                status="REVIEW",
                severity="MAJOR",
                required_value="Minimum font height 2.50 mm (PDP 120 cm2)",
                measured_value="Measured font height 2.46 mm (k=2 expanded uncertainty +/-0.08 mm)",
                discrepancy="Measurement inside 95% sensor uncertainty band [2.38 - 2.54 mm]",
                penalty_provision="Requires Physical Caliper Retest under Rule 24",
            ),
            ComplianceEvaluation(
                id="eval_demo_05_glare",
                inspection_id="insp_demo_05_chips",
                rule_code="OPTICAL_QUALITY_GATE",
                rule_legal_citation="Section 63 of Bharatiya Sakshya Adhiniyam, 2023",
                status="UNABLE_TO_VERIFY",
                severity="CRITICAL",
                required_value="Specular Glare Bloom <= 3.0%",
                measured_value="Specular Glare Bloom 6.4% on flexible packaging surface",
                discrepancy="Optical specular bloom exceeds digital evidence gate threshold",
                penalty_provision="Statutory Retake Required - evidence inadmissible under Section 63 BSA",
            ),
            ComplianceEvaluation(
                id="eval_demo_06_origin",
                inspection_id="insp_demo_06_ecom",
                rule_code="RULE_06_10_ECOMMERCE_DECLARATIONS",
                rule_legal_citation="Rule 6(10) LMPC Rules 2011 read with G.S.R. 594(E)",
                status="FAIL",
                severity="CRITICAL",
                required_value="Country of Origin must be displayed on digital marketplace listing",
                measured_value="Digital listing omits Country of Origin declaration",
                discrepancy="Missing mandatory Country of Origin attribute on e-commerce product page",
                penalty_provision="Section 36(1) read with Rule 6(10) LMPC Rules, 2011",
            ),
        ]
        session.add_all(evals)

        images = [
            EvidenceImage(
                id="img_demo_01",
                inspection_id="insp_demo_01_biscuit",
                panel_type="PDP_FRONT",
                file_path="/storage/uploads/sku_demo_01_biscuit.jpg",
                raw_sha256="a3f5e1b2c4d6879012345678abcdef0123456789abcdef0123456789abcdef01",
                image_width=1920,
                image_height=1080,
                calibration_method="ARUCO_4X4_50",
                blur_laplacian_variance=312.4,
                glare_pixel_percentage=1.1,
            ),
            EvidenceImage(
                id="img_demo_02",
                inspection_id="insp_demo_02_curry",
                panel_type="PDP_FRONT",
                file_path="/storage/uploads/sku_demo_02_curry.jpg",
                raw_sha256="b4c6e2f3d5a7980123456789bcdef0123456789abcdef0123456789abcdef02",
                image_width=1920,
                image_height=1080,
                calibration_method="ARUCO_4X4_50",
                blur_laplacian_variance=285.6,
                glare_pixel_percentage=1.4,
            ),
            EvidenceImage(
                id="img_demo_03",
                inspection_id="insp_demo_03_water",
                panel_type="PDP_FRONT",
                file_path="/storage/uploads/sku_demo_03_water.jpg",
                raw_sha256="c5d7f3a4e6b8091234567890cdef0123456789abcdef0123456789abcdef03",
                image_width=1920,
                image_height=1080,
                calibration_method="ARUCO_4X4_50",
                blur_laplacian_variance=420.1,
                glare_pixel_percentage=0.8,
            ),
            EvidenceImage(
                id="img_demo_04",
                inspection_id="insp_demo_04_soap",
                panel_type="PDP_FRONT",
                file_path="/storage/uploads/sku_demo_04_soap.jpg",
                raw_sha256="d6e8a4b5f7c9102345678901def0123456789abcdef0123456789abcdef04",
                image_width=1920,
                image_height=1080,
                calibration_method="ARUCO_4X4_50",
                blur_laplacian_variance=298.3,
                glare_pixel_percentage=1.7,
            ),
            EvidenceImage(
                id="img_demo_05",
                inspection_id="insp_demo_05_chips",
                panel_type="PDP_FRONT",
                file_path="/storage/uploads/sku_demo_05_chips.jpg",
                raw_sha256="e7f9b5c6a8d0213456789012ef0123456789abcdef0123456789abcdef05",
                image_width=1920,
                image_height=1080,
                calibration_method="ARUCO_4X4_50",
                blur_laplacian_variance=142.0,
                glare_pixel_percentage=6.4,
            ),
            EvidenceImage(
                id="img_demo_06",
                inspection_id="insp_demo_06_ecom",
                panel_type="PDP_FRONT",
                file_path="/storage/uploads/sku_demo_06_listing.png",
                raw_sha256="f8a0c6d7b9e1324567890123f0123456789abcdef0123456789abcdef06",
                image_width=1200,
                image_height=1600,
                calibration_method="DIGITAL_SCREEN_METRIC",
                blur_laplacian_variance=650.0,
                glare_pixel_percentage=0.0,
            ),
        ]
        session.add_all(images)
        session.commit()


_default_engine = None
_default_sessionmaker = None


def get_session_factory(engine=None):
    """Returns a singleton or configured sessionmaker instance."""
    global _default_engine, _default_sessionmaker
    if engine is not None:
        return sessionmaker(bind=engine, autoflush=False, autocommit=False)
    if _default_sessionmaker is None:
        if _default_engine is None:
            _default_engine = get_database_engine()
        _default_sessionmaker = sessionmaker(bind=_default_engine, autoflush=False, autocommit=False)
    return _default_sessionmaker


def get_db_session() -> Generator[Session, None, None]:
    """FastAPI dependency yielding a managed transactional database session."""
    factory = get_session_factory()
    session = factory()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()

