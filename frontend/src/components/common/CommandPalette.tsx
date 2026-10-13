import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Scale,
  Sparkles,
  ClipboardCheck,
  FileArchive,
  BarChart3,
  Users,
  Settings,
  ArrowRight,
  X,
  BookOpen,
} from "lucide-react";
import { GOLDEN_SKU_ITEMS } from "../../features/desk/GoldenSkuQuickSelector";
import { useLanguage } from "../../context/LanguageContext";

interface CommandItem {
  id: string;
  category: "PAGES" | "GOLDEN_SKUS" | "STATUTORY_RULES";
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
  icon: React.ReactNode;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard shortcut listener for Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const items: CommandItem[] = [
    // Pages
    {
      id: "nav-dashboard",
      category: "PAGES",
      title: language === "hi" ? "कार्यकारी डैशबोर्ड" : "Executive Dashboard",
      subtitle: language === "hi" ? "निगरानी केपीआई, अनुपालन मेट्रिक्स एवं हालिया मामले" : "Surveillance KPIs, compliance metrics, and recent cases",
      icon: <Scale size={16} className="text-govNavy" />,
      action: () => {
        navigate("/dashboard");
        onClose();
      },
    },
    {
      id: "nav-new",
      category: "PAGES",
      title: language === "hi" ? "नया निरीक्षण केस" : "New Inspection Case",
      subtitle: language === "hi" ? "वस्तु पंजीकृत करें एवं मुख्य सम्मुख पैनल (पीडीपी) अपलोड करें" : "Register commodity and upload Principal Display Panel (PDP)",
      icon: <ClipboardCheck size={16} className="text-govNavy" />,
      action: () => {
        navigate("/inspections/new");
        onClose();
      },
    },
    {
      id: "nav-register",
      category: "PAGES",
      title: language === "hi" ? "निरीक्षण पंजी (रजिस्टर)" : "Inspection Register",
      subtitle: language === "hi" ? "सभी पंजीकृत प्रवर्तन मामलों को खोजें और फ़िल्टर करें" : "Search and filter all registered enforcement cases",
      icon: <Search size={16} className="text-govNavy" />,
      action: () => {
        navigate("/inspections");
        onClose();
      },
    },
    {
      id: "nav-review",
      category: "PAGES",
      title: language === "hi" ? "अधिकारी समीक्षा कतार" : "Officer Review Queue",
      subtitle: language === "hi" ? "सीमांत माप और गुणवत्ता प्रभावित छवियों की छंटनी" : "Triage borderline measurements and degraded captures",
      badge: language === "hi" ? "एचआईटीएल समीक्षा" : "HITL Triage",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      icon: <Users size={16} className="text-amber-600" />,
      action: () => {
        navigate("/review-queue");
        onClose();
      },
    },
    {
      id: "nav-rules",
      category: "PAGES",
      title: language === "hi" ? "नियम एवं तालिका-I अनुसूची" : "Rules & Table-I Schedule",
      subtitle: language === "hi" ? "सांविधिक अनुसूचियां, न्यूनतम फॉन्ट आकार और राजपत्र अधिसूचनाएं" : "Statutory schedules, font minimums, and Gazette notifications",
      icon: <BookOpen size={16} className="text-govNavy" />,
      action: () => {
        navigate("/rules");
        onClose();
      },
    },
    {
      id: "nav-reports",
      category: "PAGES",
      title: language === "hi" ? "रिपोर्ट एवं प्रपत्र-1 नोटिस" : "Reports & Form-1 Notices",
      subtitle: language === "hi" ? "धारा 63 बीएसए प्रमाणपत्र के साथ धारा 36(1) नोटिस तैयार करें" : "Generate Section 36(1) notices with Section 63 BSA certificates",
      icon: <BarChart3 size={16} className="text-govNavy" />,
      action: () => {
        navigate("/reports");
        onClose();
      },
    },
    {
      id: "nav-evidence",
      category: "PAGES",
      title: language === "hi" ? "धारा 63 साक्ष्य संचिका (डोज़ियर)" : "Section 63 Evidentiary Dossier",
      subtitle: language === "hi" ? "क्रिप्टोग्राफिक एसएचए-256 मर्कल डीएजी और स्रोत ऑडिट" : "Cryptographic SHA-256 Merkle DAG and provenance audit",
      icon: <FileArchive size={16} className="text-govNavy" />,
      action: () => {
        navigate("/inspections/demo-fortune-sunlite/evidence");
        onClose();
      },
    },
    {
      id: "nav-settings",
      category: "PAGES",
      title: language === "hi" ? "स्टेशन सेटिंग्स" : "Station Settings",
      subtitle: language === "hi" ? "सर्कल क्षेत्राधिकार, डिस्प्ले मोड और सेंसर पैरामीटर कॉन्फ़िगर करें" : "Configure circle jurisdiction, display modes, and sensor parameters",
      icon: <Settings size={16} className="text-govNavy" />,
      action: () => {
        navigate("/settings");
        onClose();
      },
    },

    // Golden SKUs
    ...GOLDEN_SKU_ITEMS.map((sku) => ({
      id: `sku-${sku.skuId}`,
      category: "GOLDEN_SKUS" as const,
      title: language === "hi" && sku.nameHi ? sku.nameHi : sku.name,
      subtitle:
        language === "hi" && sku.descriptionHi && sku.ruleCitationHi
          ? `${sku.descriptionHi}, ${sku.ruleCitationHi}`
          : `${sku.description}, ${sku.ruleCitation}`,
      badge: language === "hi" && sku.verdictLabelHi ? sku.verdictLabelHi : sku.verdictLabel,
      badgeColor:
        sku.verdict === "PASS"
          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
          : sku.verdict === "FAIL"
          ? "bg-rose-100 text-rose-800 border-rose-300"
          : sku.verdict === "REVIEW"
          ? "bg-amber-100 text-amber-800 border-amber-300"
          : "bg-purple-100 text-purple-800 border-purple-300",
      icon: <Sparkles size={16} className="text-amber-500" />,
      action: () => {
        navigate(`/inspections/${sku.caseId}`);
        onClose();
      },
    })),

    // Statutory Rules
    {
      id: "rule-table1",
      category: "STATUTORY_RULES",
      title:
        language === "hi"
          ? "तालिका-I फॉन्ट अनुसूची (पंक्ति 5 क्षेत्रफल > 2500 सेमी² = 6.0 मिमी)"
          : "Table-I Font Schedule (Row 5 Area > 2500 cm² = 6.0 mm)",
      subtitle:
        language === "hi"
          ? "एलएमपीसी नियम 2011 अनुसूची-I: 1.0मिमी, 1.5मिमी, 2.5मिमी, 4.0मिमी, 6.0मिमी (एडीएल-01)"
          : "LMPC Rules 2011 Schedule-I: 1.0mm, 1.5mm, 2.5mm, 4.0mm, 6.0mm (ADL-01)",
      badge: language === "hi" ? "सांविधिक" : "Statute",
      badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
      icon: <BookOpen size={16} className="text-blue-700" />,
      action: () => {
        navigate("/rules#table-1");
        onClose();
      },
    },
    {
      id: "rule-usp",
      category: "STATUTORY_RULES",
      title:
        language === "hi"
          ? "इकाई विक्रय मूल्य (यूएसपी) गणित सहिष्णुता (≤ ₹0.02)"
          : "Unit Sale Price (USP) Math Tolerance (≤ ₹0.02)",
      subtitle:
        language === "hi"
          ? "नियम 6(11): |(यूएसपी × शुद्ध मात्रा) - एमआरपी| ≤ ₹0.02 रुपये समाधान सहिष्णुता"
          : "Rule 6(11): |(USP × Net Qty) - MRP| ≤ ₹0.02 INR reconciliation tolerance",
      badge: language === "hi" ? "अंकगणित" : "Arithmetic",
      badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
      icon: <BookOpen size={16} className="text-blue-700" />,
      action: () => {
        navigate("/rules#usp-formula");
        onClose();
      },
    },
    {
      id: "rule-bsa",
      category: "STATUTORY_RULES",
      title:
        language === "hi"
          ? "धारा 63 भारतीय साक्ष्य अधिनियम, 2023"
          : "Section 63 Bharatiya Sakshya Adhiniyam, 2023",
      subtitle:
        language === "hi"
          ? "इलेक्ट्रॉनिक अभिलेखों की ग्राह्यता एवं डिजिटल क्रिप्टोग्राफिक अभिरक्षा-श्रृंखला"
          : "Admissibility of electronic records and digital cryptographic chain-of-custody",
      badge: "BSA 2023",
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
      icon: <BookOpen size={16} className="text-emerald-700" />,
      action: () => {
        navigate("/rules#section-63");
        onClose();
      },
    },
  ];

