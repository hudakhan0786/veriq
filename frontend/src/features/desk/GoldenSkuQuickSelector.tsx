import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { resetScrollToTop } from "../../components/common/ScrollToTop";

export interface GoldenSkuItem {
  skuId: string;
  caseId: string;
  name: string;
  nameHi?: string;
  verdict: "FAIL" | "PASS" | "REVIEW" | "UNABLE";
  verdictLabel: string;
  verdictLabelHi?: string;
  description: string;
  descriptionHi?: string;
  ruleCitation: string;
  ruleCitationHi?: string;
}

export const GOLDEN_SKU_ITEMS: GoldenSkuItem[] = [
  {
    skuId: "SKU-DEMO-01",
    caseId: "SKU-DEMO-01",
    name: "Butter Cookies 200g",
    nameHi: "बटर कुकीज़ 200g",
    verdict: "FAIL",
    verdictLabel: "FAIL",
    verdictLabelHi: "अनुत्तीर्ण",
    description: "Font deficit (1.84 vs 2.50 mm) + Banned 'gms' unit",
    descriptionHi: "फॉन्ट कमी (1.84 बनाम 2.50 मिमी) + प्रतिबंधित 'gms' इकाई",
    ruleCitation: "Rule 6(1)(h) Table-I / Section 11",
    ruleCitationHi: "नियम 6(1)(h) तालिका-I / धारा 11",
  },
  {
    skuId: "SKU-DEMO-02",
    caseId: "SKU-DEMO-02",
    name: "Ready Curry Pouch 300g",
    nameHi: "रेडी करी पाउच 300g",
    verdict: "FAIL",
    verdictLabel: "FAIL",
    verdictLabelHi: "अनुत्तीर्ण",
    description: "USP Mismatch (Declared ₹0.28 vs Calc ₹0.23/g)",
    descriptionHi: "यूएसपी विसंगति (घोषित ₹0.28 बनाम परिकलित ₹0.23/g)",
    ruleCitation: "Rule 6(1)(e) USP Math",
    ruleCitationHi: "नियम 6(1)(e) यूएसपी गणित",
  },
  {
    skuId: "SKU-DEMO-03",
    caseId: "SKU-DEMO-03",
    name: "Packaged Water 1000ml",
    nameHi: "पैकेजबंद जल 1000ml",
    verdict: "PASS",
    verdictLabel: "PASS",
    verdictLabelHi: "उत्तीर्ण",
    description: "100% Statutory Compliant (Font & USP Pass)",
    descriptionHi: "100% सांविधिक अनुपालन (फॉन्ट एवं यूएसपी उत्तीर्ण)",
    ruleCitation: "LMPC Rules, 2011 Standard",
    ruleCitationHi: "एलएमपीसी नियम, 2011 मानक",
  },
  {
    skuId: "SKU-DEMO-04",
    caseId: "SKU-DEMO-04",
    name: "Herbal Soap 125g",
    nameHi: "हर्बल साबुन 125g",
    verdict: "REVIEW",
    verdictLabel: "REVIEW",
    verdictLabelHi: "समीक्षा",
    description: "Borderline measurement within sensor k=2 band (2.46 mm)",
    descriptionHi: "सेंसर k=2 बैंड (2.46 मिमी) के भीतर सीमांत माप",
    ruleCitation: "Physical Caliper Retest Advised",
    ruleCitationHi: "भौतिक कैलिपर पुनः परीक्षण अनुशंसित",
  },
  {
    skuId: "SKU-DEMO-05",
    caseId: "SKU-DEMO-05",
    name: "Potato Chips 75g",
    nameHi: "आलू चिप्स 75g",
    verdict: "UNABLE",
    verdictLabel: "UNABLE",
    verdictLabelHi: "असमर्थ",
    description: "Specular Glare Bloom (6.4% > 3.0%) statutory retake",
    descriptionHi: "चकाचौंध फैलाव (6.4% > 3.0%) सांविधिक पुनः कैप्चर",
    ruleCitation: "Section 63 BSA 2023 Optical Gate",
    ruleCitationHi: "धारा 63 बीएसए 2023 प्रकाशीय द्वार",
  },
  {
    skuId: "SKU-DEMO-06",
    caseId: "SKU-DEMO-06",
    name: "E-Commerce Tea 500g",
    nameHi: "ई-कॉमर्स चाय 500g",
    verdict: "FAIL",
    verdictLabel: "FAIL",
    verdictLabelHi: "अनुत्तीर्ण",
    description: "Rule 6(10) Violation: Missing Country of Origin",
    descriptionHi: "नियम 6(10) उल्लंघन: मूल देश अनुपस्थित",
    ruleCitation: "E-Commerce GSR 594(E)",
    ruleCitationHi: "ई-कॉमर्स जीएसआर 594(ई)",
  },
  {
    skuId: "INS-2026-0001",
    caseId: "INS-2026-0001",
    name: "Aashirvaad Atta 500g",
    nameHi: "आशीर्वाद आटा 500g",
    verdict: "PASS",
    verdictLabel: "PASS",
    verdictLabelHi: "उत्तीर्ण",
    description: "Full compliance (Font 4.2mm, MRP ₹32.00, SI units verified)",
    descriptionHi: "पूर्ण अनुपालन (फॉन्ट 4.2mm, एमआरपी ₹32.00, एसआई इकाइयां सत्यापित)",
    ruleCitation: "Field Package Benchmark",
    ruleCitationHi: "फील्ड पैकेज बेंचमार्क",
  },
  {
    skuId: "INS-2026-0002",
    caseId: "INS-2026-0002",
    name: "FizzUp Lemon 1L",
    nameHi: "फिज़अप लेमन 1L",
    verdict: "REVIEW",
    verdictLabel: "CONFLICT",
    verdictLabelHi: "परस्पर विरोधी",
    description: "Dual conflicting price markings (₹48.00 vs ₹45.00)",
    descriptionHi: "दोहरी परस्पर विरोधी मूल्य अंकन (₹48.00 बनाम ₹45.00)",
    ruleCitation: "Rule 18(1) Dual Pricing Check",
    ruleCitationHi: "नियम 18(1) दोहरी मूल्य निर्धारण जांच",
  },
  {
    skuId: "INS-2026-0003",
    caseId: "INS-2026-0003",
    name: "CleanHome Cleaner 250g",
    nameHi: "क्लीनहोम क्लीनर 250g",
    verdict: "UNABLE",
    verdictLabel: "UNABLE",
    verdictLabelHi: "असमर्थ",
    description: "Missing calibration fiducial on packaging plane",
    descriptionHi: "पैकेजिंग तल पर अंशांकन संदर्भ मानक चिन्ह अनुपस्थित",
    ruleCitation: "Section 63 BSA Calibration Gap",
    ruleCitationHi: "धारा 63 बीएसए अंशांकन अंतराल",
  },
  {
    skuId: "demo-fortune-sunlite",
    caseId: "demo-fortune-sunlite",
    name: "Fortune Sunlite Oil 1L",
    nameHi: "फॉर्च्यून सनलाइट तेल 1L",
    verdict: "PASS",
    verdictLabel: "PASS",
    verdictLabelHi: "उत्तीर्ण",
    description: "ArUco calibrated, USP consistency, and full Section 63 proof",
    descriptionHi: "ArUco अंशांकित, यूएसपी निरंतरता, एवं पूर्ण धारा 63 प्रमाण",
    ruleCitation: "Standard Live Demo Case",
    ruleCitationHi: "मानक लाइव डेमो मामला",
  },
  {
    skuId: "REAL-PKG-WATCH",
    caseId: "REAL-PKG-WATCH",
    name: "Fastrack Watch",
    nameHi: "फास्टट्रैक घड़ी",
    verdict: "PASS",
    verdictLabel: "PASS",
    verdictLabelHi: "उत्तीर्ण",
    description: "180° Inversion auto-corrected, Rule 6(1)(da) single unit USP exempt",
    descriptionHi: "180° उल्टा स्वतः सीधा, नियम 6(1)(da) एकल इकाई यूएसपी छूट",
    ruleCitation: "Rule 6(1)(da) Second Proviso",
    ruleCitationHi: "नियम 6(1)(da) द्वितीय परंतुक",
  },
  {
    skuId: "REAL-PKG-BRAHMI",
    caseId: "REAL-PKG-BRAHMI",
    name: "Himalaya Brahmi 60T",
    nameHi: "हिमालया ब्राह्मी 60T",
    verdict: "PASS",
    verdictLabel: "PASS",
    verdictLabelHi: "उत्तीर्ण",
    description: "Tri-panel fusion, Table-I font pass, USP ₹4.33/TAB verified",
    descriptionHi: "त्रि-पैनल संलयन, तालिका-I फॉन्ट उत्तीर्ण, यूएसपी ₹4.33/TAB सत्यापित",
    ruleCitation: "Rule 6(1)(da) Solid Form / Table-I",
    ruleCitationHi: "नियम 6(1)(da) ठोस रूप / तालिका-I",
  },
  {
    skuId: "REAL-PKG-FACEWASH",
    caseId: "REAL-PKG-FACEWASH",
    name: "Dot & Key Face Wash 100ml",
    nameHi: "डॉट एंड की फेस वॉश 100ml",
    verdict: "PASS",
    verdictLabel: "PASS",
    verdictLabelHi: "उत्तीर्ण",
    description: "Dual entity separation (HP mfg / WB mkt), USP ₹2.49/ml match",
    descriptionHi: "दोहरा पता पृथक्करण, यूएसपी ₹2.49/मिली एकदम सही",
    ruleCitation: "Rule 6(1)(a)/(b) Dual Address",
    ruleCitationHi: "नियम 6(1)(a)/(b) दोहरा पता",
  },
  {
    skuId: "REAL-PKG-PERFUME",
    caseId: "REAL-PKG-PERFUME",
    name: "Bella Vita Perfume 20ml",
    nameHi: "बेला वीटा परफ्यूम 20ml",
    verdict: "PASS",
    verdictLabel: "PASS",
    verdictLabelHi: "उत्तीर्ण",
    description: "Rate inversion normalized (₹19.95/ml), base panel font pass",
    descriptionHi: "दर व्युत्क्रम सामान्यीकृत (₹19.95/मिली), आधार पैनल फॉन्ट उत्तीर्ण",
    ruleCitation: "Rule 6(1)(da) Liquid Normalizer",
    ruleCitationHi: "नियम 6(1)(da) तरल सामान्यीकरण",
  },
  {
    skuId: "REAL-PKG-NAMKEEN",
    caseId: "REAL-PKG-NAMKEEN",
    name: "Haldiram's Namkeen 400g",
    nameHi: "हल्दीराम नमकीन 400g",
    verdict: "PASS",
    verdictLabel: "PASS",
    verdictLabelHi: "उत्तीर्ण",
    description: "SI standard 'g' unit verified (zero 'gms'), USP ₹0.25/g match",
    descriptionHi: "मानक 'g' मात्रक सत्यापित (शून्य 'gms'), यूएसपी ₹0.25/g मिलान",
    ruleCitation: "Section 11 / Rule 12 SI Units",
    ruleCitationHi: "धारा 11 / नियम 12 एसआई मात्रक",
  },
  {
    skuId: "REAL-PKG-CHIA",
    caseId: "REAL-PKG-CHIA",
    name: "True Elements Chia 250g",
    nameHi: "ट्रू एलिमेंट्स चिया 250g",
    verdict: "PASS",
    verdictLabel: "PASS",
    verdictLabelHi: "उत्तीर्ण",
    description: "Stand-up zip pouch, Table-I 3.1mm pass, exact USP ₹1.40/g",
    descriptionHi: "स्टैंड-अप ज़िप पाउच, तालिका-I 3.1 मिमी उत्तीर्ण, सटीक यूएसपी ₹1.40/g",
    ruleCitation: "Table-I Row 3 & Rule 6(1)(da)",
    ruleCitationHi: "तालिका-I पंक्ति 3 एवं नियम 6(1)(da)",
  },
];

