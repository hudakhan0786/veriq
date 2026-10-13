"""Deterministic Semantic Parsers for Statutory Packaged Commodities Declarations (SIH26034)

Fulfills:
- Rule 6 of the Legal Metrology (Packaged Commodities) Rules, 2011 (LMPC Rules, 2011)
- Section 11 & Rule 12: Prohibited non-standard metric symbols and unit standardization
- Section 63 Bharatiya Sakshya Adhiniyam, 2023 (BSA 2023): Deterministic, auditable evidence
- Working Default OQ-02: State + 6-digit PIN is statutory minimum for complete address
"""

import re
import unicodedata
from typing import Any, Dict, List, Optional, Set, Tuple


# Devanagari numeral conversion mapping (०-९ -> 0-9)
DEVANAGARI_DIGITS_MAP = str.maketrans("०१२३४५६७८९", "0123456789")

# Unicode Homoglyph Normalization Map (Cyrillic, Greek lookalikes, dashes, quotes -> ASCII)
HOMOGLYPH_MAP = str.maketrans({
    # Cyrillic lookalikes to Latin
    "\u0430": "a", "\u0441": "c", "\u0435": "e", "\u0456": "i", "\u0458": "j",
    "\u043e": "o", "\u0440": "p", "\u0443": "y", "\u0445": "x", "\u0455": "s",
    "\u043c": "m", "\u043b": "l",
    "\u0410": "A", "\u0412": "B", "\u0421": "C", "\u0415": "E", "\u041d": "H",
    "\u0406": "I", "\u0408": "J", "\u041a": "K", "\u041c": "M", "\u041b": "L",
    "\u041e": "O", "\u0420": "P", "\u0422": "T", "\u0425": "X", "\u04ae": "Y",
    # Greek lookalikes to Latin
    "\u03b1": "a", "\u03b2": "b", "\u03b5": "e", "\u03b9": "i", "\u03ba": "k",
    "\u03bd": "v", "\u03bf": "o", "\u03c1": "p", "\u03c4": "t", "\u03c5": "u", "\u03c7": "x",
    "\u0391": "A", "\u0392": "B", "\u0395": "E", "\u0397": "H", "\u0399": "I",
    "\u039a": "K", "\u039c": "M", "\u039d": "N", "\u039f": "O", "\u03a1": "P",
    "\u03a4": "T", "\u03a7": "X", "\u03a5": "Y", "\u0396": "Z",
    # Hyphens, dashes, and minus
    "\u2010": "-", "\u2011": "-", "\u2012": "-", "\u2013": "-", "\u2014": "-", "\u2015": "-", "\u2212": "-",
    # Quotes
    "\u2018": "'", "\u2019": "'", "\u201a": "'", "\u201b": "'",
    "\u201c": '"', "\u201d": '"', "\u201e": '"', "\u201f": '"',
})


# Prohibited units: Strictly capitalized 'ML' or 'Ml' or 'M.L.' (whereas lowercase 'ml' or standard 'mL' is valid)
# Under Section 11 & Rule 12, capitalized 'ML' represents Mega-Litre (1,000,000 litres), an illegal declaration.
# Detects ML, Ml, M.L., M.L, M.l., M.l without trailing character bounds.
BANNED_UNITS_CASE_SENSITIVE = re.compile(
    r"(?<![a-zA-Z])(?:ML|Ml|M\.?\s*L\.?|M\.?\s*l\.?)(?![a-zA-Z])"
)

# Prohibited non-standard metric symbols (case-insensitive)
# Under Section 11 & Rule 12: gms, gm, g.m., g.m.s., Kgs, kgms, ltrs, ltr, LTR, cc, c.c., etc. are strictly prohibited.
# Punctuation on units: Under Rule 12(b), symbols of units shall not be followed by a period or pluralized (e.g. 'g.', 'kg.', 'ml.', 'l.').
BANNED_UNITS_CASE_INSENSITIVE = re.compile(
    r"(?<![a-zA-Z\.])(?:g\.?\s*m\.?\s*s+\.?|gms\.?|g\.m\.s+\.?|g\.|kgms\.?|kgs\.?|k\.\s*g\.?|kg\.|ltrs\.?|ltr\.?|l\.\s*t\.\s*r\.?\s*s?\.?|l\.|ml\.|liters|litres|kilos?|mtrs?|cms|mms|ग्राम्स|जी\.?\s*एम\.?)(?![a-zA-Z])",
    re.IGNORECASE
)

# Prohibited lowercase or mixed 'gm' / 'g.m.' symbols (strictly guarding against uppercase 'GM' which denotes General Manager or GM Foods)
BANNED_GM_GENERAL = re.compile(
    r"(?<![a-zA-Z])(?:gm\.?|g\.m\.?)(?![a-zA-Z])"
)

# Prohibited uppercase 'GM' or 'G.M.' strictly when accompanied by numeric quantity, slash, or rate
BANNED_GM_UPPERCASE_WITH_QTY = re.compile(
    r"(?:(?<=[0-9])\s*|(?<=/)\s*|(?<=per\s))\s*G\.?M\.?(?![a-zA-Z])"
)

# Prohibited 'cc' or 'c.c.' strictly when accompanied by numeric quantity, slash, or rate (guards against 'CC: email')
BANNED_CC_WITH_QTY = re.compile(
    r"(?:(?<=[0-9])\s*|(?<=/)\s*|(?<=per\s))\s*c\.?\s*c\.?(?![a-zA-Z])",
    re.IGNORECASE
)


# Standardized Indian States and Union Territories (28 States + 8 UTs + historical variants)
INDIAN_STATES_AND_UTS = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli",
    "Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep",
    "Puducherry", "New Delhi", "Orissa", "Pondicherry", "Uttaranchal",
    # Hindi Devanagari state names
    "आंध्र प्रदेश", "अरुणाचल प्रदेश", "असम", "बिहार", "छत्तीसगढ़", "गोवा", "गुजरात",
    "हरियाणा", "हिमाचल प्रदेश", "झारखंड", "कर्नाटक", "केरल", "मध्य प्रदेश", "महाराष्ट्र",
    "मणिपुर", "मेघालय", "मिजोरम", "नागालैंड", "ओडिशा", "पंजाब", "राजस्थान", "सिक्किम",
    "तमिलनाडु", "तेलंगाना", "त्रिपुरा", "उत्तर प्रदेश", "उत्तराखंड", "पश्चिम बंगाल", "दिल्ली"
]

# State two-letter postal abbreviations
STATE_ABBREVIATIONS: Dict[str, str] = {
    "MH": "Maharashtra", "DL": "Delhi", "KA": "Karnataka", "TN": "Tamil Nadu", "WB": "West Bengal",
    "TS": "Telangana", "TG": "Telangana", "AP": "Andhra Pradesh", "GJ": "Gujarat", "RJ": "Rajasthan",
    "UP": "Uttar Pradesh", "U.P.": "Uttar Pradesh", "MP": "Madhya Pradesh", "M.P.": "Madhya Pradesh",
    "BR": "Bihar", "JH": "Jharkhand", "CG": "Chhattisgarh", "OD": "Odisha", "OR": "Odisha",
    "HR": "Haryana", "PB": "Punjab", "UK": "Uttarakhand", "UA": "Uttarakhand", "AS": "Assam",
    "KL": "Kerala", "GA": "Goa", "HP": "Himachal Pradesh", "H.P.": "Himachal Pradesh", "JK": "Jammu and Kashmir",
    "J&K": "Jammu and Kashmir", "CH": "Chandigarh", "PY": "Puducherry"
}

# Major commercial cities and FMCG manufacturing hubs unambiguously mapped to Indian States
MAJOR_CITIES_TO_STATE: Dict[str, str] = {
    "mumbai": "Maharashtra", "bombay": "Maharashtra", "pune": "Maharashtra", "nagpur": "Maharashtra",
    "thane": "Maharashtra", "nashik": "Maharashtra", "aurangabad": "Maharashtra", "navi mumbai": "Maharashtra",
    "delhi": "Delhi", "new delhi": "Delhi",
    "bengaluru": "Karnataka", "bangalore": "Karnataka", "mysore": "Karnataka", "mysuru": "Karnataka", "hubli": "Karnataka",
    "chennai": "Tamil Nadu", "madras": "Tamil Nadu", "coimbatore": "Tamil Nadu", "madurai": "Tamil Nadu",
    "kolkata": "West Bengal", "calcutta": "West Bengal", "howrah": "West Bengal", "siliguri": "West Bengal",
    "hyderabad": "Telangana", "secunderabad": "Telangana", "warangal": "Telangana",
    "ahmedabad": "Gujarat", "surat": "Gujarat", "vadodara": "Gujarat", "baroda": "Gujarat", "rajkot": "Gujarat", "anand": "Gujarat",
    "vapi": "Gujarat", "ankleshwar": "Gujarat",
    "jaipur": "Rajasthan", "jodhpur": "Rajasthan", "kota": "Rajasthan", "udaipur": "Rajasthan",
    "lucknow": "Uttar Pradesh", "kanpur": "Uttar Pradesh", "noida": "Uttar Pradesh", "greater noida": "Uttar Pradesh",
    "ghaziabad": "Uttar Pradesh", "varanasi": "Uttar Pradesh", "agra": "Uttar Pradesh", "prayagraj": "Uttar Pradesh",
    "patna": "Bihar", "ranchi": "Jharkhand", "jamshedpur": "Jharkhand", "bhopal": "Madhya Pradesh",
    "indore": "Madhya Pradesh", "gwalior": "Madhya Pradesh", "jabalpur": "Madhya Pradesh", "raipur": "Chhattisgarh",
    "bhubaneswar": "Odisha", "cuttack": "Odisha",
    "chandigarh": "Chandigarh", "gurgaon": "Haryana", "gurugram": "Haryana", "faridabad": "Haryana", "manesar": "Haryana",
    "ludhiana": "Punjab", "amritsar": "Punjab",
    "dehradun": "Uttarakhand", "haridwar": "Uttarakhand", "roorkee": "Uttarakhand", "pantnagar": "Uttarakhand", "rudrapur": "Uttarakhand",
    "baddi": "Himachal Pradesh", "solan": "Himachal Pradesh", "nalagarh": "Himachal Pradesh", "parwanoo": "Himachal Pradesh",
    "guwahati": "Assam", "silvassa": "Dadra and Nagar Haveli", "daman": "Daman and Diu",
    "visakhapatnam": "Andhra Pradesh", "vizag": "Andhra Pradesh", "vijayawada": "Andhra Pradesh", "sri city": "Andhra Pradesh", "chittoor": "Andhra Pradesh",
    "kochi": "Kerala", "cochin": "Kerala", "thiruvananthapuram": "Kerala", "trivandrum": "Kerala", "panaji": "Goa", "bicholim": "Goa",
    "kanchipuram": "Tamil Nadu", "hosur": "Tamil Nadu", "thiruvallur": "Tamil Nadu", "sriperumbudur": "Tamil Nadu",
    "sanand": "Gujarat", "morbi": "Gujarat", "mehsana": "Gujarat", "valsad": "Gujarat", "halol": "Gujarat", "chhatral": "Gujarat", "kadi": "Gujarat",
    "bhiwadi": "Rajasthan", "alwar": "Rajasthan", "neemrana": "Rajasthan",
    "sonipat": "Haryana", "panipat": "Haryana", "kundli": "Haryana",
    "mohali": "Punjab", "zirakpur": "Punjab", "derabassi": "Punjab",
    "tarapur": "Maharashtra",
    "leh": "Ladakh", "kargil": "Ladakh",
    "kavaratti": "Lakshadweep"
}

