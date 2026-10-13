"""Statutory Compliance Interface Contract (SIH26034 - Nirikshak)
Deterministic AST Rule Engine findings under Legal Metrology (Packaged Commodities) Rules, 2011
Frozen per 07_API_AND_INTERFACE_CONTRACTS.md, 16_DECISION_LOG.md (ADL-01, ADL-07, ADL-12)
"""

from typing import List, Literal, Optional
from pydantic import BaseModel, Field


class RuleEvaluationDTO(BaseModel):
    rule_code: str = Field(..., description="Unique rule code (e.g. RULE_06_1_H_NET_QTY_FONT, RULE_06_1_K_USP)")
    statutory_reference: str = Field(..., description="Exact Gazette citation (e.g. Rule 6(1)(h) read with Table-I, G.S.R. 629(E))")
    status: Literal["PASS", "FAIL", "WARNING", "REVIEW", "UNABLE_TO_VERIFY", "NOT_APPLICABLE"] = Field(
        ..., description="Epistemic evaluation verdict"
    )
    severity: Literal["CRITICAL", "MAJOR", "MINOR"] = Field(..., description="Violation severity level")
    required_value: str = Field(..., description="Mandatory statutory threshold or condition")
    measured_value: str = Field(..., description="Actual observed or measured packaging value")
    discrepancy: Optional[str] = Field(None, description="Quantified deficit or mismatch details")
    legal_consequence: str = Field(
        "Section 36(1) Legal Metrology Act, 2009",
        description="Penal or legal consequence description"
    )


class ComplianceVerdictResult(BaseModel):
    inspection_id: str = Field(..., description="Target inspection identifier")
    overall_verdict: Literal["PASS", "FAIL", "REVIEW", "UNABLE_TO_VERIFY"] = Field(
        ..., description="Composite 4-state epistemic verdict"
    )
    adjudication_required: bool = Field(
        True, description="Always true per HITL natural justice requirement"
    )
    evaluations: List[RuleEvaluationDTO] = Field(
        default_factory=list, description="List of granular statutory rule determinations"
    )
    epoch_applied: str = Field(
        ..., description="Temporal statutory epoch applied (e.g. EPOCH_2011_BASE, EPOCH_2017_GSR_629, EPOCH_2021_GSR_779, EPOCH_2026_GSR_128)"
    )
    execution_time_ms: int = Field(..., ge=0, description="Evaluation execution time in milliseconds (< 15 ms target)")
