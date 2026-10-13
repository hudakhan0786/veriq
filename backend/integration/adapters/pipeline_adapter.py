"""Central Pipeline Adapter (SIH26034 - Nirikshak)
Orchestrates independent member modules using frozen contracts and adapter pattern.
Avoids tight coupling or direct imports across member working directories.
"""

import sys
from pathlib import Path
from typing import Any, Dict, List, Optional

# Dynamically add repository root and backend module paths for adapter orchestration
REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

BACKEND_DIR = REPO_ROOT / "backend"
for subdir in BACKEND_DIR.iterdir():
    if subdir.is_dir() and str(subdir) not in sys.path:
        sys.path.insert(0, str(subdir))

from quality_gate import QualityGateEvaluator
from parsers import StatutoryDeclarationParser
from evaluators import Table1FontSchedule, USPEvaluator
from merkle_dag import MerkleAuditLedger


class CentralPipelineAdapter:
    """Orchestrates 12-stage pipeline through clean contract boundaries."""

    @classmethod
    def execute_quality_gate(cls, blur: float, glare: float, tilt: float = 0.0) -> Dict[str, Any]:
        is_valid, reason = QualityGateEvaluator.evaluate_metrics(blur, glare, tilt)
        return {
            "is_valid": is_valid,
            "laplacian_blur": blur,
            "glare_percentage": glare,
            "tilt_angle_deg": tilt,
            "rejection_reason": reason,
        }

    @classmethod
    def execute_rule_checks(
        cls,
        pdp_area_cm2: float,
        font_height_mm: float,
        net_qty: float,
        mrp: float,
        declared_usp: Optional[float] = None
    ) -> List[Dict[str, Any]]:
        evaluations = []
        evaluations.append(Table1FontSchedule.evaluate(pdp_area_cm2, font_height_mm))
        if declared_usp is not None:
            evaluations.append(USPEvaluator.evaluate(net_qty, mrp, declared_usp))
        return evaluations

    @classmethod
    def execute_ocr(cls, image: Any, image_id: str = "img_01") -> Dict[str, Any]:
        """Executes Member 2 Multilingual OCR pipeline on rectified image."""
        from engine import MultilingualOCREngine
        
        engine = MultilingualOCREngine()
        ocr_ready_img = QualityGateEvaluator.preprocess_for_ocr(image)
        output = engine.process_image(ocr_ready_img, image_id=image_id)
        return output.model_dump()

    @classmethod
    def build_evidence_merkle_root(cls, stage_payloads: List[Any]) -> str:
        hashes = [MerkleAuditLedger.hash_payload(p) for p in stage_payloads]
        return MerkleAuditLedger.build_merkle_root(hashes)
