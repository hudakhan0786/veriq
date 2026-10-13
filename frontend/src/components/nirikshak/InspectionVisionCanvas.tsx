import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Eye,
  EyeOff,
  ScanSearch,
  Ruler,
  Layers,
  Sparkles,
  Info,
  AlertCircle,
} from "lucide-react";

export interface CanvasBoundingBox {
  id: string;
  label: string;
  x: number; // percentage [0 - 100]
  y: number; // percentage [0 - 100]
  width: number; // percentage [0 - 100]
  height: number; // percentage [0 - 100]
  confidence: number;
  type?: string;
}

export interface CanvasImageItem {
  id: string;
  url: string;
  filename: string;
  type: string;
  width: number;
  height: number;
}

interface InspectionVisionCanvasProps {
  images: CanvasImageItem[];
  boxes: CanvasBoundingBox[];
  calibration?: {
    available: boolean;
    referenceObject?: string;
    scaleMmPerPixel?: number;
    referenceLengthMm?: number;
    measuredPixels?: number;
  };
  activeImageId?: string;
  onSelectImage?: (imageId: string) => void;
  onSelectBox?: (boxId: string) => void;
  selectedBoxId?: string;
  className?: string;
}

export const InspectionVisionCanvas: React.FC<InspectionVisionCanvasProps> = ({
  images,
  boxes,
  calibration,
  activeImageId,
  onSelectImage,
  onSelectBox,
  selectedBoxId,
  className = "",
}) => {
  const { language } = useLanguage();
  const [selectedImageId, setSelectedImageId] = useState<string>(activeImageId || images[0]?.id || "");

  React.useEffect(() => {
    if (activeImageId && activeImageId !== selectedImageId) {
      setSelectedImageId(activeImageId);
    }
  }, [activeImageId]);

  const handleSelectImage = (id: string) => {
    setSelectedImageId(id);
    if (onSelectImage) {
      onSelectImage(id);
    }
  };

  const [zoom, setZoom] = useState<number>(1);
  const [showBoxes, setShowBoxes] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"image" | "annotations" | "calibration">("image");
  const [naturalDimensions, setNaturalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  const activeImage = images.find((img) => img.id === (activeImageId || selectedImageId)) || images[0];

  // Immediately synchronize load state with DOM image status to eliminate infinite buffering
  React.useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setNaturalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setIsImageLoaded(true);
      setImageError(false);
      return;
    }

    setIsImageLoaded(false);
    setImageError(false);

    // Watchdog timer: ensure buffering spinner never hangs if browser completes loading without dispatching synthetic event
    const watchdog = setTimeout(() => {
      const currentImg = imgRef.current;
      if (currentImg && currentImg.naturalWidth > 0) {
        setNaturalDimensions({ width: currentImg.naturalWidth, height: currentImg.naturalHeight });
        setIsImageLoaded(true);
      } else if (currentImg && currentImg.complete && currentImg.naturalWidth === 0) {
        setImageError(true);
        setIsImageLoaded(true);
      }
    }, 1000);

    return () => clearTimeout(watchdog);
  }, [activeImage?.url, activeImage?.id]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
      setNaturalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setIsImageLoaded(true);
      setImageError(false);
    }
  };

  const effectiveWidth = naturalDimensions?.width || activeImage?.width || 1920;
  const effectiveHeight = naturalDimensions?.height || activeImage?.height || 1080;

  const handleZoomIn = () => setZoom((v) => Math.min(2.5, Number((v + 0.15).toFixed(2))));
  const handleZoomOut = () => setZoom((v) => Math.max(0.5, Number((v - 0.15).toFixed(2))));
  const handleResetZoom = () => setZoom(1);

  return (
    <div className={`overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs ${className}`}>
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-2.5 bg-slate-50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-[#1B365D]/10 text-[#1B365D]">
            <ScanSearch size={16} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">
              {activeImage?.filename || (language === "hi" ? "भौतिक पैकेजिंग छायाचित्र" : "Physical Packaging Photograph")}
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">
              {activeImage
                ? `${effectiveWidth} × ${effectiveHeight}px · ${activeImage.type.replace(/_/g, " ")}`
                : language === "hi"
                ? "उच्च-रिज़ॉल्यूशन सेंसर साक्ष्य"
                : "High-resolution sensor evidence"}
            </p>
          </div>
        </div>

        {/* View Mode Tabs (Segmented Control) */}
        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab("image")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
              activeTab === "image"
                ? "bg-white text-[#1B365D] shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {language === "hi" ? "छवि दृश्य" : "Image View"}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("annotations");
              setShowBoxes(true);
            }}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
              activeTab === "annotations"
                ? "bg-white text-[#1B365D] shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {language === "hi" ? "एनोटेशन" : "Annotations"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("calibration")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
              activeTab === "calibration"
                ? "bg-white text-[#1B365D] shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {language === "hi" ? "अंशांकन दृश्य" : "Calibration View"}
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="relative min-h-[440px] bg-slate-100/80 flex items-center justify-center overflow-auto p-4 sm:min-h-[500px]">
        {/* Floating Zoom Toolbar */}
        <div className="absolute left-3 top-3 z-20 flex flex-col gap-1 rounded-lg bg-white/95 p-1 shadow-md backdrop-blur-md border border-slate-200">
          <button
            type="button"
            onClick={handleZoomIn}
            title={language === "hi" ? "ज़ूम इन करें" : "Zoom In"}
            className="rounded p-1.5 text-slate-700 hover:bg-slate-100 hover:text-[#1B365D] transition-colors"
          >
            <ZoomIn size={15} />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            title={language === "hi" ? "ज़ूम आउट करें" : "Zoom Out"}
            className="rounded p-1.5 text-slate-700 hover:bg-slate-100 hover:text-[#1B365D] transition-colors"
          >
            <ZoomOut size={15} />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            title={language === "hi" ? "ज़ूम रीसेट करें (1:1)" : "Reset Zoom (1:1)"}
            className="rounded p-1.5 text-slate-700 hover:bg-slate-100 hover:text-[#1B365D] transition-colors"
          >
            <RotateCcw size={15} />
          </button>
          <button
            type="button"
            onClick={() => setShowBoxes((v) => !v)}
            title={
              showBoxes
                ? language === "hi"
                  ? "पहचान ओवरले छिपाएं"
                  : "Hide Detection Overlays"
                : language === "hi"
                ? "पहचान ओवरले दिखाएं"
                : "Show Detection Overlays"
            }
            className={`rounded p-1.5 transition-colors ${
              showBoxes ? "bg-blue-50 text-[#1B365D] border border-blue-200 font-bold" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            {showBoxes ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>
        </div>

        {/* The Packaging Canvas Content */}
        <div
          className="relative shrink-0 transition-transform duration-200 select-none shadow-md rounded-md bg-white border border-slate-300"
          style={{
            width: `${Math.min(640 * zoom, 1200)}px`,
            aspectRatio: `${effectiveWidth} / ${effectiveHeight}`,
          }}
        >
          {activeImage ? (
            <>
              {!isImageLoaded && !imageError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xs text-slate-800 z-10 rounded-md">
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#1B365D] border-t-transparent mb-2" />
                  <span className="text-[11px] font-medium text-slate-600">
                    {language === "hi" ? "साक्ष्य तस्वीर लोड हो रही है..." : "Loading high-resolution evidence..."}
                  </span>
                </div>
              )}
              {imageError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-600 z-10 rounded-md p-4 text-center">
                  <AlertCircle size={24} className="text-amber-600 mb-1" />
                  <span className="text-xs font-semibold text-slate-800">
                    {language === "hi" ? "साक्ष्य छवि लोड करने में असमर्थ" : "Unable to load evidence image"}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 max-w-xs font-mono truncate">
                    {activeImage?.filename || activeImage?.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setImageError(false);
                      setIsImageLoaded(false);
                      if (imgRef.current && activeImage) {
                        const apiBase = ((import.meta as any)?.env?.VITE_API_BASE_URL as string) || "/api/v1";
                        imgRef.current.src = `${apiBase}/evidence/image/${activeImage.id}?t=${Date.now()}`;
                      }
                    }}
                    className="mt-2 px-3 py-1 text-[11px] font-semibold bg-[#1B365D] text-white rounded-md hover:bg-blue-900 transition-colors cursor-pointer"
                  >
                    {language === "hi" ? "पुनः प्रयास करें" : "Retry Loading"}
                  </button>
                </div>
              )}
              <img
                ref={imgRef}
                key={activeImage?.id || activeImage?.url}
                src={activeImage?.url}
                alt={activeImage?.filename}
                onLoad={handleImageLoad}
                onError={(e) => {
                  const apiBase = ((import.meta as any)?.env?.VITE_API_BASE_URL as string) || "/api/v1";
                  const target = e.currentTarget;
                  if (activeImage?.id && !target.src.includes(`/evidence/image/${activeImage.id}`)) {
                    target.src = `${apiBase}/evidence/image/${activeImage.id}`;
                    return;
                  }
                  setImageError(true);
                  setIsImageLoaded(true);
                }}
                className={`h-full w-full rounded-md object-contain pointer-events-none transition-opacity duration-150 ${
                  isImageLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </>
          ) : (
            <div className="h-full w-full rounded-md bg-slate-900 flex items-center justify-center text-slate-400 text-xs">
              {language === "hi" ? "कोई साक्ष्य छवि लोड नहीं है" : "No evidence image loaded"}
            </div>
          )}

          {/* Bounding Box Annotations Overlay */}
          {showBoxes && activeTab !== "calibration" && (
            <div className="absolute inset-0 pointer-events-none">
              {boxes.map((b) => {
                const isSelected = selectedBoxId === b.id;
                const isFiducial = b.type === "FIDUCIAL_STANDARD" || b.label.toLowerCase().includes("aruco");
                const isFail = b.type === "FAIL" || b.label.toLowerCase().includes("deficit") || b.label.toLowerCase().includes("missing");
                const isReview = b.type === "REVIEW" || b.label.toLowerCase().includes("review") || b.label.toLowerCase().includes("borderline");
                const isMrp = b.type === "MRP" || b.label.toLowerCase().includes("mrp") || b.label.toLowerCase().includes("usp");
                const isNetQty = b.type === "NET_QUANTITY" || b.label.toLowerCase().includes("net");
                const isPass = b.type === "PASS";

                const borderClass = isSelected
                  ? "border-amber-400 bg-amber-400/25 ring-4 ring-amber-400/40 z-30"
                  : isFiducial
                  ? "border-amber-400 border-dashed bg-amber-400/10 hover:bg-amber-400/20 z-10"
                  : isFail
                  ? "border-rose-500 bg-rose-500/20 hover:bg-rose-500/30 z-20"
                  : isReview
                  ? "border-amber-400 bg-amber-400/20 hover:bg-amber-400/30 z-20"
                  : isMrp
                  ? "border-sky-400 bg-sky-400/15 hover:bg-sky-400/30 z-10"
                  : isNetQty || isPass
                  ? "border-emerald-400 bg-emerald-400/15 hover:bg-emerald-400/30 z-10"
                  : "border-indigo-400 bg-indigo-400/15 hover:bg-indigo-400/30 z-10";

                const badgeClass = isSelected
                  ? "bg-amber-500 text-slate-950 font-black"
                  : isFiducial
                  ? "bg-amber-900/90 text-amber-300 border border-amber-400/50"
                  : isFail
                  ? "bg-rose-700 text-white"
                  : isReview
                  ? "bg-amber-600 text-white"
                  : isMrp
                  ? "bg-sky-700 text-white"
                  : isNetQty || isPass
                  ? "bg-emerald-700 text-white"
                  : "bg-indigo-700 text-white";

                const displayLabel = b.label.length > 38 ? `${b.label.slice(0, 36)}…` : b.label;

                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => onSelectBox?.(b.id)}
                    title={`${b.label} (${Math.round(b.confidence * 100)}% ${language === "hi" ? "विश्वसनीयता" : "confidence"})`}
                    className={`absolute border-2 pointer-events-auto transition-all cursor-pointer ${borderClass}`}
                    style={{
                      left: `${b.x}%`,
                      top: `${b.y}%`,
                      width: `${b.width}%`,
                      height: `${b.height}%`,
                    }}
                  >
                    <span
                      className={`absolute -top-6 left-0 whitespace-nowrap rounded px-1.5 py-0.5 text-[9px] font-black shadow-md ${badgeClass}`}
                    >
                      {displayLabel} · {Math.round(b.confidence * 100)}%
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Calibration Overlay Mode */}
          {activeTab === "calibration" && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 rounded-md text-slate-900 border-2 border-dashed border-[#1B365D]/40">
              <div className="rounded-full bg-[#1B365D]/10 p-3 border border-[#1B365D]/20 text-[#1B365D] mb-3 animate-pulse">
                <Ruler size={30} />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {language === "hi" ? "फोटोग्राममेट्रिक अंशांकन ग्रिड" : "Photogrammetric Calibration Grid"}
              </h4>
              <p className="text-xs text-slate-600 mt-1 max-w-sm text-center font-medium">
                {language === "hi"
                  ? "फिड्यूशियल मार्कर पहचान से समतलीय पैमाना संदर्भ स्थापित होता है:"
                  : "Fiducial marker detection establishes planar scale reference:"}
              </p>
              <div className="mt-3 rounded-lg bg-slate-50 p-3 border border-slate-200 font-mono text-[11px] text-slate-800 space-y-1">
                <div>
                  <span className="text-slate-500 font-sans">{language === "hi" ? "संदर्भ मानक:" : "Reference Standard:"}</span>{" "}
                  <span className="font-semibold text-[#1B365D]">
                    {calibration?.available
                      ? calibration?.referenceObject || "ArUco 4x4 (50.0mm)"
                      : language === "hi"
                      ? "कोई वैध संदर्भ नहीं"
                      : "No Valid Fiducial"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-sans">{language === "hi" ? "समाधानित पैमाना:" : "Resolved Scale:"}</span>{" "}
                  <span className="font-semibold text-slate-900">
                    {calibration?.available && calibration?.scaleMmPerPixel
                      ? `${calibration.scaleMmPerPixel.toFixed(4)} mm/px`
                      : calibration?.available
                      ? "Calibrated via fiducial standard"
                      : language === "hi"
                      ? "अंशांकित नहीं (निरस्त/अनुपलब्ध)"
                      : "Not Calibrated (Aborted/Unavailable)"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-sans">{language === "hi" ? "समतलीय होमोग्राफी:" : "Planar Homography:"}</span>{" "}
                  <span className="font-semibold text-emerald-700">
                    {calibration?.available
                      ? language === "hi"
                        ? "सत्यापित (झुकाव < 15°)"
                        : "Verified (Tilt < 15°)"
                      : language === "hi"
                      ? "अस्वीकृत / अप्रयुक्त"
                      : "Rejected / Inactive"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Viewport Info Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-white/95 border-t border-slate-200 px-4 py-2 flex items-center justify-between text-[11px] text-slate-600 font-medium">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                showBoxes ? "bg-emerald-500" : "bg-slate-400"
              }`}
            />
            <span>
              {showBoxes
                ? `${boxes.length} ${language === "hi" ? "पहचान ओवरले सक्रिय" : "Detection Overlays Active"}`
                : language === "hi"
                ? "ओवरले छिपे हुए हैं"
                : "Overlays Hidden"}
            </span>
          </div>
          <div>
            <span>
              {language === "hi" ? "ज़ूम" : "Zoom"}: {Math.round(zoom * 100)}% ·{" "}
              {language === "hi" ? "पैन और ज़ूम करने के लिए नियंत्रणों का उपयोग करें" : "Use controls to pan & zoom"}
            </span>
          </div>
        </div>
      </div>

      {/* Thumbnail Selector Strip (Multi-Image packages) */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto border-t border-slate-200 p-3 bg-slate-50">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 shrink-0">
            {language === "hi" ? "दृश्य:" : "Views:"}
          </span>
          {images.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => handleSelectImage(img.id)}
              className={`group relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all cursor-pointer ${
                img.id === activeImage?.id
                  ? "border-[#1B365D] ring-2 ring-[#1B365D]/20 shadow-xs"
                  : "border-slate-300 hover:border-slate-500 opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={img.url}
                alt={img.filename}
                loading="lazy"
                onError={(e) => {
                  const apiBase = ((import.meta as any)?.env?.VITE_API_BASE_URL as string) || "/api/v1";
                  const target = e.currentTarget;
                  if (img.id && !target.src.includes(`/evidence/image/${img.id}`)) {
                    target.src = `${apiBase}/evidence/image/${img.id}`;
                  }
                }}
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-x-0 bottom-0 bg-slate-900/80 px-1 py-0.5 text-[8px] font-bold uppercase text-white truncate">
                {img.type.replace(/_/g, " ")}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default InspectionVisionCanvas;
