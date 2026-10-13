"""Semantic Extraction Interface Contract (SIH26034 - Nirikshak)
Extracts statutory packaging declarations (Rule 6 LMPC Rules 2011) without LLM hallucinations
Frozen per 07_API_AND_INTERFACE_CONTRACTS.md and 02_FINAL_REQUIREMENTS_SPECIFICATION.md
"""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class NetQuantityValue(BaseModel):
    magnitude: float = Field(..., gt=0.0, description="Numerical net quantity")
    unit: str = Field(..., description="Metric unit symbol (e.g. 'g', 'kg', 'ml', 'l')")
    has_banned_unit: bool = Field(False, description="Flagged true if prohibited unit (e.g. 'gms', 'gm', 'Kgs', 'ML', 'ltrs')")
    banned_unit_found: Optional[str] = Field(None, description="Exact prohibited unit found")
    has_prefix: bool = Field(False, description="Whether explicit statutory quantity prefix was detected")


class MRPValue(BaseModel):
    amount: float = Field(..., gt=0.0, description="Maximum Retail Price in INR")
    currency: str = Field("INR", description="Currency symbol/code")
    tax_inclusive: bool = Field(..., description="Whether mandatory clause '(incl. of all taxes)' is present")


class USPValue(BaseModel):
    price_per_unit: float = Field(..., gt=0.0, description="Unit sale price in INR")
    unit: str = Field(..., description="Standardized denominator unit (g, ml, kg, l)")


class AddressValue(BaseModel):
    name: Optional[str] = Field(None, description="Registered corporate identity / brand entity")
    address_line: Optional[str] = Field(None, description="Street / Premise / Area description")
    state: Optional[str] = Field(None, description="Indian State / UT")
    pin_code: Optional[str] = Field(None, pattern=r"^[1-9][0-9]{5}$", description="6-digit Indian Postal PIN code")
    is_complete: bool = Field(False, description="Whether statutory minimum tokens (State + PIN) are present")


class ConsumerCareValue(BaseModel):
    contact_name: Optional[str] = Field(None, description="Designated official/department name")
    phone: Optional[str] = Field(None, description="Valid telephone / toll-free contact number")
    email: Optional[str] = Field(None, description="Valid email address")
    address: Optional[str] = Field(None, description="Consumer redressal postal address")
    is_complete: bool = Field(False, description="Whether all 4 statutory tuples are present")


class ExtractedFieldDTO(BaseModel):
    field_type: str = Field(
        ...,
        description="Statutory category: NET_QUANTITY, MRP, UNIT_SALE_PRICE, MANUFACTURER_ADDRESS, PACKER_ADDRESS, IMPORTER_ADDRESS, COUNTRY_OF_ORIGIN, DATE_OF_MANUFACTURE, DATE_OF_EXPIRY, CONSUMER_CARE_CONTACT, GENERIC_NAME"
    )
    raw_ocr_text: str = Field(..., description="Raw text tokens matched on label")
    normalized_value: Dict[str, Any] = Field(default_factory=dict, description="Structured parsed representation")
    detection_confidence: float = Field(..., ge=0.0, le=1.0)
    ocr_confidence: float = Field(..., ge=0.0, le=1.0)
    bounding_box: List[int] = Field(..., min_length=4, max_length=4, description="[ymin, xmin, ymax, xmax] in pixels")
    measured_font_height_mm: Optional[float] = Field(None, ge=0.0, description="Physical font numeral x-height in millimeters")
    measurement_confidence: Optional[float] = Field(None, ge=0.0, le=1.0)


class NormalizedCommodityFacts(BaseModel):
    image_id: str
    net_quantity: Optional[NetQuantityValue] = None
    mrp: Optional[MRPValue] = None
    unit_sale_price: Optional[USPValue] = None
    manufacturer: Optional[AddressValue] = None
    packer: Optional[AddressValue] = None
    importer: Optional[AddressValue] = None
    consumer_care: Optional[ConsumerCareValue] = None
    country_of_origin: Optional[str] = None
    mfg_date_month: Optional[int] = Field(None, ge=1, le=12)
    mfg_date_year: Optional[int] = Field(None, ge=2000, le=2030)
    raw_fields: List[ExtractedFieldDTO] = Field(default_factory=list)
