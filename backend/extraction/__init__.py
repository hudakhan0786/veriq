"""Member 3: Semantic Extraction & NLP Module (SIH26034)"""

from .extractor import CommodityFactExtractor
from .fusion import CrossFacetSemanticFusionEngine, FacetExtractionResult
from .parsers import StatutoryDeclarationParser

__all__ = [
    "CommodityFactExtractor",
    "CrossFacetSemanticFusionEngine",
    "FacetExtractionResult",
    "StatutoryDeclarationParser",
]
