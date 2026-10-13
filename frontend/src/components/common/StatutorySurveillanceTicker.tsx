import React, { useState, useEffect } from "react";
import { Megaphone, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

interface Bulletin {
  tag: string;
  title: { en: string; hi: string };
  desc: { en: string; hi: string };
  link: string;
}

const BULLETINS: Bulletin[] = [
  {
    tag: "GSR 779(E)",
    title: {
      en: "Mandatory Unit Sale Price (USP) Audit Active",
      hi: "अनिवार्य इकाई विक्रय मूल्य (यूएसपी) ऑडिट सक्रिय",
    },
    desc: {
      en: "Verification of price per g/ml/kg/litre is enforced for all packaged retail commodities. Tolerance strictly |USP×Qty - MRP| ≤ ₹0.02.",
      hi: "सभी खुदरा पैकेज्ड वस्तुओं के लिए प्रति ग्राम/मिली/किग्रा/लीटर मूल्य का सत्यापन अनिवार्य है। सहनशीलता सख्त रूप से |USP×Qty - MRP| ≤ ₹0.02 है।",
    },
    link: "/rules",
  },
  {
    tag: "SECTION 63 BSA 2023",
    title: {
      en: "Digital Electronic Evidence Standard Deployed",
      hi: "डिजिटल इलेक्ट्रॉनिक साक्ष्य मानक लागू",
    },
    desc: {
      en: "All camera captures, ArUco fiducials, and OCR tokens are cryptographically signed with backend SHA-256 Merkle proofs for court admissibility.",
      hi: "न्यायालय में स्वीकार्यता हेतु समस्त कैमरा कैप्चर, ArUco संदर्भ और ओसीआर टोकन बैकएंड SHA-256 मर्कल प्रमाण द्वारा डिजिटल रूप से हस्ताक्षरित हैं।",
    },
    link: "/inspections",
  },
  {
    tag: "RULE 6(10) E-COMMERCE",
    title: {
      en: "Statutory Exemption for Online Marketplaces",
      hi: "ऑनलाइन मार्केटप्लेस के लिए विधिक छूट",
    },
    desc: {
      en: "Digital e-commerce listings must declare manufacturer, net quantity, MRP, consumer care, and origin. Manufacturing date is statutorily exempt.",
      hi: "डिजिटल ई-कॉमर्स लिस्टिंग में निर्माता, शुद्ध मात्रा, एमआरपी, उपभोक्ता सेवा और मूल देश घोषित होना चाहिए। निर्माण तिथि विधिक रूप से छूट प्राप्त है।",
    },
    link: "/rules",
  },
  {
    tag: "ADL-01 TABLE-I",
    title: {
      en: "Table-I Font Schedule: Row 5 Strictly 6.0 mm",
      hi: "तालिका-I फॉन्ट अनुसूची: Row 5 सख्त रूप से 6.0 मिमी",
    },
    desc: {
      en: "Numeral height for PDP area > 2500 cm² is strictly 6.0 mm. (8.0 mm is only applicable for blown/embossed glass containers).",
      hi: "2500 सेमी² से अधिक PDP क्षेत्रफल के लिए अंकों की ऊंचाई सख्त रूप से 6.0 मिमी है (8.0 मिमी केवल उभरे हुए कांच के कंटेनरों के लिए मान्य है)।",
    },
    link: "/rules",
  },
];

export const StatutorySurveillanceTicker: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { language, t } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % BULLETINS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const current = BULLETINS[activeIndex];

  return (
    <div className="rounded-xl bg-white text-slate-900 border border-slate-200 shadow-xs overflow-hidden flex flex-col sm:flex-row items-stretch text-xs">
      {/* Label Badge */}
      <div className="bg-[#1B365D] px-3.5 py-2.5 flex items-center gap-2 text-white font-extrabold uppercase tracking-wider text-[11px] shrink-0 border-b sm:border-b-0 sm:border-r border-[#152a48]">
        <Megaphone size={15} className="text-amber-400 animate-pulse" />
        <span className="whitespace-nowrap">
          {t("ticker.directives", "Statutory Directives")}
        </span>
      </div>

      {/* Ticker Content */}
      <div className="flex-1 px-4 py-2 flex items-center justify-between gap-3 overflow-hidden">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
            {current.tag}
          </span>
          <p className="truncate text-slate-700 text-xs">
            <strong className="text-slate-900 mr-1.5">
              {current.title[language] || current.title.en}:
            </strong>
            <span className="text-slate-600 hidden md:inline">
              {current.desc[language] || current.desc.en}
            </span>
          </p>
        </div>

        <Link
          to={current.link}
          className="text-[11px] font-bold text-[#1B365D] hover:text-[#0A2540] shrink-0 flex items-center gap-1 hover:underline ml-2"
        >
          <span>{t("ticker.view_rule", "View Rule")}</span>
          <ChevronRight size={13} />
        </Link>
      </div>

      {/* Ticker Step Indicators */}
      <div className="hidden lg:flex items-center gap-1 px-3 bg-slate-50 border-l border-slate-200 shrink-0">
        {BULLETINS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === activeIndex ? "w-4 bg-[#1B365D]" : "w-1.5 bg-slate-300 hover:bg-slate-400"
            }`}
            aria-label={`Go to statutory bulletin ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
