\"\"\"Table-I Font Schedule & Numeral Height Evaluator (SIH26034 - Nirikshak)

Statutory Reference:
- Table-I of Rule 7 as substituted by G.S.R. 629(E) dated 23.06.2017.
- Minimum height of numerals and letters as a function of Principal Display Panel (PDP) area.
- Row 5 (> 2500 cm²) strictly enforces 6.0 mm (ADL-01).
- Governed under Section 36(1) of Legal Metrology Act, 2009.
\"\"\"

from typing import Any, Dict, Optional
import math

try:
    from evaluators import Table1FontSchedule
except ImportError:
    try:
        from backend.rule_engine.evaluators import Table1FontSchedule
    except ImportError:
        class Table1FontSchedule:
            @staticmethod
            def get_required_font_height_mm(pdp_area_cm2: float) -> float:
                if pdp_area_cm2 <= 50.0:
                    return 1.0
                elif pdp_area_cm2 <= 100.0:
                    return 1.5
                elif pdp_area_cm2 <= 500.0:
                    return 2.5
                elif pdp_area_cm2 <= 2500.0:
                    return 4.0
                else:
                    return 6.0

__all__ = ["Table1FontSchedule"]
