import React, { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import {
  Camera,
  Sun,
  Maximize2,
  FileText,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import type { PipelineStepItem } from "./PipelineStepper";

interface StatutoryPipelineRailProps {
  steps: PipelineStepItem[];
  language?: "en" | "hi";
  className?: string;
  onStepSelect?: (index: number) => void;
}

const STEP_ICONS: Record<string, LucideIcon> = {
  capture: Camera,
  quality: Sun,
  calibration: Maximize2,
  ocr: FileText,
  rules: Sparkles,
  review: ShieldCheck,
};

export const StatutoryPipelineRail: React.FC<StatutoryPipelineRailProps> = ({
  steps,
  language = "en",
  className = "",
  onStepSelect,
}) => {
  const activeIdx = steps.findIndex((s) => s.status === "active");
  const currentActiveIdx = activeIdx !== -1 ? activeIdx : steps.every((s) => s.status === "completed") ? steps.length - 1 : 0;
  
  // Track selected step for mobile inspection (defaults to currently active step)
  const [selectedMobileIdx, setSelectedMobileIdx] = useState<number>(currentActiveIdx);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Sync selected mobile step when active index changes externally
  React.useEffect(() => {
    setSelectedMobileIdx(currentActiveIdx);
  }, [currentActiveIdx]);

  const focusedStep = steps[selectedMobileIdx] || steps[currentActiveIdx] || steps[0];
  const progressPercent = steps.length > 1
    ? Math.min(100, Math.max(0, (currentActiveIdx / (steps.length - 1)) * 100))
    : 0;

  const getStepIcon = (id: string, idx: number, isCompleted: boolean) => {
    if (isCompleted) return <CheckCircle2 size={14} className="stroke-[2.5]" />;
    const IconComp = STEP_ICONS[id] || Camera;
    return <IconComp size={13} />;
  };

  const getLocalizedLabel = (step: PipelineStepItem) => {
    if (language !== "hi") return step.label;
    switch (step.id) {
      case "capture": return "साक्ष्य अधिग्रहण";
      case "quality": return "गुणवत्ता द्वार";
      case "calibration": return "मीट्रिक अंशांकन";
      case "ocr": return "पाठ पहचान (OCR)";
      case "rules": return "नियम मूल्यांकन";
      case "review": return "अधिकारी न्यायनिर्णयन";
      default: return step.label;
    }
  };

  const getLocalizedDesc = (step: PipelineStepItem) => {
    if (language !== "hi") return step.description;
    switch (step.id) {
      case "capture": return "ArUco संदर्भ के साथ पैकेज फोटोग्राफ।";
      case "quality": return "स्पष्टता एवं सतह चमक परीक्षण।";
      case "calibration": return "50 मिमी संदर्भ द्वारा मिलीमीटर स्केल।";
      case "ocr": return "बहुभाषी विधिक घोषणा निष्कर्षण।";
      case "rules": return "तालिका-I फॉन्ट एवं नियम 6 अनुपालन।";
      case "review": return "विधिक निष्कर्ष हस्ताक्षर एवं प्रपत्र-1।";
      default: return step.description;
    }
  };

  const getStatusText = (status: PipelineStepItem["status"]) => {
    if (language === "hi") {
      switch (status) {
        case "active": return "प्रगति पर";
        case "completed": return "सत्यापित";
        case "failed": return "विफल";
        default: return "प्रतीक्षारत";
      }
    }
    switch (status) {
      case "active": return "In Progress";
      case "completed": return "Completed";
      case "failed": return "Failed";
      default: return "Pending";
    }
  };

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3 sm:p-4 transition-all ${className}`}
    >
      {/* 1. SLIMLINE HEADER BAR: Compact, informative, live telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#1B365D] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <ShieldCheck size={14} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                {language === "hi" ? "विधिक सत्यापन पाइपलाइन" : "Statutory Verification Pipeline"}
              </h2>
              <span className="hidden sm:inline-block text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                SEC. 15
              </span>
            </div>
            <p className="text-[11px] text-slate-600 hidden sm:block">
              {language === "hi"
                ? "एलएमपीसी नियम, 2011 (नियम 6 एवं तालिका-I) स्वचालित परीक्षण अनुक्रम"
                : "6-stage automated enforcement pipeline under LMPC Rules, 2011 & LM Act, 2009"}
            </p>
          </div>
        </div>

        {/* Dynamic Active Step Badge with Animated Radar Ping */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50/90 border border-blue-200 text-[#1B365D] shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1B365D]" />
            </span>
            <span className="font-mono text-[10px] text-blue-700">
              {currentActiveIdx + 1}/{steps.length}
            </span>
            <span className="text-slate-300">|</span>
            <span className="truncate max-w-[150px] sm:max-w-[200px]">
              {getLocalizedLabel(steps[currentActiveIdx])}
            </span>
            <span className="text-[9px] uppercase px-1 py-0.2 bg-blue-600 text-white font-extrabold rounded-xs tracking-wider">
              {getStatusText("active")}
            </span>
          </div>
        </div>
      </div>

      {/* 2. UNIFIED HORIZONTAL STEPPER RAIL */}
      <div className="relative pt-2 pb-1">
        {/* Background Guide Track */}
        <div className="absolute top-[18px] left-3 right-3 sm:left-6 sm:right-6 h-1 bg-slate-100 rounded-full z-0 overflow-hidden">
          {/* Animated Filled Progress Track */}
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-blue-600 to-[#1B365D] rounded-full transition-all duration-700 ease-out relative"
            style={{ width: `${progressPercent}%` }}
          >
            {/* Shimmer light beam running through the filled track */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
          </div>
        </div>

        {/* Step Nodes along the continuous line */}
        <div className="relative z-10 flex items-start justify-between">
          {steps.map((step, idx) => {
            const isCompleted = step.status === "completed";
            const isActive = step.status === "active";
            const isSelectedMobile = idx === selectedMobileIdx;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center group cursor-pointer"
                onClick={() => {
                  setSelectedMobileIdx(idx);
                  onStepSelect?.(idx);
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Node Circle Container with Motion and Pulse */}
                <div className="relative flex items-center justify-center">
                  {/* Active Radar Ripple Beacon */}
                  {isActive && (
                    <m.span
                      className="absolute -inset-2 rounded-full bg-blue-500/25 pointer-events-none"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.7, 0, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}

                  {/* Node Circle */}
                  <m.div
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 relative z-10 ${
                      isCompleted
                        ? "bg-emerald-600 text-white shadow-xs"
                        : isActive
                        ? "bg-[#1B365D] text-white ring-4 ring-blue-500/20 shadow-[0_0_12px_rgba(27,54,93,0.35)] scale-110"
                        : isSelectedMobile
                        ? "bg-slate-200 text-slate-800 ring-2 ring-slate-400"
                        : "bg-white text-slate-700 border-2 border-slate-200 group-hover:border-slate-400 group-hover:bg-slate-50"
                    }`}
                  >
                    {getStepIcon(step.id, idx, isCompleted)}

                    {/* Micro active status indicator on the circle */}
                    {isActive && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                      </span>
                    )}
                  </m.div>
                </div>

                {/* Desktop Labels (Directly under the nodes on PC) */}
                <div className="hidden md:flex flex-col items-center text-center mt-1.5 max-w-[105px] transition-all">
                  <span
                    className={`text-[11px] font-bold leading-tight line-clamp-1 transition-colors ${
                      isActive
                        ? "text-[#1B365D] font-extrabold"
                        : isCompleted
                        ? "text-slate-800"
                        : "text-slate-700 group-hover:text-slate-800"
                    }`}
                  >
                    {getLocalizedLabel(step)}
                  </span>
                  <span className="text-[9.5px] font-mono text-slate-600 mt-0.5">
                    {language === "hi" ? `चरण ${idx + 1}` : `Stage 0${idx + 1}`}
                  </span>

                  {/* Active Pill Badge */}
                  {isActive && (
                    <span className="mt-0.5 text-[8.5px] font-black uppercase tracking-wider text-blue-700 bg-blue-100/90 px-1.5 py-0.2 rounded-full border border-blue-200/60 animate-pulse">
                      {language === "hi" ? "सक्रिय" : "Active"}
                    </span>
                  )}
                </div>

                {/* Mobile Step Number Indicator below the node */}
                <div className="flex md:hidden flex-col items-center mt-1">
                  <span
                    className={`text-[10px] font-mono font-bold ${
                      isActive
                        ? "text-[#1B365D] font-black"
                        : isCompleted
                        ? "text-emerald-700"
                        : "text-slate-600"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-0.5 animate-pulse" />
                  )}
                </div>

                {/* Desktop Hover Tooltip for statutory description */}
                <AnimatePresence>
                  {hoveredIdx === idx && (
                    <m.div
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="hidden md:block absolute top-[68px] z-50 pointer-events-none"
                    >
                      <div className="bg-slate-900 text-white text-left text-[11px] p-2.5 rounded-lg shadow-xl border border-slate-800 max-w-[200px] space-y-1">
                        <div className="flex items-center justify-between gap-1 border-b border-slate-700 pb-1">
                          <span className="font-bold text-white">
                            {idx + 1}. {getLocalizedLabel(step)}
                          </span>
                          <span
                            className={`text-[9px] px-1 rounded font-bold uppercase ${
                              isCompleted
                                ? "bg-emerald-800 text-emerald-200"
                                : isActive
                                ? "bg-blue-800 text-blue-200"
                                : "bg-slate-800 text-slate-300"
                            }`}
                          >
                            {getStatusText(step.status)}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-300 leading-snug">
                          {getLocalizedDesc(step)}
                        </p>
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. MOBILE POV: Compact, Animated Step Focus Card */}
      <div className="mt-2.5 block md:hidden">
        <m.div
          key={focusedStep.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`p-2.5 rounded-lg border text-xs transition-all ${
            focusedStep.status === "active"
              ? "bg-blue-50/90 border-blue-200 text-slate-900 shadow-2xs"
              : focusedStep.status === "completed"
              ? "bg-emerald-50/80 border-emerald-200 text-emerald-950"
              : "bg-slate-50 border-slate-200 text-slate-800"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                  focusedStep.status === "active"
                    ? "bg-[#1B365D] text-white"
                    : focusedStep.status === "completed"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {selectedMobileIdx + 1}
              </span>
              <span className="font-bold text-xs truncate text-slate-900">
                {getLocalizedLabel(focusedStep)}
              </span>
            </div>
            <span
              className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm shrink-0 ${
                focusedStep.status === "active"
                  ? "bg-blue-600 text-white animate-pulse"
                  : focusedStep.status === "completed"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {getStatusText(focusedStep.status)}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1 pl-6 leading-snug">
            {getLocalizedDesc(focusedStep)}
          </p>
        </m.div>
      </div>
    </div>
  );
};

export default StatutoryPipelineRail;
