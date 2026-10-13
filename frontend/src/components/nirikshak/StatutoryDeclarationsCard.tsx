import React, { useState } from "react";
import { ExtractedField, ExtractedFieldType } from "../../types/inspection";
import { useLanguage } from "../../context/LanguageContext";
import {
  CheckCircle2,
  AlertTriangle,
  Edit3,
  Check,
  FileText,
  ShieldCheck,
  Scale,
  MapPin,
  Calendar,
  Phone,
  Building,
  DollarSign,
  HelpCircle,
  X,
  UserCheck,
} from "lucide-react";

interface StatutoryDeclarationsCardProps {
  fields: ExtractedField[];
  onFieldConfirmed?: (fieldId: string) => void;
  onFieldEdited?: (fieldId: string, newValue: string, newFontSizeMm?: number) => void;
  className?: string;
}

interface DeclarationMeta {
  titleEn: string;
  titleHi: string;
  ruleCitationEn: string;
  ruleCitationHi: string;
  icon: React.ReactNode;
  hintEn: string;
  hintHi: string;
}

const FIELD_METADATA: Record<string, DeclarationMeta> = {
  MRP: {
    titleEn: "Maximum Retail Price (MRP)",
    titleHi: "अधिकतम खुदरा मूल्य (एमआरपी)",
    ruleCitationEn: "Rule 6(1)(e), Inclusive of all taxes",
    ruleCitationHi: "नियम 6(1)(e), सभी करों सहित",
    icon: <DollarSign size={15} className="text-emerald-400" />,
    hintEn: "Must declare MRP with statutory tax inclusive clause ('incl. of all taxes').",
    hintHi: "वैधानिक कर समावेशी खंड ('सभी करों सहित') के साथ एमआरपी घोषित करना अनिवार्य है।",
  },
  NET_QUANTITY: {
    titleEn: "Net Quantity & Units",
    titleHi: "शुद्ध मात्रा एवं इकाइयां",
    ruleCitationEn: "Rule 6(1)(f) & Section 11, Standard SI units",
    ruleCitationHi: "नियम 6(1)(f) एवं धारा 11, मानक एसआई इकाइयां",
    icon: <Scale size={15} className="text-blue-400" />,
    hintEn: "Must use approved SI units (g, kg, ml, L). Colloquial units like 'gms' are strictly prohibited.",
    hintHi: "स्वीकृत एसआई इकाइयों (g, kg, ml, L) का उपयोग अनिवार्य है। 'gms' जैसी बोलचाल की इकाइयां सख्त वर्जित हैं।",
  },
  UNIT_SALE_PRICE: {
    titleEn: "Unit Sale Price (USP)",
    titleHi: "इकाई विक्रय मूल्य (यूएसपी)",
    ruleCitationEn: "Rule 6(1)(e), Price per unit/gram/liter",
    ruleCitationHi: "नियम 6(1)(e), मूल्य प्रति इकाई/ग्राम/लीटर",
    icon: <DollarSign size={15} className="text-amber-400" />,
    hintEn: "Mandatory for packages > 1 unit. Enforces |USP × NetQty - MRP| ≤ ₹0.02.",
    hintHi: "1 से अधिक इकाइयों वाले पैकेजों के लिए अनिवार्य। |USP × NetQty - MRP| ≤ ₹0.02 लागू करता है।",
  },
  MANUFACTURER_ADDRESS: {
    titleEn: "Manufacturer / Packer Details",
    titleHi: "निर्माता / पैकर विवरण",
    ruleCitationEn: "Rule 6(1)(a)/(b), Complete postal address",
    ruleCitationHi: "नियम 6(1)(a)/(b), पूर्ण डाक पता",
    icon: <Building size={15} className="text-purple-400" />,
    hintEn: "Name and complete postal address with valid PIN code.",
    hintHi: "वैध पिन कोड के साथ नाम और पूरा डाक पता।",
  },
  COUNTRY_OF_ORIGIN: {
    titleEn: "Country of Origin",
    titleHi: "उत्पत्ति का देश",
    ruleCitationEn: "Rule 6(10) & Advisory, Mandatory for all goods",
    ruleCitationHi: "नियम 6(10) एवं परामर्श, सभी वस्तुओं के लिए अनिवार्य",
    icon: <MapPin size={15} className="text-rose-400" />,
    hintEn: "Country where goods were produced. Statutory exempt on e-commerce listing manufacture date.",
    hintHi: "वह देश जहां वस्तुएं निर्मित हुईं। ई-कॉमर्स लिस्टिंग निर्माण तिथि पर वैधानिक छूट प्राप्त है।",
  },
  DATE_OF_MANUFACTURE: {
    titleEn: "Date of Packaging / Manufacture",
    titleHi: "पैकेजिंग / निर्माण की तिथि",
    ruleCitationEn: "Rule 6(1)(d), Month and year of packing",
    ruleCitationHi: "नियम 6(1)(d), पैकिंग का माह एवं वर्ष",
    icon: <Calendar size={15} className="text-blue-400" />,
    hintEn: "Statutory month and year format (MM/YYYY).",
    hintHi: "सांविधिक माह एवं वर्ष प्रारूप (MM/YYYY)।",
  },
  CONSUMER_CARE_CONTACT: {
    titleEn: "Consumer Care Contacts",
    titleHi: "उपभोक्ता सेवा संपर्क",
    ruleCitationEn: "Rule 6(1)(n), Telephone & Email address",
    ruleCitationHi: "नियम 6(1)(n), दूरभाष एवं ईमेल पता",
    icon: <Phone size={15} className="text-emerald-400" />,
    hintEn: "Designated complaint officer name/designation, helpline phone, and email.",
    hintHi: "नामित शिकायत अधिकारी का नाम/पदनाम, हेल्पलाइन फोन और ईमेल।",
  },
  GENERIC_NAME: {
    titleEn: "Commodity Common Name",
    titleHi: "वस्तु का सामान्य नाम",
    ruleCitationEn: "Rule 6(1)(l), Generic commodity name",
    ruleCitationHi: "नियम 6(1)(l), सामान्य वस्तु का नाम",
    icon: <FileText size={15} className="text-slate-400" />,
    hintEn: "Standard common trade name of packaged commodity.",
    hintHi: "पैक की गई वस्तु का मानक सामान्य व्यापारिक नाम।",
  },
};

