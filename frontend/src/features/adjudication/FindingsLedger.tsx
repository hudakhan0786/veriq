import React, { useState } from "react";
import { RuleFinding, ExtractedField, EpistemicVerdict, OfficerDecision, FindingAdjudication } from "../../types/inspection";
import { VerdictBadge } from "../../components/common/StatusBadge";
import { findFieldForFinding } from "./AdjudicationTraceability";
import { useLanguage } from "../../context/LanguageContext";

interface FindingsLedgerProps {
  findings: RuleFinding[];
  extractedFields: ExtractedField[];
  selectedFindingId?: string;
  onSelectFinding: (findingId: string) => void;
  caseAdjudication?: OfficerDecision;
  findingDecisions?: Record<string, FindingAdjudication>;
}

export const FindingsLedger: React.FC<FindingsLedgerProps> = ({
  findings,
  extractedFields,
  selectedFindingId,
  onSelectFinding,
  caseAdjudication,
  findingDecisions,
}) => {
  const { language } = useLanguage();
  const [filter, setFilter] = useState<"ALL" | "FAIL" | "REVIEW" | "PASS" | "UNABLE_TO_VERIFY">("ALL");

  // Filter findings
  const filteredFindings = findings.filter((f) => {
    if (filter === "ALL") return true;
    return f.status === filter;
  });

  // Count summaries
  const failCount = findings.filter((f) => f.status === "FAIL").length;
  const reviewCount = findings.filter((f) => f.status === "REVIEW").length;
  const passCount = findings.filter((f) => f.status === "PASS").length;
  const unableCount = findings.filter((f) => f.status === "UNABLE_TO_VERIFY").length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-full overflow-hidden">
      {/* 1. Header & Tabs */}
      <div className="p-3 border-b border-slate-200 space-y-2.5 bg-slate-50/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#1B365D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {language === "hi" ? "सांविधिक निष्कर्ष बही (लेज़र)" : "Statutory Findings Ledger"}
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500 font-medium">
            {findings.length} {language === "hi" ? "निष्कर्ष" : "determinations"}
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
              filter === "ALL"
                ? "bg-[#1B365D] text-white shadow-2xs font-bold"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {language === "hi" ? "सभी" : "All"} ({findings.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("FAIL")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
              filter === "FAIL"
                ? "bg-rose-700 text-white font-bold shadow-2xs"
                : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
            }`}
          >
            <span>{language === "hi" ? "उल्लंघन" : "Violations"}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${filter === "FAIL" ? "bg-rose-800 text-white" : "bg-rose-200/80 text-rose-800"}`}>
              {failCount}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setFilter("REVIEW")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
              filter === "REVIEW"
                ? "bg-amber-600 text-white font-bold shadow-2xs"
                : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
            }`}
          >
            <span>{language === "hi" ? "समीक्षा" : "Review"}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${filter === "REVIEW" ? "bg-amber-700 text-white" : "bg-amber-200/80 text-amber-900"}`}>
              {reviewCount}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setFilter("PASS")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
              filter === "PASS"
                ? "bg-emerald-700 text-white font-bold shadow-2xs"
                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
            }`}
          >
            <span>{language === "hi" ? "अनुपालन" : "Compliant"}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${filter === "PASS" ? "bg-emerald-800 text-white" : "bg-emerald-200/80 text-emerald-900"}`}>
              {passCount}
            </span>
          </button>
          {unableCount > 0 && (
            <button
              type="button"
              onClick={() => setFilter("UNABLE_TO_VERIFY")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                filter === "UNABLE_TO_VERIFY"
                  ? "bg-slate-700 text-white shadow-2xs font-bold"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              <span>{language === "hi" ? "अस्पष्ट" : "Degraded"}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-800 font-bold">
                {unableCount}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Findings Scrollable List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[580px]">
        {filteredFindings.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 italic">
            {language === "hi" ? "चयनित फिल्टर के अनुरूप कोई विधिक निष्कर्ष नहीं मिला।" : "No compliance findings match the selected filter."}
          </div>
        ) : (
          filteredFindings.map((finding) => {
            const isSelected = selectedFindingId === finding.finding_id;
            const linkedField = findFieldForFinding(finding, extractedFields);

            return (
              <button
                key={finding.finding_id}
                type="button"
                data-testid={`finding-item-${finding.finding_id}`}
                aria-pressed={isSelected}
                onClick={() => onSelectFinding(finding.finding_id)}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer focus:outline-none ${
                  isSelected
                    ? "border-[#1B365D] bg-blue-50/40 ring-1 ring-[#1B365D]/30 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs"
                }`}
              >
                {/* Finding Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">
                      {finding.rule_code.replace(/_/g, " ")}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                      {finding.field_type
                        ? finding.field_type.replace(/_/g, " ")
                        : linkedField?.field_type.replace(/_/g, " ") || "Statutory Declaration"}
                    </h4>
                  </div>
                  <VerdictBadge verdict={finding.status as EpistemicVerdict} size="sm" />
                </div>

                {/* Values Comparison Strip */}
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block uppercase">
                      {language === "hi" ? "प्राप्त मान" : "Observed"}
                    </span>
                    <span
                      className={`font-bold truncate block ${
                        finding.status === "FAIL"
                          ? "text-rose-700"
                          : finding.status === "REVIEW"
                          ? "text-amber-700"
                          : "text-slate-900"
                      }`}
                    >
                      {finding.measured_value}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block uppercase">
                      {language === "hi" ? "विहित मानक" : "Prescribed"}
                    </span>
                    <span className="text-slate-900 font-medium truncate block">
                      {finding.required_value}
                    </span>
                  </div>
                </div>

                {/* Discrepancy & Legal Notice Footnote */}
                {finding.discrepancy && (
                  <p className="mt-1.5 text-[11px] text-slate-600 leading-snug">
                    <span className="font-semibold text-slate-800">
                      {language === "hi" ? "निष्कर्ष: " : "Finding: "}
                    </span>
                    {finding.discrepancy}
                  </p>
                )}

                {/* Automated Finding vs Officer Adjudication Distinction Strip */}
                {(() => {
                  const findingAdj = findingDecisions?.[finding.finding_id];
                  const rawDecision = findingAdj
                    ? findingAdj.decision
                    : caseAdjudication
                    ? (caseAdjudication.verdict === "CONFIRM_VIOLATION"
                        ? "CONFIRMED"
                        : caseAdjudication.verdict === "DISMISS_AS_COMPLIANT"
                        ? "DISMISSED"
                        : "RETEST_ORDERED")
                    : undefined;

                  const getDecisionLabel = (dec?: string) => {
                    if (!dec) return undefined;
                    if (language !== "hi") return dec;
                    if (dec.includes("CONFIRM")) return "पुष्टीकृत";
                    if (dec.includes("DISMISS")) return "खारिज";
                    return "पुनः जांच";
                  };

                  const officerDecisionText = getDecisionLabel(rawDecision);

                  return (
                    <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500 font-sans text-[10px] uppercase font-semibold">
                          {language === "hi" ? "एआई निष्कर्ष:" : "AI Finding:"}
                        </span>
                        <span className="font-bold text-slate-800">{finding.status}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500 font-sans text-[10px] uppercase font-semibold">
                          {language === "hi" ? "अधिकारी निर्णय:" : "Officer Adjudication:"}
                        </span>
                        {officerDecisionText ? (
                          <span
                            className={`font-bold px-1.5 py-0.2 rounded text-[10px] border ${
                              rawDecision?.includes("CONFIRM")
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : rawDecision?.includes("DISMISS")
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-800 border-amber-200"
                            }`}
                          >
                            {officerDecisionText}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-[10px] font-sans">
                            {language === "hi" ? "समीक्षा लंबित" : "Pending Review"}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Relational Evidence Link */}
                <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span>{linkedField?.token_ids?.[0] ? `#${linkedField.token_ids[0]}` : `#${finding.finding_id}`}</span>
                  </span>
                  <span className="text-[#1B365D] hover:underline font-semibold text-[10px]">
                    {language === "hi" ? "पैकेज पर ट्रेस करें ↗" : "Click to trace on package ↗"}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
