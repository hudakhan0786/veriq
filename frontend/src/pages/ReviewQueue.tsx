import React, { useState, useEffect, useMemo } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { ApiService } from "../services/api";
import { InspectionSummary } from "../types/inspection";
import { resetScrollToTop } from "../components/common/ScrollToTop";
import { VerdictBadge, WorkflowBadge } from "../components/common/StatusBadge";
import {
  AlertTriangle,
  Clock3,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Filter,
  Trash2,
  RefreshCw,
  Search,
  ArrowUpDown,
  X,
} from "lucide-react";

export type ReviewSortOption =
  | "DATE_DESC"
  | "DATE_ASC"
  | "SEVERITY"
  | "DEGRADED"
  | "CASE_ASC"
  | "CASE_DESC"
  | "NAME_ASC"
  | "NAME_DESC";

export const ReviewQueue: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [cases, setCases] = useState<InspectionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [triageFilter, setTriageFilter] = useState<"ALL" | "REVIEW" | "UNABLE">("ALL");
  const [sortBy, setSortBy] = useState<ReviewSortOption>("DATE_DESC");
  const [searchQuery, setSearchQuery] = useState("");
  const [caseToDelete, setCaseToDelete] = useState<InspectionSummary | null>(null);
  const [deletingCaseId, setDeletingCaseId] = useState<string | null>(null);

  useEffect(() => {
    resetScrollToTop();
  }, [triageFilter, sortBy]);

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "Not available";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  const loadCases = () => {
    setIsLoading(true);
    ApiService.listInspections()
      .then((res) => setCases(res.items))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadCases();
    window.addEventListener("nirikshak_data_updated", loadCases);
    return () => window.removeEventListener("nirikshak_data_updated", loadCases);
  }, []);

  // Filter cases that require human attention (strictly unadjudicated review/pending/unable/fail violations)
  const reviewCases = useMemo(() => {
    return cases.filter(
      (c) =>
        !c.adjudicated &&
        (c.overall_status === "REVIEW" ||
          c.overall_status === "UNABLE_TO_VERIFY" ||
          c.overall_status === "PENDING_REVIEW" ||
          c.overall_status === "PENDING" ||
          c.overall_status === "FAIL")
    );
  }, [cases]);

  const getFormattedProductName = (c: InspectionSummary): string => {
    if (
      !c.product_name ||
      c.product_name === "Unlabeled Sample" ||
      c.product_name.toLowerCase().includes("unlabeled")
    ) {
      const est = c.establishment_name ? `${c.establishment_name} - ` : "";
      const cat = c.category ? c.category.replace(/_/g, " ") : (language === "hi" ? "पैकेज्ड वस्तु" : "Packaged Commodity");
      return language === "hi"
        ? `${est}${cat} (प्रक्रियाधीन संज्ञान)`
        : `${est}${cat} (Intake Review)`;
    }
    return c.product_name;
  };

  const filtered = useMemo(() => {
    let result = reviewCases;

    // 1. Triage Filter
    if (triageFilter === "REVIEW") {
      result = result.filter(
        (c) =>
          c.overall_status === "REVIEW" ||
          c.overall_status === "PENDING_REVIEW" ||
          c.overall_status === "PENDING" ||
          c.overall_status === "FAIL"
      );
    } else if (triageFilter === "UNABLE") {
      result = result.filter((c) => c.overall_status === "UNABLE_TO_VERIFY");
    }

    // 2. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) => {
        const prod = getFormattedProductName(c).toLowerCase();
        const num = (c.inspection_number || "").toLowerCase();
        const brand = (c.brand_name || "").toLowerCase();
        const est = (c.establishment_name || "").toLowerCase();
        const circle = (c.jurisdiction_id || "").toLowerCase();
        return prod.includes(q) || num.includes(q) || brand.includes(q) || est.includes(q) || circle.includes(q);
      });
    }

    // 3. Sorting
    return [...result].sort((a, b) => {
      switch (sortBy) {
        case "DATE_ASC": {
          const tA = new Date(a.created_at || (a as any).inspection_timestamp || 0).getTime();
          const tB = new Date(b.created_at || (b as any).inspection_timestamp || 0).getTime();
          return tA - tB;
        }
        case "DATE_DESC": {
          const tA = new Date(a.created_at || (a as any).inspection_timestamp || 0).getTime();
          const tB = new Date(b.created_at || (b as any).inspection_timestamp || 0).getTime();
          return tB - tA;
        }
        case "SEVERITY": {
          const order: Record<string, number> = { REVIEW: 1, PENDING_REVIEW: 2, PENDING: 3, UNABLE_TO_VERIFY: 4 };
          return (order[a.overall_status] || 99) - (order[b.overall_status] || 99);
        }
        case "DEGRADED": {
          const isAUnable = a.overall_status === "UNABLE_TO_VERIFY" ? 0 : 1;
          const isBUnable = b.overall_status === "UNABLE_TO_VERIFY" ? 0 : 1;
          return isAUnable - isBUnable;
        }
        case "CASE_ASC":
          return (a.inspection_number || "").localeCompare(b.inspection_number || "");
        case "CASE_DESC":
          return (b.inspection_number || "").localeCompare(a.inspection_number || "");
        case "NAME_ASC":
          return getFormattedProductName(a).localeCompare(getFormattedProductName(b));
        case "NAME_DESC":
          return getFormattedProductName(b).localeCompare(getFormattedProductName(a));
        default:
          return 0;
      }
    });
  }, [reviewCases, triageFilter, searchQuery, sortBy]);

  const counts = useMemo(() => {
    const borderline = reviewCases.filter(
      (c) =>
        c.overall_status === "REVIEW" ||
        c.overall_status === "PENDING_REVIEW" ||
        c.overall_status === "PENDING"
    ).length;
    const degraded = reviewCases.filter((c) => c.overall_status === "UNABLE_TO_VERIFY").length;
    return { total: reviewCases.length, borderline, degraded };
  }, [reviewCases]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
            {language === "hi" ? "मानव-हस्तक्षेप अधिनिर्णय (HITL)" : "Human-in-the-Loop Adjudication"}
          </span>
          <h1 className="text-2xl font-black text-[#1B365D] mt-1">
            {language === "hi" ? "अधिकारी समीक्षा कतार" : "Officer Review Queue"}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5 max-w-2xl">
            {language === "hi"
              ? "पैकेजिंग निरीक्षण जहां स्वचालित विश्लेषण में मानव अधिकारी मूल्यांकन, सेंसर अनिश्चितता अधिनिर्णय या फोटोग्राफिक पुनः प्राप्ति की आवश्यकता है।"
              : "Packaging inspections where automated analysis requires human officer assessment, sensor uncertainty adjudication, or photographic re-capture."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/inspections" className="px-3.5 py-2 text-xs font-bold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-colors">
            <span>{language === "hi" ? "सभी मामले देखें" : "View All Cases"}</span>
          </Link>
        </div>
      </div>

      {/* 3 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setTriageFilter("ALL")}
          className={`p-4 cursor-pointer transition-all rounded-xl border ${
            triageFilter === "ALL"
              ? "ring-2 ring-[#1B365D] border-[#1B365D] bg-blue-50/50 shadow-xs"
              : "bg-white border-slate-200/90 hover:bg-slate-50/80 shadow-xs"
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {language === "hi" ? "कुल चिह्नित मामले" : "Total Flagged Cases"}
          </span>
          <p className="text-3xl font-black text-[#1B365D] mt-1">{counts.total}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {language === "hi" ? "मानव सत्यापन की आवश्यकता" : "Requiring human verification"}
          </p>
        </div>

        <div
          onClick={() => setTriageFilter("REVIEW")}
          className={`p-4 cursor-pointer transition-all rounded-xl border ${
            triageFilter === "REVIEW"
              ? "ring-2 ring-amber-500 border-amber-400 bg-amber-50/60 shadow-xs"
              : "bg-white border-slate-200/90 hover:bg-slate-50/80 shadow-xs"
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
            {language === "hi" ? "सीमावर्ती सेंसर रीडिंग (समीक्षा)" : "Borderline Sensor Readings (REVIEW)"}
          </span>
          <p className="text-3xl font-black text-amber-700 mt-1">{counts.borderline}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {language === "hi" ? "सेंसर अनिश्चितता बैंड के भीतर (k=2, 95%)" : "Within sensor uncertainty band (k=2, 95%)"}
          </p>
        </div>

        <div
          onClick={() => setTriageFilter("UNABLE")}
          className={`p-4 cursor-pointer transition-all rounded-xl border ${
            triageFilter === "UNABLE"
              ? "ring-2 ring-slate-500 border-slate-400 bg-slate-100 shadow-xs"
              : "bg-white border-slate-200/90 hover:bg-slate-50/80 shadow-xs"
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
            {language === "hi" ? "निम्न गुणवत्ता साक्ष्य कमियां" : "Degraded Evidence Gaps"}
          </span>
          <p className="text-3xl font-black text-slate-800 mt-1">{counts.degraded}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {language === "hi" ? "अत्यधिक धुंधलापन (σ²<120) या चमक प्रकीर्णन (>15%)" : "High blur (σ²<120) or glare bloom (>15%)"}
          </p>
        </div>
      </div>

      {/* Search, Sort & Triage Control Toolbar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === "hi"
                ? "मामला संख्या, वस्तु, ब्रांड या अधिकार क्षेत्र खोजें..."
                : "Search case ID, commodity, brand, jurisdiction..."
            }
            className="w-full text-xs sm:text-sm pl-9 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20 focus:border-[#1B365D] bg-white text-slate-900 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sorting Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <ArrowUpDown size={14} className="text-[#1B365D]" />
            <span>{language === "hi" ? "क्रमबद्ध:" : "Sort:"}</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as ReviewSortOption)}
            className="text-xs font-semibold px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20 focus:border-[#1B365D] cursor-pointer"
          >
            <option value="DATE_DESC">{language === "hi" ? "नवीनतम पहले (Newest)" : "Date: Newest First"}</option>
            <option value="DATE_ASC">{language === "hi" ? "पुरातन पहले (Oldest)" : "Date: Oldest First"}</option>
            <option value="SEVERITY">{language === "hi" ? "समीक्षा प्राथमिकता (Borderline First)" : "Priority: Borderline First"}</option>
            <option value="DEGRADED">{language === "hi" ? "निम्न साक्ष्य पहले (Degraded First)" : "Evidence: Degraded First"}</option>
            <option value="CASE_ASC">{language === "hi" ? "प्रकरण संख्या (A → Z)" : "Case ID: A → Z"}</option>
            <option value="CASE_DESC">{language === "hi" ? "प्रकरण संख्या (Z → A)" : "Case ID: Z → A"}</option>
            <option value="NAME_ASC">{language === "hi" ? "वस्तु नाम (A → Z)" : "Commodity: A → Z"}</option>
            <option value="NAME_DESC">{language === "hi" ? "वस्तु नाम (Z → A)" : "Commodity: Z → A"}</option>
          </select>

          {/* Active Results Count */}
          <span className="text-xs font-bold text-[#1B365D] bg-blue-50 border border-blue-200 px-2.5 py-1.5 rounded-lg shrink-0">
            {language === "hi" ? `${filtered.length} मामले` : `${filtered.length} Cases`}
          </span>

          {/* Clear Button if filters active */}
          {(searchQuery || triageFilter !== "ALL" || sortBy !== "DATE_DESC") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setTriageFilter("ALL");
                setSortBy("DATE_DESC");
              }}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 px-2 py-1 underline cursor-pointer shrink-0"
            >
              {language === "hi" ? "रीसेट" : "Reset"}
            </button>
          )}
        </div>
      </div>

      {/* Case List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center space-y-3 shadow-xs">
            <Filter size={36} className="text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">
              {language === "hi" ? "कोई मेल खाने वाले मामले नहीं मिले" : "No matching review cases found"}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {language === "hi"
                ? "कृपया अपने खोज शब्द बदलें या सक्रिय फ़िल्टर साफ़ करें।"
                : "Try adjusting your search query or clearing the active triage filter."}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setTriageFilter("ALL");
                setSortBy("DATE_DESC");
              }}
              className="px-4 py-2 text-xs font-bold text-[#1B365D] bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              {language === "hi" ? "सभी फ़िल्टर साफ़ करें" : "Clear All Filters"}
            </button>
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((c) => {
            const isReview = c.overall_status === "REVIEW";
            return (
              <m.div
                key={c.id}
                layout
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white p-5 rounded-xl space-y-3 shadow-xs border border-slate-200/90 hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-xl shrink-0 ${
                        isReview ? "bg-amber-100 text-amber-700 border border-amber-200" : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {isReview ? <AlertTriangle size={22} /> : <Clock3 size={22} />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#1B365D] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {c.inspection_number}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900">{getFormattedProductName(c)}</h3>
                        <VerdictBadge verdict={c.overall_status} size="sm" />
                      </div>
                      <p className="text-xs text-slate-500">
                        {c.brand_name || (language === "hi" ? "पैकेज्ड वस्तुएं" : "Packaged Goods")} • {language === "hi" ? "अधिकार क्षेत्र:" : "Jurisdiction:"} <span className="text-slate-800 font-semibold">{c.jurisdiction_id || "DL-SOUTH-01"}</span> • <span className="font-mono text-slate-500 font-medium">{formatDateTime(c.created_at || (c as any).inspection_timestamp)}</span>
                      </p>
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 max-w-3xl">
                        {isReview ? (
                          language === "hi" ? (
                            <span>
                              <b className="text-amber-800">सीमावर्ती माप: </b> अंक तालिका-I की सीमा के करीब पाए गए हैं।
                              माप अनिश्चितता बैंड (±0.08 मिमी) के लिए अधिकारी आवर्धक (लूप) पुष्टि आवश्यक है।
                            </span>
                          ) : (
                            <span>
                              <b className="text-amber-800">Borderline Measurement: </b> Numerals detected close to Table-I threshold.
                              Measurement uncertainty band (±0.08 mm) requires officer loupe confirmation.
                            </span>
                          )
                        ) : (
                          language === "hi" ? (
                            <span>
                              <b className="text-rose-800">साक्ष्य निम्नीकरण: </b> ऑप्टिकल गुणवत्ता गेट ने अत्यधिक धुंधलापन या
                              चमक पाई जो नियम 6 की अनिवार्य घोषणाओं को अस्पष्ट करती है। पुनः फोटो लेने का सुझाव है।
                            </span>
                          ) : (
                            <span>
                              <b className="text-rose-800">Evidence Degradation: </b> Optical quality gate detected excessive blur or
                              specular glare obscuring mandatory Rule 6 text declarations. Photographic retake suggested.
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCaseToDelete(c)}
                      className="p-2 text-slate-400 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 rounded-lg transition-colors cursor-pointer"
                      title={language === "hi" ? "डेटाबेस से मामला हटाएं" : "Dispose & Delete Case from Database"}
                      aria-label={`Delete case ${c.inspection_number}`}
                    >
                      <Trash2 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        resetScrollToTop();
                        navigate(`/inspections/${c.id}`);
                      }}
                      className="py-2 px-3.5 text-xs font-bold whitespace-nowrap bg-[#1B365D] hover:bg-[#0A2540] text-white rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <UserCheck size={14} />
                      <span>{language === "hi" ? "कैनवास में निर्णय करें" : "Adjudicate in Canvas"}</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </m.div>
            );
          })}
        </AnimatePresence>
      )}
    </div>

      {/* Deletion Confirmation Modal */}
      {caseToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-overlay-in">
          <div className="bg-white p-6 space-y-4 max-w-md w-full rounded-2xl border border-slate-200 shadow-2xl overflow-hidden relative animate-pop-in">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
            <div className="flex items-start gap-3 pt-1">
              <div className="p-2.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-full shrink-0">
                <Trash2 size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === "hi" ? "मामला निरस्त एवं स्थायी निष्कासन" : "Dispose & Permanently Delete Case"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === "hi"
                    ? "डेटाबेस से यह मामला एवं सभी संबंधित विधिक विवरण पूरी तरह हटा दिए जाएंगे।"
                    : "This inspection case and all related statutory details will be permanently removed from the database sitewide."}
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">{language === "hi" ? "केस संख्या:" : "Case Number:"}</span>
                <span className="font-mono font-bold text-[#1B365D]">{caseToDelete.inspection_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{language === "hi" ? "उत्पाद / वस्तु:" : "Product / Commodity:"}</span>
                <span className="font-semibold text-slate-800 truncate max-w-[220px]">{caseToDelete.product_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{language === "hi" ? "दिनांक एवं समय:" : "Date & Time:"}</span>
                <span className="font-mono text-slate-700">{formatDateTime(caseToDelete.created_at || (caseToDelete as any).inspection_timestamp)}</span>
              </div>
            </div>

            <p className="text-[11px] text-rose-800 bg-rose-50 p-3 rounded-xl border border-rose-300">
              <b>{language === "hi" ? "सांविधिक चेतावनी: " : "Statutory Warning: "}</b>
              {language === "hi"
                ? "यह कार्रवाई पूर्ववत नहीं की जा सकती। सभी साक्ष्य छवियां, नियम निष्कर्ष एवं नोटिस स्थायी रूप से नष्ट हो जाएंगे। धारा 63 बीएसए 2023 के तहत ऑडिट बहीखाते में एक 'CASE_DISPOSED' इवेंट दर्ज किया जाएगा।"
                : "This action cannot be undone. All evidence photographs, rule evaluations, and notice records will be purged. A 'CASE_DISPOSED' audit event will be recorded under Section 63 BSA 2023."}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={deletingCaseId !== null}
                onClick={() => setCaseToDelete(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-colors cursor-pointer"
              >
                {language === "hi" ? "रद्द करें" : "Cancel"}
              </button>
              <button
                type="button"
                disabled={deletingCaseId !== null}
                onClick={async () => {
                  const id = caseToDelete.id;
                  setDeletingCaseId(id);
                  try {
                    await ApiService.deleteInspection(id);
                    setCaseToDelete(null);
                    loadCases();
                  } catch (err: any) {
                    alert(err?.message || "Failed to delete case from database");
                  } finally {
                    setDeletingCaseId(null);
                  }
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                {deletingCaseId === caseToDelete.id ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{language === "hi" ? "हटाया जा रहा है..." : "Disposing..."}</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>{language === "hi" ? "स्थायी रूप से हटाएं" : "Permanently Delete"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewQueue;

