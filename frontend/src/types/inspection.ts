/**
 * Canonical Typed Domain Models for Veriq (SIH26034)
 * Governed by:
 * - Legal Metrology (Packaged Commodities) Rules, 2011 (LMPC Rules, 2011)
 * - Section 63 Bharatiya Sakshya Adhiniyam, 2023 (BSA 2023)
 * - Contracts: contracts/ui/ui_contract_schema.json, compliance_dto.py, ocr_dto.py, extraction_dto.py, evidence_dto.py
 * 
 * Strict separation: The frontend does NOT calculate rules or metric scales.
 * It strictly receives and renders canonical backend results.
 */

// -----------------------------------------------------------------------------
// 1. Epistemic 4-State Verdict & Packaging Categories
// -----------------------------------------------------------------------------

export type EpistemicVerdict = "PASS" | "FAIL" | "REVIEW" | "UNABLE_TO_VERIFY";

export type WorkflowStatus =
  | "DRAFT"
  | "OPEN"
  | "PROCESSING"
  | "PENDING_REVIEW"
  | "COMPLETED"
  | "ADJUDICATED";

export type SeverityLevel = "CRITICAL" | "MAJOR" | "MINOR";

export type PackagingType =
  | "RECTANGULAR"
  | "CYLINDRICAL"
  | "FLEXIBLE_POUCH"
  | "ECOMMERCE_LISTING"
  | "UNSPECIFIED";

export type CaptureSource =
  | "PHYSICAL_FIELD"
  | "ECOMMERCE_URL"
  | "LOCAL_RESILIENT_SYNC";

export type InspectionType =
  | "ROUTINE_MARKET_SURVEILLANCE"
  | "COMPLAINT_VERIFICATION"
  | "MANUFACTURER_PACKER_DEPOT"
  | "SURPRISE_ENFORCEMENT_RAID";

// -----------------------------------------------------------------------------
// 2. Optical Quality Gate (Laplacian blur, specular glare, perspective tilt)
// -----------------------------------------------------------------------------

export interface QualityGateResult {
  passed: boolean;
  blur_variance: number;       // Laplacian variance threshold >= 150.0
  glare_percentage: number;    // Specular glare pixel threshold <= 3.0%
  skew_angle_deg: number;      // Perspective tilt threshold <= 15.0 deg
  advice?: string;             // Guidance prompt (e.g. HOLD_STEADY, REDUCE_GLARE)
  rejection_reason?: string;   // Technical rejection explanation if failed
}

// -----------------------------------------------------------------------------
// 3. Metric Scale Calibration & Geometry (ArUco / ISO 7810 fiducials)
// -----------------------------------------------------------------------------

export type CalibrationMethod =
  | "ARUCO_4X4_50"
  | "ISO_7810_CARD"
  | "STANDARD_COIN"
  | "MANUAL_FIXED"
  | "UNRESOLVED";

export interface CalibrationResult {
  is_calibrated: boolean;
  method: CalibrationMethod;
  px_to_mm: number;            // Resolved metric scale factor (mm per pixel)
  confidence: number;          // Fiducial detection confidence [0.0 - 1.0]
  reference_bounding_box?: [number, number, number, number]; // [ymin, xmin, ymax, xmax]
  margin_of_error_pct?: number; // Sensor uncertainty margin
  homography_matrix?: number[][]; // 3x3 planar homography matrix H
}

export interface PDPGeometry {
  package_type: PackagingType;
  package_area_cm2: number;
  pdp_area_cm2: number;
  pdp_area_percentage: number;
  bounding_box?: [number, number, number, number]; // [ymin, xmin, ymax, xmax]
}

// -----------------------------------------------------------------------------
// 4. Multilingual OCR Tokens (DBNet++ Detection + PP-OCR Recognition)
// Note: Stack is DBNet++ / PP-OCRv4 detection, PP-OCRv4 English recognition,
// PP-OCRv3 Devanagari recognition, and Tesseract fallback.
// -----------------------------------------------------------------------------

export type OCRModelSource =
  | "DBNet++"
  | "PP-OCRv4_Latin"
  | "PP-OCRv3_Devanagari"
  | "Tesseract_v5"
  | "PADDLE_DEV"
  | "DOM_PARSER"
  | "RULE_6_10_EVALUATOR";

