import React, { useState, useEffect } from "react";
import { ApiService } from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";

export type ConnectivityMode = "ONLINE" | "LOCAL_RESILIENT" | "DISRUPTED";

interface ConnectivityBadgeProps {
  mode?: ConnectivityMode;
  onRefresh?: () => void;
}

export const ConnectivityBadge: React.FC<ConnectivityBadgeProps> = ({
  mode: propMode,
  onRefresh,
}) => {
  const { language } = useLanguage();
  const [currentMode, setCurrentMode] = useState<ConnectivityMode>(propMode || "ONLINE");
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (propMode) {
      setCurrentMode(propMode);
    }
  }, [propMode]);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const health = await ApiService.getSystemHealth();
      if (health.status === "LOCAL_RESILIENT_MODE" || ApiService.isMockMode()) {
        setCurrentMode("LOCAL_RESILIENT");
      } else {
        setCurrentMode("ONLINE");
      }
    } catch {
      setCurrentMode("DISRUPTED");
    } finally {
      setIsChecking(false);
      if (onRefresh) onRefresh();
    }
  };

  const getStatusDisplay = () => {
    switch (currentMode) {
      case "ONLINE":
        return {
          dotColor: "bg-emerald-400",
          textColor: "text-emerald-300",
          borderColor: "border-emerald-500/40",
          bgColor: "bg-emerald-950/40",
          label: language === "hi" ? "ऑनलाइन (मोड ए)" : "ONLINE (MODE A)",
          tooltip:
            language === "hi"
              ? "केंद्रीय क्लाउड मोनोलिथ से कनेक्टेड"
              : "Connected to Central Cloud Monolith",
        };
      case "LOCAL_RESILIENT":
        return {
          dotColor: "bg-amber-400",
          textColor: "text-amber-200",
          borderColor: "border-amber-500/40",
          bgColor: "bg-amber-950/40",
          label: language === "hi" ? "स्थानीय लचीला (मोड बी)" : "LOCAL RESILIENT (MODE B)",
          tooltip:
            language === "hi"
              ? "फील्ड स्टैंडअलोन रेजिलिएंट मोड (स्थानीय भंडारण सक्रिय)"
              : "Operating in Field Standalone Resilient Mode (Local Storage Active)",
        };
      case "DISRUPTED":
      default:
        return {
          dotColor: "bg-rose-400",
          textColor: "text-rose-200",
          borderColor: "border-rose-500/40",
          bgColor: "bg-rose-950/40",
          label: language === "hi" ? "बाधित (डिस्कनेक्टेड)" : "DISRUPTED",
          tooltip:
            language === "hi"
              ? "केंद्रीय कनेक्शन बाधित। स्थानीय कैश पर स्वचालित फ़ालबैक।"
              : "Central connection disrupted. Automatic fallback to local cache.",
        };
    }
  };

  const status = getStatusDisplay();

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono border ${status.borderColor} ${status.bgColor} ${status.textColor} transition-colors`}
      title={status.tooltip}
    >
      <span
        className={`h-2 w-2 rounded-full ${status.dotColor} ${isChecking ? "animate-ping" : ""}`}
      />
      <span className="font-semibold tracking-wide">{status.label}</span>
      <button
        type="button"
        onClick={checkConnection}
        disabled={isChecking}
        className="ml-1 opacity-70 hover:opacity-100 focus:outline-none"
        title={language === "hi" ? "कनेक्टिविटी जांचें" : "Check Connectivity"}
      >
        <svg
          className={`h-3 w-3 ${isChecking ? "animate-spin" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
    </div>
  );
};
