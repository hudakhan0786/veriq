import React, { useRef } from "react";
import {
  Camera,
  Sun,
  Maximize2,
  FileText,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  X,
  Image as ImageIcon,
  RefreshCw,
  Trash2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { StateEmblem } from "../common/StateEmblem";

export interface PipelineStageInfo {
  id: string;
  stageNumber: number;
  labelEn: string;
  labelHi: string;
  descEn: string;
  descHi: string;
  status: "pending" | "running" | "completed" | "failed";
  metrics?: string;
  failureReason?: string;
}

export interface StatutoryPipelineModalProps {
  isOpen: boolean;
  currentStage: number; // 1 to 6
  stages: PipelineStageInfo[];
  language?: "en" | "hi";
  onDismissFailure?: () => void;
  onProceed?: () => void;
  allCompleted?: boolean;
  failed?: boolean;
  productName?: string;
  files?: File[];
  filePreviews?: string[];
  activeUploadIndex?: number | null;
  completedUploads?: Set<number>;
  rejectedFiles?: Map<number, string>;
  uploadProgressMessage?: string | null;
  onRemoveBadFile?: (index: number) => void;
  onReplaceBadFile?: (index: number, newFile: File) => void;
  onRemoveAndContinue?: (index: number) => void;
  onRemoveAllBadAndContinue?: () => void;
  onRetry?: () => void;
  countdownSeconds?: number | null;
  onPauseCountdown?: () => void;
}

export const StatutoryPipelineModal: React.FC<StatutoryPipelineModalProps> = ({
  isOpen,
  currentStage,
  stages,
  language = "en",
  onDismissFailure,
  onProceed,
  allCompleted = false,
  failed = false,
  productName,
  files = [],
  filePreviews = [],
  activeUploadIndex = null,
  completedUploads = new Set(),
  rejectedFiles = new Map(),
  uploadProgressMessage,
  onRemoveBadFile,
  onReplaceBadFile,
  onRemoveAndContinue,
  onRemoveAllBadAndContinue,
  onRetry,
  countdownSeconds = null,
  onPauseCountdown,
}) => {
  if (!isOpen) return null;

  const replaceInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const totalFiles = files.length;
  const rejectedCount = rejectedFiles ? rejectedFiles.size : 0;
  const validFilesCount = Math.max(0, totalFiles - rejectedCount);
  const completedCount = completedUploads ? completedUploads.size : 0;
  const progressPercent = totalFiles > 0
    ? Math.min(100, Math.round(((completedCount + (activeUploadIndex !== null ? 0.5 : 0)) / totalFiles) * 100))
    : 0;

  const hasRejectedFiles = rejectedCount > 0;
  const canContinueWithRemaining = validFilesCount > 0 && hasRejectedFiles;

  const getStageIcon = (id: string, status: PipelineStageInfo["status"]) => {
    if (status === "completed") {
      return <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />;
    }
    if (status === "failed") {
      return <AlertCircle size={18} className="text-rose-500 shrink-0" />;
    }
    if (status === "running") {
      return <Loader2 size={18} className="text-blue-500 animate-spin shrink-0" />;
    }

    switch (id) {
      case "capture":
        return <Camera size={16} className="text-slate-400 shrink-0" />;
      case "quality":
        return <Sun size={16} className="text-slate-400 shrink-0" />;
      case "calibration":
        return <Maximize2 size={16} className="text-slate-400 shrink-0" />;
      case "ocr":
        return <FileText size={16} className="text-slate-400 shrink-0" />;
      case "rules":
        return <Sparkles size={16} className="text-slate-400 shrink-0" />;
      case "review":
        return <ShieldCheck size={16} className="text-slate-400 shrink-0" />;
      default:
        return <ShieldCheck size={16} className="text-slate-400 shrink-0" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* National Identity Header Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

        {/* Modal Header */}
        <div className="bg-[#1B365D] text-white p-5 flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-start gap-3">
            <StateEmblem size={36} tone="white" showMotto={false} className="shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider bg-white/15 px-2 py-0.5 rounded text-amber-300 font-bold border border-white/20">
                  {language === "hi" ? "विधिक मापविज्ञान प्रभाग" : "Legal Metrology Division"}
                </span>
                <span className="text-xs text-blue-200">•</span>
                <span className="text-xs text-blue-200 font-medium">
                  {language === "hi" ? "धारा 15 प्रवर्तन पाइपलाइन" : "Section 15 Enforcement Pipeline"}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold mt-1 text-white">
                {language === "hi"
                  ? "सांविधिक विश्लेषण पाइपलाइन निष्पादन"
                  : "Statutory Inspection Pipeline Execution"}
              </h3>
              {productName && (
                <p className="text-xs text-blue-200 mt-0.5 line-clamp-1 font-medium">
                  {language === "hi" ? "वस्तु:" : "Commodity:"} {productName}
                </p>
              )}
            </div>
          </div>

          {(failed || allCompleted) && onDismissFailure && (
            <button
              type="button"
              onClick={onDismissFailure}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title={language === "hi" ? "बंद करें" : "Dismiss"}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* 1. Live Evidence Acquisition & Hashing Progress Strip */}
          {totalFiles > 0 && (
            <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-md space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="relative flex items-center justify-center">
                    <span className={`animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full ${failed ? "bg-rose-400" : allCompleted ? "bg-emerald-400" : "bg-blue-400"} opacity-75`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${failed ? "bg-rose-500" : allCompleted ? "bg-emerald-500" : "bg-blue-500"}`}></span>
                  </div>
                  <span className="font-bold text-slate-100">
                    {language === "hi"
                      ? "साक्ष्य अधिग्रहण एवं SHA-256 हैशिंग स्ट्रीम"
                      : "Evidence Ingestion & SHA-256 Hashing Stream"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-amber-300">
                    {completedCount}/{totalFiles} {language === "hi" ? "तस्वीरें सील" : "Images Sealed"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">({progressPercent}%)</span>
                </div>
              </div>

              {/* Dynamic Animated Progress Bar */}
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden relative">
                <div
                  className={`h-full transition-all duration-300 relative ${
                    failed
                      ? "bg-rose-500"
                      : allCompleted
                      ? "bg-emerald-500"
                      : "bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400"
                  }`}
                  style={{ width: `${Math.max(5, progressPercent)}%` }}
                >
                  {!failed && !allCompleted && (
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  )}
                </div>
              </div>

              {/* Active Sub-Status Message */}
              {uploadProgressMessage && !failed && (
                <div className="flex items-center gap-1.5 text-[11px] text-blue-200 font-mono">
                  <Loader2 size={12} className="animate-spin text-blue-400 shrink-0" />
                  <span className="truncate">{uploadProgressMessage}</span>
                </div>
              )}

              {/* Live Image Thumbnail Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {files.map((file, idx) => {
                  const isCurrent = activeUploadIndex === idx;
                  const isDone = completedUploads.has(idx);
                  const isRej = rejectedFiles.has(idx);
                  const preview = filePreviews[idx];
                  const panelLabel =
                    idx === 0
                      ? (language === "hi" ? "मुख्य प्रदर्शन फलक (PDP)" : "PDP (Front Panel)")
                      : idx === 1
                      ? (language === "hi" ? "पृष्ठ फलक (Back Panel)" : "Back Panel")
                      : (language === "hi" ? "पार्श्व फलक (Side Panel)" : "Side Panel");

                  return (
                    <div
                      key={`${file.name}-${idx}`}
                      className={`p-2 rounded-lg border flex items-center gap-2.5 transition-all text-xs ${
                        isRej
                          ? "bg-rose-950/60 border-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]"
                          : isCurrent
                          ? "bg-blue-950/70 border-blue-400 ring-1 ring-blue-400 shadow-sm"
                          : isDone
                          ? "bg-emerald-950/40 border-emerald-500/70"
                          : "bg-slate-800/60 border-slate-700/60 opacity-60"
                      }`}
                    >
                      <div className="relative shrink-0 w-12 h-12 rounded-md overflow-hidden bg-slate-800 border border-white/10 flex items-center justify-center">
                        {preview ? (
                          <img
                            src={preview}
                            alt={file.name}
                            className={`w-full h-full object-cover ${isCurrent ? "brightness-110" : ""}`}
                          />
                        ) : (
                          <ImageIcon size={18} className="text-slate-400" />
                        )}
                        {isDone && !isRej && (
                          <div className="absolute inset-0 bg-emerald-950/50 flex items-center justify-center">
                            <CheckCircle2 size={16} className="text-emerald-400 drop-shadow-md" />
                          </div>
                        )}
                        {isRej && (
                          <div className="absolute inset-0 bg-rose-950/70 flex items-center justify-center">
                            <AlertCircle size={18} className="text-rose-400 drop-shadow-md" />
                          </div>
                        )}
                        {isCurrent && !isDone && !isRej && (
                          <div className="absolute inset-0 bg-blue-950/40 flex items-center justify-center">
                            <Loader2 size={16} className="text-blue-300 animate-spin" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-white text-[11px] truncate" title={file.name}>
                            {file.name}
                          </span>
                          <span className="text-[9px] font-mono text-slate-400 shrink-0">
                            {file.size >= 1024 * 1024
                              ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                              : `${Math.round(file.size / 1024)} KB`}
                          </span>
                        </div>
                        <div className="text-[10px] text-blue-200/80 mt-0.5 truncate">{panelLabel}</div>
                        <div className="flex items-center gap-1 mt-1 text-[10px]">
                          {isDone && !isRej ? (
                            <span className="text-emerald-300 font-mono font-semibold flex items-center gap-1">
                              <CheckCircle2 size={10} />
                              <span>{language === "hi" ? "SHA-256 सील" : "SHA-256 Sealed"}</span>
                            </span>
                          ) : isRej ? (
                            <span className="text-rose-300 font-bold flex items-center gap-1">
                              <AlertCircle size={10} />
                              <span>{language === "hi" ? "अस्वीकृत (अस्पष्ट)" : "Quality Rejected"}</span>
                            </span>
                          ) : isCurrent ? (
                            <span className="text-blue-300 font-mono font-semibold flex items-center gap-1 animate-pulse">
                              <Loader2 size={10} className="animate-spin" />
                              <span>{language === "hi" ? "हैशिंग जारी..." : "Hashing & Upload..."}</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 font-mono flex items-center gap-1">
                              <Clock size={10} />
                              <span>{language === "hi" ? "प्रतीक्षारत" : "Queued"}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Prominent Optical Quality Gate Rejection Card & Actions */}
          {failed && hasRejectedFiles && (
            <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-300 shadow-sm space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-lg bg-rose-100 text-rose-700 shrink-0 mt-0.5">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-rose-950">
                    {language === "hi"
                      ? "सांविधिक गुणवत्ता द्वार अस्वीकृति (धारा 63 बीएसए 2023)"
                      : "Statutory Quality Gate Rejection (Section 63 BSA 2023)"}
                  </h4>
                  <p className="text-[11px] text-rose-800 mt-0.5 leading-relaxed">
                    {language === "hi"
                      ? "अपलोड की गई पैकेजिंग छवि स्पष्टता या प्रकाश मानकों को पूरा नहीं करती। कृपया नीचे दिए गए विकल्पों से फोटो बदलें अथवा हटाकर जारी रखें।"
                      : "The uploaded photograph failed statutory optical quality checks (blur/glare/illumination). Please replace with a sharp photo or continue with remaining valid photos."}
                  </p>
                </div>
              </div>

              {/* List of Rejected Files with Thumbnails and Direct Actions */}
              {Array.from(rejectedFiles.entries()).map(([rejIdx, rejReason]) => {
                const rejFile = files[rejIdx];
                const rejPreview = filePreviews[rejIdx];

                return (
                  <div
                    key={`rej-card-${rejIdx}`}
                    className="p-3 bg-white rounded-xl border border-rose-200 shadow-2xs space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 border-rose-400 bg-slate-100 shadow-xs">
                        {rejPreview ? (
                          <img
                            src={rejPreview}
                            alt={rejFile?.name || "Rejected Evidence"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ImageIcon size={24} />
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-rose-900/90 text-white text-[9px] font-bold text-center py-0.5 uppercase tracking-wider">
                          {language === "hi" ? "अस्पष्ट" : "Blurry"}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {rejFile?.name || `Image #${rejIdx + 1}`}
                          </p>
                          {rejFile && (
                            <span className="text-[10px] font-mono text-slate-500 shrink-0">
                              {rejFile.size >= 1024 * 1024
                                ? `${(rejFile.size / (1024 * 1024)).toFixed(1)} MB`
                                : `${Math.round(rejFile.size / 1024)} KB`}
                            </span>
                          )}
                        </div>

                        {/* Rejection Statutory Reason */}
                        <div className="mt-1 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-[11px] font-medium leading-relaxed">
                          <span className="font-bold text-rose-950">
                            {language === "hi" ? "अस्वीकृति कारण:" : "Rejection Reason:"}
                          </span>{" "}
                          {rejReason}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons inside card */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
                      {/* Action A: Replace with fresh photo */}
                      <button
                        type="button"
                        onClick={() => replaceInputRefs.current[rejIdx]?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1B365D] hover:bg-[#132742] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                      >
                        <RefreshCw size={13} />
                        <span>{language === "hi" ? "स्पष्ट फोटो से बदलें" : "Replace with Clear Photo"}</span>
                      </button>
                      <input
                        ref={(el) => {
                          replaceInputRefs.current[rejIdx] = el;
                        }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0] && onReplaceBadFile) {
                            const newFile = e.target.files[0];
                            e.target.value = "";
                            onReplaceBadFile(rejIdx, newFile);
                          }
                        }}
                      />

                      {/* Action B: Remove bad image and continue with remaining */}
                      {canContinueWithRemaining && (onRemoveAllBadAndContinue || onRemoveAndContinue) && (
                        <button
                          type="button"
                          onClick={() => {
                            if (onRemoveAllBadAndContinue) {
                              onRemoveAllBadAndContinue();
                            } else if (onRemoveAndContinue) {
                              onRemoveAndContinue(rejIdx);
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                        >
                          <ArrowRight size={13} />
                          <span>
                            {language === "hi"
                              ? (rejectedCount > 1
                                  ? `सभी खराब फोटो हटाएं एवं शेष (${validFilesCount}) से जारी रखें`
                                  : `खराब फोटो हटाएं और शेष (${validFilesCount}) से जारी रखें`)
                              : (rejectedCount > 1
                                  ? `Remove All Bad Photos & Continue with Remaining (${validFilesCount})`
                                  : `Remove Bad Photo & Continue with Remaining (${validFilesCount})`)}
                          </span>
                        </button>
                      )}

                      {/* Action C: Remove bad image only */}
                      {onRemoveBadFile && (
                        <button
                          type="button"
                          onClick={() => onRemoveBadFile(rejIdx)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-700 bg-slate-100 hover:bg-rose-100 hover:text-rose-700 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                          <span>{language === "hi" ? "फोटो हटाएं" : "Remove Photo"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 3. Statutory Pipeline Stages List (6 Stages) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {language === "hi" ? "सांविधिक चरण अनुक्रम (1 से 6):" : "Statutory Stage Sequence (1 to 6):"}
            </h4>

            {stages.map((st) => {
              const isCurrent = st.status === "running";
              const isDone = st.status === "completed";
              const isFailed = st.status === "failed";

              return (
                <div
                  key={st.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isCurrent
                      ? "bg-blue-50/80 border-blue-300 shadow-xs"
                      : isDone
                      ? "bg-emerald-50/50 border-emerald-200/80"
                      : isFailed
                      ? "bg-rose-50 border-rose-300 shadow-xs"
                      : "bg-slate-50/60 border-slate-200 opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getStageIcon(st.id, st.status)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                            {language === "hi" ? `चरण ${st.stageNumber}` : `Stage ${st.stageNumber}`}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                            {language === "hi" ? st.labelHi : st.labelEn}
                          </h4>
                        </div>

                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                            isDone
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : isFailed
                              ? "bg-rose-100 text-rose-800 border-rose-300"
                              : isCurrent
                              ? "bg-blue-100 text-blue-800 border-blue-300 animate-pulse"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {isDone
                            ? language === "hi" ? "सत्यापित" : "Passed"
                            : isFailed
                            ? language === "hi" ? "अस्वीकृत" : "Rejected"
                            : isCurrent
                            ? language === "hi" ? "विश्लेषण जारी" : "Analyzing"
                            : language === "hi" ? "प्रतीक्षारत" : "Pending"}
                        </span>
                      </div>

                      <p className="text-[11.5px] text-slate-600 mt-1 leading-relaxed">
                        {language === "hi" ? st.descHi : st.descEn}
                      </p>

                      {st.metrics && (
                        <div className="mt-2 text-[11px] font-mono bg-white border border-slate-200 rounded-md px-2.5 py-1 text-slate-700 flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-[#1B365D]">
                            {language === "hi" ? "माप विवरण:" : "Metrics:"}
                          </span>
                          <span>{st.metrics}</span>
                        </div>
                      )}

                      {isFailed && st.failureReason && (
                        <div className="mt-2 text-xs font-semibold bg-rose-100/80 border border-rose-300 text-rose-900 rounded-lg p-2.5 space-y-1">
                          <div className="font-bold text-rose-950 flex items-center gap-1.5">
                            <AlertCircle size={14} className="text-rose-600 shrink-0" />
                            <span>
                              {language === "hi" ? "सांविधिक गुणवत्ता अस्वीकृति:" : "Statutory Quality Rejection:"}
                            </span>
                          </div>
                          <p className="text-[11.5px] font-normal leading-relaxed text-rose-900">
                            {st.failureReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-600 flex items-center gap-2">
            {failed ? (
              <span className="text-rose-700 font-bold flex items-center gap-1.5">
                <AlertCircle size={15} />
                <span>
                  {language === "hi"
                    ? "छवि गुणवत्ता अस्वीकृत। कृपया स्पष्ट फोटो बदलें अथवा हटाकर जारी रखें।"
                    : "Image failed statutory quality gate. Replace photo or continue with valid photos."}
                </span>
              </span>
            ) : allCompleted ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                <CheckCircle2 size={15} />
                <span>
                  {language === "hi"
                    ? "सभी 6 चरण 100% सत्यापित। अधिनिर्णय हेतु तैयार।"
                    : "All 6 stages verified successfully. Ready for officer adjudication."}
                </span>
              </span>
            ) : (
              <span className="text-blue-800 font-medium flex items-center gap-1.5">
                <Loader2 size={15} className="animate-spin text-blue-600" />
                <span>
                  {language === "hi"
                    ? `चरण ${currentStage}/6 विश्लेषित हो रहा है...`
                    : `Processing Stage ${currentStage}/6...`}
                </span>
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            {/* If failed and remaining valid images exist: Provide fast continue button in footer */}
            {failed && canContinueWithRemaining && (onRemoveAllBadAndContinue || onRemoveAndContinue) && (
              <button
                type="button"
                onClick={() => {
                  if (onRemoveAllBadAndContinue) {
                    onRemoveAllBadAndContinue();
                  } else {
                    const firstBadIdx = Array.from(rejectedFiles.keys())[0];
                    if (firstBadIdx !== undefined && onRemoveAndContinue) {
                      onRemoveAndContinue(firstBadIdx);
                    }
                  }
                }}
                className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>
                  {language === "hi"
                    ? (rejectedCount > 1
                        ? `खराब फोटो हटाएं एवं जारी रखें (${validFilesCount})`
                        : `खराब फोटो हटाएं और शेष (${validFilesCount}) से जारी रखें`)
                    : (rejectedCount > 1
                        ? `Remove Bad Photos & Continue (${validFilesCount})`
                        : `Remove Bad Photo & Continue (${validFilesCount})`)}
                </span>
                <ArrowRight size={14} />
              </button>
            )}

            {/* If failed and bad photos were removed so 0 rejected remain, but totalFiles > 0: Allow Resuming */}
            {failed && !hasRejectedFiles && totalFiles > 0 && onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw size={13} />
                <span>
                  {language === "hi"
                    ? `शेष (${totalFiles}) फोटो के साथ पाइपलाइन पुनः चलाएं`
                    : `Resume Pipeline with Remaining (${totalFiles})`}
                </span>
              </button>
            )}

            {/* If failed and ALL uploaded images were rejected (validFilesCount === 0): Allow 1-click Replace */}
            {failed && validFilesCount === 0 && hasRejectedFiles && (
              <button
                type="button"
                onClick={() => {
                  const firstBad = Array.from(rejectedFiles.keys())[0];
                  if (firstBad !== undefined && replaceInputRefs.current[firstBad]) {
                    replaceInputRefs.current[firstBad]?.click();
                  }
                }}
                className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-white bg-[#1B365D] hover:bg-[#132742] rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw size={13} />
                <span>
                  {language === "hi" ? "स्पष्ट फोटो से बदलें" : "Replace Photo to Continue"}
                </span>
              </button>
            )}

            {failed && onDismissFailure && (
              <button
                type="button"
                onClick={onDismissFailure}
                className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                {language === "hi" ? "फॉर्म पर वापस जाएं" : "Return to Intake Form"}
              </button>
            )}

            {allCompleted && onProceed && (
              <div className="flex items-center gap-2">
                {onDismissFailure && (
                  <button
                    type="button"
                    onClick={onDismissFailure}
                    className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                  >
                    {language === "hi" ? "नियम 6 फ़ील्ड जांचें" : "Review Rule 6 fields"}
                  </button>
                )}
                {countdownSeconds !== null && countdownSeconds !== undefined && countdownSeconds > 0 && onPauseCountdown && (
                  <button
                    type="button"
                    onClick={onPauseCountdown}
                    className="px-2.5 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-300/80 rounded-lg transition-colors cursor-pointer"
                    title={language === "hi" ? "स्वतः-नेविगेशन रोकें" : "Pause auto-navigation"}
                  >
                    {language === "hi" ? "रोकें (Pause)" : "Pause Auto-Open"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={onProceed}
                  className="w-full sm:w-auto px-5 py-2 text-xs font-bold text-white bg-[#1B365D] hover:bg-[#132742] rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>
                    {language === "hi"
                      ? (countdownSeconds !== null && countdownSeconds !== undefined && countdownSeconds > 0
                          ? `अधिनिर्णय कैनवास खोलें (${countdownSeconds}s में स्वतः...)`
                          : "अधिनिर्णय कैनवास खोलें")
                      : (countdownSeconds !== null && countdownSeconds !== undefined && countdownSeconds > 0
                          ? `Open Adjudication Canvas (${countdownSeconds}s...)`
                          : "Open Adjudication Canvas")}
                  </span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