export const StatutoryDeclarationsCard: React.FC<StatutoryDeclarationsCardProps> = ({
  fields = [],
  onFieldConfirmed,
  onFieldEdited,
  className = "",
}) => {
  const { language } = useLanguage();

  // Local state for officer confirmations and edits
  const [confirmedFields, setConfirmedFields] = useState<Record<string, boolean>>({});
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [editedFontSizes, setEditedFontSizes] = useState<Record<string, number>>({});
  const [editInputValue, setEditInputValue] = useState("");
  const [editFontSizeInput, setEditFontSizeInput] = useState("");

  const handleToggleConfirm = (fieldId: string) => {
    setConfirmedFields((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
    if (onFieldConfirmed) {
      onFieldConfirmed(fieldId);
    }
  };

  const handleStartEdit = (field: ExtractedField) => {
    setEditingFieldId(field.field_id);
    const currText = editedValues[field.field_id] !== undefined ? editedValues[field.field_id] : field.raw_ocr_text;
    setEditInputValue(currText);
    const currFontSize = editedFontSizes[field.field_id] !== undefined
      ? editedFontSizes[field.field_id]
      : field.measured_font_height_mm;
    setEditFontSizeInput(currFontSize != null && !isNaN(Number(currFontSize)) ? String(currFontSize) : "");
  };

  const handleSaveEdit = (fieldId: string) => {
    const parsedFontSize = editFontSizeInput.trim() ? parseFloat(editFontSizeInput) : undefined;
    const validFontSize = (parsedFontSize !== undefined && !isNaN(parsedFontSize) && parsedFontSize > 0)
      ? Number(parsedFontSize.toFixed(2))
      : undefined;

    setEditedValues((prev) => ({
      ...prev,
      [fieldId]: editInputValue,
    }));
    if (validFontSize !== undefined) {
      setEditedFontSizes((prev) => ({
        ...prev,
        [fieldId]: validFontSize,
      }));
    }
    setEditingFieldId(null);
    if (onFieldEdited) {
      onFieldEdited(fieldId, editInputValue, validFontSize);
    }
  };

  const handleCancelEdit = () => {
    setEditingFieldId(null);
  };

  return (
    <div className={`card p-5 bg-white border border-slate-200 shadow-xs space-y-4 rounded-xl ${className}`}>
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-50 text-[#1B365D]">
            <FileText size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {language === "hi" ? "सांविधिक घोषणाओं की समीक्षा" : "Statutory Declarations Review"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === "hi"
                ? "ओसीआर द्वारा सत्यापित नियम 6 अनिवार्य घोषणाएं, अधिकारी की समीक्षा सहित।"
                : "Rule 6 mandatory declarations verified by OCR with officer human-in-the-loop review."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 font-bold">
            {fields.length} {language === "hi" ? "घोषणाएं सत्यापित" : "Declarations Verified"}
          </span>
        </div>
      </div>

      {/* Declarations Grid */}
      {fields.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-xs">
          {language === "hi"
            ? "इस छवि परिसंपत्ति से कोई सांविधिक घोषणा निष्कर्षित नहीं हुई।"
            : "No statutory declarations extracted from this image asset."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {fields.map((field) => {
            const rawMeta = FIELD_METADATA[field.field_type];
            const meta = rawMeta
              ? {
                  title: language === "hi" ? rawMeta.titleHi : rawMeta.titleEn,
                  ruleCitation: language === "hi" ? rawMeta.ruleCitationHi : rawMeta.ruleCitationEn,
                  icon: rawMeta.icon,
                  hint: language === "hi" ? rawMeta.hintHi : rawMeta.hintEn,
                }
              : {
                  title: field.field_type.replace(/_/g, " "),
                  ruleCitation: language === "hi" ? "नियम 6 सांविधिक खंड" : "Rule 6 Statutory Clause",
                  icon: <FileText size={15} className="text-slate-400" />,
                  hint: language === "hi" ? "अनिवार्य सांविधिक पैकेजिंग घोषणा।" : "Mandatory statutory packaging declaration.",
                };

            const isConfirmed = confirmedFields[field.field_id];
            const isEditing = editingFieldId === field.field_id;
            const isTextOverridden = editedValues[field.field_id] !== undefined;
            const isFontOverridden = editedFontSizes[field.field_id] !== undefined;
            const displayValue = isTextOverridden ? editedValues[field.field_id] : field.raw_ocr_text;
            const currentFontSize = isFontOverridden
              ? editedFontSizes[field.field_id]
              : field.measured_font_height_mm;

            // Simple heuristic to detect potential issues for the officer
            const hasPotentialIssue =
              field.field_type === "NET_QUANTITY" &&
              (displayValue.toLowerCase().includes("gms") || displayValue.toLowerCase().includes(" ml"));

            return (
              <div
                key={field.field_id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isConfirmed
                    ? "border-emerald-200 bg-emerald-50/50"
                    : (isTextOverridden || isFontOverridden)
                    ? "border-amber-300 bg-amber-50/40"
                    : hasPotentialIssue
                    ? "border-rose-200 bg-rose-50/50"
                    : "border-slate-200 bg-slate-50/60 hover:bg-slate-50"
                }`}
              >
                {/* Field Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1 rounded-md bg-white border border-slate-200 shrink-0 shadow-2xs">
                      {meta.icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{meta.title}</h4>
                      <p className="text-[10px] text-slate-500 font-mono truncate">{meta.ruleCitation}</p>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isConfirmed ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 size={11} className="text-emerald-600" />
                        <span>{language === "hi" ? "अधिकारी द्वारा पुष्ट" : "Officer Confirmed"}</span>
                      </span>
                    ) : (isTextOverridden || isFontOverridden) ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        <Edit3 size={10} className="text-amber-700" />
                        <span>{language === "hi" ? "अधिकारी संशोधित" : "Officer Overridden"}</span>
                      </span>
                    ) : hasPotentialIssue ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                        <AlertTriangle size={11} className="text-rose-600" />
                        <span>{language === "hi" ? "संभावित विसंगति" : "Potential Issue"}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#1B365D] border border-blue-200">
                        <span>{language === "hi" ? "सिस्टम द्वारा निष्कर्षित" : "System Extracted"}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Declaration Content Area */}
                {isEditing ? (
                  <div className="space-y-2.5 mt-2 p-3 bg-white rounded-lg border-2 border-[#1B365D]/20 shadow-2xs">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">
                        {language === "hi" ? "घोषणा पाठ / विवरण:" : "Declaration Text / Value:"}
                      </label>
                      {editInputValue.length > 50 ? (
                        <textarea
                          rows={3}
                          value={editInputValue}
                          onChange={(e) => setEditInputValue(e.target.value)}
                          className="input text-xs w-full font-mono bg-white border-slate-300 text-slate-900 rounded-md p-2 focus:ring-2 focus:ring-[#1B365D] resize-y"
                          placeholder={language === "hi" ? "निष्कर्षित मान संशोधित करें..." : "Correct extracted value..."}
                          autoFocus
                        />
                      ) : (
                        <input
                          type="text"
                          value={editInputValue}
                          onChange={(e) => setEditInputValue(e.target.value)}
                          className="input text-xs w-full font-mono bg-white border-slate-300 text-slate-900 rounded-md p-2 focus:ring-2 focus:ring-[#1B365D]"
                          placeholder={language === "hi" ? "निष्कर्षित मान संशोधित करें..." : "Correct extracted value..."}
                          autoFocus
                        />
                      )}
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="w-full sm:w-44">
                          <label className="block text-[10px] font-bold text-slate-700 mb-1">
                            {language === "hi" ? "मापी गई फ़ॉन्ट ऊंचाई (मिमी):" : "Measured Font Height (mm):"}
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              step="0.01"
                              min="0.1"
                              max="100"
                              value={editFontSizeInput}
                              onChange={(e) => setEditFontSizeInput(e.target.value)}
                              className="input text-xs w-full font-mono bg-white border-slate-300 text-slate-900 rounded-md py-1.5 pl-2.5 pr-8 focus:ring-2 focus:ring-[#1B365D]"
                              placeholder="e.g. 2.50"
                            />
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono font-bold pointer-events-none">
                              mm
                            </span>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-500 leading-tight flex-1">
                          {language === "hi"
                            ? "तालिका-I अनुसूची अनुसार फ़ॉन्ट ऊंचाई मैन्युअल रूप से संशोधित करें। नियम अनुपालन का स्वतः पुनर्मूल्यांकन होगा।"
                            : "Manually override font height in mm (e.g. physical caliper check). Rule compliance will auto-recalculate."}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-2.5 py-1 rounded text-xs text-slate-500 hover:bg-slate-100"
                      >
                        {language === "hi" ? "रद्द करें" : "Cancel"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(field.field_id)}
                        className="btn-primary py-1 px-3 text-xs inline-flex items-center gap-1.5 bg-[#1B365D] hover:bg-[#12243f] text-white rounded font-bold shadow-xs"
                      >
                        <Check size={13} />
                        <span>{language === "hi" ? "संशोधन सहेजें" : "Save Correction"}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 space-y-2">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 font-mono text-xs text-slate-900 break-words shadow-2xs">
                      {displayValue || (
                        <span className="text-slate-400 italic">
                          {language === "hi" ? "पैनल पर नहीं मिला" : "Not found on panel"}
                        </span>
                      )}
                    </div>

                    {/* Metadata & Officer Actions Footer */}
                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                      {(() => {
                        const confVal = field.ocr_confidence ?? field.detection_confidence ?? 0;
                        const confPct = Math.round(confVal * 100);
                        const isLowConf = confVal > 0 && confVal < 0.85;
                        return (
                          <span className={`font-mono text-[10px] ${isLowConf ? "text-amber-700 font-bold" : "text-slate-500"}`}>
                            {language === "hi" ? "विश्वसनीयता" : "Confidence"}: {confPct > 0 ? `${confPct}%` : "N/A"}
                            {isLowConf && (
                              <span className="ml-1 text-[9px] bg-amber-100 text-amber-800 border border-amber-300 px-1 py-0.2 rounded font-sans font-bold">
                                {language === "hi" ? "समीक्षा आवश्यक" : "Review Needed"}
                              </span>
                            )}
                            {currentFontSize != null && !isNaN(Number(currentFontSize)) && Number(currentFontSize) > 0 && (
                              <span className={`ml-2 font-bold ${isFontOverridden ? "text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300" : "text-[#1B365D]"}`}>
                                • {language === "hi" ? "फ़ॉन्ट" : "Font"}: {Number(currentFontSize).toFixed(2)}{" "}
                                {language === "hi" ? "मिमी" : "mm"}
                                {isFontOverridden && (
                                  <span className="ml-1 text-[9px] font-sans font-normal text-amber-800">
                                    ({language === "hi" ? "संशोधित" : "manual"})
                                  </span>
                                )}
                              </span>
                            )}
                            {((field as any).panel_type || (field as any).source_panel) && (
                              <span className="ml-2 px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-sans font-bold text-[9px] border border-slate-200">
                                {language === "hi" ? "पैनल: " : "Panel: "}
                                {String((field as any).panel_type || (field as any).source_panel).replace(/_/g, " ")}
                              </span>
                            )}
                          </span>
                        );
                      })()}

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(field)}
                          className="p-1 rounded text-slate-400 hover:text-[#1B365D] hover:bg-slate-100 transition-colors"
                          title={language === "hi" ? "निष्कर्षित पाठ व फ़ॉन्ट संशोधित करें" : "Correct extracted text & font size"}
                        >
                          <Edit3 size={13} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleConfirm(field.field_id)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10.5px] font-bold transition-colors ${
                            isConfirmed
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 border border-slate-200"
                          }`}
                        >
                          <Check size={12} />
                          <span>
                            {isConfirmed
                              ? language === "hi"
                                ? "पुष्ट किया गया"
                                : "Confirmed"
                              : language === "hi"
                              ? "पुष्टि करें"
                              : "Confirm"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Human-in-the-Loop Explanatory Guidance */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>
            {language === "hi"
              ? "प्रपत्र-1 नोटिस जारी करने से पहले सभी पाठ्य घोषणाओं पर निरीक्षण अधिकारी के हस्ताक्षर अनिवार्य हैं।"
              : "All text declarations require inspecting officer sign-off prior to Form-1 notice issuance."}
          </span>
        </span>
      </div>
    </div>
  );
};

export default StatutoryDeclarationsCard;
