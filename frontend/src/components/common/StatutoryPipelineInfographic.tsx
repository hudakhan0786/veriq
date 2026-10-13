import React, { useState } from "react";
import {
  Camera,
  ScanLine,
  FileCheck2,
  Scale,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Info,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

interface PipelineStep {
  id: string;
  stepNumber: string;
  titleEn: string;
  titleHi: string;
  categoryEn: string;
  categoryHi: string;
  statute: string;
  icon: React.ElementType;
  keySpecsEn: { label: string; value: string }[];
  keySpecsHi: { label: string; value: string }[];
  descriptionEn: string;
  descriptionHi: string;
  badgeEn: string;
  badgeHi: string;
}

export const StatutoryPipelineInfographic: React.FC = () => {
  const { language, t } = useLanguage();
  const [activeStepId, setActiveStepId] = useState<string>("optical");

  const steps: PipelineStep[] = [
    {
      id: "optical",
      stepNumber: "01",
      titleEn: "Optical Quality & Calibration",
      titleHi: "ऑप्टिकल गुणवत्ता एवं अंशांकन",
      categoryEn: "Physical Evidence Gate",
      categoryHi: "भौतिक साक्ष्य द्वार",
      statute: "ADR-04 & ADR-06",
      icon: Camera,
      keySpecsEn: [
        { label: "Laplacian Blur", value: "σ² ≥ 150.0" },
        { label: "Specular Glare", value: "≤ 3.0% area" },
        { label: "Fiducial Standard", value: "ArUco 4x4 (50mm)" },
      ],
      keySpecsHi: [
        { label: "लैप्लासियन धुंधलापन", value: "σ² ≥ 150.0" },
        { label: "स्पेक्ट्रमी चकाचौंध", value: "≤ 3.0% क्षेत्रफल" },
        { label: "फिड्यूशियल मानक", value: "ArUco 4x4 (50mm)" },
      ],
      descriptionEn:
        "Real-time edge variance and specular reflection gates reject degraded captures before evidence intake, calibrating pixel-to-millimeter ratio via planar homography.",
      descriptionHi:
        "साक्ष्य इनपुट से पहले धुंधलेपन एवं अत्यधिक चमक को अस्वीकृत किया जाता है। प्लानर होमोग्राफी द्वारा पिक्सल-से-मिलीमीटर स्केल का सटीक अंशांकन किया जाता है।",
      badgeEn: "Quality Gate",
      badgeHi: "गुणवत्ता द्वार",
    },
    {
      id: "ocr",
      stepNumber: "02",
      titleEn: "Multilingual OCR Detection",
      titleHi: "बहुभाषी ओसीआर पाठ पहचान",
      categoryEn: "Text Extraction",
      categoryHi: "पाठ निष्कर्षण",
      statute: "Rule 6 LMPC 2011",
      icon: ScanLine,
      keySpecsEn: [
        { label: "Detection Engine", value: "DBNet++ (Apache-2.0)" },
        { label: "Recognition", value: "PP-OCRv4 (En + Devanagari)" },
        { label: "Confidence Threshold", value: "≥ 85.0% Mean" },
      ],
      keySpecsHi: [
        { label: "डिटेक्शन इंजन", value: "DBNet++ (Apache-2.0)" },
        { label: "पहचान इंजन", value: "PP-OCRv4 (अंग्रेजी + देवनागरी)" },
        { label: "विश्वसनीयता सीमा", value: "≥ 85.0% माध्य" },
      ],
      descriptionEn:
        "High-accuracy localized bounding polygon detection parses bilingual declarations across English and Devanagari Hindi for all statutory package markings.",
      descriptionHi:
        "उच्च परिशुद्धता बहुभाषी पाठ पहचान इंजन अंग्रेजी और देवनागरी हिंदी में मुद्रित सभी वैधानिक घोषणाओं के बाउंडिंग बॉक्स निष्कर्षित करता है।",
      badgeEn: "Multilingual",
      badgeHi: "बहुभाषी",
    },
    {
      id: "rules",
      stepNumber: "03",
      titleEn: "Statutory Rule AST Engine",
      titleHi: "वैधानिक नियम अनुसूची इंजन",
      categoryEn: "Statutory Schedules",
      categoryHi: "वैधानिक अनुसूचियां",
      statute: "Table-I & GSR 779(E)",
      icon: Scale,
      keySpecsEn: [
        { label: "Table-I Row 5", value: "6.0 mm (Area > 2500cm²)" },
        { label: "USP Math Tolerance", value: "|USP × Qty - MRP| ≤ ₹0.02" },
        { label: "Prohibited Units", value: "Flags 'gms', 'ML', 'gm'" },
      ],
      keySpecsHi: [
        { label: "तालिका-I पंक्ति 5", value: "6.0 मिमी (क्षेत्रफल > 2500cm²)" },
        { label: "यूएसपी गणित सहिष्णुता", value: "|USP × Qty - MRP| ≤ ₹0.02" },
        { label: "प्रतिबंधित इकाइयां", value: "'gms', 'ML', 'gm' को चिह्नित करता है" },
      ],
      descriptionEn:
        "Automated Abstract Syntax Tree (AST) validation against Gazette schedules verifies numeral heights, Unit Sale Price arithmetic, and bans non-standard metric abbreviations.",
      descriptionHi:
        "राजपत्र अनुसूचियों के विरुद्ध स्वचालित एएसटी इंजन फॉन्ट ऊंचाई (पंक्ति 5 = 6.0 मिमी), इकाई विक्रय मूल्य (यूएसपी) गणित और प्रतिबंधित इकाइयों की जांच करता है।",
      badgeEn: "LMPC 2011",
      badgeHi: "एलएमपीसी 2011",
    },
    {
      id: "evidence",
      stepNumber: "04",
      titleEn: "Section 63 BSA 2023 DAG",
      titleHi: "धारा 63 साक्ष्य ब्लॉकचेन/डीएजी",
      categoryEn: "Cryptographic Provenance",
      categoryHi: "क्रिप्टोग्राफिक साक्ष्य शृंखला",
      statute: "Act No. 47 of 2023",
      icon: ShieldCheck,
      keySpecsEn: [
        { label: "Hash Protocol", value: "SHA-256 Merkle Proofs" },
        { label: "Legal Status", value: "Section 63 BSA Certified Record" },
        { label: "Device Tamper Log", value: "Hardware Bound Key" },
      ],
      keySpecsHi: [
        { label: "हैश प्रोटोकॉल", value: "SHA-256 मर्कल प्रमाण" },
        { label: "विधिक स्थिति", value: "धारा 63 बीएसए प्रमाणित रिकॉर्ड" },
        { label: "उपकरण छेड़छाड़ लॉग", value: "हार्डवेयर-बद्ध कुंजी" },
      ],
      descriptionEn:
        "Every capture, token polygon, and rule result forms an immutable SHA-256 Merkle chain-of-custody certified under Section 63 of Bharatiya Sakshya Adhiniyam, 2023.",
      descriptionHi:
        "प्रत्येक डिजिटल छवि और माप भारतीय साक्ष्य अधिनियम, 2023 की धारा 63 के तहत अदालत में मान्य डिजिटल प्रमाण पत्र के रूप में एसएचए-256 प्रमाणों के साथ सुरक्षित है।",
      badgeEn: "Sec 63 BSA",
      badgeHi: "धारा 63 बीएसए",
    },
    {
      id: "adjudication",
      stepNumber: "05",
      titleEn: "Officer Adjudication & Notice",
      titleHi: "अधिकारी न्यायनिर्णयन एवं नोटिस",
      categoryEn: "Human-in-the-Loop",
      categoryHi: "मानव-निर्देशित निर्णय",
      statute: "LMPC Rules, 2011 & Sec 15 LM Act, 2009",
      icon: FileCheck2,
      keySpecsEn: [
        { label: "Role Requirement", value: "Gazetted LMO Required" },
        { label: "Notice Protocol", value: "Form-1 PDF/A Notice" },
        { label: "Epistemic Triage", value: "4-State Verdict" },
      ],
      keySpecsHi: [
        { label: "भूमिका आवश्यकता", value: "राजपत्रित अधिकारी अनिवार्य" },
        { label: "नोटिस प्रोटोकॉल", value: "प्रपत्र-1 पीडीएफ/ए नोटिस" },
        { label: "न्यायिक वर्गीकरण", value: "4-चरणीय निर्णय" },
      ],
      descriptionEn:
        "Qualified human Legal Metrology Officers review split-screen evidence, calibrate borderline sensor tolerances (k=2 band), and issue digitally stamped Form-1 notices.",
      descriptionHi:
        "अधिकृत विधिक मापविज्ञान अधिकारी स्क्रीन पर साक्ष्यों की पुष्टि करते हैं, सीमावर्ती मामलों का सत्यापन करते हैं और प्रमाणित प्रपत्र-1 विधिक नोटिस जारी करते हैं।",
      badgeEn: "Gazetted Seal",
      badgeHi: "राजपत्रित मुहर",
    },
  ];

  const activeStep = steps.find((s) => s.id === activeStepId) || steps[0];
  const ActiveIcon = activeStep.icon;
  const currentKeySpecs = language === "hi" ? activeStep.keySpecsHi : activeStep.keySpecsEn;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-700">
              {language === "hi"
                ? "विधिक मापविज्ञान सत्यापन पाइपलाइन"
                : "Statutory Verification Architecture"}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-indigo-50 text-indigo-900 border border-indigo-200">
              GSR 594(E) • Table-I Schedule
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-govNavy mt-1">
            {language === "hi"
              ? "पैकेज सत्यापन से न्यायालयीय साक्ष्य तक 5-चरणीय प्रक्रिया"
              : "5-Stage Statutory Pipeline: Physical Capture to Admissible Notice"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
            {language === "hi"
              ? "विधिक मापविज्ञान (पैकेज वस्तुएं) नियम, 2011 एवं भारतीय साक्ष्य अधिनियम, 2023 की धारा 63 के तहत स्वचालित एवं मानकीकृत अनुपालन प्रणाली।"
              : "End-to-end statutory workflow engineered for Legal Metrology Officers. Every measurement is bounded by sensor uncertainty (k=2, 95% CI) and sealed with Section 63 BSA certificates."}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://emaap.gov.in/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors shadow-2xs"
          >
            <span>{language === "hi" ? "ई-माप पोर्टल" : "e-Maap Portal"}</span>
            <ExternalLink size={13} className="text-slate-500" />
          </a>
        </div>
      </div>

      {/* Stepper Navigation Track (Swipeable Tab Strip on Mobile, 5-col Grid on Desktop) */}
      <div className="flex sm:grid sm:grid-cols-5 gap-2 overflow-x-auto no-scrollbar pb-1 snap-x">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = step.id === activeStepId;
          const badgeText = language === "hi" ? step.badgeHi : step.badgeEn;
          return (
            <button
              type="button"
              key={step.id}
              onClick={() => setActiveStepId(step.id)}
              className={`shrink-0 min-w-[140px] sm:min-w-0 snap-start p-2.5 sm:p-3 rounded-xl text-left border transition-all relative ${
                isActive
                  ? "border-govNavy bg-govNavy text-white shadow-md ring-2 ring-amber-400"
                  : "border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300 hover:bg-slate-100/80"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-mono font-bold ${
                    isActive ? "text-amber-300" : "text-slate-400"
                  }`}
                >
                  {step.stepNumber}
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {badgeText}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-1.5 sm:gap-2">
                <Icon
                  size={15}
                  className={isActive ? "text-amber-300" : "text-slate-600"}
                />
                <p className="text-xs font-bold truncate">
                  {language === "hi" ? step.titleHi : step.titleEn}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Step Detailed Showcase Panel */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-center">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-govNavy text-white flex items-center justify-center font-bold">
              <ActiveIcon size={18} className="text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                {language === "hi" ? activeStep.categoryHi : activeStep.categoryEn} • {activeStep.statute}
              </span>
              <h4 className="text-lg font-black text-slate-900">
                {language === "hi" ? activeStep.titleHi : activeStep.titleEn}
              </h4>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {language === "hi" ? activeStep.descriptionHi : activeStep.descriptionEn}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            {currentKeySpecs.map((spec) => (
              <div
                key={spec.label}
                className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs space-y-0.5"
              >
                <span className="text-[10px] font-bold uppercase text-slate-500 block">
                  {spec.label}
                </span>
                <span className="text-xs font-mono font-bold text-govNavy block">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Metrological Simulation Viewfinder */}
        <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 space-y-3 font-mono text-xs shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[10px]">
            <span className="text-amber-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {language === "hi" ? "सांविधिक टेलीमेट्री फीड" : "STATUTORY TELEMETRY FEED"}
            </span>
            <span className="text-slate-400">
              {language === "hi" ? `चरण ${activeStep.stepNumber} (कुल 05)` : `Step ${activeStep.stepNumber} of 05`}
            </span>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">
                {language === "hi" ? "सांविधिक प्राधिकार:" : "Statutory Authority:"}
              </span>
              <span className="text-cyan-300 font-bold">
                {language === "hi" ? "एलएमपीसी नियम, 2011" : "LMPC Rules, 2011"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">
                {language === "hi" ? "साक्ष्य ग्राह्यता:" : "Evidence Admissibility:"}
              </span>
              <span className="text-emerald-400 font-bold">
                {language === "hi" ? "धारा 63 बीएसए 2023" : "Section 63 BSA 2023"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">
                {language === "hi" ? "तालिका-I पंक्ति 5 मानक:" : "Table-I Row 5 Standard:"}
              </span>
              <span className="text-amber-300 font-bold">6.0 mm (ADL-01)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">
                {language === "hi" ? "सेंसर विश्वसनीयता बैंड:" : "Sensor Confidence Band:"}
              </span>
              <span className="text-white font-bold">k=2 (95% CI ±0.04mm)</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span>{language === "hi" ? "उपभोक्ता मामले विभाग" : "Department of Consumer Affairs"}</span>
            <span className="text-emerald-400 font-bold">
              {language === "hi" ? "प्रमाणित" : "VALIDATED"}
            </span>
          </div>
        </div>
      </div>

      {/* End-to-End Pipeline Architecture Vector Infographic */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-govNavy bg-govNavy/5 px-2 py-0.5 rounded">
              {language === "hi" ? "उच्च-स्तरीय प्रणाली डेटा प्रवाह" : "High-Level System Dataflow"}
            </span>
            <h5 className="text-xs font-bold text-slate-800">
              {language === "hi"
                ? "एंड-टू-एंड सांविधिक साक्ष्य पाइपलाइन वास्तुकला"
                : "End-to-End Statutory Evidence Pipeline Architecture"}
            </h5>
          </div>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
            {language === "hi" ? "वेक्टर विनिर्देश • जीआईजीडब्ल्यू 3.0 मानक" : "Vector Specification • GIGW 3.0 Standard"}
          </span>
        </div>

        {/* Mobile Swipe Hint */}
        <div className="flex sm:hidden items-center justify-end gap-1 text-[10px] text-slate-500 font-medium">
          <span>{language === "hi" ? "👉 पूरा आरेख देखने के लिए स्क्रॉल करें" : "👉 Swipe to view full pipeline architecture"}</span>
        </div>

        <div className="p-2 sm:p-3 bg-slate-50/70 rounded-lg border border-slate-200/80 overflow-x-auto">
          <img
            src={language === "hi" ? "/assets/guidance/evidence_extraction_pipeline_hi.svg" : "/assets/guidance/evidence_extraction_pipeline.svg"}
            alt={
              language === "hi"
                ? "निरीक्षक 5-चरणीय सांविधिक साक्ष्य निष्कर्षण पाइपलाइन वास्तुकला"
                : "Veriq 5-Stage Statutory Evidence Extraction Pipeline Architecture"
            }
            className="w-full max-w-4xl mx-auto h-auto object-contain min-w-[640px]"
          />
        </div>
      </div>
    </div>
  );
};

export default StatutoryPipelineInfographic;
