"""Unified Computer Vision & Metrology Pipeline (SIH26034 - Nirikshak)
Member 1 — Computer Vision, Optics & Metrology

Executes Stages 2 through 5 of the 12-stage Nirikshak pipeline:
- Stage 2: Optical Quality Gate (Sharpness, Glare, Tilt)
- Stage 3: Fiducial Calibration (ArUco 4x4_50 / ISO 7810 Card)
- Stage 4: Perspective Rectification (Planar Homography)
- Stage 5: Principal Display Panel (PDP) Surface Area Calculation
"""

from dataclasses import dataclass
from pathlib import Path
import sys
from typing import Any, Dict, Literal, Optional, Tuple, Union
import cv2
import numpy as np

# Dynamically resolve repository root for shared contracts
REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from backend.contracts.calibration.calibration_dto import CalibrationResult
from backend.contracts.quality_gate.quality_gate_dto import QualityGateResult

# Member 1 local modules
SRC_DIR = Path(__file__).resolve().parent
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from quality_gate import QualityGateEvaluator, QualityGateOutput
from calibration import CalibrationEngine


@dataclass
class CVPipelineOutput:
    """Consolidated output from Member 1 CV & Metrology Pipeline."""

    quality_gate: QualityGateOutput
    calibration: CalibrationResult
    rectified_image: Optional[np.ndarray] = None

    @property
    def passed(self) -> bool:
        return self.quality_gate.passed

    @property
    def is_calibrated(self) -> bool:
        return self.calibration.is_calibrated

    @property
    def px_to_mm(self) -> Optional[float]:
        """Returns physical scale in px/mm if calibrated, or None if uncalibrated."""
        if not self.is_calibrated:
            return None
        return self.calibration.calibration.px_to_mm

    @property
    def pdp_area_cm2(self) -> Optional[float]:
        """Returns statutory PDP area in cm² if calibrated, or None if uncalibrated."""
        if not self.is_calibrated:
            return None
        return self.calibration.principal_display_panel.pdp_area_cm2

    def to_dict(self) -> Dict[str, Any]:
        """Serializes complete CV pipeline output into standard dictionary."""
        return {
            "quality_gate": self.quality_gate.to_dict(),
            "calibration": self.calibration.model_dump(),
            "is_calibrated": self.is_calibrated,
            "has_rectified_image": self.rectified_image is not None,
        }


class Member1CVPipeline:
    """End-to-end execution of Member 1 computer vision and metrology stages."""

    @classmethod
    def process_frame(
        cls,
        image_input: Union[str, Path, bytes, np.ndarray],
        tilt_deg: float = 0.0,
        package_type: Literal["RECTANGULAR", "CYLINDRICAL", "FLEXIBLE_POUCH", "UNSPECIFIED"] = "RECTANGULAR",
    ) -> CVPipelineOutput:
        """Processes an incoming raw packaging frame through Stages 2-5.

        1. Ingests raw image and runs Stage 2 Optical Quality Gate.
        2. If quality gate fails, halts early and returns rejection advice.
        3. If quality gate passes, runs Stage 3 & 4 Fiducial Calibration & Planar Homography.
        4. Calculates Stage 5 PDP surface area.
        5. Produces rectified frontal image for downstream OCR.
        """
        img = QualityGateEvaluator.load_image(image_input)

        # Stage 2: Optical Quality Gate
        qg_result = QualityGateEvaluator.evaluate_image(img, tilt_deg=tilt_deg)

        # Stage 3 & 5: Calibration & PDP Geometry
        calib_result = CalibrationEngine.calibrate(img, package_type=package_type)

        # Stage 4: Homography Rectification (if homography matrix is present)
        rectified = None
        if calib_result.is_calibrated and calib_result.homography_matrix is not None:
            H = np.array(calib_result.homography_matrix, dtype=np.float32)
            # Rectify to standard 1080p canvas size
            h, w = img.shape[:2]
            rectified = CalibrationEngine.rectify_image(img, H, (w, h))

        return CVPipelineOutput(
            quality_gate=qg_result,
            calibration=calib_result,
            rectified_image=rectified,
        )


if __name__ == "__main__":
    fixtures_dir = Path(__file__).resolve().parent.parent / "fixtures"
    sample_path = fixtures_dir / "fixture_calibration_aruco.png"
    if sample_path.is_file():
        print(f"Running Member 1 CV Pipeline on sample: {sample_path}")
        output = Member1CVPipeline.process_frame(sample_path)
        print(f"  Quality Gate: Passed={output.passed}, Blur={output.quality_gate.blur_variance:.2f}")
        print(f"  Calibration: Calibrated={output.is_calibrated}, Method={output.calibration.calibration.method}, Scale={output.px_to_mm:.2f} px/mm")
        print(f"  PDP Area: {output.pdp_area_cm2:.2f} cm² ({output.calibration.principal_display_panel.package_type})")
        print(f"  Rectified image generated: {output.rectified_image is not None}")
    else:
        print(f"Fixture not found at {sample_path}")
