"""Section 63 Bharatiya Sakshya Adhiniyam, 2023 (BSA 2023) Electronic Evidence Certificate Generator
Produces legally admissible digital evidence bundles and cryptographically attested certificates.
Frozen per 05_TECHNOLOGY_DECISION_RECORD.md (ADR-10), 10_SECURITY_AND_AUDIT_SPECIFICATION.md, and 16_DECISION_LOG.md (ADL-02, ADL-14, ADL-15, ADL-16)
"""

from datetime import datetime, timezone
import hashlib
import hmac
import os
import platform
from typing import Any, Dict, List, Literal, Optional, Tuple

# Import shared frozen contracts
try:
    from backend.contracts.evidence.evidence_dto import (
        BSAEvidenceBundleDTO,
        MerkleNodeDTO,
        Section63CertificateDTO,
    )
except ImportError:
    import sys
    from pathlib import Path
    REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
    if str(REPO_ROOT) not in sys.path:
        sys.path.insert(0, str(REPO_ROOT))
    from backend.contracts.evidence.evidence_dto import (
        BSAEvidenceBundleDTO,
        MerkleNodeDTO,
        Section63CertificateDTO,
    )

try:
    from merkle_dag import MerkleAuditLedger, PipelineEvidenceDAG
except ImportError:
    from .merkle_dag import MerkleAuditLedger, PipelineEvidenceDAG


class Section63CertificateGenerator:
    """Generates Section 63 BSA 2023 Electronic Evidence Certificates and Evidence Bundles."""

    DEFAULT_STATUTORY_REF = "Section 63 of Bharatiya Sakshya Adhiniyam, 2023"

    @staticmethod
    def generate_certificate_number(inspection_id: str, timestamp_utc: Optional[datetime] = None) -> str:
        """Generates canonical certificate number format: CERT-BSA2023-YYYYMMDD-XXXX."""
        if timestamp_utc is None:
            timestamp_utc = datetime.now(timezone.utc)
        date_str = timestamp_utc.strftime("%Y%m%d")
        short_id = hashlib.sha256(inspection_id.encode("utf-8")).hexdigest()[:4].upper()
        return f"CERT-BSA2023-{date_str}-{short_id}"

    @staticmethod
    def compute_officer_signature_token(
        officer_id: str,
        merkle_root: str,
        secret_key: Optional[str] = None
    ) -> str:
        """Derives cryptographic signature token for officer attestation (ADL-16)."""
        key = (secret_key or os.getenv("OFFICER_SIGNING_KEY", "Nirikshak-Officer-Attestation-Key")).encode("utf-8")
        message = f"{officer_id}:{merkle_root}".encode("utf-8")
        return hmac.new(key, message, hashlib.sha256).hexdigest()

    @staticmethod
    def resolve_device_telemetry(
        device_model: Optional[str] = None,
        operating_system: Optional[str] = None,
    ) -> Tuple[str, str]:
        """Resolves device model and OS dynamically without hardcoding."""
        if not device_model or not device_model.strip():
            proc = platform.processor() or platform.machine()
            sys_name = platform.system()
            device_model = f"{sys_name} Workstation ({proc})" if proc else f"{sys_name} Workstation"
        if not operating_system or not operating_system.strip():
            operating_system = platform.platform() or f"{platform.system()} {platform.release()}"
        return device_model, operating_system

    @classmethod
    def create_certificate(
        cls,
        inspection_id: str,
        merkle_root: str,
        evidence_bundle_sha256: str,
        issuing_officer_id: str,
        issuing_officer_name: str,
        device_model: Optional[str] = None,
        operating_system: Optional[str] = None,
        clock_source: Literal["LOCAL_DEVICE_MONOTONIC", "NTP_SYNCHRONIZED", "MANUAL_DECLARED"] = "LOCAL_DEVICE_MONOTONIC",
        timestamp_utc: Optional[datetime] = None,
        signing_key: Optional[str] = None,
    ) -> Section63CertificateDTO:
        """Constructs and returns validated Section63CertificateDTO with dynamic device telemetry."""
        if timestamp_utc is None:
            timestamp_utc = datetime.now(timezone.utc)

        resolved_model, resolved_os = cls.resolve_device_telemetry(device_model, operating_system)
        cert_number = cls.generate_certificate_number(inspection_id, timestamp_utc)
        sig_token = cls.compute_officer_signature_token(issuing_officer_id, merkle_root, signing_key)

        valid_clock_sources = {"LOCAL_DEVICE_MONOTONIC", "NTP_SYNCHRONIZED", "MANUAL_DECLARED"}
        clean_clock_source = clock_source if clock_source in valid_clock_sources else "LOCAL_DEVICE_MONOTONIC"

        return Section63CertificateDTO(
            certificate_number=cert_number,
            inspection_id=inspection_id,
            statutory_law_ref=cls.DEFAULT_STATUTORY_REF,
            device_model=resolved_model,
            operating_system=resolved_os,
            clock_source=clean_clock_source,
            raw_images_merkle_root=merkle_root,
            evidence_bundle_sha256=evidence_bundle_sha256,
            issuing_officer_id=issuing_officer_id,
            issuing_officer_name=issuing_officer_name,
            officer_signature_token=sig_token,
            generated_at=timestamp_utc.isoformat(),
        )

    @classmethod
    def compile_evidence_bundle(
        cls,
        inspection_id: str,
        raw_image_bytes: bytes,
        dag: PipelineEvidenceDAG,
        issuing_officer_id: str,
        issuing_officer_name: str,
        device_model: Optional[str] = None,
        operating_system: Optional[str] = None,
        clock_source: Literal["LOCAL_DEVICE_MONOTONIC", "NTP_SYNCHRONIZED", "MANUAL_DECLARED"] = "LOCAL_DEVICE_MONOTONIC",
    ) -> BSAEvidenceBundleDTO:
        """Compiles an unbroken BSAEvidenceBundleDTO linking raw image, Merkle DAG, and certificate."""
        raw_image_sha256 = MerkleAuditLedger.hash_payload(raw_image_bytes)
        merkle_root = dag.compute_root()

        contract_nodes_raw = dag.to_contract_nodes()
        merkle_nodes = [MerkleNodeDTO(**node) for node in contract_nodes_raw]

        # Compute deterministic bundle digest
        bundle_digest_payload = {
            "inspection_id": inspection_id,
            "raw_image_sha256": raw_image_sha256,
            "merkle_root": merkle_root,
            "leaves": dag.get_leaf_hashes(),
        }
        evidence_bundle_sha256 = MerkleAuditLedger.hash_payload(bundle_digest_payload)

        certificate = cls.create_certificate(
            inspection_id=inspection_id,
            merkle_root=merkle_root,
            evidence_bundle_sha256=evidence_bundle_sha256,
            issuing_officer_id=issuing_officer_id,
            issuing_officer_name=issuing_officer_name,
            device_model=device_model,
            operating_system=operating_system,
            clock_source=clock_source,
        )

        return BSAEvidenceBundleDTO(
            inspection_id=inspection_id,
            raw_image_sha256=raw_image_sha256,
            merkle_nodes=merkle_nodes,
            merkle_root=merkle_root,
            bsa_certificate=certificate,
            notice=None,
        )
