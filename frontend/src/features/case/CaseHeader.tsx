import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { InspectionCase } from "../../types/inspection";
import { VerdictBadge, WorkflowBadge } from "../../components/common/StatusBadge";
import { ApiService } from "../../services/api";
import { Trash2, Scale } from "lucide-react";

interface CaseHeaderProps {
  caseData: InspectionCase;
  onBack: () => void;
  isProcessing?: boolean;
  onDeleteCase?: () => void;
}

export const CaseHeader: React.FC<CaseHeaderProps> = ({
  caseData,
  onBack,
  isProcessing = false,
  onDeleteCase,
}) => {
  const { language } = useLanguage();
  const isMock = caseData.is_mock_fixture || ApiService.isMockMode();

  return (
    <div className="case-header screen-only no-print bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
      {/* Top Row: Navigation + Statuses */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#1B365D] border border-slate-200 transition-colors focus:outline-none focus:ring-1 focus:ring-[#1B365D] cursor-pointer"
            title={language === "hi" ? "केस पंजी पर वापस जाएं" : "Return to Case Registry"}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>{language === "hi" ? "केस पंजी पर वापस" : "Back to Registry"}</span>
          </button>
          <div className="h-4 w-px bg-slate-200 hidden sm:block" />
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-mono font-bold text-[#1B365D]">
              {caseData.inspection_number}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-[#1B365D] border border-blue-200 shadow-2xs">
              <Scale size={13} className="text-[#1B365D]" />
              <span>{language === "hi" ? "अधिनिर्णय कार्यक्षेत्र" : "Adjudication Workspace"}</span>
            </span>
            {isMock && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold" title="Running in Standalone Demo / Local Mode">
                {language === "hi" ? "डेमो / स्थानीय मोड" : "DEMO / LOCAL MODE"}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <WorkflowBadge status={isProcessing ? "PROCESSING" : (caseData.workflow_status || "OPEN")} />
          {caseData.evidence_assets.length === 0 && !caseData.overall_status && !caseData.ai_verdict ? (
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200 font-medium">
              {language === "hi" ? "[साक्ष्य अपेक्षित]" : "[AWAITING EVIDENCE]"}
            </span>
          ) : (
            <VerdictBadge verdict={caseData.overall_status || caseData.ai_verdict || "PENDING"} />
          )}
          {onDeleteCase && (
            <button
              type="button"
              onClick={onDeleteCase}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-slate-500 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all shadow-2xs focus:outline-none focus:ring-1 focus:ring-rose-500 ml-1 cursor-pointer"
              title={language === "hi" ? "मामला स्थायी रूप से हटाएं" : "Permanently Dispose & Delete Case"}
              aria-label="Dispose and delete case"
            >
              <Trash2 size={13} />
              <span>{language === "hi" ? "केस हटाएं" : "Dispose Case"}</span>
            </button>
          )}
        </div>
      </div>



      {/* Details Row: Commodity, Trader, Registration Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            {language === "hi" ? "पैकेज्ड वस्तु" : "Packaged Commodity"}
          </span>
          <div className="font-bold text-slate-900 truncate" title={caseData.product_name}>
            {caseData.product_name}
          </div>
          <div className="text-xs text-slate-500">
            {language === "hi" ? "ब्रांड:" : "Brand:"} <span className="font-semibold text-slate-800">{caseData.brand_name || (language === "hi" ? "गैर-ब्रांडेड / सामान्य" : "Unbranded / Generics")}</span>
          </div>
        </div>

        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            {language === "hi" ? "प्रतिष्ठान / परिसर" : "Establishment / Premises"}
          </span>
          <div className="font-semibold text-slate-900 truncate" title={caseData.establishment_name || "Field Seizure"}>
            {caseData.establishment_name || (language === "hi" ? "क्षेत्र जब्ती / खुदरा दुकान" : "Field Seizure / Retail Store")}
          </div>
          <div className="text-xs text-slate-500 truncate font-medium">
            {caseData.premises_address || (language === "hi" ? "क्षेत्रीय अभियान में दर्ज परिसर" : "Premises recorded during field drive")}
          </div>
        </div>

        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            {language === "hi" ? "श्रेणी एवं ज्यामिति" : "Category & Geometry"}
          </span>
          <div className="font-semibold text-slate-900">
            {caseData.category}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            {language === "hi" ? "आकार:" : "Shape:"} <span className="font-mono text-slate-800 font-semibold">{caseData.package_type}</span>
          </div>
        </div>

        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            {language === "hi" ? "अधिकार क्षेत्र एवं दिनांक" : "Jurisdiction & Date"}
          </span>
          <div className="font-mono text-slate-900 font-semibold">
            {caseData.jurisdiction_id}
          </div>
          <div className="text-xs text-slate-500 font-mono">
            {new Date(caseData.created_at).toLocaleString(language === "hi" ? "hi-IN" : "en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
