import React from "react";
import { GuidanceFeedback } from "./useCameraStream";
import { AlertTriangle, CheckCircle2, Eye, ShieldAlert, Sparkles, Sun } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

interface CameraPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  stream?: MediaStream | null;
  guidance: GuidanceFeedback;
  showFramingGuide: boolean;
  retakeReason?: string;
  facingMode: "environment" | "user";
  isFlashing?: boolean;
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({
  videoRef,
  stream,
  guidance,
  showFramingGuide,
  retakeReason,
  facingMode,
  isFlashing = false,
}) => {
  const { language } = useLanguage();

  // Guarantee that whenever stream is available and video element is mounted, they bind and play
  React.useEffect(() => {
    const video = videoRef.current;
    if (video && stream) {
      if (video.srcObject !== stream) {
        video.srcObject = stream;
      }
      video.setAttribute("playsinline", "true");
      video.setAttribute("webkit-playsinline", "true");
      video.muted = true;
      video.play().catch((err) => console.warn("Video play failed in CameraPreview effect:", err));
    }
  }, [stream, videoRef]);

  const getLocalizedGuidanceText = () => {
    if (guidance.lighting !== "OPTIMAL") {
      switch (guidance.lighting) {
        case "TOO_DARK":
          return "दृश्य में कम रोशनी है, पर्याप्त प्रकाश की ओर जाएं";
        case "TOO_BRIGHT":
          return "अत्यधिक प्रकाश, कैमरे को सीधे प्रकाश स्रोत से दूर रखें";
        case "GLARE_WARNING":
          return "पैकेजिंग पर चकाचौंध (ग्लेयर) पाई गई, परावर्तन से बचने के लिए थोड़ा झुकाएं";
        default:
          return guidance.lightingText;
      }
    }
    if (guidance.stability === "MOVING") {
      return "डिवाइस को स्थिर रखें";
    }
    return "स्थिर • कैप्चर के लिए तैयार";
  };

  return (
    <div className="relative w-full h-full min-h-[440px] sm:min-h-[520px] bg-black overflow-hidden flex items-center justify-center select-none">
      {/* 1. Underlying Live Video Stream */}
      <video
        ref={(el) => {
          if (typeof videoRef === "function") {
            (videoRef as any)(el);
          } else if (videoRef) {
            (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = el;
          }
          if (el && stream && el.srcObject !== stream) {
            el.srcObject = stream;
            el.setAttribute("playsinline", "true");
            el.setAttribute("webkit-playsinline", "true");
            el.muted = true;
            el.play().catch((err) => console.warn("Video play failed on ref attach:", err));
          }
        }}
        playsInline
        autoPlay
        muted
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          facingMode === "user" ? "scale-x-[-1]" : ""
        }`}
      />

      {/* Shutter Snap Flash Feedback */}
      {isFlashing && (
        <div className="absolute inset-0 z-30 bg-white/90 pointer-events-none transition-opacity duration-200" />
      )}

      {/* 2. Top Status HUD Bar */}
      <div className="absolute top-3 inset-x-3 z-20 flex flex-col gap-2 pointer-events-none">
        {/* Retake Rationale Banner (if opened due to quality gate failure) */}
        {retakeReason && (
          <div className="bg-rose-950/90 text-rose-200 border border-rose-500/80 px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 backdrop-blur-md shadow-lg pointer-events-auto animate-fade-in">
            <ShieldAlert size={16} className="text-rose-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="font-bold text-white block">
                {language === "hi" ? "गुणवत्ता द्वार परामर्श:" : "Quality Gate Advisory:"}
              </span>
              <span className="text-[11px] text-rose-200">{retakeReason}</span>
            </div>
          </div>
        )}

        {/* Real-time Guidance Chips */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Left: Sensor Mode Tag */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700/70 text-[10.5px] font-mono font-bold text-slate-200 backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {facingMode === "environment"
                ? (language === "hi" ? "रियर फील्ड सेंसर" : "REAR FIELD SENSOR")
                : (language === "hi" ? "फ्रंट / वेबकैम" : "FRONT / WEBCAM")}
            </span>
          </div>

          {/* Right: Lighting & Stability Assistive Pill */}
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-md shadow-sm border transition-all ${
              guidance.isReadyToCapture
                ? "bg-emerald-950/80 text-emerald-200 border-emerald-500/60"
                : guidance.lighting === "GLARE_WARNING"
                ? "bg-amber-950/85 text-amber-200 border-amber-500/70"
                : "bg-slate-900/85 text-slate-200 border-slate-700"
            }`}
          >
            {guidance.isReadyToCapture ? (
              <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle size={13} className="text-amber-400 shrink-0" />
            )}
            <span className="truncate max-w-[210px] sm:max-w-none">
              {language === "hi"
                ? getLocalizedGuidanceText()
                : guidance.lighting !== "OPTIMAL"
                ? guidance.lightingText
                : guidance.stabilityText}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Subtle Packaging & ArUco Framing Reticle */}
      {showFramingGuide && (
        <div className="absolute inset-0 z-10 pointer-events-none p-6 sm:p-10 flex flex-col justify-between">
          {/* Package Framing Boundary */}
          <div className="relative w-full h-full border-2 border-dashed border-white/50 rounded-2xl flex flex-col justify-between p-4 shadow-[0_0_0_9999px_rgba(0,0,0,0.22)]">
            {/* Corner Crosshairs */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-amber-400 -mt-1 -ml-1 rounded-tl-sm" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-amber-400 -mt-1 -mr-1 rounded-tr-sm" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-amber-400 -mb-1 -ml-1 rounded-bl-sm" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-amber-400 -mb-1 -mr-1 rounded-br-sm" />

            {/* Top Center: Package Alignment Guidance */}
            <div className="text-center pt-2">
              <span className="inline-block px-3 py-1 rounded-md bg-black/60 backdrop-blur-xs text-[11px] font-bold text-white tracking-wide border border-white/20">
                {language === "hi"
                  ? "मुख्य सम्मुख पैनल (पीडीपी) को फ्रेम के अंदर संरेखित करें"
                  : "ALIGN PRINCIPAL DISPLAY PANEL (PDP) INSIDE FRAME"}
              </span>
            </div>

            {/* Bottom Right: 50mm ArUco Fiducial Marker Placement Target Box */}
            <div className="flex justify-end items-end">
              <div className="w-32 h-32 sm:w-36 sm:h-36 border-2 border-dashed border-amber-400/90 rounded-xl bg-amber-950/25 p-2 flex flex-col justify-between text-center backdrop-blur-2xs shadow-md">
                <div className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-tight">
                  ArUco #42 (50mm)
                </div>
                <div className="w-12 h-12 mx-auto border border-amber-400/60 rounded bg-slate-900/80 flex items-center justify-center">
                  <span className="text-[9px] font-mono text-amber-200">50 mm</span>
                </div>
                <div className="text-[9px] text-amber-100/90 leading-tight">
                  {language === "hi"
                    ? "पैकेज लेबल के समान तल में रखें"
                    : "Place in same plane as package label"}
                </div>
              </div>
            </div>
          </div>

          {/* Statutory Verification Footnote */}
          <div className="text-center pt-2">
            <span className="text-[10px] font-sans text-slate-300/80 bg-black/50 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
              {language === "hi"
                ? "केवल पूर्वावलोकन सहायता • आधिकारिक तालिका-I अनुसूची कैप्चर के पश्चात सत्यापित की जाएगी"
                : "Preview assistance only • Official Table-I schedule verified post-capture"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
