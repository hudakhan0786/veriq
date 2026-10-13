import React, { useState, useEffect, useRef } from "react";
import {
  useCameraStream,
  CapturedPhoto,
} from "./useCameraStream";
import { CameraPreview } from "./CameraPreview";
import { CameraControls } from "./CameraControls";
import { PhotoReview } from "./PhotoReview";
import { CameraPermissionCard } from "./CameraPermissionCard";
import { Camera, Scan, ShieldCheck, Sun, X } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

interface InspectionCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoCaptured?: (file: File, previewUrl: string, width: number, height: number) => void;
  onPhotosCaptured?: (photos: Array<{ file: File; previewUrl: string; width: number; height: number }>) => void;
  onFallbackToUpload: () => void;
  retakeReason?: string;
}

export const InspectionCameraModal: React.FC<InspectionCameraModalProps> = ({
  isOpen,
  onClose,
  onPhotoCaptured,
  onPhotosCaptured,
  onFallbackToUpload,
  retakeReason,
}) => {
  const { language } = useLanguage();
  const {
    videoRef,
    stream,
    status,
    error,
    guidance,
    videoDevices,
    facingMode,
    torchSupported,
    torchOn,
    requestCamera,
    stopCamera,
    switchCamera,
    toggleTorch,
    capturePhoto,
  } = useCameraStream();

  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [showFramingGuide, setShowFramingGuide] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  const nativeInputRef = useRef<HTMLInputElement | null>(null);

  // Handle opening / closing
  useEffect(() => {
    if (isOpen) {
      setCapturedPhotos([]);
      setIsReviewing(false);
      setReviewIndex(0);
      setIsCapturing(false);
      setIsAccepting(false);
      // Automatically request camera on mount
      requestCamera("environment");
    } else {
      stopCamera();
      setCapturedPhotos([]);
      setIsReviewing(false);
    }
  }, [isOpen]);

  // Handle capture trigger (continuous: camera stays streaming)
  const handleCapture = async () => {
    if (isCapturing) return;
    setIsCapturing(true);
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);

    try {
      const photo = await capturePhoto({ stopStream: false });
      setCapturedPhotos((prev) => [...prev, photo]);
    } catch (err) {
      console.error("Capture failed:", err);
    } finally {
      setIsCapturing(false);
    }
  };

  // Handle Native Phone Camera Capture (Direct hardware camera fallback)
  const handleNativeFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotos: CapturedPhoto[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const previewUrl = URL.createObjectURL(file);
      const dims = await new Promise<{ width: number; height: number }>((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
        img.onerror = () => resolve({ width: 1920, height: 1080 });
        img.src = previewUrl;
      });

      newPhotos.push({
        blob: file,
        previewUrl,
        width: dims.width,
        height: dims.height,
        sizeBytes: file.size,
        timestamp: new Date().toISOString(),
      });
    }

    setCapturedPhotos((prev) => {
      const combined = [...prev, ...newPhotos];
      setReviewIndex(combined.length - 1);
      return combined;
    });
    setIsReviewing(true);

    if (nativeInputRef.current) {
      nativeInputRef.current.value = "";
    }
  };

  // Trigger native phone camera input
  const triggerNativeCapture = () => {
    nativeInputRef.current?.click();
  };

  // Delete a specific captured photo from tray
  const handleDeletePhoto = (indexToDelete: number) => {
    setCapturedPhotos((prev) => {
      const updated = prev.filter((_, idx) => idx !== indexToDelete);
      if (updated.length === 0) {
        setIsReviewing(false);
        if (status !== "STREAMING") {
          requestCamera(facingMode);
        }
      } else if (reviewIndex >= updated.length) {
        setReviewIndex(updated.length - 1);
      }
      return updated;
    });
  };

  // Switch back to live camera view from review screen
  const handleAddMorePhotos = () => {
    setIsReviewing(false);
    if (status !== "STREAMING") {
      requestCamera(facingMode);
    }
  };

  // Handle accept all captured photos
  const handleAcceptAll = (photosToAccept: CapturedPhoto[] = capturedPhotos) => {
    if (photosToAccept.length === 0) return;
    setIsAccepting(true);

    const items = photosToAccept.map((photo, idx) => {
      const filename = `package_capture_${new Date().toISOString().slice(0, 10)}_${Date.now().toString().slice(-4)}_${idx + 1}.jpg`;
      const file = new File([photo.blob], filename, { type: "image/jpeg" });
      return { file, previewUrl: photo.previewUrl, width: photo.width, height: photo.height };
    });

    if (onPhotosCaptured) {
      onPhotosCaptured(items);
    }
    if (onPhotoCaptured) {
      items.forEach((item) => {
        onPhotoCaptured(item.file, item.previewUrl, item.width, item.height);
      });
    }

    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={language === "hi" ? "विधिक मापविज्ञान कैमरा साक्ष्य कैप्चर" : "Legal Metrology Camera Evidence Capture"}
      className="veriq-camera-overlay fixed inset-0 z-50 bg-black/90 sm:bg-slate-950/80 flex flex-col items-center justify-center p-0 sm:p-4 overflow-hidden animate-fade-in"
    >
      {/* Hidden Native Phone Camera file input (100% reliable hardware camera trigger on any phone) */}
      <input
        ref={nativeInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="hidden"
        onChange={handleNativeFileChange}
      />

      {/* Smartphone-first Fullscreen / Desktop Contained Modal Shell */}
      <div className="veriq-camera-shell w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-2xl bg-slate-950 sm:rounded-2xl sm:border sm:border-slate-800 flex flex-col overflow-hidden relative">
        {/* Top Mini Government Bar */}
        <div className="veriq-camera-header bg-[#091422] text-white px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs select-none">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-amber-400" />
            <span className="font-bold tracking-wide">
              {language === "hi"
                ? "निरीक्षक • फील्ड कैमरा निरीक्षण"
                : "Veriq • Camera capture"}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            title={language === "hi" ? "कैमरा बंद करें" : "Close camera"}
            aria-label={language === "hi" ? "कैमरा बंद करें" : "Close camera"}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body State Switcher */}
        <div className="veriq-camera-body flex-1 flex flex-col relative overflow-hidden">
          {isReviewing && capturedPhotos.length > 0 ? (
            /* State 1: Multi-Photo Review Screen */
            <PhotoReview
              photos={capturedPhotos}
              currentIndex={reviewIndex}
              onSelectIndex={(idx) => setReviewIndex(idx)}
              onDeletePhoto={handleDeletePhoto}
              onAddMorePhotos={handleAddMorePhotos}
              onAcceptAll={handleAcceptAll}
              isSubmitting={isAccepting}
            />
          ) : status === "STREAMING" ? (
            /* State 2: Live Video Stream & Continuous Multi-Capture Controls */
            <>
              <div className="veriq-camera-live">
                <div className="veriq-camera-stage">
                  <div className="flex-1 relative overflow-hidden flex items-center justify-center">
                    <CameraPreview
                      videoRef={videoRef}
                      stream={stream}
                      guidance={guidance}
                      showFramingGuide={showFramingGuide}
                      retakeReason={retakeReason}
                      facingMode={facingMode}
                      isFlashing={isFlashing}
                    />
                  </div>

                  <CameraControls
                    onCapture={handleCapture}
                    onSwitchCamera={switchCamera}
                    onToggleTorch={toggleTorch}
                    onToggleFramingGuide={() => setShowFramingGuide((prev) => !prev)}
                    onClose={onClose}
                    onDone={() => handleAcceptAll()}
                    onReviewPhotos={() => setIsReviewing(true)}
                    onNativeCaptureClick={triggerNativeCapture}
                    capturedCount={capturedPhotos.length}
                    isCapturing={isCapturing}
                    canSwitchCamera={videoDevices.length > 1}
                    torchSupported={torchSupported}
                    torchOn={torchOn}
                    showFramingGuide={showFramingGuide}
                  />
                </div>

                <aside className="veriq-camera-help" aria-label={language === "hi" ? "तस्वीर लेने के सुझाव" : "Photo guidance"}>
                  <h2>{language === "hi" ? "पैकेज लेबल" : "Product label"}</h2>
                  <div className="veriq-camera-tip">
                    <Scan size={18} aria-hidden="true" />
                    <div><strong>{language === "hi" ? "लेबल समतल रखें" : "Keep the label flat"}<span>{language === "hi" ? "लेबल कैमरे की ओर रखें।" : "Place the product on a flat surface with the label facing the camera."}</span></strong></div>
                  </div>
                  <div className="veriq-camera-tip">
                    <Sun size={18} aria-hidden="true" />
                    <div><strong>{language === "hi" ? "चमक से बचें" : "Avoid glare"}<span>{language === "hi" ? "समान रोशनी में तस्वीर लें।" : "Use even lighting and avoid strong reflections."}</span></strong></div>
                  </div>
                  <div className="veriq-camera-tip">
                    <Camera size={18} aria-hidden="true" />
                    <div><strong>{language === "hi" ? "पूरा भाग फ्रेम करें" : "Fill the frame"}<span>{language === "hi" ? "सुनिश्चित करें कि विवरण स्पष्ट दिखें।" : "Keep the full label clear and visible in the viewfinder."}</span></strong></div>
                  </div>
                </aside>
              </div>
            </>
          ) : (
            /* State 3: Permission Request / Educational Prompt / Error Card */
            <div className="flex-1 flex items-center justify-center p-4 bg-slate-900/70 sm:rounded-b-2xl">
              <CameraPermissionCard
                error={error}
                onRequestPermission={() => requestCamera("environment")}
                onNativeCaptureClick={triggerNativeCapture}
                onFallbackToUpload={() => {
                  stopCamera();
                  onClose();
                  onFallbackToUpload();
                }}
                onClose={onClose}
                isLoading={status === "REQUESTING"}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
