import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { resetScrollToTop } from "../../components/common/ScrollToTop";
import { DEMO_SCENARIOS, getDemoScenarioById, DemoScenarioItem } from "./demoCatalog";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  FileCheck,
  BookOpen,
  X,
  Compass,
  Scale,
} from "lucide-react";

interface DemoCaseTourBannerProps {
  currentCaseId: string;
  onSelectCase?: (caseId: string) => void;
}

export const DemoCaseTourBanner: React.FC<DemoCaseTourBannerProps> = ({
  currentCaseId,
  onSelectCase,
}) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [showGuideModal, setShowGuideModal] = useState(false);

  const scenario = getDemoScenarioById(currentCaseId);
  if (!scenario) return null;

  const currentIndex = DEMO_SCENARIOS.findIndex((s) => s.caseId === scenario.caseId);
  const prevScenario =
    currentIndex > 0
      ? DEMO_SCENARIOS[currentIndex - 1]
      : DEMO_SCENARIOS[DEMO_SCENARIOS.length - 1];
  const nextScenario =
    currentIndex < DEMO_SCENARIOS.length - 1
      ? DEMO_SCENARIOS[currentIndex + 1]
      : DEMO_SCENARIOS[0];

  const handleNavigateTo = (targetCaseId: string) => {
    resetScrollToTop();
    if (onSelectCase) {
      onSelectCase(targetCaseId);
    } else {
      navigate(`/inspections/${targetCaseId}`);
    }
  };

  const getVerdictTheme = (verdict: DemoScenarioItem["targetVerdict"]) => {
    switch (verdict) {
      case "FAIL":
        return {
          pill: "bg-rose-50 text-rose-800 border-rose-300",
          border: "border-l-4 border-l-rose-600 border-slate-200 bg-white",
          accent: "text-rose-700",
          icon: ShieldAlert,
        };
      case "PASS":
        return {
          pill: "bg-emerald-50 text-emerald-800 border-emerald-300",
          border: "border-l-4 border-l-emerald-600 border-slate-200 bg-white",
          accent: "text-emerald-700",
          icon: ShieldCheck,
        };
      case "REVIEW":
        return {
          pill: "bg-amber-50 text-amber-800 border-amber-300",
          border: "border-l-4 border-l-amber-500 border-slate-200 bg-white",
          accent: "text-amber-800",
          icon: Scale,
        };
      case "UNABLE_TO_VERIFY":
        return {
          pill: "bg-purple-50 text-purple-800 border-purple-300",
          border: "border-l-4 border-l-purple-600 border-slate-200 bg-white",
          accent: "text-purple-700",
          icon: Compass,
        };
    }
  };

  const theme = getVerdictTheme(scenario.targetVerdict);
  const VerdictIcon = theme.icon;

  const label =
    language === "hi" && scenario.verdictLabelHi
      ? scenario.verdictLabelHi
      : scenario.verdictLabel;
  const title =
    language === "hi" && scenario.titleHi ? scenario.titleHi : scenario.title;
  const headline =
    language === "hi" && scenario.headlineViolationHi
      ? scenario.headlineViolationHi
      : scenario.headlineViolation;

  return (
    <>
      <div
        role="region"
        aria-label="Demonstration Scenario Navigation Bar"
        className={`demo-tour-banner screen-only no-print print:hidden rounded-xl border shadow-xs p-4 sm:p-5 bg-white transition-all duration-200 relative overflow-hidden ${theme.border}`}
      >
        {/* Subtle Top Tricolor Sovereign Accent */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF9933] via-slate-200 to-[#138808]" />

        <div className="flex flex-col 2xl:flex-row 2xl:items-center 2xl:justify-between gap-4 pt-0.5">
          {/* Left: Prominent Demo Identification & Scenario Summary */}
          <div className="flex items-start gap-3 min-w-0 2xl:flex-1">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#1B365D] border border-blue-200/80 shrink-0 shadow-2xs hidden sm:flex items-center justify-center">
              <Scale size={22} className="text-[#1B365D]" />
            </div>

            <div className="min-w-0 space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {/* Official Statutory Fixture Badge */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider bg-blue-50 text-[#1B365D] border border-blue-200 shadow-2xs shrink-0 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1B365D]" />
                  <span>{language === "hi" ? "सांविधिक डेमो मामला" : "DEMO CASE FIXTURE"}</span>
                </span>

                {/* Scenario Counter */}
                <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded border border-slate-200 shrink-0 whitespace-nowrap">
                  {language === "hi"
                    ? `परिदृश्य ${scenario.scenarioNumber} / ${scenario.totalScenarios}`
                    : `Scenario ${scenario.scenarioNumber} of ${scenario.totalScenarios}`}
                </span>

                {/* Target Verdict Pill */}
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold uppercase border shadow-2xs shrink-0 whitespace-nowrap ${theme.pill}`}
                >
                  <VerdictIcon size={13} />
                  <span>{label}</span>
                </span>

                <span className="text-sm font-mono font-bold text-[#1B365D] shrink-0 whitespace-nowrap">
                  [{scenario.skuId}]
                </span>
              </div>

              {/* Title & Headline Infraction */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h2 className="text-base sm:text-lg font-bold text-slate-900" title={title}>
                  {title}
                </h2>
                <span className="text-slate-400 hidden sm:inline">•</span>
                <p className={`text-sm font-bold ${theme.accent}`} title={headline}>
                  {headline}
                </p>
              </div>

              <p className="text-xs text-slate-500 line-clamp-2 sm:line-clamp-1 font-normal">
                {language === "hi"
                  ? "विधिक मापविज्ञान नियम 2011 एवं धारा 63 बीएसए 2023 के अंतर्गत पूर्व-प्रमाणित प्रदर्शन मामला।"
                  : "Pre-certified statutory scenario modeling automated LMPC compliance, calibrated optics, and BSA 2023 evidence proofs."}
              </p>
            </div>
          </div>

          {/* Right: Quick Tour Navigation Controls */}
          <div className="flex flex-wrap items-center justify-between sm:justify-start 2xl:justify-end gap-2.5 shrink-0 pt-3 2xl:pt-0 border-t 2xl:border-t-0 border-slate-100">
            {/* Previous Scenario Button */}
            <button
              type="button"
              onClick={() => handleNavigateTo(prevScenario.caseId)}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-2xs transition-all cursor-pointer shrink-0 whitespace-nowrap"
              title={`Previous: Scenario ${prevScenario.scenarioNumber} - ${prevScenario.title}`}
            >
              <ChevronLeft size={17} className="text-slate-600" />
              <span className="hidden sm:inline">{language === "hi" ? "पिछला" : "Prev"}</span>
            </button>

            {/* Quick Dropdown Selector */}
            <select
              value={scenario.caseId}
              onChange={(e) => handleNavigateTo(e.target.value)}
              aria-label="Select demonstration scenario"
              className="text-sm font-semibold bg-white text-slate-800 border border-slate-300 rounded-lg px-3 py-2 shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#1B365D] cursor-pointer flex-1 sm:flex-initial min-w-[160px] max-w-full sm:max-w-[280px] truncate"
            >
              {DEMO_SCENARIOS.map((s) => (
                <option key={s.caseId} value={s.caseId}>
                  #{s.scenarioNumber}: {s.targetVerdict}, {s.title}
                </option>
              ))}
            </select>

            {/* Next Scenario Button (Official Sovereign Navy) */}
            <button
              type="button"
              onClick={() => handleNavigateTo(nextScenario.caseId)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold text-white bg-[#1B365D] hover:bg-[#0A2540] border border-[#1B365D] shadow-xs transition-all cursor-pointer shrink-0 whitespace-nowrap"
              title={`Next: Scenario ${nextScenario.scenarioNumber} - ${nextScenario.title}`}
            >
              <span>{language === "hi" ? "अगला डेमो" : "Next Demo"}</span>
              <ChevronRight size={17} className="text-white" />
            </button>

            {/* Guide Details Modal Trigger */}
            <button
              type="button"
              onClick={() => setShowGuideModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 transition-colors shadow-2xs cursor-pointer shrink-0 whitespace-nowrap"
              title="View Demonstration Objectives & Statutory Rules"
            >
              <BookOpen size={16} className="text-[#1B365D]" />
              <span className="hidden md:inline">{language === "hi" ? "डेमो गाइड" : "Scenario Guide"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Demonstration Scenario Guide & Legal Context Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div
            role="dialog"
            aria-modal="true"
            className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-2xl overflow-hidden animate-pop-in"
          >
            {/* Modal Header */}
            <div className="bg-[#1B365D] text-white px-6 py-4 flex items-center justify-between border-b-2 border-amber-500">
              <div className="flex items-center gap-3">
                <div className="px-2.5 py-1 rounded-md bg-amber-400 text-slate-950 font-bold text-xs">
                  DEMO {scenario.scenarioNumber}/{scenario.totalScenarios}
                </div>
                <div>
                  <h3 className="text-base font-bold leading-tight">{title}</h3>
                  <p className="text-xs text-blue-100 font-mono mt-0.5">
                    {scenario.inspectionNumber} • {scenario.packageType}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="text-slate-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Expected Statutory Verdict */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white border border-slate-200 shrink-0">
                  <VerdictIcon size={20} className={theme.accent} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                      {language === "hi" ? "अपेक्षित सांविधिक निर्णय" : "Expected Statutory AI Verdict"}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] border ${theme.pill}`}>
                      {label}
                    </span>
                  </div>
                  <p className="font-bold text-slate-900 mt-1 text-xs">
                    {headline}
                  </p>
                  <p className="text-slate-600 mt-1 leading-relaxed text-[11.5px]">
                    {language === "hi" ? scenario.detailedRationaleHi : scenario.detailedRationale}
                  </p>
                </div>
              </div>

              {/* Statutory Rules Verified */}
              <div className="space-y-2">
                <h4 className="font-bold text-[#1B365D] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Scale size={14} className="text-[#1B365D]" />
                  <span>{language === "hi" ? "परीक्षित सांविधिक नियम" : "Statutory Rules Evaluated"}</span>
                </h4>
                <ul className="space-y-1.5">
                  {(language === "hi" ? scenario.statutoryRulesHi : scenario.statutoryRules).map(
                    (rule, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800"
                      >
                        <span className="text-[#1B365D] font-bold">§</span>
                        <span>{rule}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* What Capabilities are Tested */}
              <div className="space-y-2">
                <h4 className="font-bold text-[#1B365D] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <FileCheck size={14} className="text-emerald-700" />
                  <span>{language === "hi" ? "सत्यापित मॉड्यूल क्षमताएं" : "Subsystem Capabilities Demonstrated"}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(language === "hi"
                    ? scenario.testedCapabilitiesHi
                    : scenario.testedCapabilities
                  ).map((cap, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-2 text-[11px] text-slate-700 font-medium"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      <span className="truncate">{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evaluator / Officer Instructions */}
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 text-[#1B365D] space-y-1">
                <div className="font-bold text-[11px] flex items-center gap-1.5 text-[#1B365D]">
                  <Info size={14} className="text-[#1B365D]" />
                  <span>{language === "hi" ? "मूल्यांकनकर्ता / अधिकारी निर्देश" : "How to Inspect this Demonstration Scenario"}</span>
                </div>
                <p className="text-[11.5px] leading-relaxed text-slate-700">
                  {language === "hi" ? scenario.evaluatorGuideHi : scenario.evaluatorGuide}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                Section 63 BSA 2023 Digital Evidence Invariant Active
              </span>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="px-4 py-1.5 rounded-lg bg-[#1B365D] hover:bg-[#0A2540] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                {language === "hi" ? "समझ गया / केस देखें" : "Got it / Inspect Case"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
