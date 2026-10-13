import React from "react";
import { Ruler, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export interface CalibratedMeasurementItem {
  id: string;
  name: string;
  observedValue: number | string;
  declaredValue?: number | string;
  unit: string;
  toleranceMin?: number;
  toleranceMax?: number;
  deviation?: number | string;
  status: "PASS" | "FAIL" | "REVIEW" | "MANUAL_REVIEW";
  source: string;
  requirementSchedule?: string;
}

interface MeasurementCardProps {
  measurements: CalibratedMeasurementItem[];
  className?: string;
}

export const MeasurementCard: React.FC<MeasurementCardProps> = ({
  measurements,
  className = "",
}) => {
  const { language } = useLanguage();

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
              {language === "hi" ? "अंशांकित मीट्रिक माप" : "Calibrated Metric Measurements"}
            </h3>
            <p className="text-[10px] text-slate-500">
              {language === "hi"
                ? "सांविधिक सहिष्णुता के विरुद्ध सत्यापित फोटोग्राममेट्रिक अवलोकन"
                : "Photogrammetric observations verified against statutory tolerances"}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
          {measurements.length}{" "}
          {measurements.length === 1
            ? (language === "hi" ? "मद" : "Item")
            : (language === "hi" ? "मदें" : "Items")}
        </span>
      </div>

      {measurements.length === 0 ? (
        <div className="p-8 text-center">
          <Ruler size={28} className="mx-auto text-slate-300" />
          <p className="mt-3 text-xs font-bold text-slate-500">
            {language === "hi" ? "कोई अंशांकित माप उपलब्ध नहीं" : "No Calibrated Measurements Available"}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            {language === "hi"
              ? "मापों के लिए सक्रिय अंशांकन साक्ष्य (अरूको मार्कर या संदर्भ मानक) की आवश्यकता होती है।"
              : "Measurements require active calibration evidence (ArUco marker or reference standard)."}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {measurements.map((m) => {
            const isPass = m.status === "PASS";
            const isReview = m.status === "REVIEW" || m.status === "MANUAL_REVIEW";
            const isFail = m.status === "FAIL";

            const statusLabel = isPass
              ? (language === "hi" ? "उत्तीर्ण" : "PASS")
              : isReview
              ? (language === "hi" ? "समीक्षा" : "REVIEW")
              : (language === "hi" ? "उल्लंघन" : "FAIL");

            return (
              <div key={m.id} className="p-4 hover:bg-slate-50/70 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{m.name}</h4>
                    <p className="mt-0.5 text-[10px] text-slate-500">
                      {language === "hi" ? "स्रोत: " : "Source: "}
                      {m.source}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      isPass
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : isReview
                        ? "bg-amber-50 text-amber-800 border border-amber-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {isPass && <CheckCircle2 size={11} />}
                    {isReview && <AlertTriangle size={11} />}
                    {isFail && <XCircle size={11} />}
                    {statusLabel}
                  </span>
                </div>

                {/* 4 Metrics Columns */}
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="rounded-md bg-slate-50 p-2 border border-slate-200">
                    <p className="text-[9px] uppercase font-bold text-slate-500">
                      {language === "hi" ? "प्रेक्षित" : "Observed"}
                    </p>
                    <p className="mt-0.5 text-xs font-bold text-slate-900">
                      {m.observedValue} {m.unit}
                    </p>
                  </div>
                  <div className="rounded-md bg-slate-50 p-2 border border-slate-200">
                    <p className="text-[9px] uppercase font-bold text-slate-500">
                      {m.requirementSchedule
                        ? (language === "hi" ? "सांविधिक न्यूनतम" : "Statutory Min")
                        : (language === "hi" ? "घोषित" : "Declared")}
                    </p>
                    <p className="mt-0.5 text-xs font-bold text-slate-900">
                      {m.declaredValue ? `${m.declaredValue} ${m.unit}` : m.requirementSchedule || "Not available"}
                    </p>
                  </div>
                  <div className="rounded-md bg-slate-50 p-2 border border-slate-200">
                    <p className="text-[9px] uppercase font-bold text-slate-500">
                      {language === "hi" ? "विचलन" : "Deviation"}
                    </p>
                    <p
                      className={`mt-0.5 text-xs font-bold ${
                        isFail
                          ? "text-rose-700"
                          : isReview
                          ? "text-amber-700"
                          : "text-emerald-700"
                      }`}
                    >
                      {m.deviation !== undefined && m.deviation !== null
                        ? `${typeof m.deviation === "number" && m.deviation > 0 ? "+" : ""}${m.deviation} ${m.unit}`
                        : "Not available"}
                    </p>
                  </div>
                  <div className="rounded-md bg-slate-50 p-2 border border-slate-200">
                    <p className="text-[9px] uppercase font-bold text-slate-500">
                      {language === "hi" ? "सहिष्णुता दायरा" : "Tolerance Band"}
                    </p>
                    <p className="mt-0.5 text-xs font-bold text-slate-700">
                      {m.toleranceMin !== undefined && m.toleranceMax !== undefined
                        ? `${m.toleranceMin}–${m.toleranceMax} ${m.unit}`
                        : m.requirementSchedule || (language === "hi" ? "स्वीकार्य" : "Permissible")}
                    </p>
                  </div>
                </div>

                {/* Explanatory Conclusion */}
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px]">
                  {isPass ? (
                    <>
                      <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                      <span className="text-emerald-800 font-medium">
                        {language === "hi"
                          ? "अवलोकन सांविधिक अनुसूची एवं कॉन्फ़िगर की गई सहिष्णुता का अनुपालन करता है।"
                          : "Observation complies with statutory schedule and configured tolerances."}
                      </span>
                    </>
                  ) : isReview ? (
                    <>
                      <AlertTriangle size={13} className="text-amber-600 shrink-0" />
                      <span className="text-amber-800 font-medium">
                        {language === "hi"
                          ? "अवलोकन सीमावर्ती सेंसर अनिश्चितता क्षेत्र (k=2, 95% CI) में आता है। कैलीपर से पुनः जांच अनुशंसित है।"
                          : "Observation falls in the borderline sensor uncertainty zone (k=2, 95% CI). Caliper recheck recommended."}
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle size={13} className="text-rose-600 shrink-0" />
                      <span className="text-rose-800 font-medium">
                        {language === "hi"
                          ? "अवलोकन एलएमपीसी नियम, 2011 के तहत सांविधिक न्यूनतम विनिर्देश का उल्लंघन करता है।"
                          : "Observation breaches statutory minimum specification under LMPC Rules, 2011."}
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MeasurementCard;