export interface OCRToken {
  token_id: string;
  text: string;
  confidence: number;          // Recognition confidence [0.0 - 1.0]
  polygon: [number, number][]; // 4-point [[x1, y1], [x2, y2], [x3, y3], [x4, y4]]
  bounding_box: [number, number, number, number]; // [ymin, xmin, ymax, xmax] in pixels
  language?: "en" | "hi" | string;
  model_source?: OCRModelSource;
  line_index?: number;
}

export interface OCRResult {
  image_id: string;
  total_tokens: number;
  mean_confidence: number;
  tokens: OCRToken[];
  full_text: string;
  execution_time_ms: number;
}

// -----------------------------------------------------------------------------
// 5. Extracted Declarations (Rule 6 LMPC Rules, 2011)
// -----------------------------------------------------------------------------

export type ExtractedFieldType =
  | "NET_QUANTITY"
  | "MRP"
  | "UNIT_SALE_PRICE"
  | "MANUFACTURER_ADDRESS"
  | "MANUFACTURER"
  | "PACKER_ADDRESS"
  | "IMPORTER_ADDRESS"
  | "IMPORTER"
  | "COUNTRY_OF_ORIGIN"
  | "DATE_OF_MANUFACTURE"
  | "DATE_OF_EXPIRY"
  | "CONSUMER_CARE_CONTACT"
  | "CONSUMER_CARE"
  | "GENERIC_NAME"
  | "BRAND_NAME"
  | "PRODUCT_NAME"
  | "QUALITY_GATE_GLARE"
  | "UNKNOWN";

export interface ExtractedField {
  field_id: string;
  field_type: ExtractedFieldType;
  raw_ocr_text: string;
  normalized_value: Record<string, any>;
  detection_confidence: number;
  ocr_confidence: number;
  bounding_box: [number, number, number, number];
  measured_font_height_mm?: number;
  measurement_confidence?: number;
  token_ids?: string[];
}

// -----------------------------------------------------------------------------
// 6. Statutory Compliance / Rule Engine Findings
// Rendered from backend AST Rule Engine (Member 4/5). Never calculated in React.
// -----------------------------------------------------------------------------

export interface RuleFinding {
  finding_id: string;
  rule_code: string;           // Canonical rule identifier (e.g. "RULE_06_1_H_NET_QTY_FONT")
  statutory_reference: string; // Exact Gazette citation (e.g. "Rule 6(1)(h) read with Table-I, G.S.R. 629(E)")
  status: "PASS" | "FAIL" | "WARNING" | "REVIEW" | "UNABLE_TO_VERIFY" | "NOT_APPLICABLE";
  severity: SeverityLevel;
  required_value: string;      // Backend-provided statutory prescription
  measured_value: string;      // Backend-provided observed/measured value
  discrepancy?: string;        // Quantified deficit or mismatch details
  legal_consequence: string;   // Penal clause (e.g. "Section 36(1) LM Act 2009")
  evidence_box?: [number, number, number, number];
  field_type?: ExtractedFieldType;
}

// -----------------------------------------------------------------------------
// 7. Dynamic Evidence Graph / Merkle DAG (Section 63 BSA 2023)
// Dynamic nodes supplied by backend pipeline (do NOT assume fixed 7 nodes).
// -----------------------------------------------------------------------------

export interface EvidenceNode {
  node_id: string;
  stage_name: string;          // Stage (e.g. "RAW_IMAGE", "CALIBRATION", "OCR_TOKENS", "OFFICER_SIGNOFF", etc.)
  payload_sha256: string;      // SHA-256 digest
  timestamp_utc: string;       // ISO 8601 timestamp
  metadata: Record<string, any>;
  sequence_number?: number;
}

export interface EvidenceGraph {
  inspection_id: string;
  merkle_root: string;
  nodes: EvidenceNode[];       // Dynamic node array as returned by backend
  edges?: Array<{ from: string; to: string }>;
  is_tamper_verified?: boolean;
  verification_timestamp?: string;
}

export interface Section63Certificate {
  certificate_number: string;
  inspection_id: string;
  statutory_law_ref: string;
  device_model: string;
  operating_system: string;
  clock_source: "LOCAL_DEVICE_MONOTONIC" | "NTP_SYNCHRONIZED" | "MANUAL_DECLARED";
  raw_images_merkle_root: string;
  evidence_bundle_sha256: string;
  issuing_officer_id: string;
  issuing_officer_name: string;
  officer_signature_token: string;
  generated_at: string;
}

