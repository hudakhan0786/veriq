import React from "react";
import { Link } from "react-router-dom";
import { Scale } from "lucide-react";
import { resetScrollToTop } from "./ScrollToTop";

interface VeriqBrandLogoProps {
  className?: string;
  tone?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
  onClick?: () => void;
}

export const VeriqBrandLogo: React.FC<VeriqBrandLogoProps> = ({
  className = "",
  tone = "dark",
  size = "md",
  showSubtitle = true,
  onClick,
}) => {
  const sizeClasses = {
    sm: "h-8 w-8 text-base",
    md: "h-9 w-9 text-lg",
    lg: "h-11 w-11 text-xl",
  };

  return (
    <Link
      to="/"
      onClick={onClick || resetScrollToTop}
      className={`veriq-brand inline-flex items-center gap-2.5 ${tone === "light" ? "veriq-brand-light" : ""} ${className}`}
      aria-label="Veriq home"
    >
      <span className={`veriq-brand-mark ${sizeClasses[size]}`} aria-hidden="true">
        <Scale size={size === "sm" ? 17 : size === "lg" ? 23 : 20} strokeWidth={1.8} />
      </span>
      <span className="flex min-w-0 flex-col justify-center">
        <span className="veriq-wordmark">Veriq</span>
        {showSubtitle && <span className="veriq-brand-subtitle">Inspection record</span>}
      </span>
    </Link>
  );
};
