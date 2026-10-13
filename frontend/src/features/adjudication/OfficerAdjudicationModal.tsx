import React, { useState } from "react";
import { Modal } from "../../components/common/Modal";
import {
  InspectionCase,
  OfficerAdjudicationVerdict,
  OfficerActionOrder,
  AdjudicationRequest,
} from "../../types/inspection";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";

interface OfficerAdjudicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: InspectionCase;
  onSubmitAdjudication: (request: AdjudicationRequest) => Promise<void>;
  isSubmitting?: boolean;
}

export const OfficerAdjudicationModal: React.FC<OfficerAdjudicationModalProps> = ({
  isOpen,
  onClose,
  caseData,
  onSubmitAdjudication,
  isSubmitting = false,
}) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [verdict, setVerdict] = useState<OfficerAdjudicationVerdict>(
    caseData.overall_status === "FAIL" ? "CONFIRM_VIOLATION" : "DISMISS_AS_COMPLIANT"
  );
  const [remarks, setRemarks] = useState<string>("");
  const [actionOrder, setActionOrder] = useState<OfficerActionOrder>(
    caseData.overall_status === "FAIL"
      ? "GENERATE_LEGAL_NOTICE_FORM_1"
      : "CLOSE_INSPECTION_COMPLIANT"
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const isOverride =
    (caseData.overall_status === "FAIL" && verdict === "DISMISS_AS_COMPLIANT") ||
    (caseData.overall_status === "PASS" && verdict === "CONFIRM_VIOLATION") ||
    (caseData.overall_status === "REVIEW" && verdict !== "REQUEST_RETEST");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Enforce mandatory officer justification remarks per statutory standard
    if (!remarks || remarks.trim().length < 5) {
      setValidationError(
        language === "hi"
          ? "अधिकारी की अनिवार्य औचित्य टिप्पणी आवश्यक है। कृपया आधिकारिक रिकॉर्ड हेतु विस्तृत तथ्यात्मक आधार दर्ज करें।"
          : "Mandatory officer justification remarks required. Please provide a detailed factual rationale for the official inspection record."
      );
      return;
    }

    try {
      await onSubmitAdjudication({
        adjudication_verdict: verdict,
        override_applied: isOverride,
        officer_remarks: remarks.trim(),
        action_order: actionOrder,
        officer_name: user?.name || "Rajesh Sharma",
        badge_number: user?.badgeNumber || "INSP-DL-0842",
        officer_id: user?.badgeNumber || "INSP-DL-0842",
      });
      onClose();
    } catch (err: any) {
      setValidationError(err.message || (language === "hi" ? "अधिकारी निर्णय दर्ज करने में त्रुटि।" : "Failed to submit officer adjudication."));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={language === "hi" ? "विधिक मापविज्ञान अधिकारी न्यायिक निर्णय" : "Legal Metrology Officer Adjudication"}
      subtitle={
        language === "hi"
          ? `केस ${caseData.inspection_number} हेतु सांविधिक मानव-मध्यस्थ निर्णय (धारा 15 विधिक माप अधिनियम)`
          : `Statutory human-in-the-loop determination for Case ${caseData.inspection_number}`
      }
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Officer Identity Box */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-500 block">
              {language === "hi" ? "निर्णायक विधिक मापविज्ञान अधिकारी" : "Adjudicating Officer"}
            </span>
            <span className="font-bold text-slate-900 text-sm">
              {user?.badgeNumber || "INSP-DL-0842"} • {user?.name || "राजेश शर्मा (Rajesh Sharma)"}
            </span>
            <span className="text-[11px] text-slate-600 block mt-0.5">
              {user?.designation || (language === "hi"
                ? "विधिक मापविज्ञान अधिकारी (राजपत्रित द्वितीय श्रेणी), दक्षिण दिल्ली प्रवर्तन प्रभाग"
                : "LMO Class-II Gazetted, South Delhi Enforcement Division")}
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-[#1B365D] text-white font-mono text-[10px] font-bold">
            {language === "hi" ? "धारा 15 विधिक माप अधिनियम" : "SECTION 15 LM ACT"}
          </span>
        </div>

        {/* Automated Finding vs Officer Decision Banner */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-700 font-semibold">
              {language === "hi" ? "स्वचालित एआई नैदानिक निष्कर्ष:" : "Automated AI Diagnostic Finding:"}
            </span>
            <span className="font-mono font-bold text-slate-900 px-2 py-0.5 rounded bg-white border border-slate-200 shadow-2xs">
              {caseData.overall_status}
            </span>
          </div>
          <p className="text-[11px] text-slate-600">
            {language === "hi"
              ? "स्वचालित निष्कर्ष केवल संवर्धित नैदानिक अनुशंसा हैं। विधिक मापविज्ञान (पैकेज्ड वस्तुएं) नियम, 2011 एवं अधिनियम, 2009 की धारा 15 के अंतर्गत अंतिम निर्णय का सांविधिक अधिकार केवल जांच अधिकारी के पास सुरक्षित है।"
              : "Automated findings serve strictly as an augmented diagnostic recommendation. The adjudicating officer holds sole statutory authority under LMPC Rules, 2011 & Section 15 of the Legal Metrology Act, 2009."}
          </p>
        </div>

        {/* Error Alert */}
        {validationError && (
          <div role="alert" className="p-2.5 bg-rose-50 border border-rose-300 rounded-lg text-rose-800 font-semibold">
            {validationError}
          </div>
        )}

        {/* Decision Selection */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-900 block">
            {language === "hi" ? "न्यायिक निर्णय निर्धारण" : "Adjudication Decision"} <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setVerdict("CONFIRM_VIOLATION");
                setActionOrder("GENERATE_LEGAL_NOTICE_FORM_1");
              }}
              className={`p-2.5 rounded-lg border text-left font-sans transition-colors ${
                verdict === "CONFIRM_VIOLATION"
                  ? "border-rose-600 bg-rose-50 ring-2 ring-rose-500 text-rose-900 font-bold shadow-xs"
                  : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
              }`}
            >
              <div className="font-bold text-xs">
                {language === "hi" ? "उल्लंघन की पुष्टि करें" : "Confirm Violation"}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {language === "hi" ? "सांविधिक कमी के निष्कर्ष मान्य करें" : "Uphold statutory deficit findings"}
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setVerdict("DISMISS_AS_COMPLIANT");
                setActionOrder("CLOSE_INSPECTION_COMPLIANT");
              }}
              className={`p-2.5 rounded-lg border text-left font-sans transition-colors ${
                verdict === "DISMISS_AS_COMPLIANT"
                  ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500 text-emerald-900 font-bold shadow-xs"
                  : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
              }`}
            >
              <div className="font-bold text-xs">
                {language === "hi" ? "अनुपालन मानकर खारिज करें" : "Dismiss as Compliant"}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {language === "hi" ? "निष्कर्ष अधिलेखित (भौतिक जांच उत्तीर्ण)" : "Override finding (manual check passed)"}
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setVerdict("REQUEST_RETEST");
                setActionOrder("REQUEST_PHYSICAL_CALIPER_CHECK");
              }}
              className={`p-2.5 rounded-lg border text-left font-sans transition-colors ${
                verdict === "REQUEST_RETEST"
                  ? "border-amber-600 bg-amber-50 ring-2 ring-amber-500 text-amber-900 font-bold shadow-xs"
                  : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
              }`}
            >
              <div className="font-bold text-xs">
                {language === "hi" ? "पुनः सत्यापन का आदेश दें" : "Request Re-verification"}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {language === "hi" ? "भौतिक कैलीपर जांच अथवा पुनः फोटोग्राफी" : "Physical caliper check or recapture"}
              </div>
            </button>
          </div>
        </div>

        {/* Action Order */}
        <div className="space-y-1">
          <label htmlFor="action-order-select" className="font-bold text-slate-900 block">
            {language === "hi" ? "सांविधिक कार्रवाई आदेश" : "Statutory Action Order"}
          </label>
          <select
            id="action-order-select"
            value={actionOrder}
            onChange={(e) => setActionOrder(e.target.value as OfficerActionOrder)}
            className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-[#1B365D] focus:outline-none shadow-2xs"
          >
            <option value="GENERATE_LEGAL_NOTICE_FORM_1">
              {language === "hi" ? "प्रपत्र-1 कारण बताओ नोटिस जारी करें (धारा 36(1))" : "Generate Form-1 Show Cause Notice (Section 36(1))"}
            </option>
            <option value="CLOSE_INSPECTION_COMPLIANT">
              {language === "hi" ? "निरीक्षण केस समाप्त करें (पूर्ण विधिक अनुपालन सत्यापित)" : "Close Inspection Record (Full Statutory Compliance Verified)"}
            </option>
            <option value="REQUEST_PHYSICAL_CALIPER_CHECK">
              {language === "hi" ? "फील्ड अधिकारी द्वारा भौतिक कैलीपर माप का आदेश दें" : "Order Physical Caliper Measurement by Field Officer"}
            </option>
          </select>
        </div>

        {/* Mandatory Remarks */}
        <div className="space-y-1">
          <label htmlFor="officer-remarks-area" className="font-bold text-slate-900 flex items-center justify-between">
            <span>
              {language === "hi" ? "अधिकारी की अनिवार्य औचित्य एवं टिप्पणी" : "Mandatory Officer Justification Remarks"} <span className="text-rose-500">*</span>
            </span>
            {isOverride && (
              <span className="text-[10px] font-mono text-amber-800 font-bold uppercase">
                {language === "hi" ? "[अधिलेखन औचित्य अनिवार्य]" : "[Override Justification Required]"}
              </span>
            )}
          </label>
          <textarea
            id="officer-remarks-area"
            rows={4}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder={
              language === "hi"
                ? "आधिकारिक तथ्यात्मक औचित्य, भौतिक कैलीपर माप के आंकड़े अथवा स्वचालित निष्कर्ष अधिलेखित करने के विधिक आधार दर्ज करें..."
                : "Enter official factual justification, physical caliper measurement readings, or grounds for overriding automated finding..."
            }
            className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-[#1B365D] focus:outline-none font-sans shadow-2xs"
          />
          <span className="text-[10px] text-slate-500 block">
            {language === "hi"
              ? "यह औचित्य धारा 63 भारतीय साक्ष्य अधिनियम 2023 (बीएसए) डिजिटल साक्ष्य श्रृंखला में अपरिवर्तनीय रूप से दर्ज होगा।"
              : "This justification will be immutably recorded in the Section 63 BSA 2023 evidentiary chain of custody."}
          </span>
        </div>

        {/* Submission Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-2xs"
          >
            {language === "hi" ? "रद्द करें" : "Cancel"}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#1B365D] hover:bg-[#0A2540] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B365D] disabled:opacity-50"
          >
            {isSubmitting
              ? language === "hi"
                ? "न्यायिक निर्णय दर्ज हो रहा है..."
                : "Recording Adjudication..."
              : language === "hi"
              ? "हस्ताक्षर करें एवं निर्णय दर्ज करें"
              : "Sign & Record Adjudication"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
