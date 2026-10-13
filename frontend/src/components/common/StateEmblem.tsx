import React from "react";

interface StateEmblemProps {
  className?: string;
  size?: number;
  tone?: "gold" | "navy" | "white" | "monochrome";
  showMotto?: boolean;
}

/**
 * StateEmblem, Official State Emblem of India (Lion Capital of Ashoka with Satyameva Jayate)
 * Extracted and refined directly from the official National Portal of India asset (npi_logo.svg).
 * Strictly represents the sovereign 3-lion capital, abacus with Ashoka Chakra, bull, horse,
 * bell lotus base, and Devanagari "सत्यमेव जयते" inscription under the State Emblem of India Act, 2005.
 */
export const StateEmblem: React.FC<StateEmblemProps> = ({
  className = "",
  size = 44,
  tone = "white",
  showMotto = true,
}) => {
  // Select authentic high-definition State Emblem based on tone
  const getEmblemSrc = () => {
    switch (tone) {
      case "navy":
        return "/emblem_india_navy.svg";
      case "gold":
        return "/emblem_india_gold.svg";
      case "monochrome":
        return "/state_emblem_of_india.svg";
      case "white":
      default:
        return "/emblem_india_white.svg";
    }
  };

  const emblemSrc = getEmblemSrc();

  // Exact aspect ratio of official high-definition engraving: 170.585 width x 289.598 height (ratio ~ 1.698)
  const height = Math.round(size * (289.598 / 170.585));

  return (
    <div
      className={`inline-flex flex-col items-center justify-center shrink-0 select-none ${className}`}
      role="img"
      aria-label="State Emblem of India, Satyameva Jayate (Lion Capital of Ashoka)"
      title="State Emblem of India, Satyameva Jayate"
    >
      <img
        src={emblemSrc}
        alt="State Emblem of India, Satyameva Jayate"
        width={size}
        height={height}
        className="object-contain pointer-events-none"
        style={{ width: `${size}px`, height: `${height}px` }}
        loading="eager"
        decoding="sync"
      />
    </div>
  );
};
