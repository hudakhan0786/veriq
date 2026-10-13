import React, { useState, useEffect } from "react";
import { RuleFinding, ExtractedField, OCRToken, OfficerDecision, FindingAdjudication } from "../../types/inspection";
import { VerdictBadge } from "../../components/common/StatusBadge";
import { useLanguage } from "../../context/LanguageContext";
import { Edit3, Check, X } from "lucide-react";

const DEVANAGARI_DIGITS_MAP: Record<string, string> = {
  "०": "0", "१": "1", "२": "2", "३": "3", "४": "4",
  "५": "5", "६": "6", "७": "7", "८": "8", "९": "9",
};

function hasDevanagariNumerals(text: string): boolean {
  return /[०-९]/.test(text);
}

function extractDevanagariNumerals(text: string): string {
  const matches = text.match(/[०-९]+/g);
  return matches ? matches.join(" ") : "";
}

function transliterateDevanagari(text: string): string {
  return text.replace(/[०-९]/g, (char) => DEVANAGARI_DIGITS_MAP[char] || char);
}

function getModelDisplayName(tok: OCRToken, language: string = "en"): string {
  const hasDevanagari = /[\u0900-\u097F]/.test(tok.text);
  if (tok.model_source === "PP-OCRv3_Devanagari" || hasDevanagari || tok.language === "hi") {
    return language === "hi" ? "PP-OCRv3 देवनागरी अभिज्ञान" : "PP-OCRv3 Devanagari recognition";
  }
  if (tok.model_source === "PP-OCRv4_Latin" || tok.language === "en") {
    return language === "hi" ? "PP-OCRv4 अंग्रेजी अभिज्ञान" : "PP-OCRv4 English recognition";
  }
  if (tok.model_source === "DBNet++") {
    return language === "hi" ? "DBNet++ पाठ संसूचन" : "DBNet++ text detection";
  }
  if (tok.model_source === "Tesseract_v5") {
    return language === "hi" ? "टेसरेक्ट v5 बैकअप" : "Tesseract v5 fallback";
  }
  return tok.model_source || (language === "hi" ? "PP-OCRv4 अंग्रेजी अभिज्ञान" : "PP-OCRv4 English recognition");
}

interface FieldDetailPanelProps {
  finding?: RuleFinding;
  field?: ExtractedField;
  tokens: OCRToken[];
  onSelectToken?: (tokenId: string) => void;
  findingAdjudication?: FindingAdjudication;
  caseAdjudication?: OfficerDecision;
  onFieldEdited?: (fieldId: string, newValue: string, newFontSizeMm?: number) => void;
}