// -----------------------------------------------------------------------------
// 8. Human-in-the-Loop (HITL) Adjudication
// Mandatory officer sign-off; AI never issues notices autonomously.
// -----------------------------------------------------------------------------

export type OfficerAdjudicationVerdict =
  | "CONFIRM_VIOLATION"
  | "DISMISS_AS_COMPLIANT"
  | "REQUEST_RETEST";

export type OfficerActionOrder =
  | "GENERATE_LEGAL_NOTICE_FORM_1"
  | "CLOSE_INSPECTION_COMPLIANT"
  | "REQUEST_PHYSICAL_CALIPER_CHECK";

export interface AdjudicationRequest {
  adjudication_verdict: OfficerAdjudicationVerdict;
  override_applied: boolean;
  officer_remarks: string;     // Mandatory on override
  action_order: OfficerActionOrder;
  officer_pin_hash?: string;
  officer_name?: string;
  badge_number?: string;
  officer_id?: string;
}

export interface OfficerDecision {
  decision_id: string;
  inspection_id: string;
  officer_id: string;
  badge_number: string;
  officer_name: string;
  verdict: OfficerAdjudicationVerdict;
  override_applied: boolean;
  remarks: string;
  timestamp_utc: string;
  action_order: OfficerActionOrder;
}

// -----------------------------------------------------------------------------
// 8B. Finding-Level Adjudication (Preserves original RuleFinding.status)
// -----------------------------------------------------------------------------

export type FindingOfficerDecision = "CONFIRMED" | "DISMISSED" | "RETEST_REQUESTED";

export interface FindingAdjudication {
  finding_id: string;
  decision: FindingOfficerDecision;
  officer_id: string;
  officer_name: string;
  badge_number: string;
  remarks: string;
  timestamp_utc: string;
  action_order?: OfficerActionOrder;
}

// -----------------------------------------------------------------------------
// 8C. Chronological Audit Trail & Activity Record
// Append-only chronological record per 08_DATABASE_SPECIFICATION.md audit_logs
// -----------------------------------------------------------------------------

export type AuditActorType = "SYSTEM" | "OFFICER";

export type AuditEventType =
  | "INSPECTION_CREATED"
  | "IMAGE_UPLOADED"
  | "AI_INFERENCE_EXECUTED"
  | "OFFICER_ADJUDICATION_RECORDED"
  | "OFFICER_OVERRIDE_APPLIED"
  | "RETEST_REQUESTED"
  | "BSA_CERTIFICATE_ISSUED"
  | "HANDOFF_PREPARED";

export interface AuditEvent {
  id: string;
  sequence_number: number;
  timestamp_utc: string;
  event_type: AuditEventType | string;
  event_label: string;
  actor_type: AuditActorType;
  actor_id: string;
  actor_name: string;
  entity_type: "INSPECTION" | "EVIDENCE" | "FINDING" | "ADJUDICATION" | "HANDOFF";
  entity_id: string;
  related_finding_id?: string;
  related_evidence_id?: string;
  decision?: string;
  remarks?: string;
  metadata?: Record<string, any>;
  previous_hash?: string;
  entry_hash?: string;
}

// -----------------------------------------------------------------------------
// 8D. Case Readiness & Downstream Handoff
// Evaluates readiness without autonomous notice generation or client legal math
// -----------------------------------------------------------------------------

export type HandoffReadinessState =
  | "PENDING_OFFICER_REVIEW"
  | "ACTION_REQUIRED_RETEST"
  | "READY_FOR_CASE_CLOSURE"
  | "READY_FOR_LEGAL_NOTICE_DISPATCH";

export interface CaseReadinessChecklist {
  evidence_available: boolean;
  automated_analysis_completed: boolean;
  officer_adjudication_completed: boolean;
  audit_record_complete: boolean;
  readiness_state: HandoffReadinessState;
  downstream_action_guidance?: string;
}

// -----------------------------------------------------------------------------
// 9. Complete Inspection Case & Asset Entities
// Central UI domain entity. Everything belongs to the case.
// -----------------------------------------------------------------------------

