import React from "react";
import { CheckCircle2 } from "lucide-react";

export interface PipelineStep {
  id: string;
  label: string;
  description: string;
  status: "completed" | "active" | "pending";
}

interface PipelineStepperProps {
  steps: PipelineStep[];
}

export const PipelineStepper: React.FC<PipelineStepperProps> = ({ steps }) => {
  return (
    <div className="card p-3 sm:p-4 bg-slate-900/70 overflow-x-auto">
      <div className="flex min-w-[720px] items-center justify-between">
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;
          const isDone = step.status === "completed";
          const isActive = step.status === "active";

          return (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black transition-all ${
                    isDone
                      ? "bg-emerald-600 text-white shadow-xs"
                      : isActive
                      ? "bg-govNavy text-white ring-4 ring-govNavy/20 animate-pulse"
                      : "bg-slate-800/80 text-slate-400 border border-slate-600"
                  }`}
                >
                  {isDone ? <CheckCircle2 size={16} /> : idx + 1}
                </div>
                <div>
                  <p
                    className={`text-xs font-bold leading-tight ${
                      isDone
                        ? "text-emerald-300"
                        : isActive
                        ? "text-govNavy"
                        : "text-slate-500"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[10px] text-slate-400 leading-tight truncate max-w-[130px]">
                    {step.description}
                  </p>
                </div>
              </div>

              {!isLast && (
                <div
                  className={`mx-2 h-0.5 flex-1 transition-colors ${
                    isDone ? "bg-emerald-400" : "bg-slate-700"
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
