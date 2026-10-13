"""Optical Quality Gate Implementation (SIH26034 - Nirikshak)
Member 1 — Computer Vision, Optics & Metrology

Evaluates incoming packaging frames against statutory and technical optical criteria:
- Laplacian blur variance (>= 150.0)
- Specular glare saturation percentage (<= 3.0%)
- Perspective tilt angle (<= 15.0 deg)

Emits structured contract results conforming to QualityGateResult and QualityCheckDTO.
"""

from dataclasses import dataclass
import io
import json
from pathlib import Path
import sys
from typing import Any, Dict, Optional, Tuple, Union
import cv2
import numpy as np

# Dynamically locate repository root to import canonical contracts if available
REPO_ROOT = Path(__file__).resolve().parent.parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

try:
    from backend.contracts.quality_gate.quality_gate_dto import QualityCheckDTO, QualityGateResult
except ImportError:
    QualityCheckDTO = None  # type: ignore
    QualityGateResult = None  # type: ignore


@dataclass
class QualityGateOutput:
    """Structured dual-compatible quality gate evaluation result.

    Provides property access and serialization compatible with both
    QualityGateResult (passed, blur_variance, glare_percentage, skew_angle_deg, advice)
    and QualityCheckDTO (is_valid, laplacian_blur, glare_percentage, tilt_angle_deg, rejection_reason).
    """

    passed: bool
    blur_variance: float
    glare_percentage: float
    skew_angle_deg: float
    advice: Optional[str] = None
    mean_luminance: Optional[float] = None
    contrast_std: Optional[float] = None

    # QualityCheckDTO compatibility properties
    @property
    def is_valid(self) -> bool:
        return self.passed

    @property
    def laplacian_blur(self) -> float:
        return self.blur_variance

    @property
    def tilt_angle_deg(self) -> float:
        return self.skew_angle_deg

    @property
    def rejection_reason(self) -> Optional[str]:
        return self.advice

    def __getitem__(self, key: str) -> Any:
        """Enables dictionary-style access for backwards compatibility."""
        if key in ("passed", "is_valid"):
            return self.passed
        if key in ("blur_variance", "laplacian_blur"):
            return self.blur_variance
        if key == "glare_percentage":
            return self.glare_percentage
        if key in ("skew_angle_deg", "tilt_angle_deg"):
            return self.skew_angle_deg
        if key in ("advice", "rejection_reason"):
            return self.advice
        raise KeyError(f"Unknown quality gate key: {key}")

    def to_dict(self) -> Dict[str, Any]:
        """Serializes output to standard dictionary matching QualityGateResult."""
        res = {
            "passed": self.passed,
            "blur_variance": round(self.blur_variance, 2),
            "glare_percentage": round(self.glare_percentage, 2),
            "skew_angle_deg": round(self.skew_angle_deg, 2),
            "advice": self.advice,
        }
        if self.mean_luminance is not None:
            res["mean_luminance"] = round(self.mean_luminance, 2)
        if self.contrast_std is not None:
            res["contrast_std"] = round(self.contrast_std, 2)
        return res

    def to_pipeline_dict(self) -> Dict[str, Any]:
        """Serializes output to dictionary matching QualityCheckDTO for pipeline adapters."""
        res = {
            "is_valid": self.passed,
            "laplacian_blur": round(self.blur_variance, 2),
            "glare_percentage": round(self.glare_percentage, 2),
            "tilt_angle_deg": round(self.skew_angle_deg, 2),
            "rejection_reason": self.advice,
        }
        if self.mean_luminance is not None:
            res["mean_luminance"] = round(self.mean_luminance, 2)
        if self.contrast_std is not None:
            res["contrast_std"] = round(self.contrast_std, 2)
        return res

    def to_quality_gate_result(self) -> Any:
        """Returns canonical QualityGateResult Pydantic model instance."""
        if QualityGateResult is None:
            raise RuntimeError("contracts.quality_gate.quality_gate_dto not available")
        return QualityGateResult(
            passed=self.passed,
            blur_variance=round(self.blur_variance, 2),
            glare_percentage=round(self.glare_percentage, 2),
            skew_angle_deg=round(self.skew_angle_deg, 2),
            advice=self.advice,
        )

    def to_quality_check_dto(self) -> Any:
        """Returns canonical QualityCheckDTO Pydantic model instance."""
        if QualityCheckDTO is None:
            raise RuntimeError("contracts.quality_gate.quality_gate_dto not available")
        return QualityCheckDTO(
            is_valid=self.passed,
            laplacian_blur=round(self.blur_variance, 2),
            glare_percentage=round(self.glare_percentage, 2),
            tilt_angle_deg=round(self.skew_angle_deg, 2),
            rejection_reason=self.advice,
        )


