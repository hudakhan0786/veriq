/**
 * Unified content model for Veriq's GIGW 3.0 legal / policy / standards
 * document pages. Every footer-linked document (statutory enactment, mandatory
 * portal policy, security standard) is authored once in this shape and rendered
 * by the shared dark-slate StatutoryDocumentPage template.
 *
 * Content rule (AGENTS.md, Zero Assumption Policy): every statutory citation,
 * Gazette number, date and penalty amount below was verified against official
 * sources (India Code, e-Gazette, DoCA, PIB) or the repository's frozen
 * specifications before being written. See docs/research/PHASE_1 domain dossier
 * for the repository's own vetted rule mappings.
 */

export type LegalDocCategory = "statutory" | "policy" | "standards";

/** One renderable content block inside a document section. */
export type LegalBlock =
  | { kind: "p"; en: string; hi: string }
  | { kind: "list"; itemsEn: string[]; itemsHi: string[] }
  | {
      kind: "table";
      headersEn: string[];
      headersHi: string[];
      rowsEn: string[][];
      rowsHi: string[][];
    }
  /** Highlighted statutory note (e.g. human-in-the-loop mandate, evidentiary caveat). */
  | { kind: "note"; tone: "statutory" | "info" | "warning"; en: string; hi: string }
  /** Verbatim monospace block (hash samples, declaration formats), language-neutral. */
  | { kind: "code"; text: string; captionEn?: string; captionHi?: string };

export interface LegalSection {
  /** Stable anchor id used by the TOC, breadcrumbs and IntersectionObserver scroll-spy. */
  id: string;
  headingEn: string;
  headingHi: string;
  blocks: LegalBlock[];
}

/** A metadata badge row for the statutory header (Gazette No., Enactment Date, …). */
export interface LegalDocMeta {
  labelEn: string;
  labelHi: string;
  valueEn: string;
  valueHi: string;
}

export interface LegalDoc {
  slug: string;
  category: LegalDocCategory;
  titleEn: string;
  titleHi: string;
  /** Short label used in footer columns, chips and cross-links. */
  shortEn: string;
  shortHi: string;
  ledeEn: string;
  ledeHi: string;
  /** Link to the authoritative government source (e-Gazette, India Code, DoCA…). */
  sourceUrl: string;
  sourceLabelEn: string;
  sourceLabelHi: string;
  meta: LegalDocMeta[];
  /** Slugs of related documents rendered as cross-navigation chips. */
  related: string[];
  sections: LegalSection[];
}
