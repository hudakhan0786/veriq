import { useState, useEffect, useRef, useCallback } from "react";

export interface CameraError {
  code: "NOT_ALLOWED" | "NOT_FOUND" | "NOT_READABLE" | "OVERCONSTRAINED" | "SECURITY" | "UNKNOWN";
  message: string;
  userGuidance: string;
}

export interface GuidanceFeedback {
  lighting: "OPTIMAL" | "TOO_DARK" | "TOO_BRIGHT" | "GLARE_WARNING";
  lightingText: string;
  stability: "STEADY" | "MOVING";
  stabilityText: string;
  isReadyToCapture: boolean;
}

export interface CapturedPhoto {
  blob: Blob;
  previewUrl: string;
  width: number;
  height: number;
  sizeBytes: number;
  timestamp: string;
}

export function useCameraStream() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<"IDLE" | "REQUESTING" | "STREAMING" | "ERROR">("IDLE");
  const [error, setError] = useState<CameraError | null>(null);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [guidance, setGuidance] = useState<GuidanceFeedback>({
    lighting: "OPTIMAL",
    lightingText: "Analyzing lighting conditions...",
    stability: "STEADY",
    stabilityText: "Hold device steady",
    isReadyToCapture: true,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyzerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyzerIntervalRef = useRef<number | null>(null);
  const previousLumaRef = useRef<number | null>(null);

  // Stop all media tracks safely
  const stopCamera = useCallback(() => {
    if (analyzerIntervalRef.current) {
      window.clearInterval(analyzerIntervalRef.current);
      analyzerIntervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn("Failed to stop camera track:", e);
        }
      });
      streamRef.current = null;
      setStream(null);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setTorchOn(false);
    setStatus("IDLE");
  }, []);

  // Translate browser DOMExceptions into clear officer-friendly errors
  const mapMediaError = (err: any): CameraError => {
    const errName = err?.name || "";
    if (errName === "NotAllowedError" || errName === "PermissionDeniedError") {
      return {
        code: "NOT_ALLOWED",
        message: "Camera permission was denied.",
        userGuidance:
          "To capture inspection photographs, please enable camera access in your browser or device permissions and tap 'Try Again'.",
      };
    }
    if (errName === "NotFoundError" || errName === "DevicesNotFoundError") {
      return {
        code: "NOT_FOUND",
        message: "No camera detected on this device.",
        userGuidance:
          "Please verify that an external camera or smartphone camera sensor is connected and functional, or switch to 'Upload Packaging Photo'.",
      };
    }
    if (errName === "NotReadableError" || errName === "TrackStartError") {
      return {
        code: "NOT_READABLE",
        message: "Camera is in use by another application.",
        userGuidance:
          "Please close other applications using the camera (e.g. video calls, barcode scanners) and try again.",
      };
    }
    if (errName === "OverconstrainedError") {
      return {
        code: "OVERCONSTRAINED",
        message: "Requested camera resolution not supported.",
        userGuidance:
          "The system will automatically attempt connecting with lower sensor resolution.",
      };
    }
    if (errName === "SecurityError") {
      return {
        code: "SECURITY",
        message: "Insecure context detected.",
        userGuidance:
          "Camera access requires a secure HTTPS connection or localhost deployment in accordance with browser security policies.",
      };
    }
    return {
      code: "UNKNOWN",
      message: err?.message || "Failed to initialize camera sensor.",
      userGuidance:
        "An unexpected error occurred while accessing the camera. You can try again or use the upload fallback.",
    };
  };

  // Enumerate all video input devices
  const updateDeviceList = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter((d) => d.kind === "videoinput");
      setVideoDevices(videoInputs);
    } catch (e) {
      console.warn("Could not enumerate camera devices:", e);
    }
  }, []);

  // Helper to reliably bind active stream to the video DOM element
  const attachStreamToVideo = useCallback(() => {
    const video = videoRef.current;
    const activeStream = streamRef.current;
    if (video && activeStream) {
      if (video.srcObject !== activeStream) {
        video.srcObject = activeStream;
      }
      // Guarantee iOS / Android inline playback settings
      video.setAttribute("playsinline", "true");
      video.setAttribute("webkit-playsinline", "true");
      video.muted = true;
      video.play().catch((playErr) => {
        console.warn("Video play interrupted/prevented:", playErr);
      });
    }
  }, []);

  // Whenever stream or status transitions to STREAMING, attach to videoRef
  useEffect(() => {
    if (status === "STREAMING" && stream) {
      attachStreamToVideo();
    }
  }, [stream, status, attachStreamToVideo]);

  // Callback ref for video element mounting
  const setVideoRef = useCallback(
    (node: HTMLVideoElement | null) => {
      videoRef.current = node;
      if (node && streamRef.current) {
        if (node.srcObject !== streamRef.current) {
          node.srcObject = streamRef.current;
        }
        node.setAttribute("playsinline", "true");
        node.setAttribute("webkit-playsinline", "true");
        node.muted = true;
        node.play().catch((playErr) => console.warn("Video play interrupted on ref mount:", playErr));
      }
    },
    []
  );

  // Request camera stream
  const requestCamera = useCallback(
    async (targetFacing: "environment" | "user" = "environment", specificDeviceId?: string) => {
      // 1. Check browser mediaDevices support & Secure Context (HTTPS or localhost)
      const isSecure = typeof window !== "undefined" ? window.isSecureContext : true;
      const isLocal =
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1" ||
          window.location.hostname === "[::1]");

      if (!isSecure && !isLocal) {
        setError({
          code: "SECURITY",
          message: "Camera requires HTTPS on mobile / network devices.",
          userGuidance:
            "Mobile browsers require a secure HTTPS connection to stream camera video. Please connect via HTTPS or use the 'Open Phone Camera' button below for instant native capture.",
        });
        setStatus("ERROR");
        return;
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError({
          code: "NOT_FOUND",
          message: "Camera API is not supported or accessible in this browser.",
          userGuidance:
            "Please open Veriq in a modern browser (Google Chrome, Apple Safari, or Mozilla Firefox) or use the 'Open Phone Camera' button.",
        });
        setStatus("ERROR");
        return;
      }

      // Stop existing tracks before switching
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }

      setStatus("REQUESTING");
      setError(null);

      // Constraints: prefer 1080p full HD without rigid 'min' dimensions that crash portrait mobile sensors
      const highResConstraints: MediaStreamConstraints = {
        audio: false, // ZERO MICROPHONE ACCESS per privacy guidelines
        video: specificDeviceId
          ? { deviceId: { exact: specificDeviceId }, width: { ideal: 1920 }, height: { ideal: 1080 } }
          : {
              facingMode: { ideal: targetFacing },
              width: { ideal: 1920 },
              height: { ideal: 1080 },
            },
      };

      try {
        let activeStream: MediaStream;
        try {
          activeStream = await navigator.mediaDevices.getUserMedia(highResConstraints);
        } catch (firstErr: any) {
          // If high-res constraints failed (e.g. mobile portrait OverconstrainedError), fall back to facingMode only
          console.warn("High-res constraints failed, falling back to facingMode constraint:", firstErr);
          try {
            activeStream = await navigator.mediaDevices.getUserMedia({
              audio: false,
              video: specificDeviceId
                ? { deviceId: { exact: specificDeviceId } }
                : { facingMode: { ideal: targetFacing } },
            });
          } catch (secondErr: any) {
            // Final fallback: any video device
            console.warn("FacingMode failed, falling back to basic video:", secondErr);
            activeStream = await navigator.mediaDevices.getUserMedia({
              audio: false,
              video: true,
            });
          }
        }

        streamRef.current = activeStream;
        setStream(activeStream);
        setFacingMode(targetFacing);
        setStatus("STREAMING");

        // Inspect primary video track
        const videoTrack = activeStream.getVideoTracks()[0];
        if (videoTrack) {
          const settings = videoTrack.getSettings ? videoTrack.getSettings() : {};
          if (settings.deviceId) {
            setCurrentDeviceId(settings.deviceId);
          }

          // Check torch capability
          const capabilities = (videoTrack.getCapabilities ? videoTrack.getCapabilities() : {}) as any;
          setTorchSupported(Boolean(capabilities?.torch));
        }

        // Attach to video element immediately if ref is already bound
        if (videoRef.current) {
          videoRef.current.srcObject = activeStream;
          videoRef.current.setAttribute("playsinline", "true");
          videoRef.current.setAttribute("webkit-playsinline", "true");
          videoRef.current.muted = true;
          videoRef.current.play().catch((playErr) => console.warn("Video play interrupted:", playErr));
        }

        // Refresh device list
        updateDeviceList();

        // Start lightweight analyzer (every 400ms on 160x120 hidden canvas)
        if (!analyzerCanvasRef.current) {
          analyzerCanvasRef.current = document.createElement("canvas");
          analyzerCanvasRef.current.width = 160;
          analyzerCanvasRef.current.height = 120;
        }

        if (analyzerIntervalRef.current) {
          window.clearInterval(analyzerIntervalRef.current);
        }

        analyzerIntervalRef.current = window.setInterval(() => {
          if (!videoRef.current || videoRef.current.readyState < 2) return;
          const canvas = analyzerCanvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          if (!ctx) return;

          ctx.drawImage(videoRef.current, 0, 0, 160, 120);
          const imgData = ctx.getImageData(0, 0, 160, 120);
          const data = imgData.data;

          let sumLuma = 0;
          let glareCount = 0;
          const totalPixels = 160 * 120;

          // Sample luminance
          for (let i = 0; i < data.length; i += 16) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const luma = 0.299 * r + 0.587 * g + 0.114 * b;
            sumLuma += luma;
            if (r > 240 && g > 240 && b > 240) {
              glareCount++;
            }
          }

          const sampledPixels = totalPixels / 4;
          const meanLuma = sumLuma / sampledPixels;
          const glareFraction = glareCount / sampledPixels;

          // Movement detection
          let isMoving = false;
          if (previousLumaRef.current !== null) {
            const delta = Math.abs(meanLuma - previousLumaRef.current);
            if (delta > 12) {
              isMoving = true;
            }
          }
          previousLumaRef.current = meanLuma;

          // Compute guidance state
          let lightStatus: GuidanceFeedback["lighting"] = "OPTIMAL";
          let lightText = "Lighting is balanced";
          let isReady = true;

          if (meanLuma < 45) {
            lightStatus = "TOO_DARK";
            lightText = "Packaging surface is too dark, improve room illumination or enable torch";
            isReady = false;
          } else if (meanLuma > 220) {
            lightStatus = "TOO_BRIGHT";
            lightText = "Scene is overexposed, reduce harsh lighting";
            isReady = false;
          } else if (glareFraction > 0.08) {
            lightStatus = "GLARE_WARNING";
            lightText = "Specular glare detected on packaging, tilt slightly to avoid reflections";
            isReady = false;
          }

          setGuidance({
            lighting: lightStatus,
            lightingText: lightText,
            stability: isMoving ? "MOVING" : "STEADY",
            stabilityText: isMoving ? "Hold device steady" : "Steady • Good to capture",
            isReadyToCapture: isReady && !isMoving,
          });
        }, 400);
      } catch (err: any) {
        console.error("Camera acquisition failed:", err);
        const mapped = mapMediaError(err);
        setError(mapped);
        setStatus("ERROR");
      }
    },
    [updateDeviceList]
  );

  // Toggle torch / flashlight
  const toggleTorch = useCallback(async () => {
    const activeStream = streamRef.current;
    if (!activeStream || !torchSupported) return;
    const track = activeStream.getVideoTracks()[0];
    if (!track) return;

    try {
      const nextState = !torchOn;
      await (track as any).applyConstraints({
        advanced: [{ torch: nextState }],
      });
      setTorchOn(nextState);
    } catch (err) {
      console.warn("Could not toggle torch:", err);
    }
  }, [torchSupported, torchOn]);

  // Switch camera (Flip facingMode or cycle device ID)
  const switchCamera = useCallback(async () => {
    if (videoDevices.length > 1) {
      // Find index of current
      const currentIdx = videoDevices.findIndex((d) => d.deviceId === currentDeviceId);
      const nextIdx = (currentIdx + 1) % videoDevices.length;
      const nextDevice = videoDevices[nextIdx];
      const targetFacing = facingMode === "environment" ? "user" : "environment";
      await requestCamera(targetFacing, nextDevice.deviceId);
    } else {
      const nextFacing = facingMode === "environment" ? "user" : "environment";
      await requestCamera(nextFacing);
    }
  }, [videoDevices, currentDeviceId, facingMode, requestCamera]);

  // Capture still photograph (continuous multi-photo capture supported)
  const capturePhoto = useCallback(
    async (options?: { stopStream?: boolean }): Promise<CapturedPhoto> => {
      const activeStream = streamRef.current;
      if (!activeStream) {
        throw new Error("Cannot capture photo: No active camera stream.");
      }

      const videoTrack = activeStream.getVideoTracks()[0];
      if (!videoTrack) {
        throw new Error("No video track found in stream.");
      }

      // Try haptic feedback on mobile
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        try {
          navigator.vibrate(50);
        } catch (e) {
          // Haptics optional
        }
      }

      let blob: Blob | null = null;
      let width = 1920;
      let height = 1080;

      // Method 1: ImageCapture API (Highest native sensor resolution on Android/Chrome)
      if (typeof window !== "undefined" && "ImageCapture" in window) {
        try {
          const imageCapture = new (window as any).ImageCapture(videoTrack);
          blob = await imageCapture.takePhoto();

          // Extract native dimensions
          const imgBitmap = await createImageBitmap(blob);
          width = imgBitmap.width;
          height = imgBitmap.height;
          imgBitmap.close();
        } catch (icErr) {
          console.warn("ImageCapture.takePhoto failed, falling back to Canvas drawImage:", icErr);
          blob = null;
        }
      }

      // Method 2: High-resolution Canvas capture fallback (Safari iOS, Desktop)
      if (!blob && videoRef.current) {
        const video = videoRef.current;
        width = video.videoWidth || 1920;
        height = video.videoHeight || 1080;

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Failed to initialize 2D canvas context for capture.");
        }

        ctx.drawImage(video, 0, 0, width, height);

        blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(
            (b) => resolve(b),
            "image/jpeg",
            0.94 // High quality preservation for OCR & ArUco
          );
        });
      }

      if (!blob) {
        throw new Error("Failed to generate packaging photograph blob.");
      }

      const previewUrl = URL.createObjectURL(blob);
      const result: CapturedPhoto = {
        blob,
        previewUrl,
        width,
        height,
        sizeBytes: blob.size,
        timestamp: new Date().toISOString(),
      };

      // Only stop stream if explicitly requested (allows taking multiple photos sequentially)
      if (options?.stopStream) {
        stopCamera();
      }

      return result;
    },
    [stopCamera]
  );

  // Cleanup on unmount or page hide
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && status === "STREAMING") {
        stopCamera();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopCamera();
    };
  }, [status, stopCamera]);

  return {
    videoRef,
    setVideoRef,
    attachStreamToVideo,
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
  };
}