# Precompiled regexes for high-performance O(1) state, city, and abbreviation matching
INDIAN_STATES_REGEX = re.compile(
    r"\b(" + "|".join(re.escape(s) for s in sorted(INDIAN_STATES_AND_UTS, key=len, reverse=True)) + r")\b",
    re.IGNORECASE
)
MAJOR_CITIES_REGEX = re.compile(
    r"\b(" + "|".join(re.escape(c) for c in sorted(MAJOR_CITIES_TO_STATE.keys(), key=len, reverse=True)) + r")\b",
    re.IGNORECASE
)
STATE_ABBR_REGEX = re.compile(
    r"\b(" + "|".join(re.escape(a) for a in sorted(STATE_ABBREVIATIONS.keys(), key=len, reverse=True)) + r")\b"
)

# High-precision 3-digit PIN prefix overrides for sub-state regions and Union Territories
PIN_3DIGIT_TO_STATE: Dict[str, str] = {
    "194": "Ladakh",
    "403": "Goa",
    "248": "Uttarakhand", "249": "Uttarakhand", "263": "Uttarakhand",
    "605": "Puducherry", "609": "Puducherry",
    "737": "Sikkim",
    "744": "Andaman and Nicobar Islands",
    "790": "Arunachal Pradesh", "791": "Arunachal Pradesh", "792": "Arunachal Pradesh",
    "793": "Meghalaya", "794": "Meghalaya",
    "795": "Manipur",
    "796": "Mizoram",
    "797": "Nagaland",
    "799": "Tripura"
}

# PIN prefix (first 2 digits) deterministic mapping to Indian State/UT
PIN_PREFIX_TO_STATE: Dict[str, str] = {
    "11": "Delhi",
    "12": "Haryana", "13": "Haryana",
    "14": "Punjab", "15": "Punjab",
    "16": "Chandigarh",
    "17": "Himachal Pradesh",
    "18": "Jammu and Kashmir", "19": "Jammu and Kashmir",
    "20": "Uttar Pradesh", "21": "Uttar Pradesh", "22": "Uttar Pradesh", "23": "Uttar Pradesh",
    "24": "Uttar Pradesh", "25": "Uttar Pradesh", "26": "Uttar Pradesh", "27": "Uttar Pradesh", "28": "Uttar Pradesh",
    "30": "Rajasthan", "31": "Rajasthan", "32": "Rajasthan", "33": "Rajasthan", "34": "Rajasthan",
    "36": "Gujarat", "37": "Gujarat", "38": "Gujarat", "39": "Gujarat",
    "40": "Maharashtra", "41": "Maharashtra", "42": "Maharashtra", "43": "Maharashtra", "44": "Maharashtra",
    "45": "Madhya Pradesh", "46": "Madhya Pradesh", "47": "Madhya Pradesh", "48": "Madhya Pradesh",
    "49": "Chhattisgarh",
    "50": "Telangana",
    "51": "Andhra Pradesh", "52": "Andhra Pradesh", "53": "Andhra Pradesh",
    "56": "Karnataka", "57": "Karnataka", "58": "Karnataka", "59": "Karnataka",
    "60": "Tamil Nadu", "61": "Tamil Nadu", "62": "Tamil Nadu", "63": "Tamil Nadu", "64": "Tamil Nadu",
    "67": "Kerala", "68": "Kerala", "69": "Kerala",
    "70": "West Bengal", "71": "West Bengal", "72": "West Bengal", "73": "West Bengal", "74": "West Bengal",
    "75": "Odisha", "76": "Odisha", "77": "Odisha",
    "78": "Assam", "79": "Assam",
    "80": "Bihar", "81": "Bihar", "82": "Bihar", "83": "Jharkhand", "84": "Bihar", "85": "Bihar"
}

# Multilingual month names (English and Hindi)
MONTH_NAMES: Dict[str, int] = {
    "jan": 1, "january": 1,
    "feb": 2, "february": 2,
    "mar": 3, "march": 3,
    "apr": 4, "april": 4,
    "may": 5,
    "jun": 6, "june": 6,
    "jul": 7, "july": 7,
    "aug": 8, "august": 8,
    "sep": 9, "september": 9, "sept": 9,
    "oct": 10, "october": 10,
    "nov": 11, "november": 11,
    "dec": 12, "december": 12,
    "जनवरी": 1, "फ़रवरी": 2, "फरवरी": 2, "मार्च": 3, "अप्रैल": 4, "मई": 5,
    "जून": 6, "जुलाई": 7, "अगस्त": 8, "सितंबर": 9, "अक्टूबर": 10, "नवंबर": 11, "दिसंबर": 12
}

# Word to number mapping for best before duration
WORD_TO_MONTHS: Dict[str, int] = {
    "one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6,
    "seven": 7, "eight": 8, "nine": 9, "ten": 10, "eleven": 11, "twelve": 12,
    "eighteen": 18, "twenty four": 24, "twenty-four": 24, "thirty six": 36
}

# Recognized countries for origin isolation
RECOGNIZED_COUNTRIES = [
    "India", "Bharat", "China", "Thailand", "Vietnam", "Bangladesh", "USA", "United States",
    "Germany", "Japan", "United Kingdom", "UK", "France", "Italy", "Switzerland", "Sri Lanka",
    "Nepal", "Bhutan", "Malaysia", "Indonesia", "Taiwan", "South Korea", "Korea", "Brazil",
    "Mexico", "Canada", "Australia", "New Zealand", "Spain", "Netherlands", "Turkey", "UAE",
    "PRC", "P.R.C."
]

# Complete suite of recognized statutory valid units (SI, length, area, volume, count, and Devanagari)
RECOGNIZED_VALID_UNITS: Set[str] = {
    # Mass
    "g", "gram", "grams", "gramme", "grammes", "kg", "kilogram", "kilograms", "mg", "milligram", "milligrams",
    # Volume
    "ml", "l", "litre", "litres", "liter", "liters", "cl", "centilitre", "centilitres",
    # Length
    "m", "meter", "meters", "metre", "metres", "cm", "centimeter", "centimeters", "centimetre", "centimetres", "mm", "millimeter", "millimeters",
    # Area
    "sq m", "sq cm", "sq mm", "sq.m", "sq.cm", "sq.mm", "m2", "cm2", "mm2", "m²", "cm²", "mm²",
    "square metre", "square metres", "square meter", "square meters", "square centimetre", "square centimetres", "square centimeter", "square centimeters",
    # Count / Units (LMPC Second Schedule)
    "n", "u", "units", "unit", "pcs", "piece", "pieces", "nos", "nos.", "no", "no.", "items", "item",
    "number", "numbers", "sachets", "sachet", "tablets", "tablet", "capsules", "capsule", "packs", "pack",
    "pair", "pairs", "sheet", "sheets", "wipe", "wipes", "set", "sets", "roll", "rolls",
    # Hindi Devanagari units
    "ग्राम", "ग्रा", "ग्रा.", "किग्रा", "कि.ग्रा.", "कि.ग्रा", "किलोग्राम", "मिली", "मि.ली.", "मि.ली", "मिलीलीटर", "लीटर", "ली", "ली.", "मीटर", "मी", "मी.", "सेंटीमीटर", "सेमी", "से.मी.", "से.मी", "नग", "इकाई"
}


