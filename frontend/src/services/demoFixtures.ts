/**
 * Demo Fixture Service for Veriq
 * Provides dedicated, read-only access to the 6 Golden Demonstration SKUs
 * (SKU-DEMO-01 to SKU-DEMO-06) per 12_DEMO_PLAN.md and 11_TESTING_AND_VALIDATION_PLAN.md.
 * 
 * Strict boundary:
 * - Read-only fixtures. Never modifies production state.
 * - Truthfully tags all cases with pipeline_source = "DEMO_FIXTURES".
 * - Never claims live backend inference.
 */

import {
  IInspectionApiService,
  InspectionCase,
  InspectionSummary,
  DashboardSummary,
  QualityGateResult,
  AdjudicationRequest,
  OfficerDecision,
  FindingOfficerDecision,
  FindingAdjudication,
  OfficerActionOrder,
  AuditEvent,
  CaseReadinessChecklist,
  GenerateNoticePayload,
  LegalNoticeResult,
  CreateInspectionPayload,
  EvidenceAsset,
  ApiError,
} from "../types/inspection";
import {
  GOLDEN_SKU_CASES,
  MOCK_DASHBOARD_SUMMARY,
  computeCaseReadiness,
  deleteMockCase,
  getDeletedCaseIds,
} from "./mockData";

export class DemoFixtureService implements IInspectionApiService {
  private static instance: DemoFixtureService;

  public static getInstance(): DemoFixtureService {
    if (!DemoFixtureService.instance) {
      DemoFixtureService.instance = new DemoFixtureService();
    }
    return DemoFixtureService.instance;
  }

  public async getDashboardSummary(circleId?: string): Promise<DashboardSummary> {
    return {
      ...MOCK_DASHBOARD_SUMMARY,
      jurisdiction_circle: circleId || MOCK_DASHBOARD_SUMMARY.jurisdiction_circle,
    };
  }

