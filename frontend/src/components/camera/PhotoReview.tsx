import React, { useState } from "react";
import {
  Check,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileCheck,
  ShieldCheck,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Plus,
} from "lucide-react";
import { CapturedPhoto } from "./useCameraStream";
import { useLanguage } from "../../context/LanguageContext";

interface PhotoReviewProps {
  photo?: CapturedPhoto;
  photos?: CapturedPhoto[];
  currentIndex?: number;
  onSelectIndex?: (index: number) => void;
  onDeletePhoto?: (index: number) => void;
  onAddMorePhotos?: () => void;
  onRetake?: () => void;
  onAccept?: (photo: CapturedPhoto) => void;
  onAcceptAll?: (photos: CapturedPhoto[]) => void;
  isSubmitting?: boolean;
}

export const PhotoReview: React.FC<PhotoReviewProps> = ({
  photo,
  photos = [],
  currentIndex = 0,
  onSelectIndex,
  onDeletePhoto,
  onAddMorePhotos,
  onRetake,
  onAccept,
  onAcceptAll,
  isSubmitting = false,
}) => {
  const { language } = useLanguage();
  const [isZoomed, setIsZoomed] = useState(false);
  const [localIndex, setLocalIndex] = useState(currentIndex);

  // Normalize photo list
  const photoList = photos.length > 0 ? photos : photo ? [photo] : [];
  const activeIndex = Math.min(localIndex, Math.max(0, photoList.length - 1));
  const currentActivePhoto = photoList[activeIndex];

  const handleSelect = (idx: number) => {
    setLocalIndex(idx);
    if (onSelectIndex) onSelectIndex(idx);
    setIsZoomed(false);
  };

  const handleNext = () => {
    if (activeIndex < photoList.length - 1) {
      handleSelect(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      handleSelect(activeIndex - 1);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (!currentActivePhoto) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-950 text-white p-6">
        <p className="text-sm text-slate-400 mb-4">
          {language === "hi" ? "कोई फोटो उपलब्ध नहीं है।" : "No photos available to review."}
        </p>
        {onAddMorePhotos && (
          <button
            type="button"
            onClick={onAddMorePhotos}
            className="px-4 py-2 bg-govNavy text-white rounded-xl text-xs font-bold"
          >
            {language === "hi" ? "कैमरा खोलें" : "Open Camera"}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white select-none">
      {/* 1. Top Review Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-xs font-bold text-slate-200">
            {language === "hi" ? "निरीक्षण साक्ष्य समीक्षा" : "Inspection Evidence Review"}
            {photoList.length > 1 && ` (${activeIndex + 1}/${photoList.length})`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Delete active photo if more than 1 photo or onDeletePhoto passed */}
          {onDeletePhoto && (
            <button
              type="button"
              onClick={() => onDeletePhoto(activeIndex)}
              className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/50 transition-colors"
              title={language === "hi" ? "यह फोटो हटाएं" : "Delete this photo"}
              aria-label={language === "hi" ? "यह फोटो हटाएं" : "Delete this photo"}
            >
              <Trash2 size={15} />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsZoomed((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors border border-slate-700"
            title={
              isZoomed
                ? language === "hi" ? "ज़ूम रीसेट करें" : "Reset zoom"
                : language === "hi" ? "सांविधिक घोषणाओं पर ज़ूम करें" : "Zoom in on statutory declarations"
            }
          >
            {isZoomed ? <ZoomOut size={14} /> : <ZoomIn size={14} />}
            <span>{isZoomed ? (language === "hi" ? "1× सामान्य" : "1× Fit") : (language === "hi" ? "2.5× ज़ूम" : "2.5× Zoom")}</span>
          </button>
        </div>
      </div>

      {/* 2. Photo Display Container (Scrollable / Zoomable) */}
      <div className="flex-1 relative overflow-auto bg-black flex items-center justify-center p-2 sm:p-4">
        {/* Untouched Legal Integrity Watermark Tag */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-govNavy/90 border border-amber-400/80 text-[10.5px] font-mono font-bold text-white shadow-md">
            <ShieldCheck size={13} className="text-amber-400" />
            <span>{language === "hi" ? "मूल साक्ष्य कैप्चर" : "ORIGINAL EVIDENCE CAPTURE"}</span>
          </span>
        </div>

        {/* Previous / Next Arrow Overlays */}
        {photoList.length > 1 && activeIndex > 0 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 z-20 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 shadow-lg transition-transform active:scale-95"
            aria-label="Previous photo"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {photoList.length > 1 && activeIndex < photoList.length - 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 z-20 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 shadow-lg transition-transform active:scale-95"
            aria-label="Next photo"
          >
            <ChevronRight size={20} />
          </button>
        )}

        <div
          className={`transition-all duration-200 cursor-pointer ${
            isZoomed ? "scale-175 sm:scale-200 origin-center" : "scale-100"
          }`}
          onClick={() => setIsZoomed((prev) => !prev)}
        >
          <img
            src={currentActivePhoto.previewUrl}
            alt={language === "hi" ? "कैप्चर किया गया कमोडिटी पैकेजिंग साक्ष्य" : "Captured commodity packaging evidence"}
            className="max-h-[50vh] sm:max-h-[56vh] w-auto rounded-lg object-contain shadow-2xl border border-slate-800"
          />
        </div>
      </div>

      {/* 3. Multi-Photo Thumbnail Filmstrip (if more than 1 photo or add more supported) */}
      {photoList.length > 0 && (
        <div className="bg-slate-900/90 border-t border-slate-800/80 px-4 py-2 flex items-center gap-2 overflow-x-auto">
          {photoList.map((p, idx) => (
            <button
              key={`${p.previewUrl}-${idx}`}
              type="button"
              onClick={() => handleSelect(idx)}
              className={`relative shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                idx === activeIndex
                  ? "border-amber-400 ring-2 ring-amber-400/40 scale-105"
                  : "border-slate-700 opacity-60 hover:opacity-100"
              }`}
            >
              <img src={p.previewUrl} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
              <span className="absolute bottom-0 right-0 bg-black/70 text-[9px] font-mono px-1 rounded-tl text-white">
                {idx + 1}
              </span>
            </button>
          ))}

          {onAddMorePhotos && (
            <button
              type="button"
              onClick={onAddMorePhotos}
              className="shrink-0 w-12 h-12 rounded-lg border-2 border-dashed border-slate-700 hover:border-amber-400 text-slate-400 hover:text-amber-400 flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer"
              title={language === "hi" ? "और फोटो लें" : "Add more photos"}
            >
              <Plus size={16} />
              <span className="text-[8px] font-bold">+ {language === "hi" ? "फोटो" : "Add"}</span>
            </button>
          )}
        </div>
      )}

      {/* 4. Technical Metadata Ticker Bar */}
      <div className="bg-slate-900 border-t border-slate-800 px-4 py-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-400">
        <div>
          <span className="text-slate-500 font-sans block text-[10px]">
            {language === "hi" ? "सेंसर रिज़ॉल्यूशन:" : "Sensor Resolution:"}
          </span>
          <span className="font-bold text-slate-200">
            {currentActivePhoto.width} × {currentActivePhoto.height} px
          </span>
        </div>
        <div>
          <span className="text-slate-500 font-sans block text-[10px]">
            {language === "hi" ? "पेलोड आकार:" : "Payload Size:"}
          </span>
          <span className="font-bold text-slate-200">{formatFileSize(currentActivePhoto.sizeBytes)}</span>
        </div>
        <div>
          <span className="text-slate-500 font-sans block text-[10px]">
            {language === "hi" ? "एन्कोडिंग / माइम:" : "Encoding / Mime:"}
          </span>
          <span className="font-bold text-slate-200">
            {language === "hi" ? "JPEG (दोषरहित-अनुकूलित)" : "JPEG (Lossless-Optimized)"}
          </span>
        </div>
        <div>
          <span className="text-slate-500 font-sans block text-[10px]">
            {language === "hi" ? "कैप्चर समय-मुहर:" : "Captured Timestamp:"}
          </span>
          <span className="font-bold text-slate-200">
            {new Date(currentActivePhoto.timestamp).toLocaleTimeString(language === "hi" ? "hi-IN" : "en-IN", {
              hour12: false,
            })}{" "}
            IST
          </span>
        </div>
      </div>

      {/* 5. Bottom Sticky Action Bar */}
      <div className="bg-slate-950 border-t border-slate-800/80 px-4 py-3 sm:py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          {/* Retake / Add More Photos Button */}
          <button
            type="button"
            onClick={onAddMorePhotos || onRetake}
            disabled={isSubmitting}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50 cursor-pointer"
          >
            {onAddMorePhotos ? <Plus size={16} /> : <RotateCcw size={16} />}
            <span>
              {onAddMorePhotos
                ? language === "hi" ? "और फोटो लें" : "Add More Photos"
                : language === "hi" ? "फोटो पुनः लें" : "Retake Photo"}
            </span>
          </button>

          {/* Accept Button */}
          <button
            type="button"
            onClick={() => {
              if (onAcceptAll) {
                onAcceptAll(photoList);
              } else if (onAccept) {
                onAccept(currentActivePhoto);
              }
            }}
            disabled={isSubmitting}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span>{language === "hi" ? "साक्ष्य संचय हो रहा है..." : "Staging Evidence..."}</span>
            ) : (
              <>
                <Check size={16} />
                <span>
                  {photoList.length > 1
                    ? language === "hi"
                      ? `सभी (${photoList.length}) फोटो उपयोग करें`
                      : `Use All (${photoList.length}) Photos`
                    : language === "hi"
                    ? "इस फोटो का उपयोग करें"
                    : "Use This Photo"}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
