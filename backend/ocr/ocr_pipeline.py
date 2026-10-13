"""Member 2 OCR Pipeline Entrypoint (SIH26034 - Nirikshak)

Usage:
    python -m backend.ocr.ocr_pipeline [image_path]
"""

import sys
import json
import logging
from pathlib import Path

SRC_DIR = Path(__file__).resolve().parent
REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from engine import MultilingualOCREngine
from polygon_normalizer import PolygonNormalizer
from detector import DBNetTextDetector
from recognizer import PPOCRv4Recognizer
from fallback import TesseractFallback, OCRConsensusEngine
from backend.contracts.ocr.ocr_dto import OCROutput

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("OCR_Pipeline")


def main():
    logger.info("Initializing Nirikshak Multilingual OCR Engine...")
    engine = MultilingualOCREngine()

    if len(sys.argv) > 1:
        image_path = sys.argv[1]
        logger.info(f"Processing input image: {image_path}")
        result = engine.process_image(image_path)
    else:
        logger.info("No input image specified. Validating demo pipeline fixtures...")
        fixtures_dir = Path(__file__).resolve().parent.parent / "fixtures"
        english_fixture = fixtures_dir / "fixture_ocr_english_label.json"
        with open(english_fixture, "r", encoding="utf-8") as f:
            data = json.load(f)
        result = OCROutput.model_validate(data)

    print(json.dumps(result.model_dump(), indent=2, ensure_ascii=False))
    logger.info(f"OCR Pipeline execution completed. Total tokens: {result.total_tokens}, Mean Conf: {result.mean_confidence:.4f}")


if __name__ == "__main__":
    main()
