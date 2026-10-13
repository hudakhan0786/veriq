import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  BadgeCheck,
  ChevronRight,
  ExternalLink,
  FileText,
  Landmark,
  ListTree,
  Printer,
  Search,
  SearchX,
} from "lucide-react";
import { GovTopBar } from "../../components/layout/GovTopBar";
import { GovFooter } from "../../components/layout/GovFooter";
import { VeriqBrandLogo } from "../../components/common/VeriqBrandLogo";
import { useLanguage } from "../../context/LanguageContext";
import { resetScrollToTop } from "../../components/common/ScrollToTop";
import type { LegalBlock, LegalDoc, LegalSection } from "./legalDocTypes";
import { CATEGORY_LABELS, docUrl, docsForFooter, getLegalDoc } from "./legalDocRegistry";

/**
 * Unified dark-slate document template for every governed page reachable from
 * the footer: statutory enactments, mandatory portal policies and security
 * standards. GIGW 3.0 features: breadcrumb trail, sticky scroll-spied table of
 * contents, instant in-document text search with match highlighting, statutory
 * metadata badges, bilingual toggle via the masthead, keyboard operability and
 * a print-parity stylesheet.
 */

const DESIGN_TOKENS = {
  pageBg: "#0b1320",
  surface: "#132238",
  gold: "#e5a93c",
  cyan: "#38bdf8",
} as const;

/** Case-insensitive match highlighting inside document text. */
const Highlight: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  const trimmed = query.trim();
  if (!trimmed) return <>{text}</>;
  const lower = text.toLowerCase();
  const q = trimmed.toLowerCase();
  const parts: React.ReactNode[] = [];
  let from = 0;
  let key = 0;
  let idx = lower.indexOf(q);
  while (idx !== -1) {
    if (idx > from) parts.push(text.slice(from, idx));
    parts.push(
      <mark
        key={key++}
        className="rounded-sm bg-[#e5a93c]/25 px-0.5 font-semibold text-[#f5d78e]"
      >
        {text.slice(idx, idx + q.length)}
      </mark>,
    );
    from = idx + q.length;
    idx = lower.indexOf(q, from);
  }
  if (from < text.length) parts.push(text.slice(from));
  return <>{parts}</>;
};

function sectionSearchText(section: LegalSection, isHi: boolean): string {
  const parts: string[] = [isHi ? section.headingHi : section.headingEn];
  const push = (block: LegalBlock) => {
    switch (block.kind) {
      case "p":
      case "note":
        parts.push(isHi ? block.hi : block.en);
        break;
      case "list":
        parts.push(...(isHi ? block.itemsHi : block.itemsEn));
        break;
      case "table":
        parts.push(...(isHi ? block.headersHi : block.headersEn));
        parts.push(...(isHi ? block.rowsHi : block.rowsEn).flat());
        break;
      case "code":
        parts.push(block.text);
        break;
    }
  };
  section.blocks.forEach(push);
  return parts.join("\n");
}

interface StatutoryDocumentPageProps {
  slug: string;
}

