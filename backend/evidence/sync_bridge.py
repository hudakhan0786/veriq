"""Mode B Offline Inspection Sync Bridge (SIH26034).
Governed by Section 63 Bharatiya Sakshya Adhiniyam, 2023 (BSA 2023).
Enforces TS-SYS-04 (Idempotency Deduplication) and OQ-06 (Mode B Reconciliation).
Allows field tablets operating offline to export and synchronize inspection bundles.
"""

from datetime import datetime, timezone
import hashlib
import json
from typing import Any, Dict, List, Optional, Tuple
import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

try:
    from database import (
        AuditLedgerService,
        AuditLog,
        BoundingBox,
        ComplianceEvaluation,
        EvidenceImage,
        Inspection,
    )
    from merkle_dag import MerkleAuditLedger, PipelineEvidenceDAG
    from storage import DecoupledStorageManager
except ImportError:
    from .database import (
        AuditLedgerService,
        AuditLog,
        BoundingBox,
        ComplianceEvaluation,
        EvidenceImage,
        Inspection,
    )
    from .merkle_dag import MerkleAuditLedger, PipelineEvidenceDAG
    from .storage import DecoupledStorageManager


class SyncBridgeError(Exception):
    """Base exception for Mode B synchronization errors."""
    pass


class BundleTamperError(SyncBridgeError):
    """Raised when an incoming offline bundle fails cryptographic hash validation."""
    pass


