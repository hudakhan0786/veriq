"""Tesseract v5 Fallback & Deterministic OCR Consensus Engine (SIH26034 - Nirikshak)

Architecture & Specification Compliance:
- ADR-06 & Stage 7: Secondary consensus fallback on low-confidence crops (conf < 0.65)
- Deterministic multi-factor consensus arbitration (agreement, script plausibility, token validity)
- Zero LLM dependencies, 100% deterministic reproducibility
- Graceful handling when Tesseract binary is absent (never crashes the system)
- Zero AGPL-3.0 dependencies (Apache-2.0 / MIT only)
"""

import os
import re
import logging
from typing import Optional, Tuple
import numpy as np

logger = logging.getLogger(__name__)

# Try importing pytesseract
try:
    import pytesseract
    PYTESSERACT_INSTALLED = True
except ImportError:
    pytesseract = None
    PYTESSERACT_INSTALLED = False

STATUTORY_KEYWORDS_REGEX = re.compile(
    r"\b(mrp|rs|inr|net|qty|quantity|weight|wt|mfd|mfg|exp|batch|usp|consumer|care|india|ग्राम|मूल्य|मात्रा|तिथि)\b",
    re.IGNORECASE
)


class TesseractFallback:
    """Tesseract v5 LSTM Secondary OCR Engine."""

    def __init__(self, lang: str = "eng+hin", psm: int = 7, oem: int = 1):
        self.lang = lang
        self.psm = psm
        self.oem = oem
        self._available: Optional[bool] = None
        self._configure_binary()

    @classmethod
    def _configure_binary(cls) -> None:
        """Discovers and sets Tesseract binary executable across platforms."""
        if not PYTESSERACT_INSTALLED or pytesseract is None:
            return

        candidates = [
            os.environ.get("TESSERACT_CMD"),
            r"C:\Program Files\Tesseract-OCR\tesseract.exe",
            r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
            "/usr/bin/tesseract",
            "/usr/local/bin/tesseract",
        ]
        for c in candidates:
            if c and os.path.exists(c):
                pytesseract.pytesseract.tesseract_cmd = c
                break

    def _get_config(self) -> str:
        """Constructs Tesseract configuration string with tessdata directory if needed."""
        models_dir = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            "models"
        )
        hin_traineddata = os.path.join(models_dir, "hin.traineddata")
        eng_traineddata = os.path.join(models_dir, "eng.traineddata")
        config = f"--psm {self.psm} --oem {self.oem} -l {self.lang}"
        # Only override --tessdata-dir if models_dir contains both eng and hin models
        # Otherwise, default to system tessdata where tesseract-ocr-hin is installed
        if os.path.exists(hin_traineddata) and os.path.exists(eng_traineddata):
            config = f"--tessdata-dir \"{models_dir}\" " + config
        return config

    def is_available(self) -> bool:
        """Checks if pytesseract module and system Tesseract binary are functional."""
        if self._available is not None:
            return self._available

        if not PYTESSERACT_INSTALLED:
            self._available = False
            return False

        try:
            self._configure_binary()
            _ = pytesseract.get_tesseract_version()
            self._available = True
        except Exception as e:
            logger.warning(f"Tesseract executable not available on system: {e}")
            self._available = False

        return self._available

    def recognize(self, crop: np.ndarray) -> Optional[Tuple[str, float]]:
        """Executes Tesseract OCR on a cropped text patch.

        Returns:
            (transcribed_text, confidence_score [0.0 - 1.0]) or None if unavailable.
        """
        if not self.is_available() or crop is None or crop.size == 0:
            return None

        try:
            config = self._get_config()
            data = pytesseract.image_to_data(
                crop,
                output_type=pytesseract.Output.DICT,
                config=config
            )

            texts = []
            confs = []
            for text, conf in zip(data["text"], data["conf"]):
                clean_t = text.strip()
                if clean_t:
                    texts.append(clean_t)
                    try:
                        c_val = float(conf)
                        if c_val >= 0:
                            confs.append(c_val / 100.0)
                    except (ValueError, TypeError):
                        pass

            if not texts:
                return "", 0.0

            joined_text = " ".join(texts)
            mean_conf = float(np.mean(confs)) if confs else 0.50
            return joined_text, mean_conf

        except Exception as e:
            logger.warning(f"Tesseract fallback recognition failed: {e}")
            return None


