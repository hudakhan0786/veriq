"""Evidence & Cryptographic Dossier Interface Contract (SIH26034 - Nirikshak)
Section 63 Bharatiya Sakshya Adhiniyam, 2023 (BSA 2023) Electronic Evidence Certificate
SHA-256 Merkle DAG Chain of Custody and Form-1 Legal Notice Bundling
Frozen per 07_API_AND_INTERFACE_CONTRACTS.md, 08_DATABASE_SPECIFICATION.md, 10_SECURITY_AND_AUDIT_SPECIFICATION.md
"""

from typing import Any, Dict, List, Literal, Optional
from pydantic import BaseModel, Field


class MerkleNodeDTO(BaseModel):
    stage_name: str = Field(..., description="Pipeline stage (RAW_IMAGE, QUALITY_GATE, CALIBRATION, OCR, EXTRACTION, RULES, ADJUDICATION)")
    payload_sha256: str = Field(..., min_length=64, max_length=64, description="SHA-256 digest of stage payload")
    timestamp_utc: str = Field(..., description="ISO 8601 UTC timestamp")
    metadata: Dict[str, Any] = Field(default_factory=dict)


class Section63CertificateDTO(BaseModel):
    certificate_number: str = Field(..., description="CERT-BSA2023-YYYYMMDD-XXXX format")
    inspection_id: str
    statutory_law_ref: str = Field(
        "Section 63 of Bharatiya Sakshya Adhiniyam, 2023",
        description="Statutory basis for electronic records admissibility"
    )
    device_model: str = Field(..., description="Device make and hardware model")
    operating_system: str = Field(..., description="Operating system release")
    clock_source: Literal["LOCAL_DEVICE_MONOTONIC", "NTP_SYNCHRONIZED", "MANUAL_DECLARED"] = Field(
        "LOCAL_DEVICE_MONOTONIC"
    )
    raw_images_merkle_root: str = Field(..., min_length=64, max_length=64)
    evidence_bundle_sha256: str = Field(..., min_length=64, max_length=64)
    issuing_officer_id: str
    issuing_officer_name: str
    officer_signature_token: str
    generated_at: str


class LegalNoticeRecipientDTO(BaseModel):
    recipient_type: Literal["MANUFACTURER", "PACKER", "IMPORTER", "ECOMMERCE_PLATFORM", "SELLER"]
    name: str
    registered_address: str
    email: Optional[str] = None


class LegalNoticeDTO(BaseModel):
    notice_reference_number: str = Field(..., description="e.g. LMO/DL/SOUTH/2026/0842")
    inspection_id: str
    bsa_certificate_number: str
    recipient: LegalNoticeRecipientDTO
    statutory_mandate: str = Field(
        "Legal Metrology (Packaged Commodities) Rules, 2011 read with Section 36(1) of Legal Metrology Act, 2009 and Section 63 BSA 2023"
    )
    violations_summary: List[str]
    compounding_fee_amount: float = Field(..., ge=0.0, description="Compounding fee under Section 48 LM Act")
    reply_window_days: int = Field(15, ge=7, le=30, description="Statutory response window")
    pdf_path: Optional[str] = Field(None, description="Filesystem location of generated PDF/A")
    merkle_entry_hash: str = Field(..., min_length=64, max_length=64)


class BSAEvidenceBundleDTO(BaseModel):
    inspection_id: str
    raw_image_sha256: str = Field(..., min_length=64, max_length=64)
    merkle_nodes: List[MerkleNodeDTO]
    merkle_root: str = Field(..., min_length=64, max_length=64)
    bsa_certificate: Section63CertificateDTO
    notice: Optional[LegalNoticeDTO] = None
