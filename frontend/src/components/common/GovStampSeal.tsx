import React from "react";
import { StateEmblem } from "./StateEmblem";
import { useLanguage } from "../../context/LanguageContext";

interface GovStampSealProps {
  className?: string;
  size?: number;
  officerName?: string;
  badgeNumber?: string;
  date?: string;
  ink?: "violet" | "blue" | "emerald" | "amber";
}

export const GovStampSeal: React.FC<GovStampSealProps> = ({
  className = "",
  size = 140,
  officerName = "Legal Metrology Officer",
  badgeNumber = "INSP-DL-0842",
  date = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
  ink = "violet",
}) => {
  const { language } = useLanguage();

  const inkMap = {
    violet: {
      border: "border-indigo-800/80 text-indigo-900",
      stroke: "#312E81",
      fill: "rgba(49, 46, 129, 0.04)",
      badgeBg: "bg-indigo-950/10 text-indigo-950",
    },
    blue: {
      border: "border-blue-900/80 text-blue-950",
      stroke: "#172554",
      fill: "rgba(23, 37, 84, 0.04)",
      badgeBg: "bg-blue-950/10 text-blue-950",
    },
    emerald: {
      border: "border-emerald-800/80 text-emerald-900",
      stroke: "#064E3B",
      fill: "rgba(6, 78, 59, 0.04)",
      badgeBg: "bg-emerald-950/10 text-emerald-950",
    },
    amber: {
      border: "border-amber-800/80 text-amber-900",
      stroke: "#78350F",
      fill: "rgba(120, 53, 15, 0.04)",
      badgeBg: "bg-amber-950/10 text-amber-950",
    },
  };

  const style = inkMap[ink];

  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`relative inline-flex items-center justify-center rounded-full border-2 border-dashed ${style.border} select-none transform -rotate-3 hover:rotate-0 transition-transform ${className}`}
      title={
        language === "hi"
          ? "भारत सरकार विधिक मापविज्ञान आधिकारिक वैधानिक मुहर"
          : "Official Government of India Legal Metrology Statutory Seal"
      }
    >
      {/* Outer Solid Ring */}
      <div className={`absolute inset-1 rounded-full border-2 ${style.border} pointer-events-none`} />

      {/* Inner Decorative Ring */}
      <div className={`absolute inset-3 rounded-full border border-dotted ${style.border} pointer-events-none opacity-60`} />

      {/* Content Stack */}
      <div className="flex flex-col items-center justify-center text-center p-2 z-10">
        <StateEmblem size={18} tone="navy" showMotto={true} className="mb-0.5" />
        
        <span className="text-[7.5px] font-black uppercase tracking-widest font-mono text-slate-800 leading-tight">
          {language === "hi" ? "उपभोक्ता मामले विभाग" : "DEPT OF CONSUMER AFFAIRS"}
        </span>
        <span className="text-[6.5px] font-bold tracking-wider font-mono text-slate-600 leading-tight">
          {language === "hi" ? "भारत सरकार" : "GOVT OF INDIA"}
        </span>

        <div className="w-16 h-px bg-slate-400/60 my-0.5" />

        <span className="text-[7px] font-mono font-black text-indigo-950 uppercase tracking-tight">
          {language === "hi" ? "सांविधिक सत्यापित" : "STATUTORY VERIFIED"}
        </span>
        <span className="text-[6px] font-mono text-slate-600">
          {language === "hi" ? "धारा 63 बीएसए 2023" : "SEC 63 BSA 2023"}
        </span>

        <div className="mt-0.5 text-[5.5px] font-mono text-slate-500">
          {date} • {badgeNumber}
        </div>
      </div>
    </div>
  );
};
