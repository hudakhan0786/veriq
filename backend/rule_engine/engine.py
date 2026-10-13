"""Deterministic Rule Engine CLI Entrypoint (SIH26034 - Nirikshak)"""

import json
import sys
from pathlib import Path

# Ensure local src and contracts are resolvable
SRC_DIR = Path(__file__).resolve().parent
REPO_ROOT = Path(__file__).resolve().parent.parent.parent
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from evaluators import LegalMetrologyRuleEngine

# Prevent module collision: load OCR engine (backend/ocr/engine.py) under isolated namespace
try:
    import importlib.util
    m2_engine_path = REPO_ROOT / "backend" / "ocr" / "engine.py"
    if m2_engine_path.exists():
        spec = importlib.util.spec_from_file_location("m2_ocr_engine", str(m2_engine_path))
        m2_mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(m2_mod)
        MultilingualOCREngine = getattr(m2_mod, "MultilingualOCREngine", None)
except Exception:
    MultilingualOCREngine = None


def run_demo() -> None:
    print("=" * 70)
    print("Nirikshak — Deterministic Legal Metrology Rule Engine (SIH26034)")
    print("=" * 70)

    # Demo 1: Compliant Pack
    res_pass = LegalMetrologyRuleEngine.evaluate_inspection(
        inspection_id="insp_demo_pass",
        pdp_area_cm2=144.0,
        font_height_mm=2.80,
        net_quantity={"magnitude": 200.0, "unit": "g"},
        mrp={"amount": 80.0, "tax_inclusive": True},
        declared_usp=0.40,
        manufacturer={"name": "Tata Consumer Products", "address_line": "1 Bishop Lefroy Road, Kolkata"},
        consumer_care={"has_phone": True, "has_email": True, "has_address": True, "has_contact_name": True},
        country_of_origin="India",
        mfg_date_iso="2023-05-15",
    )
    print(f"\n[DEMO 1] Compliant Pack:")
    print(f"Overall Verdict: {res_pass['overall_verdict']}")
    print(f"Epoch Applied  : {res_pass['epoch_applied']}")
    print(f"Execution Time : {res_pass['execution_time_ms']} ms")
    print(f"Rule Evaluations: {len(res_pass['evaluations'])} checks executed.")

    # Demo 2: Violation Pack
    res_fail = LegalMetrologyRuleEngine.evaluate_inspection(
        inspection_id="insp_demo_fail",
        pdp_area_cm2=144.0,
        font_height_mm=1.80,
        net_quantity={"magnitude": 400.0, "unit": "g"},
        mrp={"amount": 200.0, "tax_inclusive": True},
        declared_usp=0.60,
        manufacturer={"name": "Snack Co", "address_line": "Delhi"},
        consumer_care={"has_phone": True, "has_email": False},
        country_of_origin="India",
        mfg_date_iso="2023-06-01",
    )
    print(f"\n[DEMO 2] Violation Pack:")
    print(f"Overall Verdict: {res_fail['overall_verdict']}")
    failed = [e["rule_code"] for e in res_fail["evaluations"] if e["status"] == "FAIL"]
    print(f"Failed Rules   : {failed}")
    print("=" * 70)


if __name__ == "__main__":
    run_demo()

