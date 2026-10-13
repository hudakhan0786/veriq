/**
 * Traceability & Forensic Linking Utilities for Adjudication Canvas
 * 
 * Provides deterministic bidirectional mapping between:
 * RuleFinding <---> ExtractedField <---> OCRToken <---> Package Image Polygon
 * 
 * Strict boundary: No legal logic or metric math performed here.
 * Only coordinate normalization and relational foreign key traversal.
 */

import {
  RuleFinding,
  ExtractedField,
  OCRToken,
} from "../../types/inspection";

/**
 * Finds the corresponding ExtractedField for a given RuleFinding.
 * Matches by field_type or matching bounding box coordinates.
 */
export function findFieldForFinding(
  finding: RuleFinding,
  fields: ExtractedField[]
): ExtractedField | undefined {
  if (finding.field_type) {
    const directMatch = fields.find((f) => f.field_type === finding.field_type);
    if (directMatch) return directMatch;
  }

  // Fallback: match by bounding box overlap if coordinates exist
  if (finding.evidence_box) {
    const [fyMin, fxMin, fyMax, fxMax] = finding.evidence_box;
    return fields.find((f) => {
      const [byMin, bxMin, byMax, bxMax] = f.bounding_box;
      return (
        Math.abs(fyMin - byMin) < 30 &&
        Math.abs(fxMin - bxMin) < 30 &&
        Math.abs(fyMax - byMax) < 30 &&
        Math.abs(fxMax - bxMax) < 30
      );
    });
  }

  return undefined;
}

/**
 * Finds all OCRTokens linked to an ExtractedField via its token_ids array.
 */
export function findTokensForField(
  field: ExtractedField,
  tokens: OCRToken[]
): OCRToken[] {
  if (!field.token_ids || field.token_ids.length === 0) {
    // Fallback: match by bounding box overlap
    const [fyMin, fxMin, fyMax, fxMax] = field.bounding_box;
    return tokens.filter((t) => {
      const [tyMin, txMin, tyMax, txMax] = t.bounding_box;
      return (
        Math.abs(fyMin - tyMin) < 40 &&
        Math.abs(fxMin - txMin) < 40 &&
        Math.abs(fyMax - tyMax) < 40 &&
        Math.abs(fxMax - txMax) < 40
      );
    });
  }

  return tokens.filter((t) => field.token_ids?.includes(t.token_id));
}

/**
 * Finds all OCRTokens for a given RuleFinding via its linked ExtractedField.
 */
export function findTokensForFinding(
  finding: RuleFinding,
  fields: ExtractedField[],
  tokens: OCRToken[]
): OCRToken[] {
  const field = findFieldForFinding(finding, fields);
  if (field) {
    return findTokensForField(field, tokens);
  }

  // Direct box fallback if no field linked
  if (finding.evidence_box) {
    const [fyMin, fxMin, fyMax, fxMax] = finding.evidence_box;
    return tokens.filter((t) => {
      const [tyMin, txMin, tyMax, txMax] = t.bounding_box;
      return (
        Math.abs(fyMin - tyMin) < 40 &&
        Math.abs(fxMin - txMin) < 40 &&
        Math.abs(fyMax - tyMax) < 40 &&
        Math.abs(fxMax - txMax) < 40
      );
    });
  }

  return [];
}

/**
 * Given an OCRToken, finds the parent ExtractedField that references it.
 */
export function findFieldForToken(
  token: OCRToken,
  fields: ExtractedField[]
): ExtractedField | undefined {
  return fields.find((f) => f.token_ids?.includes(token.token_id));
}

/**
 * Given an OCRToken, finds the corresponding RuleFindings.
 */
export function findFindingsForToken(
  token: OCRToken,
  fields: ExtractedField[],
  findings: RuleFinding[]
): RuleFinding[] {
  const field = findFieldForToken(token, fields);
  if (field && field.field_type) {
    return findings.filter((f) => f.field_type === field.field_type);
  }

  // Fallback: match by bounding box overlap
  const [tyMin, txMin, tyMax, txMax] = token.bounding_box;
  return findings.filter((f) => {
    if (!f.evidence_box) return false;
    const [fyMin, fxMin, fyMax, fxMax] = f.evidence_box;
    return (
      Math.abs(fyMin - tyMin) < 40 &&
      Math.abs(fxMin - txMin) < 40 &&
      Math.abs(fyMax - tyMax) < 40 &&
      Math.abs(fxMax - txMax) < 40
    );
  });
}

/**
 * Formats a 4-point polygon into an SVG points string.
 * Example: [[200, 350], [550, 350], [550, 410], [200, 410]] -> "200,350 550,350 550,410 200,410"
 */
export function polygonToSvgPoints(polygon: [number, number][]): string {
  if (!polygon || polygon.length < 3) return "";
  return polygon.map(([x, y]) => `${x},${y}`).join(" ");
}

/**
 * Derives center coordinate for centering or loupe positioning.
 */
export function polygonCenter(polygon: [number, number][]): { x: number; y: number } {
  if (!polygon || polygon.length === 0) return { x: 0, y: 0 };
  const sum = polygon.reduce(
    (acc, [x, y]) => ({ x: acc.x + x, y: acc.y + y }),
    { x: 0, y: 0 }
  );
  return {
    x: Math.round(sum.x / polygon.length),
    y: Math.round(sum.y / polygon.length),
  };
}

/**
 * Color and styling tokens matching the 4-state epistemic model.
 */
export function getStatusStyle(status?: string): {
  stroke: string;
  fill: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
} {
  switch (status) {
    case "FAIL":
      return {
        stroke: "#DC2626", // rose-600
        fill: "rgba(220, 38, 38, 0.18)",
        badgeBg: "bg-rose-100",
        badgeText: "text-rose-800",
        badgeBorder: "border-rose-300",
      };
    case "REVIEW":
      return {
        stroke: "#D97706", // amber-600
        fill: "rgba(217, 119, 6, 0.20)",
        badgeBg: "bg-amber-100",
        badgeText: "text-amber-800",
        badgeBorder: "border-amber-300",
      };
    case "UNABLE_TO_VERIFY":
      return {
        stroke: "#64748B", // slate-500
        fill: "rgba(100, 116, 139, 0.25)",
        badgeBg: "bg-slate-200",
        badgeText: "text-slate-800",
        badgeBorder: "border-slate-400",
      };
    case "PASS":
      return {
        stroke: "#059669", // emerald-600
        fill: "rgba(5, 150, 105, 0.15)",
        badgeBg: "bg-emerald-100",
        badgeText: "text-emerald-800",
        badgeBorder: "border-emerald-300",
      };
    default:
      return {
        stroke: "#3B82F6", // blue-500 default token
        fill: "rgba(59, 130, 246, 0.10)",
        badgeBg: "bg-blue-50",
        badgeText: "text-blue-800",
        badgeBorder: "border-blue-200",
      };
  }
}
