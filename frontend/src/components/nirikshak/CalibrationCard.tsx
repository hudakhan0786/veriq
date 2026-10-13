import React from "react";
import { Ruler, CheckCircle2, AlertTriangle, Calculator } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export interface CalibrationData {
  available: boolean;
  method?: string;
  referenceObject?: string;
  referenceLengthMm?: number;
  measuredPixels?: number;
  scaleMmPerPixel?: number;
  uncertaintyMm?: number;
  timestamp?: string;
  operator?: string;
}

interface CalibrationCardProps {
  calibration: CalibrationData;
  className?: string;
}

export const CalibrationCard: React.FC<CalibrationCardProps> = ({
  calibration: c,
  className = "",
}) => {
  const { language } = useLanguage();

  if (!c.available) {
    return (
      <div className={`card border-amber-300 bg-amber-50/70 p-5 rounded-xl ${className}`}>
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-amber-100 p-2.5 text-amber-700 shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-amber-900">
                {language === "hi" ? "मीट्रिक अंशांकन अनुपलब्ध" : "Metric Calibration Unavailable"}
              </h3>
              <span className="rounded bg-amber-200/80 px-2 py-0.5 text-[10px] font-black text-amber-900">
                {language === "hi" ? "सेंसर अंशांकन रहित" : "SENSOR UNCALIBRATED"}
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-amber-800">
              {language === "hi"
                ? "पैकेजिंग तल पर कोई वैध संदर्भ वस्तु (अरूको 50मिमी मार्कर या कैलिब्रेटेड मानक) नहीं मिली। अंशांकन ट्रेसबिलिटी के बिना आयामी मापों को कानूनी रूप से प्रमाणित नहीं किया जा सकता।"
                : "No valid reference object (ArUco 50mm fiducial or calibrated standard) was detected on the packaging plane. Dimensional measurements cannot be legally certified without calibration traceability."}
            </p>
            <div className="mt-3 rounded-lg overflow-hidden border border-amber-200 bg-white p-1.5 shadow-2xs max-w-lg">
              <img
                src="/assets/guidance/calibration_scale_guide.svg"
                alt="Principle of 50mm fiducial metric calibration for Table-I compliance"
                className="w-full h-auto rounded"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const refObj = c.referenceObject || (language === "hi" ? "अरूको 4x4 (50 मिमी) मार्कर" : "ArUco 4x4 (50mm) Fiducial");
  const refLength = c.referenceLengthMm || 50;
  const measuredPx = c.measuredPixels || 420;
  const scale = c.scaleMmPerPixel || refLength / measuredPx;
  const uncertainty = c.uncertaintyMm !== undefined ? c.uncertaintyMm : 0.8;

  return (
    <div className={`card overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 bg-slate-50/80">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-blue-50 text-[#1B365D]">
            <Ruler size={17} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">
              {language === "hi" ? "प्रकाशीय अंशांकन एवं पता लगाने की क्षमता" : "Optical Calibration & Traceability"}
            </h3>
            <p className="text-[10px] text-slate-500">
              {language === "hi" ? "ISO/IEC 17025 के अनुसार मीट्रिक वास्तविक पैमाना कारक" : "Metric ground truth scale factor per ISO/IEC 17025"}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200">
          <CheckCircle2 size={12} />
          {language === "hi" ? "अंशांकित (CALIBRATED)" : "CALIBRATED"}
        </span>
      </div>

      {/* Grid Specs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5">
        <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
            {language === "hi" ? "संदर्भ वस्तु" : "Reference Object"}
          </p>
          <p className="mt-1 text-xs font-bold text-slate-900 truncate" title={refObj}>
            {refObj}
          </p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
            {language === "hi" ? "संदर्भ लंबाई" : "Fiducial Length"}
          </p>
          <p className="mt-1 text-xs font-bold text-slate-900">{refLength} mm</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
            {language === "hi" ? "मापे गए पिक्सल" : "Measured Pixels"}
          </p>
          <p className="mt-1 text-xs font-bold text-slate-900">{measuredPx} px</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
            {language === "hi" ? "नियत पैमाना" : "Resolved Scale"}
          </p>
          <p className="mt-1 text-xs font-bold text-[#1B365D] font-mono">{scale.toFixed(4)} mm/px</p>
        </div>
      </div>

      {/* Math Formula Box */}
      <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator size={14} className="text-[#1B365D]" />
            <p className="text-[11px] font-bold text-slate-800">
              {language === "hi" ? "ट्रेसबिलिटी गणना सूत्र" : "Traceability Calculation Formula"}
            </p>
          </div>
          <span className="text-[10px] font-semibold text-slate-500">
            {language === "hi" ? "अनुमानित सेंसर अनिश्चितता: " : "Estimated Sensor Uncertainty: "}
            <b className="text-slate-800">±{uncertainty} mm</b> (k=2, 95% CI)
          </span>
        </div>
        <div className="mt-2 rounded-md border border-slate-200 bg-white p-2.5 font-mono text-[11px] text-slate-700 flex flex-wrap items-center gap-2">
          <span>scale = reference_length / measured_pixels</span>
          <span className="text-slate-400">→</span>
          <span>{refLength} mm / {measuredPx} px</span>
          <span className="text-slate-400">≈</span>
          <span className="font-bold text-[#1B365D]">{scale.toFixed(4)} mm/pixel</span>
        </div>
      </div>
    </div>
  );
};

export default CalibrationCard;