const StatutoryDocumentPage: React.FC<StatutoryDocumentPageProps> = ({ slug }) => {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const doc: LegalDoc | undefined = getLegalDoc(slug);

  const [query, setQuery] = useState("");
  const [activeSectionId, setActiveSectionId] = useState<string | undefined>(undefined);

  const trimmedQuery = query.trim();
  const normalizedQuery = trimmedQuery.toLowerCase();

  // Reset transient state and scroll when navigating between documents.
  useEffect(() => {
    resetScrollToTop();
    setQuery("");
    setActiveSectionId(undefined);
  }, [slug]);

  // GIGW: every page identifies itself in the browser/tab title.
  useEffect(() => {
    if (!doc) return;
    document.title = `${isHi ? doc.titleHi : doc.titleEn}, Veriq | DoCA`;
    return () => {
      document.title = "Veriq | Department of Consumer Affairs";
    };
  }, [doc, isHi]);

  // Scroll-spy: highlight the section currently in the reader's viewport.
  useEffect(() => {
    if (!doc) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id);
          }
        }
      },
      { rootMargin: "-110px 0px -55% 0px" },
    );
    doc.sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [doc, trimmedQuery, isHi]);

  const visibleSections = useMemo(() => {
    if (!doc) return [];
    if (!normalizedQuery) return doc.sections;
    return doc.sections.filter((section) =>
      sectionSearchText(section, isHi).toLowerCase().includes(normalizedQuery),
    );
  }, [doc, normalizedQuery, isHi]);

  if (!doc) {
    return <Navigate to="/404" replace />;
  }

  const categoryLabel = isHi ? CATEGORY_LABELS[doc.category].hi : CATEGORY_LABELS[doc.category].en;
  const relatedDocs = docsForFooter(doc.category, doc.slug);

  const scrollToSection = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    }
  };

  const tocList = (ariaLabel: string) => (
    <nav aria-label={ariaLabel} className="space-y-1">
      {doc.sections.map((section) => {
        const active = activeSectionId === section.id;
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            onClick={(e) => scrollToSection(e, section.id)}
            aria-current={active ? "true" : undefined}
            className={`block rounded-md px-3 py-1.5 text-[11.5px] font-semibold leading-snug transition-colors ${
              active
                ? "bg-[#e5a93c]/10 text-[#e5a93c] border-l-2 border-[#e5a93c]"
                : "text-slate-400 hover:text-slate-200 hover:bg-[#132238] border-l-2 border-transparent"
            }`}
          >
            {isHi ? section.headingHi : section.headingEn}
          </a>
        );
      })}
    </nav>
  );

  const renderBlock = (block: LegalBlock, blockIdx: number) => {
    switch (block.kind) {
      case "p":
        return (
          <p key={blockIdx} className="text-[13px] leading-relaxed text-slate-300">
            <Highlight text={isHi ? block.hi : block.en} query={trimmedQuery} />
          </p>
        );
      case "list":
        return (
          <ul key={blockIdx} className="space-y-2">
            {(isHi ? block.itemsHi : block.itemsEn).map((item, i) => (
              <li key={i} className="flex gap-2.5 text-[13px] leading-relaxed text-slate-300">
                <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#38bdf8]" />
                <span>
                  <Highlight text={item} query={trimmedQuery} />
                </span>
              </li>
            ))}
          </ul>
        );
      case "table":
        return (
          <div key={blockIdx} className="overflow-x-auto rounded-lg border border-slate-700/70">
            <table className="w-full border-collapse text-left text-[12px]">
              <thead>
                <tr className="bg-[#132238]">
                  {(isHi ? block.headersHi : block.headersEn).map((header, i) => (
                    <th
                      key={i}
                      scope="col"
                      className="border-b border-slate-700/70 px-3.5 py-2.5 font-bold uppercase tracking-wider text-[10.5px] text-[#e5a93c]"
                    >
                      <Highlight text={header} query={trimmedQuery} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(isHi ? block.rowsHi : block.rowsEn).map((row, r) => (
                  <tr key={r} className="odd:bg-[#0b1320] even:bg-[#101c2e]">
                    {row.map((cell, c) => (
                      <td
                        key={c}
                        className={`border-b border-slate-800/70 px-3.5 py-2.5 leading-relaxed ${
                          c === 0 ? "font-semibold text-slate-200" : "text-slate-300"
                        }`}
                      >
                        <Highlight text={cell} query={trimmedQuery} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "note": {
        const toneClasses =
          block.tone === "warning"
            ? "border-rose-500/40 bg-rose-950/30"
            : block.tone === "statutory"
              ? "border-[#e5a93c]/40 bg-[#e5a93c]/5"
              : "border-[#38bdf8]/40 bg-[#38bdf8]/5";
        const toneDot =
          block.tone === "warning"
            ? "bg-rose-400"
            : block.tone === "statutory"
              ? "bg-[#e5a93c]"
              : "bg-[#38bdf8]";
        return (
          <div key={blockIdx} className={`rounded-lg border ${toneClasses} px-4 py-3`} role="note">
            <div className="flex gap-3">
              <span aria-hidden="true" className={`mt-[7px] h-2 w-2 shrink-0 rounded-full ${toneDot}`} />
              <p className="text-[12.5px] font-medium leading-relaxed text-slate-200">
                <Highlight text={isHi ? block.hi : block.en} query={trimmedQuery} />
              </p>
            </div>
          </div>
        );
      }
      case "code":
        return (
          <figure key={blockIdx} className="overflow-hidden rounded-lg border border-slate-700/70 bg-[#081018]">
            <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[11.5px] leading-relaxed text-[#7dd3fc]">
              <code>{block.text}</code>
            </pre>
            {(isHi ? block.captionHi : block.captionEn) && (
              <figcaption className="border-t border-slate-800 bg-[#132238] px-4 py-2 text-[10.5px] font-semibold uppercase tracking-wider text-slate-400">
                {isHi ? block.captionHi : block.captionEn}
              </figcaption>
            )}
          </figure>
        );
      default:
        return null;
    }
  };

  return (
    <div className="legal-doc-page min-h-screen bg-[#0b1320] text-slate-200 flex flex-col font-sans">
      <GovTopBar />

      {/* Sovereign Masthead */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#0b1320]/95 backdrop-blur-sm">
        <div className="h-1 bg-gradient-to-r from-[#ff9933] via-white to-[#138808] w-full" />
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
          <VeriqBrandLogo tone="light" size="md" />
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-[#e5a93c] hover:bg-[#f0bd59] px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 shadow-sm transition"
          >
            <Landmark size={15} />
            <span>{isHi ? "मुख्य पोर्टल" : "Main Portal"}</span>
          </Link>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          {/* Breadcrumb (GIGW) */}
          <nav aria-label="Breadcrumb" className="no-print mb-6 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
            <Link to="/" className="hover:text-[#38bdf8] transition-colors">
              {isHi ? "मुख्य पृष्ठ" : "Home"}
            </Link>
            <ChevronRight size={12} className="text-slate-600" aria-hidden="true" />
            <span className="text-slate-400">{categoryLabel}</span>
            <ChevronRight size={12} className="text-slate-600" aria-hidden="true" />
            <span aria-current="page" className="text-slate-200">
              {isHi ? doc.titleHi : doc.titleEn}
            </span>
          </nav>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
            {/* Sticky Table of Contents (desktop) */}
            <aside className="no-print hidden lg:block">
              <div className="sticky top-24 space-y-6">
                <div>
                  <p className="mb-3 flex items-center gap-2 text-[10.5px] font-extrabold uppercase tracking-widest text-[#38bdf8]">
                    <ListTree size={13} />
                    {isHi ? "इस पृष्ठ पर" : "On this page"}
                  </p>
                  {tocList(isHi ? "विषय-सूची" : "Table of Contents")}
                </div>

                {relatedDocs.length > 0 && (
                  <div className="border-t border-slate-800 pt-4">
                    <p className="mb-3 text-[10.5px] font-extrabold uppercase tracking-widest text-slate-500">
                      {isHi ? "संबंधित दस्तावेज़" : "Related documents"}
                    </p>
                    <ul className="space-y-1.5">
                      {relatedDocs.map((rel) => (
                        <li key={rel.slug}>
                          <Link
                            to={docUrl(rel)}
                            className="block rounded-md px-3 py-1.5 text-[11px] font-semibold text-slate-400 transition-colors hover:bg-[#132238] hover:text-slate-200"
                          >
                            {isHi ? rel.shortHi : rel.shortEn}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>

            {/* Document Article */}
            <article>
              {/* Title Block */}
              <div className="flex items-start gap-4">
                <div className="hidden sm:block pt-1">
                  <BadgeCheck size={40} className="text-[#e5a93c]" strokeWidth={1.6} />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-[10.5px] font-extrabold uppercase tracking-widest text-[#e5a93c]">
                    <FileText size={13} aria-hidden="true" />
                    <span>{categoryLabel}</span>
                    <span className="rounded-full border border-[#e5a93c]/40 bg-[#e5a93c]/10 px-2 py-0.5 text-[9.5px] text-[#f5d78e]">
                      {isHi ? "भारत सरकार • उपभोक्ता मामले विभाग" : "Government of India • DoCA"}
                    </span>
                  </div>
                  <h1 className="mt-1.5 text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                    {isHi ? doc.titleHi : doc.titleEn}
                  </h1>
                  <p className="mt-1.5 text-[11px] font-mono text-slate-500">
                    {isHi
                      ? "अंतिम अद्यतन: 11 सितंबर 2026 • संस्करण 1.0.0-SIH26034"
                      : "Last Updated: 11 September 2026 • Version 1.0.0-SIH26034"}
                  </p>
                </div>
              </div>

              {/* Lede */}
              <p className="mt-6 rounded-xl border border-[#e5a93c]/25 bg-[#132238] p-4 sm:p-5 text-[13px] leading-relaxed text-slate-300">
                <Highlight text={isHi ? doc.ledeHi : doc.ledeEn} query={trimmedQuery} />
              </p>

              {/* Statutory Metadata Header */}
              <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {doc.meta.map((meta) => (
                  <div
                    key={meta.labelEn}
                    className="legal-doc-badge rounded-lg border border-slate-700/70 bg-[#132238] px-3.5 py-2.5"
                  >
                    <p className="text-[9.5px] font-extrabold uppercase tracking-widest text-[#38bdf8]">
                      {isHi ? meta.labelHi : meta.labelEn}
                    </p>
                    <p className="mt-0.5 font-mono text-[12px] font-semibold leading-snug text-slate-200">
                      {isHi ? meta.valueHi : meta.valueEn}
                    </p>
                  </div>
                ))}
              </div>

              {/* Authoritative source link */}
              <a
                href={doc.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-[11.5px] font-bold text-[#38bdf8] underline-offset-2 hover:underline"
              >
                <ExternalLink size={13} aria-hidden="true" />
                <span>{isHi ? doc.sourceLabelHi : doc.sourceLabelEn}</span>
                <span className="sr-only"> ({isHi ? "नए टैब में खुलता है" : "opens in a new tab"})</span>
              </a>

              {/* Toolbar: instant search + print */}
              <div className="no-print mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search
                    size={15}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label={isHi ? "दस्तावेज़ में खोजें" : "Search this document"}
                    placeholder={isHi ? "दस्तावेज़ में त्वरित खोज…" : "Instantly search this document…"}
                    className="w-full rounded-lg border border-slate-700 bg-[#132238] py-2.5 pl-9 pr-3 text-[12.5px] text-slate-200 placeholder:text-slate-500 outline-none transition focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/30"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#e5a93c]/50 bg-[#e5a93c]/10 px-4 py-2.5 text-[12px] font-bold text-[#e5a93c] transition hover:bg-[#e5a93c]/20 focus:outline-none focus:ring-2 focus:ring-[#e5a93c]/40"
                >
                  <Printer size={14} aria-hidden="true" />
                  <span>{isHi ? "प्रिंट / PDF" : "Print / PDF"}</span>
                </button>
              </div>

              {trimmedQuery && (
                <p aria-live="polite" className="no-print mt-2 text-[11px] font-semibold text-slate-400">
                  {isHi
                    ? `${visibleSections.length} / ${doc.sections.length} अनुभाग मेल खाते हैं`
                    : `${visibleSections.length} of ${doc.sections.length} sections match`}
                </p>
              )}

              {/* Mobile table of contents (GIGW navigation parity) */}
              <details className="no-print mt-5 rounded-lg border border-slate-700/70 bg-[#132238] lg:hidden">
                <summary className="cursor-pointer select-none px-4 py-3 text-[11px] font-extrabold uppercase tracking-widest text-[#38bdf8]">
                  {isHi ? "इस पृष्ठ पर (विषय-सूची)" : "On this page (Table of Contents)"}
                </summary>
                <div className="px-2 pb-3">{tocList(isHi ? "विषय-सूची (मोबाइल)" : "Table of Contents (Mobile)")}</div>
              </details>

              {/* Sections */}
              {visibleSections.length === 0 ? (
                <div className="mt-8 flex flex-col items-center rounded-xl border border-dashed border-slate-700 bg-[#132238] px-6 py-12 text-center">
                  <SearchX size={28} className="text-slate-500" aria-hidden="true" />
                  <p className="mt-3 text-sm font-bold text-slate-300">
                    {isHi ? "कोई मेल नहीं मिला" : "No matches found"}
                  </p>
                  <p className="mt-1 text-[12px] text-slate-500">
                    {isHi
                      ? "अलग शब्दों से खोजें या खोज साफ़ करें।"
                      : "Try different keywords or clear the search."}
                  </p>
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="mt-4 rounded-lg border border-[#38bdf8]/50 bg-[#38bdf8]/10 px-3.5 py-2 text-[11.5px] font-bold text-[#38bdf8] transition hover:bg-[#38bdf8]/20"
                  >
                    {isHi ? "खोज साफ़ करें" : "Clear search"}
                  </button>
                </div>
              ) : (
                <div className="mt-9 space-y-9">
                  {visibleSections.map((section) => (
                    <section
                      key={section.id}
                      id={section.id}
                      aria-labelledby={`${section.id}-heading`}
                      className="scroll-mt-28 rounded-xl border border-slate-800 bg-[#132238]/60 p-5 sm:p-7"
                    >
                      <h2
                        id={`${section.id}-heading`}
                        className="flex items-center gap-2.5 text-base sm:text-lg font-black tracking-tight text-white"
                      >
                        <span aria-hidden="true" className="h-5 w-1 rounded-full bg-[#e5a93c]" />
                        {isHi ? section.headingHi : section.headingEn}
                      </h2>
                      <div className="mt-4 space-y-3.5">
                        {section.blocks.map((block, blockIdx) => renderBlock(block, blockIdx))}
                      </div>
                    </section>
                  ))}
                </div>
              )}

              {/* Related documents (mobile / end-of-article parity) */}
              {relatedDocs.length > 0 && (
                <div className="mt-10 border-t border-slate-800 pt-6">
                  <p className="section-eyebrow mb-3">{isHi ? "संबंधित दस्तावेज़" : "Related documents"}</p>
                  <div className="flex flex-wrap gap-2">
                    {relatedDocs.map((rel) => (
                      <Link
                        key={rel.slug}
                        to={docUrl(rel)}
                        className="rounded-lg border border-slate-700 bg-[#132238] px-3.5 py-2 text-[11px] font-bold text-slate-300 transition hover:border-[#38bdf8]/50 hover:text-[#38bdf8]"
                      >
                        {isHi ? rel.shortHi : rel.shortEn}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </div>
        </div>
      </main>

      <GovFooter />
    </div>
  );
};

export default StatutoryDocumentPage;