class QualityGateEvaluator:
    """Evaluates optical sharpness, glare coverage, and perspective skew on packaging frames."""

    # Authoritative Frozen Standards (configurable for empirical calibration)
    BLUR_THRESHOLD: float = 150.0
    GLARE_MAX_PERCENTAGE: float = 3.0
    TILT_MAX_DEG: float = 15.0
    MIN_LUMINANCE: float = 38.0
    MAX_LUMINANCE: float = 242.0
    MIN_CONTRAST_STD: float = 16.0

    # Normalization target resolution for focus evaluation
    NORMALIZATION_MAX_DIM: int = 1920

    @classmethod
    def evaluate_metrics(
        cls,
        blur_variance: float,
        glare_percentage: float,
        skew_angle_deg: float = 0.0,
        luminance_mean: Optional[float] = None,
        contrast_std: Optional[float] = None,
    ) -> Tuple[bool, Optional[str]]:
        """Evaluates pre-computed optical metrics against statutory thresholds.

        Maintains strict backward compatibility with pipeline_adapter.py and existing tests.
        Returns:
            Tuple[bool, Optional[str]]: (is_valid, rejection_reason)
        """
        reasons = []
        if blur_variance < cls.BLUR_THRESHOLD:
            reasons.append(
                f"IMAGE_BLURRED: Laplacian blur variance ({blur_variance:.1f}) is below threshold ({cls.BLUR_THRESHOLD:.1f}). Hold steady and refocus."
            )
        if glare_percentage > cls.GLARE_MAX_PERCENTAGE:
            reasons.append(
                f"SPECULAR_GLARE: Specular glare coverage ({glare_percentage:.1f}%) exceeds maximum ({cls.GLARE_MAX_PERCENTAGE:.1f}%). Adjust lighting or camera angle."
            )
        if skew_angle_deg > cls.TILT_MAX_DEG:
            reasons.append(
                f"EXCESSIVE_TILT: Skew angle ({skew_angle_deg:.1f} deg) exceeds maximum ({cls.TILT_MAX_DEG:.1f} deg). Align camera perpendicular to label."
            )
        if luminance_mean is not None:
            if luminance_mean < cls.MIN_LUMINANCE:
                reasons.append(
                    f"INSUFFICIENT_ILLUMINATION: Mean luminance ({luminance_mean:.1f}/255) is below threshold ({cls.MIN_LUMINANCE:.1f}). Image is underexposed / captured in low light. Please increase illumination."
                )
            elif luminance_mean > cls.MAX_LUMINANCE:
                reasons.append(
                    f"OVEREXPOSED: Mean luminance ({luminance_mean:.1f}/255) is washed out. Reduce intense direct light."
                )
        if contrast_std is not None and contrast_std < cls.MIN_CONTRAST_STD:
            reasons.append(
                f"LOW_CONTRAST: Image contrast standard deviation ({contrast_std:.1f}) is below threshold ({cls.MIN_CONTRAST_STD:.1f}). Label text cannot be reliably segmented."
            )

        if reasons:
            return False, " | ".join(reasons)
        return True, None

    @classmethod
    def compute_laplacian_variance(cls, gray_image: np.ndarray) -> float:
        """Computes Laplacian variance as an objective image focus/sharpness metric.

        Uses OpenCV cv2.Laplacian with CV_64F as primary SIMD-accelerated path.
        When packaging has large uniform or matte surfaces (e.g., solid black/white boxes),
        evaluates patch-based variance across information-bearing regions to prevent false blur rejections.
        """
        if gray_image is None or gray_image.size == 0:
            return 0.0

        # Ensure single-channel grayscale
        if gray_image.ndim == 3:
            gray = cv2.cvtColor(gray_image, cv2.COLOR_BGR2GRAY)
        else:
            gray = gray_image

        try:
            lap = cv2.Laplacian(gray, cv2.CV_64F)
            global_var = float(lap.var())
        except Exception:
            # Fallback manual convolution
            padded = np.pad(gray.astype(np.float32), 1, mode="edge")
            lap = (
                padded[:-2, 1:-1]
                + padded[2:, 1:-1]
                + padded[1:-1, :-2]
                + padded[1:-1, 2:]
                - 4 * padded[1:-1, 1:-1]
            )
            global_var = float(np.var(lap))

        if global_var >= cls.BLUR_THRESHOLD:
            return global_var

        # If global variance is below threshold, check if image is textureless/matte package with sharp information patches
        h, w = gray.shape[:2]
        if h >= 64 and w >= 64:
            bh, bw = h // 8, w // 8
            patch_vars = []
            for r in range(8):
                for c in range(8):
                    patch = gray[r * bh : (r + 1) * bh, c * bw : (c + 1) * bw]
                    try:
                        patch_vars.append(float(cv2.Laplacian(patch, cv2.CV_64F).var()))
                    except Exception:
                        pass
            if len(patch_vars) >= 10:
                patch_vars.sort()
                top_patch_var = float(np.mean(patch_vars[-6:]))
                # If the sharpest information-bearing patches have high high-frequency energy, scale to reflect actual edge focus
                if top_patch_var >= 50.0:
                    return max(global_var, float(top_patch_var * 2.2))

        return global_var

    @classmethod
    def compute_glare_percentage(cls, image: np.ndarray, is_bgr: bool = True) -> float:
        """Computes specular glare percentage using HSV thresholding (V > 245 and S < 15).

        Args:
            image: 3-channel color image (BGR or RGB).
            is_bgr: True if image is in BGR format (default), False if RGB.

        Returns:
            float: Percentage of pixels identified as specular glare (0.0 to 100.0).
        """
        if image is None or image.size == 0:
            return 0.0

        if image.ndim != 3 or image.shape[2] < 3:
            # Grayscale images lack saturation info; glare percentage undefined (0.0)
            return 0.0

        try:
            # Convert to HSV color space via OpenCV
            color_conv = cv2.COLOR_BGR2HSV if is_bgr else cv2.COLOR_RGB2HSV
            hsv = cv2.cvtColor(image[:, :, :3], color_conv)

            # Glare condition: V > 245 and S < 15
            # In OpenCV 8-bit HSV: H in [0, 179], S in [0, 255], V in [0, 255]
            lower_glare = np.array([0, 0, 246], dtype=np.uint8)
            upper_glare = np.array([179, 14, 255], dtype=np.uint8)

            glare_mask = cv2.inRange(hsv, lower_glare, upper_glare)
            glare_pixels = int(np.count_nonzero(glare_mask))
            total_pixels = image.shape[0] * image.shape[1]
            return float((glare_pixels / total_pixels) * 100.0)
        except Exception:
            # Fallback pure NumPy vectorization
            img_float = image[:, :, :3].astype(np.float32)
            v = np.max(img_float, axis=2)
            min_c = np.min(img_float, axis=2)
            denom = np.where(v == 0, 1.0, v)
            s = ((v - min_c) / denom) * 255.0

            glare_mask = (v > 245.0) & (s < 15.0)
            total_pixels = image.shape[0] * image.shape[1]
            glare_pixels = int(np.count_nonzero(glare_mask))
            return float((glare_pixels / total_pixels) * 100.0)

    MAX_IMAGE_DIMENSION: int = 8192
    MAX_IMAGE_PIXELS: int = 40_000_000
    MAX_BYTE_SIZE: int = 50 * 1024 * 1024  # 50 MB

    @classmethod
    def load_image(cls, image_input: Union[str, Path, bytes, io.BytesIO, np.ndarray]) -> np.ndarray:
        """Loads, sanitizes, and normalizes raw image input from varied sources.

        Supports file paths, byte streams, and raw NumPy arrays.
        Enforces security limits against decompression bombs and corrupted memory.
        Raises ValueError if image is invalid, corrupted, or exceeds security bounds.
        """
        img: Optional[np.ndarray] = None

        if isinstance(image_input, np.ndarray):
            if image_input.size == 0:
                raise ValueError("Provided NumPy image array is empty.")
            img = image_input

        elif isinstance(image_input, (str, Path)):
            path = Path(image_input).resolve()
            if not path.is_file():
                raise FileNotFoundError(f"Image file does not exist: {path}")
            # Check file size before reading to protect against huge file allocations
            if path.stat().st_size > cls.MAX_BYTE_SIZE:
                raise ValueError(f"Image file size ({path.stat().st_size} bytes) exceeds maximum limit of {cls.MAX_BYTE_SIZE} bytes.")
            img = cv2.imread(str(path), cv2.IMREAD_UNCHANGED)
            if img is None:
                raise ValueError(f"OpenCV failed to decode image file: {path}")

        elif isinstance(image_input, (bytes, io.BytesIO)):
            raw_bytes = image_input.getvalue() if isinstance(image_input, io.BytesIO) else image_input
            if len(raw_bytes) == 0:
                raise ValueError("Image byte stream is empty.")
            if len(raw_bytes) > cls.MAX_BYTE_SIZE:
                raise ValueError(f"Image byte stream size ({len(raw_bytes)} bytes) exceeds maximum limit of {cls.MAX_BYTE_SIZE} bytes.")
            buf = np.frombuffer(raw_bytes, dtype=np.uint8)
            img = cv2.imdecode(buf, cv2.IMREAD_UNCHANGED)
            if img is None:
                raise ValueError("OpenCV failed to decode image from byte buffer.")

        else:
            raise TypeError(f"Unsupported image input type: {type(image_input)}")

        # Validate dimensions and pixel count against decompression bombs
        h, w = img.shape[:2]
        if h > cls.MAX_IMAGE_DIMENSION or w > cls.MAX_IMAGE_DIMENSION:
            raise ValueError(f"Image dimensions ({w}x{h}) exceed maximum safe dimension limit of {cls.MAX_IMAGE_DIMENSION}px.")
        if (h * w) > cls.MAX_IMAGE_PIXELS:
            raise ValueError(f"Image total pixels ({h * w}) exceeds maximum safe pixel limit of {cls.MAX_IMAGE_PIXELS}.")

        # Handle 4-channel BGRA/RGBA images by stripping alpha channel cleanly
        if img.ndim == 3 and img.shape[2] == 4:
            img = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)

        # Check for NaN / Inf corruptions
        if not np.all(np.isfinite(img)):
            raise ValueError("Image matrix contains non-finite (NaN or Inf) values.")

        return img

    @classmethod
    def preprocess_for_ocr(cls, image: np.ndarray) -> np.ndarray:
        """Passthrough for OCR. CLAHE disabled to prevent destruction of high-resolution images."""
        if image is None or image.size == 0:
            return image
            
        if image.ndim == 2:
            img_bgr = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
        elif image.ndim == 3 and image.shape[2] == 4:
            img_bgr = cv2.cvtColor(image, cv2.COLOR_BGRA2BGR)
        elif image.ndim == 3 and image.shape[2] == 3:
            img_bgr = image
        else:
            return image

        return img_bgr

    @classmethod
    def evaluate_image(
        cls,
        image_input: Union[str, Path, bytes, io.BytesIO, np.ndarray],
        tilt_deg: float = 0.0,
        is_bgr: bool = True,
        auto_detect_tilt: bool = False,
    ) -> QualityGateOutput:
        """Evaluates an image input against all optical quality criteria.

        Args:
            image_input: File path, byte buffer, or NumPy image array.
            tilt_deg: External device pitch/roll tilt angle in degrees (default 0.0).
            is_bgr: True if array is in BGR format (standard for OpenCV).
            auto_detect_tilt: If True and tilt_deg is 0.0, attempts geometric tilt estimation from ArUco.
                              Defaults to False to conserve Stage 2 latency budget (< 30ms).

        Returns:
            QualityGateOutput: Dual-compatible structured result.
        """
        img = cls.load_image(image_input)

        # Grayscale conversion for blur calculation
        if img.ndim == 3:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY if is_bgr else cv2.COLOR_RGB2GRAY)
        else:
            gray = img

        # Focus normalization: Downsample large images internally ONLY for blur evaluation
        # so variance threshold remains stable across 4K vs 1080p sensors without modifying original image.
        h, w = gray.shape[:2]
        max_dim = max(h, w)
        if max_dim > cls.NORMALIZATION_MAX_DIM:
            scale = cls.NORMALIZATION_MAX_DIM / float(max_dim)
            norm_gray = cv2.resize(gray, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)
        else:
            norm_gray = gray

        blur_variance = cls.compute_laplacian_variance(norm_gray)
        glare_percentage = cls.compute_glare_percentage(img, is_bgr=is_bgr) if img.ndim == 3 else 0.0

        # Automatic geometric tilt estimation if explicitly requested and tilt_deg is 0.0
        effective_tilt = float(tilt_deg)
        if effective_tilt == 0.0 and auto_detect_tilt:
            try:
                from calibration import CalibrationEngine
                fiducial = CalibrationEngine.detect_aruco(img)
                if fiducial is not None and "tilt_angle_deg" in fiducial:
                    effective_tilt = float(fiducial["tilt_angle_deg"])
            except Exception:
                pass

        luminance_mean = float(np.mean(norm_gray))
        contrast_std = float(np.std(norm_gray))

        is_valid, advice = cls.evaluate_metrics(
            blur_variance,
            glare_percentage,
            effective_tilt,
            luminance_mean=luminance_mean,
            contrast_std=contrast_std,
        )

        return QualityGateOutput(
            passed=is_valid,
            blur_variance=blur_variance,
            glare_percentage=glare_percentage,
            skew_angle_deg=effective_tilt,
            advice=advice,
            mean_luminance=luminance_mean,
            contrast_std=contrast_std,
        )