interface GoldenSkuQuickSelectorProps {
  onSelectSku: (caseId: string) => void;
  activeSkuId?: string;
  isCompact?: boolean;
}

export const GoldenSkuQuickSelector: React.FC<GoldenSkuQuickSelectorProps> = ({
  onSelectSku,
  activeSkuId,
  isCompact = false,
}) => {
  const { language } = useLanguage();

  if (isCompact) {
    return (
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap mr-1">
          {language === "hi" ? "डेमो एसकेयू:" : "Demo SKUs:"}
        </span>
        {GOLDEN_SKU_ITEMS.map((item) => {
          const isSelected = activeSkuId === item.skuId || activeSkuId === item.caseId;
          const label = language === "hi" && item.verdictLabelHi ? item.verdictLabelHi : item.verdictLabel;
          const itemName = language === "hi" && item.nameHi ? item.nameHi : item.name;
          const itemDesc = language === "hi" && item.descriptionHi ? item.descriptionHi : item.description;

          return (
            <button
              key={item.skuId}
              type="button"
              onClick={() => {
                resetScrollToTop();
                onSelectSku(item.caseId);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 border transition shrink-0 cursor-pointer ${
                isSelected
                  ? "bg-[#1B365D] text-white font-bold border-[#1B365D] shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-2xs"
              }`}
              title={`${itemName}, ${itemDesc}`}
            >
              <span>{item.skuId}</span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                  item.verdict === "FAIL"
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : item.verdict === "PASS"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : item.verdict === "REVIEW"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-purple-50 text-purple-700 border-purple-200"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#1B365D]/10 border border-[#1B365D]/20 flex items-center justify-center text-[#1B365D] shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#1B365D] uppercase tracking-wider">
              {language === "hi"
                ? "स्वर्ण प्रदर्शन एसकेयू (पूर्व-प्रमाणित परीक्षण परिदृश्य)"
                : "Golden Demonstration SKUs (Pre-Certified Test Scenarios)"}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              {language === "hi"
                ? "एलएमपीसी नियम, 2011 के अंतर्गत तत्काल पूर्ण सांविधिक सत्यापन हेतु 1-क्लिक लोड"
                : "1-Click load for instant end-to-end statutory verification under LMPC Rules, 2011"}
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-slate-500 font-medium hidden sm:inline">
          {language === "hi" ? "6 स्वर्ण परीक्षण मामले तैयार" : "6 Golden Test Cases Ready"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {GOLDEN_SKU_ITEMS.map((item) => {
          const isSelected = activeSkuId === item.skuId || activeSkuId === item.caseId;
          const badgeStyles = {
            FAIL: "bg-rose-50 text-rose-700 border-rose-200",
            PASS: "bg-emerald-50 text-emerald-700 border-emerald-200",
            REVIEW: "bg-amber-50 text-amber-700 border-amber-200",
            UNABLE: "bg-purple-50 text-purple-700 border-purple-200",
          };

          const cardStyles = isSelected
            ? "border-[#1B365D] ring-2 ring-[#1B365D]/20 bg-blue-50/40 shadow-xs"
            : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-xs";

          const label = language === "hi" && item.verdictLabelHi ? item.verdictLabelHi : item.verdictLabel;
          const itemName = language === "hi" && item.nameHi ? item.nameHi : item.name;
          const itemDesc = language === "hi" && item.descriptionHi ? item.descriptionHi : item.description;
          const citation = language === "hi" && item.ruleCitationHi ? item.ruleCitationHi : item.ruleCitation;

          return (
            <button
              key={item.skuId}
              type="button"
              onClick={() => {
                resetScrollToTop();
                onSelectSku(item.caseId);
              }}
              className={`p-3 rounded-xl text-left transition-all duration-200 border flex flex-col justify-between group focus:outline-none focus:ring-2 focus:ring-[#1B365D] cursor-pointer ${cardStyles}`}
            >
              <div>
                <div className="flex justify-between items-center text-[10px] mb-1.5">
                  <span className="font-mono font-bold text-slate-500 group-hover:text-[#1B365D]">
                    {item.skuId}
                  </span>
                  <span
                    className={`px-2 py-0.5 font-bold rounded text-[9.5px] border ${badgeStyles[item.verdict]}`}
                  >
                    {label}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-[#1B365D] transition-colors line-clamp-1">
                  {itemName}
                </div>
                <div className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {itemDesc}
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-500 truncate flex items-center justify-between">
                <span className="truncate">{citation}</span>
                <span className="text-[#1B365D] font-bold opacity-0 group-hover:opacity-100 transition-opacity ml-1">→</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
