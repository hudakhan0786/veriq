"""Empirical verification script testing Nirikshak end-to-end on all 4 real physical SKUs.
"""

import os
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(REPO_ROOT))
for sub in ["backend", "backend/ocr", "backend/cv", "backend/extraction", "backend/rule_engine", "backend/evidence"]:
    p = str(REPO_ROOT / sub)
    if p not in sys.path:
        sys.path.insert(0, p)

from backend.inspect_cli import FieldInspectorCLI

SKUS = [
    ("Item 1 - Watch (Titan Wyb Fastrack)", REPO_ROOT / "Legal Metrology real product images/Legal Metrology real product images/Item 1 - Watch"),
    ("Item 2 - General Wellness (Himalaya Brahmi)", REPO_ROOT / "Legal Metrology real product images/Legal Metrology real product images/Item 2 - General Wellness"),
    ("Earbuds (Exotic Mile Pvt Ltd)", REPO_ROOT / "Legal Metrology real product images/Legal Metrology real product images/Earbuds/Earbuds"),
    ("Herbal Hair Oil (Gopi Baba & Co)", REPO_ROOT / "Legal Metrology real product images/Legal Metrology real product images/Herbal hair oil/Herbal hair oil"),
]

def main():
    cli = FieldInspectorCLI(no_color=True)
    print("=" * 80)
    print("NIRIKSHAK LEGAL METROLOGY EMPIRICAL EVALUATION SUITE")
    print("=" * 80)

    results = []
    for label, path in SKUS:
        if not path.exists():
            print(f"Skipping missing path: {path}")
            continue

        print(f"\nEvaluating: {label}")
        res = cli.evaluate_inspection(dir_path=str(path), calib_mode="card")
        verdict = res.get("overall_verdict")
        merkle = res.get("merkle_root", "")[:24]
        sanction = res.get("jan_vishwas_sanction", {})
        act = sanction.get("recommended_action")
        fee = sanction.get("max_compounding_fee_inr", 0)
        evals = res.get("evaluations", [])
        fails = [e for e in evals if e.get("status") == "FAIL"]

        print(f"  Overall Verdict:       {verdict}")
        print(f"  Recommended Action:    {act}")
        print(f"  Compounding Liability: ₹{fee:,} INR")
        print(f"  Merkle Root Hash:      {merkle}...")
        print(f"  Attribution Map:")
        for k, v in res.get("panel_attribution", {}).items():
            print(f"    - {k}: {v.get('source_image_id')}")

        if fails:
            print(f"  Violations Detected ({len(fails)}):")
            for f in fails:
                print(f"    - [{f.get('rule_code')}] {f.get('citation')}: {f.get('discrepancy')}")
        else:
            print("  Violations Detected: None (100% Compliant)")

        results.append((label, verdict, len(fails), fee))

    print("\n" + "=" * 80)
    print("EMPIRICAL BENCHMARK SUMMARY")
    print("=" * 80)
    print(f"{'SKU':<45} | {'Verdict':<8} | {'Fails':<6} | {'Fee (INR)':<10}")
    print("-" * 80)
    for l, v, fn, f in results:
        print(f"{l:<45} | {v:<8} | {fn:<6} | ₹{f:<10,}")
    print("=" * 80)

if __name__ == "__main__":
    main()