  const filteredItems = items.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.badge?.toLowerCase().includes(q)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={language === "hi" ? "सार्वभौमिक आदेश खोज पैलेट" : "Universal Command Search Palette"}
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-up"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* National Tricolor Top Accent Line */}
        <div className="h-1 bg-gradient-to-r from-[#ff9933] via-white to-[#138808] w-full" />

        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 bg-slate-50">
          <Search size={18} className="text-[#1B365D] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-autocomplete="list"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={
              language === "hi"
                ? "कमांड, एसकेयू नाम, केस आईडी, या सांविधिक नियम टाइप करें..."
                : "Type a command, SKU name, case ID, or statutory rule..."
            }
            className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-sans font-medium"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label={language === "hi" ? "खोज पैलेट बंद करें" : "Close search palette"}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors ml-2 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-mono">
              {language === "hi"
                ? `"${query}" के लिए कोई मिलान आदेश या सांविधिक नियम नहीं मिला।`
                : `No matching commands or statutory rules found for "${query}".`}
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected ? "bg-blue-50/70 border-l-4 border-[#1B365D] pl-2.5 shadow-xs" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="p-2 rounded-lg bg-blue-50 text-[#1B365D] border border-blue-200 shrink-0">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                              item.badgeColor || "bg-amber-100 text-amber-900 border-amber-300"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <ArrowRight size={14} className={`shrink-0 ${isSelected ? "text-[#1B365D]" : "text-slate-400"}`} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-t border-slate-200 text-[10.5px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span>{language === "hi" ? "↑↓ नेविगेट" : "↑↓ Navigate"}</span>
            <span>{language === "hi" ? "↵ चयन करें" : "↵ Select"}</span>
            <span>{language === "hi" ? "ESC बंद करें" : "ESC Close"}</span>
          </div>
          <span className="text-amber-400 font-bold">
            {language === "hi" ? "निरीक्षक कमांड पैलेट" : "Veriq Command Palette"}
          </span>
        </div>
      </div>
    </div>
  );
};
