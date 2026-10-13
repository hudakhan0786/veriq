"""Calibration & Metrology Interface Contract (SIH26034 - Nirikshak)
Statutory / Technical Standard: ArUco 4x4 50mm / ISO 7810 card fiducial calibration
Planar homography perspective rectification and metric mm/pixel scaling
Frozen per 07_API_AND_INTERFACE_CONTRACTS.md and 05_TECHNOLOGY_DECISION_RECORD.md (ADR-06)
"""

from typing import List, Literal, Optional
from pydantic import BaseModel, Field


class CalibrationDTO(BaseModel):
    method: Literal["ARUCO_4X4_50", "ISO_7810_CARD", "STANDARD_COIN", "MANUAL_FIXED", "UNRESOLVED"] = Field(
        ..., description="Calibration fiducial method used"
    )
    px_to_mm: float = Field(..., gt=0.0, description="Resolved scale factor in pixels per millimeter")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Fiducial detection confidence score")
    reference_bounding_box: List[int] = Field(
        ..., min_length=4, max_length=4, description="Bounding coordinates [ymin, xmin, ymax, xmax] in original pixels"
    )
    margin_of_error_pct: Optional[float] = Field(None, ge=0.0, description="Estimated measurement uncertainty percentage")


class PDPGeometryDTO(BaseModel):
    package_type: Literal["RECTANGULAR", "CYLINDRICAL", "FLEXIBLE_POUCH", "UNSPECIFIED"] = Field(
        "RECTANGULAR", description="Packaging geometric form"
    )
    package_area_cm2: float = Field(..., gt=0.0, description="Total computed packaging surface area in cm²")
    pdp_area_cm2: float = Field(..., gt=0.0, description="Principal Display Panel area (40% rule for rect/cyl) in cm²")
    pdp_area_percentage: float = Field(40.0, description="Percentage applied (standard 40.0%)")
    bounding_box: List[int] = Field(
        ..., min_length=4, max_length=4, description="PDP bounding box [ymin, xmin, ymax, xmax] in pixels"
    )


class CalibrationResult(BaseModel):
    is_calibrated: bool = Field(..., description="Whether physical metric scale was successfully resolved")
    calibration: CalibrationDTO
    principal_display_panel: PDPGeometryDTO
    homography_matrix: Optional[List[List[float]]] = Field(
        None, description="3x3 planar homography matrix H"
    )
