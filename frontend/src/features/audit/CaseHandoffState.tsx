import React from "react";
import { InspectionCase } from "../../types/inspection";
import { computeCaseReadiness } from "../../services/mockData";
import { useLanguage } from "../../context/LanguageContext";

interface CaseHandoffStateProps {
  caseData: InspectionCase;
  onOpenAdjudication?: () => void;
}

export const CaseHandoffState: React.FC<CaseHandoffStateProps> = ({
  caseData,
  onOpenAdjudication,
}) => {
  const { language } = useLanguage();
  const readiness = computeCaseReadiness(caseData);

  const getReadinessBadge = () => {
    switch (readiness.readiness_state) {
      case "READY_FOR_LEGAL_NOTICE_DISPATCH":
        return {
          label: language === "hi" ? "कारण बताओ नोटिस प्रेषण हेतु तैयार" : "READY FOR SHOW CAUSE NOTICE",
          classes: "bg-rose-50 text-rose-800 border-rose-300 shadow-2xs",
          icon: "⚠️",
        };
      case "READY_FOR_CASE_CLOSURE":
        return {
          label: language === "hi" ? "अनुपालन निपटारे/बंद करने हेतु तैयार" : "READY FOR COMPLIANT CLOSURE",
          classes: "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs",
          icon: "✓",
        };
      case "ACTION_REQUIRED_RETEST":
        return {
          label: language === "hi" ? "कार्रवाई आवश्यक: पुनः परीक्षण" : "ACTION REQUIRED: RE-TEST",
          classes: "bg-amber-50 text-amber-900 border-amber-300 shadow-2xs",
          icon: "🔄",
        };
      case "PENDING_OFFICER_REVIEW":
      default:
        return {
          label: language === "hi" ? "अधिकारी न्यायिक निर्णय लंबित" : "PENDING OFFICER ADJUDICATION",
          classes: "bg-blue-50 text-[#1B365D] border-blue-200 shadow-2xs",
          icon: "⏳",
        };
    }
  };

  const badge = getReadinessBadge();

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#1B365D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B365D]">
              {language === "hi" ? "केस डोज़ियर हस्तांतरण तत्परता" : "Case Dossier Handoff Readiness"}
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
            {language === "hi"
              ? "अग्रिम विधिक नोटिस प्रारूपण या प्रशासनिक निपटारे से पूर्व मामले की पूर्व-आवश्यकताओं का मूल्यांकन।"
              : "Evaluation of case prerequisites before downstream legal notice drafting or administrative closure."}
          </p>
        </div>

        <div className={`px-3 py-1 rounded-lg border text-xs font-bold font-mono flex items-center gap-1.5 ${badge.classes}`}>
          <span>{badge.icon}</span>
          <span>{badge.label}</span>
        </div>
      </div>

      {/* 1. Prerequisites Checklist */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          {language === "hi" ? "सांविधिक डोज़ियर पूर्व-आवश्यकता चेकलिस्ट" : "Statutory Dossier Prerequisites Checklist"}
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Item 1: Evidence Availability */}
          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200 text-xs flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${readiness.evidence_available ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"}`}>
                {readiness.evidence_available ? "✓" : "–"}
              </span>
              <span className="font-bold text-slate-800">
                {language === "hi" ? "भौतिक साक्ष्य परिसंपत्ति" : "Physical Evidence Asset"}
              </span>
            </div>
            <span className={`font-mono text-[11px] font-bold ${readiness.evidence_available ? "text-emerald-700" : "text-slate-500"}`}>
              {readiness.evidence_available
                ? (language === "hi" ? "उपलब्ध" : "AVAILABLE")
                : (language === "hi" ? "अनुपस्थित" : "MISSING")}
            </span>
          </div>

          {/* Item 2: Automated Pipeline Analysis */}
          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200 text-xs flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${readiness.automated_analysis_completed ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"}`}>
                {readiness.automated_analysis_completed ? "✓" : "–"}
              </span>
              <span className="font-bold text-slate-800">
                {language === "hi" ? "स्वचालित पाइपलाइन निष्कर्ष" : "Automated Pipeline Findings"}
              </span>
            </div>
            <span className={`font-mono text-[11px] font-bold ${readiness.automated_analysis_completed ? "text-emerald-700" : "text-slate-500"}`}>
              {readiness.automated_analysis_completed
                ? (language === "hi" ? "पूर्ण" : "COMPLETE")
                : (language === "hi" ? "लंबित" : "PENDING")}
            </span>
          </div>

          {/* Item 3: Officer Adjudication */}
          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200 text-xs flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${readiness.officer_adjudication_completed ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"}`}>
                {readiness.officer_adjudication_completed ? "✓" : "!"}
              </span>
              <span className="font-bold text-slate-800">
                {language === "hi" ? "अधिकारी न्यायिक निर्णय (एचआईटीएल)" : "Officer Adjudication (HITL)"}
              </span>
            </div>
            <span className={`font-mono text-[11px] font-bold ${readiness.officer_adjudication_completed ? "text-emerald-700" : "text-amber-700"}`}>
              {readiness.officer_adjudication_completed
                ? (language === "hi" ? "दर्ज" : "RECORDED")
                : (language === "hi" ? "आवश्यक" : "REQUIRED")}
            </span>
          </div>

          {/* Item 4: Audit Record Completeness */}
          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200 text-xs flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${readiness.audit_record_complete ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"}`}>
                {readiness.audit_record_complete ? "✓" : "–"}
              </span>
              <span className="font-bold text-slate-800">
                {language === "hi" ? "ऑडिट ट्रेल रिकॉर्ड" : "Audit Trail Record"}
              </span>
            </div>
            <span className={`font-mono text-[11px] font-bold ${readiness.audit_record_complete ? "text-emerald-700" : "text-slate-500"}`}>
              {readiness.audit_record_complete
                ? (language === "hi" ? "सत्यापित" : "VERIFIED")
                : (language === "hi" ? "अपूर्ण" : "INCOMPLETE")}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Downstream Action Guidance */}
      <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2 text-xs shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-900 uppercase text-[11px]">
            {language === "hi" ? "सांविधिक मार्गदर्शन एवं आगामी कदम:" : "Statutory Guidance & Next Steps:"}
          </span>
          {caseData.adjudication?.action_order && (
            <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded-md border border-slate-200 font-semibold text-slate-800 shadow-2xs">
              {language === "hi" ? "आदेश: " : "Order: "}{caseData.adjudication.action_order}
            </span>
          )}
        </div>

        <p className="text-slate-700 leading-relaxed font-medium">
          {readiness.downstream_action_guidance}
        </p>

        {/* Action Button for Unadjudicated Cases */}
        {!readiness.officer_adjudication_completed && onOpenAdjudication && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenAdjudication}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1B365D] hover:bg-[#0A2540] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <span>{language === "hi" ? "अधिकारी न्यायिक निर्णय अभी दर्ज करें" : "Record Officer Adjudication Now"}</span>
              <span>→</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Non-Autonomous Notice Disclaimer */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-center justify-between shadow-2xs">
        <span className="font-medium">
          {language === "hi"
            ? "मानव-इन-द-लूप सांविधिक सीमा: कानूनी कारण बताओ नोटिस और शमन आदेश कभी भी सॉफ्टवेयर द्वारा स्वायत्त रूप से प्रेषित नहीं किए जाते हैं।"
            : "Human-in-the-loop statutory boundary: legal show-cause notices and compounding orders are never dispatched autonomously by software."}
        </span>
        <span className="font-mono text-[10px] text-slate-700 font-bold uppercase hidden md:inline">
          {language === "hi" ? "धारा 15 अनुपालन" : "SECTION 15 COMPLIANCE"}
        </span>
      </div>
    </div>
  );
};
