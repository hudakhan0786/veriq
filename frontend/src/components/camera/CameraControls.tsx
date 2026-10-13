import React from "react";
import {
  Camera,
  RefreshCw,
  Zap,
  ZapOff,
  Scan,
  X,
  FlipHorizontal,
  Circle,
  Check,
  Smartphone,
  Images,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

interface CameraControlsProps {
  onCapture: () => void;
  onSwitchCamera: () => void;
  onToggleTorch: () => void;
  onToggleFramingGuide: () => void;
  onClose: () => void;
  onDone?: () => void;
  onReviewPhotos?: () => void;
  onNativeCaptureClick?: () => void;
  capturedCount?: number;
  isCapturing?: boolean;
  canSwitchCamera?: boolean;
  torchSupported?: boolean;
  torchOn?: boolean;
  showFramingGuide?: boolean;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  onCapture,
  onSwitchCamera,
  onToggleTorch,
  onToggleFramingGuide,
  onClose,
  onDone,
  onReviewPhotos,
  onNativeCaptureClick,
  capturedCount = 0,
  isCapturing = false,
  canSwitchCamera = true,
  torchSupported = false,
  torchOn = false,
  showFramingGuide = true,
}) => {
  const { language } = useLanguage();

  return (
    <div className="veriq-camera-controls bg-slate-950/95 text-white border-t border-slate-800/80 px-4 py-3 sm:py-4 pb-[max(1rem,env(safe-area-inset-bottom))] select-none">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* Left Action: Close / Dismiss & Framing Guide */}
        <div className="flex items-center gap-1 min-w-[70px]">
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex flex-col items-center gap-1 focus:outline-none focus:ring-2 focus:ring-slate-500"
            title={language === "hi" ? "कैमरा रद्द करें और बंद करें" : "Cancel and close camera"}
            aria-label={language === "hi" ? "कैमरा रद्द करें और बंद करें" : "Cancel and close camera"}
          >
            <X size={18} />
            <span className="text-[10px] font-medium hidden sm:inline">
              {language === "hi" ? "बंद करें" : "Close"}
            </span>
          </button>

          {/* Framing Guide Toggle */}
          <button
            type="button"
            onClick={onToggleFramingGuide}
            className={`p-2.5 rounded-full transition-colors flex flex-col items-center gap-1 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
              showFramingGuide
                ? "text-amber-400 bg-amber-950/40 border border-amber-500/40"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
            title={
              showFramingGuide
                ? (language === "hi" ? "फ्रेमिंग गाइड छिपाएं" : "Hide framing reticle")
                : (language === "hi" ? "फ्रेमिंग गाइड दिखाएं" : "Show framing reticle")
            }
            aria-label={
              showFramingGuide
                ? (language === "hi" ? "फ्रेमिंग गाइड छिपाएं" : "Hide framing reticle")
                : (language === "hi" ? "फ्रेमिंग गाइड दिखाएं" : "Show framing reticle")
            }
          >
            <Scan size={18} />
            <span className="text-[10px] font-medium hidden sm:inline">
              {language === "hi" ? "गाइड" : "Guide"}
            </span>
          </button>

          {/* Native Phone Camera Quick Trigger */}
          {onNativeCaptureClick && (
            <button
              type="button"
              onClick={onNativeCaptureClick}
              className="p-2.5 rounded-full text-slate-300 hover:text-amber-300 hover:bg-slate-800 transition-colors flex flex-col items-center gap-1 focus:outline-none focus:ring-2 focus:ring-amber-400"
              title={language === "hi" ? "फोन कैमरा खोलें (HD)" : "Open Native Phone Camera (HD)"}
              aria-label={language === "hi" ? "फोन कैमरा खोलें" : "Open Native Phone Camera"}
            >
              <Smartphone size={18} />
              <span className="text-[10px] font-medium hidden sm:inline">
                {language === "hi" ? "फोन" : "Phone"}
              </span>
            </button>
          )}
        </div>

        {/* Center Action: Dominant Thumb-Friendly Shutter Button with Counter */}
        <div className="flex items-center justify-center gap-3">
          <div className="relative flex items-center justify-center">
            <button
              type="button"
              onClick={onCapture}
              disabled={isCapturing}
              className="group relative w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white/20 border-4 border-white/60 p-1 flex items-center justify-center transition-transform active:scale-95 hover:border-white shadow-xl focus:outline-none focus:ring-4 focus:ring-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
              title={
                language === "hi"
                  ? "पैकेजिंग फोटो लें (और फोटो जोड़ सकते हैं)"
                  : "Capture packaging photograph (take multiple photos)"
              }
              aria-label={language === "hi" ? "पैकेजिंग फोटो कैप्चर करें" : "Capture packaging photograph"}
            >
              {/* Inner Capture Disc */}
              <div
                className={`w-full h-full rounded-full bg-slate-900/70 flex items-center justify-center transition-all ${
                  isCapturing
                    ? "bg-amber-400 scale-90 animate-pulse"
                    : "group-hover:bg-slate-800/70"
                }`}
              >
                {isCapturing ? (
                  <RefreshCw size={22} className="text-white animate-spin" />
                ) : (
                  <div className="w-7 h-7 rounded-full border-2 border-slate-900/40" />
                )}
              </div>
            </button>

            {/* Photos Count Badge on Shutter */}
            {capturedCount > 0 && (
              <span
                onClick={onReviewPhotos}
                className="absolute -top-1 -right-1 cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-white font-black text-[11px] font-mono px-2 py-0.5 rounded-full border-2 border-slate-950 shadow-lg flex items-center gap-0.5"
                title={language === "hi" ? "कैप्चर की गई फोटो देखें" : "Review captured photos"}
              >
                {capturedCount}
              </span>
            )}
          </div>

          {/* If at least 1 photo captured, display "Done (N)" button */}
          {capturedCount > 0 && onDone && (
            <button
              type="button"
              onClick={onDone}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all active:scale-95 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              title={language === "hi" ? `समाप्त करें (${capturedCount} फोटो)` : `Finish & Use (${capturedCount})`}
            >
              <Check size={16} />
              <span className="hidden sm:inline">
                {language === "hi" ? `पूर्ण (${capturedCount})` : `Done (${capturedCount})`}
              </span>
              <span className="sm:hidden">{capturedCount}✓</span>
            </button>
          )}
        </div>

        {/* Right Action: Torch Toggle, Review, & Switch Camera */}
        <div className="flex items-center justify-end gap-1 min-w-[70px]">
          {/* Review Photos Button if any captured */}
          {capturedCount > 0 && onReviewPhotos && (
            <button
              type="button"
              onClick={onReviewPhotos}
              className="p-2.5 rounded-full text-emerald-400 hover:text-emerald-300 hover:bg-slate-800 transition-colors flex flex-col items-center gap-1 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              title={language === "hi" ? "फोटो समीक्षा" : "Review Photos"}
            >
              <Images size={18} />
              <span className="text-[10px] font-medium hidden sm:inline">
                {language === "hi" ? "समीक्षा" : "Review"}
              </span>
            </button>
          )}

          {/* Torch / Flash Toggle */}
          {torchSupported && (
            <button
              type="button"
              onClick={onToggleTorch}
              className={`p-2.5 rounded-full transition-colors flex flex-col items-center gap-1 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                torchOn
                  ? "text-amber-300 bg-amber-950/50 border border-amber-400"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
              title={
                torchOn
                  ? (language === "hi" ? "टॉर्च बंद करें" : "Turn off torch")
                  : (language === "hi" ? "टॉर्च चालू करें" : "Turn on torch")
              }
              aria-label={
                torchOn
                  ? (language === "hi" ? "टॉर्च बंद करें" : "Turn off torch")
                  : (language === "hi" ? "टॉर्च चालू करें" : "Turn on torch")
              }
            >
              {torchOn ? <Zap size={18} /> : <ZapOff size={18} />}
              <span className="text-[10px] font-medium hidden sm:inline">
                {language === "hi" ? "टॉर्च" : "Torch"}
              </span>
            </button>
          )}

          {/* Switch Camera Button (Front / Back / Multiple Devices) */}
          {canSwitchCamera && (
            <button
              type="button"
              onClick={onSwitchCamera}
              className="p-2.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex flex-col items-center gap-1 focus:outline-none focus:ring-2 focus:ring-govNavy-light"
              title={language === "hi" ? "कैमरा सेंसर बदलें" : "Switch camera sensor"}
              aria-label={language === "hi" ? "कैमरा सेंसर बदलें" : "Switch camera sensor"}
            >
              <FlipHorizontal size={18} />
              <span className="text-[10px] font-medium hidden sm:inline">
                {language === "hi" ? "बदलें" : "Flip"}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