export const FieldDetailPanel: React.FC<FieldDetailPanelProps> = ({
  finding,
  field,
  tokens,
  onSelectToken,
  findingAdjudication,
  caseAdjudication,
  onFieldEdited,
}) => {
  const { language } = useLanguage();
  const [isEditingField, setIsEditingField] = useState(false);
  const [editText, setEditText] = useState("");
  const [editFontSize, setEditFontSize] = useState("");

  useEffect(() => {
    setIsEditingField(false);
    if (field) {
      setEditText(field.raw_ocr_text);
      setEditFontSize(field.measured_font_height_mm !== undefined ? String(field.measured_font_height_mm) : "");
    }
  }, [field?.field_id, field?.raw_ocr_text, field?.measured_font_height_mm]);

  const handleStartEdit = () => {
    if (!field) return;
    setEditText(field.raw_ocr_text);
    setEditFontSize(field.measured_font_height_mm !== undefined ? String(field.measured_font_height_mm) : "");
    setIsEditingField(true);
  };

  const handleSaveEdit = () => {
    if (!field || !onFieldEdited) return;
    const parsedH = editFontSize.trim() ? parseFloat(editFontSize) : undefined;
    const validH = (parsedH !== undefined && !isNaN(parsedH) && parsedH > 0) ? Number(parsedH.toFixed(2)) : undefined;
    onFieldEdited(field.field_id, editText, validH);
    setIsEditingField(false);
  };

  if (!finding && !field && tokens.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-slate-500 text-xs italic shadow-xs">
        {language === "hi"
          ? "विधिक साक्ष्य श्रृंखला की जांच हेतु बही से अनुपालन निष्कर्ष अथवा पैकेज से ओसीआर बहुभुज का चयन करें।"
          : "Select a compliance finding from the ledger or an OCR polygon on the physical package to inspect the forensic chain of evidence."}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-4">
      {/* 1. Header: Finding Status & Statutory Citation */}
      <div className="border-b border-slate-200 pb-3 flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">
              {language === "hi" ? "न्यायिक साक्ष्य अभिलेख" : "Forensic Evidence Record"}
            </span>
            {finding?.finding_id && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                #{finding.finding_id}
              </span>
            )}
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-0.5">
            {field?.field_type
              ? field.field_type.replace(/_/g, " ")
              : finding?.field_type
              ? finding.field_type.replace(/_/g, " ")
              : language === "hi"
              ? "घोषणा विश्लेषण"
              : "Declaration Analysis"}
          </h3>
        </div>
        {finding && <VerdictBadge verdict={finding.status as any} size="sm" />}
      </div>

      {/* 2. Special Review / Unable to Verify Guidance Banner */}
      {finding?.status === "REVIEW" && (
        <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-xs space-y-1">
          <div className="font-bold text-amber-900 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{language === "hi" ? "अधिकारी समीक्षा आवश्यक" : "OFFICER REVIEW REQUIRED"}</span>
          </div>
          <p className="text-amber-800 text-[11px] leading-relaxed">
            {finding.discrepancy || (language === "hi" ? "माप सेंसर अनिश्चितता सीमा में आता है। निर्णय से पूर्व भौतिक कैलीपर सत्यापन की अनुशंसा है।" : "Measurement falls within the reported sensor uncertainty band. Physical caliper verification recommended before adjudication.")}
          </p>
        </div>
      )}

      {finding?.status === "UNABLE_TO_VERIFY" && (
        <div className="p-3 bg-slate-100 border border-slate-300 rounded-lg text-xs space-y-1">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{language === "hi" ? "सत्यापन असमर्थ" : "UNABLE TO VERIFY"}</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            {finding.discrepancy || (language === "hi" ? "साक्ष्य अस्पष्ट अथवा अपर्याप्त है। अधिकारी द्वारा पुनः फोटोग्राफी की सलाह दी जाती है।" : "Evidence is degraded or insufficient for automated statutory verification. Officer image recapture advised.")}
          </p>
        </div>
      )}

      {/* 3. Original Automated Finding (Immutable Diagnostic Output) */}
      {finding && (
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1B365D]" />
              {language === "hi" ? "मूल स्वचालित निष्कर्ष (एआई)" : "Original Automated Finding"}
            </h4>
            <span className="text-[10px] font-mono text-slate-500">
              {language === "hi" ? "स्रोत: नियम इंजन (एएसटी)" : "Source: Rule Engine (AST)"}
            </span>
          </div>

          {/* Table-I Font Schedule Statutory Metric Card */}
          {(finding.rule_code?.includes("FONT") || finding.statutory_reference?.includes("Table-I") || field?.measured_font_height_mm) && (
            <div className={`p-3.5 rounded-xl border space-y-2.5 ${
              finding.status === "FAIL"
                ? "bg-rose-50/70 border-rose-200 text-rose-950"
                : finding.status === "REVIEW"
                ? "bg-amber-50/70 border-amber-200 text-amber-950"
                : "bg-emerald-50/70 border-emerald-200 text-emerald-950"
            }`}>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                  <span>
                    {language === "hi" ? "नियम 6(1)(एच) • तालिका-I अंक ऊंचाई अनुसूची" : "Rule 6(1)(h) • Table-I Numeral Height Schedule"}
                  </span>
                </span>
                <span className={`px-2 py-0.5 font-bold rounded text-[10px] font-mono border ${
                  finding.status === "FAIL"
                    ? "bg-rose-100 text-rose-800 border-rose-200"
                    : finding.status === "REVIEW"
                    ? "bg-amber-100 text-amber-900 border-amber-300"
                    : "bg-emerald-100 text-emerald-800 border-emerald-200"
                }`}>
                  {finding.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <div className="text-[10px] text-slate-500 font-semibold">
                    {language === "hi" ? "पीडीपी पृष्ठ क्षेत्रफल" : "PDP Surface Area"}
                  </div>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">
                    {finding.required_value?.match(/\d+(?:\.\d+)?\s*cm[²2]/)?.[0] || "144.0 cm²"}
                  </div>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <div className="text-[10px] text-slate-500 font-semibold">
                    {language === "hi" ? "अनिवार्य न्यूनतम" : "Mandatory Min"}
                  </div>
                  <div className="font-mono font-bold text-emerald-700 mt-0.5">
                    {finding.required_value?.match(/\d+(?:\.\d+)?\s*mm/)?.[0] || "2.50 mm"}
                  </div>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <div className="text-[10px] text-slate-500 font-semibold">
                    {language === "hi" ? "मापी गई ऊंचाई" : "Measured Height"}
                  </div>
                  <div className={`font-mono font-bold mt-0.5 ${
                    finding.status === "FAIL" ? "text-rose-700" : finding.status === "REVIEW" ? "text-amber-700" : "text-emerald-700"
                  }`}>
                    {finding.measured_value || (field?.measured_font_height_mm ? `${field.measured_font_height_mm.toFixed(2)} mm` : "1.84 mm")}
                  </div>
                </div>
              </div>
              <div className={`text-[11px] p-2.5 rounded-lg border leading-relaxed font-medium ${
                finding.status === "FAIL"
                  ? "bg-white text-rose-800 border-rose-200"
                  : finding.status === "REVIEW"
                  ? "bg-white text-amber-900 border-amber-200"
                  : "bg-white text-emerald-800 border-emerald-200"
              }`}>
                {finding.discrepancy || (language === "hi" ? "तालिका-I अनुसूची के अंतर्गत अनुपालित अंक ऊंचाई।" : "Compliant numeral height under Table-I schedule.")}
              </div>
            </div>
          )}

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-500">
                {language === "hi" ? "स्वचालित पाइपलाइन स्थिति:" : "Automated Pipeline Status:"}
              </span>
              <span className="font-bold text-slate-800 px-1.5 py-0.5 rounded bg-white border border-slate-200">
                {finding.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">
                  {language === "hi" ? "मापा गया मान" : "Observed Measurement"}
                </span>
                <span className="font-bold text-slate-900 text-xs">{finding.measured_value}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">
                  {language === "hi" ? "विहित सांविधिक सीमा" : "Prescribed Statutory Threshold"}
                </span>
                <span className="font-semibold text-slate-800 text-xs">{finding.required_value}</span>
              </div>
            </div>

            {finding.discrepancy && (
              <div className="pt-1.5 border-t border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold block font-mono uppercase">
                  {language === "hi" ? "मात्रात्मक विसंगति" : "Quantified Discrepancy"}
                </span>
                <span className="text-slate-800 text-[11px] font-sans font-medium">
                  {finding.discrepancy}
                </span>
              </div>
            )}

            <div className="pt-1.5 border-t border-slate-200 space-y-1">
              <div className="flex items-start justify-between gap-2 text-[11px]">
                <span className="text-slate-500 font-semibold">
                  {language === "hi" ? "सांविधिक संदर्भ:" : "Statutory Reference:"}
                </span>
                <span className="text-[#1B365D] font-bold text-right truncate max-w-xs" title={finding.statutory_reference}>
                  {finding.statutory_reference}
                </span>
              </div>
              {finding.legal_consequence && (
                <div className="flex items-start justify-between gap-2 text-[11px]">
                  <span className="text-slate-500 font-semibold">
                    {language === "hi" ? "विधिक प्रावधान:" : "Legal Provision:"}
                  </span>
                  <span className="text-rose-700 font-semibold text-right truncate max-w-xs" title={finding.legal_consequence}>
                    {finding.legal_consequence}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Officer Adjudication (Human-in-the-Loop Determination) */}
      {(() => {
        const decisionRecord = findingAdjudication || (caseAdjudication ? {
          finding_id: finding?.finding_id || "case_level",
          decision: (caseAdjudication.verdict === "CONFIRM_VIOLATION" ? "CONFIRMED" : caseAdjudication.verdict === "DISMISS_AS_COMPLIANT" ? "DISMISSED" : "RETEST_REQUESTED") as any,
          officer_id: caseAdjudication.officer_id,
          officer_name: caseAdjudication.officer_name,
          badge_number: caseAdjudication.badge_number,
          remarks: caseAdjudication.remarks,
          timestamp_utc: caseAdjudication.timestamp_utc,
          action_order: caseAdjudication.action_order,
        } : undefined);

        return (
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${decisionRecord ? "bg-emerald-600" : "bg-amber-500"}`} />
                {language === "hi" ? "अधिकारी न्यायिक निर्णय (एचआईटीएल)" : "Officer Adjudication (HITL)"}
              </h4>
              <span className="text-[10px] font-mono text-slate-500">
                {decisionRecord
                  ? language === "hi"
                    ? "आधिकारिक विधिक निर्णय"
                    : "Official Determination"
                  : language === "hi"
                  ? "हस्ताक्षर लंबित"
                  : "Pending Sign-off"}
              </span>
            </div>

            {decisionRecord ? (
              <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-600 text-[11px]">
                      {language === "hi" ? "अधिकारी निर्णय:" : "Officer Decision:"}
                    </span>
                    <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] border ${
                      decisionRecord.decision === "CONFIRMED"
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : decisionRecord.decision === "DISMISSED"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}>
                      {decisionRecord.decision === "CONFIRMED" && language === "hi"
                        ? "उल्लंघन पुष्टीकृत"
                        : decisionRecord.decision === "DISMISSED" && language === "hi"
                        ? "अनुपालित मानकर खारिज"
                        : decisionRecord.decision}
                    </span>
                  </div>

                  <span className="font-mono text-[10px] text-slate-500">
                    {new Date(decisionRecord.timestamp_utc).toLocaleString("en-IN", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-800 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 font-sans block uppercase">
                      {language === "hi" ? "निर्णायक अधिकारी" : "Adjudicating Officer"}
                    </span>
                    <span className="font-bold text-slate-900 font-sans">{decisionRecord.officer_name}</span>
                    <span className="text-[10px] text-slate-500 block">Badge: {decisionRecord.badge_number}</span>
                  </div>
                  {decisionRecord.action_order && (
                    <div>
                      <span className="text-[10px] text-slate-500 font-sans block uppercase">
                        {language === "hi" ? "सांविधिक कार्रवाई आदेश" : "Statutory Action Order"}
                      </span>
                      <span className="font-bold text-[#1B365D] text-[10px] truncate block" title={decisionRecord.action_order}>
                        {decisionRecord.action_order}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-1.5 border-t border-emerald-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase font-mono block">
                    {language === "hi" ? "अधिकारी की अनिवार्य टिप्पणी:" : "Mandatory Officer Remarks:"}
                  </span>
                  <p className="mt-0.5 text-slate-800 text-[11px] font-sans italic bg-white p-2.5 rounded-lg border border-emerald-200 leading-relaxed shadow-2xs">
                    "{decisionRecord.remarks}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800">
                  {language === "hi" ? "अधिकारी न्यायिक निर्णय की प्रतीक्षा" : "Awaiting Officer Adjudication"}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {language === "hi"
                    ? "स्वचालित निष्कर्ष केवल नैदानिक सहायता प्रदान करते हैं। निर्णायक अधिकारी के पास पुष्टि करने, खारिज करने अथवा पुनः जांच आदेश देने का सांविधिक अधिकार है।"
                    : "Automated findings provide diagnostic assistance only. The adjudicating officer retains statutory authority to confirm, dismiss, or order re-tests."}
                </p>
              </div>
            )}
          </div>
        );
      })()}

      {/* 4. Extracted Field Details (Rule 6 LMPC Declarations) */}
      {field && (
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {language === "hi" ? "अर्थगत निष्कर्षण अभिलेख" : "Semantic Extraction Record"}
            </h4>
            {onFieldEdited && !isEditingField && (
              <button
                type="button"
                onClick={handleStartEdit}
                className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#1B365D] hover:underline px-2 py-0.5 rounded hover:bg-slate-100 transition-colors"
              >
                <Edit3 size={11} />
                <span>{language === "hi" ? "पाठ व फ़ॉन्ट संशोधित करें" : "Edit Text & Font"}</span>
              </button>
            )}
          </div>

          {isEditingField ? (
            <div className="bg-white p-3.5 rounded-lg border-2 border-[#1B365D]/20 shadow-xs space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-1">
                  {language === "hi" ? "घोषणा पाठ (संशोधन):" : "Declaration Text (Override):"}
                </label>
                {editText.length > 50 ? (
                  <textarea
                    rows={3}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full text-xs font-mono p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#1B365D] focus:border-transparent resize-y"
                  />
                ) : (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full text-xs font-mono p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#1B365D] focus:border-transparent"
                  />
                )}
              </div>

              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 flex items-center gap-3">
                <div className="w-36">
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">
                    {language === "hi" ? "फ़ॉन्ट ऊंचाई (मिमी):" : "Font Height (mm):"}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0.1"
                      max="100"
                      value={editFontSize}
                      onChange={(e) => setEditFontSize(e.target.value)}
                      className="w-full text-xs font-mono p-1.5 pr-8 border border-slate-300 rounded bg-white"
                      placeholder="e.g. 2.50"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono font-bold">
                      mm
                    </span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 leading-tight flex-1">
                  {language === "hi"
                    ? "तालिका-I अनुसूची अनुसार फ़ॉन्ट ऊंचाई संशोधित करें।"
                    : "Override measured font height per Table-I schedule."}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingField(false)}
                  className="px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded"
                >
                  {language === "hi" ? "रद्द करें" : "Cancel"}
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1B365D] hover:bg-[#0A2540] text-white text-xs font-bold rounded shadow-xs"
                >
                  <Check size={12} />
                  <span>{language === "hi" ? "सहेजें" : "Save Changes"}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2.5">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block font-mono uppercase">
                  {language === "hi" ? "मूल ओसीआर पाठ (Raw Text)" : "Raw OCR Observed Text"}
                </span>
                <div className="p-2 bg-white rounded border border-slate-200 font-sans text-xs text-slate-900 font-medium shadow-2xs">
                  {field.raw_ocr_text}
                </div>
              </div>

            {/* Devanagari Numeral Normalization Inspection */}
            {hasDevanagariNumerals(field.raw_ocr_text) && (
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between text-[11px] flex-wrap gap-1">
                  <span className="font-bold text-[#1B365D] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1B365D]" />
                    {language === "hi" ? "भारतीय अंक मानकीकरण" : "Indic Numeral Normalization"}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-blue-100 text-[#1B365D] rounded font-semibold border border-blue-200">
                    {language === "hi" ? "निश्चित लिप्यंतरण (०-९ → 0-9)" : "Deterministic Transliteration (०-९ → 0-9)"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                  <div className="bg-white p-2 rounded border border-blue-200 shadow-2xs">
                    <span className="text-[10px] text-slate-500 block font-sans uppercase">
                      {language === "hi" ? "प्राप्त देवनागरी" : "Observed Indic"}
                    </span>
                    <span className="font-bold text-slate-900 text-sm font-sans">{extractDevanagariNumerals(field.raw_ocr_text)}</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-blue-200 shadow-2xs">
                    <span className="text-[10px] text-slate-500 block font-sans uppercase">
                      {language === "hi" ? "मानकीकृत रूप" : "Normalized Standard"}
                    </span>
                    <span className="font-bold text-emerald-700 text-sm">{transliterateDevanagari(extractDevanagariNumerals(field.raw_ocr_text))}</span>
                  </div>
                </div>

                <p className="text-[10px] text-blue-800 italic">
                  {language === "hi"
                    ? "विधिक मापविज्ञान (पैकेज्ड कमोडिटीज) नियमावली की छठी अनुसूची अनुसार निश्चित लिप्यंतरण। यह कोई ओसीआर त्रुटि सुधार नहीं है।"
                    : "Deterministic numeral transliteration per LMPC Sixth Schedule. Not an OCR error correction."}
                </p>
              </div>
            )}

            {/* Structured Normalized Fact */}
            {field.normalized_value && Object.keys(field.normalized_value).length > 0 && (
              <div>
                <span className="text-[10px] text-slate-500 font-bold block font-mono uppercase">
                  {language === "hi" ? "मानकीकृत संरचित तथ्य" : "Normalized Structured Fact"}
                </span>
                <div className="p-2 bg-white rounded border border-slate-200 font-mono text-[11px] text-slate-800 shadow-2xs">
                  {Object.entries(field.normalized_value).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between py-0.5">
                      <span className="text-slate-500">{key}:</span>
                      <span className="font-bold text-slate-900">{typeof val === "object" ? JSON.stringify(val) : String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-500 pt-1">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">
                  {language === "hi" ? "निष्कर्षण विश्वसनीयता" : "Extraction Confidence"}
                </span>
                <span className="font-bold text-slate-900">{(field.detection_confidence * 100).toFixed(1)}%</span>
              </div>
              {field.measured_font_height_mm !== undefined && (
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">
                    {language === "hi" ? "मापी गई फ़ॉन्ट ऊंचाई" : "Measured Font Height"}
                  </span>
                  <span className="font-bold text-[#1B365D]">{field.measured_font_height_mm.toFixed(2)} mm</span>
                </div>
              )}
            </div>
          </div>
          )}
        </div>
      )}

      {/* 5. Multilingual OCR Token Inspector */}
      {tokens.length > 0 && (
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {language === "hi" ? `बहुभाषी ओसीआर टोकन (${tokens.length})` : `Multilingual OCR Tokens (${tokens.length})`}
            </h4>
            <span className="text-[10px] font-mono text-emerald-700 font-semibold">
              {language === "hi" ? "यूनिकोड एवं भारतीय लिपि सुरक्षित" : "Unicode & Indic Preserved"}
            </span>
          </div>

          <div className="space-y-2">
            {tokens.map((tok) => (
              <div
                key={tok.token_id}
                onClick={() => onSelectToken && onSelectToken(tok.token_id)}
                className="p-2.5 bg-slate-50 text-slate-800 rounded-lg border border-slate-200 font-mono text-xs space-y-1.5 cursor-pointer hover:border-slate-300 hover:bg-slate-100/70 transition-colors shadow-2xs"
              >
                <div className="flex items-center justify-between text-[11px] flex-wrap gap-1">
                  <span className="text-[#1B365D] font-bold">#{tok.token_id}</span>
                  <span className="text-slate-600 text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {getModelDisplayName(tok, language)} • {language === "hi" ? "विश्वास" : "Conf"}: {(tok.confidence * 100).toFixed(1)}%
                  </span>
                </div>

                {/* Character String Preserving Devanagari Hindi Text & Indic Numerals */}
                <div className="font-sans text-slate-900 text-xs font-semibold bg-white p-2 rounded border border-slate-200 shadow-2xs">
                  {tok.text}
                </div>

                {/* Coordinates */}
                <div className="text-[10px] text-slate-500 flex items-center justify-between">
                  <span>{language === "hi" ? `बहुभुज: ${tok.polygon.length} बिंदु` : `Polygon: ${tok.polygon.length} vertices`}</span>
                  <span className="truncate max-w-[200px]" title={JSON.stringify(tok.polygon)}>
                    [{tok.polygon.map(([x, y]) => `(${x},${y})`).join(", ")}]
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
