"""Quality Gate Interface Contract (SIH26034 - Nirikshak)
Statutory / Technical Standard: Laplacian Blur >= 150, Glare <= 3%, Tilt <= 15 deg
Frozen per 07_API_AND_INTERFACE_CONTRACTS.md and 03_FINAL_ARCHITECTURE.md
"""

from typing import Optional
from pydantic import BaseModel, Field


class QualityCheckDTO(BaseModel):
    is_valid: bool = Field(..., description="Whether the frame passes all optical quality criteria")
    laplacian_blur: float = Field(..., ge=0.0, description="Laplacian variance score. Threshold >= 150.0")
    glare_percentage: float = Field(..., ge=0.0, le=100.0, description="Specular glare pixel percentage. Threshold <= 3.0%")
    tilt_angle_deg: float = Field(..., ge=0.0, le=90.0, description="Perspective skew / tilt angle in degrees. Threshold <= 15.0 deg")
    rejection_reason: Optional[str] = Field(None, description="Human-readable rejection message and guidance if is_valid is False")


class QualityGateResult(BaseModel):
    passed: bool = Field(..., description="Overall gate pass/fail")
    blur_variance: float = Field(..., ge=0.0, description="Laplacian variance")
    glare_percentage: float = Field(..., ge=0.0, le=100.0, description="Glare percentage")
    skew_angle_deg: float = Field(..., ge=0.0, le=90.0, description="Perspective skew angle")
    advice: Optional[str] = Field(None, description="User HUD guidance prompt (e.g. HOLD_STEADY, REDUCE_GLARE)")
