import React from "react";

interface NirikshakLogoEmblemProps {
  className?: string;
  size?: "sm" | "md" | "lg" | number;
  tone?: "light" | "dark";
}

/**
 * NirikshakLogoEmblem, Official Metrology Balance & Inspection Lens Emblem
 * Features:
 * - Technical reticle brackets and high-contrast calibration ticks
 * - Triple concentric reticle circles (Vibrant Gold & Cyan)
 * - Dual metrology weighing pans with crisp suspension lines and jeweled pivot points
 * - Central Inspection Eye lens with pure white contour, gold iris, crosshair reticle, and glowing saffron core
 *
 * Stroke weights, contrast, and color luminescence have been heavily amplified
 * so the emblem stands out with commanding presence and razor-sharp clarity
 * complementing the Veriq wordmark at all navbar sizes.
 */
export const NirikshakLogoEmblem: React.FC<NirikshakLogoEmblemProps> = ({
  className = "",
  size = "md",
  tone = "light",
}) => {
  // Proportional sizing calibrated to complement the brand name
  const heightClass =
    typeof size === "number"
      ? ""
      : size === "sm"
      ? "h-[28px] sm:h-[32px]"
      : size === "lg"
      ? "h-[46px] sm:h-[54px]"
      : "h-[36px] sm:h-[42px]";

  const inlineStyle =
    typeof size === "number"
      ? { height: `${size}px`, width: `${Math.round(size * 1.414)}px` }
      : undefined;

  const isLight = tone === "light"; // on dark navy bg

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 select-none ${className}`}
      role="img"
      aria-label="Veriq Metrology & Inspection Emblem"
      title="Veriq, Metrology Inspection Workstation"
      style={inlineStyle}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-140 -99 280 198"
        fill="none"
        className={`${heightClass} w-auto object-contain transition-transform duration-200 group-hover:scale-105 pointer-events-none drop-shadow-[0_2px_8px_rgba(56,189,248,0.20)]`}
      >
        <defs>
          {/* Pupil Core Saffron Glow */}
          <filter id="nleCoreGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* High-Luminance Gold Gradient for Reticles & Iris */}
          <linearGradient id="nleGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="45%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Electric Cyan Gradient for Reticle & Balance Beams */}
          <linearGradient id="nleCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>

          {/* Weighing Pan Surface Fill Gradient */}
          <linearGradient id="nlePan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.80" />
          </linearGradient>
        </defs>

        {/* Backdrop Plate: subtle circular contrast enhancer */}
        <circle cx="0" cy="0" r="95" fill="#071830" fillOpacity="0.60" />

        {/* Tech Guides: Calibration Brackets */}
        <path
          d="M -115 -48 L -135 -48 L -135 48 L -115 48"
          stroke="#38BDF8"
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 115 -48 L 135 -48 L 135 48 L 115 48"
          stroke="#38BDF8"
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Center Alignment Saffron Ticks */}
        <line x1="-135" y1="0" x2="-121" y2="0" stroke="#FF9933" strokeWidth="5.5" strokeLinecap="round" />
        <line x1="135" y1="0" x2="121" y2="0" stroke="#FF9933" strokeWidth="5.5" strokeLinecap="round" />

        {/* Reticle Circles */}
        {/* Outer Dashed Precision Ring */}
        <circle cx="0" cy="0" r="95" stroke="url(#nleGold)" strokeWidth="3.2" strokeDasharray="8 6" opacity="0.9" />
        {/* Middle Electric Cyan Ring */}
        <circle cx="0" cy="0" r="84" stroke="url(#nleCyan)" strokeWidth="4.5" />
        {/* Inner Solid Gold Guide */}
        <circle cx="0" cy="0" r="74" stroke="url(#nleGold)" strokeWidth="2.8" opacity="0.85" />

        {/* Horizontal Balance Beams */}
        <line x1="-95" y1="0" x2="-58" y2="0" stroke="#38BDF8" strokeWidth="6" strokeLinecap="round" />
        <line x1="58" y1="0" x2="95" y2="0" stroke="#38BDF8" strokeWidth="6" strokeLinecap="round" />

        {/* Left Balance Arm & Weighing Pan */}
        <g transform="translate(-95, 0)">
          <line x1="0" y1="0" x2="-26" y2="42" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="0" y1="0" x2="26" y2="42" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M -34 42 Q 0 66 34 42 Z" fill="url(#nlePan)" stroke="#FFFFFF" strokeWidth="4.5" strokeLinejoin="round" />
          <circle cx="0" cy="44" r="4.2" fill="#FF9933" stroke="#FFFFFF" strokeWidth="1.5" />
        </g>

        {/* Right Balance Arm & Weighing Pan */}
        <g transform="translate(95, 0)">
          <line x1="0" y1="0" x2="-26" y2="42" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="0" y1="0" x2="26" y2="42" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M -34 42 Q 0 66 34 42 Z" fill="url(#nlePan)" stroke="#FFFFFF" strokeWidth="4.5" strokeLinejoin="round" />
          <circle cx="0" cy="44" r="4.2" fill="#FF9933" stroke="#FFFFFF" strokeWidth="1.5" />
        </g>

        {/* Central Inspection Lens / Eye */}
        {/* Outer Pure White Rim Contour */}
        <path
          d="M -60 0 C -34 -36 34 -36 60 0 C 34 36 -34 36 -60 0 Z"
          fill="#071326"
          stroke={isLight ? "#FFFFFF" : "#0F172A"}
          strokeWidth="6"
          strokeLinejoin="round"
        />
        {/* Inner Gold Precision Contour */}
        <path
          d="M -52 0 C -28 -28 28 -28 52 0 C 28 28 -28 28 -52 0 Z"
          stroke="url(#nleGold)"
          strokeWidth="3.6"
          fill="none"
        />

        {/* Sapphire Iris with Gold Border */}
        <circle cx="0" cy="0" r="26" fill="#0B213D" stroke="url(#nleGold)" strokeWidth="4.2" />
        {/* High-Contrast Crosshair Reticle Lines */}
        <g stroke="#FBBF24" strokeWidth="2.8" strokeLinecap="round">
          <line x1="0" y1="-26" x2="0" y2="26" />
          <line x1="-26" y1="0" x2="26" y2="0" />
          <line x1="-18" y1="-18" x2="18" y2="18" />
          <line x1="-18" y1="18" x2="18" y2="-18" />
        </g>

        {/* Deep Pupil Core & Saffron Glowing Focal Point */}
        <circle cx="0" cy="0" r="11" fill="#020617" />
        <circle cx="0" cy="0" r="5.5" fill="#FF9933" filter="url(#nleCoreGlow)" />
        {/* Crisp White Specular Catchlights */}
        <circle cx="-3.5" cy="-3.5" r="2.8" fill="#FFFFFF" />
        <circle cx="3.5" cy="3.5" r="1.5" fill="#FFFFFF" opacity="0.95" />
      </svg>
    </div>
  );
};
