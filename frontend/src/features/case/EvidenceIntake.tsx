import React, { useState, useRef, useEffect } from "react";
import { EvidenceAsset } from "../../types/inspection";
import { ApiService } from "../../services/api";
import { InspectionCameraModal } from "../../components/camera";
import { Camera, UploadCloud, RotateCcw, ScanLine, Sparkles } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

interface EvidenceIntakeProps {
  inspectionId: string;
  onEvidenceSubmitted: (
    file: File | Blob,
    metadata: {
      inspection_id: string;
      panel_type: "PDP_FRONT" | "SIDE_PANEL" | "BACK_PANEL";
      original_filename: string;
      file_size_bytes: number;
      mime_type: string;
      image_width: number;
      image_height: number;
      preview_url: string;
      demo_scenario?: "PASS" | "FAIL" | "REVIEW" | "UNABLE_TO_VERIFY" | "DEFAULT";
    }
  ) => Promise<void>;
  isSubmitting?: boolean;
  existingAsset?: EvidenceAsset;
  onClearExisting?: () => void;
  retakeReason?: string;
  autoOpenCamera?: boolean;
}

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB statutory limit per TS-WEB-01
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const EvidenceIntake: React.FC<EvidenceIntakeProps> = ({
  inspectionId,
  onEvidenceSubmitted,
  isSubmitting = false,
  existingAsset,
  onClearExisting,
  retakeReason,
  autoOpenCamera = false,
}) => {
  const { language } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingAsset?.preview_url || existingAsset?.file_path || null);
  const [imageDims, setImageDims] = useState<{ width: number; height: number } | null>(
    existingAsset ? { width: existingAsset.image_width, height: existingAsset.image_height } : null
  );
  const [panelType, setPanelType] = useState<"PDP_FRONT" | "SIDE_PANEL" | "BACK_PANEL">(
    (existingAsset?.panel_type as any) || "PDP_FRONT"
  );
  const [demoScenario, setDemoScenario] = useState<"PASS" | "FAIL" | "REVIEW" | "UNABLE_TO_VERIFY" | "DEFAULT">("DEFAULT");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(Boolean(autoOpenCamera));
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate and stage file
  const stageFile = (file: File) => {
    setValidationError(null);

    // 1. MIME type validation
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setValidationError(
        language === "hi"
          ? `असमर्थित फ़ाइल प्रारूप (${file.type || "अज्ञात"})। साक्ष्य अंतर्ग्रहण केवल JPEG, PNG, या WEBP पैकेजिंग छवियों का समर्थन करता है।`
          : `Unsupported file format (${file.type || "unknown"}). Evidence intake supports JPEG, PNG, or WEBP packaging images.`
      );
      return;
    }

    // 2. File size validation (15 MB cap)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setValidationError(
        language === "hi"
          ? `फ़ाइल आकार (${sizeMB} MB) 15 MB की अपलोड सीमा से अधिक है। कृपया मानक उच्च रिज़ॉल्यूशन पर कैप्चर करें या अंतर्ग्रहण से पूर्व संपीड़ित करें।`
          : `File size (${sizeMB} MB) exceeds the 15 MB upload limit. Please capture at standard high resolution or compress before ingestion.`
      );
      return;
    }

    // 3. Load image to verify readability and extract native pixel resolution
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setSelectedFile(file);
      setPreviewUrl(objectUrl);
      setImageDims({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setValidationError(
        language === "hi"
          ? "छवि डेटा डिकोड करने में विफल। कृपया सुनिश्चित करें कि फ़ाइल दूषित नहीं है।"
          : "Failed to decode image data. Please ensure the file is not corrupted."
      );
    };
    img.src = objectUrl;
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      stageFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      stageFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  // Demo fixture loader helper
  const loadDemoFixture = (scenario: "PASS" | "FAIL" | "REVIEW" | "UNABLE_TO_VERIFY") => {
    setValidationError(null);
    setDemoScenario(scenario);

    // Synthetic transparent or pattern image blob with realistic dimension
    const canvas = document.createElement("canvas");
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = scenario === "PASS" ? "#0F2038" : scenario === "UNABLE_TO_VERIFY" ? "#334155" : "#1B365D";
      ctx.fillRect(0, 0, 1920, 1080);
      ctx.fillStyle = "#F8FAFC";
      ctx.font = "bold 42px sans-serif";
      ctx.fillText(`Veriq Demo Package Evidence (${scenario})`, 80, 200);
      ctx.font = "32px monospace";
      ctx.fillText(`ArUco 50mm Fiducial Scale • Principal Display Panel`, 80, 280);
      ctx.fillText(`Statute: Legal Metrology (Packaged Commodities) Rules, 2011`, 80, 340);
      if (scenario === "UNABLE_TO_VERIFY") {
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.beginPath();
        ctx.arc(960, 540, 260, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#DC2626";
        ctx.fillText("SPECULAR GLARE BLOOM (6.4%)", 700, 550);
      }
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const demoFile = new File([blob], `demo_${scenario.toLowerCase()}_evidence.jpg`, { type: "image/jpeg" });
        const objectUrl = URL.createObjectURL(blob);
        setSelectedFile(demoFile);
        setPreviewUrl(objectUrl);
        setImageDims({ width: 1920, height: 1080 });
      }
    }, "image/jpeg");
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageDims(null);
    setValidationError(null);
    setDemoScenario("DEFAULT");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onClearExisting) {
      onClearExisting();
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile && !existingAsset) {
      setValidationError(
        language === "hi"
          ? "आगे बढ़ने से पहले कृपया पैकेजिंग साक्ष्य छवि चुनें या कैप्चर करें।"
          : "Please select or capture a packaging evidence image before proceeding."
      );
      return;
    }

    try {
      const fileToSubmit = selectedFile || new Blob([], { type: existingAsset?.mime_type || "image/jpeg" });
      const filename = selectedFile?.name || existingAsset?.original_filename || "field_evidence.jpg";
      const mime = selectedFile?.type || existingAsset?.mime_type || "image/jpeg";
      const size = selectedFile?.size || existingAsset?.file_size_bytes || 1024 * 512;
      const width = imageDims?.width || existingAsset?.image_width || 1920;
      const height = imageDims?.height || existingAsset?.image_height || 1080;

      await onEvidenceSubmitted(fileToSubmit, {
        inspection_id: inspectionId,
        panel_type: panelType,
        original_filename: filename,
        file_size_bytes: size,
        mime_type: mime,
        image_width: width,
        image_height: height,
        preview_url: previewUrl || "",
        demo_scenario: demoScenario,
      });
    } catch (err: any) {
      setValidationError(
        err.message || (
          language === "hi"
            ? "साक्ष्य जमा करने में विफल। कृपया अपना कनेक्शन जांचें और पुनः प्रयास करें।"
            : "Failed to submit evidence. Please check your connection and retry."
        )
      );
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <h3 className="text-sm font-bold text-[#1B365D] flex items-center gap-2">
            <svg className="w-4 h-4 text-[#1B365D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {language === "hi" ? "साक्ष्य अंतर्ग्रहण एवं पैकेजिंग कैप्चर" : "Evidence Intake & Packaging Capture"}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === "hi"
              ? "निदान निरीक्षण हेतु ArUco 4x4 (50mm) अंशांकन संदर्भ मानक चिन्ह के साथ भौतिक पैकेज छवि अंतर्ग्रहण करें।"
              : "Ingest physical package image with ArUco 4x4 (50mm) calibration fiducial for diagnostic inspection."}
          </p>
        </div>

        {/* Demo Fixture Quick Selector */}
        {ApiService.isMockMode() && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-amber-900">
              {language === "hi" ? "डेमो नमूने:" : "Demo Fixtures:"}
            </span>
            <button
              type="button"
              onClick={() => loadDemoFixture("PASS")}
              className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors"
            >
              {language === "hi" ? "उत्तीर्ण (पानी)" : "PASS (Water)"}
            </button>
            <button
              type="button"
              onClick={() => loadDemoFixture("FAIL")}
              className="px-2 py-0.5 text-[10px] font-semibold rounded bg-rose-50 text-rose-800 border border-rose-300 hover:bg-rose-100 transition-colors"
            >
              {language === "hi" ? "अनुत्तीर्ण (कुकीज़)" : "FAIL (Cookies)"}
            </button>
            <button
              type="button"
              onClick={() => loadDemoFixture("REVIEW")}
              className="px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors"
            >
              {language === "hi" ? "समीक्षा (साबुन)" : "REVIEW (Soap)"}
            </button>
            <button
              type="button"
              onClick={() => loadDemoFixture("UNABLE_TO_VERIFY")}
              className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200 transition-colors"
            >
              {language === "hi" ? "असमर्थ (चकाचौंध)" : "UNABLE (Glare)"}
            </button>
          </div>
        )}
      </div>

      {/* Validation Error Alert */}
      {validationError && (
        <div
          role="alert"
          className="p-3 bg-rose-50 border border-rose-300 rounded-lg text-xs text-rose-800 flex items-start justify-between gap-2"
        >
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <span className="font-bold">
                {language === "hi" ? "साक्ष्य अंतर्ग्रहण चेतावनी: " : "Evidence Intake Alert: "}
              </span>
              {validationError}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setValidationError(null)}
            className="text-rose-800 hover:opacity-75 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Dropzone & Camera Dual Ingestion */}
      {!previewUrl ? (
        <div className="space-y-3">
          {/* Dual Ingestion Actions: Camera (Primary for Smartphones) vs Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Action 1: Real-Time Field Camera Trigger */}
            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              className="p-5 rounded-xl border-2 border-slate-300 bg-gradient-to-br from-blue-50/60 to-white hover:border-[#1B365D] hover:from-blue-50 hover:to-blue-100/40 text-left transition-all shadow-xs group flex flex-col justify-between space-y-3 cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-12 h-12 rounded-xl bg-[#1B365D] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Camera size={24} className="text-amber-400" />
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                  {language === "hi" ? "स्मार्टफोन फील्ड एचयूडी" : "SMARTPHONE FIELD HUD"}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1B365D] group-hover:text-blue-900">
                  {language === "hi" ? "फील्ड कैमरा प्रारंभ करें" : "Launch Field Camera"}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {language === "hi"
                    ? "ArUco 50mm संदर्भ लक्ष्य गाइड और प्रकाश सहायता के साथ वास्तविक समय लाइव वीडियो पूर्वावलोकन।"
                    : "Real-time live video preview with ArUco 50mm reference target guide and lighting assist."}
                </p>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-[#1B365D]">
                <span>{language === "hi" ? "लाइव कैमरा खोलें" : "Open Live Camera"}</span>
                <span>→</span>
              </div>
            </button>

            {/* Action 2: Dropzone & File Browser */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-xl p-5 text-center transition-colors cursor-pointer flex flex-col items-center justify-center space-y-2.5 ${
                isDragOver
                  ? "border-[#1B365D] bg-blue-50/40"
                  : "border-slate-300 hover:border-[#1B365D] bg-slate-50/70 hover:bg-blue-50/20"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileInputChange}
                className="hidden"
                aria-label={language === "hi" ? "पैकेजिंग साक्ष्य छवि अपलोड करें" : "Upload packaging evidence image"}
              />
              <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-700">
                <UploadCloud size={24} className="text-[#1B365D]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  {language === "hi" ? "पैकेजिंग छवि अपलोड करें / फ़ाइलें ब्राउज़ करें" : "Upload Packaging Image / Browse Files"}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {language === "hi"
                    ? "गैलरी या डेस्कटॉप स्टोरेज से 15 MB तक JPEG, PNG, या WEBP"
                    : "JPEG, PNG, or WEBP up to 15 MB from gallery or desktop storage"}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Staged Image Preview Area (Original Evidence Preservation) */
        <div className="space-y-3">
          <div className="relative rounded-xl border border-slate-300 bg-slate-100 overflow-hidden max-h-96 flex items-center justify-center">
            {/* Prominent Original Evidence Preservation Banner */}
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1B365D] text-white font-mono text-[11px] font-bold border border-amber-400 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                {language === "hi" ? "मूल साक्ष्य (अछूता)" : "ORIGINAL EVIDENCE (UNTOUCHED)"}
              </span>
            </div>

            {/* Clear & Retake Action Buttons */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                disabled={isSubmitting}
                className="px-2.5 py-1 rounded bg-[#1B365D] hover:bg-[#0A2540] text-white text-xs font-semibold border border-amber-400/80 shadow-xs focus:outline-none flex items-center gap-1 cursor-pointer transition-colors"
                title={language === "hi" ? "कैमरा उपयोग करके पैकेजिंग छवि पुनः लें" : "Retake packaging image using camera"}
              >
                <Camera size={13} className="text-amber-400" />
                <span>{language === "hi" ? "कैमरा पुनः लें" : "Retake Camera"}</span>
              </button>
              <button
                type="button"
                onClick={clearSelection}
                disabled={isSubmitting}
                className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-300 shadow-xs focus:outline-none cursor-pointer transition-colors"
                title={language === "hi" ? "वर्तमान छवि हटाएं" : "Remove current image"}
              >
                {language === "hi" ? "छवि बदलें ✕" : "Change Image ✕"}
              </button>
            </div>

            {/* Image */}
            <img
              src={previewUrl}
              alt={language === "hi" ? "पैकेजिंग निरीक्षण साक्ष्य" : "Packaging inspection evidence"}
              className="max-h-96 w-auto object-contain"
            />
          </div>

          {/* Technical Metadata Strip */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                {language === "hi" ? "मूल फ़ाइल नाम" : "Original Filename"}
              </span>
              <span className="font-mono text-slate-900 font-medium truncate block" title={selectedFile?.name || existingAsset?.original_filename || "field_evidence.jpg"}>
                {selectedFile?.name || existingAsset?.original_filename || "field_evidence.jpg"}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                {language === "hi" ? "प्रारूप एवं फ़ाइल आकार" : "Format & File Size"}
              </span>
              <span className="font-mono text-slate-900 font-medium">
                {(selectedFile?.type || existingAsset?.mime_type || "image/jpeg").replace("image/", "").toUpperCase()} •{" "}
                {formatFileSize(selectedFile?.size || existingAsset?.file_size_bytes || 1024 * 512)}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                {language === "hi" ? "छवि विमाएं (Dimensions)" : "Image Dimensions"}
              </span>
              <span className="font-mono text-slate-900 font-medium">
                {imageDims ? `${imageDims.width} × ${imageDims.height} px` : "1920 × 1080 px"}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                {language === "hi" ? "पैनल पहलू" : "Panel Facet"}
              </span>
              <select
                value={panelType}
                onChange={(e) => setPanelType(e.target.value as any)}
                disabled={isSubmitting}
                className="font-mono text-xs text-[#1B365D] font-bold bg-white border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#1B365D] focus:outline-none"
              >
                <option value="PDP_FRONT">
                  {language === "hi" ? "पीडीपी (मुख्य सम्मुख पैनल)" : "PDP (Front Panel)"}
                </option>
                <option value="SIDE_PANEL">
                  {language === "hi" ? "पार्श्व (साइड) पैनल" : "Side Panel"}
                </option>
                <option value="BACK_PANEL">
                  {language === "hi" ? "पृष्ठ (बैक) पैनल" : "Back Panel"}
                </option>
              </select>
            </div>
          </div>

          {/* Submission Action Bar */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={clearSelection}
              disabled={isSubmitting}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium underline cursor-pointer"
            >
              {language === "hi" ? "खारिज / रीसेट करें" : "Discard / Reset"}
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1B365D] hover:bg-[#0A2540] text-white text-xs font-bold rounded-lg shadow-sm focus:ring-2 focus:ring-[#1B365D] focus:outline-none disabled:opacity-50 transition-colors cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>
                    {language === "hi"
                      ? "साक्ष्य अंतर्ग्रहण एवं गुणवत्ता द्वार संचालन जारी..."
                      : "Ingesting Evidence & Running Quality Gate..."}
                  </span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    {language === "hi"
                      ? "गुणवत्ता सत्यापन हेतु साक्ष्य जमा करें"
                      : "Submit Evidence for Quality Verification"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Real-time Field Inspection Camera Modal */}
      <InspectionCameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onPhotoCaptured={(file) => stageFile(file)}
        onPhotosCaptured={(photos) => {
          if (photos.length > 0) {
            stageFile(photos[0].file);
          }
        }}
        onFallbackToUpload={() => fileInputRef.current?.click()}
        retakeReason={retakeReason}
      />
    </div>
  );
};
