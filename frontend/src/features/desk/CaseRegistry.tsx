import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { InspectionSummary } from "../../types/inspection";
import { VerdictBadge, WorkflowBadge } from "../../components/common/StatusBadge";
import { MapPin, CalendarDays, Plus, Trash2, RefreshCw, AlertTriangle, ArrowUpDown, ArrowDown, ArrowUp, X, Filter, Download, Printer, LayoutGrid, List } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { ApiService } from "../../services/api";
import { useDebounce } from "../../hooks/useDebounce";

export type DeskSortOption =
  | "DATE_DESC"
  | "DATE_ASC"
  | "VERDICT_SEV"
  | "CONF_ASC"
  | "CONF_DESC"
  | "CASE_ASC"
  | "CASE_DESC"
  | "PRODUCT_ASC"
  | "PRODUCT_DESC";

export interface CaseRegistryProps {
  cases: InspectionSummary[];
  activeCircle: string;
  onSelectCase: (caseId: string) => void;
  onNewInspectionClick: () => void;
  isLoading?: boolean;
  onRefresh?: () => void;
  onDeleteCase?: (caseId: string) => Promise<void>;
}

export const CaseRegistry: React.FC<CaseRegistryProps> = ({
  cases,
  activeCircle,
  onSelectCase,
  onNewInspectionClick,
  isLoading = false,
  onRefresh,
  onDeleteCase,
}) => {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const paramVerdict = searchParams.get("verdict");
  const paramWorkflow = searchParams.get("workflow");
  const paramTriage = searchParams.get("triage");
  const paramQ = searchParams.get("q");

  const [caseToDelete, setCaseToDelete] = useState<InspectionSummary | null>(null);
  const [deletingCaseId, setDeletingCaseId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(paramQ || "");
  const debouncedSearchTerm = useDebounce(searchTerm, 250);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState<"LIST" | "GRID">(() => {
    return (localStorage.getItem("nirikshak_case_registry_view_mode") as "LIST" | "GRID") || "LIST";
  });

  useEffect(() => {
    localStorage.setItem("nirikshak_case_registry_view_mode", viewMode);
  }, [viewMode]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>(paramWorkflow || "ALL");
  const [selectedVerdict, setSelectedVerdict] = useState<string>(paramVerdict || "ALL");
  const [sortBy, setSortBy] = useState<DeskSortOption>("DATE_DESC");
  const [triageFilter, setTriageFilter] = useState<"ALL" | "CONFLICTS" | "EVIDENCE_GAPS">(
    paramTriage === "CONFLICTS" || paramTriage === "EVIDENCE_GAPS" ? paramTriage : "ALL"
  );

  // Sync state if search params change (e.g. user clicks KPI card or browser back/forward)
  React.useEffect(() => {
    const v = searchParams.get("verdict");
    if (v) {
      setSelectedVerdict(v);
    }
    const w = searchParams.get("workflow");
    if (w) {
      setSelectedWorkflow(w);
    }
    const t = searchParams.get("triage");
    if (t === "CONFLICTS" || t === "EVIDENCE_GAPS" || t === "ALL") {
      setTriageFilter(t);
    }
    const q = searchParams.get("q");
    if (q !== null && q !== undefined) {
      setSearchTerm(q);
    }
  }, [searchParams]);

  // Reset to page 1 on filter or search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedWorkflow, selectedVerdict, triageFilter, sortBy, activeCircle]);

  // Triage filter counters
  const conflictCount = useMemo(() => {
    return cases.filter(
      (c) =>
        c.overall_status === "REVIEW" ||
        c.inspection_number.includes("DEMO-02") ||
        c.inspection_number.includes("DEMO-04") ||
        (c.violations_count !== undefined && c.violations_count > 1) ||
        Boolean(c.has_conflicts)
    ).length;
  }, [cases]);

  const evidenceGapCount = useMemo(() => {
    return cases.filter(
      (c) =>
        c.workflow_status === "DRAFT" ||
        c.overall_status === "UNABLE_TO_VERIFY" ||
        c.overall_status === "PENDING_REVIEW" ||
        c.inspection_number.includes("DEMO-05") ||
        Boolean(c.evidence_gap)
    ).length;
  }, [cases]);

  // Confidence estimation helper with robust bounds clamping [0.0 - 1.0] and percentage handling
  const getCaseConfidence = (c: InspectionSummary): number => {
    let val: number;
    if (typeof c.overall_confidence === "number") {
      val = c.overall_confidence > 1 ? c.overall_confidence / 100 : c.overall_confidence;
    } else if (c.overall_status === "PASS") {
      val = 0.98;
    } else if (c.overall_status === "FAIL") {
      val = 0.95;
    } else if (c.overall_status === "REVIEW") {
      val = 0.74;
    } else if (c.overall_status === "UNABLE_TO_VERIFY") {
      val = 0.42;
    } else {
      val = 0.88;
    }
    return Math.max(0, Math.min(1, val));
  };

  const getFormattedProductName = (c: InspectionSummary): string => {
    if (c.product_name && c.product_name !== "Unlabeled Sample") {
      return c.product_name;
    }
    if (c.brand_name) {
      return `${c.brand_name} Commodity`;
    }
    const category = (c as unknown as { category?: string }).category;
    if (category) {
      return `${category.replace(/_/g, " ")} Sample`;
    }
    return "Packaged Commodity Sample";
  };

  // Filtered case records
  const filteredCases = useMemo(() => {
    const matched = cases.filter((c) => {
      // Circle filter
      if (activeCircle && activeCircle !== "ALL" && c.jurisdiction_id && c.jurisdiction_id !== activeCircle) {
        return false;
      }

      // Quick Triage Filter
      if (triageFilter === "CONFLICTS") {
        const isConflict =
          c.overall_status === "REVIEW" ||
          c.inspection_number.includes("DEMO-02") ||
          c.inspection_number.includes("DEMO-04") ||
          (c.violations_count !== undefined && c.violations_count > 1) ||
          Boolean(c.has_conflicts);
        if (!isConflict) return false;
      } else if (triageFilter === "EVIDENCE_GAPS") {
        const isGap =
          c.workflow_status === "DRAFT" ||
          c.overall_status === "UNABLE_TO_VERIFY" ||
          c.overall_status === "PENDING_REVIEW" ||
          c.inspection_number.includes("DEMO-05") ||
          Boolean(c.evidence_gap);
        if (!isGap) return false;
      }

      // Search term filter (debounced for maximum typing responsiveness)
      if (debouncedSearchTerm.trim()) {
        const query = debouncedSearchTerm.toLowerCase();
        const prodName = getFormattedProductName(c).toLowerCase();
        const match = 
          prodName.includes(query) ||
          c.inspection_number.toLowerCase().includes(query) ||
          (c.brand_name && c.brand_name.toLowerCase().includes(query)) ||
          (c.establishment_name && c.establishment_name.toLowerCase().includes(query)) ||
          (c.manufacturer_name && c.manufacturer_name.toLowerCase().includes(query)) ||
          (c.jurisdiction_id && c.jurisdiction_id.toLowerCase().includes(query)) ||
          (c.location && c.location.toLowerCase().includes(query));
          
        if (!match) {
          return false;
        }
      }

      // Workflow filter
      if (selectedWorkflow !== "ALL" && c.workflow_status !== selectedWorkflow) {
        return false;
      }

      // Verdict filter
      if (selectedVerdict !== "ALL") {
        if (selectedVerdict === "PASS") {
          if (!(c.overall_status === "PASS" || (c.overall_status === "COMPLETED" && c.ai_verdict !== "FAIL"))) return false;
        } else if (selectedVerdict === "FAIL") {
          if (!(c.overall_status === "FAIL" || (c.violations_count !== undefined && c.violations_count > 0))) return false;
        } else if (selectedVerdict === "REVIEW") {
          if (!(c.overall_status === "REVIEW" || c.overall_status === "UNABLE_TO_VERIFY" || c.overall_status === "PENDING_REVIEW" || c.overall_status === "PENDING")) return false;
        } else if (c.overall_status !== selectedVerdict) {
          return false;
        }
      }

      return true;
    });

    // Sorting stage
    return [...matched].sort((a, b) => {
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
        case "VERDICT_SEV": {
          // Violations (FAIL) first, then REVIEW/UNABLE, then PASS
          const score = (c: InspectionSummary) => {
            if (c.overall_status === "FAIL" || (c.violations_count && c.violations_count > 0)) return 1;
            if (c.overall_status === "REVIEW" || c.overall_status === "UNABLE_TO_VERIFY" || c.overall_status === "PENDING_REVIEW" || c.overall_status === "PENDING") return 2;
            return 3;
          };
          return score(a) - score(b);
        }
        case "CONF_ASC":
          return getCaseConfidence(a) - getCaseConfidence(b);
        case "CONF_DESC":
          return getCaseConfidence(b) - getCaseConfidence(a);
        case "CASE_ASC":
          return (a.inspection_number || "").localeCompare(b.inspection_number || "");
        case "CASE_DESC":
          return (b.inspection_number || "").localeCompare(a.inspection_number || "");
        case "PRODUCT_ASC":
          return getFormattedProductName(a).localeCompare(getFormattedProductName(b));
        case "PRODUCT_DESC":
          return getFormattedProductName(b).localeCompare(getFormattedProductName(a));
        default:
          return 0;
      }
    });
  }, [cases, activeCircle, debouncedSearchTerm, selectedWorkflow, selectedVerdict, triageFilter, sortBy]);

  // Client-Side List Pagination for Performance and Smooth DOM Rendering
  const totalPages = Math.max(1, Math.ceil(filteredCases.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredCases.length);
  const paginatedCases = useMemo(() => {
    return filteredCases.slice(startIndex, endIndex);
  }, [filteredCases, startIndex, endIndex]);

  const formatInspectionType = (type?: string) => {
    if (language === "hi") {
      switch (type) {
        case "ROUTINE_MARKET_SURVEILLANCE":
          return "नियमित बाजार निगरानी";
        case "COMPLAINT_VERIFICATION":
          return "शिकायत ऑडिट";
        case "MANUFACTURER_PACKER_DEPOT":
          return "डिपो / पैकर ऑडिट";
        case "SURPRISE_ENFORCEMENT_RAID":
          return "प्रवर्तन छापा";
        default:
          return "क्षेत्रीय निरीक्षण";
      }
    }
    switch (type) {
      case "ROUTINE_MARKET_SURVEILLANCE":
        return "Routine Surveillance";
      case "COMPLAINT_VERIFICATION":
        return "Complaint Audit";
      case "MANUFACTURER_PACKER_DEPOT":
        return "Depot Audit";
      case "SURPRISE_ENFORCEMENT_RAID":
        return "Enforcement Raid";
      default:
        return type || "Field Inspection";
    }
  };

  const formatDateTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString ? isoString.slice(0, 16).replace("T", " ") : "";
      return d.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return isoString ? isoString.slice(0, 16).replace("T", " ") : "";
    }
  };

  const formatDate = formatDateTime;

  const handleExportCSV = () => {
    const headers = [
      "Inspection Number",
      "Commodity Name",
      "Brand",
      "Establishment",
      "Jurisdiction Circle",
      "Inspection Type",
      "Compliance Verdict",
      "Confidence (%)",
      "Workflow Status",
      "Created Date",
    ];

    const rows = filteredCases.map((c) => {
      const conf = Math.round(getCaseConfidence(c) * 100);
      return [
        `"${c.inspection_number || ""}"`,
        `"${(getFormattedProductName(c) || "").replace(/"/g, '""')}"`,
        `"${(c.brand_name || "").replace(/"/g, '""')}"`,
        `"${(c.establishment_name || "").replace(/"/g, '""')}"`,
        `"${c.jurisdiction_id || activeCircle || ""}"`,
        `"${c.inspection_type || ""}"`,
        `"${c.overall_status || ""}"`,
        conf,
        `"${c.workflow_status || ""}"`,
        `"${c.created_at || ""}"`,
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Case_Registry_${activeCircle}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      {/* Desk Title Strip & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              {language === "hi" ? "केस रजिस्ट्री" : "Case Registry"}
            </h2>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[#1B365D] font-bold">
              {language === "hi" ? `सक्रिय मंडल: ${activeCircle}` : `Active Circle: ${activeCircle}`}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {language === "hi"
              ? "विधिक मापविज्ञान (पैकेज्ड वस्तुएं) नियम, 2011 एवं विधिक मापविज्ञान अधिनियम, 2009 की धारा 15 के अंतर्गत संपूर्ण मामला पंजी।"
              : "Complete statutory case register under Section 15 of Legal Metrology Act, 2009 and LMPC Rules, 2011."}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            title={language === "hi" ? "केस रजिस्ट्री सीएसवी डाउनलोड करें" : "Export Case Registry as CSV"}
          >
            <Download size={14} className="text-slate-600" />
            <span className="hidden sm:inline">{language === "hi" ? "सीएसवी निर्यात" : "Export CSV"}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            title={language === "hi" ? "पंजी प्रिंट करें" : "Print Registry"}
          >
            <Printer size={14} className="text-slate-600" />
            <span className="hidden sm:inline">{language === "hi" ? "प्रिंट" : "Print"}</span>
          </button>

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="p-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-xs font-medium focus:outline-none transition-colors cursor-pointer"
              title={language === "hi" ? "मामला पंजी रीफ्रेश करें" : "Refresh case register"}
            >
              <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            </button>
          )}

          <button
            type="button"
            onClick={onNewInspectionClick}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1B365D] hover:bg-[#0A2540] text-white text-xs font-bold rounded-lg shadow-xs transition-colors focus:ring-2 focus:ring-[#1B365D] focus:outline-none cursor-pointer"
          >
            <Plus size={14} />
            <span>{language === "hi" ? "नया मामला" : "New Case"}</span>
          </button>
        </div>
      </div>

      {/* Quick Triage Filter Pills */}
      <div className="flex items-center gap-2 flex-wrap bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
          {language === "hi" ? "त्वरित वर्गीकरण:" : "Quick Triage:"}
        </span>
        <button
          type="button"
          data-testid="triage-all"
          onClick={() => setTriageFilter("ALL")}
          className={`px-3 py-1 text-xs font-bold rounded-full border transition-colors cursor-pointer ${
            triageFilter === "ALL"
              ? "bg-[#1B365D] text-white border-[#1B365D] shadow-xs"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          {language === "hi" ? `सभी मामले (${cases.length})` : `All Cases (${cases.length})`}
        </button>
        <button
          type="button"
          data-testid="triage-conflicts"
          onClick={() => setTriageFilter("CONFLICTS")}
          className={`px-3 py-1 text-xs font-bold rounded-full border transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
            triageFilter === "CONFLICTS"
              ? "bg-amber-500 text-white border-amber-500 shadow-xs"
              : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          {language === "hi" ? `विवादित मामले (${conflictCount})` : `Conflict Cases (${conflictCount})`}
        </button>
        <button
          type="button"
          data-testid="triage-evidence-gaps"
          onClick={() => setTriageFilter("EVIDENCE_GAPS")}
          className={`px-3 py-1 text-xs font-bold rounded-full border transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
            triageFilter === "EVIDENCE_GAPS"
              ? "bg-purple-700 text-white border-purple-700 shadow-xs"
              : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          {language === "hi" ? `साक्ष्य अंतराल (${evidenceGapCount})` : `Evidence Gaps (${evidenceGapCount})`}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === "hi" ? "वस्तु, ब्रांड, प्रतिष्ठान या मामला आईडी खोजें..." : "Search commodity, brand, shop, or case ID..."}
            className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B365D] bg-white text-slate-900 placeholder:text-slate-400"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Workflow Status Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-semibold text-slate-600">
              {language === "hi" ? "कार्यप्रवाह:" : "Workflow:"}
            </span>
            <select
              value={selectedWorkflow}
              onChange={(e) => setSelectedWorkflow(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1B365D]"
            >
              <option value="ALL">{language === "hi" ? "सभी कार्यप्रवाह" : "All Workflows"}</option>
              <option value="DRAFT">{language === "hi" ? "प्रारूप (Draft)" : "Draft"}</option>
              <option value="OPEN">{language === "hi" ? "सक्रिय (Open)" : "Open"}</option>
              <option value="PROCESSING">{language === "hi" ? "प्रक्रियाधीन (Processing)" : "Processing"}</option>
              <option value="PENDING_REVIEW">{language === "hi" ? "निर्णय लंबित (Pending)" : "Pending Adjudication"}</option>
              <option value="COMPLETED">{language === "hi" ? "समाप्त (Closed)" : "Closed"}</option>
            </select>
          </div>

          {/* Verdict Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-semibold text-slate-600">
              {language === "hi" ? "निर्णय:" : "Verdict:"}
            </span>
            <select
              value={selectedVerdict}
              onChange={(e) => setSelectedVerdict(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1B365D]"
            >
              <option value="ALL">{language === "hi" ? "सभी निर्णय" : "All Verdicts"}</option>
              <option value="PASS">{language === "hi" ? "उत्तीर्ण (PASS)" : "PASS (Compliant)"}</option>
              <option value="FAIL">{language === "hi" ? "उल्लंघन (FAIL)" : "FAIL (Violations)"}</option>
              <option value="REVIEW">{language === "hi" ? "समीक्षा (REVIEW)" : "REVIEW (Borderline)"}</option>
              <option value="UNABLE_TO_VERIFY">{language === "hi" ? "सत्यापन असमर्थ" : "UNABLE TO VERIFY"}</option>
              <option value="PENDING_REVIEW">{language === "hi" ? "लंबित" : "PENDING"}</option>
            </select>
          </div>

          {/* Sort By Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
              <ArrowUpDown size={12} className="text-[#1B365D]" />
              <span>{language === "hi" ? "क्रमबद्ध:" : "Sort:"}</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as DeskSortOption)}
              className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1B365D] cursor-pointer"
            >
              <option value="DATE_DESC">{language === "hi" ? "नवीनतम पहले (Newest)" : "Date: Newest First"}</option>
              <option value="DATE_ASC">{language === "hi" ? "पुराने पहले (Oldest)" : "Date: Oldest First"}</option>
              <option value="VERDICT_SEV">{language === "hi" ? "उल्लंघन पहले (Violations First)" : "Violations First"}</option>
              <option value="CONF_ASC">{language === "hi" ? "निम्न विश्वास (Low Confidence)" : "Confidence: Low First"}</option>
              <option value="CONF_DESC">{language === "hi" ? "उच्च विश्वास (High Confidence)" : "Confidence: High First"}</option>
              <option value="CASE_ASC">{language === "hi" ? "केस आईडी (A → Z)" : "Case ID: A → Z"}</option>
              <option value="CASE_DESC">{language === "hi" ? "केस आईडी (Z → A)" : "Case ID: Z → A"}</option>
              <option value="PRODUCT_ASC">{language === "hi" ? "उत्पाद नाम (A → Z)" : "Commodity: A → Z"}</option>
              <option value="PRODUCT_DESC">{language === "hi" ? "उत्पाद नाम (Z → A)" : "Commodity: Z → A"}</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <button
            type="button"
            onClick={() => setViewMode(viewMode === "LIST" ? "GRID" : "LIST")}
            className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 hover:text-[#1B365D] hover:border-[#1B365D]/30 transition-all shadow-xs shrink-0 ml-auto md:ml-1 hidden md:flex"
            title={language === "hi" ? (viewMode === "LIST" ? "ग्रिड दृश्य" : "सूची दृश्य") : (viewMode === "LIST" ? "Switch to Grid View" : "Switch to List View")}
          >
            {viewMode === "LIST" ? <LayoutGrid size={16} strokeWidth={2} /> : <List size={16} strokeWidth={2} />}
          </button>

          {(searchTerm || selectedWorkflow !== "ALL" || selectedVerdict !== "ALL" || triageFilter !== "ALL" || sortBy !== "DATE_DESC") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedWorkflow("ALL");
                setSelectedVerdict("ALL");
                setTriageFilter("ALL");
                setSortBy("DATE_DESC");
                setSearchParams({});
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 underline cursor-pointer"
            >
              {language === "hi" ? "फ़िल्टर हटाएं" : "Clear"}
            </button>
          )}
        </div>
      </div>

      {/* Case Register Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredCases.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <img
              src={searchTerm || selectedWorkflow !== "ALL" || selectedVerdict !== "ALL" || triageFilter !== "ALL" ? "/assets/empty-states/empty_search.svg" : "/assets/empty-states/empty_dossiers.svg"}
              alt="No matching inspection cases"
              className="w-32 h-28 mx-auto object-contain"
            />
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {searchTerm || selectedWorkflow !== "ALL" || selectedVerdict !== "ALL" || triageFilter !== "ALL"
                  ? (language === "hi" ? "कोई निरीक्षण मामला आपके फिल्टर से मेल नहीं खाता" : "No inspection cases match your filter")
                  : (language === "hi" ? "कोई भौतिक निरीक्षण मामला पंजीकृत नहीं है" : "No physical inspection cases registered")}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {searchTerm || selectedWorkflow !== "ALL" || selectedVerdict !== "ALL" || triageFilter !== "ALL"
                  ? (language === "hi" ? "फ़िल्टर रीसेट करने या खोज शब्दों को समायोजित करने का प्रयास करें।" : "Try resetting filters or adjusting search keywords.")
                  : (language === "hi" ? "एक नया पैकेज्ड कमोडिटी निरीक्षण पंजीकृत करें या डेमो केस चुनें।" : "Register a new packaged commodity inspection or select a demo case.")}
              </p>
            </div>
            <div className="pt-1">
              <button
                type="button"
                onClick={onNewInspectionClick}
                className="btn-primary text-xs px-4 py-2 inline-flex items-center gap-1.5 shadow-sm"
              >
                <Plus size={14} />
                <span>{language === "hi" ? "नया निरीक्षण पंजीकृत करें" : "Register New Inspection"}</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile View: Top Status Bar with Count & Active Sort */}
            <div className="flex md:hidden bg-slate-50 px-3.5 py-2 border-b border-slate-200 items-center justify-between text-[11px]">
              <span className="text-slate-600 font-bold">
                {language === "hi" ? `${filteredCases.length} मामले प्रदर्शित` : `${filteredCases.length} Cases Listed`}
              </span>
              <span className="text-[#1B365D] font-mono font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {sortBy === "DATE_DESC"
                  ? "↓ Newest"
                  : sortBy === "DATE_ASC"
                  ? "↑ Oldest"
                  : sortBy === "VERDICT_SEV"
                  ? "! Violations"
                  : sortBy === "CONF_ASC"
                  ? "↓ Confidence"
                  : sortBy === "CASE_ASC"
                  ? "A-Z ID"
                  : "Sorted"}
              </span>
            </div>

            {/* Card / Grid View */}
            <div className={viewMode === "GRID" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-slate-50/50" : "block md:hidden divide-y divide-slate-100"}>
              {paginatedCases.map((c) => {
                const conf = getCaseConfidence(c);
                const confPct = Math.min(100, Math.max(0, Math.round(conf * 100)));
                return (
                  <div
                    key={`mobile-${c.id}`}
                    onClick={() => onSelectCase(c.id)}
                    className={`p-3.5 hover:bg-blue-50/50 cursor-pointer space-y-2 transition-colors ${
                      viewMode === "GRID" ? "bg-white border border-slate-200 rounded-xl shadow-xs" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-[#1B365D] truncate">
                        {c.inspection_number}
                      </span>
                      <VerdictBadge verdict={c.overall_status} size="sm" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-xs truncate">
                        {getFormattedProductName(c)}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{c.establishment_name || (language === "hi" ? "खुदरा डिपो" : "Retail Depot")} • {c.location || c.jurisdiction_id}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="text-[10px] text-slate-600 font-semibold">{language === "hi" ? "विश्वसनीयता" : "Confidence"}: {confPct}%</span>
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                        <div
                          className={`h-full rounded-full transition-all ${
                            confPct >= 90 ? "bg-emerald-500" : confPct >= 70 ? "bg-amber-500" : "bg-rose-500"
                          }`}
                          style={{ width: `${confPct}%` }}
                        />
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="font-mono text-[10px] flex items-center gap-1">
                        <CalendarDays className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{formatDateTime(c.created_at)} • {formatInspectionType(c.inspection_type)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCaseToDelete(c);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg transition-all flex items-center justify-center shrink-0 shadow-2xs"
                          title={language === "hi" ? "मामला हटाएं" : "Delete Case"}
                          aria-label={`Delete case ${c.inspection_number}`}
                        >
                          <Trash2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCase(c.id);
                          }}
                          className="px-3 py-1.5 text-xs font-bold text-white bg-[#1B365D] hover:bg-[#0A2540] border border-[#152a48] rounded-lg transition-all cursor-pointer shadow-sm"
                        >
                          {language === "hi" ? "जांचें →" : "Inspect →"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop View: Full Data Table with Workstation Micro-Interactions */}
            <div className={viewMode === "LIST" ? "hidden md:block overflow-x-auto" : "hidden"}>
              <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200 select-none">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => setSortBy(sortBy === "DATE_DESC" ? "DATE_ASC" : "DATE_DESC")}
                    title="Sort by Date"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{language === "hi" ? "केस आईडी / दिनांक" : "Case ID / Date"}</span>
                      {sortBy === "DATE_DESC" ? (
                        <ArrowDown size={13} className="text-[#1B365D]" />
                      ) : sortBy === "DATE_ASC" ? (
                        <ArrowUp size={13} className="text-[#1B365D]" />
                      ) : (
                        <ArrowUpDown size={12} className="text-slate-400" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => setSortBy(sortBy === "PRODUCT_ASC" ? "PRODUCT_DESC" : "PRODUCT_ASC")}
                    title="Sort by Commodity Name"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{language === "hi" ? "वस्तु एवं ब्रांड" : "Commodity & Brand"}</span>
                      {sortBy === "PRODUCT_ASC" ? (
                        <ArrowUp size={13} className="text-[#1B365D]" />
                      ) : sortBy === "PRODUCT_DESC" ? (
                        <ArrowDown size={13} className="text-[#1B365D]" />
                      ) : (
                        <ArrowUpDown size={12} className="text-slate-400" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3">{language === "hi" ? "प्रतिष्ठान / स्थान" : "Establishment / Location"}</th>
                  <th scope="col" className="px-4 py-3">{language === "hi" ? "निरीक्षण प्रकार" : "Inspection Type"}</th>
                  <th
                    scope="col"
                    className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => setSortBy(sortBy === "CONF_ASC" ? "CONF_DESC" : "CONF_ASC")}
                    title="Sort by Confidence"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{language === "hi" ? "विश्वसनीयता" : "Confidence"}</span>
                      {sortBy === "CONF_ASC" ? (
                        <ArrowUp size={13} className="text-[#1B365D]" />
                      ) : sortBy === "CONF_DESC" ? (
                        <ArrowDown size={13} className="text-[#1B365D]" />
                      ) : (
                        <ArrowUpDown size={12} className="text-slate-400" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3">{language === "hi" ? "कार्यप्रवाह" : "Workflow"}</th>
                  <th
                    scope="col"
                    className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => setSortBy(sortBy === "VERDICT_SEV" ? "DATE_DESC" : "VERDICT_SEV")}
                    title="Sort by Verdict Severity"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{language === "hi" ? "अनुपालन निर्णय" : "Compliance Verdict"}</span>
                      {sortBy === "VERDICT_SEV" ? (
                        <ArrowDown size={13} className="text-rose-600" />
                      ) : (
                        <ArrowUpDown size={12} className="text-slate-400" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3 text-right">{language === "hi" ? "कार्रवाई" : "Action"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {paginatedCases.map((c) => {
                  const conf = getCaseConfidence(c);
                  const confPct = Math.min(100, Math.max(0, Math.round(conf * 100)));
                  return (
                    <tr
                      key={c.id}
                      onClick={() => onSelectCase(c.id)}
                      className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                    >
                      {/* Case ID & Date */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-mono font-bold text-[#1B365D] flex items-center gap-1.5">
                          {c.inspection_number}
                          {c.is_mock_fixture && (
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                              DEMO
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                          <CalendarDays className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{formatDateTime(c.created_at)}</span>
                        </div>
                      </td>

                      {/* Commodity & Brand */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900 max-w-xs truncate group-hover:text-[#1B365D] transition-colors" title={getFormattedProductName(c)}>
                          {getFormattedProductName(c)}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                          {c.brand_name || (language === "hi" ? "गैर-ब्रांडेड / सामान्य" : "Unbranded / Generics")}
                        </div>
                      </td>

                      {/* Establishment / Location */}
                      <td className="px-4 py-3.5 text-slate-600">
                        <div className="font-medium text-slate-800 truncate max-w-xs">{c.establishment_name || (language === "hi" ? "खुदरा स्टोर / डिपो" : "Retail Store / Depot")}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">{c.location || c.jurisdiction_id}</div>
                      </td>

                      {/* Inspection Type */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-600">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                          {formatInspectionType(c.inspection_type)}
                        </span>
                      </td>

                      {/* Confidence Score Bar */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-slate-700 w-8 text-right">
                            {confPct}%
                          </span>
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                            <div
                              className={`h-full rounded-full transition-all ${
                                confPct >= 90 ? "bg-emerald-500" : confPct >= 70 ? "bg-amber-500" : "bg-rose-500"
                              }`}
                              style={{ width: `${confPct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Workflow Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {c.workflow_status ? (
                          <WorkflowBadge status={c.workflow_status} size="sm" />
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">{language === "hi" ? "अप्रकाशित" : "N/A"}</span>
                        )}
                      </td>

                      {/* Compliance Verdict */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {c.violations_count && c.violations_count > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertTriangle size={11} className="text-rose-600" />
                            {language === "hi" ? `${c.violations_count} उल्लंघन` : `${c.violations_count} Violations`}
                          </span>
                        ) : (
                          <VerdictBadge verdict={c.overall_status} size="sm" />
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCaseToDelete(c);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg transition-all flex items-center justify-center shrink-0 shadow-2xs"
                            title={language === "hi" ? "मामला स्थायी रूप से हटाएं" : "Permanently Delete Case"}
                            aria-label={`Delete case ${c.inspection_number}`}
                          >
                            <Trash2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectCase(c.id);
                            }}
                            className="px-3 py-1.5 text-xs font-bold text-white bg-[#1B365D] hover:bg-[#0A2540] border border-[#152a48] rounded-lg transition-colors cursor-pointer shadow-sm"
                          >
                            {language === "hi" ? "केस खोलें →" : "Open Case →"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Performance Pagination Controls */}
          {filteredCases.length > 0 && (
            <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span>
                  {language === "hi"
                    ? `कुल ${filteredCases.length} में से ${startIndex + 1}-${endIndex} मामले`
                    : `Showing ${startIndex + 1}-${endIndex} of ${filteredCases.length} cases`}
                </span>
                <span className="text-slate-300">|</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">{language === "hi" ? "प्रति पृष्ठ:" : "Rows per page:"}</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-slate-300 rounded px-1.5 py-0.5 bg-white text-slate-700 text-xs focus:ring-1 focus:ring-[#1B365D] cursor-pointer"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={validCurrentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {language === "hi" ? "← पिछला" : "← Prev"}
                </button>

                <span className="px-2 text-slate-700 font-bold">
                  {validCurrentPage} / {totalPages}
                </span>

                <button
                  type="button"
                  disabled={validCurrentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {language === "hi" ? "अगला →" : "Next →"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
      </div>

      {/* Deletion Confirmation Modal */}
      {caseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-overlay-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-pop-in relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
            <div className="flex items-start gap-3 pt-1">
              <div className="p-2.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-full shrink-0">
                <Trash2 size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === "hi" ? "मामला निरस्त एवं स्थायी निष्कासन" : "Dispose & Permanently Delete Case"}
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {language === "hi"
                    ? "डेटाबेस से यह मामला एवं सभी संबंधित विधिक विवरण पूरी तरह हटा दिए जाएंगे।"
                    : "This inspection case and all related statutory details will be permanently removed from the database sitewide."}
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">{language === "hi" ? "केस संख्या:" : "Case Number:"}</span>
                <span className="font-mono font-bold text-slate-900">{caseToDelete.inspection_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">{language === "hi" ? "उत्पाद / वस्तु:" : "Product / Commodity:"}</span>
                <span className="font-semibold text-slate-900 truncate max-w-[220px]">{caseToDelete.product_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">{language === "hi" ? "दिनांक एवं समय:" : "Date & Time:"}</span>
                <span className="font-mono text-slate-800">{formatDateTime(caseToDelete.created_at)}</span>
              </div>
            </div>

            <p className="text-[11px] text-rose-700 bg-rose-50 p-2.5 rounded border border-rose-200">
              <b>{language === "hi" ? "सांविधिक चेतावनी: " : "Statutory Warning: "}</b>
              {language === "hi"
                ? "यह कार्रवाई पूर्ववत नहीं की जा सकती। सभी साक्ष्य छवियां, बीओयू निर्देशांक, नियम निष्कर्ष एवं नोटिस स्थायी रूप से नष्ट हो जाएंगे।"
                : "This action cannot be undone. All evidence photographs, bounding boxes, rule evaluations, and notice records will be purged."}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={deletingCaseId !== null}
                onClick={() => setCaseToDelete(null)}
                className="btn-secondary text-xs px-4 py-2"
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
                    if (onDeleteCase) {
                      await onDeleteCase(id);
                    } else {
                      await ApiService.deleteInspection(id);
                    }
                    setCaseToDelete(null);
                    onRefresh?.();
                  } catch (err) {
                    console.error("Failed to delete case:", err);
                  } finally {
                    setDeletingCaseId(null);
                  }
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                {deletingCaseId === caseToDelete.id ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{language === "hi" ? "हटाया जा रहा है..." : "Deleting..."}</span>
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
