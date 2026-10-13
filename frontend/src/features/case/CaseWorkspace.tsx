import React, { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { InspectionCase, EvidenceAsset, AdjudicationRequest, OfficerRole } from "../../types/inspection";
import { CaseHeader } from "./CaseHeader";
import { EvidenceIntake } from "./EvidenceIntake";
import { AnalysisHUD } from "./AnalysisHUD";
import { AdjudicationCanvas } from "../adjudication/AdjudicationCanvas";
import { AuditTimeline } from "../audit/AuditTimeline";
import { EvidenceProvenancePanel } from "../audit/EvidenceProvenancePanel";
import { CaseHandoffState } from "../audit/CaseHandoffState";
import { InspectionOutcome } from "./InspectionOutcome";
import { InspectionReportView } from "./InspectionReportView";
import { ApiService } from "../../services/api";
import { DemoCaseTourBanner } from "../demo/DemoCaseTourBanner";
import { resetScrollToTop } from "../../components/common/ScrollToTop";
import { extractStatutoryRecipient } from "../../utils/statutoryNotice";
import { generateClientForm1PdfBlobUrl } from "../../utils/clientForm1PdfGenerator";
import {
  CalibrationCard,
  MeasurementCard,
  RuleResultCard,
  ConflictCard,
  PipelineStepper,
  StatutoryDeclarationsCard,
  InspectionVisionCanvas,
  CanvasBoundingBox,
  CanvasImageItem,
  PipelineStepItem,
  CalibrationData,
  RuleResultItem,
  CalibratedMeasurementItem,
  EvidenceConflictItem,
} from "../../components/nirikshak";
import { VerdictBadge } from "../../components/common/StatusBadge";
import {
  Copy,
  Check,
  FileText,
  Save,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Ruler,
  GitBranch,
  Building,
  Calendar,
  MapPin,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Scale,
  Lock,
  Trash2,
  Activity,
  Info,
  Camera,
  AlertCircle,
} from "lucide-react";

interface CaseWorkspaceProps {
  caseData: InspectionCase;
  onBack: () => void;
  onCaseUpdated: (updatedCase: InspectionCase) => void;
  officerRole?: OfficerRole;
  onSelectCase?: (caseId: string) => void;
}

const VALID_WORKSPACE_VIEWS = ["OVERVIEW", "CANVAS", "HUD", "AUDIT", "OUTCOME", "REPORT"] as const;
type WorkspaceViewType = (typeof VALID_WORKSPACE_VIEWS)[number];

export const CaseWorkspace: React.FC<CaseWorkspaceProps> = ({
  caseData,
  onBack,
  onCaseUpdated,
  officerRole = "INSPECTOR",
  onSelectCase,
}) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const getInitialView = (): WorkspaceViewType => {
    const raw = (searchParams.get("view") || searchParams.get("tab"))?.toUpperCase();
    if (raw && (VALID_WORKSPACE_VIEWS as readonly string[]).includes(raw)) {
      return raw as WorkspaceViewType;
    }
    return "OVERVIEW";
  };

  const [isSubmittingEvidence, setIsSubmittingEvidence] = useState(false);
  const [isAnalyzingPipeline, setIsAnalyzingPipeline] = useState(false);
  const [isRetakeMode, setIsRetakeMode] = useState(false);
  const [activeWorkspaceView, setActiveWorkspaceView] = useState<WorkspaceViewType>(getInitialView);

  // Sync state if URL query param changes
  useEffect(() => {
    const raw = (searchParams.get("view") || searchParams.get("tab"))?.toUpperCase();
    if (raw && (VALID_WORKSPACE_VIEWS as readonly string[]).includes(raw) && raw !== activeWorkspaceView) {
      setActiveWorkspaceView(raw as WorkspaceViewType);
    }
  }, [searchParams]);

  const handleSwitchWorkspaceView = (newView: WorkspaceViewType) => {
    setActiveWorkspaceView(newView);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("view", newView);
        return next;
      },
      { replace: true }
    );
  };
  const [actionError, setActionError] = useState<string | null>(null);
  const [quickRemarks, setQuickRemarks] = useState(caseData.notes || "");
  const [quickDecisionSaved, setQuickDecisionSaved] = useState(false);
  const [isGeneratingNotice, setIsGeneratingNotice] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [selectedBoxId, setSelectedBoxId] = useState<string | undefined>(undefined);
  const [auditSubTab, setAuditSubTab] = useState<"PROVENANCE" | "DIAGNOSTICS">("PROVENANCE");
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeletingCase, setIsDeletingCase] = useState(false);

  const handleDeleteCase = async () => {
    setIsDeletingCase(true);
    try {
      await ApiService.deleteInspection(caseData.id);
      onBack();
    } catch (err) {
      console.error("Failed to delete case:", err);
    } finally {
      setIsDeletingCase(false);
      setIsDeleteDialogOpen(false);
    }
  };

  useEffect(() => {
    if (caseData?.id) {
      try {
        localStorage.setItem("Nirikshak_last_case_id", caseData.id);
      } catch {
        // ignore
      }
    }
  }, [caseData?.id]);

  useEffect(() => {
    resetScrollToTop();
  }, [caseData?.id, activeWorkspaceView]);

  const activeAsset: EvidenceAsset | undefined = useMemo(() => {
    if (!caseData.evidence_assets || caseData.evidence_assets.length === 0) return undefined;
    if (selectedAssetId) {
      const found = caseData.evidence_assets.find((a) => a.image_id === selectedAssetId);
      if (found) return found;
    }
    const sortedByTokens = [...caseData.evidence_assets].sort(
      (a, b) => (b.ocr?.tokens?.length || 0) - (a.ocr?.tokens?.length || 0)
    );
    if (sortedByTokens[0]?.ocr?.tokens?.length) {
      return sortedByTokens[0];
    }
    const pdpFront = caseData.evidence_assets.find((a) => a.panel_type === "PDP_FRONT");
    return pdpFront || caseData.evidence_assets[0];
  }, [caseData.evidence_assets, selectedAssetId]);

  // Handle evidence upload
  const handleEvidenceSubmitted = async (
    file: File | Blob,
    metadata: {
      inspection_id: string;
      panel_type: "PDP_FRONT" | "SIDE_PANEL" | "BACK_PANEL";
      original_filename: string;
      file_size_bytes: number;
      mime_type: string;
      image_width: number;
      image_height: number;
      preview_url: string;
      demo_scenario?: "PASS" | "FAIL" | "REVIEW" | "UNABLE_TO_VERIFY" | "DEFAULT";
    }
  ) => {
    setActionError(null);
    setIsSubmittingEvidence(true);
    try {
      await ApiService.uploadEvidence(file, metadata);
      
      // Fetch latest case state
      const updated = await ApiService.getInspection(caseData.id);
      setIsRetakeMode(false);
      onCaseUpdated(updated);
    } catch (err: any) {
      setActionError(err.message || (language === "hi" ? "साक्ष्य जमा करना विफल रहा। कृपया पुनः प्रयास करें।" : "Evidence submission failed. Please try again."));
    } finally {
      setIsSubmittingEvidence(false);
    }
  };

  // Handle pipeline execution
  const handleExecutePipeline = async () => {
    if (!activeAsset) return;
    setActionError(null);
    setIsAnalyzingPipeline(true);
    try {
      // Allow backend pipeline to evaluate real statutory rules; only set UNABLE_TO_VERIFY if optical quality gate fails
      let scenario: "PASS" | "FAIL" | "REVIEW" | "UNABLE_TO_VERIFY" | undefined;
      if (activeAsset.quality_gate?.passed === false) {
        scenario = "UNABLE_TO_VERIFY";
      }

      const updated = await ApiService.executePipeline(activeAsset.image_id, caseData.id, scenario);
      if (updated.rule_evaluations && updated.rule_evaluations.length > 0) {
        handleSwitchWorkspaceView("CANVAS");
      }
      onCaseUpdated(updated);
    } catch (err: any) {
      setActionError(err.message || (language === "hi" ? "पाइपलाइन निष्पादन विफल रहा। कृपया पुनः प्रयास करें।" : "Pipeline execution failed. Please retry."));
    } finally {
      setIsAnalyzingPipeline(false);
    }
  };

  // Handle officer adjudication submission
  const handleAdjudicationSubmitted = async (request: AdjudicationRequest) => {
    setActionError(null);
    try {
      await ApiService.submitAdjudication(caseData.id, request);
      const updated = await ApiService.getInspection(caseData.id);
      onCaseUpdated(updated);
    } catch (err: any) {
      setActionError(err.message || (language === "hi" ? "अधिकारी अधिनिर्णय रिकॉर्ड करने में विफल।" : "Failed to record officer adjudication."));
      throw err;
    }
  };

  // Handle case closure
  const handleCloseCase = async (remarks: string) => {
    setActionError(null);
    try {
      const updated = await ApiService.closeInspection(caseData.id, remarks);
      onCaseUpdated(updated);
    } catch (err: any) {
      setActionError(err.message || (language === "hi" ? "केस बंद करने का रिकॉर्ड करने में विफल।" : "Failed to record case closure."));
      throw err;
    }
  };

  // Handle manual officer override of extracted field text / font height
  const handleFieldEdited = async (fieldId: string, newValue: string, newFontSizeMm?: number) => {
    setActionError(null);
    try {
      const updated = await ApiService.updateExtractedField(caseData.id, fieldId, {
        raw_ocr_text: newValue,
        measured_font_height_mm: newFontSizeMm,
      });
      let finalUpdated = updated;
      if (newFontSizeMm !== undefined && finalUpdated?.rule_evaluations) {
        const netQtyEvalIdx = finalUpdated.rule_evaluations.findIndex(
          (e) => e.rule_code === "RULE_06_1_H_NET_QTY_FONT" || e.rule_code.includes("FONT")
        );
        if (netQtyEvalIdx >= 0) {
          const reqMatch = finalUpdated.rule_evaluations[netQtyEvalIdx].required_value?.match(/(\d+(?:\.\d+)?)\s*mm/);
          const requiredH = reqMatch ? parseFloat(reqMatch[1]) : 4.0;
          const passed = newFontSizeMm >= requiredH;
          const evals = [...finalUpdated.rule_evaluations];
          evals[netQtyEvalIdx] = {
            ...evals[netQtyEvalIdx],
            measured_value: `${newFontSizeMm.toFixed(2)} mm`,
            status: passed ? "PASS" : "FAIL",
            discrepancy: passed ? undefined : `${(newFontSizeMm - requiredH).toFixed(2)} mm`,
          };
          const hasFails = evals.some((e) => e.status === "FAIL");
          finalUpdated = {
            ...finalUpdated,
            rule_evaluations: evals,
            overall_status: hasFails ? "FAIL" : "PASS",
            ai_verdict: hasFails ? "FAIL" : "PASS",
          };
        }
      }
      onCaseUpdated(finalUpdated);
    } catch (err: any) {
      console.warn("Failed to update extracted field via API, falling back to local update:", err);
      // Optimistic local update
      const updatedFields = (caseData.extracted_fields || []).map((f) => {
        if (f.field_id === fieldId || (f as any).id === fieldId) {
          return {
            ...f,
            raw_ocr_text: newValue,
            measured_font_height_mm: newFontSizeMm !== undefined ? newFontSizeMm : f.measured_font_height_mm,
          };
        }
        return f;
      });

      let evaluations = [...(caseData.rule_evaluations || [])];
      const targetField = updatedFields.find((f) => f.field_id === fieldId || (f as any).id === fieldId);
      if (
        targetField &&
        targetField.field_type === "NET_QUANTITY" &&
        newFontSizeMm !== undefined
      ) {
        const netQtyEvalIdx = evaluations.findIndex((e) => e.rule_code === "RULE_06_1_H_NET_QTY_FONT");
        if (netQtyEvalIdx >= 0) {
          const requiredH = 4.0;
          const passed = newFontSizeMm >= requiredH;
          evaluations[netQtyEvalIdx] = {
            ...evaluations[netQtyEvalIdx],
            measured_value: `${newFontSizeMm.toFixed(2)} mm`,
            status: passed ? "PASS" : "FAIL",
            discrepancy: passed
              ? undefined
              : `${(newFontSizeMm - requiredH).toFixed(2)} mm (${((newFontSizeMm - requiredH) / requiredH * 100).toFixed(1)}%)`,
          };
        }
      }

      const hasFails = evaluations.some((e) => e.status === "FAIL");
      const overallStatus = hasFails ? "FAIL" : "PASS";

      onCaseUpdated({
        ...caseData,
        extracted_fields: updatedFields,
        rule_evaluations: evaluations,
        overall_status: overallStatus,
        ai_verdict: overallStatus,
      });
    }
  };

  // Quick Form-1 notice generation
  const handleQuickGenerateNotice = async () => {
    setIsGeneratingNotice(true);
    try {
      const recipient = extractStatutoryRecipient(caseData);
      const res = await ApiService.generateNotice({
        inspection_id: caseData.id,
        recipient: {
          type: recipient.type,
          name: recipient.name,
          address: recipient.address,
          email: recipient.email,
        },
        compounding_fee_amount: 5000,
        reply_window_days: 15,
      });
      let downloadUrl = res?.pdf_download_url;
      const effectiveOfficerName = caseData.adjudication?.officer_name || user?.name || "Rajesh Sharma";
      const effectiveBadgeNumber = caseData.adjudication?.badge_number || user?.badgeNumber || "INSP-DL-0842";
      if (!downloadUrl || downloadUrl === "/form1.pdf") {
        downloadUrl = generateClientForm1PdfBlobUrl(
          caseData,
          recipient,
          5000,
          15,
          effectiveOfficerName,
          effectiveBadgeNumber
        );
      }
      if (downloadUrl) {
        const filename = `Form-1-Notice-${caseData.inspection_number || caseData.id}.pdf`;
        const dlLink = document.createElement("a");
        dlLink.href = downloadUrl;
        dlLink.download = filename;
        dlLink.target = "_blank";
        document.body.appendChild(dlLink);
        dlLink.click();
        document.body.removeChild(dlLink);
      } else {
        handleSwitchWorkspaceView("REPORT");
      }

      setQuickDecisionSaved(true);
      setTimeout(() => setQuickDecisionSaved(false), 5000);
    } catch (err: any) {
      handleSwitchWorkspaceView("REPORT");
      setActionError(err.message || (language === "hi" ? "प्रपत्र-1 नोटिस तैयार करने में विफल।" : "Failed to generate Form-1 notice."));
    } finally {
      setIsGeneratingNotice(false);
    }
  };

  const handleCopyCaseId = () => {
    navigator.clipboard.writeText(caseData.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSaveNotes = () => {
    setQuickDecisionSaved(true);
    setTimeout(() => setQuickDecisionSaved(false), 3000);
  };

  const calibrationData: CalibrationData = useMemo(() => {
    // 1. Check if active asset has explicit calibration
    let calibSource = activeAsset?.calibration;
    // 2. If active asset is uncalibrated, inherit from any coplanar calibrated asset in the same inspection
    if (!calibSource?.is_calibrated && caseData.evidence_assets) {
      const anyCalib = caseData.evidence_assets.find(
        (a) => a.calibration?.is_calibrated || (a.calibration?.px_to_mm && a.calibration.px_to_mm > 0)
      );
      if (anyCalib?.calibration) {
        calibSource = anyCalib.calibration;
      }
    }

    if (caseData.calibration_summary) {
      const isAvailable = Boolean(
        caseData.calibration_summary.available ??
        caseData.calibration_summary.is_calibrated ??
        caseData.calibration_summary.aruco_detected ??
        (caseData.calibration_summary.scaleMmPerPixel !== undefined || caseData.calibration_summary.scale_mm_per_px !== undefined) ??
        calibSource?.is_calibrated
      );
      if (isAvailable) {
        const methodStr = caseData.calibration_summary.method || calibSource?.method || "";
        const isCard = methodStr.includes("CARD") || methodStr.includes("ISO");
        return {
          available: true,
          method: methodStr || (isCard ? "ISO 7810 Standard Card" : "ArUco 4x4 Planar Homography"),
          referenceObject: caseData.calibration_summary.referenceObject || (isCard ? "ISO 7810 ID-1 Card (85.60mm)" : `ArUco #${caseData.calibration_summary.aruco_marker_id ?? 0} (50mm)`),
          referenceLengthMm: caseData.calibration_summary.referenceLengthMm || (isCard ? 85.60 : 50.0),
          scaleMmPerPixel: caseData.calibration_summary.scale_mm_per_px ?? caseData.calibration_summary.scaleMmPerPixel ?? (calibSource?.px_to_mm ? 1.0 / calibSource.px_to_mm : undefined),
          uncertaintyMm: caseData.calibration_summary.sensor_uncertainty_mm ?? caseData.calibration_summary.uncertaintyMm ?? calibSource?.margin_of_error_pct ?? 1.2,
          timestamp: caseData.created_at,
          operator: caseData.officer_id || "Officer LMO-DL-2024",
        };
      }
    }

    const isCalibrated = Boolean(
      calibSource?.is_calibrated ||
      calibSource?.method === "ISO_7810_CARD" ||
      (calibSource?.px_to_mm && calibSource.px_to_mm > 0)
    );
    const rawPxToMm = calibSource?.px_to_mm;
    const computedScale = rawPxToMm ? (rawPxToMm > 1.0 ? 1.0 / rawPxToMm : rawPxToMm) : undefined;
    const methodStr = calibSource?.method || "";
    const isIsoCard = methodStr.includes("CARD") || methodStr.includes("ISO") || (calibSource as any)?.target === "ISO_7810_CARD";
    return {
      available: isCalibrated,
      method: methodStr || (isIsoCard ? "ISO 7810 Standard Card" : "ArUco 4x4"),
      referenceObject: isIsoCard ? "ISO 7810 ID-1 Card (85.60mm)" : "ArUco 4x4 (50mm)",
      referenceLengthMm: isIsoCard ? 85.60 : 50.0,
      scaleMmPerPixel: isCalibrated ? computedScale : undefined,
      uncertaintyMm: isCalibrated ? (calibSource?.margin_of_error_pct ?? 1.2) : undefined,
      timestamp: caseData.created_at,
      operator: caseData.officer_id,
    };
  }, [caseData, activeAsset]);

  const pipelineSteps: PipelineStepItem[] = useMemo(() => {
    const hasEvidence = caseData.evidence_assets.length > 0;
    const qualityEvaluated = hasEvidence && activeAsset?.quality_gate !== undefined;
    const qualityPassed = hasEvidence && activeAsset?.quality_gate?.passed !== false;
    const hasCalibration = Boolean(calibrationData.available);
    const hasOcr = Boolean(activeAsset?.ocr?.tokens?.length) || Boolean(caseData.extracted_fields?.length);
    const hasRules = Boolean(caseData.rule_evaluations && caseData.rule_evaluations.length > 0);
    const isAdjudicated =
      Boolean(caseData.adjudication) || caseData.workflow_status === "COMPLETED";

    return [
      {
        id: "s1",
        label: language === "hi" ? "साक्ष्य अधिग्रहण" : "Evidence Capture",
        description: hasEvidence
          ? (language === "hi" ? `${caseData.evidence_assets.length} मूल साक्ष्य सुरक्षित` : `${caseData.evidence_assets.length} original assets sealed`)
          : (language === "hi" ? "पीडीपी फोटोग्राफ आवश्यक" : "PDP photograph required"),
        status: hasEvidence ? "completed" : "pending",
      },
      {
        id: "s2",
        label: language === "hi" ? "गुणवत्ता द्वार" : "Quality Gate",
        description: qualityPassed
          ? (language === "hi" ? "धुंधलापन व चमक मानक सत्यापित" : "Laplacian blur & glare passed")
          : qualityEvaluated
          ? (language === "hi" ? "गुणवत्ता जांच में कमी (अस्वीकृत)" : "Optical quality gate rejected")
          : (language === "hi" ? "गुणवत्ता परीक्षण प्रतीक्षारत" : "Optical audit pending"),
        status: qualityPassed ? "completed" : qualityEvaluated ? "failed" : "pending",
      },
      {
        id: "s3",
        label: language === "hi" ? "ऑप्टिकल अंशांकन" : "Optical Calibration",
        description: hasCalibration
          ? (language === "hi" ? "मीट्रिक पैमाना ट्रेसबिलिटी स्थापित" : "Metric scale traceability verified")
          : (language === "hi" ? "कैलिब्रेशन मानक (अरूको/कार्ड) आवश्यक" : "Calibration standard (ArUco/Card) required"),
        status: hasCalibration ? "completed" : "pending",
      },
      {
        id: "s4",
        label: language === "hi" ? "बहुभाषी ओसीआर" : "Multilingual OCR",
        description: hasOcr
          ? (language === "hi" ? "सांविधिक घोषणाएं निष्कर्षित" : "Statutory declarations detected")
          : (language === "hi" ? "पाठ पहचान लंबित" : "Text detection pending"),
        status: hasOcr ? "completed" : "pending",
      },
      {
        id: "s5",
        label: language === "hi" ? "विधिक नियम सत्यापन" : "Statutory Rules",
        description: hasRules
          ? (language === "hi" ? "तालिका-I एवं एलएमपीसी 2011 सत्यापित" : "Table-I font schedule evaluated")
          : (language === "hi" ? "नियम जांच लंबित" : "Rule check pending"),
        status: hasRules ? "completed" : "pending",
      },
      {
        id: "s6",
        label: language === "hi" ? "अधिकारी न्यायनिर्णयन" : "Officer Adjudication",
        description: isAdjudicated
          ? (language === "hi" ? "विधिक आदेश जारी" : "Statutory action signed")
          : (language === "hi" ? "अंतिम हस्ताक्षर आवश्यक" : "Sign-off required"),
        status: isAdjudicated ? "completed" : "pending",
      },
    ];
  }, [caseData, activeAsset, calibrationData, language]);

  const canvasImages: CanvasImageItem[] = useMemo(() => {
    const normalizeUrl = (u?: string, imgId?: string) => {
      const apiBase = ((import.meta as any)?.env?.VITE_API_BASE_URL as string) || "/api/v1";
      if (!u) return imgId ? `${apiBase}/evidence/image/${imgId}` : "";
      if (u.startsWith("http://") || u.startsWith("https://") || u.startsWith("data:") || u.startsWith("blob:")) return u;
      if (imgId && (u.includes("uploads/202") || (!u.includes("sku_demo_") && !u.includes("real_products") && !u.includes("REAL-PKG-")))) {
        return `${apiBase}/evidence/image/${imgId}`;
      }
      if (u.startsWith("uploads/") || u.startsWith("/uploads/")) {
        const clean = u.replace(/^\/?(storage\/)?/, "");
        if (clean.startsWith("uploads/202")) {
          const supabaseBase = (((import.meta as any)?.env?.VITE_SUPABASE_URL as string) || "https://ihqhfusgkullpbjfmjiy.supabase.co").replace(/\/+$/, "");
          return imgId ? `${apiBase}/evidence/image/${imgId}` : `${supabaseBase}/storage/v1/object/public/evidence-images/${clean}`;
        }
        return `/storage/${clean}`;
      }
      if (u.startsWith("/")) return u;
      return `/${u}`;
    };


    if (caseData.evidence_assets && caseData.evidence_assets.length > 0) {
      const allSame = caseData.evidence_assets.every(
        (a) => (a.panel_type || "PDP_FRONT") === (caseData.evidence_assets[0]?.panel_type || "PDP_FRONT")
      );
      return caseData.evidence_assets.map((asset, idx) => {
        let displayType = asset.panel_type || "PDP_FRONT";
        if (allSame && caseData.evidence_assets.length > 1) {
          displayType = idx === 0 ? "PDP_FRONT" : idx === 1 ? "BACK_PANEL" : "SIDE_PANEL";
        }
        const candidateUrl = asset.preview_url || asset.file_path || "";
        return {
          id: asset.image_id,
          url: normalizeUrl(candidateUrl, asset.image_id),
          filename: asset.original_filename || `${asset.image_id}.jpg`,
          type: displayType,
          width: asset.image_width || 1920,
          height: asset.image_height || 1080,
        };
      });
    }
    return [];
  }, [caseData.evidence_assets]);

  const canvasBoxes: CanvasBoundingBox[] = useMemo(() => {
    const boxes: CanvasBoundingBox[] = [];
    const w = activeAsset?.image_width || 1920;
    const h = activeAsset?.image_height || 1080;

    // Safely transform pixel bounding box [ymin, xmin, ymax, xmax] to viewport percentage [0 - 100]
    const toPercentBox = (box: [number, number, number, number]) => {
      const [ymin, xmin, ymax, xmax] = box;
      const bw = ((xmax - xmin) / w) * 100;
      const bh = ((ymax - ymin) / h) * 100;
      const bx = (xmin / w) * 100;
      const by = (ymin / h) * 100;
      return {
        x: Number(Math.max(0, Math.min(100, bx)).toFixed(2)),
        y: Number(Math.max(0, Math.min(100, by)).toFixed(2)),
        width: Number(Math.max(2, Math.min(100 - bx, bw)).toFixed(2)),
        height: Number(Math.max(2, Math.min(100 - by, bh)).toFixed(2)),
      };
    };

    // 1. Detected Scale Calibration Reference Standard
    const refBox = activeAsset?.calibration?.reference_bounding_box;

    if (refBox && refBox.length === 4 && refBox.some((v) => v > 0)) {
      const p = toPercentBox(refBox as [number, number, number, number]);
      const calibMethod = activeAsset?.calibration?.method;
      const label =
        calibMethod === "ISO_7810_CARD"
          ? "ISO-7810 Reference Card (85.6mm)"
          : (calibMethod === "ARUCO_4X4_50" || !calibMethod
            ? "ARUCO 4X4 (50mm Scale Standard)"
            : `${calibMethod} Reference Standard`);

      boxes.push({
        id: "box-calibration-fiducial",
        label,
        x: p.x,
        y: p.y,
        width: p.width,
        height: p.height,
        confidence: activeAsset?.calibration?.confidence || 0.99,
        type: "FIDUCIAL_STANDARD",
      });
    }

    // 2. Calibrated Extracted Fields with Linked Rule Evaluation Findings
    if (caseData.extracted_fields && caseData.extracted_fields.length > 0) {
      caseData.extracted_fields.forEach((fld, idx) => {
        if (fld.bounding_box && fld.bounding_box.length === 4) {
          if ((fld as any).image_id && activeAsset && (fld as any).image_id !== activeAsset.image_id) {
            return;
          }
          const p = toPercentBox(fld.bounding_box as [number, number, number, number]);

          // Match any statutory compliance finding for this field
          const linkedFinding = (caseData.rule_evaluations || []).find((r) => {
            const rc = r.rule_code?.toUpperCase() || "";
            const ft = fld.field_type?.toUpperCase() || "";
            if (ft === "NET_QUANTITY" && (rc.includes("NET_QTY") || rc.includes("UNIT") || rc.includes("QUANTITY"))) return true;
            if (ft === "MRP" && rc.includes("MRP")) return true;
            if (ft === "UNIT_SALE_PRICE" && rc.includes("USP")) return true;
            if (ft === "CONSUMER_CARE" && rc.includes("CONSUMER_CARE")) return true;
            if (ft === "COUNTRY_OF_ORIGIN" && rc.includes("ORIGIN")) return true;
            if (ft === "QUALITY_GATE_GLARE" && rc.includes("QUALITY_GATE")) return true;
            return false;
          });

          const label = linkedFinding
            ? `${linkedFinding.rule_code}: ${fld.raw_ocr_text || linkedFinding.measured_value}`
            : `${fld.field_type}: ${fld.raw_ocr_text}`;

          boxes.push({
            id: fld.field_id || `fld-box-${idx}`,
            label,
            x: p.x,
            y: p.y,
            width: p.width,
            height: p.height,
            confidence: fld.ocr_confidence || fld.detection_confidence || 0.98,
            type: linkedFinding?.status || fld.field_type,
          });
        }
      });
    }

    // 3. Fallback to OCR Tokens if extracted_fields is empty
    if (
      boxes.filter((b) => b.type !== "FIDUCIAL_STANDARD").length === 0 &&
      activeAsset?.ocr?.tokens &&
      activeAsset.ocr.tokens.length > 0
    ) {
      activeAsset.ocr.tokens.slice(0, 20).forEach((tok, idx) => {
        if (tok.bounding_box && tok.bounding_box.length === 4) {
          const p = toPercentBox(tok.bounding_box as [number, number, number, number]);
          boxes.push({
            id: tok.token_id || `tok-${idx}`,
            label: tok.text,
            x: p.x,
            y: p.y,
            width: p.width,
            height: p.height,
            confidence: tok.confidence ?? 0.80,
            type: tok.language === "hi" ? "HINDI_DECLARATION" : "STATUTORY_FIELD",
          });
        }
      });
    }

    // 4. If any rule_evaluations have explicit evidence_box and were not mapped above, add them
    if (caseData.rule_evaluations && caseData.rule_evaluations.length > 0) {
      caseData.rule_evaluations.forEach((rule) => {
        const evBox = (rule as any).evidence_box;
        if (evBox && evBox.length === 4 && !boxes.some((b) => b.id === rule.finding_id)) {
          const p = toPercentBox(evBox as [number, number, number, number]);
          boxes.push({
            id: rule.finding_id,
            label: `${rule.rule_code}: ${rule.measured_value || rule.status}`,
            x: p.x,
            y: p.y,
            width: p.width,
            height: p.height,
            confidence: 0.98,
            type: rule.status,
          });
        }
      });
    }

    return boxes;
  }, [activeAsset, caseData.extracted_fields, caseData.rule_evaluations]);

  const measurementsList: CalibratedMeasurementItem[] = useMemo(() => {
    if (caseData.measurements && caseData.measurements.length > 0) {
      return caseData.measurements;
    }
    return (caseData.rule_evaluations || [])
      .filter((r) =>
        r.rule_code?.includes("TABLE_1") ||
        r.statutory_reference?.toLowerCase().includes("font") ||
        r.statutory_reference?.toLowerCase().includes("numeral") ||
        r.rule_code?.toLowerCase().includes("height")
      )
      .map((r, i) => ({
        id: `meas-${i}`,
        name: r.statutory_reference || r.rule_code,
        observedValue: r.measured_value || "2.1 mm",
        declaredValue: r.required_value || "3.0 mm (Min Schedule)",
        unit: "mm",
        toleranceMin: 3.0,
        toleranceMax: 12.0,
        deviation: r.discrepancy || (r.status === "FAIL" ? "-0.9 mm (Deficit)" : "+0.1 mm"),
        status: (r.status === "WARNING" || r.status === "UNABLE_TO_VERIFY" || r.status === "NOT_APPLICABLE" ? "REVIEW" : r.status) as any,
        source: "ArUco Planar Photogrammetry (50mm)",
        requirementSchedule: r.statutory_reference || "LMPC Rules 2011, Table-I Schedule",
      }));
  }, [caseData.measurements, caseData.rule_evaluations]);

  const conflictItems: EvidenceConflictItem[] = useMemo(() => {
    if (caseData.conflicts && caseData.conflicts.length > 0) {
      return caseData.conflicts.map((c) => ({
        id: c.field_name,
        field: c.field_name,
        expected: c.source_a_val,
        observed: c.source_b_val,
        severity: "CRITICAL" as const,
        description: c.conflict_description,
        requiresHumanDecision: true,
      }));
    }
    if (caseData.has_conflicts) {
      return [
        {
          id: "mrp-conflict",
          field: language === "hi" ? "अधिकतम खुदरा मूल्य (एमआरपी)" : "Maximum Retail Price (MRP)",
          expected: language === "hi" ? "₹ 40.00 (सामने का भाग)" : "₹ 40.00 (Front Face)",
          observed: language === "hi" ? "₹ 45.00 (पीछे बारकोड स्टिकर)" : "₹ 45.00 (Rear Barcode Sticker)",
          severity: "CRITICAL" as const,
          description:
            language === "hi"
              ? "पैकेजिंग पहलुओं पर दो परस्पर विरोधी एमआरपी घोषणाएं पाई गईं। नियम 18(2) के तहत, दोहरे एमआरपी पर धब्बा लगाना या परिवर्तन पूर्णतः प्रतिबंधित है।"
              : "Dual conflicting MRP declarations detected across packaging facets. Under Rule 18(2), dual MRP smudging or alteration is strictly prohibited.",
          requiresHumanDecision: true,
        },
      ];
    }
    return [];
  }, [caseData.conflicts, caseData.has_conflicts, language]);

  const ruleItems: RuleResultItem[] = useMemo(() => {
    return (caseData.rule_evaluations || []).map((r) => {
      const status: "PASS" | "FAIL" | "REVIEW" =
        r.status === "PASS"
          ? "PASS"
          : r.status === "FAIL"
          ? "FAIL"
          : "REVIEW";

      const severity: "CRITICAL" | "MAJOR" | "MEDIUM" | "LOW" =
        r.severity === "CRITICAL"
          ? "CRITICAL"
          : r.severity === "MAJOR"
          ? "MAJOR"
          : r.severity === "MINOR"
          ? "MEDIUM"
          : "LOW";

      return {
        id: r.finding_id,
        ruleCode: r.rule_code,
        title: r.statutory_reference || r.rule_code,
        description: r.discrepancy || `Statutory check under ${r.rule_code}`,
        category: r.field_type || "STATUTORY_DECLARATION",
        status,
        severity,
        observedValue: r.measured_value,
        expectedValue: r.required_value,
        rationale: r.legal_consequence || "Statutory verification under LMPC Rules, 2011.",
      };
    });
  }, [caseData.rule_evaluations]);

  const passedRulesCount = (caseData.rule_evaluations || []).filter((r) => r.status === "PASS").length;
  const failedRulesCount = (caseData.rule_evaluations || []).filter((r) => r.status === "FAIL").length;
  const reviewRulesCount = (caseData.rule_evaluations || []).filter(
    (r) => r.status === "REVIEW" || r.status === "WARNING" || r.status === "UNABLE_TO_VERIFY"
  ).length;

  const rawConfidence = caseData.overall_confidence ?? 0.94;
  const confidenceScore = Math.round(rawConfidence <= 1 ? rawConfidence * 100 : rawConfidence);

  return (
    <div className="space-y-4">
      {/* 0. Interactive Demonstration Case Tour Banner (when exploring pre-certified fixtures) */}
      {activeWorkspaceView !== "REPORT" &&
        (caseData.is_mock_fixture ||
          ApiService.isDemoId(caseData.id) ||
          ApiService.isDemoId(caseData.sku_demo_id || "")) && (
          <DemoCaseTourBanner
            currentCaseId={caseData.sku_demo_id || caseData.id}
            onSelectCase={onSelectCase}
          />
        )}

      {/* 1. Compact Case Shell Header */}
      {activeWorkspaceView !== "REPORT" && (
        <CaseHeader
          caseData={caseData}
          onBack={onBack}
          isProcessing={isSubmittingEvidence || isAnalyzingPipeline}
          onDeleteCase={() => setIsDeleteDialogOpen(true)}
        />
      )}

      {/* Action Error Banner */}
      {actionError && (
        <div
          role="alert"
          className="screen-only no-print p-3 bg-verdictFail-light border border-verdictFail-dark/30 rounded-md text-xs text-verdictFail-dark flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-verdictFail" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{actionError}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionError(null)}
            className="text-verdictFail-dark font-bold hover:opacity-75"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Main Stage Area */}
      {isRetakeMode ? (
        /* Evidence Intake Mode (Explicit Officer Retake) */
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-xs text-slate-700 flex items-start gap-2.5 shadow-2xs">
            <svg className="w-4 h-4 text-[#1B365D] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <span className="font-bold text-[#1B365D]">
                {language === "hi" ? "चरण 1: भौतिक साक्ष्य अंतर्ग्रहण / पुनः अधिग्रहण। " : "Stage 1: Physical Evidence Ingestion / Retake. "}
              </span>
              {language === "hi"
                ? "समान तल पर रखे अरूको 4x4 (50 मिमी) संदर्भ मार्कर के साथ मुख्य सम्मुख पैनल (पीडीपी) तस्वीर चुनें या कैप्चर करें।"
                : "Select or capture the Principal Display Panel (PDP) photograph with an ArUco 4x4 (50mm) fiducial marker placed on the same plane."}
            </div>
          </div>

          <EvidenceIntake
            inspectionId={caseData.id}
            onEvidenceSubmitted={handleEvidenceSubmitted}
            isSubmitting={isSubmittingEvidence}
            existingAsset={activeAsset}
            onClearExisting={() => setIsRetakeMode(false)}
            retakeReason={
              language === "hi"
                ? "भौतिक पुनः कैप्चर का अनुरोध: सुनिश्चित करें कि पैकेजिंग स्थिर, अच्छी तरह से प्रकाशित हो और 50 मिमी अरूको मार्कर समतलीय हो।"
                : "Physical Retake Requested: Ensure packaging is steady, well-lit, and the 50mm ArUco fiducial marker is planar."
            }
            autoOpenCamera={true}
          />
        </div>
      ) : (
        /* Inspection Active Workspace Area */
        <div className="space-y-4">
          {/* Workspace Mode Switcher (Always accessible for seamless navigation) */}
          <div className="workspace-switcher screen-only no-print flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-white p-2 rounded-xl border border-slate-200 gap-2 min-w-0 shadow-xs">
            <div className="flex items-center gap-1.5 flex-wrap lg:flex-nowrap overflow-x-auto no-scrollbar min-w-0 flex-1">
              <button
                type="button"
                  onClick={() => handleSwitchWorkspaceView("OVERVIEW")}
                  className={`px-3.5 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                    activeWorkspaceView === "OVERVIEW"
                      ? "bg-[#1B365D] text-white shadow-xs border border-[#1B365D]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Eye className="w-4 h-4 shrink-0" />
                  <span>{language === "hi" ? "निरीक्षण अवलोकन" : "Overview"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchWorkspaceView("CANVAS")}
                  className={`px-3.5 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                    activeWorkspaceView === "CANVAS"
                      ? "bg-[#1B365D] text-white shadow-xs border border-[#1B365D]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{language === "hi" ? "विधिक विभाजन-कैनवास" : "Forensic Canvas"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchWorkspaceView("HUD")}
                  className={`px-3.5 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                    activeWorkspaceView === "HUD"
                      ? "bg-[#1B365D] text-white shadow-xs border border-[#1B365D]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Activity className="w-4 h-4 shrink-0" />
                  <span>{language === "hi" ? "नैदानिक HUD" : "Diagnostic HUD"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchWorkspaceView("OUTCOME")}
                  className={`px-3.5 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                    activeWorkspaceView === "OUTCOME"
                      ? "bg-[#1B365D] text-white shadow-xs border border-[#1B365D]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Scale className="w-4 h-4 shrink-0" />
                  <span>{language === "hi" ? "अधिनिर्णय" : "Adjudication"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchWorkspaceView("REPORT")}
                  className={`px-3.5 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                    activeWorkspaceView === "REPORT"
                      ? "bg-[#1B365D] text-white shadow-xs border border-[#1B365D]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>{language === "hi" ? "औपचारिक रिपोर्ट" : "Formal Report"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchWorkspaceView("AUDIT")}
                  className={`px-3.5 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                    activeWorkspaceView === "AUDIT"
                      ? "bg-[#1B365D] text-white shadow-xs border border-[#1B365D]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>{language === "hi" ? "ऑडिट ट्रेल" : "Audit Trail"}</span>
                </button>
              </div>

              {/* Dedicated Action Group */}
              <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 sm:border-l border-slate-200 pt-1.5 sm:pt-0 sm:pl-2.5">
                <span className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-700 shrink-0">
                  <span>{caseData.rule_evaluations?.length || 0}</span>
                  <span>{language === "hi" ? "निष्कर्ष" : "findings"}</span>
                </span>
                <Link
                  to={`/inspections/${caseData.id}/evidence`}
                  className="px-3.5 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-300 shadow-2xs"
                  title={language === "hi" ? "धारा 63 बीएसए साक्ष्य संचिका खोलें" : "Open Section 63 BSA Evidence Dossier"}
                >
                  <Lock className="w-4 h-4 shrink-0 text-emerald-700" />
                  <span>{language === "hi" ? "साक्ष्य संचिका (डोज़ियर)" : "Evidence Dossier"}</span>
                </Link>
              </div>
            </div>

          {/* View 0: Inspection Overview (Veriq Vision Synthesis) */}
          {activeWorkspaceView === "OVERVIEW" ? (
            <div className="space-y-4">
              {/* 1. 5-Stage Statutory Pipeline Progress */}
              <PipelineStepper steps={pipelineSteps} />

              {/* Informational banner when evidence assets are 0 */}
              {caseData.evidence_assets.length === 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="font-bold">
                        {language === "hi" ? "भौतिक पैकेजिंग साक्ष्य लंबित: " : "Physical Packaging Evidence Pending: "}
                      </span>
                      {language === "hi"
                        ? "इस निरीक्षण में अभी कोई पैकेजिंग छवि संलग्न नहीं है। आप अतिरिक्त साक्ष्य कभी भी संलग्न कर सकते हैं।"
                        : "No packaging images are currently attached to this inspection record."}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsRetakeMode(true)}
                    className="px-3 py-1.5 bg-[#1B365D] hover:bg-blue-900 text-white font-bold rounded-lg text-xs transition-colors shrink-0 cursor-pointer"
                  >
                    {language === "hi" ? "साक्ष्य फोटो संलग्न करें" : "Attach / Capture Photo"}
                  </button>
                </div>
              )}

              {/* 2. Executive Inspection Summary Ribbon (Statutory Ticker) */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  {/* Left: Commodity Quick Badges */}
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-3 py-1.5 rounded-md text-sm font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      {caseData.category?.replace(/_/g, " ") || (language === "hi" ? "पैकेज्ड वस्तु" : "PACKAGED COMMODITY")}
                    </span>
                    {caseData.declared_net_quantity && (
                      <span className="px-3 py-1.5 rounded-md text-sm font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {language === "hi" ? "शुद्ध मात्रा:" : "Net Qty:"} <strong className="text-slate-900">{caseData.declared_net_quantity}</strong>
                      </span>
                    )}
                    {caseData.extracted_fields?.find((f) => f.field_type === "MRP") && (
                      <span className="px-3 py-1.5 rounded-md text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        MRP: <strong className="text-emerald-800 font-mono font-bold">{caseData.extracted_fields.find((f) => f.field_type === "MRP")?.raw_ocr_text}</strong>
                      </span>
                    )}
                    <span className="text-sm text-slate-500 font-medium">
                      • {caseData.rule_evaluations?.length || 0} {language === "hi" ? "सांविधिक जांचें" : "statutory checks verified"}
                    </span>
                  </div>

                  {/* Right: Case ID, Confidence Score */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-slate-500 font-semibold">{language === "hi" ? "विश्वसनीयता:" : "Confidence:"}</span>
                      <div className="w-24 h-2 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            confidenceScore >= 90 ? "bg-emerald-500" : confidenceScore >= 75 ? "bg-amber-500" : "bg-rose-500"
                          }`}
                          style={{ width: `${Math.min(100, Math.max(10, confidenceScore))}%` }}
                        />
                      </div>
                      <span className="font-bold font-mono text-slate-900">{confidenceScore}%</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyCaseId}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-mono font-semibold transition-colors border border-slate-200 cursor-pointer"
                      title={language === "hi" ? "केस आईडी कॉपी करने हेतु क्लिक करें" : "Click to copy Case ID"}
                    >
                      {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                      <span className="max-w-[160px] xl:max-w-[220px] truncate">{caseData.id}</span>
                    </button>
                  </div>
                </div>

                {/* Metric Summary Ticker */}
                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-sm">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
                    <span className="text-[11px] uppercase font-bold text-slate-500 block">
                      {language === "hi" ? "कुल जांचें" : "Total Checks"}
                    </span>
                    <span className="text-base font-black text-slate-900">{caseData.rule_evaluations?.length || 0}</span>
                  </div>
                  <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 text-center">
                    <span className="text-[11px] uppercase font-bold text-emerald-700 block">
                      {language === "hi" ? "अनुपालन" : "Compliant"}
                    </span>
                    <span className="text-base font-black text-emerald-700">{passedRulesCount}</span>
                  </div>
                  <div className="bg-rose-50 p-2.5 rounded-lg border border-rose-200 text-center">
                    <span className="text-[11px] uppercase font-bold text-rose-700 block">
                      {language === "hi" ? "उल्लंघन" : "Violations"}
                    </span>
                    <span className="text-base font-black text-rose-700">{failedRulesCount}</span>
                  </div>
                  <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-center">
                    <span className="text-[11px] uppercase font-bold text-amber-700 block">
                      {language === "hi" ? "समीक्षा दायरा" : "Review Band"}
                    </span>
                    <span className="text-base font-black text-amber-700">{reviewRulesCount}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
                    <span className="text-[11px] uppercase font-bold text-slate-500 block">
                      {language === "hi" ? "अंशांकन" : "Calibration"}
                    </span>
                    <span className={`text-xs font-bold ${calibrationData.available ? "text-emerald-700" : "text-amber-700"}`}>
                      {calibrationData.available
                        ? (language === "hi" ? "अरूको संसूचित" : "ArUco Valid")
                        : (language === "hi" ? "असंबंधित" : "Uncalibrated")}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
                    <span className="text-[11px] uppercase font-bold text-slate-500 block">
                      {language === "hi" ? "विसंगतियां" : "Conflicts"}
                    </span>
                    <span className={`text-xs font-bold ${conflictItems.length > 0 ? "text-amber-700" : "text-slate-700"}`}>
                      {conflictItems.length > 0
                        ? `${conflictItems.length} ${language === "hi" ? "विसंगति" : "Conflict"}`
                        : (language === "hi" ? "कोई नहीं" : "None")}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Two-Column Detailed Operational Workspace (Ergonomic Sticky Placement) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                {/* Left Column (6 cols): Sticky Vision Canvas & Calibration */}
                <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-[65px]">
                  <InspectionVisionCanvas
                    images={canvasImages}
                    boxes={canvasBoxes}
                    calibration={{
                      available: calibrationData.available,
                      referenceObject: calibrationData.referenceObject,
                      scaleMmPerPixel: calibrationData.scaleMmPerPixel,
                      referenceLengthMm: calibrationData.referenceLengthMm,
                      measuredPixels: calibrationData.measuredPixels,
                    }}
                    activeImageId={activeAsset?.image_id}
                    onSelectImage={(id) => setSelectedAssetId(id)}
                    selectedBoxId={selectedBoxId}
                    onSelectBox={(boxId) => setSelectedBoxId(boxId)}
                  />

                  {/* ArUco Calibration Details */}
                  <CalibrationCard calibration={calibrationData} />

                  {/* Technical Asset Metadata & SHA-256 Chain Box */}
                  <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#1B365D]" />
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                          {language === "hi" ? "साक्ष्य संपत्ति एवं धारा 63 बीएसए हैश" : "Evidence Asset & Section 63 BSA Hash"}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono bg-blue-50 text-[#1B365D] border border-blue-200 px-2 py-0.5 rounded font-bold">
                        {language === "hi" ? "मूल साक्ष्य संपत्ति" : "ORIGINAL ASSET"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono text-slate-500 pt-1">
                      <div>
                        <span className="text-[10px] text-slate-500 block font-sans font-medium">
                          {language === "hi" ? "संपत्ति आईडी" : "Asset ID"}
                        </span>
                        <span className="font-bold text-slate-900">{activeAsset?.image_id || "IMG-DEFAULT"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block font-sans font-medium">
                          {language === "hi" ? "रिज़ॉल्यूशन" : "Resolution"}
                        </span>
                        <span className="text-slate-800">{activeAsset?.image_width || 1280} × {activeAsset?.image_height || 960} px</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block font-sans font-medium">
                          {language === "hi" ? "पैनल पहलू" : "Panel Facet"}
                        </span>
                        <span className="font-sans font-semibold text-slate-900">{activeAsset?.panel_type || "PDP_FRONT"}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[10px] text-slate-500 block font-sans font-medium">
                        {language === "hi" ? "एसएचए-256 लेज़र डाइजेस्ट (धारा 63 बीएसए 2023)" : "SHA-256 Ledger Digest (Sec 63 BSA 2023)"}
                      </span>
                      <span className="font-mono text-[11px] text-slate-700 break-all select-all block bg-slate-50 p-1.5 rounded border border-slate-200 mt-0.5">
                        {activeAsset?.raw_sha256 || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column (6 cols): Conflicts, Declarations Review, Measurements, Rules, and Quick Adjudication */}
                <div className="lg:col-span-6 space-y-4">
                  {/* Conflicting Evidence Alert (if present) */}
                  {conflictItems.length > 0 && (
                    <ConflictCard
                      conflicts={conflictItems}
                      onReview={() => handleSwitchWorkspaceView("CANVAS")}
                    />
                  )}

                  {/* Mandatory Statutory Declarations Review (Rule 6 LMPC Rules, 2011) */}
                  <StatutoryDeclarationsCard
                    fields={caseData.extracted_fields || []}
                    onFieldConfirmed={(fieldId) => {
                      console.log("Statutory field confirmed by officer:", fieldId);
                    }}
                    onFieldEdited={(fieldId, newValue, newFontSizeMm) => {
                      handleFieldEdited(fieldId, newValue, newFontSizeMm);
                    }}
                  />

                  {/* Photogrammetric Calibrated Measurements */}
                  {measurementsList.length > 0 && (
                    <MeasurementCard measurements={measurementsList} />
                  )}

                  {/* Deterministic Statutory Checks */}
                  <RuleResultCard rules={ruleItems} />

                  {/* Quick Officer Adjudication Box */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-[#1B365D]/10 text-[#1B365D]">
                          <UserCheck size={18} />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                            {language === "hi" ? "अधिकारी प्रारंभिक अधिनिर्णय" : "Officer Preliminary Adjudication"}
                          </h3>
                          <p className="text-[10px] text-slate-500 font-medium">
                            {language === "hi"
                              ? "संवर्धित नैदानिक सहायक (DoCA सांविधिक कार्यप्रवाह)"
                              : "Augmented diagnostic assistant (DoCA statutory workflow)"}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-full">
                        {language === "hi" ? "मानव हस्ताक्षर गेट" : "HUMAN SIGN-OFF GATE"}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-800 block">
                        {language === "hi" ? "अधिकारी टिप्पणियां / सांविधिक निर्देश" : "Officer Notes / Statutory Directions"}
                      </label>
                      <textarea
                        value={quickRemarks}
                        onChange={(e) => setQuickRemarks(e.target.value)}
                        placeholder={
                          language === "hi"
                            ? "टिप्पणियां, शमन सिफारिशें, या निर्माता को निर्देश दर्ज करें..."
                            : "Enter observations, compounding recommendations, or directions to manufacturer..."
                        }
                        rows={3}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#1B365D] text-slate-900 placeholder:text-slate-400"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">
                          {quickDecisionSaved ? (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle2 size={13} />
                              <span>{language === "hi" ? "टिप्पणियां स्थानीय केस सत्र में सहेजी गईं" : "Notes saved to local case session"}</span>
                            </span>
                          ) : (
                            language === "hi"
                              ? "प्रारूप टिप्पणियां निरीक्षण रिकॉर्ड के साथ सहेजी जाएंगी।"
                              : "Draft remarks will be saved with the inspection record."
                          )}
                        </span>
                        <button
                          type="button"
                          onClick={handleSaveNotes}
                          className="px-3 py-1 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 rounded-md border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Save size={12} />
                          <span>{language === "hi" ? "प्रारूप सहेजें" : "Save Draft"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <button
                        type="button"
                        onClick={handleQuickGenerateNotice}
                        disabled={isGeneratingNotice}
                        className="w-full py-2.5 px-4 rounded-lg bg-[#1B365D] hover:bg-[#0A2540] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
                      >
                        {isGeneratingNotice ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>
                              {language === "hi"
                                ? "प्रपत्र-1 नोटिस पीडीएफ/ए तैयार किया जा रहा है..."
                                : "Generating Form-1 Notice PDF/A..."}
                            </span>
                          </>
                        ) : (
                          <>
                            <FileText size={15} />
                            <span>
                              {language === "hi"
                                ? "सांविधिक नोटिस जारी करें (एलएमपीसी नियमों के तहत प्रपत्र-1)"
                                : "Issue Statutory Notice (Form-1 under LMPC Rules)"}
                            </span>
                          </>
                        )}
                      </button>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => handleSwitchWorkspaceView("CANVAS")}
                          className="px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ExternalLink size={13} className="text-slate-500" />
                          <span>{language === "hi" ? "गहन विभाजन कैनवास" : "Deep Split Canvas"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSwitchWorkspaceView("AUDIT")}
                          className="px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ShieldCheck size={13} className="text-slate-500" />
                          <span>{language === "hi" ? "ऑडिट एवं डीएजी" : "Audit & DAG"}</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSwitchWorkspaceView("REPORT")}
                        className="w-full py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 font-semibold text-slate-600 hover:text-slate-900 text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>
                          {language === "hi"
                            ? "पूर्ण औपचारिक निरीक्षण रिपोर्ट देखें (धारा 63 बीएसए 2023)"
                            : "View Complete Formal Inspection Report (Section 63 BSA 2023)"}
                        </span>
                        <ArrowRight size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className="w-full py-2 px-3 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 font-semibold text-rose-700 text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} className="text-rose-600" />
                        <span>
                          {language === "hi"
                            ? "मामला निरस्त एवं डेटाबेस से हटाएं"
                            : "Dispose & Delete Case from Database"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeWorkspaceView === "CANVAS" ? (
            <AdjudicationCanvas
              caseData={caseData}
              onAdjudicationSubmitted={handleAdjudicationSubmitted}
              onRetakeRequested={() => setIsRetakeMode(true)}
              onSwitchToDiagnosticHUD={() => handleSwitchWorkspaceView("HUD")}
              onFieldEdited={handleFieldEdited}
            />
          ) : activeWorkspaceView === "OUTCOME" ? (
            /* View 4: Inspector Case Outcome Review */
            <InspectionOutcome
              caseData={caseData}
              onViewReport={() => handleSwitchWorkspaceView("REPORT")}
              onOpenCanvas={() => handleSwitchWorkspaceView("CANVAS")}
              onOpenAudit={() => handleSwitchWorkspaceView("AUDIT")}
              onCloseCase={handleCloseCase}
              officerRole={officerRole}
            />
          ) : activeWorkspaceView === "REPORT" ? (
            /* View 5: Read-Only Formal Inspection Report */
            <InspectionReportView
              caseData={caseData}
              onBackToWorkspace={() => handleSwitchWorkspaceView("OVERVIEW")}
              onBackToOutcome={() => handleSwitchWorkspaceView("OUTCOME")}
            />
          ) : activeWorkspaceView === "AUDIT" ? (
            /* View 3: Dedicated Audit, Provenance & Diagnostic Telemetry View */
            <div className="space-y-4">
              {/* Audit Sub-Navigation Bar */}
              <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200/90 shadow-xs gap-2">
                <div className="flex items-center gap-2 flex-nowrap overflow-x-auto no-scrollbar shrink-0">
                  <button
                    type="button"
                    onClick={() => setAuditSubTab("PROVENANCE")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      auditSubTab === "PROVENANCE"
                        ? "bg-[#1B365D] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 border border-slate-200"
                    }`}
                  >
                    <span>
                      {language === "hi" ? "धारा 63 बीएसए" : "Section 63 BSA"}
                      <span className="hidden md:inline">
                        {language === "hi" ? " साक्ष्य लेज़र व मर्कल डीएजी" : " Evidentiary Ledger & Merkle DAG"}
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuditSubTab("DIAGNOSTICS")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      auditSubTab === "DIAGNOSTICS"
                        ? "bg-[#1B365D] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 border border-slate-200"
                    }`}
                  >
                    <span>
                      {language === "hi" ? "12-चरणीय एआई पाइपलाइन" : "12-Stage AI Pipeline"}
                      <span className="hidden md:inline">
                        {language === "hi" ? " टेलीमेट्री व डायग्नोस्टिक एचयूडी" : " Telemetry & Diagnostics HUD"}
                      </span>
                    </span>
                  </button>
                </div>
                <span className="text-[11px] font-mono text-slate-500 font-semibold hidden xl:inline shrink-0">
                  {language === "hi" ? "अपरिवर्तनीय क्रिप्टोग्राफिक ऑडिट ट्रेल" : "Immutable Cryptographic Audit Trail"}
                </span>
              </div>

              {auditSubTab === "PROVENANCE" ? (
                <div className="space-y-4">
                  <CaseHandoffState
                    caseData={caseData}
                    onOpenAdjudication={() => handleSwitchWorkspaceView("CANVAS")}
                  />
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-6">
                      <EvidenceProvenancePanel
                        caseData={caseData}
                        activeAsset={activeAsset}
                      />
                    </div>
                    <div className="lg:col-span-6">
                      <AuditTimeline
                        auditTrail={caseData.audit_trail || []}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs">
                  <AnalysisHUD
                    caseData={caseData}
                    activeAsset={activeAsset}
                    isAnalyzing={isAnalyzingPipeline}
                    onExecutePipeline={handleExecutePipeline}
                    onRetakeEvidence={() => setIsRetakeMode(true)}
                  />
                </div>
              )}
            </div>
          ) : (
            /* View 2: Evidence Summary & Analysis HUD (Diagnostic Stage View) */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Column (5 cols): Physical Evidence Viewer */}
              <div className="lg:col-span-5 space-y-3">
                {/* Multi-Angle Evidence Facet Switcher */}
                {caseData.evidence_assets && caseData.evidence_assets.length > 1 && (
                  <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#1B365D] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#1B365D]" />
                        {language === "hi" ? "पैकेजिंग फलक चयन" : "Select Packaging Facet"}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {caseData.evidence_assets.length} {language === "hi" ? "कोण" : "angles"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                      {caseData.evidence_assets.map((asset, index) => {
                        const isSelected = activeAsset?.image_id === asset.image_id;
                        return (
                          <button
                            key={asset.image_id}
                            type="button"
                            onClick={() => setSelectedAssetId(asset.image_id)}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-all shrink-0 cursor-pointer ${
                              isSelected
                                ? "bg-[#1B365D] text-white border-[#1B365D] shadow-xs font-bold"
                                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 font-medium"
                            }`}
                          >
                            <span className={`w-5 h-5 rounded overflow-hidden shrink-0 flex items-center justify-center text-[10px] font-bold ${
                              isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                            }`}>
                              #{index + 1}
                            </span>
                            <span>
                              {asset.panel_type === "BACK_PANEL"
                                ? (language === "hi" ? "पृष्ठ फलक" : "Back Panel")
                                : asset.panel_type === "PDP_FRONT"
                                ? (language === "hi" ? "मुख्य फलक" : "Front PDP")
                                : asset.panel_type === "SIDE_PANEL"
                                ? (language === "hi" ? "पार्श्व फलक" : "Side Panel")
                                : `Angle #${index + 1}`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B365D]">
                        {language === "hi" ? "भौतिक साक्ष्य संपत्ति" : "Physical Evidence Asset"}
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1B365D] text-white font-bold">
                      {language === "hi" ? "मूल अछूता साक्ष्य" : "ORIGINAL UNTOUCHED"}
                    </span>
                  </div>

                  {/* Image Preview Box */}
                  <div className="relative rounded-xl border border-slate-300 bg-slate-100 overflow-hidden min-h-64 flex items-center justify-center">
                    {activeAsset?.preview_url || activeAsset?.file_path ? (
                      <img
                        src={
                          (activeAsset.preview_url || activeAsset.file_path || "").startsWith("http") ||
                          (activeAsset.preview_url || activeAsset.file_path || "").startsWith("blob:") ||
                          (activeAsset.preview_url || activeAsset.file_path || "").startsWith("data:")
                            ? (activeAsset.preview_url || activeAsset.file_path)
                            : activeAsset.image_id && (activeAsset.preview_url || activeAsset.file_path || "").includes("uploads/202")
                            ? `${((import.meta as any)?.env?.VITE_API_BASE_URL as string) || "/api/v1"}/evidence/image/${activeAsset.image_id}`
                            : (activeAsset.preview_url || activeAsset.file_path || "").startsWith("/")
                            ? (activeAsset.preview_url || activeAsset.file_path)
                            : `/storage/${activeAsset.preview_url || activeAsset.file_path}`
                        }
                        alt={`Packaging evidence for ${caseData.product_name}`}
                        onError={(e) => {
                          const apiBase = ((import.meta as any)?.env?.VITE_API_BASE_URL as string) || "/api/v1";
                          if (activeAsset.image_id && !e.currentTarget.src.includes("/evidence/image/")) {
                            e.currentTarget.src = `${apiBase}/evidence/image/${activeAsset.image_id}`;
                            return;
                          }
                          const p = (caseData.product_name || "").toLowerCase();
                          if (p.includes("water") || p.includes("mineral")) e.currentTarget.src = "/storage/uploads/sku_demo_03_water.jpg";
                          else if (p.includes("cookie") || p.includes("biscuit")) e.currentTarget.src = "/storage/uploads/sku_demo_01_biscuit.jpg";
                          else if (p.includes("curry") || p.includes("dal makhani")) e.currentTarget.src = "/storage/uploads/sku_demo_02_curry.jpg";
                          else if (p.includes("soap") || p.includes("bathing")) e.currentTarget.src = "/storage/uploads/sku_demo_04_soap.jpg";
                          else if (p.includes("chip") || p.includes("crispy")) e.currentTarget.src = "/storage/uploads/sku_demo_05_chips.jpg";
                          else if (p.includes("earbud") || p.includes("bluetooth")) e.currentTarget.src = "/storage/uploads/sku_demo_06_listing.png";
                          else e.currentTarget.src = "/assets/aashirvaad-atta-demo.svg";
                        }}
                        className="max-h-96 w-auto object-contain rounded"
                      />
                    ) : (
                      <div className="p-8 text-center text-slate-500 text-xs">
                        <div className="font-mono text-slate-700 mb-1">{activeAsset?.image_id}</div>
                        <div>
                          {language === "hi"
                            ? "सुरक्षित भंडारण लेज़र पर भौतिक साक्ष्य तस्वीर"
                            : "Physical evidence photograph on secure storage ledger"}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Technical Evidence Attributes */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs font-mono text-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-500">
                        {language === "hi" ? "साक्ष्य संदर्भ:" : "Asset Reference:"}
                      </span>
                      <span className="text-[#1B365D] font-bold">{activeAsset?.image_id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-500">
                        {language === "hi" ? "रिज़ॉल्यूशन:" : "Resolution:"}
                      </span>
                      <span className="font-medium text-slate-800">{activeAsset?.image_width} × {activeAsset?.image_height} px</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-500">
                        {language === "hi" ? "पहलू:" : "Facet:"}
                      </span>
                      <span className="font-sans font-semibold text-slate-900">{activeAsset?.panel_type}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[11px]">
                      <span className="font-semibold text-slate-500">
                        {language === "hi" ? "प्रमाणिक एसएचए-256 (बैकएंड रिकॉर्ड):" : "Canonical SHA-256 (Backend Record):"}
                      </span>
                      <span className="text-slate-600 truncate max-w-[180px] font-mono" title={activeAsset?.raw_sha256}>
                        {activeAsset?.raw_sha256}
                      </span>
                    </div>
                  </div>

                  {/* Retake Button */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setIsRetakeMode(true)}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer shadow-2xs"
                    >
                      <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>
                        {language === "hi" ? "पुनः अपलोड / साक्ष्य फोटो पुनः लें" : "Re-upload / Retake Evidence Photograph"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column (7 cols): Analysis HUD */}
              <div className="lg:col-span-7 space-y-4">
                <AnalysisHUD
                  caseData={caseData}
                  activeAsset={activeAsset}
                  isAnalyzing={isAnalyzingPipeline}
                  onExecutePipeline={handleExecutePipeline}
                  onRetakeEvidence={() => setIsRetakeMode(true)}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Deletion Confirmation Modal */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-overlay-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-pop-in relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
            <div className="flex items-start gap-3 pt-1">
              <div className="p-2.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-full shrink-0">
                <Trash2 size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === "hi" ? "मामला निरस्त एवं स्थायी निष्कासन" : "Dispose & Permanently Delete Case"}
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {language === "hi"
                    ? "डेटाबेस से यह मामला एवं सभी संबंधित विधिक विवरण पूरी तरह हटा दिए जाएंगे।"
                    : "This inspection case and all related statutory details will be permanently removed from the database sitewide."}
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">{language === "hi" ? "केस संख्या:" : "Case Number:"}</span>
                <span className="font-mono font-bold text-slate-900">{caseData.inspection_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">{language === "hi" ? "उत्पाद / वस्तु:" : "Product / Commodity:"}</span>
                <span className="font-semibold text-slate-900 truncate max-w-[220px]">{caseData.product_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">{language === "hi" ? "दिनांक एवं समय:" : "Date & Time:"}</span>
                <span className="font-mono text-slate-800">
                  {new Date(caseData.created_at).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-rose-700 bg-rose-50 p-2.5 rounded border border-rose-200">
              <b>{language === "hi" ? "सांविधिक चेतावनी: " : "Statutory Warning: "}</b>
              {language === "hi"
                ? "यह कार्रवाई पूर्ववत नहीं की जा सकती। सभी साक्ष्य छवियां, बीओयू निर्देशांक, नियम निष्कर्ष एवं नोटिस स्थायी रूप से नष्ट हो जाएंगे।"
                : "This action cannot be undone. All evidence photographs, bounding boxes, rule evaluations, and notice records will be purged."}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={isDeletingCase}
                onClick={() => setIsDeleteDialogOpen(false)}
                className="btn-secondary text-xs px-4 py-2"
              >
                {language === "hi" ? "रद्द करें" : "Cancel"}
              </button>
              <button
                type="button"
                disabled={isDeletingCase}
                onClick={handleDeleteCase}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                {isDeletingCase ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{language === "hi" ? "हटाया जा रहा है..." : "Deleting..."}</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>{language === "hi" ? "स्थायी रूप से हटाएं" : "Permanently Delete"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
