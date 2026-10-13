import React, { useState } from "react";
import {
  InspectionCase,
  CaseReadinessChecklist,
  EvidenceAsset,
  OfficerRole,
} from "../../types/inspection";
import { CaseClosureModal } from "./CaseClosureModal";
import { computeCaseReadiness } from "../../services/mockData";
import { useLanguage } from "../../context/LanguageContext";

interface InspectionOutcomeProps {
  caseData: InspectionCase;
  onViewReport: () => void;
  onOpenCanvas: () => void;
  onOpenAudit: () => void;
  onCloseCase?: (remarks: string) => Promise<void>;
  officerRole?: OfficerRole;
}

export const InspectionOutcome: React.FC<InspectionOutcomeProps> = ({
  caseData,
  onViewReport,
  onOpenCanvas,
  onOpenAudit,
  onCloseCase,
  officerRole = "INSPECTOR",
}) => {
  const { language } = useLanguage();
  const [isClosureModalOpen, setIsClosureModalOpen] = useState(false);
  const [isSubmittingClosure, setIsSubmittingClosure] = useState(false);

  // Derive findings summary counts directly from canonical rule_evaluations
  // Strict rule: These are display counts only; NO frontend legal overall verdict calculation
  const evaluations = caseData.rule_evaluations || [];
  const countFail = evaluations.filter((f) => f.status === "FAIL").length;
  const countReview = evaluations.filter((f) => f.status === "REVIEW").length;
  const countPass = evaluations.filter((f) => f.status === "PASS").length;
  const countUnable = evaluations.filter((f) => f.status === "UNABLE_TO_VERIFY").length;

  // Officer adjudication counts from finding_decisions or overall adjudication
  const findingDecisions = caseData.finding_decisions || {};
  const decisionValues = Object.values(findingDecisions);
  const countConfirmed = decisionValues.filter((d) => d.decision === "CONFIRMED").length;
  const countDismissed = decisionValues.filter((d) => d.decision === "DISMISSED").length;
  const countRetestReq = decisionValues.filter((d) => d.decision === "RETEST_REQUESTED").length;
  const countPendingAdjudication = Math.max(0, evaluations.length - decisionValues.length);

  // Evidence asset reference
  const primaryAsset: EvidenceAsset | undefined =
    caseData.evidence_assets && caseData.evidence_assets.length > 0
      ? caseData.evidence_assets.find((a) => a.panel_type === "PDP_FRONT") || caseData.evidence_assets[0]
      : undefined;

  // Downstream readiness (from fixture/backend contract)
  const readiness: CaseReadinessChecklist =
    caseData.readiness_checklist || computeCaseReadiness(caseData);

  // Audit trail statistics
  const auditEvents = caseData.audit_trail || [];
  const latestAuditEvent = auditEvents.length > 0 ? auditEvents[auditEvents.length - 1] : undefined;

  const handleConfirmClosure = async (remarks: string) => {
    if (!onCloseCase) return;
    setIsSubmittingClosure(true);
    try {
      await onCloseCase(remarks);
    } finally {
      setIsSubmittingClosure(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Header & Top Action Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#1B365D] text-white text-[10px] font-bold uppercase tracking-wider shadow-2xs">
              {language === "hi" ? "मामला परिणाम समीक्षा" : "Case Outcome Review"}
            </span>
            <span className="font-mono text-xs text-slate-500 font-bold">
              {caseData.inspection_number}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                caseData.workflow_status === "COMPLETED"
                  ? "bg-slate-100 text-slate-800 border-slate-300"
                  : "bg-blue-50 text-blue-800 border-blue-200"
              }`}
            >
              {language === "hi" ? "कार्यप्रवाह:" : "Workflow:"} {caseData.workflow_status}
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            {caseData.product_name}
          </h2>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5 flex-wrap">
            {caseData.brand_name && (
              <span>
                {language === "hi" ? "ब्रांड:" : "Brand:"} <strong className="text-slate-800">{caseData.brand_name}</strong>
              </span>
            )}
            {caseData.establishment_name && (
              <span>
                {language === "hi" ? "प्रतिष्ठान:" : "Establishment:"} <strong className="text-slate-800">{caseData.establishment_name}</strong>
              </span>
            )}
            <span>
              {language === "hi" ? "अधिकार क्षेत्र:" : "Jurisdiction:"} <strong className="text-slate-800">{caseData.jurisdiction_id}</strong>
            </span>
            <span>
              {language === "hi" ? "दिनांक:" : "Date:"}{" "}
              <strong className="text-slate-800">
                {caseData.created_at
                  ? new Date(caseData.created_at).toLocaleDateString(language === "hi" ? "hi-IN" : "en-IN")
                  : (language === "hi" ? "अनुपलब्ध" : "Not available")}
              </strong>
            </span>
          </div>
        </div>

        {/* Primary Outcome Actions */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <button
            type="button"
            onClick={onOpenCanvas}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{language === "hi" ? "अधिनिर्णय कैनवास" : "Adjudication Canvas"}</span>
          </button>

          <button
            type="button"
            onClick={onViewReport}
            className="px-4 py-1.5 text-xs font-bold text-white bg-[#1B365D] hover:bg-[#0A2540] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>{language === "hi" ? "औपचारिक रिपोर्ट दृश्य" : "Formal Report View"}</span>
          </button>
        </div>
      </div>

      {/* 2. Key Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card A: Automated Findings Summary */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {language === "hi" ? "स्वचालित निष्कर्ष" : "Automated Findings"}
            </span>
            <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
              {evaluations.length} {language === "hi" ? "कुल" : "total"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-between shadow-2xs">
              <span className="font-bold text-rose-800">{language === "hi" ? "उल्लंघन" : "FAIL"}</span>
              <span className="font-mono font-bold text-rose-900 text-sm">{countFail}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between shadow-2xs">
              <span className="font-bold text-amber-900">{language === "hi" ? "समीक्षा" : "REVIEW"}</span>
              <span className="font-mono font-bold text-amber-950 text-sm">{countReview}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between shadow-2xs">
              <span className="font-bold text-emerald-800">{language === "hi" ? "उत्तीर्ण" : "PASS"}</span>
              <span className="font-mono font-bold text-emerald-900 text-sm">{countPass}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between shadow-2xs">
              <span className="font-bold text-slate-700">{language === "hi" ? "अस्पष्ट" : "UNABLE"}</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{countUnable}</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 italic">
            {language === "hi"
              ? "बैकएंड AST नियम मूल्यांकन द्वारा प्रदान की गई टेलीमेट्री गणना।"
              : "Telemetry counts supplied by backend AST rule evaluation."}
          </p>
        </div>

        {/* Card B: Officer Adjudication Summary */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {language === "hi" ? "अधिकारी न्यायिक निर्णय" : "Officer Adjudication"}
            </span>
            <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shadow-2xs">
              {language === "hi" ? "एचआईटीएल सत्यापित" : "HITL Verified"}
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-500 font-medium">{language === "hi" ? "पुष्टीकृत उल्लंघन:" : "Confirmed Violations:"}</span>
              <span className="font-mono font-bold text-rose-700">{countConfirmed}</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-500 font-medium">{language === "hi" ? "खारिज निष्कर्ष:" : "Dismissed Findings:"}</span>
              <span className="font-mono font-bold text-emerald-700">{countDismissed}</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-500 font-medium">{language === "hi" ? "पुनः परीक्षण अनुरोध:" : "Retest Requested:"}</span>
              <span className="font-mono font-bold text-amber-700">{countRetestReq}</span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-t border-slate-200 pt-1">
              <span className="text-slate-500 font-medium">{language === "hi" ? "अधिकारी समीक्षा लंबित:" : "Pending Officer Review:"}</span>
              <span className="font-mono font-bold text-slate-700">{countPendingAdjudication}</span>
            </div>
          </div>
        </div>

        {/* Card C: Evidence Health & Custody */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {language === "hi" ? "साक्ष्य स्थिति" : "Evidence Health"}
            </span>
            <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 shadow-2xs">
              {language === "hi" ? "अपरिवर्तित" : "UNTOUCHED"}
            </span>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-sans font-medium">{language === "hi" ? "साक्ष्य संपत्ति:" : "Evidence Asset:"}</span>
              <span className="font-bold text-slate-900 truncate max-w-[120px]">
                {primaryAsset ? primaryAsset.image_id : (language === "hi" ? "अनुपलब्ध" : "Not available")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-sans font-medium">{language === "hi" ? "अंशांकन:" : "Calibration:"}</span>
              <span className="text-slate-800 font-semibold">
                {primaryAsset?.calibration?.is_calibrated
                  ? (language === "hi" ? "अरुको 50 मिमी" : "ArUco 50mm")
                  : (language === "hi" ? "अनांशांकित" : "Uncalibrated")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-sans font-medium">{language === "hi" ? "गुणवत्ता द्वार:" : "Quality Gate:"}</span>
              <span className={primaryAsset?.quality_gate.passed ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}>
                {primaryAsset
                  ? (primaryAsset.quality_gate.passed
                    ? (language === "hi" ? "उत्तीर्ण (PASS)" : "PASSED")
                    : (language === "hi" ? "अस्वीकृत (REJECT)" : "REJECTED"))
                  : (language === "hi" ? "प्रतीक्षारत" : "Awaiting")}
              </span>
            </div>
            <div className="flex justify-between items-center text-[10px] pt-1 border-t border-slate-200">
              <span className="text-slate-500 font-sans font-medium">{language === "hi" ? "डाइजेस्ट:" : "Digest:"}</span>
              <span className="truncate max-w-[130px] text-slate-600 font-semibold" title={primaryAsset?.raw_sha256}>
                {primaryAsset ? primaryAsset.raw_sha256.slice(0, 16) + "..." : (language === "hi" ? "अनुपलब्ध" : "Not available")}
              </span>
            </div>
          </div>
        </div>

        {/* Card D: Audit Trail Integrity */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {language === "hi" ? "अंकेक्षण इतिहास" : "Audit History"}
            </span>
            <button
              type="button"
              onClick={onOpenAudit}
              className="text-[10px] text-[#1B365D] hover:underline font-bold cursor-pointer"
            >
              {language === "hi" ? "पूर्ण समयरेखा देखें →" : "View Full Trail →"}
            </button>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">{language === "hi" ? "श्रृंखलाबद्ध घटनाएं:" : "Chained Events:"}</span>
              <span className="font-mono font-bold text-slate-900">{auditEvents.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">{language === "hi" ? "केवल-जोड़ें मोड:" : "Append-Only Mode:"}</span>
              <span className="text-emerald-700 font-bold text-[11px]">{language === "hi" ? "सक्रिय" : "ACTIVE"}</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500 font-medium">{language === "hi" ? "नवीनतम घटना:" : "Latest Event:"}</span>
              <span className="text-slate-800 font-medium truncate max-w-[120px]">
                {latestAuditEvent ? latestAuditEvent.event_label : (language === "hi" ? "कोई नहीं" : "None")}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
              {language === "hi"
                ? "ऐतिहासिक बही प्रविष्टियों को बदला या हटाया नहीं जा सकता।"
                : "Historical ledger entries cannot be altered or removed."}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Downstream Case Readiness & Action Handoff Panel */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#1B365D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1B365D]">
              {language === "hi"
                ? "अग्रगामी मामला तत्परता एवं प्रशासनिक स्थिति"
                : "Downstream Case Readiness & Administrative Status"}
            </h3>
          </div>

          {/* Readiness State Badge */}
          <span
            className={`px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-wider border shadow-2xs ${
              readiness.readiness_state === "READY_FOR_LEGAL_NOTICE_DISPATCH"
                ? "bg-rose-50 text-rose-800 border-rose-300"
                : readiness.readiness_state === "READY_FOR_CASE_CLOSURE"
                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                : readiness.readiness_state === "ACTION_REQUIRED_RETEST"
                ? "bg-amber-50 text-amber-900 border-amber-300"
                : "bg-blue-50 text-[#1B365D] border-blue-200"
            }`}
          >
            {language === "hi"
              ? (readiness.readiness_state === "READY_FOR_LEGAL_NOTICE_DISPATCH"
                  ? "विधिक नोटिस प्रेषण हेतु तैयार"
                  : readiness.readiness_state === "READY_FOR_CASE_CLOSURE"
                  ? "केस समापन हेतु तैयार"
                  : readiness.readiness_state === "ACTION_REQUIRED_RETEST"
                  ? "पुनः परीक्षण अपेक्षित"
                  : "अधिकारी अधिनिर्णय लंबित")
              : readiness.readiness_state.replace(/_/g, " ")}
          </span>
        </div>

        {/* Readiness State Guidance Content */}
        <div className="space-y-3">
          {readiness.readiness_state === "READY_FOR_CASE_CLOSURE" ? (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-bold text-emerald-900 text-xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-600" />
                  <span>{language === "hi" ? "मामला औपचारिक समापन हेतु पात्र" : "Case Eligible for Formal Closure"}</span>
                </div>
                <p className="text-xs text-emerald-800 font-medium">
                  {readiness.downstream_action_guidance ||
                    (language === "hi"
                      ? "निरीक्षण निष्कर्षों की समीक्षा कर अधिकारी द्वारा अनुपालन मान लिया गया है। मामला आधिकारिक प्रशासनिक समापन हेतु तैयार है।"
                      : "Inspection findings have been reviewed and marked compliant by the officer. Case is ready for official administrative closure.")}
                </p>
              </div>

              {onCloseCase && caseData.workflow_status !== "COMPLETED" && (
                <button
                  type="button"
                  onClick={() => setIsClosureModalOpen(true)}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs whitespace-nowrap self-start sm:self-auto cursor-pointer"
                >
                  {language === "hi" ? "निरीक्षण मामला समाप्त करें" : "Close Inspection Case"}
                </button>
              )}
            </div>
          ) : readiness.readiness_state === "READY_FOR_LEGAL_NOTICE_DISPATCH" ? (
            <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-3 text-xs text-rose-950 shadow-2xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 font-bold text-rose-900">
                  <span className="h-2 w-2 rounded-full bg-rose-600 animate-pulse" />
                  <span>
                    {language === "hi"
                      ? "अग्रगामी विधिक कार्यप्रवाह: सांविधिक नोटिस हेतु तैयार"
                      : "Downstream Legal Workflow: Ready for Statutory Notice"}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-rose-800 font-bold border border-rose-300 shadow-2xs">
                  {language === "hi" ? "प्राधिकार: विधिक मापविज्ञान नियंत्रक" : "AUTHORITY: CONTROLLER OF LEGAL METROLOGY"}
                </span>
              </div>

              <p className="text-rose-900 font-medium leading-relaxed">
                {readiness.downstream_action_guidance ||
                  (language === "hi"
                    ? "निरीक्षण अधिकारी द्वारा सांविधिक उल्लंघन की पुष्टि की गई है। केस डोजियर प्रपत्र-1 कारण बताओ नोटिस तैयार करने हेतु उपलब्ध है।"
                    : "Statutory violation confirmed by inspecting officer. Case dossier is ready for Form-1 Show Cause Notice preparation.")}
              </p>

              <div className="flex items-center justify-between p-3.5 bg-white border border-rose-200 rounded-xl flex-wrap gap-3 shadow-2xs">
                <div>
                  <span className="font-bold text-slate-900 block text-xs">
                    {officerRole === "CONTROLLER"
                      ? (language === "hi" ? "नियंत्रक सांविधिक प्राधिकार पुष्टीकृत" : "Controller Statutory Authority Confirmed")
                      : (language === "hi" ? "अधिकारी स्तर वृद्धि (एस्केलेशन) आवश्यक" : "Inspector Escalation Required")}
                  </span>
                  <span className="text-[11px] text-slate-600 block mt-0.5 font-medium">
                    {officerRole === "CONTROLLER"
                      ? (language === "hi"
                          ? "आप नियंत्रक साख के साथ लॉग इन हैं। आप प्रपत्र-1 कारण बताओ नोटिस जारी करने तथा शमन शुल्क निर्धारित करने हेतु अधिकृत हैं।"
                          : "You are logged in with Controller credentials. You are authorized to issue Form-1 Show Cause Notices and determine compounding fees.")
                      : (language === "hi"
                          ? "एलएमपीसी नियम, 2011 के नियम 6 एवं विधिक मापविज्ञान अधिनियम, 2009 की धारा 36(1) के तहत, केवल नियंत्रक ही औपचारिक रूप से प्रपत्र-1 नोटिस जारी कर सकते हैं।"
                          : "Under Rule 6 LMPC Rules, 2011 and Section 36(1) LM Act, 2009, only the Controller may formally issue Form-1 Notices. Inspectors escalate vetted findings.")}
                  </span>
                </div>

                {officerRole === "CONTROLLER" ? (
                  <button
                    type="button"
                    onClick={onViewReport}
                    className="px-4 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-lg transition-colors shadow-xs whitespace-nowrap cursor-pointer"
                  >
                    {language === "hi"
                      ? "प्रपत्र-1 विधिक नोटिस तैयार करें (नियंत्रक प्राधिकार) →"
                      : "Prepare Form-1 Legal Notice (Controller Authorization) →"}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 border border-slate-300 rounded-lg cursor-not-allowed whitespace-nowrap"
                    title={language === "hi" ? "प्रशासनिक नोटिस समीक्षा एवं प्रेषण हेतु नियंत्रक को अग्रेषित" : "Escalated to Controller for administrative notice review and dispatch"}
                  >
                    {language === "hi" ? "नोटिस जारी करने हेतु नियंत्रक को अग्रेषित" : "Escalated to Controller for Notice Issuance"}
                  </button>
                )}
              </div>
            </div>
          ) : readiness.readiness_state === "ACTION_REQUIRED_RETEST" ? (
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2 text-xs text-amber-950 shadow-2xs">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <span className="h-2 w-2 rounded-full bg-amber-600" />
                <span>
                  {language === "hi"
                    ? "कार्रवाई आवश्यक: भौतिक पुनः मापन या प्रकाशीय पुनः कैप्चर"
                    : "Action Required: Physical Re-measurement or Optical Recapture"}
                </span>
              </div>
              <p className="text-amber-900 font-medium leading-relaxed">
                {readiness.downstream_action_guidance ||
                  (language === "hi"
                    ? "निरीक्षण अधिकारी या प्रकाशीय द्वार ने अधिनिर्णय से पूर्व पुनः सत्यापन का आदेश दिया है।"
                    : "The inspecting officer or optical gate has ordered re-verification before case adjudication can proceed.")}
              </p>
              <button
                type="button"
                onClick={onOpenCanvas}
                className="mt-1 px-3.5 py-1.5 text-xs font-bold text-white bg-[#1B365D] hover:bg-[#0A2540] rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                {language === "hi" ? "कैनवास पर निष्कर्ष का निरीक्षण करें →" : "Inspect Finding on Canvas →"}
              </button>
            </div>
          ) : (
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2 text-xs text-blue-950 shadow-2xs">
              <div className="flex items-center gap-2 font-bold text-[#1B365D]">
                <span className="h-2 w-2 rounded-full bg-[#1B365D]" />
                <span>{language === "hi" ? "अधिकारी न्यायिक निर्णय आवश्यक" : "Officer Adjudication Required"}</span>
              </div>
              <p className="text-slate-700 font-medium leading-relaxed">
                {readiness.downstream_action_guidance ||
                  (language === "hi"
                    ? "स्वचालित निष्कर्षों के लिए विभाजित दृश्य कैनवास पर मानव अधिकारी द्वारा समीक्षा एवं अधिनिर्णय आवश्यक है।"
                    : "Automated findings require human officer review and adjudication on the split-view canvas.")}
              </p>
              <button
                type="button"
                onClick={onOpenCanvas}
                className="mt-1 px-3.5 py-1.5 text-xs font-bold text-white bg-[#1B365D] hover:bg-[#0A2540] rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                {language === "hi" ? "अधिनिर्णय कैनवास पर जाएं →" : "Proceed to Adjudication Canvas →"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Case Closure Confirmation Modal */}
      <CaseClosureModal
        isOpen={isClosureModalOpen}
        caseData={caseData}
        onClose={() => setIsClosureModalOpen(false)}
        onConfirmClosure={handleConfirmClosure}
        isSubmitting={isSubmittingClosure}
      />
    </div>
  );
};
