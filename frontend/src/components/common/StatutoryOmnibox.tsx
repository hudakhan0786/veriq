import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, Scale, FileText, AlertCircle, ArrowRight, X, CheckCircle2, ShieldCheck, ChevronDown, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

interface RuleSnippet {
  id: string;
  category: string;
  title: { en: string; hi: string };
  act: { en: string; hi: string };
  gazette: { en: string; hi: string };
  summary: { en: string; hi: string };
  thresholds: { en: string[]; hi: string[] };
}

const STATUTORY_RULES: Record<string, RuleSnippet> = {
  table1: {
    id: "table1",
    category: "table1",
    title: {
      en: "Table-I Minimum Numeral Font Height Schedule",
      hi: "तालिका-I न्यूनतम अंक फॉन्ट ऊंचाई अनुसूची",
    },
    act: {
      en: "Legal Metrology (Packaged Commodities) Rules, 2011, Schedule I",
      hi: "विधिक मापविज्ञान (पैकेज वस्तुएं) नियम, 2011, अनुसूची I",
    },
    gazette: {
      en: "GSR 202(E) / ADL-01 Statutory Schedule",
      hi: "GSR 202(E) / ADL-01 विधिक अनुसूची",
    },
    summary: {
      en: "Statutory schedule regulating the minimum height of numerals for net quantity declarations based on Principal Display Panel (PDP) area.",
      hi: "मुख्य प्रदर्शन पैनल (PDP) के क्षेत्रफल के आधार पर शुद्ध मात्रा घोषणा के अंकों की न्यूनतम ऊंचाई नियंत्रित करने वाली विधिक अनुसूची।",
    },
    thresholds: {
      en: [
        "Area ≤ 50 cm²: Minimum height = 1.0 mm (Blown/moulded: 2.0 mm)",
        "50 < Area ≤ 100 cm²: Minimum height = 1.5 mm (Blown/moulded: 3.0 mm)",
        "100 < Area ≤ 500 cm²: Minimum height = 2.5 mm (Blown/moulded: 4.0 mm)",
        "500 < Area ≤ 2500 cm²: Minimum height = 4.0 mm (Blown/moulded: 6.0 mm)",
        "Area > 2500 cm² (Row 5): STRICTLY 6.0 mm (Blown/moulded: 8.0 mm), Note: 8.0mm is only for blown/embossed containers (ADL-01).",
      ],
      hi: [
        "क्षेत्रफल ≤ 50 सेमी²: न्यूनतम ऊंचाई = 1.0 मिमी (ब्लोन/मोल्डेड: 2.0 मिमी)",
        "50 < क्षेत्रफल ≤ 100 सेमी²: न्यूनतम ऊंचाई = 1.5 मिमी (ब्लोन/मोल्डेड: 3.0 मिमी)",
        "100 < क्षेत्रफल ≤ 500 सेमी²: न्यूनतम ऊंचाई = 2.5 मिमी (ब्लोन/मोल्डेड: 4.0 मिमी)",
        "500 < क्षेत्रफल ≤ 2500 सेमी²: न्यूनतम ऊंचाई = 4.0 मिमी (ब्लोन/मोल्डेड: 6.0 मिमी)",
        "क्षेत्रफल > 2500 सेमी² (Row 5): सख्त रूप से 6.0 मिमी (ब्लोन/मोल्डेड: 8.0 मिमी), ध्यान दें: 8.0 मिमी केवल उभरे हुए कांच के कंटेनरों के लिए मान्य है (ADL-01)।",
      ],
    },
  },
  banned_units: {
    id: "banned_units",
    category: "banned_units",
    title: {
      en: "Prohibited & Non-Standard Metric Units Flagger",
      hi: "प्रतिबंधित एवं गैर-मानक मीट्रिक इकाइयां डिटेक्टर",
    },
    act: {
      en: "Legal Metrology (Packaged Commodities) Rules, 2011, Rule 5 & Schedule II",
      hi: "विधिक मापविज्ञान (पैकेज वस्तुएं) नियम, 2011, नियम 5 एवं अनुसूची II",
    },
    gazette: {
      en: "Act No. 1 of 2010 Section 11 & Section 29 Penalties",
      hi: "अधिनियम संख्या 1 वर्ष 2010 धारा 11 एवं धारा 29 दंड",
    },
    summary: {
      en: "Strict prohibition against non-standard symbols, colloquial plurals, or non-SI casing. Units must be singular and standardized.",
      hi: "गैर-मानक प्रतीकों, बोलचाल के बहुवचनों या गैर-एसआई केसिंग पर सख्त प्रतिबंध। इकाइयां एकवचन और मानकीकृत होनी चाहिए।",
    },
    thresholds: {
      en: [
        "Prohibited: 'gms', 'gm', 'g.' → Must strictly be 'g' (gram)",
        "Prohibited: 'ML', 'Ml' → Must strictly be 'ml' or 'mL' (millilitre)",
        "Prohibited: 'ltrs', 'ltr', 'lt' → Must strictly be 'l' or 'L' (litre)",
        "Prohibited: 'kgs', 'KG' → Must strictly be 'kg' (kilogram)",
        "Evidentiary Defense: System masks 'AI/ML' tech terms and 'GM Foods' corporate suffixes to guarantee 0.0% false positives.",
      ],
      hi: [
        "प्रतिबंधित: 'gms', 'gm', 'g.' → सख्त रूप से 'g' (ग्राम) होना चाहिए",
        "प्रतिबंधित: 'ML', 'Ml' → सख्त रूप से 'ml' या 'mL' (मिलीलीटर) होना चाहिए",
        "प्रतिबंधित: 'ltrs', 'ltr', 'lt' → सख्त रूप से 'l' या 'L' (लीटर) होना चाहिए",
        "प्रतिबंधित: 'kgs', 'KG' → सख्त रूप से 'kg' (किलोग्राम) होना चाहिए",
        "साक्ष्य सुरक्षा: 0.0% मिथ्या आरोप दर सुनिश्चित करने हेतु प्रणाली 'AI/ML' और 'GM Foods' जैसे शब्दों को संरक्षित रखती है।",
      ],
    },
  },
  usp: {
    id: "usp",
    category: "usp",
    title: {
      en: "Unit Sale Price (USP) Mathematical Verification",
      hi: "इकाई विक्रय मूल्य (यूएसपी) गणितीय सत्यापन",
    },
    act: {
      en: "Legal Metrology (Packaged Commodities) Rules, 2011, Rule 6(1)(r)",
      hi: "विधिक मापविज्ञान (पैकेज वस्तुएं) नियम, 2011, नियम 6(1)(r)",
    },
    gazette: {
      en: "GSR 779(E) Effective 01 January 2022",
      hi: "GSR 779(E) प्रभावी तिथि 01 जनवरी 2022",
    },
    summary: {
      en: "Mandatory declaration of price per unit (per g, per ml, per kg, per litre, or per number) to prevent deceptive packaging and shrinkflation.",
      hi: "भ्रामक पैकेजिंग और श्रिंकफ्लेशन रोकने हेतु प्रति इकाई मूल्य (प्रति ग्राम, प्रति मिली, प्रति किग्रा, प्रति लीटर या प्रति नग) की अनिवार्य घोषणा।",
    },
    thresholds: {
      en: [
        "Validation formula: |(USP × Net Quantity in base units) - MRP| ≤ ₹0.02 INR.",
        "Base Units: Quantity < 1 kg declared per g or per 100g; Quantity > 1 kg declared per kg.",
        "Volume < 1 L declared per ml or per 100ml; Volume > 1 L declared per L.",
        "Decoupled Tax Verification: Tax inclusivity ('incl. of all taxes') checked across split lines.",
      ],
      hi: [
        "सत्यापन सूत्र: |(USP × आधार इकाइयों में शुद्ध मात्रा) - MRP| ≤ ₹0.02 रुपये।",
        "आधार इकाइयां: मात्रा < 1 किग्रा प्रति ग्राम या 100 ग्राम; मात्रा > 1 किग्रा प्रति किग्रा।",
        "आयतन < 1 लीटर प्रति मिली या 100 मिली; आयतन > 1 लीटर प्रति लीटर।",
        "कर समावेशन सत्यापन: 'सभी करों सहित' का अलग-अलग पंक्तियों पर स्वतंत्र सत्यापन।",
      ],
    },
  },
  ecommerce: {
    id: "ecommerce",
    category: "ecommerce",
    title: {
      en: "E-Commerce Single Listing Adjudication",
      hi: "ई-कॉमर्स एकल लिस्टिंग न्यायनिर्णयन",
    },
    act: {
      en: "Legal Metrology (Packaged Commodities) Rules, 2011, Rule 6(10)",
      hi: "विधिक मापविज्ञान (पैकेज वस्तुएं) नियम, 2011, नियम 6(10)",
    },
    gazette: {
      en: "GSR 594(E) E-Commerce Marketplaces Oversight",
      hi: "GSR 594(E) ई-कॉमर्स मार्केटप्लेस विनियामक निगरानी",
    },
    summary: {
      en: "Statutory requirements for digital marketplace product detail pages (PDP). Marketplaces must declare manufacturer, net quantity, MRP, consumer care, and country of origin.",
      hi: "डिजिटल मार्केटप्लेस उत्पाद विवरण पृष्ठों हेतु विधिक आवश्यकताएं। निर्माता, शुद्ध मात्रा, एमआरपी, उपभोक्ता सेवा और मूल देश की अनिवार्य घोषणा।",
    },
    thresholds: {
      en: [
        "Mandatory Declarations: Manufacturer/Packer/Importer, Net Qty, MRP, Consumer Care details, Country of Origin.",
        "Statutory Exemption: Under Rule 6(10) / GSR 594(E), digital listings are statutorily EXEMPT from declaring manufacturing date (mfg date).",
        "Vernacular Boundary: State names ending in 'प्रदेश' (e.g. Uttar Pradesh) are protected from leaking into Country of Origin.",
      ],
      hi: [
        "अनिवार्य घोषणाएं: निर्माता/पैकर/आयातक, शुद्ध मात्रा, एमआरपी, उपभोक्ता सेवा विवरण, मूल देश।",
        "विधिक छूट: नियम 6(10) / GSR 594(E) के तहत, डिजिटल लिस्टिंग को निर्माण तिथि घोषित करने से विधिक छूट प्राप्त है।",
        "भाषा सीमा: 'प्रदेश' (जैसे उत्तर प्रदेश, मध्य प्रदेश) से समाप्त होने वाले राज्यों के नामों को मूल देश में लीक होने से सुरक्षित रखा जाता है।",
      ],
    },
  },
  sec63: {
    id: "sec63",
    category: "sec63",
    title: {
      en: "Section 63 BSA 2023 Digital Electronic Evidence",
      hi: "धारा 63 भारतीय साक्ष्य अधिनियम 2023 डिजिटल साक्ष्य",
    },
    act: {
      en: "Bharatiya Sakshya Adhiniyam, 2023, Section 63 (Repeals Sec 65B of IEA, 1872)",
      hi: "भारतीय साक्ष्य अधिनियम, 2023, धारा 63 (पूर्ववर्ती धारा 65B को प्रतिस्थापित)",
    },
    gazette: {
      en: "Act No. 47 of 2023 Effective 01 July 2024",
      hi: "अधिनियम संख्या 47 वर्ष 2023 प्रभावी 01 जुलाई 2024",
    },
    summary: {
      en: "Admissibility of electronic records and algorithmic diagnostic findings in legal metrology judicial proceedings and compounding hearings.",
      hi: "विधिक मापविज्ञान न्यायिक कार्यवाहियों और शमन अपीलों में इलेक्ट्रॉनिक अभिलेखों एवं एल्गोरिथम निष्कर्षों की विधिक स्वीकार्यता।",
    },
    thresholds: {
      en: [
        "Cryptographic Hash: Every camera capture and OCR token payload signed with SHA-256.",
        "Merkle Chain of Custody: Append-only hash chain linking device telemetry, calibration scale, and findings.",
        "Human-in-the-Loop Certificate: The electronic certificate explicitly records the inspecting officer's badge and digital adjudication signature.",
      ],
      hi: [
        "क्रिप्टोग्राफिक हैश: प्रत्येक कैमरा कैप्चर और ओसीआर टोकन पेलोड SHA-256 द्वारा हस्ताक्षरित।",
        "मर्कल चेन ऑफ कस्टडी: डिवाइस टेलीमेट्री, कैलिब्रेशन स्केल और निष्कर्षों को जोड़ने वाली अपरिवर्तनीय हैश श्रृंखला।",
        "मानव-निर्देशित प्रमाण पत्र: डिजिटल प्रमाण पत्र में निरीक्षण अधिकारी का बैज और डिजिटल हस्ताक्षर अनिवार्य रूप से दर्ज होते हैं।",
      ],
    },
  },
};

