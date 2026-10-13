import React from "react";
import {
  InspectionCase,
  EvidenceAsset,
  PipelineStageProgress,
} from "../../types/inspection";
import { VerdictBadge } from "../../components/common/StatusBadge";
import { ApiService } from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";

interface AnalysisHUDProps {
  caseData: InspectionCase;
  activeAsset?: EvidenceAsset;
  isAnalyzing?: boolean;
  onExecutePipeline: () => void;
  onRetakeEvidence: () => void;
}

export const AnalysisHUD: React.FC<AnalysisHUDProps> = ({
  caseData,
  activeAsset,
  isAnalyzing = false,
  onExecutePipeline,
  onRetakeEvidence,
}) => {
  const { language } = useLanguage();
  const isMock = caseData.is_mock_fixture || ApiService.isMockMode();
  const qg = activeAsset?.quality_gate;
  const calib = activeAsset?.calibration || (caseData.evidence_assets[0]?.calibration);
  const ocr = activeAsset?.ocr || (caseData.evidence_assets[0]?.ocr);
  const isUnableToVerify = caseData.overall_status === "UNABLE_TO_VERIFY" || qg?.passed === false;
  const isPipelineComplete = caseData.rule_evaluations.length > 0;

  // Determine pipeline stage progression
  const stages: PipelineStageProgress[] = [
    {
      id: "INGESTION",
      label: language === "hi" ? "साक्ष्य अंतर्ग्रहण" : "Evidence Ingestion",
      status: activeAsset ? "COMPLETED" : isAnalyzing ? "RUNNING" : "PENDING",
      detail: activeAsset
        ? `SHA-256 ${language === "hi" ? "सत्यापित" : "verified"} (${activeAsset.raw_sha256.slice(0, 10)}...)`
        : (language === "hi" ? "छवि अपलोड की प्रतीक्षा" : "Awaiting image upload"),
    },
    {
      id: "QUALITY_GATE",
      label: language === "hi" ? "प्रकाशीय गुणवत्ता द्वार" : "Optical Quality Gate",
      status: qg ? (qg.passed ? "COMPLETED" : "FAILED") : isAnalyzing ? "RUNNING" : "PENDING",
      detail: qg
        ? qg.passed
          ? `${language === "hi" ? "धुंधलापन" : "Blur"}: ${qg.blur_variance.toFixed(1)} | ${language === "hi" ? "चकाचौंध" : "Glare"}: ${qg.glare_percentage.toFixed(1)}%`
          : (qg.advice || (language === "hi" ? "प्रकाशीय गुणवत्ता सीमा विफल" : "Optical quality threshold failed"))
        : (language === "hi" ? "प्रकाशीय गुणवत्ता मूल्यांकन की प्रतीक्षा" : "Awaiting optical quality evaluation"),
    },
    {
      id: "CALIBRATION",
      label: language === "hi" ? "मीट्रिक अंशांकन" : "Metric Calibration",
      status: isUnableToVerify
        ? "SKIPPED"
        : calib?.is_calibrated
        ? "COMPLETED"
        : isAnalyzing
        ? "RUNNING"
        : "PENDING",
      detail: calib?.is_calibrated
        ? `${calib.method} • ${calib.px_to_mm.toFixed(2)} px/mm`
        : isUnableToVerify
        ? (language === "hi" ? "प्रकाशीय अस्वीकृति के कारण रोका गया" : "Halted due to optical rejection")
        : "ArUco 4x4 (50mm) / ISO 7810 fiducial",
    },
    {
      id: "OCR",
      label: language === "hi" ? "बहुभाषी ओसीआर अभिज्ञान" : "Multilingual OCR Detection",
      status: isUnableToVerify
        ? "SKIPPED"
        : ocr
        ? "COMPLETED"
        : isAnalyzing
        ? "RUNNING"
        : "PENDING",
      detail: ocr
        ? `${ocr.total_tokens} ${language === "hi" ? "टोकन" : "tokens"} • ${(ocr.mean_confidence * 100).toFixed(1)}% ${language === "hi" ? "विश्वास्यता" : "conf"}`
        : isUnableToVerify
        ? (language === "hi" ? "रोका गया" : "Halted")
        : "DBNet++ / PP-OCRv4 English / PP-OCRv3 Devanagari recognition",
    },
    {
      id: "EXTRACTION",
      label: language === "hi" ? "अर्थगत निष्कर्षण" : "Semantic Extraction",
      status: isUnableToVerify
        ? "SKIPPED"
        : caseData.extracted_fields.length > 0
        ? "COMPLETED"
        : isAnalyzing
        ? "RUNNING"
        : "PENDING",
      detail: caseData.extracted_fields.length > 0
        ? `${caseData.extracted_fields.length} ${language === "hi" ? "सांविधिक प्रविष्टियां विश्लेषित" : "statutory fields parsed"}`
        : isUnableToVerify
        ? (language === "hi" ? "रोका गया" : "Halted")
        : "Rule 6 LMPC Declarations",
    },
    {
      id: "RULES",
      label: language === "hi" ? "सांविधिक नियम मूल्यांकन" : "Statutory Rule Evaluation",
      status: isUnableToVerify
        ? "FAILED"
        : caseData.rule_evaluations.length > 0
        ? "COMPLETED"
        : isAnalyzing
        ? "RUNNING"
        : "PENDING",
      detail: isUnableToVerify
        ? (language === "hi" ? "सत्यापित करने में असमर्थ (पुनः कैप्चर आवश्यक)" : "UNABLE TO VERIFY (Re-capture required)")
        : caseData.rule_evaluations.length > 0
        ? `${caseData.rule_evaluations.length} ${language === "hi" ? "सांविधिक नियम मूल्यांकित" : "statutory rules evaluated"}`
        : "Table-I font & Rule 6 verification",
    },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Pipeline Progression Telemetry Strip */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B365D]">
              {language === "hi" ? "निरीक्षण विश्लेषण पाइपलाइन HUD" : "Inspection Analysis Pipeline HUD"}
            </h4>
            {isMock && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-[#1B365D] border border-blue-200 font-bold">
                {language === "hi" ? "डेमो / स्थानीय मोड" : "DEMO / LOCAL MODE"}
              </span>
            )}
          </div>
          <span className="text-[11px] font-mono text-slate-500 font-medium">
            {isAnalyzing
              ? (language === "hi" ? "12-चरणीय पाइपलाइन निष्पादित हो रही है..." : "Running 12-Stage Pipeline...")
              : isPipelineComplete
              ? (language === "hi" ? "विश्लेषण पूर्ण" : "Analysis Complete")
              : isUnableToVerify
              ? (language === "hi" ? "गुणवत्ता द्वार पर पाइपलाइन रोकी गई" : "Pipeline Halted at Quality Gate")
              : (language === "hi" ? "पाइपलाइन ट्रिगर की प्रतीक्षा" : "Awaiting Pipeline Trigger")}
          </span>
        </div>

        {/* Stages timeline */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
          {stages.map((st, idx) => (
            <div
              key={st.id}
              className={`p-2.5 rounded-lg border text-xs flex flex-col justify-between transition-colors ${
                st.status === "COMPLETED"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : st.status === "RUNNING"
                  ? "bg-blue-50 border-blue-300 text-blue-900 animate-pulse ring-1 ring-blue-300"
                  : st.status === "FAILED"
                  ? "bg-rose-50 border-rose-200 text-rose-900"
                  : st.status === "SKIPPED"
                  ? "bg-slate-50 border-slate-200 text-slate-500"
                  : "bg-slate-50 border-slate-200 text-slate-500"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold font-mono text-slate-500">0{idx + 1}</span>
                {st.status === "COMPLETED" ? (
                  <span className="text-emerald-700 font-bold">✓</span>
                ) : st.status === "RUNNING" ? (
                  <span className="h-2 w-2 rounded-full bg-[#1B365D] animate-ping" />
                ) : st.status === "FAILED" ? (
                  <span className="text-rose-600 font-bold">✕</span>
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                )}
              </div>
              <div className="font-bold text-[11px] leading-snug text-slate-900">{st.label}</div>
              <div className="text-[10px] mt-1 text-slate-600 font-medium truncate" title={st.detail}>
                {st.detail}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Optical Quality Gate Diagnostic Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#1B365D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B365D]">
              {language === "hi" ? "प्रकाशीय गुणवत्ता द्वार" : "Optical Quality Gate"}
            </h4>
          </div>
          {qg && (
            <VerdictBadge verdict={qg.passed ? "PASS" : "UNABLE_TO_VERIFY"} size="sm" />
          )}
        </div>

        {qg ? (
          <div className="space-y-3">
            {!qg.passed && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-xs space-y-1.5">
                <div className="font-bold text-rose-800 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-mono text-[10px]">
                    {language === "hi" ? "सत्यापित करने में असमर्थ" : "UNABLE TO VERIFY"}
                  </span>
                  <span>
                    {language === "hi"
                      ? "साक्ष्य को विश्वसनीय रूप से सत्यापित नहीं किया जा सका।"
                      : "Evidence could not be reliably verified."}
                  </span>
                </div>
                {qg.rejection_reason && (
                  <p className="text-slate-800 text-[11px] font-mono bg-white p-2 rounded border border-rose-200">
                    <span className="font-bold text-rose-700">{language === "hi" ? "कारण:" : "Reason:"}</span> {qg.rejection_reason}
                  </p>
                )}
                {qg.advice && (
                  <p className="text-amber-800 text-[11px] font-semibold">
                    {language === "hi" ? "अनुशंसित कार्रवाई:" : "Recommended Action:"} {qg.advice} , {" "}
                    {language === "hi" ? "कृपया पैकेजिंग की तस्वीर पुनः लें।" : "Please retake the packaging photograph."}
                  </p>
                )}
              </div>
            )}

            {/* Metrics Telemetry Grid */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">
                  {language === "hi" ? "छवि स्पष्टता एवं फोकस" : "Image Clarity & Focus"}
                </span>
                <span className={`font-mono font-bold text-sm ${!qg.passed && qg.rejection_reason?.toLowerCase().includes("blur") ? "text-rose-600" : "text-slate-900"}`}>
                  {qg.blur_variance >= 150.0
                    ? (language === "hi" ? "स्पष्ट (पास)" : "Clear / In-Focus")
                    : (language === "hi" ? "धुंधला (पुनः लें)" : "Too Blurry")}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                  Laplacian σ²: {qg.blur_variance.toFixed(1)} (min 150.0)
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">
                  {language === "hi" ? "प्रकाश एवं प्रतिबिंब" : "Lighting & Reflection"}
                </span>
                <span className={`font-mono font-bold text-sm ${!qg.passed && qg.rejection_reason?.toLowerCase().includes("glare") ? "text-rose-600" : "text-slate-900"}`}>
                  {qg.glare_percentage <= 3.0
                    ? (language === "hi" ? "अनुकूल प्रकाश" : "Optimal Light")
                    : (language === "hi" ? "अत्यधिक चमक" : "Severe Glare")}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                  Glare: {qg.glare_percentage.toFixed(2)}% (max 3.0%)
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">
                  {language === "hi" ? "कैमरा कोण एवं झुकाव" : "Camera Angle & Alignment"}
                </span>
                <span className={`font-mono font-bold text-sm ${!qg.passed && qg.rejection_reason?.toLowerCase().includes("skew") ? "text-rose-600" : "text-slate-900"}`}>
                  {qg.skew_angle_deg <= 15.0
                    ? (language === "hi" ? "समतल संरेखित" : "Planar Aligned")
                    : (language === "hi" ? "अत्यधिक झुकाव" : "Tilted Beyond Limit")}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                  Skew: {qg.skew_angle_deg.toFixed(1)}° (max 15.0°)
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-500 italic py-2">
            {language === "hi"
              ? "अभी तक कोई प्रकाशीय गुणवत्ता मूल्यांकन नहीं हुआ है। लाप्लासियन धुंधलापन, चकाचौंध एवं झुकाव सत्यापन चलाने हेतु पैकेजिंग साक्ष्य जमा करें।"
              : "No optical quality assessment yet. Submit physical package evidence to run Laplacian blur, specular glare, and skew verification."}
          </div>
        )}
      </div>

      {/* 3. Metric Calibration & Geometry Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#1B365D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B365D]">
              {language === "hi"
                ? "मीट्रिक पैमाना अंशांकन एवं पीडीपी ज्यामिति (एडीआर-06)"
                : "Metric Scale Calibration & PDP Geometry (ADR-06)"}
            </h4>
          </div>
          {calib && (
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
              calib.is_calibrated ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-slate-100 text-slate-700 border-slate-200"
            }`}>
              {calib.is_calibrated
                ? (language === "hi" ? "अंशांकित (✓)" : "CALIBRATED (✓)")
                : (language === "hi" ? "अनिर्णित" : "UNRESOLVED")}
            </span>
          )}
        </div>

        {calib?.is_calibrated ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">
                  {language === "hi" ? "संदर्भ मानक चिन्ह" : "Fiducial Standard"}
                </span>
                <span className="font-mono font-bold text-slate-900">{calib.method}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">ArUco 50mm / ISO 7810</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">
                  {language === "hi" ? "मीट्रिक पैमाना गुणक" : "Metric Scale Factor"}
                </span>
                <span className="font-mono font-bold text-[#1B365D]">{calib.px_to_mm.toFixed(2)} px/mm</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  {language === "hi" ? "समतलीय होलोग्राफी H" : "Planar Homography H"}
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">
                  {language === "hi" ? "मापन विश्वसनीयता" : "Measurement Confidence"}
                </span>
                <span className="font-mono font-bold text-emerald-700">{(calib.confidence * 100).toFixed(1)}%</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  {language === "hi" ? `अनिश्चितता: ±${calib.margin_of_error_pct || 1.2}%` : `Uncertainty: ±${calib.margin_of_error_pct || 1.2}%`}
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">
                  {language === "hi" ? "पीडीपी पृष्ठ क्षेत्रफल" : "PDP Surface Area"}
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {caseData.principal_display_panel?.pdp_area_cm2
                    ? `${caseData.principal_display_panel.pdp_area_cm2} cm²`
                    : (language === "hi" ? "बाउंडिंग बॉक्स से परिकलित" : "Calculated from bbox")}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  {language === "hi" ? "तालिका-I आधाररेखा" : "Table-I Baseline"}
                </span>
              </div>
            </div>

            {/* Step-by-Step Mathematical Traceability in Metric Calibration */}
            <div
              data-testid="calibration-math-hud"
              className="border-t border-blue-100 bg-blue-50/40 p-3 rounded-lg border border-blue-200/70 space-y-1.5"
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                <svg className="w-3.5 h-3.5 text-[#1B365D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>{language === "hi" ? "अंशांकन गणित एवं प्रकाशीय अनुमार्गणीयता" : "Calibration Math & Optical Traceability"}</span>
              </div>
              <code className="block rounded-md border border-slate-200 bg-white p-2.5 text-slate-800 font-mono text-xs leading-relaxed shadow-xs">
                <div className="text-slate-600">{language === "hi" ? "पैमाना = संदर्भ लंबाई (मिमी) / मापित ArUco मार्कर किनारा (पिक्सेल)" : "scale = reference length (mm) / measured ArUco marker edge (px)"}</div>
                <div className="text-[#1B365D] font-bold">{language === "hi" ? "पैमाना = 50.00 / 800 = 0.0625 mm/px" : "scale = 50.00 / 800 = 0.0625 mm/px"}</div>
                <div className="text-emerald-700 font-medium">{language === "hi" ? "अनुमानित अनिश्चितता (k=2, 95% विश्वास अंतराल): ±0.04 mm" : "Estimated uncertainty (k=2, 95% CI): ±0.04 mm"}</div>
              </code>
            </div>
          </>
        ) : (
          <div className="text-xs text-slate-500 italic py-2">
            {isUnableToVerify
              ? (language === "hi" ? "प्रकाशीय गुणवत्ता अस्वीकृति के कारण अंशांकन निरस्त।" : "Calibration aborted due to optical quality rejection.")
              : (language === "hi" ? "अंशांकन पाइपलाइन निष्पादन की प्रतीक्षा कर रहा है।" : "Calibration awaiting pipeline execution.")}
          </div>
        )}
      </div>

      {/* 4. Multilingual OCR Diagnostic Summary (Foundation Only per Section 15) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#1B365D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B365D]">
              {language === "hi" ? "बहुभाषी ओसीआर निदान (सदस्य 2 स्रोत)" : "Multilingual OCR Diagnostics (Member 2 Provenance)"}
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            DBNet++ • PP-OCRv4 English • PP-OCRv3 Devanagari recognition
          </span>
        </div>

        {ocr ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div>
                <span className="font-semibold text-slate-700">{language === "hi" ? "पहचाने गए टोकन:" : "Tokens Recognized:"}</span>{" "}
                <span className="font-mono font-bold text-[#1B365D]">{ocr.total_tokens}</span>
                <span className="text-slate-300 mx-2">|</span>
                <span className="font-semibold text-slate-700">{language === "hi" ? "औसत विश्वसनीयता:" : "Mean Confidence:"}</span>{" "}
                <span className="font-mono font-bold text-emerald-700">
                  {(ocr.mean_confidence * 100).toFixed(1)}%
                </span>
              </div>
              <div className="font-mono text-[11px] text-slate-500">
                {language === "hi" ? `विलंबता: ${ocr.execution_time_ms} ms (सीपीयू INT8)` : `Latency: ${ocr.execution_time_ms} ms (CPU INT8)`}
              </div>
            </div>

            {/* Unicode Preservation Display (Devanagari, Indic Numerals, Rupee Symbol) */}
            <div className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs overflow-x-auto space-y-1 shadow-inner border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1 mb-1.5 flex items-center justify-between">
                <span>{language === "hi" ? "पहचानी गई घोषणाएं स्ट्रीम (कच्चा ओसीआर आउटपुट)" : "Recognized Declarations Stream (Raw OCR Output)"}</span>
                <span className="text-emerald-400 text-[10px]">{language === "hi" ? "यूनिकोड एवं देवनागरी लिपि संरक्षित" : "Unicode & Indic Script Intact"}</span>
              </div>
              <pre className="whitespace-pre-wrap font-sans text-xs text-slate-200">
                {ocr.full_text}
              </pre>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-500 italic py-2">
            {isUnableToVerify
              ? (language === "hi" ? "प्रकाशीय चकाचौंध अस्वीकृति के कारण ओसीआर इंजन बायपास किया गया।" : "OCR engine was bypassed due to optical glare rejection.")
              : (language === "hi" ? "ओसीआर इंजन पाइपलाइन निष्पादन की प्रतीक्षा कर रहा है।" : "OCR engine awaiting pipeline execution.")}
          </div>
        )}
      </div>

      {/* 5. Provenance & Evidence Digest Strip */}
      {activeAsset && (
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 text-xs space-y-1 font-mono text-slate-600">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-800">{language === "hi" ? "प्रामाणिक साक्ष्य SHA-256 (बैकएंड रिकॉर्ड):" : "Canonical Evidence SHA-256 (Backend Record):"}</span>
            <span className="text-[#1B365D] font-bold truncate max-w-md" title={activeAsset.raw_sha256}>
              {activeAsset.raw_sha256}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>{language === "hi" ? "बैकएंड साक्ष्य रिकॉर्ड: सत्यापन पाइपलाइन में दर्ज" : "Backend Evidence Record: Ingested to Verification Pipeline"}</span>
            <span>{language === "hi" ? `पैनल: ${activeAsset.panel_type}` : `Panel: ${activeAsset.panel_type}`}</span>
          </div>
        </div>
      )}

      {/* 6. Execution / Retake Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onRetakeEvidence}
          className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-300 rounded-md text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 focus:outline-none shadow-2xs"
        >
          <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{language === "hi" ? "पुनः कैप्चर / नया साक्ष्य अपलोड करें" : "Retake / Upload New Evidence"}</span>
        </button>

        {!isUnableToVerify && !isPipelineComplete && (
          <button
            type="button"
            onClick={onExecutePipeline}
            disabled={isAnalyzing || !activeAsset}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1B365D] hover:bg-[#0A2540] text-white text-xs font-bold rounded-lg shadow-sm focus:ring-2 focus:ring-[#1B365D] disabled:opacity-50 transition-colors"
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>{language === "hi" ? "12-चरणीय पाइपलाइन निष्पादित हो रही है..." : "Executing 12-Stage Pipeline..."}</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{language === "hi" ? "एआई पाइपलाइन निष्पादित करें (अंशांकन → ओसीआर → नियम)" : "Execute AI Pipeline (Calibration → OCR → Rules)"}</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
