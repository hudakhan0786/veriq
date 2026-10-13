import React, { useState, useEffect, useRef } from "react";
import { InspectionCase } from "../../types/inspection";
import { useLanguage } from "../../context/LanguageContext";

interface CaseClosureModalProps {
  isOpen: boolean;
  caseData: InspectionCase;
  onClose: () => void;
  onConfirmClosure: (remarks: string) => Promise<void>;
  isSubmitting?: boolean;
}

export const CaseClosureModal: React.FC<CaseClosureModalProps> = ({
  isOpen,
  caseData,
  onClose,
  onConfirmClosure,
  isSubmitting = false,
}) => {
  const { language } = useLanguage();
  const [remarks, setRemarks] = useState(
    language === "hi"
      ? "निरीक्षण संपन्न हुआ। बैकएंड सांविधिक अभिलेखों के विरुद्ध मामले की समीक्षा की गई तथा इसे बंद चिह्नित किया गया।"
      : "Inspection concluded. Case reviewed against backend statutory records and marked closed."
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setValidationError(null);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarks.trim()) {
      setValidationError(
        language === "hi"
          ? "अंकेक्षण अभिलेख के लिए अधिकारी की समापन टिप्पणी अनिवार्य है।"
          : "Officer closure remarks are required for the audit record."
      );
      return;
    }
    setValidationError(null);
    try {
      await onConfirmClosure(remarks.trim());
      onClose();
    } catch (err: any) {
      setValidationError(
        err.message ||
          (language === "hi"
            ? "केस समापन दर्ज करने में विफल।"
            : "Failed to record case closure.")
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="closure-modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden relative"
      >
        {/* Top Indian Tricolor Accent Ribbon */}
        <div className="h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

        {/* Header */}
        <div className="bg-[#1B365D] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 id="closure-modal-title" className="text-sm font-bold tracking-wide">
              {language === "hi" ? "क्या निरीक्षण मामला समाप्त करना चाहते हैं?" : "Close Inspection Case?"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-white/80 hover:text-white text-lg font-bold leading-none p-1 rounded transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 space-y-1 shadow-2xs">
            <div className="font-bold flex items-center gap-1.5 text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              <span>
                {language === "hi"
                  ? "बैकएंड तत्परता: केस समापन हेतु तैयार"
                  : "Backend Readiness: Ready for Case Closure"}
              </span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed font-medium">
              {language === "hi"
                ? "वर्तमान कार्यप्रवाह स्थिति द्वारा मामला समापन हेतु तैयार चिह्नित है। यह कार्रवाई अधिकारी के समापन निर्णय को अभिलिखित करेगी तथा बैकएंड के माध्यम से केस कार्यप्रवाह को अद्यतन करेगी।"
                : "The case is marked ready for closure by the current workflow state. This action will record the officer's closure decision and update the case workflow through the configured backend."}
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5 shadow-2xs">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">
                {language === "hi" ? "केस संख्या:" : "Case Number:"}
              </span>
              <span className="font-mono font-bold text-slate-900">{caseData.inspection_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">
                {language === "hi" ? "वस्तु (कमोडिटी):" : "Commodity:"}
              </span>
              <span className="font-semibold text-slate-900">{caseData.product_name}</span>
            </div>
            {caseData.establishment_name && (
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">
                  {language === "hi" ? "प्रतिष्ठान:" : "Establishment:"}
                </span>
                <span className="text-slate-800 font-medium">{caseData.establishment_name}</span>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="closure-remarks" className="block text-xs font-bold text-slate-800">
              {language === "hi" ? "अधिकारी समापन टिप्पणी" : "Officer Closure Remarks"}{" "}
              <span className="text-rose-600">*</span>
            </label>
            <textarea
              id="closure-remarks"
              ref={textareaRef}
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              disabled={isSubmitting}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20 focus:border-[#1B365D] text-slate-900 bg-white placeholder:text-slate-400"
              placeholder={
                language === "hi"
                  ? "आधिकारिक तथ्यात्मक औचित्य या समापन टिप्पणी दर्ज करें..."
                  : "Enter official factual justification or closure record notes..."
              }
            />
          </div>

          {validationError && (
            <div role="alert" className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 font-medium">
              {validationError}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {language === "hi" ? "रद्द करें" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                  <span>{language === "hi" ? "समापन दर्ज हो रहा है..." : "Recording Closure..."}</span>
                </>
              ) : (
                <span>{language === "hi" ? "केस समापन की पुष्टि करें" : "Confirm Case Closure"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
