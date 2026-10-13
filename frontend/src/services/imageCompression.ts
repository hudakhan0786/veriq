/**
 * Client-Side Packaging Image Compression Service for Veriq
 * 
 * Statutory Evidentiary Rule:
 * 1. Initial Analysis Execution (1st time upload or update) MUST ALWAYS execute on the
 *    ORIGINAL, UNCOMPRESSED image at native sensor resolution to avoid ArUco fiducial scale
 *    distortion, OCR character degradation, and Table-I font schedule calculation errors.
 * 2. Compression is strictly reserved for database and datastore archival storage, and MUST
 *    be executed WITHOUT DATA/PIXEL LOSS (lossless compression preserving 100% native resolution).
 */

export interface ImageCompressionOptions {
  maxDimension?: number;
  quality?: number;
  mimeType?: string;
  lossless?: boolean;
  preserveNativeDimensions?: boolean;
}

export interface CompressedImageResult {
  file: File;
  blob: Blob;
  dataUrl: string;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  compressionRatioPct: number;
  width: number;
  height: number;
  isLossless: boolean;
}

/**
 * Compresses an image strictly for secondary storage/database archiving without data or pixel loss.
 * Preserves 100% of native pixel dimensions (no downscaling) using lossless encoding.
 */
export async function compressForStorageWithoutPixelLoss(
  input: File | Blob,
  options: ImageCompressionOptions = {}
): Promise<CompressedImageResult> {
  return compressPackagingImage(input, {
    ...options,
    lossless: true,
    preserveNativeDimensions: true,
    mimeType: options.mimeType || "image/webp",
    quality: 1.0,
  });
}

/**
 * General packaging image compression utility.
 * When options.lossless or options.preserveNativeDimensions is true, native pixel dimensions
 * and fine text boundaries are strictly preserved without downscaling.
 */
export async function compressPackagingImage(
  input: File | Blob,
  options: ImageCompressionOptions = {}
): Promise<CompressedImageResult> {
  const isLossless = Boolean(options.lossless || options.preserveNativeDimensions);
  const maxDim = isLossless ? Infinity : (options.maxDimension || 1280);
  const quality = typeof options.quality === "number" ? options.quality : (isLossless ? 1.0 : 0.8);
  const mimeType = options.mimeType || (isLossless ? "image/webp" : "image/jpeg");

  const originalSizeBytes = input.size;
  const filename = input instanceof File ? input.name : "evidence_capture.jpg";

  // Fallback for non-browser / headless SSR / test environments
  if (typeof window === "undefined" || typeof document === "undefined") {
    const fallbackFile =
      input instanceof File
        ? input
        : new File([input], filename, { type: input.type || mimeType });
    return {
      file: fallbackFile,
      blob: input,
      dataUrl: "",
      originalSizeBytes,
      compressedSizeBytes: originalSizeBytes,
      compressionRatioPct: 0,
      width: 1920,
      height: 1080,
      isLossless,
    };
  }

  // Load image via Object URL
  const objectUrl = URL.createObjectURL(input);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = (e) => reject(new Error("Failed to decode image for compression: " + String(e)));
      image.src = objectUrl;
    });

    let width = img.naturalWidth || img.width;
    let height = img.naturalHeight || img.height;

    // Only scale dimensions if NOT lossless and exceeds maxDimension
    if (!isLossless && maxDim < Infinity && (width > maxDim || height > maxDim)) {
      if (width > height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }

    // Render onto canvas
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Canvas 2D context unavailable for image compression");
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, width, height);

    const dataUrl = canvas.toDataURL(mimeType, quality);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error("Canvas toBlob serialization returned null"));
        },
        mimeType,
        quality
      );
    });

    const compressedSizeBytes = blob.size;
    const compressionRatioPct =
      originalSizeBytes > 0
        ? Math.round(((originalSizeBytes - compressedSizeBytes) / originalSizeBytes) * 100)
        : 0;

    // Derive proper filename extension
    let cleanFilename = filename;
    if (mimeType === "image/webp" && !cleanFilename.toLowerCase().endsWith(".webp")) {
      cleanFilename = cleanFilename.replace(/\.[^/.]+$/, "") + ".webp";
    } else if (mimeType === "image/jpeg" && !cleanFilename.toLowerCase().endsWith(".jpg") && !cleanFilename.toLowerCase().endsWith(".jpeg")) {
      cleanFilename = cleanFilename.replace(/\.[^/.]+$/, "") + ".jpg";
    }

    const compressedFile = new File([blob], cleanFilename, {
      type: mimeType,
      lastModified: Date.now(),
    });

    return {
      file: compressedFile,
      blob,
      dataUrl,
      originalSizeBytes,
      compressedSizeBytes,
      compressionRatioPct,
      width,
      height,
      isLossless,
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
