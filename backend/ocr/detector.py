"""DBNet++ Multi-Oriented Text Detection Engine (SIH26034 - Nirikshak)

Architecture & Specification Compliance:
- Stage 6: DBNet++ Real-Time Scene Text Detection (ADR-05, ADR-06)
- 4-point oriented polygon extraction with Pyclipper Vatti polygon expansion
- ONNX Runtime CPU execution provider (intra_op_num_threads optimization)
- Multi-oriented text detection preserving rotated bounding polygons
- Zero AGPL-3.0 dependencies (Apache-2.0 / MIT only)
"""

import os
import logging
from typing import Any, Dict, List, Optional, Tuple, Union
import numpy as np
import cv2
import pyclipper
from shapely.geometry import Polygon

try:
    import onnxruntime as ort
    ONNX_AVAILABLE = True
except ImportError:
    ONNX_AVAILABLE = False
try:
    from backend.ocr.polygon_normalizer import PolygonNormalizer
except ImportError:
    from polygon_normalizer import PolygonNormalizer

logger = logging.getLogger(__name__)


class TextDetectionResult:
    """Encapsulates a detected text region."""

    def __init__(
        self,
        polygon: List[List[int]],
        confidence: float,
        bounding_box: Optional[List[int]] = None,
        backend: str = "DBNet++_ONNX"
    ):
        self.polygon = PolygonNormalizer.canonicalize_polygon(polygon)
        self.confidence = float(min(max(confidence, 0.0), 1.0))
        self.bounding_box = (
            bounding_box
            if bounding_box is not None
            else PolygonNormalizer.polygon_to_axis_aligned_box(self.polygon)
        )
        self.backend = backend

    def to_dict(self) -> Dict[str, Any]:
        return {
            "polygon": self.polygon,
            "confidence": self.confidence,
            "bounding_box": self.bounding_box,
            "backend": self.backend,
        }


