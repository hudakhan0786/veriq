import React from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export interface PipelineStepItem {
  id: string;
  label: string;
  description?: string;
  status: "completed" | "active" | "pending" | "failed";
}

interface PipelineStepperProps {
  steps?: PipelineStepItem[];
  activeStepIndex?: number;
  className?: string;
}

const DEFAULT_STEPS: PipelineStepItem[] = [
  { id: "1", label: "Evidence Capture", description: "Package photograph & fiducial marker", status: "completed" },
  { id: "2", label: "Multilingual OCR", description: "DBNet++ & PP-OCRv4 extraction", status: "completed" },
  { id: "3", label: "Metric Calibration", description: "Optical scale & PDP area calculation", status: "completed" },
  { id: "4", label: "Rule Evaluation", description: "Table-I font schedule & Rule 6 checks", status: "completed" },
  { id: "5", label: "Officer Adjudication", description: "Human sign-off & Form-1 notice", status: "active" },
];

const STEP_LABELS_HI: Record<string, { label: string; description?: string }> = {
  "Evidence Capture": { label: "साक्ष्य संकलन", description: "पैकेज छायाचित्र एवं फिड्यूशियल मार्कर" },
  "Multilingual OCR": { label: "बहुभाषी ओसीआर", description: "DBNet++ एवं PP-OCRv4 निष्कर्षण" },
  "Metric Calibration": { label: "मीट्रिक अंशांकन", description: "ऑप्टिकल पैमाना एवं पीडीपी क्षेत्रफल गणना" },
  "Rule Evaluation": { label: "नियम मूल्यांकन", description: "तालिका-I फ़ॉन्ट अनुसूची एवं नियम 6 परीक्षण" },
  "Officer Adjudication": { label: "अधिकारी अधिनिर्णय", description: "मानवीय हस्ताक्षर एवं प्रपत्र-1 नोटिस" },
};

export const PipelineStepper: React.FC<PipelineStepperProps> = ({
  steps = DEFAULT_STEPS,
  className = "",
}) => {
  const { language } = useLanguage();

  return (
    <div className={`overflow-x-auto rounded-xl border border-slate-200 bg-white p-4 shadow-xs ${className}`}>
      <div className="flex min-w-[760px] items-center justify-between">
        {steps.map((step, idx) => {
          const isCompleted = step.status === "completed";
          const isActive = step.status === "active";
          const isFailed = step.status === "failed";

          const localized = language === "hi" ? STEP_LABELS_HI[step.label] : null;
          const displayLabel = localized ? localized.label : step.label;
          const displayDescription = localized && localized.description ? localized.description : step.description;

          return (
            <React.Fragment key={step.id || idx}>
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black transition-all ${
                    isCompleted
                      ? "bg-emerald-600 text-white shadow-xs"
                      : isActive
                      ? "bg-[#1B365D] text-white ring-4 ring-blue-100 shadow-xs"
                      : isFailed
                      ? "bg-rose-600 text-white"
                      : "bg-slate-100 text-slate-500 border border-slate-300"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={16} /> : idx + 1}
                </div>
                <div>
                  <p
                    className={`text-sm leading-tight ${
                      isActive ? "text-[#1B365D] font-extrabold" : isCompleted ? "text-slate-800 font-bold" : "text-slate-500 font-medium"
                    }`}
                  >
                    {displayLabel}
                  </p>
                  {displayDescription && (
                    <p className="text-xs text-slate-500 hidden sm:block truncate max-w-[160px]">
                      {displayDescription}
                    </p>
                  )}
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={`mx-2 h-0.5 flex-1 transition-colors ${
                    isCompleted ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineStepper;
