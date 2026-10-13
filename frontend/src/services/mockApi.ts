/**
 * Mock API Service for Veriq
 * Provides interactive local state mutations against mockData.ts
 * for developer testing, offline demonstrations, and standalone execution.
 * 
 * Strict boundary:
 * - Isolated to mockData.ts.
 * - Truthfully marks pipeline_source = "BACKEND_SIMULATION".
 * - Does not perform client-side legal calculations.
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
  HandoffReadinessState,
  CaseReadinessChecklist,
  GenerateNoticePayload,
  LegalNoticeResult,
  CreateInspectionPayload,
  EvidenceAsset,
  ApiError,
  ExtractedField,
  RuleFinding,
  CalibrationMethod,
  PDPGeometry,
  OCRToken,
} from "../types/inspection";
import {
  GOLDEN_SKU_CASES,
  MOCK_DASHBOARD_SUMMARY,
  getMockCases,
  addMockCase,
  updateMockCase,
  appendAuditEvent,
  computeCaseReadiness,
  loadPersistedCases,
  deleteMockCase,
  getDeletedCaseIds,
} from "./mockData";
import { evaluateImageQuality } from "../utils/qualityGate";

export function getActiveSessionOfficer(): {
  name: string;
  badgeNumber: string;
  designation: string;
  officerRole: string;
} {
  let name = "Rajesh Sharma";
  let badgeNumber = "INSP-DL-0842";
  let designation = "Legal Metrology Officer (Inspector)";
  let officerRole = "INSPECTOR";

  try {
    const stored = typeof window !== "undefined" ? localStorage.getItem("Nirikshak_session") : null;
    if (stored) {
      const session = JSON.parse(stored);
      if (session.name) name = session.name;
      if (session.badgeNumber) badgeNumber = session.badgeNumber;
      if (session.designation) designation = session.designation;
      if (session.officerRole) officerRole = session.officerRole;
    }
  } catch {
    // fallback to defaults
  }

  return { name, badgeNumber, designation, officerRole };
}

export class MockApiService implements IInspectionApiService {
  private static instance: MockApiService;

  public static getInstance(): MockApiService {
    if (!MockApiService.instance) {
      MockApiService.instance = new MockApiService();
    }
    return MockApiService.instance;
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
    const allCasesMap = getMockCases();
    const seen = new Set<string>();
    const allCases: InspectionCase[] = [];
    for (const c of Object.values(allCasesMap)) {
      if (!seen.has(c.id)) {
        seen.add(c.id);
        allCases.push(c);
      }
    }
    // Sort descending by creation timestamp so newly created cases appear prominently at top of register
    allCases.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    let items = allCases.map((c) => ({
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
      jurisdiction_id: c.jurisdiction_id || params?.circleId || "CIRCLE_DL_SOUTH_01",
      created_at: c.created_at,
      violations_count: c.rule_evaluations.filter((e) => e.status === "FAIL").length,
      adjudicated: !!c.adjudication,
      is_mock_fixture: c.is_mock_fixture ?? false,
    }));

    if (params?.status) {
      items = items.filter((i) => i.overall_status === params.status);
    }
    if (params?.workflowStatus) {
      items = items.filter((i) => i.workflow_status === params.workflowStatus);
    }
    if (params?.circleId && params.circleId !== "ALL") {
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

  public async createInspection(payload: CreateInspectionPayload): Promise<InspectionCase> {
    if (!payload.product_name || payload.product_name.trim().length === 0) {
      throw {
        error_code: "VALIDATION_ERROR",
        status: 400,
        message: "Commodity / product name is required.",
        remediation: "Please enter the declared product name on the packaging.",
      } as ApiError;
    }

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newCase: InspectionCase = {
      id: `insp_${Date.now()}_${randomSuffix}`,
      inspection_number: `INSP-${dateStr}-${randomSuffix}`,
      created_at: now.toISOString(),
      officer_id: "INSP-DL-0842",
      jurisdiction_id: payload.jurisdiction_circle_id || "CIRCLE_DL_SOUTH_01",
      capture_source: "PHYSICAL_FIELD",
      product_name: payload.product_name.trim(),
      brand_name: payload.brand_name?.trim() || undefined,
      manufacturer_name: payload.manufacturer_name?.trim() || undefined,
      establishment_name: payload.establishment_name?.trim() || undefined,
      premises_address: payload.premises_address?.trim() || undefined,
      inspection_type: payload.inspection_type || "ROUTINE_MARKET_SURVEILLANCE",
      category: payload.category || "FOOD_SNACKS",
      package_type: payload.package_type || "RECTANGULAR",
      workflow_status: "DRAFT",
      overall_status: "PENDING_REVIEW",
      ai_verdict: "PENDING",
      declared_net_quantity: payload.declared_net_quantity?.trim() || undefined,
      notes: payload.notes?.trim() || undefined,
      evidence_assets: [],
      extracted_fields: [],
      rule_evaluations: [],
      is_mock_fixture: true,
      pipeline_source: "BACKEND_SIMULATION",
    };

    addMockCase(newCase);
    return newCase;
  }

  public addLocalCase(c: InspectionCase): void {
    addMockCase(c);
  }

  public addEvidenceAsset(inspectionId: string, asset: EvidenceAsset): void {
    const mockCases = getMockCases();
    let existing = mockCases[inspectionId];
    if (!existing) {
      for (const c of Object.values(mockCases)) {
        if (c.id === inspectionId || c.inspection_number === inspectionId || c.sku_demo_id === inspectionId) {
          existing = c;
          break;
        }
      }
    }
    if (!existing) {
      const persisted = loadPersistedCases();
      existing = persisted[inspectionId];
      if (!existing) {
        for (const c of Object.values(persisted)) {
          if (c.id === inspectionId || c.inspection_number === inspectionId || c.sku_demo_id === inspectionId) {
            existing = c;
            break;
          }
        }
      }
    }
    if (existing) {
      const alreadyHas = existing.evidence_assets.some((a) => a.image_id === asset.image_id);
      if (!alreadyHas) {
        updateMockCase(existing.id, {
          evidence_assets: [...existing.evidence_assets, asset],
          workflow_status: "OPEN",
        });
      }
    }
  }

  public updateLocalCase(inspectionId: string, updates: Partial<InspectionCase>): void {
    updateMockCase(inspectionId, updates);
  }

  public async getInspection(id: string): Promise<InspectionCase> {
    const deletedIds = getDeletedCaseIds();
    if (deletedIds.has(id)) {
      throw {
        error_code: "CASE_DISPOSED",
        status: 404,
        message: `Inspection case ${id} has been permanently disposed and deleted.`,
      };
    }

    const mockCases = getMockCases();
    let found =
      mockCases[id] ||
      Object.values(mockCases).find(
        (c) => c.id === id || c.sku_demo_id === id || c.inspection_number === id
      );

    if (!found) {
      const persisted = loadPersistedCases();
      found =
        persisted[id] ||
        Object.values(persisted).find(
          (c) => c.id === id || c.sku_demo_id === id || c.inspection_number === id
        );
      if (found) {
        addMockCase(found);
      }
    }

    if (!found && (id === "demo-fortune-sunlite" || id === "demo-sunlite")) {
      found = GOLDEN_SKU_CASES["demo-fortune-sunlite"];
      if (found) {
        addMockCase(found);
      }
    }

    if (found) {
      return {
        ...found,
        pipeline_source: "BACKEND_SIMULATION",
      };
    }

    throw {
      error_code: "INSPECTION_NOT_FOUND",
      status: 404,
      message: `Inspection case '${id}' was not found in the local or remote registry.`,
      remediation: "Verify the case ID or return to the Inspection Desk.",
    } as ApiError;
  }

  public async uploadEvidence(
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
  }> {
    const imageId = `img_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    let rawSha256 = `sha256_${Date.now()}_${Math.random().toString(16).substring(2, 10)}`;
    let qualityGate: QualityGateResult = {
      passed: true,
      blur_variance: 342.18,
      glare_percentage: 0.84,
      skew_angle_deg: 1.45,
      advice: "FRAME_OPTIMAL",
    };

    if (metadata.demo_scenario === "UNABLE_TO_VERIFY") {
      rawSha256 = "e7b9c5f6a8b0213456789012abcdef0123456789abcdef0123456789abcdef05";
      qualityGate = {
        passed: false,
        blur_variance: 310.0,
        glare_percentage: 6.4,
        skew_angle_deg: 2.5,
        advice: "SPECULAR_GLARE",
        rejection_reason:
          "SPECULAR_GLARE: Glare coverage 6.40% exceeds acceptable maximum 3.00%. Tilt camera slightly to avoid direct light reflection.",
      };
    } else if (metadata.demo_scenario === "REVIEW") {
      rawSha256 = "d6a8b4e5f7a9102345678901abcdef0123456789abcdef0123456789abcdef04";
      qualityGate = {
        passed: true,
        blur_variance: 295.0,
        glare_percentage: 0.9,
        skew_angle_deg: 1.1,
        advice: "FRAME_OPTIMAL",
      };
    } else if (metadata.demo_scenario === "PASS") {
      rawSha256 = "c5f7a3d4e6f8091234567890abcdef0123456789abcdef0123456789abcdef03";
      qualityGate = {
        passed: true,
        blur_variance: 420.5,
        glare_percentage: 0.6,
        skew_angle_deg: 0.8,
        advice: "FRAME_OPTIMAL",
      };
    } else {
      // First-principles optical quality evaluation on actual image pixels
      qualityGate = await evaluateImageQuality(file, metadata.original_filename);
    }

    if (!qualityGate.passed) {
      throw {
        error_code: "IMAGE_QUALITY_GATE_FAILED",
        status: 422,
        message: `Image rejected by Optical Quality Gate: ${qualityGate.rejection_reason || qualityGate.advice || "Degraded image quality"}`,
        rejection_reason: qualityGate.rejection_reason || qualityGate.advice,
        quality_gate: qualityGate,
      };
    }

    // Determine a lightweight file_path, never store base64/blob data URLs as file_path
    const safePath = (metadata.preview_url && !metadata.preview_url.startsWith("data:") && !metadata.preview_url.startsWith("blob:"))
      ? metadata.preview_url
      : `storage/uploads/${metadata.original_filename || "field_evidence.jpg"}`;
    // For preview_url: keep data/blob URLs in-memory for current session display,
    // but savePersistedCases will strip them before writing to localStorage
    const asset: EvidenceAsset = {
      image_id: imageId,
      inspection_id: metadata.inspection_id,
      file_path: safePath,
      raw_sha256: rawSha256,
      panel_type: metadata.panel_type || "PDP_FRONT",
      image_width: metadata.image_width || 1920,
      image_height: metadata.image_height || 1080,
      quality_gate: qualityGate,
      original_filename: metadata.original_filename || (file instanceof File ? file.name : "evidence_capture.jpg"),
      mime_type: metadata.mime_type || (file instanceof File ? file.type : "image/jpeg"),
      file_size_bytes: metadata.file_size_bytes || (file instanceof File ? file.size : 1024 * 512),
      preview_url: metadata.preview_url,
      uploaded_at: new Date().toISOString(),
      is_original_untouched: true,
    };

    const mockCases = getMockCases();
    let existing = mockCases[metadata.inspection_id];
    if (!existing) {
      for (const c of Object.values(mockCases)) {
        if (c.id === metadata.inspection_id || c.inspection_number === metadata.inspection_id || c.sku_demo_id === metadata.inspection_id) {
          existing = c;
          break;
        }
      }
    }
    if (existing) {
      updateMockCase(existing.id, {
        evidence_assets: [...existing.evidence_assets, asset],
        workflow_status: "OPEN",
        overall_status: qualityGate.passed ? "PENDING_REVIEW" : "UNABLE_TO_VERIFY",
        ai_verdict: qualityGate.passed ? "PENDING" : "UNABLE_TO_VERIFY",
      });
    }

    return {
      inspection_id: metadata.inspection_id,
      image_id: imageId,
      raw_sha256: rawSha256,
      quality_gate: qualityGate,
      asset,
    };
  }

  public async executePipeline(
    imageId: string,
    inspectionId?: string,
    scenario?: "PASS" | "FAIL" | "REVIEW" | "UNABLE_TO_VERIFY"
  ): Promise<InspectionCase> {
    const mockCases = getMockCases();
    let targetCase: InspectionCase | undefined = undefined;
    if (inspectionId) {
      targetCase = mockCases[inspectionId];
      if (!targetCase) {
        for (const c of Object.values(mockCases)) {
          if (c.id === inspectionId || c.inspection_number === inspectionId || c.sku_demo_id === inspectionId) {
            targetCase = c;
            break;
          }
        }
      }
    }
    if (!targetCase) {
      targetCase =
        Object.values(mockCases).find((c) => c.evidence_assets.some((a) => a.image_id === imageId)) ||
        mockCases["SKU-DEMO-01"];
    }

    if (!targetCase) {
      return {
        ...GOLDEN_SKU_CASES["SKU-DEMO-01"],
        pipeline_source: "BACKEND_SIMULATION",
      };
    }

    if (!targetCase.evidence_assets || targetCase.evidence_assets.length === 0) {
      const fallbackAsset: EvidenceAsset = {
        image_id: imageId || `img_${Date.now()}`,
        inspection_id: targetCase.id,
        file_path: "/storage/uploads/sku_demo_01_biscuit.jpg",
        raw_sha256: `sha256_${Date.now()}_sealed`,
        panel_type: "PDP_FRONT",
        image_width: 1920,
        image_height: 1080,
        quality_gate: {
          passed: true,
          blur_variance: 342.18,
          glare_percentage: 0.84,
          skew_angle_deg: 1.45,
          advice: "FRAME_OPTIMAL",
        },
        uploaded_at: new Date().toISOString(),
        is_original_untouched: true,
      };
      targetCase.evidence_assets = [fallbackAsset];
      updateMockCase(targetCase.id, { evidence_assets: [fallbackAsset] });
    }

    const activeAsset =
      targetCase.evidence_assets.find((a) => a.image_id === imageId) ||
      targetCase.evidence_assets[0];
    const isOpticalFail = activeAsset?.quality_gate?.passed === false || scenario === "UNABLE_TO_VERIFY";

    if (isOpticalFail) {
      const updated = updateMockCase(targetCase.id, {
        workflow_status: "OPEN",
        overall_status: "UNABLE_TO_VERIFY",
        ai_verdict: "UNABLE_TO_VERIFY",
        rule_evaluations: [
          {
            finding_id: `eval_optic_${Date.now()}`,
            rule_code: "QUALITY_GATE_OPTICAL_REJECTION",
            statutory_reference: "Section 63 BSA 2023 Evidentiary Clarity Standard",
            status: "UNABLE_TO_VERIFY",
            severity: "CRITICAL",
            required_value: "Specular glare <= 3.00%",
            measured_value: `${activeAsset?.quality_gate?.glare_percentage?.toFixed(2) || "6.40"}% glare bloom`,
            discrepancy:
              activeAsset?.quality_gate?.rejection_reason ||
              "Harsh specular reflection obscures Net Quantity text region",
            legal_consequence: "Image inadmissible for statutory enforcement without re-capture",
          },
        ],
      });
      return {
        ...(updated || targetCase),
        pipeline_source: "BACKEND_SIMULATION",
      };
    }

    const isEarbuds =
      targetCase.product_name.toLowerCase().includes("earbud") ||
      targetCase.product_name.toLowerCase().includes("goboult") ||
      targetCase.product_name.toLowerCase().includes("w45") ||
      targetCase.product_name.toLowerCase().includes("headphone") ||
      targetCase.product_name.toLowerCase().includes("boult") ||
      targetCase.product_name.toLowerCase().includes("wireless") ||
      targetCase.product_name.toLowerCase().includes("audio") ||
      targetCase.product_name.toLowerCase().includes("tws") ||
      (targetCase.brand_name && targetCase.brand_name.toLowerCase().includes("goboult")) ||
      (targetCase.brand_name && targetCase.brand_name.toLowerCase().includes("boult")) ||
      targetCase.evidence_assets.some(
        (a) =>
          a.original_filename?.toLowerCase().includes("img (") ||
          a.original_filename?.toLowerCase().includes("earbud") ||
          a.original_filename?.toLowerCase().includes("w45") ||
          a.original_filename?.toLowerCase().includes("boult")
      );

    let updatedAssets: EvidenceAsset[] = [];
    let adaptedExtractedFields: ExtractedField[] = [];
    let ruleEvaluations: RuleFinding[] = [];
    let overallVerdict: "PASS" | "FAIL" | "REVIEW" | "UNABLE_TO_VERIFY" = "PASS";

    if (isEarbuds) {
      targetCase.product_name = targetCase.product_name || "GOBOULT W45 Wireless Earbuds";
      targetCase.brand_name = targetCase.brand_name || "GOBOULT";
      targetCase.manufacturer_name = targetCase.manufacturer_name || "Exotic Mile Pvt Ltd";
      targetCase.declared_net_quantity = targetCase.declared_net_quantity || "1 U";

      const makeToken = (
        token_id: string,
        text: string,
        confidence: number,
        box: [number, number, number, number]
      ): OCRToken => ({
        token_id,
        text,
        confidence,
        bounding_box: box,
        polygon: [
          [box[1], box[0]],
          [box[3], box[0]],
          [box[3], box[2]],
          [box[1], box[2]],
        ],
        language: "en",
        model_source: "PP-OCRv4_Latin",
      });

      // Map each of the multi-angle uploads to its true package face and evidence properties
      updatedAssets = targetCase.evidence_assets.map((a, idx) => {
        const fname = (a.original_filename || "").toLowerCase();
        let panelType: EvidenceAsset["panel_type"] = a.panel_type || "PDP_FRONT";
        if (fname.includes("img (1)") || fname.includes("img (8)") || fname.includes("back")) {
          panelType = "BACK_PANEL";
        } else if (fname.includes("img (2)") || fname.includes("front")) {
          panelType = "PDP_FRONT";
        } else if (fname.includes("img (3)") || fname.includes("top")) {
          panelType = "TOP_LID" as any;
        } else if (fname.includes("img (4)") || fname.includes("img (5)") || fname.includes("side")) {
          panelType = "SIDE_PANEL";
        } else if (!a.panel_type) {
          panelType = idx === 0 ? "PDP_FRONT" : idx === 1 ? "BACK_PANEL" : "SIDE_PANEL";
        }

        const isBackPanel = panelType === "BACK_PANEL";
        const isFrontPanel = panelType === "PDP_FRONT";
        const isTopPanel = (panelType as string) === "TOP_LID";
        const isSidePanel = panelType === "SIDE_PANEL";

        return {
          ...a,
          panel_type: panelType,
          quality_gate: {
            passed: true,
            blur_variance: isTopPanel ? 165.4 : 312.8,
            glare_percentage: 0.65,
            skew_angle_deg: 1.1,
            advice: "FRAME_OPTIMAL: Good illumination and sharpness",
          },
          calibration: {
            is_calibrated: true,
            method: "ISO_7810_CARD",
            px_to_mm: 0.142,
            confidence: 0.99,
            margin_of_error_pct: 0.8,
            reference_bounding_box: [180, 20, 720, 260],
          },
          ocr: {
            image_id: a.image_id,
            total_tokens: isBackPanel ? 12 : isFrontPanel ? 5 : 2,
            mean_confidence: 0.98,
            execution_time_ms: 110,
            full_text: isBackPanel
              ? "GOBOULT\nManufactured & Marketed By: Exotic Mile Pvt Ltd\nB-67, Wazirpur Industrial Area, Delhi - 110052\nMRP: ₹1,999.00 (Inclusive of all taxes)\nNet Quantity: 1U\nMonth & Year of Manufacturing: April 2026\nContains: TWS 1N, Extra Eartips 2N, Warranty Card 1N\nContact Customer Care: Exotic Mile Pvt Ltd B-67, Wazirpur Industrial Area, Delhi - 110052\nCountry of origin: India\nEmail: support@goboult.co.in\nContact: +91 9667 879 464\nProduct Name: W45\nColour: White"
              : isFrontPanel
              ? "GOBOULT\nWireless Earbuds\nAdaptive Low Latency • High Battery Life\nMade in India"
              : "GOBOULT W45",
            tokens: isBackPanel
              ? [
                  makeToken(`tok_${a.image_id}_01`, "GOBOULT", 0.99, [340, 290, 370, 470]),
                  makeToken(`tok_${a.image_id}_02`, "Manufactured & Marketed By: Exotic Mile Pvt Ltd", 0.98, [520, 290, 545, 620]),
                  makeToken(`tok_${a.image_id}_03`, "B-67, Wazirpur Industrial Area, Delhi - 110052", 0.98, [540, 290, 560, 600]),
                  makeToken(`tok_${a.image_id}_04`, "MRP: ₹1,999.00 (Inclusive of all taxes)", 0.99, [555, 290, 575, 550]),
                  makeToken(`tok_${a.image_id}_05`, "Net Quantity: 1U", 0.99, [565, 290, 585, 415]),
                  makeToken(`tok_${a.image_id}_06`, "Month & Year of Manufacturing: April 2026", 0.97, [580, 290, 600, 585]),
                  makeToken(`tok_${a.image_id}_07`, "Contact Customer Care: Exotic Mile Pvt Ltd B-67, Delhi - 110052", 0.98, [620, 290, 640, 615]),
                  makeToken(`tok_${a.image_id}_08`, "Country of origin: India", 0.99, [650, 290, 670, 445]),
                  makeToken(`tok_${a.image_id}_09`, "Email: support@goboult.co.in", 0.98, [710, 665, 730, 845]),
                  makeToken(`tok_${a.image_id}_10`, "Contact: +91 9667 879 464", 0.98, [725, 665, 745, 825]),
                ]
              : [
                  makeToken(`tok_${a.image_id}_01`, "GOBOULT", 0.99, [230, 290, 260, 430]),
                  makeToken(`tok_${a.image_id}_02`, "Wireless Earbuds", 0.99, [620, 300, 645, 500]),
                  makeToken(`tok_${a.image_id}_03`, "Made in India", 0.98, [605, 855, 625, 960]),
                ],
          },
        };
      });

      // Statutory Declarations extracted from the physical Goboult package
      adaptedExtractedFields = [
        {
          field_id: "fld_earbuds_brand",
          field_type: "BRAND_NAME",
          raw_ocr_text: "GOBOULT",
          normalized_value: { brand: "GOBOULT" },
          detection_confidence: 0.99,
          ocr_confidence: 0.99,
          bounding_box: [340, 290, 370, 470],
          measured_font_height_mm: 5.0,
          measurement_confidence: 0.98,
        },
        {
          field_id: "fld_earbuds_name",
          field_type: "GENERIC_NAME",
          raw_ocr_text: "GOBOULT W45 Wireless Earbuds",
          normalized_value: { text: "W45 Wireless Earbuds" },
          detection_confidence: 0.99,
          ocr_confidence: 0.99,
          bounding_box: [620, 300, 645, 500],
          measured_font_height_mm: 4.2,
          measurement_confidence: 0.97,
        },
        {
          field_id: "fld_earbuds_net_qty",
          field_type: "NET_QUANTITY",
          raw_ocr_text: "Net Quantity: 1U",
          normalized_value: { magnitude: 1.0, unit: "U", standard_symbol: "U" },
          detection_confidence: 0.99,
          ocr_confidence: 0.99,
          bounding_box: [565, 290, 585, 415],
          measured_font_height_mm: 2.5,
          measurement_confidence: 0.98,
        },
        {
          field_id: "fld_earbuds_mrp",
          field_type: "MRP",
          raw_ocr_text: "MRP: ₹1,999.00 (Inclusive of all taxes)",
          normalized_value: { amount_inr: 1999.0, is_tax_inclusive: true },
          detection_confidence: 0.99,
          ocr_confidence: 0.99,
          bounding_box: [555, 290, 575, 550],
          measured_font_height_mm: 2.8,
          measurement_confidence: 0.98,
        },
        {
          field_id: "fld_earbuds_usp",
          field_type: "UNIT_SALE_PRICE",
          raw_ocr_text: "Unit Sale Price: ₹ 1,999.00 / U",
          normalized_value: { price_per_unit_inr: 1999.0, denominator_unit: "U" },
          detection_confidence: 0.98,
          ocr_confidence: 0.98,
          bounding_box: [555, 290, 575, 550],
          measured_font_height_mm: 2.2,
          measurement_confidence: 0.97,
        },
        {
          field_id: "fld_earbuds_mfg_date",
          field_type: "DATE_OF_MANUFACTURE",
          raw_ocr_text: "Month & Year of Manufacturing: April 2026",
          normalized_value: { month: 4, year: 2026, date_iso: "2026-04-01" },
          detection_confidence: 0.98,
          ocr_confidence: 0.97,
          bounding_box: [580, 290, 600, 585],
          measured_font_height_mm: 2.2,
          measurement_confidence: 0.96,
        },
        {
          field_id: "fld_earbuds_mfg_addr",
          field_type: "MANUFACTURER_ADDRESS",
          raw_ocr_text: "Manufactured & Marketed By: Exotic Mile Pvt Ltd, B-67, Wazirpur Industrial Area, Delhi - 110052",
          normalized_value: { name: "Exotic Mile Pvt Ltd", street: "B-67, Wazirpur Industrial Area", city: "Delhi", pincode: "110052" },
          detection_confidence: 0.98,
          ocr_confidence: 0.98,
          bounding_box: [520, 290, 560, 620],
          measured_font_height_mm: 2.1,
          measurement_confidence: 0.96,
        },
        {
          field_id: "fld_earbuds_cc",
          field_type: "CONSUMER_CARE_CONTACT",
          raw_ocr_text: "Contact Customer Care: Exotic Mile Pvt Ltd, Delhi - 110052 • support@goboult.co.in • +91 9667 879 464",
          normalized_value: { phone: "+91 9667 879 464", email: "support@goboult.co.in" },
          detection_confidence: 0.98,
          ocr_confidence: 0.98,
          bounding_box: [620, 290, 640, 615],
          measured_font_height_mm: 2.0,
          measurement_confidence: 0.95,
        },
        {
          field_id: "fld_earbuds_origin",
          field_type: "COUNTRY_OF_ORIGIN",
          raw_ocr_text: "Country of origin: India",
          normalized_value: { country: "India" },
          detection_confidence: 0.99,
          ocr_confidence: 0.99,
          bounding_box: [650, 290, 670, 445],
          measured_font_height_mm: 2.3,
          measurement_confidence: 0.97,
        },
      ];

      ruleEvaluations = [
        {
          finding_id: "eval_earbuds_01",
          rule_code: "RULE_6_1_A_NAME",
          statutory_reference: "Rule 6(1)(a) Legal Metrology (Packaged Commodities) Rules, 2011",
          status: "PASS",
          severity: "CRITICAL",
          required_value: "Generic product name declaration present on PDP",
          measured_value: "GOBOULT W45 Wireless Earbuds",
          discrepancy: "Full generic name clearly declared",
          legal_consequence: "Compliant with Rule 6(1)(a).",
        },
        {
          finding_id: "eval_earbuds_02",
          rule_code: "RULE_6_1_B_NET_QTY",
          statutory_reference: "Rule 6(1)(b) & Rule 12 LMPC Rules 2011",
          status: "PASS",
          severity: "CRITICAL",
          required_value: "Standard statutory unit (U or N for discrete items)",
          measured_value: "1 U (Contains: TWS 1N, Extra Eartips 2N, Warranty Card 1N)",
          discrepancy: "Valid statutory unit 'U' used with complete itemization",
          legal_consequence: "Compliant with Rule 6(1)(b).",
        },
        {
          finding_id: "eval_earbuds_03",
          rule_code: "RULE_6_1_C_MRP",
          statutory_reference: "Rule 6(1)(c) & Rule 6(1)(e) LMPC Rules 2011",
          status: "PASS",
          severity: "CRITICAL",
          required_value: "MRP in Indian Rupees with 'inclusive of all taxes'",
          measured_value: "₹1,999.00 (Inclusive of all taxes)",
          discrepancy: "Tax-inclusive clause prominently declared",
          legal_consequence: "Compliant with Rule 6(1)(c).",
        },
        {
          finding_id: "eval_earbuds_04",
          rule_code: "RULE_6_1_K_USP",
          statutory_reference: "Rule 6(1)(k) LMPC Amendment 2021 (Mandatory)",
          status: "PASS",
          severity: "CRITICAL",
          required_value: "Unit Sale Price matching MRP / Net Quantity (|Δ| <= 0.02 INR)",
          measured_value: "₹ 1,999.00 / U",
          discrepancy: "USP math perfectly consistent with single-unit retail price",
          legal_consequence: "Compliant with Rule 6(1)(k).",
        },
        {
          finding_id: "eval_earbuds_05",
          rule_code: "RULE_6_1_D_DATE",
          statutory_reference: "Rule 6(1)(d) LMPC Rules 2011",
          status: "PASS",
          severity: "CRITICAL",
          required_value: "Month and year of manufacture or pre-packing",
          measured_value: "April 2026 (04/2026)",
          discrepancy: "Clear month & year declaration present",
          legal_consequence: "Compliant with Rule 6(1)(d).",
        },
        {
          finding_id: "eval_earbuds_06",
          rule_code: "RULE_6_1_E_MFG",
          statutory_reference: "Rule 6(1)(e) LMPC Rules 2011",
          status: "PASS",
          severity: "CRITICAL",
          required_value: "Complete postal address of manufacturer / marketer with PIN code",
          measured_value: "Exotic Mile Pvt Ltd, B-67, Wazirpur Industrial Area, Delhi - 110052",
          discrepancy: "Valid Indian enterprise with standard 6-digit postal PIN code",
          legal_consequence: "Compliant with Rule 6(1)(e).",
        },
        {
          finding_id: "eval_earbuds_07",
          rule_code: "RULE_6_1_F_CONSUMER_CARE",
          statutory_reference: "Rule 6(1)(f) LMPC Rules 2011",
          status: "PASS",
          severity: "CRITICAL",
          required_value: "Consumer helpline telephone number and email address",
          measured_value: "+91 9667 879 464, support@goboult.co.in",
          discrepancy: "Both telephone contact and email address visible and valid",
          legal_consequence: "Compliant with Rule 6(1)(f).",
        },
        {
          finding_id: "eval_earbuds_08",
          rule_code: "RULE_6_1_G_ORIGIN",
          statutory_reference: "Rule 6(1)(g) & Gazette GSR 858(E)",
          status: "PASS",
          severity: "CRITICAL",
          required_value: "Explicit Country of Origin declaration",
          measured_value: "India (Country of origin: India)",
          discrepancy: "Prominent Country of Origin declaration verified",
          legal_consequence: "Compliant with Rule 6(1)(g).",
        },
        {
          finding_id: "eval_earbuds_09",
          rule_code: "TABLE_1_FONT_HEIGHT",
          statutory_reference: "Rule 7 & Table-I Schedule LMPC Rules 2011",
          status: "PASS",
          severity: "CRITICAL",
          required_value: "Minimum numeral height >= 1.0 mm (Area <= 50 cm²)",
          measured_value: "2.40 mm (Calibrated via RuPay Standard Reference Card)",
          discrepancy: "Numeral font height exceeds statutory minimum by +1.40 mm",
          legal_consequence: "Compliant with Table-I font schedule.",
        },
      ];
      overallVerdict = "PASS";
    } else {
      let sourceTemplate = GOLDEN_SKU_CASES["SKU-DEMO-03"]; // Clean FMCG product template
      if (scenario === "REVIEW" || targetCase.product_name.toLowerCase().includes("soap")) {
        sourceTemplate = GOLDEN_SKU_CASES["SKU-DEMO-04"];
      } else if (scenario === "FAIL") {
        sourceTemplate = GOLDEN_SKU_CASES["SKU-DEMO-01"];
      }

      updatedAssets = targetCase.evidence_assets.map((a, idx) => {
        const isPrimary = a.image_id === (activeAsset?.image_id || imageId) || idx === 0;
        const panelType = a.panel_type || (idx === 0 ? "PDP_FRONT" : idx === 1 ? "BACK_PANEL" : "SIDE_PANEL");
        return {
          ...a,
          panel_type: panelType,
          calibration: a.calibration || sourceTemplate.evidence_assets[0]?.calibration || {
            is_calibrated: true,
            method: "ISO_7810_CARD",
            px_to_mm: 0.15,
            confidence: 0.98,
            margin_of_error_pct: 1.0,
            reference_bounding_box: [100, 100, 300, 400],
          },
          ocr: a.ocr || {
            ...sourceTemplate.evidence_assets[0]?.ocr,
            image_id: a.image_id,
            full_text: isPrimary
              ? `${targetCase.product_name || "Statutory Commodity"}\nDeclared Net Qty: ${targetCase.declared_net_quantity || "100 g"}\nMRP Rs. 140.00 (incl. of all taxes)\nMfg Date: 08/2026\nBrand: ${targetCase.brand_name || "Trade Brand"}`
              : `${targetCase.product_name || "Statutory Commodity"}\nManufactured by: Certified Enterprise\nCustomer Care: support@statutory.gov.in\nCountry of Origin: India`,
            tokens: (sourceTemplate.evidence_assets[0]?.ocr?.tokens || []).map((t, tIdx) => ({
              ...t,
              token_id: `tok_${a.image_id}_${tIdx}`,
            })),
          },
        };
      });

      // Adapt fields to whatever commodity the officer registered, NEVER leaking Alkaline 88 or Aqua Pure into custom packaging
      const isCustomCommodity = targetCase.product_name && !targetCase.product_name.toLowerCase().includes("alkaline") && !targetCase.product_name.toLowerCase().includes("water");
      const effectiveBrand = targetCase.brand_name || (isCustomCommodity && targetCase.product_name !== "Statutory Seized Commodity" ? targetCase.product_name.split(" ")[0] : "Statutory Brand");
      const effectiveMfg = targetCase.manufacturer_name || (isCustomCommodity ? `${effectiveBrand} Consumer Products Pvt. Ltd.` : "Responsible Manufacturer / Packer");
      const isFood = targetCase.category?.includes("FOOD") || targetCase.category?.includes("SNACK");
      const defaultQty = isFood ? "200 g" : "1 N";
      const effectiveQty = targetCase.declared_net_quantity?.trim() || defaultQty;
      const numMatch = effectiveQty.match(/^([\d.]+)\s*([a-zA-Z]+)?/);
      const mag = numMatch ? parseFloat(numMatch[1]) : (isFood ? 200.0 : 1.0);
      const unit = numMatch && numMatch[2] ? numMatch[2] : (isFood ? "g" : "N");

      adaptedExtractedFields = sourceTemplate.extracted_fields.map((f) => {
        if (f.field_type === "NET_QUANTITY") {
          return {
            ...f,
            raw_ocr_text: `Net Qty: ${effectiveQty}`,
            normalized_value: { magnitude: mag, unit: unit },
          };
        }
        if (f.field_type === "BRAND_NAME") {
          return {
            ...f,
            raw_ocr_text: effectiveBrand,
            normalized_value: { brand: effectiveBrand },
          };
        }
        if (f.field_type === "MANUFACTURER") {
          return {
            ...f,
            raw_ocr_text: `${effectiveMfg}, Industrial Area, New Delhi - 110020`,
            normalized_value: { name: effectiveMfg, address: `${effectiveMfg}, Industrial Area, New Delhi - 110020`, state: "Delhi", pin_code: "110020" },
          };
        }
        if (f.field_type === "UNIT_SALE_PRICE" && isFood) {
          return {
            ...f,
            raw_ocr_text: "Unit Sale Price: ₹ 0.20 / g",
            normalized_value: { price_per_unit_inr: 0.2, denominator_unit: "g" },
          };
        }
        if (f.field_type === "MRP" && isFood) {
          return {
            ...f,
            raw_ocr_text: "MRP ₹40.00 (incl. of all taxes)",
            normalized_value: { amount_inr: 40.0, is_tax_inclusive: true },
          };
        }
        return f;
      });

      if (targetCase.product_name) {
        adaptedExtractedFields = [
          {
            field_id: `fld_${targetCase.id}_prod_name`,
            field_type: "GENERIC_NAME",
            raw_ocr_text: targetCase.product_name,
            normalized_value: { text: targetCase.product_name },
            detection_confidence: 0.98,
            ocr_confidence: 0.97,
            bounding_box: [150, 100, 220, 850],
            measured_font_height_mm: 4.5,
            measurement_confidence: 0.96,
            token_ids: ["tok_prod_01"],
          },
          ...adaptedExtractedFields.filter((f) => f.field_type !== "GENERIC_NAME"),
        ];
      }
      ruleEvaluations = sourceTemplate.rule_evaluations;
      overallVerdict = (sourceTemplate.ai_verdict === "PENDING" ? "REVIEW" : sourceTemplate.ai_verdict) as any;
    }

    const updated = updateMockCase(targetCase.id, {
      product_name: targetCase.product_name,
      brand_name: targetCase.brand_name,
      manufacturer_name: targetCase.manufacturer_name,
      declared_net_quantity: targetCase.declared_net_quantity,
      evidence_assets: updatedAssets.length > 0 ? updatedAssets : targetCase.evidence_assets,
      principal_display_panel: targetCase.principal_display_panel || {
        package_type: "RECTANGULAR",
        package_area_cm2: 120.0,
        pdp_area_cm2: 48.0,
        pdp_area_percentage: 40.0,
      },
      extracted_fields: adaptedExtractedFields,
      rule_evaluations: ruleEvaluations,
      workflow_status: "PENDING_REVIEW",
      overall_status: "PENDING_REVIEW",
      ai_verdict: overallVerdict,
    });

    return {
      ...(updated || targetCase),
      pipeline_source: "BACKEND_SIMULATION",
    };
  }

  public async executeBatchPipeline(
    inspectionId: string
  ): Promise<InspectionCase> {
    const mockCases = getMockCases();
    let targetCase: InspectionCase | undefined = mockCases[inspectionId];
    if (!targetCase) {
      for (const c of Object.values(mockCases)) {
        if (c.id === inspectionId || c.inspection_number === inspectionId || c.sku_demo_id === inspectionId) {
          targetCase = c;
          break;
        }
      }
    }
    if (!targetCase) {
      targetCase = mockCases["SKU-DEMO-01"];
    }
    const firstImgId = targetCase?.evidence_assets?.[0]?.image_id || "img_mock_01";
    return await this.executePipeline(firstImgId, targetCase?.id || inspectionId);
  }

  public async submitAdjudication(
    inspectionId: string,
    request: AdjudicationRequest
  ): Promise<OfficerDecision> {
    if (!request.officer_remarks || request.officer_remarks.trim().length === 0) {
      throw {
        error_code: "MISSING_OFFICER_REMARKS",
        status: 400,
        message: "Mandatory officer justification remarks required for statutory record.",
        remediation: "Provide detailed reasoning for adjudication decision before proceeding.",
      } as ApiError;
    }

    const sessionOfficer = getActiveSessionOfficer();
    const activeOfficerName = request.officer_name || sessionOfficer.name;
    const activeBadgeNumber = request.badge_number || sessionOfficer.badgeNumber;
    const activeOfficerId = request.officer_id || activeBadgeNumber;

    const decision: OfficerDecision = {
      decision_id: `dec_${Date.now()}`,
      inspection_id: inspectionId,
      officer_id: activeOfficerId,
      badge_number: activeBadgeNumber,
      officer_name: activeOfficerName,
      verdict: request.adjudication_verdict,
      override_applied: request.override_applied,
      remarks: request.officer_remarks,
      timestamp_utc: new Date().toISOString(),
      action_order: request.action_order,
    };

    let readinessState: HandoffReadinessState = "PENDING_OFFICER_REVIEW";
    let guidance = "Officer adjudication recorded.";
    if (
      request.action_order === "REQUEST_PHYSICAL_CALIPER_CHECK" ||
      request.adjudication_verdict === "REQUEST_RETEST"
    ) {
      readinessState = "ACTION_REQUIRED_RETEST";
      guidance = "Physical caliper re-measurement or packaging re-capture ordered by inspecting officer.";
    } else if (
      request.action_order === "CLOSE_INSPECTION_COMPLIANT" ||
      request.adjudication_verdict === "DISMISS_AS_COMPLIANT"
    ) {
      readinessState = "READY_FOR_CASE_CLOSURE";
      guidance = "Inspection record marked compliant by officer. Ready for administrative filing and case closure.";
    } else if (
      request.action_order === "GENERATE_LEGAL_NOTICE_FORM_1" ||
      request.adjudication_verdict === "CONFIRM_VIOLATION"
    ) {
      readinessState = "READY_FOR_LEGAL_NOTICE_DISPATCH";
      guidance = "Statutory notice authorized by inspecting officer. Ready for Form-1 Show Cause Notice preparation.";
    }

    updateMockCase(inspectionId, {
      adjudication: decision,
      workflow_status: "COMPLETED",
      readiness_checklist: {
        evidence_available: true,
        automated_analysis_completed: true,
        officer_adjudication_completed: true,
        audit_record_complete: true,
        readiness_state: readinessState,
        downstream_action_guidance: guidance,
      },
    });

    appendAuditEvent(inspectionId, {
      event_type: request.override_applied ? "OFFICER_OVERRIDE_APPLIED" : "OFFICER_ADJUDICATION_RECORDED",
      event_label: request.override_applied ? "Officer Adjudication Override" : "Officer Adjudication Recorded",
      actor_type: "OFFICER",
      actor_id: activeBadgeNumber,
      actor_name: activeOfficerName,
      entity_type: "ADJUDICATION",
      entity_id: decision.decision_id,
      decision: request.adjudication_verdict,
      remarks: request.officer_remarks,
      metadata: {
        action_order: request.action_order,
        override_applied: request.override_applied,
      },
    });

    return decision;
  }

  public async submitFindingAdjudication(
    inspectionId: string,
    findingId: string,
    decision: FindingOfficerDecision,
    remarks: string,
    actionOrder?: OfficerActionOrder
  ): Promise<FindingAdjudication> {
    if (!remarks || remarks.trim().length === 0) {
      throw {
        error_code: "MISSING_OFFICER_REMARKS",
        status: 400,
        message: "Mandatory officer justification remarks required for statutory record.",
        remediation: "Provide detailed reasoning for adjudication decision before proceeding.",
      } as ApiError;
    }

    const officer = getActiveSessionOfficer();
    const findingAdj: FindingAdjudication = {
      finding_id: findingId,
      decision,
      officer_id: officer.badgeNumber,
      officer_name: officer.name,
      badge_number: officer.badgeNumber,
      remarks: remarks.trim(),
      timestamp_utc: new Date().toISOString(),
      action_order: actionOrder,
    };

    const mockCases = getMockCases();
    const current = Object.values(mockCases).find(
      (c) => c.id === inspectionId || c.sku_demo_id === inspectionId || c.inspection_number === inspectionId
    );
    const existingDecisions = current?.finding_decisions || {};
    const updatedDecisions = { ...existingDecisions, [findingId]: findingAdj };

    updateMockCase(inspectionId, {
      finding_decisions: updatedDecisions,
    });

    appendAuditEvent(inspectionId, {
      event_type: "OFFICER_ADJUDICATION_RECORDED",
      event_label: `Finding Adjudicated: ${decision}`,
      actor_type: "OFFICER",
      actor_id: officer.badgeNumber,
      actor_name: officer.name,
      entity_type: "FINDING",
      entity_id: findingId,
      related_finding_id: findingId,
      decision,
      remarks: remarks.trim(),
    });

    return findingAdj;
  }

  public async getAuditTrail(inspectionId: string): Promise<AuditEvent[]> {
    const c = await this.getInspection(inspectionId);
    return c.audit_trail || [];
  }

  public async getCaseReadiness(inspectionId: string): Promise<CaseReadinessChecklist> {
    const c = await this.getInspection(inspectionId);
    return computeCaseReadiness(c);
  }

  public async closeInspection(inspectionId: string, remarks?: string): Promise<InspectionCase> {
    const caseData = await this.getInspection(inspectionId);
    const readiness = computeCaseReadiness(caseData);

    if (readiness.readiness_state !== "READY_FOR_CASE_CLOSURE") {
      throw {
        error_code: "CASE_NOT_READY_FOR_CLOSURE",
        status: 400,
        message: "Case is not marked ready for closure by current workflow state.",
        remediation: "Complete officer review and ensure all findings are resolved before case closure.",
      } as ApiError;
    }

    const closureRemarks =
      remarks?.trim() ||
      "Inspection concluded. Case reviewed against backend statutory records and marked closed.";

    updateMockCase(inspectionId, {
      workflow_status: "COMPLETED",
      readiness_checklist: {
        ...readiness,
        downstream_action_guidance: "Case officially closed and archived in inspection registry.",
      },
    });

    const officer = getActiveSessionOfficer();
    appendAuditEvent(inspectionId, {
      event_type: "INSPECTION_CLOSED",
      event_label: "Inspection Case Closed",
      actor_type: "OFFICER",
      actor_id: officer.badgeNumber,
      actor_name: officer.name,
      entity_type: "INSPECTION",
      entity_id: inspectionId,
      decision: "CASE_CLOSED",
      remarks: closureRemarks,
    });

    return await this.getInspection(inspectionId);
  }

  public async updateExtractedField(
    inspectionId: string,
    fieldId: string,
    payload: {
      raw_ocr_text?: string;
      measured_font_height_mm?: number;
      normalized_data?: Record<string, any>;
    }
  ): Promise<InspectionCase> {
    const caseData = await this.getInspection(inspectionId);
    const fields = [...(caseData.extracted_fields || [])];
    const fieldIndex = fields.findIndex((f) => f.field_id === fieldId || (f as any).id === fieldId);

    if (fieldIndex >= 0) {
      const target = { ...fields[fieldIndex] };
      if (payload.raw_ocr_text !== undefined) {
        target.raw_ocr_text = payload.raw_ocr_text;
      }
      if (payload.measured_font_height_mm !== undefined) {
        target.measured_font_height_mm = payload.measured_font_height_mm;
      }
      if (payload.normalized_data !== undefined) {
        target.normalized_value = payload.normalized_data;
      }
      fields[fieldIndex] = target;
    }

    // Re-evaluate net quantity font rule if net qty font height was modified
    let evaluations = [...(caseData.rule_evaluations || [])];
    const modifiedField = fieldIndex >= 0 ? fields[fieldIndex] : null;
    if (modifiedField && modifiedField.field_type === "NET_QUANTITY") {
      const netQtyEvalIdx = evaluations.findIndex((e) => e.rule_code === "RULE_06_1_H_NET_QTY_FONT");
      if (netQtyEvalIdx >= 0 && payload.measured_font_height_mm !== undefined) {
        const requiredH = 4.0;
        const measuredH = payload.measured_font_height_mm;
        const passed = measuredH >= requiredH;
        evaluations[netQtyEvalIdx] = {
          ...evaluations[netQtyEvalIdx],
          measured_value: `${measuredH.toFixed(2)} mm`,
          status: passed ? "PASS" : "FAIL",
          discrepancy: passed ? undefined : `${(measuredH - requiredH).toFixed(2)} mm (${((measuredH - requiredH) / requiredH * 100).toFixed(1)}%)`,
        };
      }
    }

    const hasFails = evaluations.some((e) => e.status === "FAIL");
    const overallStatus = hasFails ? "FAIL" : "PASS";

    updateMockCase(inspectionId, {
      extracted_fields: fields,
      rule_evaluations: evaluations,
      overall_status: overallStatus,
      ai_verdict: overallStatus,
    });

    const officer = getActiveSessionOfficer();
    appendAuditEvent(inspectionId, {
      event_type: "FIELD_OVERRIDE_APPLIED",
      event_label: `Field Overridden: ${modifiedField?.field_type || fieldId}`,
      actor_type: "OFFICER",
      actor_id: officer.badgeNumber,
      actor_name: officer.name,
      entity_type: "FINDING",
      entity_id: fieldId,
      decision: "FIELD_UPDATED",
      remarks: `Officer updated field text / font height (${payload.measured_font_height_mm ? payload.measured_font_height_mm + ' mm' : 'text'})`,
      metadata: payload,
    });

    return await this.getInspection(inspectionId);
  }

  public async getEvidenceDossier(inspectionId: string): Promise<any> {
    const insp = await this.getInspection(inspectionId);
    const officer = getActiveSessionOfficer();
    return {
      status: "SUCCESS",
      inspection_id: insp.id,
      inspection_number: insp.inspection_number,
      product_name: insp.product_name,
      overall_status: insp.overall_status,
      certificate_number: `SEC63-BSA-2026-${(insp.sku_demo_id || insp.id).replace(/[^a-zA-Z0-9]/g, "").slice(-8).toUpperCase()}`,
      merkle_root: insp.evidence_graph?.merkle_root || "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
      statutory_mandate: "Section 63 of Bharatiya Sakshya Adhiniyam, 2023 (BSA 2023)",
      adjudicating_officer: `${officer.name} (${officer.badgeNumber})`,
      officer_badge: officer.badgeNumber,
      jurisdiction_circle: insp.jurisdiction_id || "CIRCLE_DL_SOUTH_01",
      total_evidence_assets: (insp.evidence_assets || []).length,
      total_extracted_fields: (insp.extracted_fields || []).length,
      total_rule_checks: (insp.rule_evaluations || []).length,
      generated_at: new Date().toISOString(),
      audit_events_count: (insp.audit_trail || []).length,
    };
  }

  public async generateNotice(_payload: GenerateNoticePayload): Promise<LegalNoticeResult> {
    const officer = getActiveSessionOfficer();
    const shortBadge = officer.badgeNumber.replace(/[^0-9]/g, "").slice(-4) || "0842";
    return {
      notice_id: `not_mock_${Date.now()}`,
      notice_reference_number: `LMO/DL/SOUTH/${new Date().getFullYear()}/${shortBadge}`,
      bsa_certificate_number: `CERT-BSA2023-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${shortBadge}`,
      statutory_mandate: "Legal Metrology (Packaged Commodities) Rules, 2011 (as amended) read with Section 36(1) proviso Legal Metrology Act, 2009 & Section 63 BSA 2023",
      pdf_download_url: "/form1.pdf",
      merkle_entry_hash: "8c42b9101adfa9280194bc0281efca891048bca120938a1ef908123bcdef0123",
    };
  }

  public async deleteInspection(inspectionId: string): Promise<{ success: boolean; message: string; deleted_id: string }> {
    deleteMockCase(inspectionId);
    return {
      success: true,
      message: `Inspection case ${inspectionId} and all related records have been permanently disposed and deleted.`,
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
      status: "LOCAL_RESILIENT_MODE",
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
      total_audit_records: 4,
      statutory_standard: "Section 63 Bharatiya Sakshya Adhiniyam, 2023",
      verification_timestamp: new Date().toISOString(),
    };
  }
}
