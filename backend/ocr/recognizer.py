"""PaddleOCR Multilingual Recognition Engine (SIH26034 - Nirikshak)

Architecture & Specification Compliance:
- Stage 7: Multilingual Text Recognition (ADR-06)
- Architecture: PP-OCRv4 English Recognition + PP-OCRv3 Devanagari Hindi Recognition
  (Upstream PaddleOCR provides Devanagari recognition via the PP-OCRv3 multilingual architecture)
- Supported scripts: English (Latin) and Hindi (Devanagari) per statutory requirements
- CTC greedy decoding (CTCLabelDecode) with character-level confidence scores
- ONNX Runtime CPU inference session (sequential, multi-threaded)
- Preserves raw observed packaging strings (Zero semantic auto-correction per Rule 19)
- Zero AGPL-3.0 dependencies (Apache-2.0 / MIT only)
"""

import os
import re
import logging
from typing import Any, Dict, List, Optional, Tuple, Union
import numpy as np
import cv2

try:
    import onnxruntime as ort
    ONNX_AVAILABLE = True
except ImportError:
    ONNX_AVAILABLE = False

logger = logging.getLogger(__name__)

# Default character set covering Latin, Devanagari, digits, currency, and punctuation
DEFAULT_CHAR_LIST = [
    # Index 0: CTC blank token
    "<blank>",
    # Digits and ASCII punctuation
    " ", "!", '"', "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/",
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    ":", ";", "<", "=", ">", "?", "@",
    # Latin Uppercase
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    "[", "\\", "]", "^", "_", "`",
    # Latin Lowercase
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
    "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
    "{", "|", "}", "~",
    # Indian Currency Symbol
    "₹",
    # Devanagari Numerals (०-९)
    "०", "१", "२", "३", "४", "५", "६", "७", "८", "९",
    # Devanagari Vowels and Modifiers
    "ँ", "ं", "ः", "अ", "आ", "इ", "ई", "उ", "ऊ", "ऋ", "ए", "ऐ", "ओ", "औ",
    # Devanagari Consonants
    "क", "ख", "ग", "घ", "ङ", "च", "छ", "ज", "झ", "ञ",
    "ट", "ठ", "ड", "ढ", "ण", "त", "थ", "द", "ध", "न",
    "प", "फ", "ब", "भ", "म", "य", "र", "ल", "व", "श", "ष", "स", "ह",
    # Devanagari Matras and Signs
    "़", "ा", "ि", "ी", "ु", "ू", "ृ", "े", "ै", "ो", "ौ", "्", "।", "॥",
]

DEVANAGARI_REGEX = re.compile(r"[\u0900-\u097F]")


class CTCLabelDecode:
    """Connectionist Temporal Classification (CTC) greedy decoder."""

    def __init__(self, character_list: Optional[List[str]] = None):
        self.character_list = character_list if character_list is not None else DEFAULT_CHAR_LIST
        self.char_to_idx = {char: idx for idx, char in enumerate(self.character_list)}

    def decode(self, logits: np.ndarray) -> Tuple[str, float, List[float]]:
        """Greedy CTC decode from logits or probabilities.

        Takes:
            logits: Array of shape (time_steps, vocab_size)
        Returns:
            (decoded_text, mean_confidence, per_character_confidences)
        """
        if logits is None or logits.size == 0:
            return "", 0.0, []

        if logits.ndim == 3:
            logits = logits[0]  # Squeeze batch dim

        logits = np.nan_to_num(logits, nan=0.0, posinf=10.0, neginf=-10.0)
        time_steps, vocab_size = logits.shape

        # If values already sum to ~1.0, they are already softmax probabilities from ONNX
        row_sums = np.sum(logits, axis=-1)
        if np.all(np.abs(row_sums - 1.0) < 0.05):
            probs = logits
        else:
            exp_logits = np.exp(logits - np.max(logits, axis=-1, keepdims=True))
            probs = exp_logits / (np.sum(exp_logits, axis=-1, keepdims=True) + 1e-9)

        preds = np.argmax(probs, axis=-1)
        pred_probs = np.max(probs, axis=-1)

        char_indices: List[int] = []
        char_confidences: List[float] = []

        prev_idx = -1
        for t in range(time_steps):
            idx = int(preds[t])
            # Index 0 is CTC blank; collapse repeated consecutive identical tokens
            if idx != 0 and idx != prev_idx:
                if idx < len(self.character_list):
                    char_indices.append(idx)
                    char_confidences.append(float(pred_probs[t]))
            prev_idx = idx

        if not char_indices:
            return "", 0.0, []

        decoded_text = "".join(self.character_list[i] for i in char_indices)
        mean_conf = float(np.mean(char_confidences))
        return decoded_text, mean_conf, char_confidences


