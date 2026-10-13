import React from "react";
import { GitBranch, CheckCircle2, XCircle, AlertTriangle, Info, ShieldAlert } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export interface RuleResultItem {
  id: string;
  ruleCode: string;
  title: string;
  description: string;
  category: string;
  status: "PASS" | "FAIL" | "REVIEW" | "MANUAL_REVIEW" | "NOT_EVALUATED";
  severity: "CRITICAL" | "MAJOR" | "MEDIUM" | "LOW";
  observedValue?: string;
  expectedValue?: string;
  evidenceIds?: string[];
  rationale: string;
}

interface RuleResultCardProps {
  rules: RuleResultItem[];
  className?: string;
}

export const RuleResultCard: React.FC<RuleResultCardProps> = ({ rules, className = "" }) => {
  const { language } = useLanguage();

  return (
    <div className={`card overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 bg-slate-50/80">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-blue-50 text-[#1B365D]">
            <GitBranch size={17} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">
              {language === "hi" ? "नियतात्मक सांविधिक जांचें" : "Deterministic Statutory Checks"}
            </h3>
            <p className="text-[10px] text-slate-500">
              {language === "hi"
                ? "एलएमपीसी नियम, 2011 एवं विधिक मापविज्ञान अधिनियम, 2009 के तहत मूल्यांकित"
                : "Evaluated against LMPC Rules, 2011 & Legal Metrology Act, 2009"}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
          {rules.length} {language === "hi" ? "मूल्यांकित" : "Evaluated"}
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {rules.map((r) => {
          const isPass = r.status === "PASS";
          const isReview = r.status === "REVIEW" || r.status === "MANUAL_REVIEW";
          const isFail = r.status === "FAIL";

          const statusLabel = isPass
            ? (language === "hi" ? "उत्तीर्ण" : "PASS")
            : isReview
            ? (language === "hi" ? "समीक्षा" : "REVIEW")
            : (language === "hi" ? "उल्लंघन" : "FAIL");

          const severityLabel =
            r.severity === "CRITICAL"
              ? (language === "hi" ? "गंभीर" : "CRITICAL")
              : r.severity === "MAJOR"
              ? (language === "hi" ? "प्रमुख" : "MAJOR")
              : r.severity === "MEDIUM"
              ? (language === "hi" ? "मध्यम" : "MEDIUM")
              : (language === "hi" ? "सामान्य" : "LOW");

          return (
            <div key={r.id} className="p-4 hover:bg-slate-50/70 transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 rounded-lg p-2 shrink-0 ${
                      isPass
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : isReview
                        ? "bg-amber-50 text-amber-600 border border-amber-200"
                        : "bg-rose-50 text-rose-600 border border-rose-200"
                    }`}
                  >
                    {isPass && <CheckCircle2 size={18} />}
                    {isReview && <AlertTriangle size={18} />}
                    {isFail && <XCircle size={18} />}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{r.title}</h4>
                      <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono font-bold text-[#1B365D] border border-slate-200">
                        {r.ruleCode}
                      </code>
                      <span className="text-[10px] text-slate-500">· {r.category}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">{r.description}</p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                    isPass
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : isReview
                      ? "bg-amber-50 text-amber-800 border border-amber-200"
                      : "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}
                >
                  {statusLabel}
                </span>
              </div>

              {/* Observed vs Expected Comparison Grid */}
              <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="rounded-md border border-slate-200 bg-slate-50 p-2.5">
                  <p className="text-[9px] uppercase font-bold text-slate-500">
                    {language === "hi" ? "प्रेक्षित साक्ष्य" : "Observed Evidence"}
                  </p>
                  <p className="mt-0.5 text-xs font-bold text-slate-900 break-words">
                    {r.observedValue ?? "Not available"}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-2.5">
                  <p className="text-[9px] uppercase font-bold text-slate-500">
                    {language === "hi" ? "सांविधिक आवश्यकता" : "Statutory Requirement"}
                  </p>
                  <p className="mt-0.5 text-xs font-bold text-slate-900 break-words">
                    {r.expectedValue ?? "Not available"}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-2.5">
                  <p className="text-[9px] uppercase font-bold text-slate-500">
                    {language === "hi" ? "सांविधिक गंभीरता" : "Statutory Severity"}
                  </p>
                  <p
                    className={`mt-0.5 text-xs font-bold ${
                      r.severity === "CRITICAL"
                        ? "text-rose-700"
                        : r.severity === "MAJOR"
                        ? "text-amber-700"
                        : "text-slate-700"
                    }`}
                  >
                    {severityLabel}
                  </p>
                </div>
              </div>

              {/* Legal Rationale Box */}
              <div className="mt-2.5 flex items-start gap-2 rounded-lg bg-slate-50 p-2.5 border border-slate-200">
                <Info size={14} className="mt-0.5 text-[#1B365D] shrink-0" />
                <p className="text-[11px] leading-relaxed text-slate-600">
                  <b className="text-slate-900">
                    {language === "hi" ? "विधिक आधार: " : "Legal Ground: "}
                  </b>
                  {r.rationale}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RuleResultCard;
