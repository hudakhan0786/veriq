import React from "react";

interface IndianNationalFlagProps {
  className?: string;
  width?: number;
  height?: number;
  title?: string;
}

/**
 * Official National Flag of India (Tiranga / तिरंगा)
 * Conforms to Flag Code of India:
 * - 3:2 Standard Aspect Ratio
 * - Top Band: India Saffron (Kesari) #FF671F
 * - Middle Band: White #FFFFFF
 * - Bottom Band: India Green #046A38
 * - Center: Navy Blue #000080 Ashoka Chakra with exactly 24 equidistant spokes (15° spacing)
 */
export const IndianNationalFlag: React.FC<IndianNationalFlagProps> = ({
  className = "",
  width = 24,
  height = 16,
  title = "National Flag of India (Tiranga / तिरंगा)",
}) => {
  // Center of the flag in viewBox 0 0 90 60
  const cx = 45;
  const cy = 30;
  const outerRadius = 8.8;
  const innerRadius = 1.8;

  // Generate 24 spokes at 15-degree intervals (360 / 24 = 15)
  const spokes = Array.from({ length: 24 }, (_, i) => {
    const angleRad = (i * 15 * Math.PI) / 180;
    const x2 = cx + outerRadius * Math.cos(angleRad);
    const y2 = cy + outerRadius * Math.sin(angleRad);
    return {
      id: i,
      x1: cx,
      y1: cy,
      x2: Number(x2.toFixed(3)),
      y2: Number(y2.toFixed(3)),
    };
  });

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 90 60"
      className={`shrink-0 rounded-2xs shadow-2xs border border-white/20 select-none ${className}`}
      aria-label={title}
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>

      {/* Top Band: India Saffron (Kesari) */}
      <rect x="0" y="0" width="90" height="20" fill="#FF671F" />

      {/* Middle Band: White */}
      <rect x="0" y="20" width="90" height="20" fill="#FFFFFF" />

      {/* Bottom Band: India Green */}
      <rect x="0" y="40" width="90" height="20" fill="#046A38" />

      {/* Ashoka Chakra: Navy Blue */}
      <g id="ashoka-chakra">
        {/* Outer Ring */}
        <circle
          cx={cx}
          cy={cy}
          r={outerRadius}
          fill="none"
          stroke="#000080"
          strokeWidth="1.1"
        />

        {/* Central Hub */}
        <circle cx={cx} cy={cy} r={innerRadius} fill="#000080" />

        {/* 24 Spokes */}
        {spokes.map((spoke) => (
          <line
            key={spoke.id}
            x1={spoke.x1}
            y1={spoke.y1}
            x2={spoke.x2}
            y2={spoke.y2}
            stroke="#000080"
            strokeWidth="0.65"
            strokeLinecap="round"
          />
        ))}

        {/* Small decorative rim points */}
        <circle
          cx={cx}
          cy={cy}
          r={outerRadius - 0.5}
          fill="none"
          stroke="#000080"
          strokeWidth="0.3"
          strokeDasharray="0.6 1.7"
        />
      </g>
    </svg>
  );
};
