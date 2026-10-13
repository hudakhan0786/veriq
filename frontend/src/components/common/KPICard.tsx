import React, { ReactNode, useEffect, useState } from "react";
import { Reveal } from "./motion";

interface KPICardProps {
  title: string;
  value: string | number;
  subtext?: string;
  trend?: string;
  trendPositive?: boolean;
  icon?: ReactNode;
  tone?: "normal" | "success" | "warning" | "danger";
  onClick?: () => void;
  delay?: number;
  statutoryCitation?: string;
}

const AnimatedCounter: React.FC<{ value: string | number }> = ({ value }) => {
  const [count, setCount] = useState(0);
  const isNumeric = typeof value === "number" || (typeof value === "string" && !isNaN(Number(value)));
  const numericValue = isNumeric ? Number(value) : 0;

  useEffect(() => {
    if (!isNumeric) return;

    let startTime: number | null = null;
    const duration = 600;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * numericValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [numericValue, isNumeric]);

  return <>{isNumeric ? count : value}</>;
};

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtext,
  trend,
  trendPositive,
  icon,
  tone = "normal",
  onClick,
  delay = 0,
  statutoryCitation,
}) => {
  const toneClasses = {
    normal: "bg-white border border-slate-200/90 text-slate-900 shadow-xs hover:border-blue-300 hover:shadow-sm",
    success: "bg-emerald-50/50 border border-emerald-200 text-emerald-950 shadow-xs hover:border-emerald-300 hover:shadow-sm",
    warning: "bg-amber-50/50 border border-amber-200 text-amber-950 shadow-xs hover:border-amber-300 hover:shadow-sm",
    danger: "bg-rose-50/50 border border-rose-200 text-rose-950 shadow-xs hover:border-rose-300 hover:shadow-sm",
  };

  const iconBgStyles = {
    normal: { background: "#EFF6FF" },
    success: { background: "#ECFDF5" },
    warning: { background: "#FFFBEB" },
    danger: { background: "#FFF1F2" },
  };

  const iconTextClasses = {
    normal: "text-[#1B365D] border border-blue-200 shadow-xs",
    success: "text-emerald-700 border border-emerald-200 shadow-xs",
    warning: "text-amber-700 border border-amber-200 shadow-xs",
    danger: "text-rose-700 border border-rose-200 shadow-xs",
  };

  return (
    <Reveal delay={delay}>
      <div
        onClick={onClick}
        className={`card card-lift p-4 sm:p-5 transition-all relative overflow-hidden ${toneClasses[tone]} ${
          onClick ? "cursor-pointer hover:scale-[1.01]" : ""
        }`}
      >
        {/* Subtle Sovereign Accent Top Line */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 ${
            tone === "normal"
              ? "bg-[#1B365D]"
              : tone === "success"
              ? "bg-emerald-600"
              : tone === "danger"
              ? "bg-rose-600"
              : "bg-amber-500"
          }`}
        />

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">
              {title}
            </p>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-sans tabular-nums">
                <AnimatedCounter value={value} />
              </span>
              {trend && (
                <span
                  className={`text-[11px] font-bold ${
                    trendPositive ? "text-emerald-700" : "text-amber-700"
                  }`}
                >
                  {trend}
                </span>
              )}
            </div>
            {subtext && <p className="mt-1 text-xs text-slate-600 truncate">{subtext}</p>}
          </div>
          {icon && (
            <div
              className={`p-2.5 rounded-xl shrink-0 ${iconTextClasses[tone]}`}
              style={iconBgStyles[tone]}
            >
              {icon}
            </div>
          )}
        </div>

        {statutoryCitation && (
          <div className="mt-3 pt-2 border-t border-slate-200/70 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span className="truncate font-semibold tracking-tight">{statutoryCitation}</span>
          </div>
        )}
      </div>
    </Reveal>
  );
};

export default KPICard;