class StatutoryDeclarationParser:
    """Deterministic, auditable parsers for statutory packaging declarations."""

    # Statutory tax inclusivity patterns under Rule 6(1)(e)
    TAX_INCLUSIVE_PATTERNS: List[str] = [
        r"inc[l]?(?:usive|\.)?\s*(?:of)?\s*all\s*(?:taxes?|gst)",
        r"inc[l]?(?:usive|\.)?\s*(?:of)?\s*(?:taxes?|gst)",
        r"all\s*(?:taxes?|gst)\s*inc[l]?(?:uded|usive|\.)?",
        r"(?:taxes?|gst)\s*inc[l]?(?:uded|usive|\.)?",
        r"including\s*(?:of)?\s*all\s*(?:taxes?|gst)",
        r"including\s*(?:taxes?|gst)",
        r"inclusive\s*(?:of)?\s*(?:all\s*)?(?:taxes?|gst)",
        r"inc[l]?\.?\s*(?:taxes?|gst)",
        r"कर\s*सहित",
        r"सभी\s*कर(?:ों)?\s*सहित",
        r"कुल\s*कर\s*सहित",
        r"कर\s*शामिल",
        r"अतिरिक्त\s*कर\s*नहीं",
    ]

    @classmethod
    def has_tax_inclusive_clause(cls, text: str) -> bool:
        """Determines if the text contains a mandatory tax inclusive clause per Rule 6(1)(e)."""
        if not text:
            return False
        norm_text = cls.convert_indic_digits(text)
        return any(re.search(p, norm_text, re.IGNORECASE) for p in cls.TAX_INCLUSIVE_PATTERNS)

    @staticmethod
    def convert_indic_digits(text: str) -> str:
        """Converts Devanagari numerals (०-९) and fractions to standard ASCII decimal digits (0-9).
        Also normalizes Unicode NFC and strips invisible zero-width and non-breaking space characters.
        """
        if not text:
            return ""
        # Normalize Unicode NFC and strip invisible formatting noise (BOM, zero-width space, non-breaking space)
        cleaned = unicodedata.normalize("NFC", text)
        cleaned = (
            cleaned.replace("\u200b", "")
            .replace("\ufeff", "")
            .replace("\u00a0", " ")
            .replace("\u202f", " ")
        )
        converted = cleaned.translate(DEVANAGARI_DIGITS_MAP)
        # Normalize Unicode homoglyphs (Cyrillic, Greek lookalikes, typographic dashes, quotes)
        converted = converted.translate(HOMOGLYPH_MAP)
        # Normalize mixed fractions (e.g. '1 ½', '1 1/2', '2 ¼', '2 1/4', '3 ¾', '3 3/4')
        converted = re.sub(r"(?<=\d)\s+(?:1/2|½)", ".5", converted)
        converted = re.sub(r"(?<=\d)\s+(?:1/4|¼)", ".25", converted)
        converted = re.sub(r"(?<=\d)\s+(?:3/4|¾)", ".75", converted)
        # Normalize standalone Unicode vulgar fractions
        converted = converted.replace("½", "0.5").replace("¼", "0.25").replace("¾", "0.75")
        return converted



    @classmethod
    def detect_banned_units(cls, text: str) -> Tuple[bool, Optional[str]]:
        """Flags non-standard prohibited unit symbols under Section 11 & Rule 12.

        Distinguishes banned capitalized 'ML' from statutory valid 'ml' or 'mL'.
        Detects prohibited 'gms', 'gm', 'g.m.', 'g.m', 'g.m.s.', 'g.m.s', 'Kgs', 'kgms',
        'k.g.', 'k.g', 'ltrs', 'ltr', 'LTR', 'cc', 'c.c.', 'c.c', 'g.', 'kg.', 'ml.', 'l.', etc.
        Guards strictly against false positives inside:
        - Email domains (e.g. 'care@ml.com')
        - Website URLs (e.g. 'www.ml.com')
        - Latin abbreviations (e.g. 'e.g.', 'i.e.', 'etc.')
        - Technology terms (e.g. 'AI/ML', 'Machine Learning')
        - Corporate titles/entities ('GM Foods', 'GM Operations', 'Non-GM')
        - Email recipient headers ('CC: care@...')
        """
        if not text:
            return False, None

        norm_text = cls.convert_indic_digits(text)

        # Mask email addresses and web URLs to avoid false positives on domains (e.g. care@ml.com, www.ml.com, nestle.com/ML)
        masked_text = re.sub(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b", " ", norm_text)
        masked_text = re.sub(
            r"(?:https?://\S+|www\.[A-Za-z0-9.-]+\.[A-Za-z]{2,}\S*|\b[A-Za-z0-9.-]+\.(?:com|org|net|in|co\.in|gov|io|edu)(?:/[^\s]*)?)",
            " ",
            masked_text,
            flags=re.IGNORECASE
        )

        # Mask Latin abbreviations containing periods or 'g' to prevent false positive 'g.' (e.g. 'e.g. with milk', 'i.e.', 'etc.')
        masked_text = re.sub(r"(?<![a-zA-Z])(?:e\.?\s*g\.?|i\.?\s*e\.?|etc\.?)(?![a-zA-Z])", " ", masked_text, flags=re.IGNORECASE)

        # Mask AI/ML technology acronyms to prevent false positive 'ML' on smart IoT / devices
        masked_text = re.sub(
            r"(?:\bAI\s*[/&+\s]+\s*ML\b|\bML\s*[/&+\s]+\s*AI\b|\bMachine\s*Learning\s*(?:\(\s*ML\s*\)|\b)|\bML[-\s]*(?:powered|model|algorithm|ops|system|enabled|chip|processor|engine|pipeline|framework|tech|technology|solution)\b)",
            " ",
            masked_text,
            flags=re.IGNORECASE
        )

        # Mask corporate names and designations starting with uppercase GM or G.M. (e.g. GM Foods, G.M. Agro, GM - Operations, Non-GM)
        masked_text = re.sub(
            r"\b(?:Non-G\.?M\.?|G\.?\s*M\.?\s*(?:-|:)?\s*(?:Foods|Agro|Bio|Organics|Mills|Exports|Enterprises|Motors|Breweries|Laboratories|Pharma|Products|Industries|Operations|Sales|Quality|Plant|Director|Manager|Executive|Officer|Unit|Works|Ltd|Limited|Pvt|LLP|Corp|Inc|Tech)\b)",
            " ",
            masked_text,
            flags=re.IGNORECASE
        )

        # 1. Check case-sensitive banned symbols first (capitalized 'ML', 'Ml', 'M.L.', 'M.L')
        cs_match = BANNED_UNITS_CASE_SENSITIVE.search(masked_text)
        if cs_match:
            return True, cs_match.group(0).strip()

        # 2. Check general prohibited symbols (case-insensitive)
        ci_match = BANNED_UNITS_CASE_INSENSITIVE.search(masked_text)
        if ci_match:
            return True, ci_match.group(0).strip()

        # 3. Check prohibited lowercase or mixed 'gm' / 'g.m.'
        gm_match = BANNED_GM_GENERAL.search(masked_text)
        if gm_match:
            return True, gm_match.group(0).strip()

        # 4. Check prohibited uppercase 'GM' when accompanied by quantity or unit position
        gm_num_match = BANNED_GM_UPPERCASE_WITH_QTY.search(masked_text)
        if gm_num_match:
            return True, gm_num_match.group(0).strip()

        # 5. Check prohibited 'cc' / 'c.c.' accompanied by quantity
        cc_match = BANNED_CC_WITH_QTY.search(masked_text)
        if cc_match:
            return True, cc_match.group(0).strip()

        return False, None

    @classmethod
    def parse_net_quantity(cls, text: str) -> Optional[Dict[str, Any]]:
        """Extracts net quantity magnitude and metric unit, evaluating prohibited symbols.

        Handles mass (g, kg, mg), volume (ml, l, cl), length (m, cm, mm),
        area (sq m, sq cm, m²), count (N, U, units, pcs, nos), and Devanagari Hindi units.
        Supports:
        - Multi-pack and wholesale declarations under Rule 24: '4 x 50 g', '4 N x 50 g = 200 g',
          'Pack of 3 x 100 g', '10 sachets x 2 g each', computing total mass/volume and disallowing 'x' as unit.
        - Dual bracketed quantities: '500 ml (450 g)'.
        - Comma-separated numbers (1,000 or 1, 000), fractions (1/2, ½),
          leading-dot decimals (.5), and Devanagari numerals.
        """
        if not text:
            return None

        norm_text = cls.convert_indic_digits(text)

        # 0. Check Multi-Pack / Multi-Piece Wholesale Syntax (Rule 24 & Rule 6(1)(c))
        # e.g. "Net Qty: 4 x 50 g", "4 N x 50 g = 200 g", "Pack of 3 x 100 g", "10 sachets x 2 g", "2 pairs x 1 set"
        multipack_pattern = re.compile(
            r"(?:Net\s*(?:Quantity|Qty\.?|Weight|Wt\.?|Content|Contents|Volume|Vol\.?|Mass)|Quantity|Qty\.?|Pack\s*of|शुद्ध\s*(?:मात्रा|भार|वजन|सामग्री)|निवल\s*(?:मात्रा|भार|वजन|सामग्री))?\s*[:\-]?\s*"
            r"(?:([0-9]+)\s*(?:N|U|units?|pcs|nos?|pieces?|sachets?|packs?|bars?|bottles?|cans?|pairs?|sheets?|wipes?|sets?|rolls?|tablets?|capsules?|नग|इकाई)?\s*(?:of)?\s*[xX*×]\s*([0-9]+(?:\.[0-9]+)?)\s*([a-zA-Z²³\.\u0900-\u097F]+))"
            r"(?:\s*(?:=|Total\s*[:\-]?|\(Total\s*[:\-]?)\s*([0-9]+(?:\.[0-9]+)?)\s*([a-zA-Z²³\.\u0900-\u097F]+)\)?)?",
            re.IGNORECASE
        )
        multi_match = multipack_pattern.search(norm_text)
        if multi_match:
            count_str, piece_mag_str, piece_unit_raw, total_mag_str, total_unit_raw = multi_match.groups()
            try:
                count_val = float(count_str)
                piece_mag_val = float(piece_mag_str)
                if count_val > 0 and piece_mag_val > 0:
                    cand_unit_word = piece_unit_raw.strip().split()[0].lower() if piece_unit_raw.strip() else ""
                    has_banned_multi, banned_sym_multi = cls.detect_banned_units(piece_unit_raw)

                    # Only proceed if piece unit is recognized or banned
                    if has_banned_multi or cand_unit_word in RECOGNIZED_VALID_UNITS:
                        if total_mag_str:
                            total_mag = float(total_mag_str.replace(",", ""))
                            clean_unit_str = total_unit_raw or piece_unit_raw
                        else:
                            total_mag = round(count_val * piece_mag_val, 4)
                            clean_unit_str = piece_unit_raw

                        clean_unit_word = clean_unit_str.strip().split()[0]
                        has_banned, banned_sym = cls.detect_banned_units(clean_unit_word)
                        if not has_banned and clean_unit_word.lower() in ("gm", "gms", "kgms", "kgs", "ltrs", "ltr", "cc"):
                            has_banned = True
                            banned_sym = clean_unit_word
                        if not has_banned:
                            has_banned, banned_sym = cls.detect_banned_units(clean_unit_str)
                        if not has_banned and multi_match:
                            has_banned, banned_sym = cls.detect_banned_units(multi_match.group(0))

                        # Standardize valid units
                        if not has_banned:
                            u_lower = clean_unit_word.lower()
                            if u_lower in ("g", "gram", "grams", "gramme", "grammes", "ग्राम", "ग्रा", "ग्रा."):
                                clean_unit_word = "g"
                            elif u_lower in ("kg", "kilogram", "kilograms", "किग्रा", "कि.ग्रा.", "कि.ग्रा", "किलोग्राम"):
                                clean_unit_word = "kg"
                            elif u_lower in ("mg", "milligram", "milligrams"):
                                clean_unit_word = "mg"
                            elif u_lower in ("ml", "millilitre", "millilitres", "मिली", "मि.ली.", "मि.ली", "मिलीलीटर"):
                                clean_unit_word = "ml"
                            elif u_lower in ("l", "litre", "litres", "liter", "liters", "लीटर", "ली", "ली."):
                                clean_unit_word = "l"
                            elif u_lower in ("cl", "centilitre", "centilitres"):
                                clean_unit_word = "cl"
                            elif u_lower in ("m", "meter", "meters", "metre", "metres", "मीटर", "मी", "मी."):
                                clean_unit_word = "m"
                            elif u_lower in ("cm", "centimeter", "centimeters", "centimetre", "centimetres", "सेंटीमीटर", "सेमी", "से.मी.", "से.मी"):
                                clean_unit_word = "cm"
                            elif u_lower in ("mm", "millimeter", "millimeters"):
                                clean_unit_word = "mm"

                        return {
                            "magnitude": total_mag,
                            "unit": clean_unit_word,
                            "has_banned_unit": has_banned,
                            "banned_unit_found": banned_sym,
                            "piece_count": int(count_val),
                            "piece_magnitude": piece_mag_val,
                        }
            except (ValueError, IndexError):
                pass

        # Regex for magnitude supporting standard floats, comma numbers, optical OCR typos (I/l->1, O->0), leading dots, and simple fractions
        mag_pattern = r"(-?)(?:([0-9IlO]+)\s*/\s*([0-9IlO]+)|([0-9IlO]+(?:,\s*[0-9IlO]+)*(?:\.[0-9IlO]+)?|\.[0-9IlO]+))"
        unit_pattern = r"([a-zA-Z²³\.\u0900-\u097F]+(?:\s+[a-zA-Z²³\.\u0900-\u097F]+)?|\b[NU]\b)"

        # 1. Match with explicit quantity prefix (highest priority)
        prefix_pattern = (
            r"(?:Net\s*(?:Quantity|Qty\.?|Weight|Wt\.?|Content|Contents|Volume|Vol\.?|Mass|Area)|Quantity|Qty\.?|शुद्ध\s*(?:मात्रा|भार|वजन|सामग्री)|निवल\s*(?:मात्रा|भार|वजन|सामग्री)|मात्रा|वजन)"
            r"\s*[:\-]?\s*"
            rf"{mag_pattern}"
            r"\s*"
            rf"{unit_pattern}"
        )
        match = re.search(prefix_pattern, norm_text, re.IGNORECASE)
        has_prefix = bool(match)

        # 2. Fallback to standalone magnitude + unit if recognized
        if not match:
            standalone_pattern = re.compile(
                rf"(?<![a-zA-Z0-9]){mag_pattern}\s*{unit_pattern}"
            )
            for m in standalone_pattern.finditer(norm_text):
                f_sign, f_num, f_den, f_dec, cand_unit_raw = m.group(1), m.group(2), m.group(3), m.group(4), m.group(5)
                words = cand_unit_raw.strip().split()
                first_w = words[0].lower() if words else ""
                two_w = f"{words[0]} {words[1]}".lower() if len(words) >= 2 else ""

                has_banned_cand, _ = cls.detect_banned_units(cand_unit_raw)
                # In standalone fallback without statutory prefix:
                # 1. Disallow bare single-letter count symbols "n" or "u" (which cause false positives from random text/cards)
                is_standalone_count = first_w in (
                    "units", "unit", "pcs", "piece", "pieces", "nos", "nos.", "no", "no.",
                    "tablets", "tablet", "capsules", "capsule", "sachets", "sachet",
                    "wipes", "sheets", "packs", "pair", "pairs", "rolls", "नग", "इकाई"
                )
                is_valid_standalone_length = (
                    first_w in ("m", "meter", "meters", "metre", "metres", "मीटर")
                    and (not cand_unit_raw or cand_unit_raw[0] != "M")
                    and bool(re.search(r"\b(?:length|dimensions?|width|height|tape|wire|cable|cord|rope|roll|मीटर|लंबाई)\b", norm_text, re.IGNORECASE) or first_w in ("meter", "meters", "metre", "metres", "मीटर"))
                )
                # 3. Disallow bare single-letter volume symbols "l" or "ltr" without volume context
                is_valid_standalone_volume = (
                    first_w in ("litre", "litres", "liter", "liters", "ml", "millilitre", "millilitres", "cl")
                    or (first_w in ("l", "ltr") and bool(re.search(r"\b(?:vol|volume|contents?|net|capacity|लीटर)\b", norm_text, re.IGNORECASE)))
                )

                is_valid_unit = (
                    has_banned_cand or
                    is_standalone_count or
                    is_valid_standalone_length or
                    is_valid_standalone_volume or
                    (first_w in RECOGNIZED_VALID_UNITS and first_w not in ("n", "u", "m", "l", "ltr")) or
                    (two_w in RECOGNIZED_VALID_UNITS and two_w not in ("n", "u", "m", "l", "ltr"))
                )
                if is_valid_unit:
                    match = m
                    break

        if not match:
            return None

        frac_sign, frac_num, frac_den, decimal_raw, unit_raw = match.group(1), match.group(2), match.group(3), match.group(4), match.group(5)

        if frac_num and frac_den:
            try:
                f_num = frac_num.translate(str.maketrans("OoIl", "0011"))
                f_den = frac_den.translate(str.maketrans("OoIl", "0011"))
                magnitude = float(f_num) / float(f_den)
            except (ValueError, ZeroDivisionError):
                return None
        elif decimal_raw:
            clean_num_str = decimal_raw.translate(str.maketrans("OoIl", "0011")).replace(",", "").replace(" ", "")
            try:
                magnitude = float(clean_num_str)
            except ValueError:
                return None
        else:
            return None

        if frac_sign == "-":
            magnitude = -magnitude


        if magnitude <= 0:
            return None

        # Resolve unit: avoid greedily consuming trailing packaging words (e.g. 'g when packed')
        unit_words = unit_raw.strip().split()
        if not unit_words:
            return None

        clean_unit = unit_words[0]

        # Strictly disallow multiplication operators 'x', 'X', '×' as units
        if clean_unit.lower() in ("x", "×", "*"):
            return None

        if len(unit_words) >= 2:
            candidate_two_word = f"{unit_words[0]} {unit_words[1]}".lower()
            if candidate_two_word in RECOGNIZED_VALID_UNITS:
                clean_unit = f"{unit_words[0]} {unit_words[1]}"

        # Check for banned units in clean_unit, the full unit_raw, and the matched quantity declaration
        has_banned, banned_sym = cls.detect_banned_units(clean_unit)
        if not has_banned and clean_unit.lower() in ("gm", "gms", "kgms", "kgs", "ltrs", "ltr", "cc"):
            has_banned = True
            banned_sym = clean_unit
        if not has_banned:
            has_banned, banned_sym = cls.detect_banned_units(unit_raw)
        if not has_banned and match:
            has_banned, banned_sym = cls.detect_banned_units(match.group(0))

        # Standardize metric units when valid
        if not has_banned:
            u_lower = clean_unit.lower()
            if u_lower in ("g", "gram", "grams", "gramme", "grammes", "ग्राम", "ग्रा", "ग्रा."):
                clean_unit = "g"
            elif u_lower in ("kg", "kilogram", "kilograms", "किग्रा", "कि.ग्रा.", "कि.ग्रा", "किलोग्राम"):
                clean_unit = "kg"
            elif u_lower in ("mg", "milligram", "milligrams"):
                clean_unit = "mg"
            elif u_lower in ("ml", "millilitre", "millilitres", "मिली", "मि.ली.", "मि.ली", "मिलीलीटर"):
                clean_unit = "ml"
            elif u_lower in ("l", "litre", "litres", "liter", "liters", "लीटर", "ली", "ली."):
                clean_unit = "l"
            elif u_lower in ("cl", "centilitre", "centilitres"):
                clean_unit = "cl"
            elif u_lower in ("m", "meter", "meters", "metre", "metres", "मीटर", "मी", "मी."):
                # Check for optical truncation of 'ml' ONLY when explicit volume/contents keyword is present
                # Guard against ingredient composition listings (e.g. '0.50m Brahmi')
                is_ingred = bool(re.search(r"\b(?:composition|ingredients?|contains?)\b", norm_text, re.IGNORECASE))
                if not is_ingred and re.search(r"\b(?:net\s*(?:content|contents|volume|vol\.?)|volume|vol\.?)\b", norm_text, re.IGNORECASE):
                    clean_unit = "ml"
                else:
                    clean_unit = "m"
            elif u_lower in ("cm", "centimeter", "centimeters", "centimetre", "centimetres", "सेंटीमीटर", "सेमी", "से.मी.", "से.मी"):
                clean_unit = "cm"
            elif u_lower in ("mm", "millimeter", "millimeters"):
                clean_unit = "mm"
            elif u_lower in ("sq m", "m2", "m²", "sq.m", "square metre", "square metres", "square meter", "square meters"):
                clean_unit = "sq m"
            elif u_lower in ("sq cm", "cm2", "cm²", "sq.cm", "square centimetre", "square centimetres", "square centimeter", "square centimeters"):
                clean_unit = "sq cm"
            elif u_lower in ("sq mm", "mm2", "mm²", "sq.mm"):
                clean_unit = "sq mm"
            elif u_lower.rstrip(".,;:-") in (
                "n", "u", "units", "unit", "pcs", "piece", "pieces", "nos", "nos.", "no", "no.",
                "number", "numbers", "items", "item", "sachets", "sachet", "tablets", "tablet", "capsules", "capsule",
                "packs", "pack", "pair", "pairs", "sheet", "sheets", "wipe", "wipes", "set", "sets", "roll", "rolls",
                "नग", "इकाई"
            ):
                clean_unit = "N"

        return {
            "magnitude": magnitude,
            "unit": clean_unit,
            "has_banned_unit": has_banned,
            "banned_unit_found": banned_sym,
            "has_prefix": has_prefix,
        }

    @classmethod
    def parse_mrp(cls, text: str) -> Optional[Dict[str, Any]]:
        """Parses Maximum Retail Price (MRP) amount and checks mandatory tax inclusivity clause.

        Under Rule 6(1)(e), declaration must state '(incl. of all taxes)'.
        Guards strictly against Unit Sale Price (USP) declarations (e.g. 'USP: Rs. 0.40/g')
        falsely evaluated as MRP amounts.
        Handles intermediate tax clauses, currency indicators (Rs., INR, ₹),
        Indian comma formatting (1,499.00 or 1, 499.00), and Devanagari numerals.
        """
        if not text:
            return None

        norm_text = cls.convert_indic_digits(text)
        # Normalize optical character variations where Rupee symbol ₹ is misrecognized as E, e, f, F after MRP
        norm_text = re.sub(r"\bMRP[EefF₹]\b", "MRP Rs. ", norm_text, flags=re.IGNORECASE)

        # Check mandatory tax inclusivity clause per Rule 6(1)(e)
        tax_inclusive = cls.has_tax_inclusive_clause(norm_text)

        mrp_prefix = r"(?:M\.?\s*R\.?\s*P\.?[EefF₹]?|Maximum\s*Retail\s*Price|Max\.?\s*Retail\s*Price|अ\.वि\.मू\.?|अधिकतम\s*खुदरा\s*मूल्य)"
        tax_clause_group = (
            r"(?:\([^)]*(?:tax|taxes|gst|कर)[^)]*\)|"
            r"inc[l]?(?:usive|\.)?\s*(?:of)?\s*all\s*(?:taxes?|gst)|"
            r"inc[l]?(?:usive|\.)?\s*(?:of)?\s*(?:taxes?|gst)|"
            r"all\s*(?:taxes?|gst)\s*included|"
            r"including\s*(?:of)?\s*all\s*(?:taxes?|gst)|"
            r"कर\s*सहित|सभी\s*कर(?:ों)?\s*सहित)"
        )
        curr = r"(?:(?<![a-zA-Z])(?:Rs\.?|R\s*s\.?|R[58]\.?|Ps\.?|Re\.(?=\s*[0-9])|INR|₹|रु\.?|रू\.?|रुपये|रुपए))"
        amount_re = r"((?=[0-9Ool]*[0-9])[0-9Ool]+(?:[,\s]\s*[0-9Ool]{3})*(?:\s*\.\s*[0-9Ool]{1,2})?)"
        unit_den_re = r"\s*(?:/|per|प्रति)\s*(?:[0-9]+\s*)?(?:g(?:m|ms)?|kg(?:m|ms)?|m?l|ltrs?|units?|pcs?|nos?|items?|packs?|सेंटीमीटर|सेमी|मीटर|ग्राम|ग्रा|किग्रा|कि\.ग्रा|मिलीलीटर|मिली|मि\.ली|लीटर|ली|नग|इकाई|N)\b"

        # Priority 0: Struck-through crossed price (common in e-commerce: ~~₹199~~ ₹99 or <s>199</s> 99)
        # Under Rule 6(1)(e), the original struck-through amount is the statutory MRP, not the discounted deal price
        struck_re = re.compile(
            rf"(?:~~|<s>|<del>|<strike>)\s*(?:M\.?R\.?P\.?\s*[:\-]?\s*)?(?:{curr})?\s*[:\-]?\s*{amount_re}\s*(?:~~|</s>|</del>|</strike>)",
            re.IGNORECASE
        )
        m_struck = struck_re.search(norm_text)
        if m_struck:
            amount_str = m_struck.group(1).translate(str.maketrans("OoIl", "0011")).replace(",", "").replace(" ", "")
            try:
                amount = float(amount_str)
                if amount > 0:
                    return {
                        "amount": amount,
                        "currency": "INR",
                        "tax_inclusive": tax_inclusive,
                    }
            except ValueError:
                pass

        # Pattern 1: Explicit MRP prefix, with optional intervening tax clause, currency, or colon/dash
        p1 = re.compile(
            rf"{mrp_prefix}\s*(?:{tax_clause_group})?\s*[:\-]?\s*(?:{curr})?\s*[:\-]?\s*(?:{tax_clause_group})?\s*[:\-]?\s*(?:{curr})?\s*[:\-]?\s*(?:{tax_clause_group})?\s*[:\-]?\s*{amount_re}\s*(?:/-)?",
            re.IGNORECASE
        )
        match = p1.search(norm_text)
        if match:
            # Reject if the matched MRP amount is immediately followed by a per-unit denominator (e.g. MRP: Rs. 0.50/g or Rs. 25/100g)
            after_amount = norm_text[match.end():min(len(norm_text), match.end() + 20)]
            if re.match(unit_den_re, after_amount, re.IGNORECASE):
                match = None

        # Pattern 1c: Amount preceding parenthetical or trailing MRP clause (e.g. 'RS. 260. 00 (MRP Rs. Incl. of all taxes...)')
        if not match:
            p1c = re.compile(
                rf"{curr}\s*[:\-]?\s*{amount_re}\s*(?:/-)?\s*(?:\([^)]*(?:MRP|Maximum\s*Retail\s*Price|अ\.वि\.मू|अधिकतम\s*खुदरा\s*मूल्य)[^)]*\)|(?:MRP|Maximum\s*Retail\s*Price)\b)",
                re.IGNORECASE
            )
            match = p1c.search(norm_text)
            if match:
                after_amount = norm_text[match.end():min(len(norm_text), match.end() + 20)]
                if re.match(unit_den_re, after_amount, re.IGNORECASE):
                    match = None

        # Pattern 2: Standalone currency symbol followed by amount (ONLY if NOT part of a USP declaration or discount)
        if not match:
            # Reject if string is explicitly marked as USP rate or contains unit denominator (/g, /ml, per unit)
            is_usp = bool(re.search(rf"(?:(?:USP|Unit\s*Sale\s*Price)\s*[:\-]?\s*(?:{curr})?\s*[0-9]+|{unit_den_re})", norm_text, re.IGNORECASE))
            is_discount = bool(re.search(r"\b(?:save|discount|off|cashback|deal\s*price|selling\s*price|offer\s*price|special\s*price|our\s*price|now)\b", norm_text, re.IGNORECASE))

            if not is_usp and not is_discount:
                p2 = re.compile(
                    rf"{curr}\s*[:\-]?\s*{amount_re}\s*(?:/-)?",
                    re.IGNORECASE
                )
                match = p2.search(norm_text)
                if match:
                    after_amount = norm_text[match.end():min(len(norm_text), match.end() + 20)]
                    if re.match(unit_den_re, after_amount, re.IGNORECASE):
                        match = None

        if not match:
            return None

        amount_str = match.group(1).translate(str.maketrans("OoIl", "0011")).replace(",", "").replace(" ", "")
        try:
            amount = float(amount_str)
            if amount <= 0:
                return None
        except ValueError:
            return None


        return {
            "amount": amount,
            "currency": "INR",
            "tax_inclusive": tax_inclusive,
        }

    @classmethod
    def parse_usp(cls, text: str) -> Optional[Dict[str, Any]]:
        """Extracts Unit Sale Price (USP) under Rule 6(1)(k) (G.S.R. 779(E)).

        Validates that denominator is a recognized metric or count unit
        (g, ml, 100g, 100ml, kg, l, piece, unit, N, U, etc.), guarding against
        arbitrary words or dates falsely parsed as units.
        """
        if not text:
            return None

        norm_text = cls.convert_indic_digits(text)

        usp_prefix = r"(?:Unit\s*Sale\s*Price|USP|इकाई\s*विक्रय\s*मूल्य|इकाई\s*बिक्री\s*मूल्य)"
        curr = r"(?:Rs\.?|INR|₹|रु\.?|रू\.?|रुपये|र\.?|र)?"
        amount_re = r"([0-9]+(?:,\s*[0-9]+)*(?:\s*\.\s*[0-9]{1,4})?)"
        # Restrict denominator strictly to recognized statutory metric and count units (with Unicode-safe word boundary for Indic matras)
        denom_re = r"((?:100\s*)?(?:g|kg|mg|ml|l|cl|m|cm|mm|sq\s*m|sq\s*cm|sq\s*mm|n|u|pieces?|pcs|units?|items?|nos?|tablets?|tabs?\.?|tae\.?|capsules?|caps?\.?|sachets?|packs?|ग्राम|किग्रा|मिली|लीटर|मीटर|नग|इकाई))(?!\w|[\u0900-\u097F])"

        # Pattern 1a: Explicit USP prefix with price before unit (e.g. 'USP: Rs. 0.40/g' or '₹ 2.49/ml')
        p1 = re.compile(
            rf"{usp_prefix}\s*[:\-]?\s*{curr}\s*{amount_re}\s*(?:/|per|प्रति)\s*{denom_re}",
            re.IGNORECASE
        )
        match = p1.search(norm_text)

        # Pattern 1b: Inverted USP rate notation with unit before price (e.g. 'USP ₹/ml : 19.95', 'USP Rs./g : 0.25', 'USP Rs./ml 19.95')
        p1_inv = re.compile(
            rf"{usp_prefix}\s*[:\-]?\s*{curr}\s*(?:/|per|प्रति)?\s*{denom_re}(?:\s*[:\-]\s*|\s+){curr}\s*{amount_re}",
            re.IGNORECASE
        )
        m_inv = p1_inv.search(norm_text) if not match else None

        price_str = None
        unit_raw = None

        if match:
            price_str, unit_raw = match.groups()
        elif m_inv:
            match = m_inv
            unit_raw, price_str = m_inv.groups()
        else:
            p2 = re.compile(
                rf"(?:Rs\.?|INR|₹|रु\.?|रू\.?|रुपये)\s*{amount_re}\s*(?:/|per|प्रति|\s*)\s*{denom_re}",
                re.IGNORECASE
            )
            match = p2.search(norm_text)
            if match:
                price_str, unit_raw = match.groups()
            else:
                p2_no_curr = re.compile(
                    rf"(?:{amount_re}\s*(?:/|per|प्रति)\s*{denom_re}|([0-9]+(?:\s*\.\s*[0-9]{{1,4}})?)\s*(?:/|per|प्रति)\s*{denom_re})",
                    re.IGNORECASE
                )
                m_nc = p2_no_curr.search(norm_text)
                if m_nc:
                    groups = [g for g in m_nc.groups() if g is not None]
                    if len(groups) >= 2:
                        price_str, unit_raw = groups[0], groups[1]
                        match = m_nc

        if not match or not price_str or not unit_raw:
            return None
        try:
            price = float(price_str.replace(",", "").replace(" ", ""))
            if price <= 0:
                return None
        except ValueError:
            return None

        clean_unit = unit_raw.strip().lower()
        clean_unit = re.sub(r"\s+", "", clean_unit)
        # Normalize piece/pieces -> piece, units -> unit, nos -> unit
        if clean_unit in ("pieces", "piece", "pcs"):
            clean_unit = "piece"
        elif clean_unit in ("units", "unit", "nos", "no"):
            clean_unit = "unit"
        elif clean_unit in ("tablets", "tablet", "tabs", "tab", "tab.", "tabs.", "tae", "tae."):
            clean_unit = "tablet"
        elif clean_unit in ("capsules", "capsule", "caps", "cap", "cap.", "caps."):
            clean_unit = "capsule"
        elif clean_unit in ("n", "u"):
            clean_unit = "N"

        # Normalize Hindi Devanagari units
        hindi_usp_map = {
            "ग्राम": "g", "किग्रा": "kg", "मिली": "ml", "लीटर": "l", "मीटर": "m", "नग": "N", "इकाई": "N"
        }
        if clean_unit in hindi_usp_map:
            clean_unit = hindi_usp_map[clean_unit]
        elif clean_unit.startswith("100") and clean_unit[3:] in hindi_usp_map:
            clean_unit = f"100{hindi_usp_map[clean_unit[3:]]}"

        return {
            "price_per_unit": price,
            "unit": clean_unit,
        }

    @classmethod
    def parse_mfg_and_expiry_dates(cls, text: str) -> Dict[str, Any]:
        """Extracts manufacturing and expiry/best before dates under Rule 6(1)(d).

        Supports multiple date formats:
        - ISO 8601: YYYY-MM, YYYY/MM, YYYY-MM-DD
        - Standard: MM/YYYY, MM-YYYY, MM.YYYY, MM / YYYY (with spaces around delimiters)
        - Day dates: DD/MM/YYYY, DD-MM-YYYY, MM/DD/YYYY, DD/MM/YY
        - Alpha month dates: '15-Mar-2024', 'Mar 2024', 'March 2024'
        - Devanagari numerals and Hindi dates: 'उत्पादन तिथि: ०५/२०२४', 'मार्च २०२४'
        - Best before duration: 'Best before 12 months', 'Best before 180 days'
        """
        result: Dict[str, Any] = {
            "mfg_month": None,
            "mfg_year": None,
            "exp_month": None,
            "exp_year": None,
            "best_before_months": None,
        }

        if not text:
            return result

        norm_text = cls.convert_indic_digits(text)

        # 1. Best before duration (months or days)
        bb_pattern = re.compile(
            r"(?:best\s*before|use\s*before|best\s*by|within)\s*([0-9]+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|eighteen|twenty\s*four|twenty-four|thirty\s*six)\s*(months?|days?)",
            re.IGNORECASE
        )
        bb_match = bb_pattern.search(norm_text)
        if bb_match:
            bb_val = bb_match.group(1).lower().strip()
            bb_unit = bb_match.group(2).lower().strip()
            if bb_unit.startswith("month"):
                if bb_val.isdigit():
                    result["best_before_months"] = int(bb_val)
                elif bb_val in WORD_TO_MONTHS:
                    result["best_before_months"] = WORD_TO_MONTHS[bb_val]
            elif bb_unit.startswith("day") and bb_val.isdigit():
                # Convert days to approximate whole months (e.g. 90 days = 3 months, 180 days = 6 months)
                result["best_before_months"] = max(1, round(int(bb_val) / 30.0))

        # Prefixes for Manufacturing and Expiry
        mfg_prefix = (
            r"(?:Manufactured(?:\s*Date)?|Mfg\.?(?:\s*Date)?|Mfd\.?(?:\s*Date)?|"
            r"Packed\.?(?:\s*Date)?|Pkd\.?(?:\s*Date)?|Packaging(?:\s*Date)?|Packing(?:\s*Date)?|"
            r"Date\s*of\s*(?:Mfg|Mfd|Manufacture|Packaging|Packing|Pkg\.?|Pkd\.?)|"
            r"Month\s*(?:&|and)?\s*Year\s*of\s*(?:Mfg|Mfd|Manufacture|Manufacturing|Packaging|Packing|Pkg\.?|Pkd\.?)|"
            r"उत्पादन\s*(?:तिथि|माह(?:\s*एवं\s*वर्ष)?|का\s*महीना)?|पैकिंग\s*(?:तिथि|माह)?|निर्माण\s*तिथि)"
        )
        exp_prefix = (
            r"(?:Exp(?:\s*Date)?|Expiry(?:\s*Date)?|Use\s*by|Use\s*before|Best\s*before|"
            r"Date\s*of\s*(?:Expiry|Exp\.?)|अवसान\s*तिथि|समाप्ति\s*तिथि|उपयोग\s*तिथि)"
        )

        def extract_date_from_text(prefix_re: str, target_text: str) -> Tuple[Optional[int], Optional[int]]:
            # Sub-pattern A: Named/Alpha month (e.g. '15-Mar-2024', 'Mar 2024', 'March 2024', 'Mar 2O26')
            alpha_re = re.compile(
                rf"{prefix_re}\s*[:\-]?\s*(?:(\d{{1,2}})\s*[\/\-\.\s]\s*)?([a-zA-Z\u0900-\u097F]+)\s*[\/\-\.\s,]?\s*([0-9OolI]{{2,4}})",
                re.IGNORECASE
            )
            m_alpha = alpha_re.search(target_text)
            if m_alpha:
                _, m_name, yr_str = m_alpha.groups()
                m_clean = m_name.lower()[:3] if m_name.isascii() else m_name
                month = MONTH_NAMES.get(m_clean) or MONTH_NAMES.get(m_name.lower())
                yr_clean = yr_str.translate(str.maketrans("OoIl", "0011"))
                if yr_clean.isdigit():
                    yr = int(yr_clean)
                    year = yr + (2000 if yr < 100 else 0)
                    if month and 2000 <= year <= 2035:
                        return month, year

            # Sub-pattern B: ISO numeric date (e.g. '2024-04', '2024/04', '2024-04-15', '2O24-04')
            iso_re = re.compile(
                rf"{prefix_re}\s*[:\-]?\s*(2[0O][2-3][0-9OolI])\s*[\/\-\.]\s*(0[1-9]|1[0-2])(?:\s*[\/\-\.]\s*(?:[0-3]?[0-9]))?(?!\d)",
                re.IGNORECASE
            )
            m_iso = iso_re.search(target_text)
            if m_iso:
                year_clean = m_iso.group(1).translate(str.maketrans("OoIl", "0011"))
                if year_clean.isdigit():
                    year = int(year_clean)
                    month = int(m_iso.group(2))
                    return month, year

            # Sub-pattern C: Standard numeric date (e.g. '15/04/2024', '04/2024', '04 / 2024', '04-24', '04/2O26')
            num_re = re.compile(
                rf"{prefix_re}\s*[:\-]?\s*(?:([0-9OolI]{{1,2}})\s*[\/\-\.\s]\s*)?([0-9OolI]{{1,2}})\s*[\/\-\.\s]\s*([0-9OolI]{{2,4}})",
                re.IGNORECASE
            )
            m_num = num_re.search(target_text)
            if m_num:
                d1, d2, yr_str = m_num.groups()
                yr_clean = yr_str.translate(str.maketrans("OoIl", "0011"))
                if yr_clean.isdigit():
                    yr = int(yr_clean)
                    year = yr + (2000 if yr < 100 else 0)
                    d2_clean = d2.translate(str.maketrans("OoIl", "0011"))
                    if d2_clean.isdigit():
                        if d1 is not None:
                            d1_clean = d1.translate(str.maketrans("OoIl", "0011"))
                            if d1_clean.isdigit():
                                val1, val2 = int(d1_clean), int(d2_clean)
                                # Disambiguate DD/MM/YYYY vs MM/DD/YYYY
                                if val2 > 12 and 1 <= val1 <= 12:
                                    month = val1  # MM/DD/YYYY
                                elif 1 <= val2 <= 12:
                                    month = val2  # DD/MM/YYYY
                                else:
                                    month = None
                            else:
                                month = None
                        else:
                            val2 = int(d2_clean)
                            month = val2 if 1 <= val2 <= 12 else None

                        if month and 2000 <= year <= 2035:
                            return month, year

            # Sub-pattern D: Compact 6-digit MMYYYY without separator (e.g. 'Mfg. Date 072026')
            compact_re = re.compile(
                rf"{prefix_re}\s*[:\-]?\s*(0[1-9]|1[0-2])(20[2-3][0-9])(?!\d)",
                re.IGNORECASE
            )
            m_comp = compact_re.search(target_text)
            if m_comp:
                m_val, y_val = int(m_comp.group(1)), int(m_comp.group(2))
                if 1 <= m_val <= 12 and 2000 <= y_val <= 2035:
                    return m_val, y_val

            return None, None

        # 2. Extract Manufacturing Date
        m_mfg, y_mfg = extract_date_from_text(mfg_prefix, norm_text)
        if m_mfg and y_mfg and 2000 <= y_mfg <= 2030:
            result["mfg_month"] = m_mfg
            result["mfg_year"] = y_mfg
            result["has_mfg_prefix"] = True
        else:
            result["has_mfg_prefix"] = False
            # Standalone fallback date check (e.g. '03/2024', '03 / 2024', '04.2024', '2024-04', '03/2O26')
            sa_re = re.compile(r"(?<![0-9])(0[1-9]|1[0-2])\s*[\/\-\.]\s*(2[0O][2-3][0-9OolI]|[2-3][0-9])(?![0-9])")
            m_sa = sa_re.search(norm_text)
            if m_sa:
                month = int(m_sa.group(1))
                yr_clean = m_sa.group(2).translate(str.maketrans("OoIl", "0011"))
                if yr_clean.isdigit():
                    yr = int(yr_clean)
                    year = yr + (2000 if yr < 100 else 0)
                    if 1 <= month <= 12 and 2000 <= year <= 2030:
                        result["mfg_month"] = month
                        result["mfg_year"] = year
            else:
                # Standalone ISO format: YYYY-MM or YYYY/MM or YYYY.MM (e.g. '2024-04', '2O24-04')
                iso_sa_re = re.compile(r"(?<![0-9])(2[0O][2-3][0-9OolI])\s*[\/\-\.]\s*(0[1-9]|1[0-2])(?![0-9])")
                m_iso_sa = iso_sa_re.search(norm_text)
                if m_iso_sa:
                    year_clean = m_iso_sa.group(1).translate(str.maketrans("OoIl", "0011"))
                    if year_clean.isdigit():
                        year = int(year_clean)
                        month = int(m_iso_sa.group(2))
                        if 1 <= month <= 12 and 2000 <= year <= 2030:
                            result["mfg_month"] = month
                            result["mfg_year"] = year

        # 3. Extract Expiry Date
        m_exp, y_exp = extract_date_from_text(exp_prefix, norm_text)
        if m_exp and y_exp:
            result["exp_month"] = m_exp
            result["exp_year"] = y_exp
        elif (not result["exp_month"] or not result["exp_year"]) and result["mfg_month"] and result["mfg_year"] and result["best_before_months"]:
            # Derive expiration date from manufacturing date + best before months
            total_months = result["mfg_month"] + result["best_before_months"]
            derived_year = result["mfg_year"] + (total_months - 1) // 12
            derived_month = ((total_months - 1) % 12) + 1
            if 2000 <= derived_year <= 2035:
                result["exp_month"] = derived_month
                result["exp_year"] = derived_year
                result["is_derived_expiry"] = True

        return result

    @classmethod
    def parse_pin_code(cls, text: str) -> Optional[str]:
        """Extracts a valid 6-digit Indian PIN code (100000 - 999999).

        Supports:
        - Standalone 6 digits: '700017', '400057'
        - Formatted with space/hyphen: '110 020', '560-001'
        Guards strictly against:
        - 10-digit phone numbers ('9876543210' must NOT match '987654')
        - 14-digit FSSAI numbers ('10014022001234' must NOT match '100140')
        - 15-character GSTINs ('27AAPFU0939F1ZV')
        - Batch numbers / Lot numbers ('Batch No: 110020' must NOT match)
        - Pricing values ('MRP: Rs. 100020' or '100020/-' must NOT match)
        - Metric or count quantities ('100020 units', '100020 kg' must NOT match)
        """
        if not text:
            return None

        norm_text = cls.convert_indic_digits(text)

        disallowed_prefix_re = re.compile(
            r"\b(?:tel|phone|mob|call|fssai|lic(?:ence|ense)?\.?\s*(?:no\.?|number)|lic\.?\s*no\.?|batch|b\.?no|lot|invoice|barcode|ean|upc|cin(?:\s*no\.?)?|reg(?:n|d)?\.?\s*no\.?|registration\s*(?:no\.?|number)|mrp|rs|inr|price|exp|mfg|pkg)\b|[₹]",
            re.IGNORECASE
        )
        disallowed_suffix_tokens = [
            "/-", "₹", "rs", "inr", "g", "kg", "ml", "l", "pcs", "pieces",
            "units", "unit", "tablets", "capsules", "nos"
        ]

        pin_re = re.compile(r"(?<![a-zA-Z0-9])([1-9I][0-9OolI]{2})\s*[\-]?\s*([0-9OolI]{3})(?![a-zA-Z0-9])")
        for m in pin_re.finditer(norm_text):
            raw_cand = m.group(1) + m.group(2)
            cand = raw_cand.translate(str.maketrans("OoIl", "0011"))
            if not (cand.isdigit() and len(cand) == 6 and cand[0] != '0'):
                continue

            # Require at least 2 genuine digits or postal/address anchor context to prevent purely alphabetic matches
            genuine_digits = sum(1 for c in raw_cand if c.isdigit())
            start, end = m.span()

            prefix_window = norm_text[max(0, start - 35):start]
            suffix_window = norm_text[end:min(len(norm_text), end + 15)].lower().strip()

            # If an explicit address anchor (Regd Office, Address, PIN) appears in the prefix window,
            # it resets previous clause context (e.g. 'Lic. under FSSAI Act. Regd Office: Mumbai 400001')
            addr_anchor = re.search(r"\b(?:regd?\.?\s*off(?:ice)?|address|works|factory|निर्माता|pin(?:\s*code)?|postal)\b", prefix_window, re.IGNORECASE)
            if genuine_digits < 2 and not addr_anchor:
                continue

            effective_prefix = prefix_window[addr_anchor.start():] if addr_anchor else prefix_window

            # Disallow matches immediately preceded by telephone, batch, price, or license keywords
            if disallowed_prefix_re.search(effective_prefix):
                continue

            # Disallow matches followed by price or measurement units
            if any(suffix_window.startswith(k) for k in disallowed_suffix_tokens):
                continue

            return cand

        return None

    @classmethod
    def parse_address(cls, text: str) -> Optional[Dict[str, Any]]:
        """Parses address tokens into entity name, address line, State, and 6-digit PIN code.

        Statutory completeness per Working Default OQ-02: State + 6-digit PIN code.
        Resolves State from:
        1. Explicit full State / UT names (English & Hindi)
        2. High-precision 3-digit PIN prefix mapping (e.g. 403 -> Goa, 248/249/263 -> Uttarakhand)
        3. Two-letter State abbreviations (MH, DL, KA, TN, WB, UP, MP, GJ, RJ, etc.)
        4. Major commercial Indian cities (Mumbai, Bengaluru, Kolkata, Haridwar, etc.)
        5. 2-digit PIN prefix fallback mapping (e.g. 40... -> Maharashtra)
        Extracts corporate/entity name from address starters or corporate suffixes.
        """
        if not text:
            return None

        norm_text = cls.convert_indic_digits(text)

        # 1. Extract PIN code
        pin_code = cls.parse_pin_code(norm_text)

        # 2. Detect Indian State / UT
        detected_state: Optional[str] = None

        # Check explicit State names via precompiled unified regex
        m_state = INDIAN_STATES_REGEX.search(norm_text)
        if m_state:
            raw_state = m_state.group(1)
            raw_state_lower = raw_state.lower()
            if raw_state_lower == "orissa":
                detected_state = "Odisha"
            elif raw_state_lower == "pondicherry":
                detected_state = "Puducherry"
            elif raw_state_lower == "uttaranchal":
                detected_state = "Uttarakhand"
            elif raw_state_lower in ("new delhi", "दिल्ली"):
                detected_state = "Delhi"
            elif raw_state == "उत्तर प्रदेश":
                detected_state = "Uttar Pradesh"
            elif raw_state == "महाराष्ट्र":
                detected_state = "Maharashtra"
            elif raw_state == "गुजरात":
                detected_state = "Gujarat"
            else:
                for s in INDIAN_STATES_AND_UTS:
                    if s.lower() == raw_state_lower:
                        detected_state = s
                        break
                if not detected_state:
                    detected_state = raw_state

        # Check major commercial cities mapped to states (explicit city in text has precedence over shared PIN prefixes)
        if not detected_state:
            m_city = MAJOR_CITIES_REGEX.search(norm_text)
            if m_city:
                detected_state = MAJOR_CITIES_TO_STATE.get(m_city.group(1).lower())

        # Check high-precision 3-digit PIN prefix overrides (e.g. 403 -> Goa, 249 -> Uttarakhand)
        if not detected_state and pin_code:
            prefix3 = pin_code[:3]
            if prefix3 in PIN_3DIGIT_TO_STATE:
                detected_state = PIN_3DIGIT_TO_STATE[prefix3]

        # Check State Abbreviations if not found
        if not detected_state:
            m_abbr = STATE_ABBR_REGEX.search(norm_text)
            if m_abbr:
                detected_state = STATE_ABBREVIATIONS.get(m_abbr.group(1))


        # Fallback: Infer State from 2-digit PIN code prefix
        if not detected_state and pin_code:
            prefix2 = pin_code[:2]
            if prefix2 in PIN_PREFIX_TO_STATE:
                detected_state = PIN_PREFIX_TO_STATE[prefix2]

        # 3. Detect Registered Corporate Entity Name
        entity_name: Optional[str] = None

        # Approach A: Extract entity anchored to address prefix (e.g. "Manufactured by: Krishna Dairy, ...", "Manufactured in India by: ABC Ltd")
        pref_anchor_re = re.compile(
            r"(?:Manufactured\s*(?:,|&|and)?\s*Packed\s*(?:&|and)?\s*Marketed\s*(?:in\s+[a-zA-Z\u0900-\u097F]+\s*)?by|"
            r"Manufactured\s*(?:&|and)?\s*Marketed\s*(?:in\s+[a-zA-Z\u0900-\u097F]+\s*)?by|"
            r"Manufactured\s*(?:&|and)?\s*Packed\s*(?:in\s+[a-zA-Z\u0900-\u097F]+\s*)?by|"
            r"Manufactured\s*(?:in\s+[a-zA-Z\u0900-\u097F]+\s*)?by|Manufacturer\s*[:\-]|Mfd\.?\s*(?:in\s+[a-zA-Z\u0900-\u097F]+\s*)?by|Mfg\.?\s*(?:in\s+[a-zA-Z\u0900-\u097F]+\s*)?by|"
            r"Processed\s*(?:&|and)?\s*Packed\s*by|Formulated\s*(?:&|and)?\s*Packed\s*by|"
            r"Marketed\s*(?:&|and)?\s*Distributed\s*by|"
            r"Packed\s*(?:in\s+[a-zA-Z\u0900-\u097F]+\s*)?by|Pkd\.?\s*(?:in\s+[a-zA-Z\u0900-\u097F]+\s*)?by|"
            r"Marketed\s*by|Imported\s*by|"
            r"Works\s*[:\-]|Factory\s*[:\-]|Mfg\s*Unit\s*[:\-]|"
            r"निर्माता(?:\s*एवं\s*पैकर)?|पैकर|निर्मित|आयातकर्ता)\s*[:\-]?\s*"
            r"([^,\n\r]+?)(?:,|\n|\r|Plot|Sector|Road|Phase|Industrial|Village|Dist|Taluka|City|Area|Ward|No\.|\b(?=[A-Z][a-z]+\s*-\s*[1-9]))",
            re.IGNORECASE
        )
        anchor_match = pref_anchor_re.search(norm_text)
        if anchor_match:
            cand_name = anchor_match.group(1).strip()
            cand_name = re.sub(r"COUNTRY\s*OF\s*ORIGIN\s*:\s*[A-Za-z]+", "", cand_name, flags=re.IGNORECASE).strip(" ,-:")
            # Strip trailing plot/building/street prefixes attached after corporate suffix (e.g. 'Exotic Mile Pvt Ltd 8-67' -> 'Exotic Mile Pvt Ltd')
            cand_name = re.sub(r"(\b(?:Ltd\.?|Limited|LLP|Inc\.?|Corp\.?))\s+[A-Za-z0-9]+-[0-9]+.*$", r"\1", cand_name, flags=re.IGNORECASE).strip(" ,-:")
            # Clean trailing periods or dashes
            cand_name = cand_name.strip("- :")
            if len(cand_name) >= 3 and not cand_name.isdigit():
                entity_name = cand_name

        # Approach B: Fallback to corporate suffix pattern (English & Hindi) - Linear ReDoS-free extraction
        if not entity_name:
            corp_suffix_re = re.compile(
                r"\b(?:Company\s+(?:Limited|Ltd\.?)|Co\.\s*(?:Limited|Ltd\.?)|Private\s*Limited|Pvt\.?\s*Ltd\.?|Ltd\.?|Limited|LLP|Inc\.?|Corp\.?|Company|Co\.?|Industries|Enterprises|Wellness|Laboratories|Healthcare|Pharma|Foods|Beverages|Products|Cooperative|लिमिटेड|प्राइवेट\s*लिमिटेड)(?:\.|\b)",
                re.IGNORECASE
            )
            suffix_match = corp_suffix_re.search(norm_text)
            if suffix_match:
                end_idx = suffix_match.end()
                start_window = max(0, suffix_match.start() - 80)
                snippet = norm_text[start_window:end_idx]
                chunks = re.split(r"[\n\r;]|(?:\b(?:by|at|for|from|ऑफिस|पता)\s+)", snippet, flags=re.IGNORECASE)
                cand_chunk = chunks[-1].strip(" ,-:")
                cleaned_entity = re.sub(
                    r"^(?:Manufactured\s*(?:,|&|and)?\s*Packed\s*(?:&|and)?\s*Marketed\s*(?:in\s+[a-zA-Z\u0900-\u097F]+\s*)?by|"
                    r"Manufactured\s*(?:&|and)?\s*Packed\s*(?:in\s+[a-zA-Z\u0900-\u097F]+\s*)?by|"
                    r"Manufactured\s*(?:in\s+[a-zA-Z\u0900-\u097F]+\s*)?by|Manufacturer|Mfd\.?\s*(?:in\s+[a-zA-Z\u0900-\u097F]+\s*)?by|Mfg\.?\s*(?:in\s+[a-zA-Z\u0900-\u097F]+\s*)?by|"
                    r"Processed\s*(?:&|and)?\s*Packed\s*by|Formulated\s*(?:&|and)?\s*Packed\s*by|"
                    r"Marketed\s*(?:&|and)?\s*Distributed\s*by|"
                    r"Packed\s*(?:in\s+[a-zA-Z\u0900-\u097F]+\s*)?by|Pkd\.?\s*(?:in\s+[a-zA-Z\u0900-\u097F]+\s*)?by|"
                    r"Marketed\s*by|Imported\s*by|Works|Factory|Address|निर्माता|पैकर)\s*[:\-]?\s*",
                    "",
                    cand_chunk,
                    flags=re.IGNORECASE
                ).strip(" ,-:")
                cleaned_entity = re.sub(r"COUNTRY\s*OF\s*ORIGIN\s*:\s*[A-Za-z]+", "", cleaned_entity, flags=re.IGNORECASE).strip(" ,-:")
                if cleaned_entity and len(cleaned_entity) >= 3:
                    entity_name = cleaned_entity

        # Statutory completeness per OQ-02: State + 6-digit PIN code
        is_complete = bool(detected_state and pin_code)

        if not detected_state and not pin_code and not entity_name:
            address_keywords = ["plot", "sector", "road", "phase", "street", "industrial", "area", "village", "taluka", "dist", "district", "estate"]
            if not any(k in norm_text.lower() for k in address_keywords):
                return None

        return {
            "name": entity_name,
            "address_line": norm_text.strip(),
            "state": detected_state,
            "pin_code": pin_code,
            "is_complete": is_complete,
        }

    @classmethod
    def check_consumer_care_completeness(cls, full_text: str) -> Dict[str, Any]:
        """Validates presence of all 4 Consumer Care tuples under Rule 6(1)(n).

        Tuples:
        1. Contact Person / Department
        2. Postal Address / Reference to Manufacturer Address
        3. Telephone / Toll-free Contact Number
        4. Valid Email Address
        Guards strictly against FSSAI license numbers and barcodes falsely detected as phone numbers.
        """
        if not full_text:
            return {
                "has_email": False, "has_phone": False, "has_address": False,
                "has_contact_name": False, "is_complete": False, "email": None, "phone": None
            }

        norm_text = cls.convert_indic_digits(full_text)

        # 1. Email pattern
        email_pattern = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b")
        email_match = email_pattern.search(norm_text)
        has_email = bool(email_match)
        email_str = email_match.group(0).strip() if email_match else None

        if not email_match:
            # Fallback for OCR corruption of '@' symbol after 'Email' label (e.g. 'Email: shopabellavitaorganic.com' or 'shop(a)bellavitaorganic.com')
            fallback_email_re = re.compile(
                r"(?:email|e-mail|mail)\s*[:\-]?\s*(?:[^\n]+\n)?\s*([a-zA-Z0-9._%+-]+?)(?:@|[a©]|(?:\(a\)))([a-zA-Z0-9.-]+\.(?:com|in|co\.in|org|net|gov|io))\b",
                re.IGNORECASE
            )
            fb_m = fallback_email_re.search(norm_text)
            if fb_m:
                user_part, domain_part = fb_m.group(1), fb_m.group(2)
                email_str = f"{user_part}@{domain_part}"
                has_email = True

        # 2. Phone pattern: Toll-free 1800/1860 or telephone with explicit keyword prefix
        phone_match_str: Optional[str] = None

        toll_free_pattern = re.compile(r"\b(1800|1860)[-\s]?[0-9]{2,4}[-\s]?[0-9]{3,4}\b")
        tf_match = toll_free_pattern.search(norm_text)

        if tf_match:
            phone_match_str = tf_match.group(0).strip()
        else:
            std_phone_pattern = re.compile(
                r"(?:tel|phone|contact|toll[- ]free|helpline|call|care\s*(?:no\.?|number)?|customer\s*care(?:\s*(?:no\.?|number|executive|manager|officer|desk|cell|helpdesk))?|ph|mob|whatsapp|t:|फोन)\s*[:\-]?\s*"
                r"((?:\(\s*0?\d{2,4}\s*\)\s*|\+?91[-\s]?|0\d{2,4}[-\s]?))?([1-9][0-9\s\-]{5,12}[0-9])\b",
                re.IGNORECASE
            )
            sp_match = std_phone_pattern.search(norm_text)
            if sp_match:
                prefix = sp_match.group(1) or ""
                raw_num = sp_match.group(2)
                # Ensure it's not an FSSAI 14-digit number
                clean_digits = re.sub(r"\D", "", f"{prefix}{raw_num}")
                if 8 <= len(clean_digits) <= 12 and not any(k in norm_text[max(0, sp_match.start() - 15):sp_match.start()].lower() for k in ["fssai", "lic"]):
                    phone_match_str = f"{prefix}{raw_num}".strip()
            else:
                # Standalone formatted STD phone: e.g. 011-45204100 or (022) 2831-8888 or +91-9876543210
                sa_phone_pattern = re.compile(
                    r"\b((?:\(\s*0?\d{2,4}\s*\)\s*|\+?91[-\s]|0\d{2,4}-))([1-9][0-9\-]{5,8})\b"
                )
                sa_match = sa_phone_pattern.search(norm_text)
                if sa_match:
                    clean_digits = re.sub(r"\D", "", sa_match.group(0))
                    if 8 <= len(clean_digits) <= 12 and not any(k in norm_text[max(0, sa_match.start() - 15):sa_match.start()].lower() for k in ["fssai", "lic"]):
                        phone_match_str = sa_match.group(0).strip()
                elif any(k in norm_text.lower() for k in ("customer care", "care no", "helpline", "toll free", "contact us")):
                    # 10-digit Indian mobile number in consumer care context: e.g. 'Customer Care No: 91 9810154380'
                    in_mob_pattern = re.compile(r"\b(?:\+?91[\s\-]?)?([6-9]\d{4}\s*\d{5})\b")
                    m_mob = in_mob_pattern.search(norm_text)
                    if m_mob:
                        clean_d = re.sub(r"\D", "", m_mob.group(0))
                        if 10 <= len(clean_d) <= 12 and not any(k in norm_text[max(0, m_mob.start() - 15):m_mob.start()].lower() for k in ["fssai", "lic", "pin"]):
                            phone_match_str = m_mob.group(0).strip()

        has_phone = bool(phone_match_str)

        # 3. Postal Address or Reference to Address (English and Hindi)
        has_address = bool(re.search(
            r"\b(address|plot|sector|road|phase|delhi|mumbai|bangalore|bengaluru|haryana|pune|chennai|kolkata|"
            r"office|cell|consumer\s*care\s*cell|at\s*above\s*address|at\s*the\s*address\s*given\s*above|"
            r"manufacturer'?s\s*address|packer'?s\s*address|registered\s*office|पते\s*पर|उपरोक्त\s*पते|निर्माता\s*के\s*पते|पता)\b",
            norm_text,
            re.IGNORECASE
        ))

        address_text: Optional[str] = None
        if has_address:
            if re.search(r"\b(?:at\s*(?:the\s*)?above\s*address|at\s*the\s*address\s*given\s*above|address\s*given\s*above|manufacturer'?s\s*address|packer'?s\s*address|same\s*as\s*manufacturer|उपरोक्त\s*पते|पते\s*पर)\b", norm_text, re.IGNORECASE):
                address_text = "At manufacturer's address given on pack"
            else:
                addr_clause_match = re.search(
                    r"(?:write\s*to\s*(?:us\s*at)?|postal\s*address|address|post\s*box|p\.?o\.?\s*box)\s*[:\-]?\s*([^;\n\r]+?)(?=\s*(?:phone|tel|call|helpline|toll|email|contact|ph|t:)|$)",
                    norm_text,
                    re.IGNORECASE
                )
                if addr_clause_match and len(addr_clause_match.group(1).strip()) >= 3:
                    address_text = addr_clause_match.group(0).strip()
                elif re.search(r"\b(?:consumer\s*care\s*cell|registered\s*office)\b", norm_text, re.IGNORECASE):
                    address_text = "Consumer Care Cell, Registered Office"
                else:
                    address_text = "Consumer Care Address on pack"

        # 4. Contact Person or Department Name (English and Hindi)
        name_match = re.search(
            r"\b(Nodal\s*Officer|Grievance\s*Officer|Customer\s*Care\s*Executive|Consumer\s*Care\s*Executive|"
            r"Customer\s*Care\s*Manager|Consumer\s*Care\s*Manager|Manager\s*-\s*Customer\s*Care|"
            r"Manager\s*-\s*Consumer\s*Relations|Customer\s*Care|Consumer\s*Care|Executive|Manager|Officer|"
            r"Consumer\s*Complaints(?:\s*Cell|\s*Desk)?|Customer\s*Support|Consumer\s*Grievance|Customer\s*Service|"
            r"Consumer\s*Relations|Helpdesk|Grievance\s*Redressal|"
            r"नोडल\s*अधिकारी|ग्राहक\s*सेवा\s*अधिकारी|प्रबंधक)\b",
            norm_text,
            re.IGNORECASE
        )
        has_contact_name = bool(name_match)
        contact_name_str = name_match.group(0).strip() if name_match else None

        is_complete = bool(has_email and has_phone and has_address and has_contact_name)

        return {
            "has_email": has_email,
            "has_phone": has_phone,
            "has_address": has_address,
            "has_contact_name": has_contact_name,
            "is_complete": is_complete,
            "email": email_str,
            "phone": phone_match_str,
            "address": address_text,
            "contact_name": contact_name_str,
        }

    @classmethod
    def parse_country_of_origin(cls, text: str) -> Optional[str]:
        """Extracts Country of Origin under Rule 6(1)(p) and GSR 128(E).

        Preserves dotted acronyms (e.g. 'U.S.A.', 'U.K.', 'P.R.C.') and normalizes:
        - 'Country of Origin: U.S.A.' -> 'USA'
        - 'Country of Origin: P.R.C.' -> 'China'
        - 'Made in India by XYZ Ltd' -> 'India'
        - 'Imported from: Thailand' -> 'Thailand'
        - 'मूल देश: भारत' -> 'India'
        """
        if not text:
            return None

        norm_text = cls.convert_indic_digits(text)

        # Check domestic statutory sale/origin markers
        if re.search(r"\b(?:For\s*sale\s*in\s*India|Toll-free\s*in\s*India|Made\s*in\s*India|Product\s*of\s*India|Produced\s*in\s*India|Manufactured\s*in\s*India)\b", norm_text, re.IGNORECASE):
            return "India"

        origin_pattern = re.compile(
            r"(?<![a-zA-Z\u0900-\u097F])(?:Country\s*of\s*Origin|Made\s*in|Product\s*of|Manufactured\s*in|Packed\s*in|Produce\s*of|Imported\s*from|Origin\s*[:\-]|MFG\s*[:\-]|MFD\s*[:\-]|C\.?O\.?O\.?\s*[:\-]|COUNTR[Y]?(?:\s*OF\s*ORIGIN)?\s*[:\-]?|मूल\s*देश|उत्पत्ति\s*का\s*देश)\s*[:\-]?\s*([^\n\r,;]+)",
            re.IGNORECASE
        )

        first_cleaned: Optional[str] = None

        for match in origin_pattern.finditer(norm_text):
            raw = match.group(1).strip()

            # Check canonical country mappings
            if "भारत" in raw:
                return "भारत"
            if re.search(r"\b(?:India|Bharat)\b", raw, re.IGNORECASE):
                return "India"
            if re.search(r"\b(?:U\.?S\.?A\.?|United\s*States(?:\s*of\s*America)?)\b", raw, re.IGNORECASE):
                return "USA"
            if re.search(r"\b(?:U\.?K\.?|United\s*Kingdom|Great\s*Britain)\b", raw, re.IGNORECASE):
                return "United Kingdom"
            if re.search(r"\b(?:P\.?R\.?C\.?|China|People'?s\s*Republic\s*of\s*China)\b", raw, re.IGNORECASE):
                return "China"
            if re.search(r"\b(?:U\.?A\.?E\.?|United\s*Arab\s*Emirates)\b", raw, re.IGNORECASE):
                return "UAE"

            # Check recognized country names
            for country in RECOGNIZED_COUNTRIES:
                if re.search(r"\b" + re.escape(country) + r"\b", raw, re.IGNORECASE):
                    return country

            if first_cleaned is None:
                # Fallback: Strip stop words like 'by ...', 'for ...'
                cleaned = re.split(r"\b(?:by|for|under|at)\b", raw, flags=re.IGNORECASE)[0].strip()
                cleaned = cleaned.strip(".- :")
                # Validate that fallback candidate is a reasonable country name (not a sentence, no digits)
                if cleaned and len(cleaned.split()) <= 3 and not re.search(r"\d", cleaned):
                    disallowed_words = {
                        "accordance", "compliance", "standard", "facility", "premises",
                        "licence", "license", "place", "dry", "cool", "store", "hygienic", "temperature"
                    }
                    if not any(w in cleaned.lower() for w in disallowed_words):
                        first_cleaned = cleaned

        return first_cleaned

    @classmethod
    def parse_generic_name(cls, text: str) -> Optional[str]:
        """Extracts commodity generic/common name under Rule 6(1)(b).

        Matches declarations like:
        - 'Generic Name: Biscuits'
        - 'Common Name: Potato Chips'
        - 'Name of Commodity: Wheat Flour'
        - 'Commodity: Bath Soap'
        """
        if not text:
            return None

        norm_text = cls.convert_indic_digits(text)
        generic_pattern = re.compile(
            r"(?:Generic\s*Name|Common\s*Name|Name\s*of\s*Commodity|Commodity|Product\s*Name|वस्तु\s*का\s*नाम|सामान्य\s*नाम|उत्पाद\s*का\s*नाम|सामग्री\s*का\s*नाम|वस्तु|उत्पाद)\s*[:\-]?\s*([^\n\r,;]+)",
            re.IGNORECASE
        )
        match = generic_pattern.search(norm_text)
        if not match:
            return None

        cleaned = match.group(1).strip().strip(".- :")
        return cleaned if cleaned and len(cleaned) >= 2 else None