  public async listInspections(params?: {
    circleId?: string;
    status?: string;
    workflowStatus?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ total: number; items: InspectionSummary[] }> {
    const deletedIds = getDeletedCaseIds();
    const allCases = Object.values(GOLDEN_SKU_CASES)
      .filter((c) => !deletedIds.has(c.id) && !deletedIds.has(c.inspection_number) && (!c.sku_demo_id || !deletedIds.has(c.sku_demo_id)))
      .map((c) => ({
      id: c.id,
      inspection_number: c.inspection_number,
      product_name: c.product_name,
      brand_name: c.brand_name,
      manufacturer_name: c.manufacturer_name,
      establishment_name: c.establishment_name,
      inspection_type: c.inspection_type,
      category: c.category,
      package_type: c.package_type,
      workflow_status: c.workflow_status || "OPEN",
      overall_status: c.overall_status,
      ai_verdict: c.ai_verdict,
      jurisdiction_id: c.jurisdiction_id,
      created_at: c.created_at,
      violations_count: c.rule_evaluations.filter((e) => e.status === "FAIL").length,
      adjudicated: !!c.adjudication,
      is_mock_fixture: true,
    }));

    let items = allCases;
    if (params?.status) {
      items = items.filter((i) => i.overall_status === params.status);
    }
    if (params?.workflowStatus) {
      items = items.filter((i) => i.workflow_status === params.workflowStatus);
    }
    if (params?.circleId) {
      items = items.filter((i) => i.jurisdiction_id === params.circleId);
    }
    if (params?.search) {
      const query = params.search.toLowerCase();
      items = items.filter(
        (i) =>
          i.product_name.toLowerCase().includes(query) ||
          i.inspection_number.toLowerCase().includes(query) ||
          (i.brand_name && i.brand_name.toLowerCase().includes(query)) ||
          (i.establishment_name && i.establishment_name.toLowerCase().includes(query))
      );
    }

    return { total: items.length, items };
  }

  public async createInspection(_payload: CreateInspectionPayload): Promise<InspectionCase> {
    throw {
      error_code: "READ_ONLY_MODE",
      status: 403,
      message: "Cannot create new inspection cases while in Golden Demo Fixture mode.",
      remediation: "Switch to Live Backend or Mock Workspace mode to create interactive inspections.",
    } as ApiError;
  }

  public async getInspection(id: string): Promise<InspectionCase> {
    const normalizedId = id.trim();
    const lower = normalizedId.toLowerCase();

    // Map common aliases
    const aliasMap: Record<string, string> = {
      "1": "SKU-DEMO-01",
      "demo-1": "SKU-DEMO-01",
      "sku-demo-1": "SKU-DEMO-01",
      "sku-demo-01": "SKU-DEMO-01",
      "2": "SKU-DEMO-02",
      "demo-2": "SKU-DEMO-02",
      "sku-demo-2": "SKU-DEMO-02",
      "sku-demo-02": "SKU-DEMO-02",
      "3": "SKU-DEMO-03",
      "demo-3": "SKU-DEMO-03",
      "sku-demo-3": "SKU-DEMO-03",
      "sku-demo-03": "SKU-DEMO-03",
      "4": "SKU-DEMO-04",
      "demo-4": "SKU-DEMO-04",
      "sku-demo-4": "SKU-DEMO-04",
      "sku-demo-04": "SKU-DEMO-04",
      "5": "SKU-DEMO-05",
      "demo-5": "SKU-DEMO-05",
      "sku-demo-5": "SKU-DEMO-05",
      "sku-demo-05": "SKU-DEMO-05",
      "6": "SKU-DEMO-06",
      "demo-6": "SKU-DEMO-06",
      "sku-demo-6": "SKU-DEMO-06",
      "sku-demo-06": "SKU-DEMO-06",
      "fortune": "demo-fortune-sunlite",
      "sunlite": "demo-fortune-sunlite",
      "oil": "demo-fortune-sunlite",
      "8": "REAL-PKG-WATCH",
      "watch": "REAL-PKG-WATCH",
      "fastrack": "REAL-PKG-WATCH",
      "demo-fastrack-watch": "REAL-PKG-WATCH",
      "9": "REAL-PKG-BRAHMI",
      "brahmi": "REAL-PKG-BRAHMI",
      "himalaya": "REAL-PKG-BRAHMI",
      "demo-himalaya-brahmi": "REAL-PKG-BRAHMI",
      "10": "REAL-PKG-FACEWASH",
      "facewash": "REAL-PKG-FACEWASH",
      "dotkey": "REAL-PKG-FACEWASH",
      "dot-and-key": "REAL-PKG-FACEWASH",
      "demo-dot-and-key": "REAL-PKG-FACEWASH",
      "11": "REAL-PKG-PERFUME",
      "perfume": "REAL-PKG-PERFUME",
      "bellavita": "REAL-PKG-PERFUME",
      "bella-vita": "REAL-PKG-PERFUME",
      "demo-bella-vita": "REAL-PKG-PERFUME",
      "12": "REAL-PKG-NAMKEEN",
      "namkeen": "REAL-PKG-NAMKEEN",
      "haldiram": "REAL-PKG-NAMKEEN",
      "demo-haldiram-namkeen": "REAL-PKG-NAMKEEN",
      "13": "REAL-PKG-CHIA",
      "chia": "REAL-PKG-CHIA",
      "true-elements": "REAL-PKG-CHIA",
      "demo-true-elements": "REAL-PKG-CHIA",
    };

    const targetKey = aliasMap[lower] || normalizedId;

    const found =
      GOLDEN_SKU_CASES[targetKey] ||
      GOLDEN_SKU_CASES[normalizedId] ||
      Object.values(GOLDEN_SKU_CASES).find(
        (c) =>
          c.id === normalizedId ||
          c.sku_demo_id === normalizedId ||
          c.inspection_number === normalizedId ||
          c.id.toLowerCase() === lower ||
          (c.sku_demo_id && c.sku_demo_id.toLowerCase() === lower) ||
          c.inspection_number.toLowerCase() === lower ||
          (c.sku_demo_id && aliasMap[lower] === c.sku_demo_id)
      );

    if (!found) {
      throw {
        error_code: "DEMO_CASE_NOT_FOUND",
        status: 404,
        message: `Golden Demo SKU '${id}' not found in fixture catalog.`,
        remediation: "Select one of SKU-DEMO-01 through SKU-DEMO-06 or demo-fortune-sunlite.",
      } as ApiError;
    }

    return {
      ...found,
      pipeline_source: "DEMO_FIXTURES",
      is_mock_fixture: true,
    };
  }

  public async uploadEvidence(): Promise<{
    inspection_id: string;
    image_id: string;
    raw_sha256: string;
    quality_gate: QualityGateResult;
    asset: EvidenceAsset;
  }> {
    throw {
      error_code: "READ_ONLY_MODE",
      status: 403,
      message: "Evidence upload is disabled in read-only Golden Demo Fixture mode.",
      remediation: "Switch to Live Backend or Mock Workspace mode to upload evidence.",
    } as ApiError;
  }

  public async executePipeline(
    imageId: string,
    inspectionId?: string,
    _scenario?: "PASS" | "FAIL" | "REVIEW" | "UNABLE_TO_VERIFY"
  ): Promise<InspectionCase> {
    const targetCase = inspectionId
      ? await this.getInspection(inspectionId)
      : Object.values(GOLDEN_SKU_CASES).find((c) =>
          c.evidence_assets.some((a) => a.image_id === imageId)
        ) || GOLDEN_SKU_CASES["SKU-DEMO-01"];

    return {
      ...targetCase,
      pipeline_source: "DEMO_FIXTURES",
      is_mock_fixture: true,
    };
  }

  public async executeBatchPipeline(
    inspectionId: string
  ): Promise<InspectionCase> {
    const targetCase = await this.getInspection(inspectionId);
    return {
      ...targetCase,
      pipeline_source: "DEMO_FIXTURES",
      is_mock_fixture: true,
    };
  }

  public async submitAdjudication(
    inspectionId: string,
    _request: AdjudicationRequest
  ): Promise<OfficerDecision> {
    const targetCase = await this.getInspection(inspectionId);
    if (targetCase.adjudication) {
      return targetCase.adjudication;
    }
    return {
      decision_id: `dec_demo_${inspectionId}`,
      inspection_id: inspectionId,
      officer_id: "INSP-DL-0842",
      badge_number: "INSP-DL-0842",
      officer_name: "Rajesh Sharma",
      verdict: "CONFIRM_VIOLATION",
      override_applied: false,
      remarks: "Golden SKU demonstration adjudication record.",
      timestamp_utc: new Date().toISOString(),
      action_order: "GENERATE_LEGAL_NOTICE_FORM_1",
    };
  }

  public async submitFindingAdjudication(
    _inspectionId: string,
    findingId: string,
    decision: FindingOfficerDecision,
    remarks: string,
    actionOrder?: OfficerActionOrder
  ): Promise<FindingAdjudication> {
    return {
      finding_id: findingId,
      decision,
      officer_id: "INSP-DL-0842",
      officer_name: "Rajesh Sharma",
      badge_number: "INSP-DL-0842",
      remarks: remarks.trim(),
      timestamp_utc: new Date().toISOString(),
      action_order: actionOrder,
    };
  }

  public async getAuditTrail(inspectionId: string): Promise<AuditEvent[]> {
    const c = await this.getInspection(inspectionId);
    return c.audit_trail || [];
  }

  public async getCaseReadiness(inspectionId: string): Promise<CaseReadinessChecklist> {
    const c = await this.getInspection(inspectionId);
    return computeCaseReadiness(c);
  }

  public async closeInspection(inspectionId: string): Promise<InspectionCase> {
    const c = await this.getInspection(inspectionId);
    return {
      ...c,
      workflow_status: "COMPLETED",
      pipeline_source: "DEMO_FIXTURES",
    };
  }

  public async generateNotice(_payload: GenerateNoticePayload): Promise<LegalNoticeResult> {
    return {
      notice_id: `not_demo_${Date.now()}`,
      notice_reference_number: "LMO/DL/SOUTH/2026/0842",
      bsa_certificate_number: "CERT-BSA2023-20260910-0842",
      statutory_mandate: "Legal Metrology (Packaged Commodities) Rules, 2011 (as amended) read with Section 36(1) proviso Legal Metrology Act, 2009 & Section 63 BSA 2023",
      pdf_download_url: "/form1.pdf",
      merkle_entry_hash: "8c42b9101adfa9280194bc0281efca891048bca120938a1ef908123bcdef0123",
    };
  }

  public async deleteInspection(inspectionId: string): Promise<{ success: boolean; message: string; deleted_id: string }> {
    deleteMockCase(inspectionId);
    return {
      success: true,
      message: `Inspection case ${inspectionId} has been disposed and removed from workspace.`,
      deleted_id: inspectionId,
    };
  }

  public getNoticePdfUrl(_noticeId: string): string {
    return "/form1.pdf";
  }

  public async getSystemHealth(): Promise<{
    status: string;
    statutory_mandate: string;
    repealed_acts_cited: null;
    version: string;
  }> {
    return {
      status: "DEMO_FIXTURES_MODE",
      statutory_mandate: "Section 63 Bharatiya Sakshya Adhiniyam, 2023 (BSA 2023)",
      repealed_acts_cited: null,
      version: "1.0.0-sih26034",
    };
  }

  public async verifyAuditChain(): Promise<{
    chain_intact: boolean;
    total_audit_records: number;
    statutory_standard: string;
    verification_timestamp: string;
  }> {
    return {
      chain_intact: true,
      total_audit_records: 6,
      statutory_standard: "Section 63 Bharatiya Sakshya Adhiniyam, 2023",
      verification_timestamp: new Date().toISOString(),
    };
  }
}