interface StatutoryOmniboxProps {
  className?: string;
  variant?: "hero" | "dashboard" | "compact";
}

/**
 * StatutoryOmnibox, Signature Search Engine directly inspired by india.gov.in
 * Features:
 * 1. Unified search container with search icon and placeholder
 * 2. Integrated Category Selector dropdown (All Categories, Table-I, Banned Units, USP, E-Comm, BSA)
 * 3. High-contrast Red Search Action CTA button (india.gov.in signature #D32F2F button)
 * 4. Trending Searches row with quick pill triggers
 * 5. Interactive Rule Dossier modal popup with full legal citations
 */
export const StatutoryOmnibox: React.FC<StatutoryOmniboxProps> = ({
  className = "",
  variant = "hero",
}) => {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRule, setSelectedRule] = useState<RuleSnippet | null>(null);
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const isHero = variant === "hero";
  const pillClasses = isHero
    ? "inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] sm:text-[10.5px] font-medium transition-all bg-[#0A1D33]/90 hover:bg-[#102C4E] text-slate-100 hover:text-white border border-white/25 hover:border-white/45 shadow-xs cursor-pointer backdrop-blur-md active:scale-[0.98] whitespace-nowrap"
    : "inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] sm:text-[10.5px] font-medium transition-all bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 shadow-2xs cursor-pointer active:scale-[0.98] whitespace-nowrap";

  // Lock background scroll and listen for Escape key when statutory modal is open
  useEffect(() => {
    if (!selectedRule) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedRule(null);
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedRule]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();

    // If category is selected, prioritize it
    if (selectedCategory !== "all" && STATUTORY_RULES[selectedCategory]) {
      setSelectedRule(STATUTORY_RULES[selectedCategory]);
      return;
    }

    if (!q) {
      setSelectedRule(STATUTORY_RULES.table1);
      return;
    }

    if (
      q.includes("table") ||
      q.includes("font") ||
      q.includes("height") ||
      q.includes("6.0") ||
      q.includes("तालिका") ||
      q.includes("फॉन्ट")
    ) {
      setSelectedRule(STATUTORY_RULES.table1);
    } else if (
      q.includes("banned") ||
      q.includes("gms") ||
      q.includes("ml") ||
      q.includes("unit") ||
      q.includes("प्रतिबंधित") ||
      q.includes("इकाई")
    ) {
      setSelectedRule(STATUTORY_RULES.banned_units);
    } else if (
      q.includes("usp") ||
      q.includes("unit sale") ||
      q.includes("price") ||
      q.includes("0.02") ||
      q.includes("यूएसपी") ||
      q.includes("मूल्य")
    ) {
      setSelectedRule(STATUTORY_RULES.usp);
    } else if (
      q.includes("e-comm") ||
      q.includes("online") ||
      q.includes("6(10)") ||
      q.includes("amazon") ||
      q.includes("blinkit") ||
      q.includes("कॉमर्स")
    ) {
      setSelectedRule(STATUTORY_RULES.ecommerce);
    } else if (
      q.includes("sec 63") ||
      q.includes("bsa") ||
      q.includes("evidence") ||
      q.includes("certificate") ||
      q.includes("merkle") ||
      q.includes("साक्ष्य") ||
      q.includes("धारा")
    ) {
      setSelectedRule(STATUTORY_RULES.sec63);
    } else if (
      q.startsWith("insp-") ||
      q.includes("demo") ||
      q.includes("fortune") ||
      q.includes("tata")
    ) {
      navigate(`/inspections/${q.startsWith("insp-") ? q : "demo-fortune-sunlite"}`);
    } else {
      setSelectedRule(STATUTORY_RULES.table1);
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto min-w-0 ${className}`}>
      {/* Search Input Bar (india.gov.in / Ministry of Consumer Affairs Administrative Search Pattern) */}
      <form onSubmit={handleSearch} className="relative group">
        <div className="relative flex flex-col sm:flex-row items-stretch rounded-xl bg-white shadow-md border border-slate-300 hover:border-slate-400 focus-within:border-[#1B365D] focus-within:ring-2 focus-within:ring-[#1B365D]/20 overflow-hidden transition-all">
          {/* Search Icon & Input */}
          <div className="flex items-center flex-1 pl-3.5 sm:pl-5 pr-3 py-2 sm:py-0 min-w-0">
            <Search size={17} className="text-[#1B365D] shrink-0 mr-2 sm:mr-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t(
                "omnibox.placeholder",
                "Search statutory rules, Table-I font schedule, banned units, GSR notifications..."
              )}
              className="w-full py-1.5 sm:py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-500 bg-transparent focus:outline-none font-medium min-w-0"
              aria-label="Statutory Inspection & Rule Search Omnibox"
            />
          </div>

          {/* Category Dropdown & Search CTA (Grouped on mobile for clean fit) */}
          <div className="flex items-center justify-between border-t sm:border-t-0 sm:border-l border-slate-200 bg-slate-50/90">
            {/* Category Dropdown (india.gov.in Pattern) */}
            <div className="flex items-center px-2.5 sm:px-3 py-1.5 sm:py-0 flex-1 sm:flex-none min-w-0">
              <label htmlFor="statutory-category-select" className="sr-only">
                {language === "hi" ? "श्रेणी चुनें" : "Select Category"}
              </label>
              <select
                id="statutory-category-select"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  if (e.target.value !== "all" && STATUTORY_RULES[e.target.value]) {
                    setSelectedRule(STATUTORY_RULES[e.target.value]);
                  }
                }}
                className="w-full sm:w-auto bg-transparent text-[11px] sm:text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer py-1 pr-5 appearance-none relative truncate"
              >
                <option value="all" className="bg-white text-slate-800">{language === "hi" ? "सभी श्रेणियां" : "All Categories"}</option>
                <option value="table1" className="bg-white text-slate-800">{language === "hi" ? "तालिका-I फ़ॉन्ट" : "Table-I Font Schedule"}</option>
                <option value="banned_units" className="bg-white text-slate-800">{language === "hi" ? "प्रतिबंधित इकाइयां" : "Prohibited Units"}</option>
                <option value="usp" className="bg-white text-slate-800">{language === "hi" ? "USP गणित" : "USP Math Verification"}</option>
                <option value="ecommerce" className="bg-white text-slate-800">{language === "hi" ? "ई-कॉमर्स नियम 6(10)" : "Rule 6(10) E-Commerce"}</option>
                <option value="sec63" className="bg-white text-slate-800">{language === "hi" ? "धारा 63 साक्ष्य" : "Sec 63 BSA Evidence"}</option>
              </select>
              <ChevronDown size={13} className="text-slate-500 -ml-3.5 pointer-events-none shrink-0" />
            </div>

            {/* Sovereign Navy Search CTA Button */}
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 bg-[#1B365D] hover:bg-[#0A2540] text-white px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold tracking-wide transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              <span>{language === "hi" ? "खोजें" : "Search"}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </form>

      {/* Statutory Provisions / Quick References Row (Multi-Line Wrapping Pills - Center Aligned) */}
      <div className="w-full max-w-full min-w-0 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-2.5 sm:mt-3 px-0.5">
        <span
          className={`inline-flex items-center gap-1 font-bold tracking-wider uppercase text-[9.5px] sm:text-[10px] mr-0.5 shrink-0 ${
            isHero ? "text-slate-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]" : "text-slate-600"
          }`}
        >
          <Scale size={11} className={isHero ? "text-amber-300" : "text-[#1B365D]"} />
          <span>{language === "hi" ? "त्वरित विधिक संदर्भ :" : "STATUTORY REFERENCES :"}</span>
        </span>

        <button
          type="button"
          onClick={() => setSelectedRule(STATUTORY_RULES.table1)}
          className={pillClasses}
        >
          {t("omnibox.pill_table1", "Table-I Font Schedule (Row 5 = 6.0 mm)")}
        </button>

        <button
          type="button"
          onClick={() => setSelectedRule(STATUTORY_RULES.banned_units)}
          className={pillClasses}
        >
          {t("omnibox.pill_banned", "Prohibited Units (gms, ML, gm, ltrs)")}
        </button>

        <button
          type="button"
          onClick={() => setSelectedRule(STATUTORY_RULES.usp)}
          className={pillClasses}
        >
          {t("omnibox.pill_usp", "USP Math (|USP×Qty - MRP| ≤ ₹0.02)")}
        </button>

        <button
          type="button"
          onClick={() => setSelectedRule(STATUTORY_RULES.ecommerce)}
          className={pillClasses}
        >
          {t("omnibox.pill_ecom", "Rule 6(10) E-Commerce")}
        </button>

        <button
          type="button"
          onClick={() => setSelectedRule(STATUTORY_RULES.sec63)}
          className={pillClasses}
        >
          {t("omnibox.pill_sec63", "Section 63 BSA 2023 Merkle Proof")}
        </button>
      </div>

      {/* Interactive Statutory Rule Dossier Modal (Rendered via Portal directly to body) */}
      {selectedRule && typeof document !== "undefined" && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="rule-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedRule(null);
          }}
          className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in"
        >
          <div
            className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full flex flex-col max-h-[90dvh] sm:max-h-[85vh] relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sovereign Tricolor Accent Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] z-10" />

            {/* Header (Sticky at top of modal) */}
            <div className="flex items-start justify-between border-b border-slate-200 p-3.5 sm:p-5 pt-3.5 shrink-0 bg-white">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="p-2 sm:p-2.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                  <Scale size={20} className="sm:w-[22px] sm:h-[22px]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span className="text-[9.5px] sm:text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-900 truncate">
                      {selectedRule.gazette[language === "hi" ? "hi" : "en"]}
                    </span>
                    <span className="text-[9.5px] sm:text-[10px] text-slate-500 font-semibold truncate">
                      {selectedRule.act[language === "hi" ? "hi" : "en"]}
                    </span>
                  </div>
                  <h3 id="rule-modal-title" className="text-sm sm:text-base font-bold text-[#1B365D] mt-1 leading-snug">
                    {selectedRule.title[language === "hi" ? "hi" : "en"]}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRule(null)}
                className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0 ml-2"
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
              {/* Statutory Summary */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                <p>{selectedRule.summary[language === "hi" ? "hi" : "en"]}</p>
              </div>

              {/* Statutory Thresholds & Legal Defenses */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-amber-700" />
                  <span>
                    {language === "hi"
                      ? "अनिवार्य विधिक सीमाएं एवं न्यायालय साक्ष्य बचाव"
                      : "Mandatory Statutory Schedules & Evidentiary Defenses"}
                  </span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-800">
                  {selectedRule.thresholds[language === "hi" ? "hi" : "en"].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Bar (Sticky at bottom of modal, mobile-optimized) */}
            <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedRule(null)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border border-slate-200 transition-colors cursor-pointer text-center"
              >
                {t("omnibox.close", "Close Schedule")}
              </button>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRule(null);
                    navigate("/rules");
                  }}
                  className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-200/60 border border-slate-300 transition-colors cursor-pointer text-center"
                >
                  {t("omnibox.view_full", "View Full Rules & Schedules Dossier")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRule(null);
                    navigate("/inspections/demo-fortune-sunlite");
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-bold bg-[#1B365D] hover:bg-[#0A2540] text-white shadow-xs transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{language === "hi" ? "कैनवास में परीक्षण करें" : "Test in Canvas"}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