class OCRConsensusEngine:
    """Deterministic Arbitration Engine between Primary (PP-OCRv4) and Secondary (Tesseract)."""

    @staticmethod
    def compute_levenshtein_similarity(s1: str, s2: str) -> float:
        """Computes normalized string similarity in [0.0, 1.0] using Levenshtein distance."""
        if s1 == s2:
            return 1.0
        if not s1 or not s2:
            return 0.0

        # Bound maximum string length to prevent O(N*M) CPU exhaustion
        # Single OCR token strings never exceed 256 characters under statutory labeling
        s1 = s1[:256]
        s2 = s2[:256]

        n, m = len(s1), len(s2)
        # Memory-efficient and cache-friendly rolling 1D DP rows
        prev = list(range(m + 1))
        curr = [0] * (m + 1)

        for i in range(1, n + 1):
            curr[0] = i
            c1 = s1[i - 1].lower()
            for j in range(1, m + 1):
                cost = 0 if c1 == s2[j - 1].lower() else 1
                curr[j] = min(
                    prev[j] + 1,       # Deletion
                    curr[j - 1] + 1,   # Insertion
                    prev[j - 1] + cost # Substitution
                )
            prev, curr = curr, prev

        dist = prev[m]
        max_len = max(n, m)
        return float(1.0 - (dist / max_len))

    @staticmethod
    def score_plausibility(text: str) -> float:
        """Scores syntactic and lexical plausibility of packaging text in [0.0, 1.0]."""
        if not text or not text.strip():
            return 0.0

        chars = [c for c in text if not c.isspace()]
        if not chars:
            return 0.0

        # Count valid characters: alphanumeric, Indic, and statutory symbols
        valid_count = 0
        for c in chars:
            if c.isalnum() or ("\u0900" <= c <= "\u097F") or c in "₹/.-:()%,":
                valid_count += 1

        char_ratio = valid_count / len(chars)

        # Keyword bonus
        keyword_bonus = 0.20 if STATUTORY_KEYWORDS_REGEX.search(text) else 0.0
        # Penalize excessive repeated non-alphanumeric noise
        noise_penalty = 0.30 if re.search(r"[!@#$%^&*_=+~`|\\{}\[\]]{2,}", text) else 0.0

        score = char_ratio + keyword_bonus - noise_penalty
        return float(min(max(score, 0.0), 1.0))

    @classmethod
    def resolve(
        cls,
        primary_text: str,
        primary_conf: float,
        fallback_text: Optional[str],
        fallback_conf: Optional[float]
    ) -> Tuple[str, float, str]:
        """Resolves OCR consensus deterministically.

        Returns:
            (resolved_text, resolved_confidence, consensus_verdict)
        """
        # If fallback is unavailable or wasn't invoked
        if fallback_text is None or fallback_conf is None:
            return primary_text, primary_conf, "PRIMARY_ACCEPTED"

        p_text = primary_text.strip()
        f_text = fallback_text.strip()

        # 1. Check exact or high string agreement
        sim = cls.compute_levenshtein_similarity(p_text, f_text)
        if sim >= 0.80:
            # Both engines agree closely -> boost confidence
            boosted_conf = min(1.0, max(primary_conf, fallback_conf) + 0.15)
            # Choose the string with higher plausibility
            p_score = cls.score_plausibility(p_text)
            f_score = cls.score_plausibility(f_text)
            chosen_text = p_text if p_score >= f_score else f_text
            return chosen_text, boosted_conf, "CONSENSUS_AGREED"

        # 2. Significant disagreement: evaluate plausibility
        p_plaus = cls.score_plausibility(p_text)
        f_plaus = cls.score_plausibility(f_text)

        # If primary has very low confidence and fallback is significantly more plausible
        if primary_conf < 0.50 and f_plaus >= 0.70 and f_plaus > (p_plaus + 0.25):
            calibrated_conf = min(fallback_conf, 0.85)
            return f_text, calibrated_conf, "FALLBACK_ACCEPTED"

        # If fallback is garbage or low plausibility, keep primary
        if f_plaus < 0.30 or not f_text:
            return p_text, primary_conf, "PRIMARY_ACCEPTED"

        # If primary is reasonably plausible, default to primary
        if p_plaus >= f_plaus:
            return p_text, primary_conf, "PRIMARY_ACCEPTED"

        # Weighted decision when both are somewhat plausible
        p_combined = primary_conf * 0.4 + p_plaus * 0.6
        f_combined = fallback_conf * 0.4 + f_plaus * 0.6

        if f_combined > p_combined + 0.15:
            return f_text, fallback_conf, "FALLBACK_ACCEPTED"

        return p_text, primary_conf, "PRIMARY_ACCEPTED"
