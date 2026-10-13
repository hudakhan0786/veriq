import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { DEMO_SCENARIOS, DemoScenarioItem } from "./demoCatalog";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Scale,
  Compass,
  FileText,
  Play,
  CheckCircle2,
  ExternalLink,
  Layers,
  BookOpen,
} from "lucide-react";

interface StatutoryDemoShowcaseProps {
  onSelectSku?: (caseId: string) => void;
  variant?: "full" | "compact";
}

export const StatutoryDemoShowcase: React.FC<StatutoryDemoShowcaseProps> = ({
  onSelectSku,
  variant = "full",
}) => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState<
    "ALL" | "FAIL" | "PASS" | "REVIEW" | "UNABLE_TO_VERIFY"
  >("ALL");

  const stats = useMemo(() => {
    return {
      ALL: DEMO_SCENARIOS.length,
      FAIL: DEMO_SCENARIOS.filter(s => s.targetVerdict === "FAIL").length,
      PASS: DEMO_SCENARIOS.filter(s => s.targetVerdict === "PASS").length,
      REVIEW: DEMO_SCENARIOS.filter(s => s.targetVerdict === "REVIEW").length,
      UNABLE_TO_VERIFY: DEMO_SCENARIOS.filter(s => s.targetVerdict === "UNABLE_TO_VERIFY").length
    };
  }, []);

  const filteredScenarios = useMemo(() => {
    if (activeFilter === "ALL") return DEMO_SCENARIOS;
    return DEMO_SCENARIOS.filter((s) => s.targetVerdict === activeFilter);
  }, [activeFilter]);

  const handleOpenCase = (caseId: string) => {
    if (onSelectSku) {
      onSelectSku(caseId);
    } else {
      navigate(`/inspections/${caseId}`);
    }
  };

  const getVerdictTheme = (verdict: DemoScenarioItem["targetVerdict"]) => {
    switch (verdict) {
      case "FAIL":
        return {
          pill: "bg-rose-50 text-rose-700 border-rose-200",
          cardBorder: "border-slate-200 hover:border-rose-300 bg-white hover:shadow-md",
          accentText: "text-rose-700",
          tagBg: "bg-rose-50/80 border-rose-200",
          icon: ShieldAlert,
        };
      case "PASS":
        return {
          pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
          cardBorder: "border-slate-200 hover:border-emerald-300 bg-white hover:shadow-md",
          accentText: "text-emerald-700",
          tagBg: "bg-emerald-50/80 border-emerald-200",
          icon: ShieldCheck,
        };
      case "REVIEW":
        return {
          pill: "bg-amber-50 text-amber-800 border-amber-200",
          cardBorder: "border-slate-200 hover:border-amber-300 bg-white hover:shadow-md",
          accentText: "text-amber-800",
          tagBg: "bg-amber-50/80 border-amber-200",
          icon: Scale,
        };
      case "UNABLE_TO_VERIFY":
        return {
          pill: "bg-slate-100 text-slate-700 border-slate-200",
          cardBorder: "border-slate-200 hover:border-slate-300 bg-white hover:shadow-md",
          accentText: "text-slate-700",
          tagBg: "bg-slate-50 border-slate-200",
          icon: Compass,
        };
    }
  };

  return (
    <section
      id="demo-showcase"
      aria-label="Statutory Demonstration Suite"
      className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 scroll-mt-24"
    >
      {/* Top National Header Bar */}
      <div className="bg-[#1B365D] text-white p-5 sm:p-6 border-b-2 border-amber-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-xs">
                <Sparkles size={13} className="text-slate-950" />
                <span>{language === "hi" ? "सांविधिक डेमो केंद्र" : "CERTIFIED DEMO SUITE"}</span>
              </span>
              <span className="text-[11px] text-amber-300 font-mono font-semibold">
                {language === "hi"
                  ? `${stats.ALL} पूर्व-प्रमाणित परीक्षण परिदृश्य`
                  : `${stats.ALL} Pre-Certified Enforcement Scenarios Ready`}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {language === "hi"
                ? "सांविधिक प्रदर्शन एवं परीक्षण सुइट"
                : "Statutory Demonstration & Evaluation Hub"}
            </h2>

            <p className="text-xs text-blue-100 leading-relaxed">
              {language === "hi"
                ? "एलएमपीसी नियम, 2011, तालिका-I फॉन्ट अनुसूची एवं धारा 63 भारतीय साक्ष्य अधिनियम, 2023 के तहत वास्तविक परिदृश्यों का 1-क्लिक परीक्षण करें। प्रत्येक परिदृश्य पूर्ण ओसीआर, अंशांकन और नियम परिणाम प्रस्तुत करता है।"
                : "Test end-to-end statutory verification workflows with pre-certified demonstration scenarios. Each case includes high-resolution packaging frames, calibrated ArUco homography, multilingual OCR, rule AST evaluations, and Section 63 BSA 2023 Merkle certificates."}
            </p>
          </div>

          {/* Quick Start Tour CTA */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start md:self-center">
            <button
              type="button"
              onClick={() => handleOpenCase("SKU-DEMO-01")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-xs transition-all border border-amber-500 cursor-pointer"
            >
              <Play size={15} className="fill-slate-950" />
              <span>
                {language === "hi" ? "डेमो टूर शुरू करें (केस 1)" : "Start Demo Tour (Case 1) →"}
              </span>
            </button>
          </div>
        </div>

        {/* Filter Pills Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 mt-5 pt-3 border-t border-white/10">
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mr-1">
            {language === "hi" ? "फ़िल्टर परिदृश्य:" : "Filter Scenarios:"}
          </span>
          {[
            {
              id: "ALL" as const,
              label: language === "hi" ? `सभी डेमो (${stats.ALL})` : `All Demo Cases (${stats.ALL})`,
              count: stats.ALL,
            },
            {
              id: "FAIL" as const,
              label: language === "hi" ? `उल्लंघन / अनुत्तीर्ण (${stats.FAIL})` : `Violations / FAIL (${stats.FAIL})`,
              count: stats.FAIL,
            },
            {
              id: "PASS" as const,
              label: language === "hi" ? `पूर्ण अनुपालक / उत्तीर्ण (${stats.PASS})` : `Compliant / PASS (${stats.PASS})`,
              count: stats.PASS,
            },
            {
              id: "REVIEW" as const,
              label: language === "hi" ? `मानव समीक्षा / सीमांत (${stats.REVIEW})` : `Borderline / REVIEW (${stats.REVIEW})`,
              count: stats.REVIEW,
            },
            {
              id: "UNABLE_TO_VERIFY" as const,
              label: language === "hi" ? `पुनः कैप्चर / चकाचौंध (${stats.UNABLE_TO_VERIFY})` : `Retake / UNABLE (${stats.UNABLE_TO_VERIFY})`,
              count: stats.UNABLE_TO_VERIFY,
            },
          ].map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? "bg-amber-400 text-slate-950 shadow-xs"
                    : "bg-[#0A2540] text-slate-200 hover:text-white hover:bg-[#143154] border border-blue-900/50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="p-4 sm:p-6 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredScenarios.map((item) => {
            const theme = getVerdictTheme(item.targetVerdict);
            const VerdictIcon = theme.icon;
            const title = language === "hi" && item.titleHi ? item.titleHi : item.title;
            const category =
              language === "hi" && item.categoryHi ? item.categoryHi : item.category;
            const headline =
              language === "hi" && item.headlineViolationHi
                ? item.headlineViolationHi
                : item.headlineViolation;

            return (
              <div
                key={item.skuId}
                className={`rounded-xl border p-4 flex flex-col justify-between transition-all duration-200 ${theme.cardBorder}`}
              >
                <div className="space-y-3">
                  {/* Card Header: Tag, Counter & Verdict */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-slate-100 text-[#1B365D] border border-slate-200">
                        DEMO #{item.scenarioNumber}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-500">
                        {item.skuId}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase border ${theme.pill}`}
                    >
                      <VerdictIcon size={12} />
                      <span>{item.targetVerdict}</span>
                    </span>
                  </div>

                  {/* Thumbnail & Title Row */}
                  <div className="flex gap-3 items-start">
                    <div className="w-16 h-16 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                      <img
                        src={item.imagePath}
                        alt={title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to stylized SVG placeholder
                          (e.currentTarget as HTMLImageElement).src =
                            "/assets/cleanhome-cleaner-demo.svg";
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1" title={title}>
                        {title}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                        {category} • {item.packageType}
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-mono text-[#1B365D] font-bold">
                        {item.inspectionNumber}
                      </span>
                    </div>
                  </div>

                  {/* Headline Infraction Banner */}
                  <div className={`p-2.5 rounded-lg border text-xs ${theme.tagBg}`}>
                    <div className="flex items-start gap-1.5">
                      <VerdictIcon size={14} className={`shrink-0 mt-0.5 ${theme.accentText}`} />
                      <p className={`font-bold leading-snug ${theme.accentText}`}>
                        {headline}
                      </p>
                    </div>
                  </div>

                  {/* Statutory Metric Telemetry Badge */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">
                        {language === "hi" ? "पीडीपी क्षेत्रफल" : "PDP Area"}
                      </span>
                      <span className="font-mono font-extrabold text-slate-900">
                        {item.pdpAreaCm2} cm²
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">
                        {language === "hi" ? "तालिका-I न्यूनतम फॉन्ट" : "Table-I Min Font"}
                      </span>
                      <span className="font-mono font-extrabold text-slate-900">
                        {item.observedFontMm
                          ? `${item.observedFontMm} mm (Req >= ${item.expectedFontMm} mm)`
                          : `>= ${item.expectedFontMm} mm`}
                      </span>
                    </div>
                  </div>

                  {/* Primary Statutory Reference */}
                  <div className="text-[11px] text-slate-500 font-mono truncate">
                    <span className="font-bold text-slate-700 mr-1">Rule:</span>
                    <span>{item.statutoryRules[0]}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10.5px] font-mono font-semibold text-slate-500">
                    Sec 63 BSA 2023
                  </span>

                  <button
                    type="button"
                    onClick={() => handleOpenCase(item.caseId)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#1B365D] text-white hover:bg-[#0A2540] transition-all shadow-xs"
                  >
                    <span>{language === "hi" ? "केस एवं परिणाम देखें" : "Inspect Demo"}</span>
                    <ArrowRight size={13} className="text-white" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
