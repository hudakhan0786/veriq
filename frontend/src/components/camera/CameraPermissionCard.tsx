import React from "react";
import { Camera, ShieldCheck, AlertCircle, RefreshCw, UploadCloud, X, Smartphone, ShieldAlert } from "lucide-react";
import { CameraError } from "./useCameraStream";
import { useLanguage } from "../../context/LanguageContext";

interface CameraPermissionCardProps {
  error: CameraError | null;
  onRequestPermission: () => void;
  onFallbackToUpload: () => void;
  onClose: () => void;
  onNativeCaptureClick?: () => void;
  isLoading?: boolean;
}

export const CameraPermissionCard: React.FC<CameraPermissionCardProps> = ({
  error,
  onRequestPermission,
  onFallbackToUpload,
  onClose,
  onNativeCaptureClick,
  isLoading = false,
}) => {
  const { language } = useLanguage();

  const getLocalizedErrorCode = (code: string) => {
    if (language !== "hi") return code.replace(/_/g, " ");
    switch (code) {
      case "NOT_ALLOWED":
        return "कैमरा अनुमति अस्वीकृत";
      case "NOT_FOUND":
        return "कैमरा हार्डवेयर नहीं मिला";
      case "NOT_READABLE":
        return "कैमरा सेंसर व्यस्त अथवा अनुपलब्ध";
      case "OVERCONSTRAINED":
        return "अति-बाधित कैमरा रिज़ॉल्यूशन";
      case "SECURITY":
        return "सुरक्षा नीति प्रतिबंध";
      default:
        return "अज्ञात कैमरा त्रुटि";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[420px] p-6 text-center max-w-md mx-auto space-y-5">
      {/* Top Close Icon for mobile */}
      <div className="w-full flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full text-slate-400 hover:text-slate-400 hover:bg-slate-800/70 transition-colors"
          title={language === "hi" ? "कैमरा बंद करें" : "Close camera"}
          aria-label={language === "hi" ? "कैमरा बंद करें" : "Close camera"}
        >
          <X size={20} />
        </button>
      </div>

      {error ? (
        /* State 2: Error / Denied State */
        <>
          <div className="w-16 h-16 rounded-2xl bg-rose-900/30 border border-rose-800 text-rose-400 flex items-center justify-center shadow-xs">
            <AlertCircle size={32} />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-400 bg-rose-900/30 px-2.5 py-0.5 rounded-full border border-rose-800">
              {getLocalizedErrorCode(error.code)}
            </span>
            <h3 className="text-lg font-black text-white">{error.message}</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {error.userGuidance}
            </p>
          </div>

          <div className="w-full space-y-2.5 pt-2">
            {/* Direct Native Camera Fallback - Always works on any phone */}
            {onNativeCaptureClick && (
              <button
                type="button"
                onClick={onNativeCaptureClick}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Smartphone size={16} />
                <span>
                  {language === "hi"
                    ? "फोन के मुख्य कैमरे से फोटो लें (100% समर्थित)"
                    : "Use Phone Camera (Native HD • 100% Supported)"}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={onRequestPermission}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-govNavy hover:bg-govNavy-light text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  <span>{language === "hi" ? "सेंसर से कनेक्ट हो रहा है..." : "Connecting Sensor..."}</span>
                </>
              ) : (
                <>
                  <RefreshCw size={15} />
                  <span>{language === "hi" ? "लाइव कैमरा पुनः प्रयास करें" : "Retry Live Camera"}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onFallbackToUpload}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-900/70 hover:bg-slate-800/60 text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <UploadCloud size={15} className="text-slate-400" />
              <span>{language === "hi" ? "गैलरी अथवा फ़ाइल से चुनें" : "Choose from Gallery / Files"}</span>
            </button>
          </div>
        </>
      ) : (
        /* State 1: Pre-Permission Educational Explanation */
        <>
          <div className="w-16 h-16 rounded-2xl bg-blue-900/30 border border-blue-800 text-govNavy flex items-center justify-center shadow-xs">
            <Camera size={32} />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-govNavy bg-blue-900/30 px-2.5 py-0.5 rounded-full border border-blue-800">
              {language === "hi" ? "सांविधिक साक्ष्य अंतर्ग्रहण" : "Statutory Evidence Intake"}
            </span>
            <h3 className="text-lg font-black text-white">
              {language === "hi" ? "फील्ड कैमरा एक्सेस आवश्यक" : "Field Camera Access Required"}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {language === "hi"
                ? "विधिक मापविज्ञान (पैकेज्ड वस्तुएं) नियम, 2011 एवं अधिनियम, 2009 के तहत सांविधिक अनुपालन सत्यापन हेतु पैकेज्ड वस्तु एवं अरूको मार्कर का फोटो लेने के लिए कैमरा एक्सेस आवश्यक है।"
                : "Camera access is needed to photograph the packaged commodity and ArUco fiducial marker for statutory compliance verification under the Legal Metrology (PC) Rules, 2011 & LM Act, 2009."}
            </p>
          </div>

          {/* Privacy & Evidentiary Assurance Badges */}
          <div className="w-full bg-slate-800/60 border border-slate-700 rounded-xl p-3 text-left space-y-2 text-[11px] text-slate-200">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
              <span>
                {language === "hi" ? (
                  <><strong>केवल वीडियो:</strong> कोई माइक्रोफ़ोन या ऑडियो रिकॉर्डिंग नहीं।</>
                ) : (
                  <><strong>Video Only:</strong> Zero microphone or audio recording.</>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
              <span>
                {language === "hi" ? (
                  <><strong>मल्टी-फोटो समर्थित:</strong> पैकेज के सभी फलक (PDP, MRP, बैच) एक साथ कैप्चर करें।</>
                ) : (
                  <><strong>Multi-Angle Capture:</strong> Photograph PDP, MRP, batch details in one session.</>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
              <span>
                {language === "hi" ? (
                  <><strong>धारा 63 बीएसए 2023:</strong> मूल साक्ष्य को क्रिप्टोग्राफ़िक रूप से हैश किया जाता है।</>
                ) : (
                  <><strong>Section 63 BSA 2023:</strong> Raw evidence cryptographically hashed.</>
                )}
              </span>
            </div>
          </div>

          <div className="w-full space-y-2.5 pt-2">
            <button
              type="button"
              onClick={onRequestPermission}
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-govNavy hover:bg-govNavy-light text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>{language === "hi" ? "कैमरा प्रारंभ हो रहा है..." : "Starting Camera Stream..."}</span>
                </>
              ) : (
                <>
                  <Camera size={16} />
                  <span>{language === "hi" ? "लाइव कैमरा शुरू करें" : "Allow Camera & Start Stream"}</span>
                </>
              )}
            </button>

            {/* Native Mobile Camera Option */}
            {onNativeCaptureClick && (
              <button
                type="button"
                onClick={onNativeCaptureClick}
                className="w-full py-3 px-4 rounded-xl bg-amber-400/90 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Smartphone size={15} />
                <span>{language === "hi" ? "फोन कैमरा से कैप्चर करें (HD)" : "Capture with Phone Camera (Native HD)"}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onFallbackToUpload}
              className="w-full py-2.5 px-4 text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UploadCloud size={14} className="text-slate-400" />
              <span>{language === "hi" ? "मौजूदा फ़ाइल / गैलरी से चुनें" : "Choose Existing File / Gallery"}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