class DBNetTextDetector:
    """DBNet++ Scene Text Detection using ONNX Runtime CPU Inference."""

    def __init__(
        self,
        model_path: Optional[str] = None,
        conf_thresh: float = 0.3,
        box_thresh: float = 0.6,
        unclip_ratio: float = 1.5,
        max_side_len: Optional[int] = None,
        num_threads: int = 4,
        allow_classical_fallback: bool = False,
        execution_mode: str = "FP32"
    ):
        if max_side_len is None:
            max_side_len = int(os.environ.get("DBNET_MAX_SIDE_LEN", "1920"))
        self.execution_mode = execution_mode.upper()
        models_dir = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "models"
        )
        if model_path is None:
            env_path = os.environ.get("DBNET_MODEL_PATH")
            if env_path and os.path.exists(env_path):
                model_path = env_path
            else:
                if self.execution_mode == "INT8":
                    default_path = os.path.join(models_dir, "int8", "ch_PP-OCRv4_det_int8.onnx")
                    if not os.path.exists(default_path) and not allow_classical_fallback:
                        raise FileNotFoundError(f"INT8 detector model not found at: {default_path}")
                    model_path = default_path if os.path.exists(default_path) else None
                else:
                    default_path = os.path.join(models_dir, "ch_PP-OCRv4_det.onnx")
                    if os.path.exists(default_path):
                        model_path = default_path

        self.model_path = model_path
        self.conf_thresh = conf_thresh
        self.box_thresh = box_thresh
        self.unclip_ratio = unclip_ratio
        self.max_side_len = max_side_len
        self.num_threads = num_threads
        self.allow_classical_fallback = allow_classical_fallback
        self.session: Optional[Any] = None

        if self.execution_mode == "INT8" and model_path is not None and not os.path.exists(model_path) and not allow_classical_fallback:
            raise FileNotFoundError(f"INT8 detector model not found at: {model_path}")

        if model_path and os.path.exists(model_path) and ONNX_AVAILABLE:
            self._init_session(model_path)

        if self.session is not None:
            self.backend = "DBNet++_ONNX" if self.execution_mode == "FP32" else f"DBNet++_ONNX_{self.execution_mode}"
        else:
            self.backend = "OPENCV_ALGORITHMIC" if allow_classical_fallback else "NONE"

    def _init_session(self, model_path: str) -> None:
        """Initializes ONNX Runtime session with CPU optimization options."""
        opts = ort.SessionOptions()
        opts.intra_op_num_threads = self.num_threads
        opts.execution_mode = ort.ExecutionMode.ORT_SEQUENTIAL
        opts.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
        self.session = ort.InferenceSession(
            model_path,
            sess_options=opts,
            providers=["CPUExecutionProvider"]
        )
        logger.info(f"Loaded DBNet++ ONNX model from {model_path} with {self.num_threads} CPU threads")

    def preprocess(self, image: np.ndarray) -> Tuple[np.ndarray, Tuple[int, int], Tuple[int, int]]:
        """Preprocesses image for DBNet++:
        - Scales image while preserving aspect ratio, ensuring dimensions are multiples of 32
        - Normalizes pixel values via ImageNet mean/std
        - Returns (tensor [1, 3, H, W], original_shape, resized_shape)
        """
        orig_h, orig_w = image.shape[:2]

        # Calculate scale factor bounded by max_side_len
        scale = min(self.max_side_len / max(orig_h, orig_w), 1.0)
        target_h = int(round(orig_h * scale / 32) * 32)
        target_w = int(round(orig_w * scale / 32) * 32)
        target_h = max(target_h, 32)
        target_w = max(target_w, 32)

        resized = cv2.resize(image, (target_w, target_h), interpolation=cv2.INTER_LINEAR)

        # Convert to 3-channel RGB cleanly across 1-ch, 3-ch, and 4-ch inputs
        if len(resized.shape) == 2:
            resized = cv2.cvtColor(resized, cv2.COLOR_GRAY2RGB)
        elif len(resized.shape) == 3:
            if resized.shape[2] == 4:
                resized = cv2.cvtColor(resized, cv2.COLOR_BGRA2RGB)
            elif resized.shape[2] == 1:
                resized = cv2.cvtColor(resized, cv2.COLOR_GRAY2RGB)
            elif resized.shape[2] == 3:
                resized = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)
            else:
                resized = resized[:, :, :3]

        img_float = np.nan_to_num(resized.astype(np.float32) / 255.0, nan=0.0, posinf=1.0, neginf=0.0)
        img_float = np.clip(img_float, 0.0, 1.0)
        mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
        std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
        normalized = (img_float - mean) / std

        # Transpose HWC -> CHW -> NCHW as contiguous array
        tensor = np.ascontiguousarray(np.transpose(normalized, (2, 0, 1))[np.newaxis, :, :, :], dtype=np.float32)
        return tensor, (orig_h, orig_w), (target_h, target_w)

    def unclip(self, box: np.ndarray, unclip_ratio: float = 1.5) -> Optional[np.ndarray]:
        """Expands shrunk text segmentation polygon using Pyclipper Vatti polygon offset."""
        poly = Polygon(box)
        distance = poly.area * unclip_ratio / (poly.length + 1e-6)
        offset = pyclipper.PyclipperOffset()
        offset.AddPath(box.tolist(), pyclipper.JT_ROUND, pyclipper.ET_CLOSEDPOLYGON)
        expanded = offset.Execute(distance)
        if not expanded:
            return None
        return np.array(expanded[0])

    def box_score_fast(self, bitmap: np.ndarray, contour: np.ndarray) -> float:
        """Computes mean probability score of the text box region."""
        h, w = bitmap.shape[:2]
        contour_pts = contour.copy()
        xmin = np.clip(int(np.floor(contour_pts[:, 0].min())), 0, w - 1)
        xmax = np.clip(int(np.ceil(contour_pts[:, 0].max())), 0, w - 1)
        ymin = np.clip(int(np.floor(contour_pts[:, 1].min())), 0, h - 1)
        ymax = np.clip(int(np.ceil(contour_pts[:, 1].max())), 0, h - 1)

        mask = np.zeros((ymax - ymin + 1, xmax - xmin + 1), dtype=np.uint8)
        contour_pts[:, 0] = contour_pts[:, 0] - xmin
        contour_pts[:, 1] = contour_pts[:, 1] - ymin
        cv2.fillPoly(mask, [contour_pts.astype(np.int32)], 1)
        return float(cv2.mean(bitmap[ymin : ymax + 1, xmin : xmax + 1], mask)[0])

    def postprocess(
        self,
        prob_map: np.ndarray,
        orig_shape: Tuple[int, int],
        scaled_shape: Tuple[int, int]
    ) -> List[TextDetectionResult]:
        """Decodes DBNet++ probability map into canonical 4-point oriented polygons."""
        orig_h, orig_w = orig_shape
        scaled_h, scaled_w = scaled_shape

        # Squeeze batch/channel dims if present
        if prob_map.ndim == 4:
            prob_map = prob_map[0, 0]
        elif prob_map.ndim == 3:
            prob_map = prob_map[0]

        pred = (prob_map > self.conf_thresh).astype(np.uint8)
        contours, _ = cv2.findContours(pred, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)

        results: List[TextDetectionResult] = []
        scale_x = orig_w / scaled_w
        scale_y = orig_h / scaled_h

        for contour in contours:
            if len(contour) < 4:
                continue

            # Compute min area bounding box
            pts = contour.reshape(-1, 2)
            if len(pts) < 3:
                continue

            score = self.box_score_fast(prob_map, pts)
            if score < self.box_thresh:
                continue

            # Unclip polygon
            expanded = self.unclip(pts, self.unclip_ratio)
            if expanded is None or len(expanded) < 4:
                continue

            rect = cv2.minAreaRect(expanded)
            box = cv2.boxPoints(rect)

            # Check min edge size to filter noise
            w_rect, h_rect = rect[1]
            if min(w_rect, h_rect) < 3:
                continue

            # Scale back to original image coordinates
            orig_box = box.copy()
            orig_box[:, 0] = orig_box[:, 0] * scale_x
            orig_box[:, 1] = orig_box[:, 1] * scale_y

            # Clamp to image dimensions
            orig_box[:, 0] = np.clip(orig_box[:, 0], 0, orig_w)
            orig_box[:, 1] = np.clip(orig_box[:, 1], 0, orig_h)

            polygon_list = orig_box.tolist()
            is_valid, _ = PolygonNormalizer.validate_polygon(polygon_list, orig_w, orig_h)
            if not is_valid:
                continue

            canonical_polygon = PolygonNormalizer.canonicalize_polygon(polygon_list)
            results.append(TextDetectionResult(canonical_polygon, score, backend="DBNet++_ONNX"))

        # Sort top-to-bottom, left-to-right
        results.sort(key=lambda r: (r.bounding_box[0], r.bounding_box[1]))
        return results

    def _algorithmic_detect(self, image: np.ndarray) -> List[TextDetectionResult]:
        """High-precision gradient and morphological text candidate locator.
        Enables deterministic text localization in offline and weight-free environments.
        """
        orig_h, orig_w = image.shape[:2]
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) if len(image.shape) == 3 else image

        # Binarize with Otsu according to background polarity
        mean_val = float(np.mean(gray))
        thresh_type = cv2.THRESH_BINARY_INV if mean_val > 127 else cv2.THRESH_BINARY
        _, binary = cv2.threshold(gray, 0, 255, thresh_type + cv2.THRESH_OTSU)

        # Connect horizontal characters into cohesive text lines
        connect_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (15, 3))
        connected = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, connect_kernel)

        contours, _ = cv2.findContours(connected, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        results: List[TextDetectionResult] = []

        for c in contours:
            area = cv2.contourArea(c)
            if area < 40:
                continue
            x, y, w, h = cv2.boundingRect(c)
            if w < 10 or h < 6 or h > orig_h * 0.8:
                continue

            rect = cv2.minAreaRect(c)
            box = cv2.boxPoints(rect)
            poly_list = box.tolist()

            is_valid, _ = PolygonNormalizer.validate_polygon(poly_list, orig_w, orig_h, min_area=30.0)
            if is_valid:
                canonical = PolygonNormalizer.canonicalize_polygon(poly_list)
                results.append(TextDetectionResult(canonical, confidence=0.88, backend="OPENCV_ALGORITHMIC"))

        results.sort(key=lambda r: (r.bounding_box[0], r.bounding_box[1]))
        return results


    def detect(self, image: np.ndarray) -> List[TextDetectionResult]:
        """Detects text regions in the input image.

        If an ONNX model is loaded, runs DBNet++ inference session.
        If not loaded and allow_classical_fallback is True, executes algorithmic fallback.
        Otherwise raises RuntimeError preventing silent unverified fallback.
        """
        if image is None or image.size == 0 or len(image.shape) < 2 or image.shape[0] < 4 or image.shape[1] < 4:
            return []

        if self.session is not None:
            tensor, orig_shape, scaled_shape = self.preprocess(image)
            input_name = self.session.get_inputs()[0].name
            outputs = self.session.run(None, {input_name: tensor})
            prob_map = outputs[0]
            return self.postprocess(prob_map, orig_shape, scaled_shape)
        elif self.allow_classical_fallback:
            logger.warning("DBNet++ session uninitialized: executing DEGRADED OPENCV_ALGORITHMIC detection fallback.")
            return self._algorithmic_detect(image)
        else:
            raise RuntimeError(
                "DBNet++ neural weights not initialized. Silent classical fallback is prohibited in production mode. "
                "Run 'python backend/ocr/scripts/download_models.py' or explicitly pass allow_classical_fallback=True."
            )