class ModeBSyncBridge:
    """Orchestrates bidirectional synchronization between Mode B (Offline) and Central Datastore."""

    SCHEMA_VERSION = "1.0.0"

    @classmethod
    def compute_bundle_digest(cls, bundle_dict: Dict[str, Any]) -> str:
        """Computes deterministic SHA-256 hash across inspections payload."""
        to_hash = {
            "bundle_id": bundle_dict["bundle_id"],
            "device_identifier": bundle_dict["device_identifier"],
            "inspections": bundle_dict["inspections"],
        }
        canonical_json = json.dumps(to_hash, sort_keys=True, separators=(",", ":"))
        return hashlib.sha256(canonical_json.encode("utf-8")).hexdigest()

    @classmethod
    def export_offline_bundle(
        cls,
        session: Session,
        inspection_ids: List[str],
        device_identifier: str = "OFFLINE-TABLET-DL-01",
        officer_badge: str = "INSP-DL-0842",
    ) -> Dict[str, Any]:
        """Gathers local inspection records and packages into a cryptographically sealed bundle."""
        bundle_id = f"BUNDLE-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{uuid.uuid4().hex[:8].upper()}"
        exported_inspections = []

        for insp_id in inspection_ids:
            insp = session.execute(select(Inspection).where(Inspection.id == insp_id)).scalar_one_or_none()
            if not insp:
                continue

            images = session.execute(select(EvidenceImage).where(EvidenceImage.inspection_id == insp.id)).scalars().all()
            bboxes = []
            for img in images:
                bb_records = session.execute(select(BoundingBox).where(BoundingBox.image_id == img.id)).scalars().all()
                for b in bb_records:
                    bboxes.append({
                        "id": b.id,
                        "image_id": b.image_id,
                        "field_type": b.field_type,
                        "raw_ocr_text": b.raw_ocr_text,
                        "normalized_text": b.normalized_text,
                        "box_coords": [b.ymin_px, b.xmin_px, b.ymax_px, b.xmax_px],
                        "ocr_confidence": b.ocr_confidence,
                        "measured_font_height_mm": b.measured_font_height_mm,
                    })

            evals = session.execute(select(ComplianceEvaluation).where(ComplianceEvaluation.inspection_id == insp.id)).scalars().all()

            record = {
                "inspection_id": insp.id,
                "inspection_number": insp.inspection_number,
                "officer_id": insp.officer_id,
                "jurisdiction_id": insp.jurisdiction_id,
                "capture_source": insp.capture_source,
                "product_name": insp.product_name,
                "brand_name": insp.brand_name,
                "category": insp.category,
                "package_type": insp.package_type,
                "overall_status": insp.overall_status,
                "ai_verdict": insp.ai_verdict,
                "inspection_timestamp": insp.inspection_timestamp.isoformat() if insp.inspection_timestamp else None,
                "device_fingerprint": insp.device_fingerprint,
                "evidence_images": [
                    {
                        "id": img.id,
                        "file_path": img.file_path,
                        "raw_sha256": img.raw_sha256,
                        "panel_type": img.panel_type,
                        "blur_score": img.blur_laplacian_variance,
                        "glare_score": img.glare_pixel_percentage,
                    }
                    for img in images
                ],
                "bounding_boxes": bboxes,
                "evaluations": [
                    {
                        "id": e.id,
                        "rule_code": e.rule_code,
                        "citation": e.rule_legal_citation,
                        "status": e.status,
                        "severity": e.severity,
                        "required": e.required_value,
                        "measured": e.measured_value,
                        "discrepancy": e.discrepancy,
                        "penalty": e.penalty_provision,
                    }
                    for e in evals
                ],
            }
            exported_inspections.append(record)

        bundle = {
            "schema_version": cls.SCHEMA_VERSION,
            "bundle_id": bundle_id,
            "device_identifier": device_identifier,
            "exported_by_badge": officer_badge,
            "exported_at_utc": datetime.now(timezone.utc).isoformat(),
            "inspection_count": len(exported_inspections),
            "inspections": exported_inspections,
        }
        bundle["bundle_digest"] = cls.compute_bundle_digest(bundle)
        return bundle

    @classmethod
    def import_offline_bundle(
        cls,
        session: Session,
        bundle_payload: Dict[str, Any],
        actor_id: str,
        device_fingerprint: str = "CENTRAL-SYNC-GATEWAY",
    ) -> Dict[str, Any]:
        """Ingests offline inspection bundle into central datastore with strict idempotency (TS-SYS-04)."""
        bundle_id = bundle_payload.get("bundle_id")
        if not bundle_id:
            raise SyncBridgeError("Invalid bundle: missing bundle_id.")

        # 1. Tamper Verification
        claimed_digest = bundle_payload.get("bundle_digest")
        computed_digest = cls.compute_bundle_digest(bundle_payload)
        if claimed_digest != computed_digest:
            raise BundleTamperError(
                f"Bundle tamper detected: payload digest mismatch. Claimed: {claimed_digest}, Computed: {computed_digest}"
            )

        # 2. Idempotency check via Audit Ledger (TS-SYS-04)
        existing_sync = session.execute(
            select(AuditLog).where(
                (AuditLog.action_type == "MODE_B_SYNC_APPLIED")
                & (AuditLog.payload_json.like(f"%{bundle_id}%"))
            )
        ).first()

        if existing_sync:
            return {
                "status": "IDEMPOTENT_SKIPPED",
                "bundle_id": bundle_id,
                "inspections_synced": 0,
                "inspections_skipped": len(bundle_payload.get("inspections", [])),
                "message": "Bundle already synchronized. Deduplication applied.",
            }

        synced_count = 0
        skipped_count = 0
        now = datetime.now(timezone.utc)

        for rec in bundle_payload.get("inspections", []):
            insp_num = rec["inspection_number"]
            existing_insp = session.execute(
                select(Inspection).where(Inspection.inspection_number == insp_num)
            ).scalar_one_or_none()

            if existing_insp:
                skipped_count += 1
                continue

            # Ingest Inspection
            new_insp = Inspection(
                id=rec["inspection_id"],
                inspection_number=insp_num,
                officer_id=rec["officer_id"],
                jurisdiction_id=rec["jurisdiction_id"],
                capture_source=rec["capture_source"],
                product_name=rec["product_name"],
                brand_name=rec.get("brand_name"),
                category=rec["category"],
                package_type=rec["package_type"],
                overall_status=rec["overall_status"],
                ai_verdict=rec["ai_verdict"],
                synced_to_central=True,
                device_fingerprint=rec["device_fingerprint"],
                clock_source="MODE_B_OFFLINE_RECONCILED",
            )
            session.add(new_insp)
            session.flush()

            # Ingest Evidence Images
            for img in rec.get("evidence_images", []):
                ev_img = EvidenceImage(
                    id=img["id"],
                    inspection_id=new_insp.id,
                    panel_type=img.get("panel_type", "PDP_FRONT"),
                    file_path=img["file_path"],
                    raw_sha256=img["raw_sha256"],
                    image_width=1920,
                    image_height=1080,
                    color_channels=3,
                    calibration_method="ARUCO_4X4_50",
                    blur_laplacian_variance=img.get("blur_score", 300.0),
                    glare_pixel_percentage=img.get("glare_score", 0.5),
                )
                session.add(ev_img)

            # Ingest Bounding Boxes
            for bb in rec.get("bounding_boxes", []):
                coords = bb["box_coords"]
                box = BoundingBox(
                    id=bb["id"],
                    image_id=bb["image_id"],
                    field_type=bb["field_type"],
                    ymin_px=coords[0],
                    xmin_px=coords[1],
                    ymax_px=coords[2],
                    xmax_px=coords[3],
                    detection_confidence=0.98,
                    raw_ocr_text=bb["raw_ocr_text"],
                    normalized_text=bb.get("normalized_text"),
                    ocr_confidence=bb.get("ocr_confidence", 0.95),
                    measured_font_height_mm=bb.get("measured_font_height_mm"),
                )
                session.add(box)

            # Ingest Compliance Evaluations
            for ev in rec.get("evaluations", []):
                rule_eval = ComplianceEvaluation(
                    id=ev["id"],
                    inspection_id=new_insp.id,
                    rule_code=ev["rule_code"],
                    rule_legal_citation=ev["citation"],
                    status=ev["status"],
                    severity=ev["severity"],
                    required_value=ev["required"],
                    measured_value=ev["measured"],
                    discrepancy=ev.get("discrepancy"),
                    penalty_provision=ev["penalty"],
                )
                session.add(rule_eval)

            synced_count += 1

        # Record synchronization in immutable audit ledger
        AuditLedgerService.append_audit_entry(
            session=session,
            actor_id=actor_id,
            action_type="MODE_B_SYNC_APPLIED",
            payload_dict={
                "bundle_id": bundle_id,
                "inspections_synced": synced_count,
                "inspections_skipped": skipped_count,
                "bundle_digest": claimed_digest,
            },
            device_fingerprint=device_fingerprint,
        )
        session.commit()

        return {
            "status": "SUCCESS",
            "bundle_id": bundle_id,
            "inspections_synced": synced_count,
            "inspections_skipped": skipped_count,
            "synced_at": datetime.now(timezone.utc).isoformat(),
        }
