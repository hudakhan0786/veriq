import React from "react";
import { AlertTriangle, ArrowRight, UserCheck, ShieldAlert } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export interface EvidenceConflictItem {
  id: string;
  field: string;
  expected: string;
  observed: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  description: string;
  requiresHumanDecision: boolean;
  resolved?: boolean;
}

interface ConflictCardProps {
  conflicts: EvidenceConflictItem[];
  onReview?: () => void;
  className?: string;
}

export const ConflictCard: React.FC<ConflictCardProps> = ({
  conflicts,
  onReview,
  className = "",
}) => {
  const { language } = useLanguage();

  if (!conflicts || conflicts.length === 0) return null;

  return (
    <div className={`overflow-hidden rounded-xl border border-amber-300 bg-amber-50/50 shadow-xs ${className}`}>
      {/* Alert Header */}
      <div className="flex items-start gap-3 border-b border-amber-200 px-5 py-4 bg-amber-100/60">
        <div className="rounded-lg bg-amber-600 p-2 text-white shrink-0 shadow-xs">
          <AlertTriangle size={20} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-amber-950">
              {language === "hi" ? "परस्पर विरोधी साक्ष्य संसूचित" : "Conflicting Evidence Detected"}
            </h3>
            <span className="rounded bg-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-900 uppercase border border-amber-300">
              {language === "hi" ? "मानव समीक्षा अनिवार्य" : "HUMAN REVIEW MANDATORY"}
            </span>
          </div>
          <p className="mt-1 text-xs text-amber-900 leading-relaxed">
            {language === "hi"
              ? "स्वचालित ओसीआर और नियम मूल्यांकन ने पैकेज पर परस्पर असंगत चिह्नों की पहचान की है। धारा 63 बीएसए 2023 के तहत, परस्पर विरोधी डिजिटल साक्ष्य को स्वायत्त रूप से हल नहीं किया जा सकता है और इसके लिए अधिकारी अधिनिर्णय आवश्यक है।"
              : "Automated OCR and rule evaluation identified mutually inconsistent markings on the package. Under Section 63 BSA 2023, conflicting digital evidence cannot be resolved autonomously and requires officer adjudication."}
          </p>
        </div>
      </div>

      {/* Conflicts List */}
      <div className="divide-y divide-amber-200/60 p-5 space-y-4">
        {conflicts.map((c) => (
          <div key={c.id} className="pt-3 first:pt-0">
            <div className="grid gap-3 sm:grid-cols-[140px_1fr] items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100/80 border border-amber-200 px-2 py-1 rounded inline-block w-fit">
                {c.field}
              </span>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-800 shadow-2xs">
                    {language === "hi" ? "अपेक्षित: " : "Expected: "}
                    {c.expected}
                  </span>
                  <ArrowRight size={15} className="text-amber-600" />
                  <span className="rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-800 shadow-2xs">
                    {language === "hi" ? "प्रेक्षित: " : "Observed: "}
                    {c.observed}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-slate-700">{c.description}</p>
              </div>
            </div>

            {c.requiresHumanDecision && !c.resolved && onReview && (
              <div className="mt-3.5 flex justify-end">
                <button
                  type="button"
                  onClick={onReview}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#1B365D] hover:bg-[#0A2540] px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors"
                >
                  <UserCheck size={14} />
                  <span>{language === "hi" ? "अधिकारी अधिनिर्णय खोलें" : "Open Officer Adjudication"}</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConflictCard;