export interface EvidenceAsset {
  image_id: string;
  inspection_id: string;
  file_path: string;
  raw_sha256: string;
  panel_type: "PDP_FRONT" | "SIDE_PANEL" | "BACK_PANEL" | "ECOMMERCE_SNAPSHOT";
  image_width: number;
  image_height: number;
  quality_gate: QualityGateResult;
  calibration?: CalibrationResult;
  ocr?: OCRResult;
  original_filename?: string;
  mime_type?: string;
  file_size_bytes?: number;
  preview_url?: string;
  uploaded_at?: string;
  is_original_untouched?: boolean;
}

export type PipelineStageId =
  | "INGESTION"
  | "QUALITY_GATE"
  | "CALIBRATION"
  | "OCR"
  | "EXTRACTION"
  | "RULES";

export type PipelineStageStatus =
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED"
  | "SKIPPED";

export interface PipelineStageProgress {
  id: PipelineStageId;
  label: string;
  status: PipelineStageStatus;
  detail?: string;
  execution_time_ms?: number;
}

export type OfficerRole = "INSPECTOR" | "CONTROLLER";

export type ApiOperatingMode = "LIVE" | "MOCK" | "DEMO_FIXTURE";

export type PipelineSource = "LIVE_BACKEND" | "BACKEND_SIMULATION" | "DEMO_FIXTURES";

export interface InspectionCase {
  id: string;
  inspection_number: string;
  created_at: string;
  officer_id: string;
  jurisdiction_id: string;
  capture_source: CaptureSource;
  product_name: string;
  brand_name?: string;
  manufacturer_name?: string;
  establishment_name?: string;
  premises_address?: string;
  inspection_type?: InspectionType | string;
  category: string;
  package_type: PackagingType;
  workflow_status: WorkflowStatus;
  overall_status: EpistemicVerdict | "PENDING_REVIEW";
  ai_verdict: EpistemicVerdict | "PENDING";
  declared_net_quantity?: string;
  principal_display_panel?: PDPGeometry;
  evidence_assets: EvidenceAsset[];
  extracted_fields: ExtractedField[];
  rule_evaluations: RuleFinding[];
  adjudication?: OfficerDecision;
  evidence_graph?: EvidenceGraph;
  bsa_certificate?: Section63Certificate;
  audit_trail?: AuditEvent[];
  finding_decisions?: Record<string, FindingAdjudication>;
  readiness_checklist?: CaseReadinessChecklist;
  notice_reference?: string;
  epoch_applied?: string;
  is_mock_fixture?: boolean;
  sku_demo_id?: string;
  notes?: string;
  pipeline_source?: PipelineSource;
  officer_role?: OfficerRole;
  location?: string;
  overall_confidence?: number;
  has_conflicts?: boolean;
  evidence_gap?: boolean;
  conflicts?: any[];
  measurements?: any[];
  calibration_summary?: any;
}

export interface InspectionSummary {
  id: string;
  inspection_number: string;
  product_name: string;
  brand_name?: string;
  manufacturer_name?: string;
  establishment_name?: string;
  inspection_type?: InspectionType | string;
  category: string;
  package_type: PackagingType;
  workflow_status: WorkflowStatus;
  overall_status: EpistemicVerdict | "PENDING_REVIEW" | "COMPLETED" | "PENDING";
  ai_verdict: EpistemicVerdict | "PENDING";
  jurisdiction_id: string;
  created_at: string;
  violations_count?: number;
  adjudicated?: boolean;
  is_mock_fixture?: boolean;
  location?: string;
  overall_confidence?: number;
  has_conflicts?: boolean;
  evidence_gap?: boolean;
}

export interface CreateInspectionPayload {
  product_name: string;
  brand_name?: string;
  manufacturer_name?: string;
  establishment_name?: string;
  premises_address?: string;
  inspection_type: InspectionType | string;
  category: string;
  package_type: PackagingType;
  jurisdiction_circle_id: string;
  declared_net_quantity?: string;
  notes?: string;
}

// -----------------------------------------------------------------------------
// 10. Dashboard & Executive Summaries
// -----------------------------------------------------------------------------

export interface DashboardSummary {
  jurisdiction_circle: string;
  total_inspections: number;
  violations_detected: number;
  compliant_count: number;
  pending_adjudication: number;
  form1_notices_issued: number;
  compliance_rate_pct: number;
  recent_inspections?: InspectionSummary[];
}

