import React from "react";
import { AlertTriangle, ArrowRight, UserRoundCheck } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export interface EvidenceConflict {
  id: string;
  field: string;
  expected: string;
  observed: string;
  description: string;
  requiresHumanDecision?: boolean;
  resolved?: boolean;
  resolutionNote?: string;
  selectedDecision?: string;
}

export interface ConflictResolutionCardProps {
  conflicts: EvidenceConflict[];
  onOpenAdjudication?: () => void;
  onReview?: () => void;
}

export const ConflictResolutionCard: React.FC<ConflictResolutionCardProps> = ({
  conflicts,
  onOpenAdjudication,
  onReview,
}) => {
  const { language } = useLanguage();
  const handleAction = onOpenAdjudication || onReview;

  if (!conflicts || conflicts.length === 0) {
    return null;
  }

  return (
    <div
      data-testid="conflict-resolution-card"
      className="overflow-hidden rounded-xl border border-amber-300 bg-amber-50/50 shadow-xs"
    >
      {/* Header */}
      <div className="flex items-start gap-3 border-b border-amber-200 bg-amber-100/70 px-5 py-3.5">
        <div className="rounded-lg bg-amber-200/80 p-2 text-amber-900 border border-amber-300 shadow-2xs shrink-0">
          <AlertTriangle className="w-5 h-5 text-amber-800" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-amber-950">
              {language === "hi"
                ? `मानवीय समीक्षा आवश्यक (${conflicts.length} विरोधाभासी अंकन)`
                : `Human Review Required (${conflicts.length} Contradictory ${conflicts.length === 1 ? "Marking" : "Markings"})`}
            </h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white text-amber-900 border border-amber-300 shadow-2xs">
              {language === "hi" ? "धारा 63 बीएसए 2023 · एचआईटीएल गेट" : "SECTION 63 BSA 2023 · HITL GATE"}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-amber-900 leading-relaxed font-medium">
            {language === "hi"
              ? "स्वचालित प्रसंस्करण द्वारा विरोधाभासी घोषणाएं अथवा दोहरे मूल्य अंकन पहचाने गए हैं जिनका समाधान विधिक अधिकारी निर्णय के बिना नहीं किया जा सकता।"
              : "Automated processing identified contradictory declarations or dual markings that cannot be deterministically resolved without human officer adjudication."}
          </p>
        </div>
      </div>

      {/* Conflict Items List */}
      <div className="divide-y divide-amber-200/60 bg-white">
        {conflicts.map((c) => (
          <div key={c.id} className="p-4 sm:p-5 hover:bg-amber-50/40 transition-colors">
            <div className="grid gap-3 sm:grid-cols-[140px_1fr] items-start">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#1B365D] bg-slate-100 px-2.5 py-1 rounded border border-slate-300 shadow-2xs font-mono">
                  {c.field}
                </span>
                {c.resolved && (
                  <span className="mt-1.5 inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-0.5"></span>
                    <span className="break-words">
                      {c.resolutionNote || c.selectedDecision
                        ? (language === "hi" ? `एलएमओ अधिनिर्णय: ${c.resolutionNote || c.selectedDecision}` : `LMO Adjudicated: ${c.resolutionNote || c.selectedDecision}`)
                        : (language === "hi" ? "अधिकारी द्वारा निस्तारित" : "Resolved by LMO")}
                    </span>
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {(c.expected || c.observed) && (
                  <div className="flex flex-wrap items-center gap-2">
                    {c.expected && (
                      <span className="rounded bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-800 border border-slate-300 shadow-2xs font-mono">
                        {language === "hi" ? "अपेक्षित:" : "Expected:"} {c.expected}
                      </span>
                    )}
                    {c.expected && c.observed && (
                      <ArrowRight className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    )}
                    {c.observed && (
                      <span className="rounded bg-rose-50 border border-rose-300 px-2.5 py-1 text-xs font-semibold text-rose-800 shadow-2xs font-mono">
                        {language === "hi" ? "प्राप्त:" : "Observed:"} {c.observed}
                      </span>
                    )}
                  </div>
                )}

                <p className="text-xs leading-relaxed text-slate-700 font-medium">
                  {c.description}
                </p>

                {c.requiresHumanDecision !== false && !c.resolved && handleAction && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleAction}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#1B365D] hover:bg-[#0A2540] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                    >
                      <UserRoundCheck className="w-4 h-4 text-amber-300" />
                      <span>{language === "hi" ? "अधिकारी न्यायिक निर्णय" : "Officer Adjudication"}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConflictResolutionCard;