class PPOCRv4Recognizer:
    """PaddleOCR Multilingual Text Recognizer with CPU Optimization.
    Supports English (Latin via PP-OCRv4) and Hindi (Devanagari via PP-OCRv3 Devanagari Rec).
    """

    def __init__(
        self,
        model_path: Optional[str] = None,
        character_dict_path: Optional[str] = None,
        en_model_path: Optional[str] = None,
        en_dict_path: Optional[str] = None,
        hi_model_path: Optional[str] = None,
        hi_dict_path: Optional[str] = None,
        rec_image_height: int = 48,
        rec_batch_num: int = 6,
        num_threads: int = 6,
        execution_mode: str = "FP32"
    ):
        self.execution_mode = execution_mode.upper()
        self.rec_image_height = rec_image_height
        self.rec_batch_num = rec_batch_num
        self.num_threads = num_threads

        models_dir = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "models"
        )

        # 1. Resolve English Model & Vocabulary
        if en_model_path is None:
            if model_path is not None:
                en_model_path = model_path
            else:
                env_en = os.environ.get("PPOCR_EN_MODEL_PATH")
                if env_en and os.path.exists(env_en):
                    en_model_path = env_en
                elif self.execution_mode == "INT8":
                    default_en = os.path.join(models_dir, "int8", "en_PP-OCRv4_rec_infer_int8.onnx")
                    if not os.path.exists(default_en):
                        raise FileNotFoundError(f"INT8 English recognizer model not found at: {default_en}")
                    en_model_path = default_en
                else:
                    default_en = os.path.join(models_dir, "en_PP-OCRv4_rec_infer.onnx")
                    en_model_path = default_en if os.path.exists(default_en) else None

        if en_dict_path is None:
            if character_dict_path is not None:
                en_dict_path = character_dict_path
            else:
                default_dict = os.path.join(models_dir, "en_dict.txt")
                en_dict_path = default_dict if os.path.exists(default_dict) else None

        if self.execution_mode == "INT8" and en_model_path is not None and not os.path.exists(en_model_path):
            raise FileNotFoundError(f"INT8 English recognizer model not found at: {en_model_path}")

        self.en_model_path = en_model_path
        self.en_dict_path = en_dict_path
        self.en_decoder = self._build_decoder(en_dict_path)
        self.en_session = self._init_session(en_model_path) if (en_model_path and ONNX_AVAILABLE) else None

        # 2. Resolve Hindi (Devanagari) Model & Vocabulary
        if hi_model_path is None:
            env_hi = os.environ.get("PPOCR_HI_MODEL_PATH")
            if env_hi and os.path.exists(env_hi):
                hi_model_path = env_hi
            elif self.execution_mode == "INT8":
                default_hi = os.path.join(models_dir, "int8", "devanagari_PP-OCRv4_rec_int8.onnx")
                if not os.path.exists(default_hi):
                    v3_int8 = os.path.join(models_dir, "int8", "devanagari_PP-OCRv3_rec_int8.onnx")
                    if os.path.exists(v3_int8):
                        default_hi = v3_int8
                    else:
                        raise FileNotFoundError(f"INT8 Devanagari recognizer model not found at: {default_hi}")
                hi_model_path = default_hi
            else:
                v3_path = os.path.join(models_dir, "devanagari_PP-OCRv3_rec.onnx")
                v4_alias = os.path.join(models_dir, "devanagari_PP-OCRv4_rec.onnx")
                default_hi = v3_path if os.path.exists(v3_path) else v4_alias
                hi_model_path = default_hi if os.path.exists(default_hi) else None

        if hi_dict_path is None:
            default_hi_dict = os.path.join(models_dir, "devanagari_dict.txt")
            hi_dict_path = default_hi_dict if os.path.exists(default_hi_dict) else None

        if self.execution_mode == "INT8" and hi_model_path is not None and not os.path.exists(hi_model_path):
            raise FileNotFoundError(f"INT8 Devanagari recognizer model not found at: {hi_model_path}")

        self.hi_model_path = hi_model_path
        self.hi_dict_path = hi_dict_path
        self.hi_decoder = self._build_decoder(hi_dict_path)
        self.hi_session = self._init_session(hi_model_path) if (hi_model_path and ONNX_AVAILABLE) else None

        # Canonical Model Provenance Metadata (Separating Filename from Identity)
        self.en_model_version = "PP-OCRv4"
        self.en_model_identity = "PP-OCRv4 English recognition"
        self.hi_model_version = "PP-OCRv3"
        self.hi_model_identity = "PP-OCRv3 Devanagari recognition"
        self.hi_model_provenance_note = (
            "The local filename is inherited from downstream artifact distribution. "
            "Upstream PaddleOCR never released a PP-OCRv4 Devanagari model; the underlying "
            "model is officially devanagari_PP-OCRv3_rec."
        )
        self.backend = f"PPOCR_ONNX_{self.execution_mode}"

        # Backwards compatibility attributes
        self.model_path = en_model_path or hi_model_path
        self.session = self.en_session or self.hi_session
        self.decoder = self.en_decoder

    def _build_decoder(self, dict_path: Optional[str]) -> CTCLabelDecode:
        """Loads vocabulary list according to PaddleOCR convention."""
        if dict_path and os.path.exists(dict_path):
            with open(dict_path, "r", encoding="utf-8") as f:
                lines = [line.strip("\r\n") for line in f.readlines()]
                # PaddleOCR convention: Class 0 = blank, Classes 1..N = lines, Class N+1 = space
                character_list = ["<blank>"] + lines + [" "]
                return CTCLabelDecode(character_list)
        return CTCLabelDecode(None)

    def _init_session(self, model_path: Optional[str]) -> Optional[Any]:
        """Initializes ONNX Runtime CPU inference session."""
        if not model_path or not os.path.exists(model_path) or not ONNX_AVAILABLE:
            return None
        opts = ort.SessionOptions()
        opts.intra_op_num_threads = self.num_threads
        opts.execution_mode = ort.ExecutionMode.ORT_SEQUENTIAL
        opts.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
        sess = ort.InferenceSession(
            model_path,
            sess_options=opts,
            providers=["CPUExecutionProvider"]
        )
        logger.info(f"Loaded PP-OCRv4 ONNX model from {model_path} with {self.num_threads} CPU threads")
        return sess

    @classmethod
    def detect_language(cls, text: str) -> str:
        """Identifies language: 'hi' for Devanagari Hindi, 'en' for English/Latin."""
        if text and DEVANAGARI_REGEX.search(text):
            return "hi"
        return "en"

    def preprocess_crop(self, crop: np.ndarray, max_wh_ratio: Optional[float] = None) -> np.ndarray:
        """Preprocesses a single crop patch to height 48 with aspect ratio preservation.
        Normalizes pixel intensities to [-1.0, 1.0] and produces a C-contiguous float32 CHW tensor.
        """
        if crop is None or crop.size == 0:
            return np.zeros((3, self.rec_image_height, 16), dtype=np.float32)

        if not np.isfinite(crop).all():
            crop = np.nan_to_num(crop, nan=0.0, posinf=255.0, neginf=0.0)

        img_h, img_w = crop.shape[:2]
        h = self.rec_image_height

        if max_wh_ratio is not None:
            w = int(round(h * max_wh_ratio))
        else:
            aspect = img_w / max(img_h, 1)
            w = int(round(h * aspect))
        w = min(max(w, 16), 4096)

        if img_h == h and img_w == w:
            resized = crop
        else:
            resized = cv2.resize(crop, (w, h), interpolation=cv2.INTER_LINEAR)

        # Convert to RGB if needed across 1-ch, 3-ch, and 4-ch inputs
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

        # Vectorized C-contiguous normalization: (x / 255.0 - 0.5) / 0.5 == x * (2.0 / 255.0) - 1.0
        scale = np.float32(2.0 / 255.0)
        bias = np.float32(-1.0)
        chw = np.ascontiguousarray(np.transpose(resized, (2, 0, 1)))
        tensor = np.empty((3, h, w), dtype=np.float32)
        np.multiply(chw, scale, out=tensor, casting="unsafe")
        np.add(tensor, bias, out=tensor)
        return tensor

    def _infer_session(
        self,
        session: Any,
        decoder: CTCLabelDecode,
        crop: np.ndarray,
        expected_lang: str
    ) -> Tuple[str, float, str]:
        """Runs a single crop through a specific ONNX session and CTC decoder."""
        tensor = self.preprocess_crop(crop)[np.newaxis, :, :, :]
        input_name = session.get_inputs()[0].name
        outputs = session.run(None, {input_name: tensor})
        logits = outputs[0]
        text, conf, _ = decoder.decode(logits)
        lang = self.detect_language(text) or expected_lang
        return text, conf, lang

    def recognize(self, crop: np.ndarray, lang: str = "auto") -> Tuple[str, float, str]:
        """Recognizes text from a single perspective-rectified crop patch.

        Supports multilingual automatic script selection or explicit script routing.

        Returns:
            (transcribed_text, confidence_score, language_code)
        """
        if crop is None or crop.size == 0:
            return "", 0.0, "en"

        # Explicit Hindi selection
        if lang == "hi" and self.hi_session is not None:
            return self._infer_session(self.hi_session, self.hi_decoder, crop, "hi")

        # Explicit English selection
        if lang == "en" and self.en_session is not None:
            return self._infer_session(self.en_session, self.en_decoder, crop, "en")

        # Automatic multilingual dispatch:
        en_text, en_conf, _ = "", 0.0, "en"
        if self.en_session is not None:
            en_text, en_conf, _ = self._infer_session(self.en_session, self.en_decoder, crop, "en")
            # If English model produces high confidence with no Devanagari noise, accept directly
            if en_conf >= 0.85 and len(en_text.strip()) > 0 and not DEVANAGARI_REGEX.search(en_text):
                return en_text, en_conf, "en"

        # If English confidence is low (< 0.85) or Devanagari characters are suspected, evaluate Hindi model
        if self.hi_session is not None:
            hi_text, hi_conf, _ = self._infer_session(self.hi_session, self.hi_decoder, crop, "hi")
            has_devanagari = DEVANAGARI_REGEX.search(hi_text) is not None
            if (has_devanagari or hi_conf > en_conf) and len(hi_text.strip()) > 0 and hi_conf > 0.40:
                return hi_text, hi_conf, ("hi" if has_devanagari else "en")

        if en_text:
            return en_text, en_conf, self.detect_language(en_text)

        # Fallback if no ONNX sessions are available
        if self.en_session is None and self.hi_session is None:
            try:
                from fallback import TesseractFallback
                tb = TesseractFallback()
                if tb.is_available():
                    res = tb.recognize(crop)
                    if res and res[0].strip():
                        return res[0], res[1], self.detect_language(res[0])
            except Exception:
                pass

        return "", 0.0, "en"

    def recognize_batch(self, crops: List[np.ndarray], lang: str = "auto") -> List[Tuple[str, float, str]]:
        """Recognizes a batch of text crops efficiently on CPU."""
        if not crops:
            return []

        results: List[Tuple[str, float, str]] = []
        for crop in crops:
            results.append(self.recognize(crop, lang=lang))
        return results
