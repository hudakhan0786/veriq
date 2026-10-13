"""Multilingual OCR Pipeline Engine (SIH26034 - Nirikshak)

Architecture & Specification Compliance:
- Stages 6 & 7: DBNet++ Detection -> PP-OCRv4 Multilingual Recognition -> Tesseract Fallback
- Strict conformance to contracts/ocr/ocr_dto.py and contracts/ocr/ocr_schema.json
- CPU execution with ONNX Runtime optimizations
- Preserves raw observed packaging strings (Zero semantic auto-correction per Rule 19)
- Downstream handoff to Member 3 (parsers.py) and Member 4 (Table-I font evaluation)
"""

import os
import time
import logging
from pathlib import Path
import sys
from typing import Any, Dict, List, Optional, Union
import numpy as np
import cv2

# Ensure contracts is accessible
REPO_ROOT = Path(__file__).resolve().parent.parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

SRC_DIR = Path(__file__).resolve().parent
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from backend.contracts.ocr.ocr_dto import OCROutput, OCRToken
from polygon_normalizer import PolygonNormalizer
from detector import DBNetTextDetector, TextDetectionResult
from recognizer import PPOCRv4Recognizer
from fallback import TesseractFallback, OCRConsensusEngine

logger = logging.getLogger(__name__)


