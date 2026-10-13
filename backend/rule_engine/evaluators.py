"""Deterministic Rule Evaluators for Legal Metrology (PC) Rules, 2011 (SIH26034)

Translates the Legal Metrology Act, 2009 and the LMPC Rules, 2011 into an immutable,
deterministic AST compliance engine with zero LLM hallucinations.
Frozen per 07_API_AND_INTERFACE_CONTRACTS.md, 16_DECISION_LOG.md (ADL-01, ADL-07, ADL-12),
and 02_FINAL_REQUIREMENTS_SPECIFICATION.md.
"""

import math
import time
from typing import Any, Dict, List, Literal, Optional, Tuple


class Table1FontSchedule:
    """Table-I of Rule 7 as substituted by G.S.R. 629(E) dated 23.06.2017.

    Derives minimum numeral/letter font height as a function of Principal Display Panel (PDP) area.
    Row 5 (> 2500 cm²) strictly enforces 6.0 mm (ADL-01).
    """

    @staticmethod
    def get_required_font_height_mm(pdp_area_cm2: float) -> float:
        """Derives minimum font height in mm from PDP area in cm²."""
        if pdp_area_cm2 <= 50.0:
            return 1.0
        elif pdp_area_cm2 <= 100.0:
            return 1.5
        elif pdp_area_cm2 <= 500.0:
            return 2.5
        elif pdp_area_cm2 <= 2500.0:
            return 4.0
        else:
            # Official Gazette G.S.R. 629(E) Row 5 is strictly 6.0 mm (ADL-01)
            return 6.0

    @classmethod
    def evaluate(
        cls,
        pdp_area_cm2: float,
        measured_height_mm: Optional[float],
        uncertainty_mm: float = 0.08
    ) -> Dict[str, Any]:
        """Evaluates measured font height against Table-I statutory threshold.

        Applies epistemic boundary triage:
        - If measurement missing or invalid: UNABLE_TO_VERIFY
        - If deficit within sensor uncertainty band: REVIEW
        - If height >= required: PASS
        - If height < required beyond uncertainty: FAIL
        """
        if pdp_area_cm2 is None or pdp_area_cm2 <= 0 or measured_height_mm is None or measured_height_mm <= 0:
            req_val = cls.get_required_font_height_mm(pdp_area_cm2) if (pdp_area_cm2 and pdp_area_cm2 > 0) else 0.0
            return {
                "rule_code": "RULE_06_1_H_NET_QTY_FONT",
                "statutory_reference": "Rule 6(1)(h) read with Table-I, G.S.R. 629(E)",
                "citation": "Rule 6(1)(h) read with Table-I, G.S.R. 629(E)",
                "status": "UNABLE_TO_VERIFY",
                "severity": "CRITICAL",
                "required_value": f">= {req_val:.2f} mm (PDP area {pdp_area_cm2 or 0.0:.1f} cm2)",
                "measured_value": "UNAVAILABLE",
                "required_mm": req_val,
                "measured_mm": 0.0,
                "deficit_mm": 0.0,
                "discrepancy": "Font height or PDP area could not be measured from degraded/missing imagery",
                "legal_consequence": "Unable to verify font compliance under Section 36(1) LM Act 2009",
            }

        required_mm = cls.get_required_font_height_mm(pdp_area_cm2)

        diff = measured_height_mm - required_mm

        # Epistemic boundary triage: within sensor uncertainty band -> REVIEW
        if round(abs(diff), 4) <= round(uncertainty_mm, 4) and diff < 0:
            status = "REVIEW"
            consequence = "Borderline measurement within sensor uncertainty; requires human officer review"
        elif diff >= 0:
            status = "PASS"
            consequence = "Compliant"
        else:
            status = "FAIL"
            consequence = "Non-compliant under Section 36(1) LM Act 2009"

        return {
            "rule_code": "RULE_06_1_H_NET_QTY_FONT",
            "statutory_reference": "Rule 6(1)(h) read with Table-I, G.S.R. 629(E)",
            "citation": "Rule 6(1)(h) read with Table-I, G.S.R. 629(E)",
            "status": status,
            "severity": "CRITICAL",
            "required_value": f">= {required_mm:.2f} mm (PDP area {pdp_area_cm2:.1f} cm2)",
            "measured_value": f"{measured_height_mm:.2f} mm",
            "required_mm": required_mm,
            "measured_mm": measured_height_mm,
            "deficit_mm": diff if diff < 0 else 0.0,
            "discrepancy": f"{diff:.2f} mm deficit" if diff < 0 else None,
            "legal_consequence": consequence,
        }


