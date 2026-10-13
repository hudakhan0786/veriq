import React from "react";

interface SovereignMetrologyHeroBackdropProps {
  className?: string;
  showChakra?: boolean;
}

/**
 * SovereignMetrologyHeroBackdrop
 * Contextual, authentic Government of India administrative backdrop for Veriq.
 * Grounded in the Department of Consumer Affairs & Legal Metrology Division:
 * - Ambient Rotating Ashoka Dharma Chakra (24 statutory spokes, precision metrology ticks)
 * - Official Upright Directorate Seal of Legal Metrology (Lion Capital & Tula Heraldry)
 * - Warm Amber Dusk Horizon Radial Glow
 * - Central Secretariat / Raisina Administrative Colonnade architecture
 */
export const SovereignMetrologyHeroBackdrop: React.FC<SovereignMetrologyHeroBackdropProps> = ({
  className = "",
  showChakra = true,
}) => {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {/* 1. Deep Sovereign Navy Foundation Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#061220] via-[#0A2240] to-[#0F2D54]" />

      {/* 2. Warm Amber Dusk Horizon Glow (Authoritative National Portal Ambient Lighting) */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(212, 175, 55, 0.28) 0%, rgba(27, 54, 93, 0.12) 50%, transparent 80%)",
        }}
      />

      {/* 3. Subtle Sovereign Security Guilloche / Metrology Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* 4. Grand Central Sovereign Watermark: Animated Sacred Chakra + Upright Directorate Seal */}
      {showChakra && (
        <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
          {/* Ambient Golden Radial Halo */}
          <div className="absolute w-[300px] h-[300px] sm:w-[460px] sm:h-[460px] lg:w-[600px] lg:h-[600px] rounded-full bg-[radial-gradient(circle,_rgba(245,158,11,0.22)_0%,_rgba(59,130,246,0.08)_45%,_transparent_72%)] blur-2xl pointer-events-none" />

          {/* Rotating 24-Spoke Sovereign Ashoka Chakra (Dharma Chakra Geometry) */}
          <svg
            className="w-[280px] h-[280px] sm:w-[430px] sm:h-[430px] lg:w-[560px] lg:h-[560px] animate-[spin_100s_linear_infinite] motion-reduce:animate-none opacity-18 sm:opacity-22 lg:opacity-25"
            viewBox="0 0 500 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="chakraGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE68A" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#996515" />
              </linearGradient>
              <linearGradient id="chakraCyanGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Outer Precision Metrology Calibration Ring with 48 Graduation Ticks */}
            <circle cx="250" cy="250" r="236" stroke="#D4AF37" strokeWidth="1" strokeDasharray="3 8" opacity="0.6" />
            <circle cx="250" cy="250" r="226" stroke="url(#chakraGoldGrad)" strokeWidth="2.5" />
            <circle cx="250" cy="250" r="214" stroke="url(#chakraCyanGrad)" strokeWidth="1" />
            <circle cx="250" cy="250" r="202" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.7" />

            {/* Inner Hub Rim */}
            <circle cx="250" cy="250" r="102" stroke="url(#chakraGoldGrad)" strokeWidth="2" />
            <circle cx="250" cy="250" r="92" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

            {/* 24 Statutory Spokes of the Ashoka Dharma Chakra */}
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * 360) / 24;
              const rad = (angle * Math.PI) / 180;
              const cos = Math.cos(rad);
              const sin = Math.sin(rad);

              const xInner = 250 + 102 * cos;
              const yInner = 250 + 102 * sin;
              const xOuter = 250 + 202 * cos;
              const yOuter = 250 + 202 * sin;

              // Decorative teardrop / arrowhead accent near outer rim
              const xTip = 250 + 214 * cos;
              const yTip = 250 + 214 * sin;

              return (
                <g key={`spoke-${i}`}>
                  <line
                    x1={xInner}
                    y1={yInner}
                    x2={xOuter}
                    y2={yOuter}
                    stroke="#FDE68A"
                    strokeWidth="1.8"
                    strokeOpacity="0.85"
                  />
                  {/* Subtle Spoke Terminal Point */}
                  <circle cx={xTip} cy={yTip} r="2.5" fill="#FDE68A" opacity="0.8" />
                </g>
              );
            })}
          </svg>

          {/* Upright Official Directorate Seal & State Heraldry (Static, Dignified, Upright) */}
          <div className="absolute w-[115px] h-[115px] sm:w-[165px] sm:h-[165px] lg:w-[210px] lg:h-[210px] opacity-20 sm:opacity-24 lg:opacity-28 pointer-events-none transition-transform">
            <img
              src="/assets/gov/doca_legal_metrology_seal.svg"
              alt="Official Seal of Legal Metrology Division, Government of India"
              className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]"
            />
          </div>
        </div>
      )}

      {/* 5. Scalable Sovereign Architectural Skyline Silhouette (Grounded at Bottom Edge) */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full h-32 sm:h-36 opacity-20 pointer-events-none"
        viewBox="0 0 1440 144"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="govSkylineGrad" x1="720" y1="0" x2="720" y2="144" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
            <stop offset="40%" stopColor="#1E3A5F" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#061220" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* Central Secretariat / Raisina Classical Architectural Skyline Silhouette */}
        <g fill="url(#govSkylineGrad)">
          {/* Base stepped foundation */}
          <rect x="0" y="128" width="1440" height="16" />
          <rect x="120" y="120" width="1200" height="8" />

          {/* Central Dome & Classical Portico */}
          <path d="M 680,120 L 680,72 Q 720,40 760,72 L 760,120 Z" />
          <rect x="670" y="68" width="100" height="6" rx="1" />
          {/* Kalash / Finial on Central Dome */}
          <line x1="720" y1="40" x2="720" y2="28" stroke="#D4AF37" strokeWidth="2" />
          <circle cx="720" cy="26" r="2.5" fill="#D4AF37" />

          {/* Symmetrical Left Wing Colonnades */}
          <rect x="420" y="86" width="220" height="34" rx="1" />
          <rect x="410" y="82" width="240" height="4" rx="1" />
          <rect x="220" y="96" width="170" height="24" rx="1" />
          <rect x="210" y="92" width="190" height="4" rx="1" />

          {/* Symmetrical Right Wing Colonnades */}
          <rect x="800" y="86" width="220" height="34" rx="1" />
          <rect x="790" y="82" width="240" height="4" rx="1" />
          <rect x="1050" y="96" width="170" height="24" rx="1" />
          <rect x="1040" y="92" width="190" height="4" rx="1" />
        </g>

        {/* Delicate Golden Horizon Line */}
        <line x1="0" y1="128" x2="1440" y2="128" stroke="#D4AF37" strokeWidth="1" strokeOpacity="0.3" />
      </svg>

      {/* 6. Bottom Gradient Transition to Content */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#061220] to-transparent" />
    </div>
  );
};
