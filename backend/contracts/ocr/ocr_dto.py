"""OCR Interface Contract (SIH26034 - Nirikshak)
DBNet++ text detection polygons + PP-OCRv4 multilingual recognition
Target CER <= 2.5%, Apache-2.0 permissive licensing only
Frozen per 07_API_AND_INTERFACE_CONTRACTS.md and 05_TECHNOLOGY_DECISION_RECORD.md (ADR-03, ADR-05, ADR-06)
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class OCRToken(BaseModel):
    token_id: str = Field(..., description="Unique identifier for the detected token/line")
    text: str = Field(..., description="Transcribed character string")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Recognition confidence score [0.0 - 1.0]")
    polygon: List[List[int]] = Field(
        ..., min_length=4, max_length=4, description="Oriented 4-point bounding polygon [[x1, y1], [x2, y2], [x3, y3], [x4, y4]]"
    )
    bounding_box: List[int] = Field(
        ..., min_length=4, max_length=4, description="Axis-aligned bounding box [ymin, xmin, ymax, xmax] in pixels"
    )
    language: Optional[str] = Field("en", description="Detected language code ('en' for English, 'hi' for Devanagari Hindi)")


class OCROutput(BaseModel):
    image_id: str = Field(..., description="Associated image identifier")
    total_tokens: int = Field(0, ge=0, description="Total count of text tokens recognized")
    mean_confidence: float = Field(0.0, ge=0.0, le=1.0, description="Mean recognition confidence score")
    tokens: List[OCRToken] = Field(default_factory=list, description="List of recognized OCR tokens")
    full_text: str = Field("", description="Concatenated newline-separated full text representation")
    execution_time_ms: int = Field(0, ge=0, description="Inference latency in milliseconds")