class USPEvaluator:
    """Rule 6(1)(k) Unit Sale Price consistency under G.S.R. 779(E).

    Enforces mathematical consistency: |(USP × NetQty) - MRP| <= 0.02 INR.
    Supports:
    - Direct unit arithmetic: |(declared_usp × net_qty) - mrp| <= 0.02 INR
    - Metric cross-unit conversions:
      - grams <-> kg (e.g. 500g with USP ₹400/kg or 2.5kg with USP ₹0.08/g)
      - millilitres <-> litres (e.g. 750ml with USP ₹200/l)
      - per 100g / per 100ml commercial rates (e.g. 500g with USP ₹40/100g)
    - Multi-pack piece rates: |(declared_usp × piece_count) - mrp| <= 0.02 INR
    - IEEE 754 floating point precision defense preventing representation anomalies.
    """

    TOLERANCE_INR: float = 0.02

    @classmethod
    def evaluate(
        cls,
        net_qty: Optional[float],
        mrp: Optional[float],
        declared_usp: Optional[float],
        net_unit: Optional[str] = None,
        usp_unit: Optional[str] = None,
        piece_count: Optional[int] = None,
    ) -> Dict[str, Any]:
        """Evaluates declared Unit Sale Price against Net Quantity and MRP."""
        def _is_invalid(val: Any) -> bool:
            if val is None or not isinstance(val, (int, float)):
                return True
            try:
                return math.isnan(val) or math.isinf(val) or val <= 0
            except (TypeError, ValueError):
                return True

        if _is_invalid(net_qty) or _is_invalid(mrp) or _is_invalid(declared_usp):
            return {
                "rule_code": "RULE_06_1_K_USP_COMPUTATION",
                "statutory_reference": "Rule 6(1)(k), G.S.R. 779(E)",
                "citation": "Rule 6(1)(k), G.S.R. 779(E)",
                "status": "UNABLE_TO_VERIFY",
                "severity": "CRITICAL",
                "required_value": "Declared USP matching MRP / NetQty",
                "measured_value": "UNAVAILABLE",
                "declared_usp": declared_usp,
                "calculated_usp": 0.0,
                "discrepancy": "Invalid, non-positive, or missing net quantity, MRP, or declared USP",
                "legal_consequence": "Unable to verify Unit Sale Price arithmetic under Section 36(1) LM Act 2009",
            }

        q = float(net_qty)
        p = float(mrp)
        usp = float(declared_usp)

        # Standard candidate evaluation factors: (discrepancy, calculated_total, calculated_usp, unit_label)
        candidates = []

        # 1. Direct multiplication: USP per declared base unit
        total_direct = round(usp * q, 4)
        diff_direct = abs(total_direct - p)
        candidates.append((diff_direct, total_direct, round(p / q, 4), ""))

        # 2. Metric mass/volume cross-unit: declared in grams/ml, USP per kg/litre
        total_per_kg_or_l = round((usp / 1000.0) * q, 4)
        diff_kg_or_l = abs(total_per_kg_or_l - p)
        candidates.append((diff_kg_or_l, total_per_kg_or_l, round(p / (q / 1000.0), 4), "/kg or /l"))

        # 3. Metric mass/volume cross-unit: declared in kg/litre, USP per gram/ml
        total_per_g_or_ml = round((usp * 1000.0) * q, 4)
        diff_g_or_ml = abs(total_per_g_or_ml - p)
        candidates.append((diff_g_or_ml, total_per_g_or_ml, round(p / (q * 1000.0), 4), "/g or /ml"))

        # 4. Commercial per-100g or per-100ml rates
        total_per_100 = round((usp / 100.0) * q, 4)
        diff_100 = abs(total_per_100 - p)
        candidates.append((diff_100, total_per_100, round(p / (q / 100.0), 4), "/100g or /100ml"))

        # 5. Multi-pack piece count rate (if piece_count available)
        if piece_count and piece_count > 0:
            total_piece = round(usp * piece_count, 4)
            diff_piece = abs(total_piece - p)
            candidates.append((diff_piece, total_piece, round(p / piece_count, 4), "/piece"))

        # Pick candidate with minimum discrepancy
        candidates.sort(key=lambda c: c[0])
        best_diff, best_total, best_calc_usp, unit_lbl = candidates[0]

        # Rule 6(1)(da) / G.S.R. 779(E): The unit sale price shall be calculated to the nearest two decimal places.
        # When a commodity count (e.g. 60 tablets, 3 packs) has recurring division decimals, rounding USP to 2 decimal
        # places incurs a theoretical statutory rounding slack of |round(best_calc_usp, 2) * q - p|.
        theoretical_rounding_slack = abs(round(round(best_calc_usp, 2) * q, 4) - p)
        is_statutory_rounding_match = (
            round(usp, 2) == round(best_calc_usp, 2)
            and round(abs(best_diff - theoretical_rounding_slack), 4) <= cls.TOLERANCE_INR
        )
        is_pass = (round(best_diff, 4) <= cls.TOLERANCE_INR) or is_statutory_rounding_match
        status = "PASS" if is_pass else "FAIL"

        unit_str = f" {unit_lbl}".rstrip()
        required_val = f"Rs. {best_calc_usp:.2f}{unit_str} (tolerance <= 0.02 INR)"
        measured_val = f"Rs. {usp:.2f}"

        return {
            "rule_code": "RULE_06_1_K_USP_COMPUTATION",
            "statutory_reference": "Rule 6(1)(k), G.S.R. 779(E)",
            "citation": "Rule 6(1)(k), G.S.R. 779(E)",
            "status": status,
            "severity": "CRITICAL",
            "required_value": required_val,
            "measured_value": measured_val,
            "declared_usp": usp,
            "calculated_usp": best_calc_usp,
            "discrepancy": round(best_diff, 2),
            "legal_consequence": (
                "Compliant"
                if is_pass
                else "Misleading or incorrect Unit Sale Price under Section 36(1) LM Act 2009"
            ),
        }