// -----------------------------------------------------------------------------
// 11. Legal Notice & Form-1 PDF Documents
// -----------------------------------------------------------------------------

export interface LegalNoticeRecipient {
  type: "MANUFACTURER" | "PACKER" | "IMPORTER" | "ECOMMERCE_PLATFORM" | "SELLER";
  name: string;
  address: string;
  email?: string;
}

export interface GenerateNoticePayload {
  inspection_id: string;
  recipient: LegalNoticeRecipient;
  compounding_fee_amount: number;
  reply_window_days: number;
}

export interface LegalNoticeResult {
  notice_id: string;
  notice_reference_number: string;
  bsa_certificate_number: string;
  statutory_mandate: string;
  pdf_download_url: string;
  merkle_entry_hash: string;
}

// -----------------------------------------------------------------------------
// 12. Asynchronous API States & Error Model
// -----------------------------------------------------------------------------

export type AsyncStatus = "idle" | "loading" | "success" | "error";

export interface ApiError {
  error_code: string;
  status: number;
  message: string;
  remediation?: string;
  timestamp?: string;
  is_network_error?: boolean;
}

export interface ApiState<T> {
  data: T | null;
  status: AsyncStatus;
  error: ApiError | null;
}

// -----------------------------------------------------------------------------
// 13. Canonical Inspection API Service Contract
// -----------------------------------------------------------------------------

export interface IInspectionApiService {
  getDashboardSummary(circleId?: string): Promise<DashboardSummary>;
  listInspections(params?: {
    circleId?: string;
    status?: string;
    workflowStatus?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ total: number; items: InspectionSummary[] }>;
  createInspection(payload: CreateInspectionPayload): Promise<InspectionCase>;
  getInspection(id: string): Promise<InspectionCase>;
  uploadEvidence(
    file: File | Blob,
    metadata: {
      inspection_id: string;
      panel_type?: "PDP_FRONT" | "SIDE_PANEL" | "BACK_PANEL" | "ECOMMERCE_SNAPSHOT";
      original_filename?: string;
      file_size_bytes?: number;
      mime_type?: string;
      image_width?: number;
      image_height?: number;
      preview_url?: string;
      demo_scenario?: "PASS" | "FAIL" | "REVIEW" | "UNABLE_TO_VERIFY" | "DEFAULT";
    }
  ): Promise<{
    inspection_id: string;
    image_id: string;
    raw_sha256: string;
    quality_gate: QualityGateResult;
    asset: EvidenceAsset;
  }>;
  executePipeline(
    imageId: string,
    inspectionId?: string,
    scenario?: "PASS" | "FAIL" | "REVIEW" | "UNABLE_TO_VERIFY"
  ): Promise<InspectionCase>;
  executeBatchPipeline(
    inspectionId: string
  ): Promise<InspectionCase>;
  submitAdjudication(
    inspectionId: string,
    request: AdjudicationRequest
  ): Promise<OfficerDecision>;
  submitFindingAdjudication(
    inspectionId: string,
    findingId: string,
    decision: FindingOfficerDecision,
    remarks: string,
    actionOrder?: OfficerActionOrder
  ): Promise<FindingAdjudication>;
  getAuditTrail(inspectionId: string): Promise<AuditEvent[]>;
  getCaseReadiness(inspectionId: string): Promise<CaseReadinessChecklist>;
  closeInspection(inspectionId: string, remarks?: string): Promise<InspectionCase>;
  updateExtractedField?(
    inspectionId: string,
    fieldId: string,
    payload: {
      raw_ocr_text?: string;
      measured_font_height_mm?: number;
      normalized_data?: Record<string, any>;
    }
  ): Promise<InspectionCase>;
  getEvidenceDossier?(inspectionId: string): Promise<any>;
  deleteInspection?(inspectionId: string): Promise<{ success: boolean; message: string; deleted_id: string }>;
  generateNotice(payload: GenerateNoticePayload): Promise<LegalNoticeResult>;
  getNoticePdfUrl(noticeId: string): string;
  getSystemHealth(): Promise<{
    status: string;
    statutory_mandate: string;
    repealed_acts_cited: null;
    version: string;
  }>;
  verifyAuditChain(): Promise<{
    chain_intact: boolean;
    total_audit_records: number;
    statutory_standard: string;
    verification_timestamp: string;
  }>;
}

