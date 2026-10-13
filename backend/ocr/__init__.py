"""Member 2: Multilingual OCR Module (SIH26034 - Nirikshak)"""

from .polygon_normalizer import PolygonNormalizer
from .detector import DBNetTextDetector, TextDetectionResult
from .recognizer import PPOCRv4Recognizer, CTCLabelDecode
from .fallback import TesseractFallback, OCRConsensusEngine
from .engine import MultilingualOCREngine

__all__ = [
    "PolygonNormalizer",
    "DBNetTextDetector",
    "TextDetectionResult",
    "PPOCRv4Recognizer",
    "CTCLabelDecode",
    "TesseractFallback",
    "OCRConsensusEngine",
    "MultilingualOCREngine",
]