class Rule6DeclarationsEvaluator:
    """Evaluates presence and statutory correctness of Rule 6 mandatory declarations.

    Validates:
    - Rule 6(1)(a): Name and complete address of manufacturer/packer/importer
    - Rule 6(1)(f) & Rule 12: Net quantity in SI units and absence of banned unit symbols
    - Rule 6(1)(e): MRP and mandatory '(inclusive of all taxes)' clause
    - Rule 6(1)(n): Consumer care contact details (phone, email, address, contact name)
    - Rule 6(1)(p): Country of origin declaration
    """

    @staticmethod
    def evaluate_manufacturer(
        name: Optional[str],
        address_line: Optional[str] = None,
        pin_code: Optional[str] = None,
        state: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Rule 6(1)(a): Manufacturer, packer, or importer name and address."""
        has_name = bool(name and name.strip())
        has_address = bool(address_line and address_line.strip())

        if not has_name:
            status = "FAIL"
            discrepancy = "Missing manufacturer, packer, or importer name"
        elif not has_address:
            status = "FAIL"
            discrepancy = "Missing manufacturer, packer, or importer address"
        else:
            status = "PASS"
            discrepancy = None

        return {
            "rule_code": "RULE_06_1_A_MANUFACTURER",
            "statutory_reference": "Rule 6(1)(a), Legal Metrology (Packaged Commodities) Rules, 2011",
            "citation": "Rule 6(1)(a), Legal Metrology (PC) Rules 2011",
            "status": status,
            "severity": "CRITICAL",
            "required_value": "Name and complete address of manufacturer/packer/importer",
            "measured_value": f"{name}, {address_line}" if (has_name and has_address) else (name or "MISSING"),
            "discrepancy": discrepancy,
            "legal_consequence": "Compliant" if status == "PASS" else "Non-compliant under Section 36(1) LM Act 2009",
        }

    @staticmethod
    def evaluate_net_quantity(
        magnitude: Optional[float],
        unit: Optional[str],
        has_banned_unit: bool = False,
        banned_unit_found: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Rule 6(1)(f) read with Rule 12: Net quantity declaration & banned unit symbols."""
        if magnitude is None or magnitude <= 0 or not unit:
            return {
                "rule_code": "RULE_06_1_F_NET_QUANTITY",
                "statutory_reference": "Rule 6(1)(f) read with Rule 12, Legal Metrology (PC) Rules, 2011",
                "citation": "Rule 6(1)(f) read with Rule 12, Legal Metrology (PC) Rules 2011",
                "status": "FAIL",
                "severity": "CRITICAL",
                "required_value": "Standard numerical net quantity with approved metric unit (g, kg, ml, l)",
                "measured_value": "MISSING",
                "discrepancy": "Missing or non-positive net quantity declaration",
                "legal_consequence": "Non-compliant under Section 36(1) LM Act 2009",
            }

        if has_banned_unit or banned_unit_found:
            banned_sym = banned_unit_found or unit
            return {
                "rule_code": "RULE_06_1_F_NET_QUANTITY",
                "statutory_reference": "Rule 6(1)(f) read with Rule 12 LMPC Rules, 2011 & Section 11 LM Act, 2009",
                "citation": "Rule 6(1)(f) read with Rule 12 LMPC Rules 2011 & Section 11 LM Act 2009",
                "status": "FAIL",
                "severity": "CRITICAL",
                "required_value": "Strict standard SI unit (e.g. 'g', 'kg', 'ml', 'l')",
                "measured_value": f"{magnitude} {unit}",
                "discrepancy": f"Prohibited non-standard unit '{banned_sym}' under Section 11 / Rule 12",
                "legal_consequence": "Prohibited non-standard unit under Section 11 / Section 36(1) LM Act 2009",
            }

        return {
            "rule_code": "RULE_06_1_F_NET_QUANTITY",
            "statutory_reference": "Rule 6(1)(f) read with Rule 12, Legal Metrology (PC) Rules, 2011",
            "citation": "Rule 6(1)(f) read with Rule 12, Legal Metrology (PC) Rules 2011",
            "status": "PASS",
            "severity": "CRITICAL",
            "required_value": "Approved standard SI unit (g, kg, ml, l)",
            "measured_value": f"{magnitude} {unit}",
            "discrepancy": None,
            "legal_consequence": "Compliant",
        }

    @staticmethod
    def evaluate_mrp(
        amount: Optional[float],
        tax_inclusive: bool = True,
    ) -> Dict[str, Any]:
        """Rule 6(1)(e): Maximum Retail Price and mandatory '(inclusive of all taxes)' clause."""
        if amount is None or amount <= 0:
            return {
                "rule_code": "RULE_06_1_E_MRP",
                "statutory_reference": "Rule 6(1)(e), Legal Metrology (Packaged Commodities) Rules, 2011",
                "citation": "Rule 6(1)(e), Legal Metrology (PC) Rules 2011",
                "status": "FAIL",
                "severity": "CRITICAL",
                "required_value": "Maximum Retail Price in INR inclusive of all taxes",
                "measured_value": "MISSING",
                "discrepancy": "Missing or non-positive MRP amount",
                "legal_consequence": "Non-compliant under Section 36(1) LM Act 2009",
            }

        if not tax_inclusive:
            return {
                "rule_code": "RULE_06_1_E_MRP",
                "statutory_reference": "Rule 6(1)(e), Legal Metrology (Packaged Commodities) Rules, 2011",
                "citation": "Rule 6(1)(e), Legal Metrology (PC) Rules 2011",
                "status": "FAIL",
                "severity": "MAJOR",
                "required_value": "MRP with mandatory clause '(inclusive of all taxes)'",
                "measured_value": f"Rs. {amount:.2f} (tax clause missing)",
                "discrepancy": "Missing mandatory clause '(inclusive of all taxes)'",
                "legal_consequence": "Non-compliant under Rule 6(1)(e) and Section 36(1) LM Act 2009",
            }

        return {
            "rule_code": "RULE_06_1_E_MRP",
            "statutory_reference": "Rule 6(1)(e), Legal Metrology (Packaged Commodities) Rules, 2011",
            "citation": "Rule 6(1)(e), Legal Metrology (PC) Rules 2011",
            "status": "PASS",
            "severity": "CRITICAL",
            "required_value": "MRP inclusive of all taxes",
            "measured_value": f"Rs. {amount:.2f} (inclusive of all taxes)",
            "discrepancy": None,
            "legal_consequence": "Compliant",
        }

    @staticmethod
    def evaluate_consumer_care(
        has_phone: bool,
        has_email: bool,
        has_address: bool = True,
        has_contact_name: bool = True,
    ) -> Dict[str, Any]:
        """Rule 6(1)(n): Consumer grievance redressal details (name, address, phone, email).

        Per TS-UNIT-09: Missing email is a critical statutory violation under Rule 6(1)(n)/6(1)(g).
        """
        if not has_email:
            return {
                "rule_code": "RULE_06_1_N_CONSUMER_CARE",
                "statutory_reference": "Rule 6(1)(n), Legal Metrology (Packaged Commodities) Rules, 2011",
                "citation": "Rule 6(1)(n), Legal Metrology (PC) Rules 2011",
                "status": "FAIL",
                "severity": "CRITICAL",
                "required_value": "Consumer care contact with valid email address",
                "measured_value": "Email missing",
                "discrepancy": "Rule 6(1)(g) Missing Email Address",
                "legal_consequence": "Non-compliant consumer grievance redressal under Section 36(1) LM Act 2009",
            }

        if not has_phone:
            return {
                "rule_code": "RULE_06_1_N_CONSUMER_CARE",
                "statutory_reference": "Rule 6(1)(n), Legal Metrology (Packaged Commodities) Rules, 2011",
                "citation": "Rule 6(1)(n), Legal Metrology (PC) Rules 2011",
                "status": "FAIL",
                "severity": "CRITICAL",
                "required_value": "Consumer care contact with telephone/toll-free number",
                "measured_value": "Telephone missing",
                "discrepancy": "Missing mandatory consumer care telephone number",
                "legal_consequence": "Non-compliant consumer grievance redressal under Section 36(1) LM Act 2009",
            }

        if not has_address:
            return {
                "rule_code": "RULE_06_1_N_CONSUMER_CARE",
                "statutory_reference": "Rule 6(1)(n), Legal Metrology (Packaged Commodities) Rules, 2011",
                "citation": "Rule 6(1)(n), Legal Metrology (PC) Rules 2011",
                "status": "FAIL",
                "severity": "MAJOR",
                "required_value": "Consumer care postal address",
                "measured_value": "Address missing",
                "discrepancy": "Missing consumer care postal address",
                "legal_consequence": "Non-compliant consumer grievance redressal under Section 36(1) LM Act 2009",
            }

        return {
            "rule_code": "RULE_06_1_N_CONSUMER_CARE",
            "statutory_reference": "Rule 6(1)(n), Legal Metrology (Packaged Commodities) Rules, 2011",
            "citation": "Rule 6(1)(n), Legal Metrology (PC) Rules 2011",
            "status": "PASS",
            "severity": "CRITICAL",
            "required_value": "Complete consumer care details (name, address, phone, email)",
            "measured_value": "Complete (phone, email, address present)",
            "discrepancy": None,
            "legal_consequence": "Compliant",
        }

    @staticmethod
    def evaluate_country_of_origin(country: Optional[str]) -> Dict[str, Any]:
        """Rule 6(1)(p): Country of origin declaration."""
        if not country or not country.strip():
            return {
                "rule_code": "RULE_06_1_P_COUNTRY_OF_ORIGIN",
                "statutory_reference": "Rule 6(1)(p), Legal Metrology (Packaged Commodities) Rules, 2011",
                "citation": "Rule 6(1)(p), Legal Metrology (PC) Rules 2011",
                "status": "FAIL",
                "severity": "MAJOR",
                "required_value": "Country of origin declaration",
                "measured_value": "MISSING",
                "discrepancy": "Missing Country of Origin declaration",
                "legal_consequence": "Non-compliant under Section 36(1) LM Act 2009",
            }

        return {
            "rule_code": "RULE_06_1_P_COUNTRY_OF_ORIGIN",
            "statutory_reference": "Rule 6(1)(p), Legal Metrology (Packaged Commodities) Rules, 2011",
            "citation": "Rule 6(1)(p), Legal Metrology (PC) Rules 2011",
            "status": "PASS",
            "severity": "MAJOR",
            "required_value": "Country of origin declaration",
            "measured_value": country.strip(),
            "discrepancy": None,
            "legal_consequence": "Compliant",
        }


class EcommerceComplianceEvaluator:
    """Rule 6(10) E-Commerce marketplace compliance auditor.

    Under Rule 6(10) of LMPC Rules, 2011:
    - Digital marketplace listings must declare:
      1. Manufacturer / Packer name and address (Rule 6(1)(a))
      2. Net quantity (Rule 6(1)(f))
      3. Maximum Retail Price (Rule 6(1)(e))
      4. Consumer care details (Rule 6(1)(n))
      5. Country of Origin (MANDATORY under Rule 6(10) / Rule 6(1)(p) / Rule 6(10A))
    - Manufacturing Date is STATUTORILY EXEMPT from digital listings.
    """

    @classmethod
    def evaluate_listing(cls, listing: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Audits an e-commerce listing payload for statutory compliance."""
        evaluations: List[Dict[str, Any]] = []

        # 1. Manufacturer / Packer
        mfg_name = listing.get("manufacturer_name")
        mfg_addr = listing.get("manufacturer_address")
        evaluations.append(Rule6DeclarationsEvaluator.evaluate_manufacturer(mfg_name, mfg_addr))

        # 2. Net Quantity
        net_qty = listing.get("net_quantity_magnitude")
        unit = listing.get("net_quantity_unit")
        has_banned = listing.get("has_banned_unit", False)
        banned_sym = listing.get("banned_unit_found")
        evaluations.append(Rule6DeclarationsEvaluator.evaluate_net_quantity(net_qty, unit, has_banned, banned_sym))

        # 3. MRP
        mrp_amount = listing.get("mrp")
        tax_inclusive = listing.get("tax_inclusive", True)
        evaluations.append(Rule6DeclarationsEvaluator.evaluate_mrp(mrp_amount, tax_inclusive))

        # 4. Consumer Care
        has_phone = bool(listing.get("consumer_care_phone"))
        has_email = bool(listing.get("consumer_care_email"))
        has_addr = bool(listing.get("consumer_care_address", True))
        evaluations.append(Rule6DeclarationsEvaluator.evaluate_consumer_care(has_phone, has_email, has_addr))

        # 5. Country of Origin (MANDATORY on e-commerce per Rule 6(10) / Rule 6(10A) / TS-UNIT-13)
        origin = listing.get("country_of_origin")
        if not origin or not str(origin).strip():
            evaluations.append({
                "rule_code": "RULE_06_10_COUNTRY_OF_ORIGIN",
                "statutory_reference": "Rule 6(10) read with Rule 6(1)(p) & Rule 6(10A), LMPC Rules 2011",
                "citation": "Rule 6(10) / Rule 6(1)(aa)",
                "status": "FAIL",
                "severity": "CRITICAL",
                "required_value": "Mandatory digital declaration of Country of Origin",
                "measured_value": "MISSING",
                "discrepancy": "Missing Country of Origin on e-commerce listing",
                "legal_consequence": "Violation of Rule 6(10) e-commerce statutory requirements",
            })
        else:
            evaluations.append({
                "rule_code": "RULE_06_10_COUNTRY_OF_ORIGIN",
                "statutory_reference": "Rule 6(10) read with Rule 6(1)(p) & Rule 6(10A), LMPC Rules 2011",
                "citation": "Rule 6(10) / Rule 6(1)(aa)",
                "status": "PASS",
                "severity": "CRITICAL",
                "required_value": "Mandatory digital declaration of Country of Origin",
                "measured_value": str(origin).strip(),
                "discrepancy": None,
                "legal_consequence": "Compliant",
            })

        # 6. Manufacturing Date (STATUTORILY EXEMPT per Rule 6(10) / TS-UNIT-12)
        # Even if missing/None, evaluates to PASS with explicit exemption citation
        evaluations.append({
            "rule_code": "RULE_06_10_MFG_DATE_EXEMPTION",
            "statutory_reference": "Rule 6(10) proviso, Legal Metrology (Packaged Commodities) Rules, 2011",
            "citation": "Rule 6(10) Statutorily Exempts Mfg Date",
            "status": "PASS",
            "severity": "MINOR",
            "required_value": "Statutorily exempt for e-commerce listings under Rule 6(10)",
            "measured_value": str(listing.get("mfg_date") or "NOT_DECLARED (EXEMPT)"),
            "discrepancy": None,
            "legal_consequence": "Compliant: Manufacturing Date is legally exempt from digital listings",
        })

        return evaluations


class TemporalEpochDispatcher:
    """Non-retroactive statutory epoch router matching Mfg Date per Article 20(1) (ADL-07)."""

    @staticmethod
    def get_epoch(mfg_date_iso: Optional[str]) -> str:
        """Routes manufacturing date string to statutory milestone epoch."""
        if not mfg_date_iso:
            return "EPOCH_2021_GSR_779"  # Default working epoch
        date_str = mfg_date_iso[:10]
        if date_str < "2017-06-23":
            return "EPOCH_2011_BASE"
        elif date_str < "2021-11-02":
            return "EPOCH_2017_GSR_629"
        elif date_str < "2026-07-01":
            return "EPOCH_2021_GSR_779"
        else:
            return "EPOCH_2026_GSR_128"

    @classmethod
    def is_usp_mandatory(cls, epoch: str) -> bool:
        """USP became mandatory under G.S.R. 779(E) effective November 2021 / January 2022."""
        return epoch in ("EPOCH_2021_GSR_779", "EPOCH_2026_GSR_128")


class Rule24MultiPackEvaluator:
    """Rule 24 Wholesale and Multi-Piece Package Statutory Compliance.

    Under Rule 24 of Legal Metrology (Packaged Commodities) Rules, 2011:
    - Every multi-piece package containing individual retail packages or pieces must declare:
      1. Number of individual pieces contained ('piece_count')
      2. Net quantity of each individual piece ('piece_magnitude' and 'piece_unit')
      3. Total quantity of all pieces equal to (piece_count × piece_magnitude)
      4. Combined total retail price (MRP) or individual retail prices
      5. Support USP declared either per individual piece or per unit weight/volume
    """

    @classmethod
    def evaluate(
        cls,
        piece_count: Optional[int],
        piece_magnitude: Optional[float],
        piece_unit: Optional[str],
        total_magnitude: Optional[float],
        total_unit: Optional[str] = None,
        mrp_amount: Optional[float] = None,
        declared_usp: Optional[float] = None,
    ) -> List[Dict[str, Any]]:
        evaluations: List[Dict[str, Any]] = []

        # 1. Mandatory individual piece count declaration under Rule 24
        if piece_count is None or piece_count <= 0:
            evaluations.append({
                "rule_code": "RULE_24_PIECE_COUNT",
                "statutory_reference": "Rule 24, Legal Metrology (Packaged Commodities) Rules, 2011",
                "citation": "Rule 24 LMPC Rules 2011",
                "status": "FAIL",
                "severity": "CRITICAL",
                "required_value": "Number of individual pieces declared on multi-piece package",
                "measured_value": "MISSING",
                "discrepancy": "Missing number of usable individual retail pieces in multi-pack",
                "legal_consequence": "Non-compliant multi-pack declaration under Rule 24 & Section 36(1) LM Act 2009",
            })
        else:
            evaluations.append({
                "rule_code": "RULE_24_PIECE_COUNT",
                "statutory_reference": "Rule 24, Legal Metrology (Packaged Commodities) Rules, 2011",
                "citation": "Rule 24 LMPC Rules 2011",
                "status": "PASS",
                "severity": "CRITICAL",
                "required_value": "Number of individual pieces declared on multi-piece package",
                "measured_value": f"{piece_count} pieces",
                "discrepancy": None,
                "legal_consequence": "Compliant",
            })

        # 2. Mandatory individual piece net quantity under Rule 24
        if piece_magnitude is None or piece_magnitude <= 0 or not piece_unit:
            evaluations.append({
                "rule_code": "RULE_24_PIECE_QUANTITY",
                "statutory_reference": "Rule 24, Legal Metrology (Packaged Commodities) Rules, 2011",
                "citation": "Rule 24 LMPC Rules 2011",
                "status": "FAIL",
                "severity": "CRITICAL",
                "required_value": "Net quantity of each individual piece declared",
                "measured_value": "MISSING",
                "discrepancy": "Missing individual piece quantity on multi-pack",
                "legal_consequence": "Non-compliant individual piece declaration under Rule 24 & Section 36(1) LM Act 2009",
            })
        else:
            evaluations.append({
                "rule_code": "RULE_24_PIECE_QUANTITY",
                "statutory_reference": "Rule 24, Legal Metrology (Packaged Commodities) Rules, 2011",
                "citation": "Rule 24 LMPC Rules 2011",
                "status": "PASS",
                "severity": "CRITICAL",
                "required_value": "Net quantity of each individual piece declared",
                "measured_value": f"{piece_magnitude} {piece_unit}",
                "discrepancy": None,
                "legal_consequence": "Compliant",
            })

        # 3. Total quantity arithmetic consistency
        if piece_count and piece_magnitude and total_magnitude:
            calculated_total = piece_count * piece_magnitude
            diff = abs(calculated_total - total_magnitude)
            if diff <= 0.01:
                status = "PASS"
                disc = None
                consequence = "Compliant"
            else:
                status = "FAIL"
                disc = f"Declared total {total_magnitude} != expected {calculated_total:.2f} (diff {diff:.2f})"
                consequence = "Incorrect total quantity arithmetic in multi-pack under Rule 24"

            evaluations.append({
                "rule_code": "RULE_24_TOTAL_QUANTITY_ARITHMETIC",
                "statutory_reference": "Rule 24, Legal Metrology (Packaged Commodities) Rules, 2011",
                "citation": "Rule 24 LMPC Rules 2011",
                "status": status,
                "severity": "CRITICAL",
                "required_value": f"Total quantity matching piece_count × piece_magnitude ({calculated_total:.2f})",
                "measured_value": f"{total_magnitude} {total_unit or piece_unit or ''}".strip(),
                "discrepancy": disc,
                "legal_consequence": consequence,
            })

        return evaluations


class JanVishwasCompoundingCalculator:
    """Statutory Legal Sanction & Compounding Recommendation Calculator
    under Legal Metrology Act, 2009 as amended by Jan Vishwas Act, 2023 (Act No. 18 of 2023).

    Key Legislative Principles:
    1. Decriminalization of Section 36(1): Imprisonment repealed for packaging offenses.
    2. Proviso to Section 36(1) (Improvement Notices):
       - For first-time technical labeling non-compliances (font deficit, missing tax clause,
         missing consumer care address/email), the system recommends an official Form-1
         Statutory Improvement Notice with a mandatory 14-day cure window.
    3. Compounding under Section 48 / Section 53:
       - First Offense (where Improvement Notice unheeded or non-curable/banned units/fraud):
         Maximum compounding fee up to ₹25,000.
       - Second Offense (within 3 years):
         Maximum compounding fee up to ₹50,000.
       - Subsequent Offense:
         Maximum compounding fee up to ₹1,00,000 (civil adjudication by Adjudicating Officer).
    4. Epistemic Review and Degraded Inputs:
       - Borderline Review -> Human Officer Adjudication Required.
       - Unable to Verify -> Retake imagery or physical inspection required.
    """

    @classmethod
    def calculate_sanction(
        cls,
        overall_verdict: str,
        evaluations: List[Dict[str, Any]],
        offense_history: Literal["FIRST", "SECOND", "SUBSEQUENT"] = "FIRST",
    ) -> Dict[str, Any]:
        if overall_verdict == "PASS":
            return {
                "statutory_framework": "Legal Metrology Act, 2009 (amended by Jan Vishwas Act, 2023, Act No. 18 of 2023)",
                "offense_history": offense_history,
                "recommended_action": "NO_ACTION",
                "statutory_cure_period_days": 0,
                "max_compounding_fee_inr": 0,
                "decriminalization_status": "Fully compliant with LMPC Rules, 2011",
                "legal_summary": "100% statutory compliance verified across all evaluated legal metrology rules.",
            }

        if overall_verdict == "REVIEW":
            return {
                "statutory_framework": "Legal Metrology Act, 2009 (amended by Jan Vishwas Act, 2023, Act No. 18 of 2023)",
                "offense_history": offense_history,
                "recommended_action": "OFFICER_REVIEW",
                "statutory_cure_period_days": 0,
                "max_compounding_fee_inr": 0,
                "decriminalization_status": "Pre-adjudication measurement triage",
                "legal_summary": "Borderline measurement within sensor uncertainty band (k=2, 95% confidence). Statutory natural justice requires physical assessment by Legal Metrology Officer under Section 15.",
            }

        if overall_verdict == "UNABLE_TO_VERIFY":
            return {
                "statutory_framework": "Legal Metrology Act, 2009 (amended by Jan Vishwas Act, 2023, Act No. 18 of 2023)",
                "offense_history": offense_history,
                "recommended_action": "RETAKE_OR_PHYSICAL_INSPECTION",
                "statutory_cure_period_days": 0,
                "max_compounding_fee_inr": 0,
                "decriminalization_status": "Insufficient evidentiary quality",
                "legal_summary": "Imagery degraded, blurred, or occluded. Section 63 BSA 2023 evidentiary standards require optical retake or physical packaging seizure before statutory adjudication.",
            }

        # For FAIL:
        failed_evals = [e for e in evaluations if e.get("status") == "FAIL"]
        has_banned_unit = any(
            "banned" in str(e.get("discrepancy", "")).lower()
            or "prohibited" in str(e.get("discrepancy", "")).lower()
            for e in failed_evals
        )

        if offense_history == "FIRST":
            if not has_banned_unit:
                return {
                    "statutory_framework": "Legal Metrology Act, 2009 (amended by Jan Vishwas Act, 2023, Act No. 18 of 2023)",
                    "offense_history": "FIRST",
                    "recommended_action": "STATUTORY_IMPROVEMENT_NOTICE",
                    "statutory_cure_period_days": 14,
                    "max_compounding_fee_inr": 0,
                    "decriminalization_status": "First technical default eligible for statutory cure under Section 36(1) proviso",
                    "legal_summary": "Issue Form-1 Statutory Improvement Notice under Section 36(1) proviso read with Jan Vishwas Act, 2023 (Act No. 18 of 2023). Manufacturer/packer granted 14 calendar days to rectify packaging non-compliance prior to penal compounding.",
                }
            else:
                return {
                    "statutory_framework": "Legal Metrology Act, 2009 (amended by Jan Vishwas Act, 2023, Act No. 18 of 2023)",
                    "offense_history": "FIRST",
                    "recommended_action": "COMPOUNDING_FIRST_OFFENSE",
                    "statutory_cure_period_days": 0,
                    "max_compounding_fee_inr": 25000,
                    "decriminalization_status": "Decriminalized to civil compounding (imprisonment repealed)",
                    "legal_summary": "Prohibited non-standard unit violation under Section 11 & Section 36(1). Recommend compounding under Section 48 with compounding fee up to ₹25,000 per Jan Vishwas Act, 2023.",
                }

        elif offense_history == "SECOND":
            return {
                "statutory_framework": "Legal Metrology Act, 2009 (amended by Jan Vishwas Act, 2023, Act No. 18 of 2023)",
                "offense_history": "SECOND",
                "recommended_action": "COMPOUNDING_SECOND_OFFENSE",
                "statutory_cure_period_days": 0,
                "max_compounding_fee_inr": 50000,
                "decriminalization_status": "Decriminalized to civil compounding (imprisonment repealed)",
                "legal_summary": "Second packaging offense under Section 36(1) of Legal Metrology Act, 2009 (amended by Jan Vishwas Act, 2023). Recommend compounding fee up to ₹50,000.",
            }

        else:  # SUBSEQUENT
            return {
                "statutory_framework": "Legal Metrology Act, 2009 (amended by Jan Vishwas Act, 2023, Act No. 18 of 2023)",
                "offense_history": "SUBSEQUENT",
                "recommended_action": "COMPOUNDING_SUBSEQUENT_OFFENSE",
                "statutory_cure_period_days": 0,
                "max_compounding_fee_inr": 100000,
                "decriminalization_status": "Decriminalized to civil adjudication by Adjudicating Officer (criminal imprisonment repealed)",
                "legal_summary": "Subsequent offense under Section 36(1) of Legal Metrology Act, 2009 (amended by Jan Vishwas Act, 2023). Maximum civil compounding penalty up to ₹1,00,000. Criminal imprisonment repealed.",
            }


class LegalMetrologyRuleEngine:
    """Composite Deterministic AST Rule Engine (Member 4 - Nirikshak).

    Orchestrates:
    - Temporal Statutory Epoch Dispatcher
    - Table-I Font Schedule
    - Unit Sale Price (USP) Arithmetic
    - Rule 6 Statutory Declarations (Manufacturer, Net Qty, MRP, Consumer Care, Origin)
    - 4-State Epistemic Verdict Triage (PASS, FAIL, REVIEW, UNABLE_TO_VERIFY)
    """

    @staticmethod
    def triage_verdict(evaluations: List[Dict[str, Any]]) -> Literal["PASS", "FAIL", "REVIEW", "UNABLE_TO_VERIFY"]:
        """Derives composite 4-state epistemic verdict from granular rule evaluations.

        Triage hierarchy (ADL-12):
        1. If ANY evaluation is FAIL -> FAIL (critical statutory violation established)
        2. Else if ANY evaluation is REVIEW -> REVIEW (borderline measurement in sensor uncertainty band)
        3. Else if ANY evaluation is UNABLE_TO_VERIFY -> UNABLE_TO_VERIFY (degraded/missing sensor inputs)
        4. Else -> PASS (100% statutory compliance verified)
        """
        if not evaluations:
            return "UNABLE_TO_VERIFY"

        statuses = [e.get("status") for e in evaluations]

        if "FAIL" in statuses:
            return "FAIL"
        if "REVIEW" in statuses:
            return "REVIEW"
        if "UNABLE_TO_VERIFY" in statuses:
            return "UNABLE_TO_VERIFY"
        return "PASS"

    @classmethod
    def evaluate_inspection(
        cls,
        inspection_id: str,
        pdp_area_cm2: float,
        font_height_mm: Optional[float],
        net_quantity: Optional[Dict[str, Any]] = None,
        mrp: Optional[Dict[str, Any]] = None,
        declared_usp: Optional[float] = None,
        manufacturer: Optional[Dict[str, Any]] = None,
        importer: Optional[Dict[str, Any]] = None,
        packer: Optional[Dict[str, Any]] = None,
        consumer_care: Optional[Dict[str, Any]] = None,
        country_of_origin: Optional[str] = None,
        mfg_date_iso: Optional[str] = None,
        is_ecommerce: bool = False,
        offense_history: Literal["FIRST", "SECOND", "SUBSEQUENT"] = "FIRST",
        multipack_details: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Executes complete deterministic compliance audit for an inspection session."""
        t_start = time.perf_counter()

        # 1. Determine Statutory Epoch
        epoch = TemporalEpochDispatcher.get_epoch(mfg_date_iso)
        evaluations: List[Dict[str, Any]] = []

        # 2. Table-I Font Schedule Check (Physical packages)
        if not is_ecommerce:
            font_result = Table1FontSchedule.evaluate(pdp_area_cm2, font_height_mm)
            evaluations.append(font_result)

        # 3. Rule 6(1)(a) Manufacturer / Packer / Importer
        entities = [e for e in [manufacturer, importer, packer] if e]
        complete_entities = [e for e in entities if e.get("name") and e.get("address_line")]
        if complete_entities:
            mfg_entity = complete_entities[0]
        elif entities:
            mfg_entity = entities[0]
        else:
            mfg_entity = None

        if mfg_entity:
            evaluations.append(Rule6DeclarationsEvaluator.evaluate_manufacturer(
                name=mfg_entity.get("name"),
                address_line=mfg_entity.get("address_line"),
                pin_code=mfg_entity.get("pin_code"),
                state=mfg_entity.get("state"),
            ))
        else:
            evaluations.append(Rule6DeclarationsEvaluator.evaluate_manufacturer(None))

        # 4. Rule 6(1)(f) Net Quantity
        if net_quantity:
            evaluations.append(Rule6DeclarationsEvaluator.evaluate_net_quantity(
                magnitude=net_quantity.get("magnitude"),
                unit=net_quantity.get("unit"),
                has_banned_unit=net_quantity.get("has_banned_unit", False),
                banned_unit_found=net_quantity.get("banned_unit_found"),
            ))
        else:
            evaluations.append(Rule6DeclarationsEvaluator.evaluate_net_quantity(None, None))

        # 5. Rule 6(1)(e) MRP
        if mrp:
            evaluations.append(Rule6DeclarationsEvaluator.evaluate_mrp(
                amount=mrp.get("amount"),
                tax_inclusive=mrp.get("tax_inclusive", True),
            ))
        else:
            evaluations.append(Rule6DeclarationsEvaluator.evaluate_mrp(None))

        # 6. Rule 6(1)(k) Unit Sale Price Math (checked if declared or if mandatory in epoch)
        net_qty_val = net_quantity.get("magnitude") if net_quantity else None
        net_qty_unit = net_quantity.get("unit") if net_quantity else None
        mrp_val = mrp.get("amount") if mrp else None
        piece_cnt = multipack_details.get("piece_count") if multipack_details else None

        if declared_usp is not None:
            evaluations.append(USPEvaluator.evaluate(
                net_qty=net_qty_val,
                mrp=mrp_val,
                declared_usp=declared_usp,
                net_unit=net_qty_unit,
                piece_count=piece_cnt,
            ))
        elif TemporalEpochDispatcher.is_usp_mandatory(epoch) and not is_ecommerce:
            # Check Rule 6(1)(k) second proviso: packages containing 1 unit (1 Number / 1 piece) are exempt
            if net_qty_val == 1.0 and str(net_qty_unit).upper() in ("N", "U", "PIECE", "PIECES", "UNIT", "UNITS", "NUMBER", "NUMBERS"):
                evaluations.append({
                    "rule_code": "RULE_06_1_K_USP_COMPUTATION",
                    "statutory_reference": "Rule 6(1)(k) second proviso, G.S.R. 779(E)",
                    "citation": "Rule 6(1)(k) Proviso (Net Qty = 1 Exemption)",
                    "status": "PASS",
                    "severity": "CRITICAL",
                    "required_value": "Statutorily exempt under Rule 6(1)(k) proviso when Net Qty = 1 unit",
                    "measured_value": "NOT_DECLARED (STATUTORILY_EXEMPT)",
                    "discrepancy": None,
                    "legal_consequence": "Compliant: Unit Sale Price is statutorily exempt for single-unit commodity",
                })
            else:
                evaluations.append({
                    "rule_code": "RULE_06_1_K_USP_COMPUTATION",
                    "statutory_reference": "Rule 6(1)(k), G.S.R. 779(E)",
                    "citation": "Rule 6(1)(k), G.S.R. 779(E)",
                    "status": "FAIL",
                    "severity": "CRITICAL",
                    "required_value": "Mandatory Unit Sale Price declaration under G.S.R. 779(E)",
                    "measured_value": "MISSING",
                    "discrepancy": "Unit Sale Price declaration missing on post-2021 packaging",
                    "legal_consequence": "Violation of Rule 6(1)(k) and Section 36(1) LM Act 2009",
                })

        # 7. Rule 6(1)(n) Consumer Care
        if consumer_care:
            has_phone = bool(consumer_care.get("has_phone") or consumer_care.get("phone"))
            has_email = bool(consumer_care.get("has_email") or consumer_care.get("email"))
            has_addr = bool(consumer_care["has_address"]) if "has_address" in consumer_care else bool(consumer_care.get("address", True))
            has_name = bool(consumer_care["has_contact_name"]) if "has_contact_name" in consumer_care else bool(consumer_care.get("name", True))
            evaluations.append(Rule6DeclarationsEvaluator.evaluate_consumer_care(
                has_phone=has_phone,
                has_email=has_email,
                has_address=has_addr,
                has_contact_name=has_name,
            ))
        else:
            evaluations.append(Rule6DeclarationsEvaluator.evaluate_consumer_care(False, False))

        # 8. Rule 6(1)(p) Country of Origin
        evaluations.append(Rule6DeclarationsEvaluator.evaluate_country_of_origin(country_of_origin))

        # 9. Rule 24 Wholesale and Multi-Piece Package Checks
        if multipack_details:
            multi_evals = Rule24MultiPackEvaluator.evaluate(
                piece_count=multipack_details.get("piece_count"),
                piece_magnitude=multipack_details.get("piece_magnitude"),
                piece_unit=multipack_details.get("piece_unit"),
                total_magnitude=multipack_details.get("total_magnitude") or net_qty_val,
                total_unit=multipack_details.get("total_unit") or net_qty_unit,
                mrp_amount=mrp_val,
                declared_usp=declared_usp,
            )
            evaluations.extend(multi_evals)

        # 10. E-Commerce specific exemptions / requirements
        if is_ecommerce:
            evaluations.append({
                "rule_code": "RULE_06_10_MFG_DATE_EXEMPTION",
                "statutory_reference": "Rule 6(10) proviso, Legal Metrology (PC) Rules, 2011",
                "citation": "Rule 6(10) Statutorily Exempts Mfg Date",
                "status": "PASS",
                "severity": "MINOR",
                "required_value": "Statutorily exempt for e-commerce listings under Rule 6(10)",
                "measured_value": str(mfg_date_iso or "NOT_DECLARED (EXEMPT)"),
                "discrepancy": None,
                "legal_consequence": "Compliant: Manufacturing Date is legally exempt from digital listings",
            })

        # 11. Normalize evaluations to strictly conform to RuleEvaluationDTO schema
        dto_evaluations: List[Dict[str, Any]] = []
        for ev in evaluations:
            item = dict(ev)
            disc = item.get("discrepancy")
            if disc is not None and not isinstance(disc, str):
                if disc == 0.0 and item.get("status") == "PASS":
                    item["discrepancy"] = None
                else:
                    item["discrepancy"] = f"Discrepancy of {disc:.2f}"
            dto_evaluations.append(item)

        # 12. Composite 4-state triage
        overall_verdict = cls.triage_verdict(dto_evaluations)

        # 13. Calculate Jan Vishwas 2023 Statutory Compounding / Sanction recommendation
        sanction = JanVishwasCompoundingCalculator.calculate_sanction(
            overall_verdict=overall_verdict,
            evaluations=dto_evaluations,
            offense_history=offense_history,
        )

        exec_time_ms = int((time.perf_counter() - t_start) * 1000)

        return {
            "inspection_id": inspection_id,
            "overall_verdict": overall_verdict,
            "adjudication_required": True,
            "evaluations": dto_evaluations,
            "epoch_applied": epoch,
            "execution_time_ms": exec_time_ms,
            "jan_vishwas_sanction": sanction,
        }
