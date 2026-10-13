import React, { useState } from "react";
import { ArrowRight, CalendarDays, MapPin, AlertTriangle, CheckCircle2, XCircle, Trash2, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { VerdictBadge } from "../common/StatusBadge";
import { EpistemicVerdict } from "../../types/inspection";
import { ApiService } from "../../services/api";

export interface InspectionTableItem {
  id: string;
  caseNumber: string;
  productName: string;
  category?: string;
  manufacturer?: string;
  packSize?: string;
  batchNumber?: string;
  mrp?: string;
  location: string;
  createdAt: string;
  status: EpistemicVerdict | string;
  overallConfidence: number;
  hasConflicts?: boolean;
}

interface InspectionTableProps {
  inspections: InspectionTableItem[];
  className?: string;
  isLoading?: boolean;
  onDelete?: (id: string) => void | Promise<void>;
}

export const InspectionTable: React.FC<InspectionTableProps> = ({ inspections, className = "", isLoading = false, onDelete }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [caseToDelete, setCaseToDelete] = useState<InspectionTableItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDateTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
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

  const formatDate = formatDateTime;

  return (
    <div className={`overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs ${className}`}>
      <div className="overflow-x-auto custom-scrollbar relative max-h-[600px]">
        <table className="w-full min-w-[850px] text-left border-collapse">
          <thead className="border-b border-slate-200 bg-slate-50 sticky top-0 z-20 backdrop-blur-md">
            <tr>
              <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-600 sticky left-0 bg-slate-50 z-10 shadow-[1px_0_0_rgba(226,232,240,1)]">
                {language === "hi" ? "प्रकरण एवं वस्तु" : "Case & Commodity"}
              </th>
              <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                {language === "hi" ? "निरीक्षण स्थल" : "Inspection Location"}
              </th>
              <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                {language === "hi" ? "तिथि एवं समय" : "Date & Time"}
              </th>
              <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                {language === "hi" ? "विश्वसनीयता" : "Confidence"}
              </th>
              <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                {language === "hi" ? "सांविधिक स्थिति" : "Statutory Status"}
              </th>
              <th className="px-5 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 relative">
            {isLoading && (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-5 py-4 sticky left-0 bg-white z-10 shadow-[1px_0_0_rgba(226,232,240,1)]">
                    <div className="h-4 bg-slate-200 rounded skeleton w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded skeleton w-1/2"></div>
                  </td>
                  <td className="px-5 py-4"><div className="h-4 bg-slate-200 rounded skeleton w-full"></div></td>
                  <td className="px-5 py-4"><div className="h-4 bg-slate-200 rounded skeleton w-24"></div></td>
                  <td className="px-5 py-4"><div className="h-4 bg-slate-200 rounded skeleton w-16"></div></td>
                  <td className="px-5 py-4"><div className="h-6 bg-slate-200 rounded-full skeleton w-20"></div></td>
                  <td className="px-5 py-4 text-right"><div className="h-6 bg-slate-200 rounded skeleton w-8 ml-auto"></div></td>
                </tr>
              ))
            )}
            {!isLoading && inspections.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-500 font-medium text-xs">
                  {language === "hi" ? "कोई निरीक्षण मामले उपलब्ध नहीं।" : "No inspection cases found."}
                </td>
              </tr>
            )}
            {inspections.map((item) => {
              const confPct = Math.round(
                item.overallConfidence > 1 ? item.overallConfidence : item.overallConfidence * 100
              );

              // Map status to 4-state EpistemicVerdict
              let verdict: EpistemicVerdict = "PASS";
              if (item.status === "FAIL" || item.status === "FAILED") verdict = "FAIL";
              else if (item.status === "REVIEW" || item.status === "MANUAL_REVIEW_REQUIRED") verdict = "REVIEW";
              else if (item.status === "UNABLE_TO_VERIFY" || item.status === "INSUFFICIENT_EVIDENCE") verdict = "UNABLE_TO_VERIFY";

              return (
                <tr
                  key={item.id}
                  onClick={() => navigate(`/inspections/${item.id}`)}
                  className="group hover:bg-blue-50/50 transition-all duration-200 cursor-pointer"
                >
                  <td className="px-5 py-3.5 sticky left-0 bg-white group-hover:bg-blue-50/50 z-10 transition-colors shadow-[1px_0_0_rgba(226,232,240,1)]">
                    <div className="flex items-start gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-xs text-slate-900 group-hover:text-[#1B365D] transition-colors">
                            {item.productName}
                          </p>
                          {item.hasConflicts && (
                            <span className="inline-flex items-center gap-0.5 rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 border border-amber-200">
                              <AlertTriangle size={10} />
                              {language === "hi" ? "विसंगति" : "CONFLICT"}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-[11px] font-mono text-slate-500">{item.caseNumber}</p>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {item.packSize || (language === "hi" ? "पैक" : "Pack")} · {language === "hi" ? "बैच" : "Batch"}{" "}
                          {item.batchNumber || (language === "hi" ? "लागू नहीं" : "N/A")} · {item.mrp || ""}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                      <MapPin size={13} className="text-slate-400 shrink-0" />
                      <span className="truncate max-w-[200px]" title={item.location}>
                        {item.location}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 tabular-nums font-medium">
                      <CalendarDays size={13} className="text-slate-400 shrink-0" />
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="w-24">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-700">
                        <span className="tabular-nums">{confPct}%</span>
                        <span className="text-[9px] font-medium text-slate-400">
                          {language === "hi" ? "सेंसर" : "sensor"}
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${
                            confPct >= 90
                              ? "bg-emerald-500"
                              : confPct >= 75
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                          style={{ width: `${confPct}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <VerdictBadge verdict={verdict} size="sm" />
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCaseToDelete(item);
                        }}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors btn-press"
                        title={language === "hi" ? "मामला डेटाबेस से हटाएं" : "Dispose & Delete Case from Database"}
                        aria-label={`Delete case ${item.caseNumber}`}
                      >
                        <Trash2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/inspections/${item.id}`);
                        }}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-[#1B365D] transition-colors btn-press"
                        title={language === "hi" ? "निरीक्षण प्रकरण खोलें" : "Open Inspection Case"}
                      >
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Deletion Confirmation Modal */}
      {caseToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-overlay-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 text-left animate-pop-in">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-full shrink-0 border border-rose-100">
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

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">{language === "hi" ? "केस संख्या:" : "Case Number:"}</span>
                <span className="font-mono font-bold text-slate-900">{caseToDelete.caseNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{language === "hi" ? "उत्पाद / वस्तु:" : "Product / Commodity:"}</span>
                <span className="font-semibold text-slate-900 truncate max-w-[220px]">{caseToDelete.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{language === "hi" ? "दिनांक एवं समय:" : "Date & Time:"}</span>
                <span className="font-mono text-slate-800">{formatDateTime(caseToDelete.createdAt)}</span>
              </div>
            </div>

            <p className="text-[11px] text-rose-700 bg-rose-50 p-2.5 rounded border border-rose-200">
              <b>{language === "hi" ? "सांविधिक चेतावनी: " : "Statutory Warning: "}</b>
              {language === "hi"
                ? "यह कार्रवाई पूर्ववत नहीं की जा सकती। सभी साक्ष्य छवियां, नियम निष्कर्ष एवं नोटिस स्थायी रूप से नष्ट हो जाएंगे। धारा 63 बीएसए 2023 के तहत ऑडिट बहीखाते में एक 'CASE_DISPOSED' इवेंट दर्ज किया जाएगा।"
                : "This action cannot be undone. All evidence photographs, rule evaluations, and notice records will be purged. A 'CASE_DISPOSED' audit event will be recorded under Section 63 BSA 2023."}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setCaseToDelete(null)}
                className="btn-secondary text-xs px-4 py-2"
              >
                {language === "hi" ? "रद्द करें" : "Cancel"}
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={async () => {
                  const id = caseToDelete.id;
                  setIsDeleting(true);
                  try {
                    if (onDelete) {
                      await onDelete(id);
                    } else {
                      await ApiService.deleteInspection(id);
                    }
                    setCaseToDelete(null);
                  } catch (err: any) {
                    alert(err?.message || "Failed to delete case from database");
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
              >
                {isDeleting ? (
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

export default InspectionTable;
