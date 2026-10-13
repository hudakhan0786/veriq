import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { Eye, Shield, Globe, Calendar, Clock } from "lucide-react";

import { IndianNationalFlag } from "../common/IndianNationalFlag";

export const GovTopBar: React.FC = () => {
  const { language, toggleLanguage, fontSize, setFontSize, highContrast, toggleHighContrast, t } =
    useLanguage();

  const [currentDateTime, setCurrentDateTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Formatted in IST (Asia/Kolkata)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const formatted = new Intl.DateTimeFormat(language === "hi" ? "hi-IN" : "en-IN", options).format(now);
      setCurrentDateTime(`${formatted} IST`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [language]);

  return (
    <div className="gov-topbar screen-only no-print bg-[#0A2540] text-slate-100 border-b border-slate-700/60 text-[11px] font-sans">
      <div className="w-full max-w-[1750px] mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between min-h-[2.25rem] py-1 gap-2 flex-nowrap overflow-x-auto no-scrollbar">
          {/* Left: Authentic Indian National Flag & Government Hierarchy */}
          <div className="flex items-center space-x-2.5">
            <IndianNationalFlag width={22} height={15} />

            <div className="flex items-center space-x-2 text-[10.5px] sm:text-[11px] font-medium leading-none">
              <span className="font-bold text-white tracking-wide">
                {language === "hi" ? "उपभोक्ता मामले विभाग" : "Department of Consumer Affairs"}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 hidden md:inline truncate max-w-sm">
                {language === "hi"
                  ? "साक्ष्य सत्यापन कार्यप्रणाली"
                  : "Evidentiary Verification Platform"}
              </span>
            </div>
          </div>

          {/* Center Security Classification Badge / Live IST Gazette Calendar */}
          <div className="hidden lg:flex items-center space-x-3 text-[10px] font-mono">
            <div className="flex items-center space-x-1.5 bg-[#0e2137] px-2.5 py-0.5 rounded border border-amber-500/30 text-amber-300">
              <Shield size={12} className="text-amber-400" />
              <span className="font-bold tracking-wider uppercase">
                {language === "hi" ? "साक्ष्य सहायता // धारा 63 बीएसए 2023" : "EVIDENTIARY ASSISTANCE // SEC 63 BSA 2023"}
              </span>
            </div>

            <div className="flex items-center space-x-1.5 text-slate-300 bg-slate-900/80 px-2.5 py-0.5 rounded border border-slate-700/60">
              <Calendar size={12} className="text-amber-400" />
              <span className="tabular-nums font-medium">{currentDateTime || "11 Sep 2026 IST"}</span>
            </div>
          </div>

          {/* Right: GIGW 3.0 Accessibility & Language Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0 ml-auto">
            {/* Screen Reader Access link */}
            <a
              href="#main-content"
              className="hidden sm:inline text-[10px] text-slate-300 hover:text-white underline underline-offset-2"
              title="Skip straight to primary statutory content"
            >
              {t("govt.screen_reader", "Screen Reader Access")}
            </a>

            <div className="h-3 w-px bg-slate-700 hidden sm:block" />

            {/* Font Size Adjuster A- | A | A+ */}
            <div className="hidden sm:flex items-center rounded border border-slate-700 bg-slate-800/80 p-0.5 font-mono text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setFontSize("sm")}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  fontSize === "sm" ? "bg-amber-500 text-slate-950" : "text-slate-300 hover:text-white"
                }`}
                title={t("govt.decrease_font", "Decrease font size")}
                aria-label="Small font size"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSize("md")}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  fontSize === "md" ? "bg-amber-500 text-slate-950" : "text-slate-300 hover:text-white"
                }`}
                title={t("govt.default_font", "Default font size")}
                aria-label="Default font size"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize("lg")}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  fontSize === "lg" ? "bg-amber-500 text-slate-950" : "text-slate-300 hover:text-white"
                }`}
                title={t("govt.increase_font", "Increase font size")}
                aria-label="Large font size"
              >
                A+
              </button>
            </div>

            {/* Contrast Mode Toggle */}
            <button
              type="button"
              onClick={toggleHighContrast}
              className={`px-2 py-0.5 rounded border text-[10.5px] font-semibold flex items-center gap-1 transition-colors ${
                highContrast
                  ? "bg-amber-400 text-slate-950 border-amber-300 font-bold"
                  : "bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white"
              }`}
              title="Toggle High Contrast Mode (WCAG AAA)"
              aria-label="Toggle High Contrast Mode"
            >
              <Eye size={12} />
              <span className="hidden sm:inline">
                {highContrast ? t("govt.standard", "Standard") : t("govt.contrast", "Contrast")}
              </span>
            </button>

            {/* Bilingual Hindi / English Toggle */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10.5px] shadow-2xs transition-colors"
              title="Switch language between English and Hindi"
              aria-label="Toggle Language"
            >
              <Globe size={12} />
              <span>{language === "en" ? "हिन्दी" : "English"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