class MultilingualOCREngine:
    """Orchestrates DBNet++ multi-oriented detection, PP-OCRv4 multilingual recognition,
    and Tesseract consensus fallback into validated OCROutput contract objects.
    """

    def __init__(
        self,
        detector: Optional[DBNetTextDetector] = None,
        recognizer: Optional[PPOCRv4Recognizer] = None,
        fallback: Optional[TesseractFallback] = None,
        fallback_threshold: float = 0.65,
        det_num_threads: int = 4,
        rec_num_threads: int = 6,
        num_threads: Optional[int] = None,
        execution_mode: str = "FP32",
        allow_classical_fallback: bool = False
    ):
        self.execution_mode = execution_mode.upper()
        if num_threads is not None:
            det_num_threads = num_threads
            rec_num_threads = num_threads
        self.detector = detector if detector is not None else DBNetTextDetector(
            num_threads=det_num_threads,
            execution_mode=self.execution_mode,
            allow_classical_fallback=allow_classical_fallback,
            max_side_len=int(os.environ.get("DBNET_MAX_SIDE_LEN", "1920"))
        )
        self.recognizer = recognizer if recognizer is not None else PPOCRv4Recognizer(
            num_threads=rec_num_threads,
            execution_mode=self.execution_mode
        )
        self.fallback = fallback if fallback is not None else TesseractFallback()
        self.fallback_threshold = fallback_threshold

    def _load_image(self, image_input: Union[np.ndarray, str, Path]) -> Optional[np.ndarray]:
        """Loads and normalizes image input into a standard BGR uint8 NumPy array."""
        img: Optional[np.ndarray] = None

        if isinstance(image_input, (str, Path)):
            path_str = str(image_input)
            if "\x00" in path_str:
                logger.error("Rejected image path containing null byte")
                return None
            if not os.path.exists(path_str):
                logger.error(f"Image path does not exist: {path_str}")
                return None
            img = cv2.imread(path_str)
            if img is None:
                return None

        elif isinstance(image_input, np.ndarray):
            if image_input.size == 0 or len(image_input.shape) < 2:
                return None
            img = image_input

        if img is None:
            return None

        # Sanitize non-finite values
        if not np.isfinite(img).all():
            img = np.nan_to_num(img, nan=0.0, posinf=255.0, neginf=0.0)

        # Decompression / allocation bomb guard (cap max dimension to 4096)
        h, w = img.shape[:2]
        if max(h, w) > 8192:
            scale = 4096.0 / max(h, w)
            new_w = max(int(round(w * scale)), 16)
            new_h = max(int(round(h * scale)), 16)
            img = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)

        # Coerce floating-point arrays to uint8
        if np.issubdtype(img.dtype, np.floating):
            if img.max() <= 1.0 and img.min() >= 0.0:
                img = (img * 255.0).clip(0, 255).astype(np.uint8)
            else:
                img = np.clip(img, 0, 255).astype(np.uint8)
        elif img.dtype != np.uint8:
            img = np.clip(img, 0, 255).astype(np.uint8)

        # Ensure standard 3-channel BGR layout
        if len(img.shape) == 2:
            img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
        elif len(img.shape) == 3:
            if img.shape[2] == 4:
                img = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)
            elif img.shape[2] == 1:
                img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
            elif img.shape[2] > 3:
                img = img[:, :, :3]

        return np.ascontiguousarray(img)

    def _extract_tokens_from_mat(
        self,
        mat: np.ndarray,
        img_w: int,
        img_h: int,
        crop_source: Optional[np.ndarray] = None,
        crop_scale: float = 1.0,
    ) -> List[Dict[str, Any]]:
        """Internal helper to detect and recognize text tokens on an oriented image buffer."""
        detections = self.detector.detect(mat)
        extracted: List[Dict[str, Any]] = []

        for det in detections:
            # Validate polygon area and bounds
            is_valid, _ = PolygonNormalizer.validate_polygon(det.polygon, img_w, img_h)
            if not is_valid:
                continue

            # Extract perspective-rectified crop from full-resolution crop_source if available
            try:
                if crop_source is not None and abs(crop_scale - 1.0) > 1e-4:
                    poly_scaled = [[pt[0] * crop_scale, pt[1] * crop_scale] for pt in det.polygon]
                    crop = PolygonNormalizer.extract_crop(crop_source, poly_scaled, target_height=48)
                else:
                    crop = PolygonNormalizer.extract_crop(mat, det.polygon, target_height=48)
            except Exception:
                try:
                    crop = PolygonNormalizer.extract_crop(mat, det.polygon, target_height=48)
                except Exception:
                    continue

            # Multilingual recognition (PP-OCRv4)
            p_text, p_conf, p_lang = self.recognizer.recognize(crop)

            # Inversion probe: if initial confidence is low or inverted (< 0.75), test 180-degree flipped crop
            if crop is not None and crop.size > 0 and p_conf < 0.75:
                try:
                    crop_180 = cv2.rotate(crop, cv2.ROTATE_180)
                    p_text_180, p_conf_180, p_lang_180 = self.recognizer.recognize(crop_180)
                    if p_conf_180 > p_conf + 0.05 or (p_conf < 0.50 and p_conf_180 > p_conf):
                        p_text, p_conf, p_lang = p_text_180, p_conf_180, p_lang_180
                except Exception:
                    pass

            # Packaging contrast enhancement probe for low/medium confidence crops (< 0.85)
            # Physical factors like cylindrical curvature, glossy specular glare, and colored plastic backgrounds
            # can degrade CTC confidence on fine print statutory labels
            if crop is not None and crop.size > 0 and p_conf < 0.85:
                try:
                    lab = cv2.cvtColor(crop, cv2.COLOR_BGR2LAB)
                    l, a, b = cv2.split(lab)
                    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(4, 4))
                    cl = clahe.apply(l)
                    enh_bgr = cv2.cvtColor(cv2.merge((cl, a, b)), cv2.COLOR_LAB2BGR)
                    gaussian = cv2.GaussianBlur(enh_bgr, (0, 0), 2.0)
                    unsharp = cv2.addWeighted(enh_bgr, 1.5, gaussian, -0.5, 0)
                    p_text_enh, p_conf_enh, p_lang_enh = self.recognizer.recognize(unsharp)
                    if p_conf_enh > p_conf + 0.03 or (not p_text.strip() and p_text_enh.strip()):
                        p_text, p_conf, p_lang = p_text_enh, p_conf_enh, p_lang_enh
                except Exception:
                    pass

            # Consensus fallback on low confidence
            final_text = p_text
            final_conf = p_conf
            final_lang = p_lang

            if self.fallback_threshold > 0 and PolygonNormalizer.requires_consensus_fallback(p_conf, self.fallback_threshold):
                if self.fallback.is_available():
                    fb_res = self.fallback.recognize(crop)
                    if fb_res is not None:
                        fb_text, fb_conf = fb_res
                        final_text, final_conf, _ = OCRConsensusEngine.resolve(
                            p_text, p_conf, fb_text, fb_conf
                        )
                        final_lang = PPOCRv4Recognizer.detect_language(final_text)

            canonical_polygon = PolygonNormalizer.canonicalize_polygon(det.polygon)
            bbox = PolygonNormalizer.polygon_to_axis_aligned_box(canonical_polygon, img_w, img_h)
            bounded_conf = float(min(max(final_conf, 0.0), 1.0))

            extracted.append({
                "text": final_text,
                "confidence": bounded_conf,
                "polygon": canonical_polygon,
                "bounding_box": bbox,
                "language": final_lang,
            })

        return extracted

    def process_image(
        self,
        image_input: Union[np.ndarray, str, Path],
        image_id: str = "img_01"
    ) -> OCROutput:
        """Executes end-to-end multilingual text detection and recognition on rectified image.

        Optimizations:
        1. Memory-safe downsampling: caps input to max 1920 dimension to maintain < 180MB RAM on free containers.
        2. Multi-angle 90-degree clockwise probe: extracts vertical packaging declarations (e.g. cosmetics/stickers).
        3. Inverse coordinate scaling: maps all polygon and bounding box vertices back to original image dimensions.

        Args:
            image_input: BGR/RGB NumPy array or filesystem path to image
            image_id: Unique identifier for inspection tracking

        Returns:
            OCROutput: Fully populated and contract-validated DTO
        """
        start_time = time.perf_counter()
        image = self._load_image(image_input)

        if image is None or image.size == 0 or len(image.shape) < 2:
            return OCROutput(
                image_id=image_id,
                total_tokens=0,
                mean_confidence=0.0,
                tokens=[],
                full_text="",
                execution_time_ms=0
            )

        orig_h, orig_w = image.shape[:2]

        # Memory-safe downsample: cap max dimension to 1920 to preserve fine print statutory text
        max_dim = int(os.environ.get("OCR_MAX_IMAGE_DIM", "1920"))
        scale = 1.0
        proc_image = image
        if max(orig_h, orig_w) > max_dim:
            scale = float(max_dim) / max(orig_h, orig_w)
            proc_w = max(int(round(orig_w * scale)), 16)
            proc_h = max(int(round(orig_h * scale)), 16)
            proc_image = cv2.resize(image, (proc_w, proc_h), interpolation=cv2.INTER_AREA)

        curr_h, curr_w = proc_image.shape[:2]
        inv_scale = 1.0 / scale if abs(scale - 1.0) > 1e-4 else 1.0

        # 1. Primary pass at 0 degrees (extracting crops from full-res image if downsampled)
        crop_src_0 = image if abs(scale - 1.0) > 1e-4 else None
        tokens_0 = self._extract_tokens_from_mat(proc_image, curr_w, curr_h, crop_source=crop_src_0, crop_scale=inv_scale)

        STATUTORY_KEYWORDS = (
            "mrp", "₹", "rs.", "net", "qty", "content", "mfg", "pkd", "usp", "exp", "batch",
            "customer", "care", "consumer", "marketed", "manufactured", "imported", "origin", "india"
        )
        stat_0 = sum(1 for t in tokens_0 if any(k in t["text"].lower() for k in STATUTORY_KEYWORDS))

        has_economic_0 = any(
            any(k in t["text"].lower() for k in ("mrp", "₹", "rs.", "usp"))
            and any(c.isdigit() for c in t["text"])
            for t in tokens_0
        )

        raw_candidates = list(tokens_0)

        # 2. Multi-angle 90-degree clockwise probe ONLY if initial pass indicates vertical orientation:
        # Avoid running a redundant second OCR pass on panels that already have rich horizontal text
        needs_rot = (
            (len(tokens_0) < 15) or
            (stat_0 == 0 and len(tokens_0) < 35) or
            (not has_economic_0 and stat_0 < 2 and len(tokens_0) < 30)
        )
        if needs_rot:
            img_90 = cv2.rotate(proc_image, cv2.ROTATE_90_CLOCKWISE)
            crop_src_90 = cv2.rotate(image, cv2.ROTATE_90_CLOCKWISE) if abs(scale - 1.0) > 1e-4 else None
            # In img_90: width is curr_h, height is curr_w
            tokens_90 = self._extract_tokens_from_mat(img_90, curr_h, curr_w, crop_source=crop_src_90, crop_scale=inv_scale)
            stat_90 = sum(1 for t in tokens_90 if any(k in t["text"].lower() for k in STATUTORY_KEYWORDS))

            if stat_90 > 0 or len(tokens_90) > len(tokens_0):
                mapped_90 = []
                for t in tokens_90:
                    # Invert 90-degree CW rotation back to 0-degree: x_0 = y_90, y_0 = curr_h - 1 - x_90
                    poly_90 = t["polygon"]
                    poly_0 = [[float(pt[1]), float(curr_h - 1 - pt[0])] for pt in poly_90]
                    canon_poly_0 = PolygonNormalizer.canonicalize_polygon(poly_0)
                    bbox_0 = PolygonNormalizer.polygon_to_axis_aligned_box(canon_poly_0, curr_w, curr_h)
                    mapped_90.append({
                        "text": t["text"],
                        "confidence": t["confidence"],
                        "polygon": canon_poly_0,
                        "bounding_box": bbox_0,
                        "language": t["language"],
                    })

                if stat_90 > stat_0:
                    # 90-degree orientation captured significantly more statutory text
                    existing_lower = {m["text"].lower().strip() for m in mapped_90}
                    raw_candidates = mapped_90 + [t for t in tokens_0 if t["text"].lower().strip() not in existing_lower]
                else:
                    existing_lower = {t["text"].lower().strip() for t in tokens_0}
                    raw_candidates = tokens_0 + [m for m in mapped_90 if m["text"].lower().strip() not in existing_lower]

        # 3. Inverse scale mapping back to original image dimensions
        inv_scale = 1.0 / scale if abs(scale - 1.0) > 1e-4 else 1.0
        final_tokens: List[OCRToken] = []
        token_idx = 1

        for item in raw_candidates:
            token_text = item["text"].strip()
            # Discard empty strings or noise-only artifacts that artificially depress mean confidence
            if not token_text or item["confidence"] < 0.10:
                continue

            poly = item["polygon"]
            scaled_poly = [
                [int(round(pt[0] * inv_scale)), int(round(pt[1] * inv_scale))]
                for pt in poly
            ]
            canon_scaled = PolygonNormalizer.canonicalize_polygon(scaled_poly)
            int_scaled = [[int(round(p[0])), int(round(p[1]))] for p in canon_scaled]
            bbox = PolygonNormalizer.polygon_to_axis_aligned_box(int_scaled, orig_w, orig_h)
            int_bbox = [int(round(b)) for b in bbox]

            token = OCRToken(
                token_id=f"tok_{token_idx:02d}",
                text=item["text"],
                confidence=round(item["confidence"], 4),
                polygon=int_scaled,
                bounding_box=int_bbox,
                language=item["language"]
            )
            final_tokens.append(token)
            token_idx += 1

        # Compute aggregate metrics
        total_tokens = len(final_tokens)
        mean_conf = (
            float(round(float(np.mean([t.confidence for t in final_tokens])), 4))
            if final_tokens
            else 0.0
        )
        full_text = "\n".join(t.text for t in final_tokens if t.text.strip())
        execution_time_ms = int(round((time.perf_counter() - start_time) * 1000))

        return OCROutput(
            image_id=image_id,
            total_tokens=total_tokens,
            mean_confidence=mean_conf,
            tokens=final_tokens,
            full_text=full_text,
            execution_time_ms=execution_time_ms
        )
