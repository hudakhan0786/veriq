import { STATUTORY_DOCS } from "./statutoryDocs";
import { STANDARD_DOCS } from "./standardDocs";
import { POLICY_DOCS } from "../policyContent";
import type { LegalDoc, LegalDocCategory } from "./legalDocTypes";

/** All footer-linked governed documents, in a single lookup registry. */
export const LEGAL_DOCS: LegalDoc[] = [...STATUTORY_DOCS, ...STANDARD_DOCS, ...POLICY_DOCS];

const DOC_INDEX: Map<string, LegalDoc> = new Map(LEGAL_DOCS.map((doc) => [doc.slug, doc]));

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return DOC_INDEX.get(slug);
}

export function docsByCategory(category: LegalDocCategory): LegalDoc[] {
  return LEGAL_DOCS.filter((doc) => doc.category === category);
}

export function docsForFooter(category: LegalDocCategory, excludeSlug?: string): LegalDoc[] {
  return LEGAL_DOCS.filter((doc) => doc.category === category && doc.slug !== excludeSlug);
}

/** Route base path per category (URLs are part of the platform's public contract). */
export function docBasePath(category: LegalDocCategory): string {
  switch (category) {
    case "statutory":
      return "/statutory";
    case "standards":
      return "/standards";
    case "policy":
    default:
      return "/policies";
  }
}

export function docUrl(doc: LegalDoc): string {
  return `${docBasePath(doc.category)}/${doc.slug}`;
}

export const CATEGORY_LABELS: Record<LegalDocCategory, { en: string; hi: string }> = {
  statutory: { en: "Statutory Enactments & Acts", hi: "सांविधिक अधिनियम एवं नियम" },
  policy: { en: "Government Policies", hi: "सरकारी नीतियां" },
  standards: { en: "Standards & Security", hi: "मानक एवं सुरक्षा" },
};
