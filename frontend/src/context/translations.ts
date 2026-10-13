export interface TranslationEntry {
  en: string;
  hi: string;
}

export const DICTIONARY: Record<string, TranslationEntry> = {
  // --- Brand & Government Hierarchy ---
  "govt.india": { en: "Government of India", hi: "भारत सरकार" },
  "govt.ministry": {
    en: "Ministry of Consumer Affairs, Food & Public Distribution",
    hi: "उपभोक्ता मामले, खाद्य एवं सार्वजनिक वितरण मंत्रालय",
  },
  "govt.department": {
    en: "Department of Consumer Affairs",
    hi: "उपभोक्ता मामले विभाग",
  },
  "govt.division": {
    en: "Legal Metrology Division",
    hi: "विधिक मापविज्ञान प्रभाग",
  },
  "govt.portal": {
    en: "National Inspection Portal",
    hi: "राष्ट्रीय निरीक्षण पोर्टल",
  },
  "govt.compliance_badge": {
    en: "STATUTORY COMPLIANCE // LMO AUTHORISED",
    hi: "विधिक अनुपालन // अधिकृत LMO",
  },
  "govt.screen_reader": {
    en: "Screen Reader Access",
    hi: "स्क्रीन रीडर एक्सेस",
  },
  "govt.decrease_font": {
    en: "Decrease font size",
    hi: "फ़ॉन्ट का आकार छोटा करें",
  },
  "govt.default_font": {
    en: "Default font size",
    hi: "सामान्य फ़ॉन्ट आकार",
  },
  "govt.increase_font": {
    en: "Increase font size",
    hi: "फ़ॉन्ट का आकार बड़ा करें",
  },
  "govt.contrast": {
    en: "Contrast",
    hi: "कंट्रास्ट",
  },
  "govt.standard": {
    en: "Standard",
    hi: "सामान्य",
  },

  // --- Portal Identity ---
  "portal.title": { en: "Veriq", hi: "निरीक्षक" },
  "portal.subtitle": {
    en: "Inspection Workstation",
    hi: "निरीक्षण कार्यस्थान",
  },
  "portal.full_subtitle": {
    en: "Statutory Compliance Inspection Workstation",
    hi: "विधिक अनुपालन निरीक्षण कार्यस्थान",
  },
  "portal.officer_workstation": {
    en: "Officer Workstation",
    hi: "अधिकारी कार्यस्थान",
  },
  "portal.login": {
    en: "Log In",
    hi: "लॉग इन",
  },
  "portal.officer_login": {
    en: "Officer Log In",
    hi: "अधिकारी लॉग इन",
  },
  "portal.workstation": {
    en: "Officer Workstation",
    hi: "अधिकारी कार्यस्थान",
  },
  "portal.workstation_short": {
    en: "Workstation",
    hi: "कार्यस्थान",
  },
  "portal.logout": {
    en: "Log Out",
    hi: "लॉग आउट",
  },
  "portal.command_search": {
    en: "Quick Search Cases & Rules...",
    hi: "त्वरित खोज: मामले एवं नियम...",
  },
  "portal.command_search_short": {
    en: "Search Cases...",
    hi: "मामले खोजें...",
  },
  "portal.circle": { en: "Circle:", hi: "मंडल:" },
  "portal.role_lmo": { en: "LMO Inspector", hi: "निरीक्षक (LMO)" },
  "portal.role_controller": { en: "Controller", hi: "नियंत्रक (Controller)" },
  "portal.signout": { en: "Sign Out", hi: "लॉग आउट" },
  "login.title": {
    en: "Official Workstation Sign In",
    hi: "अधिकारी कार्यस्थान लॉगिन",
  },
  "login.fast_track": {
    en: "Instant 1-Click Evaluation Suite",
    hi: "त्वरित 1-क्लिक मूल्यांकन",
  },
  "login.gateway_nic": {
    en: "National Officer Authentication Gateway",
    hi: "राष्ट्रीय अधिकारी प्रमाणीकरण गेटवे",
  },
  "login.return_portal": {
    en: "Return to Public Portal",
    hi: "सार्वजनिक पोर्टल पर वापस जाएं",
  },

  // --- Navigation ---
  "nav.dashboard": { en: "Executive Dashboard", hi: "कार्यकारी डैशबोर्ड" },
  "nav.register": { en: "Case Registry", hi: "केस रजिस्ट्री" },
  "nav.new": { en: "New Inspection", hi: "नया निरीक्षण मामला" },
  "nav.review": { en: "Review Queue", hi: "समीक्षा कतार" },
  "nav.rules": { en: "Rules & Schedules", hi: "विधिक नियम एवं अनुसूचियां" },
  "nav.evidence": { en: "Evidence Dossier", hi: "साक्ष्य दस्तावेज़" },
  "nav.reports": { en: "Reports & Notices", hi: "रिपोर्ट एवं विधिक नोटिस" },
  "nav.settings": { en: "Station Settings", hi: "स्टेशन सेटिंग्स" },

  // --- Hero Section (Landing) ---
  "hero.top_badge": {
    en: "Government of India • Ministry of Consumer Affairs • Legal Metrology Division",
    hi: "भारत सरकार • उपभोक्ता मामले, खाद्य एवं सार्वजनिक वितरण मंत्रालय • विधिक मापविज्ञान प्रभाग",
  },
  "hero.headline_1": {
    en: "Evidence-Grade Package Compliance.",
    hi: "साक्ष्य-स्तरीय पैकेज अनुपालन।",
  },
  "hero.headline_2": {
    en: "Statutory Transparency.",
    hi: "विधिक शुचिता एवं साक्ष्य अखंडता।",
  },
  "hero.description": {
    en: "Empowering Legal Metrology Officers with automated optical quality gates, ArUco metric calibration, multilingual OCR (English + Hindi), Table-I numeral font schedule checks, and Section 63 BSA 2023 tamper-evident digital certificates.",
    hi: "विधिक मापविज्ञान (पैकेज्ड वस्तुएं) नियम, 2011, विधिक मापविज्ञान अधिनियम, 2009 तथा भारतीय साक्ष्य अधिनियम, 2023 की धारा 63 के अंतर्गत अधिकृत विधिक मापविज्ञान अधिकारियों (LMO) के लिए स्वचालित ऑप्टिकल गुणवत्ता जांच, ArUco मीट्रिक अंशांकन, बहुभाषी ओसीआर, तालिका-I फॉन्ट अनुसूची एवं डिजिटल साक्ष्य प्रमाणपत्र प्रणाली।",
  },
  "hero.cta_workstation": {
    en: "Launch Officer Workstation",
    hi: "अधिकारी कार्यस्थान प्रारंभ करें",
  },
  "hero.cta_rules": {
    en: "Statutory Rules & Table-I Schedule",
    hi: "विधिक नियम एवं तालिका-I अनुसूची",
  },
  "hero.trust_verdicts": { en: "4-State", hi: "4-स्तरीय" },
  "hero.trust_verdicts_sub": { en: "Epistemic Verdicts", hi: "न्यायनिर्णयन निष्कर्ष" },
  "hero.trust_evidence": { en: "Sec 63 BSA", hi: "धारा 63 बीएसए" },
  "hero.trust_evidence_sub": { en: "Electronic Evidence", hi: "न्यायालय-मान्य साक्ष्य" },
  "hero.trust_font": { en: "Table-I", hi: "तालिका-I" },
  "hero.trust_font_sub": { en: "Font Height (6.0 mm)", hi: "फॉन्ट ऊंचाई (6.0 मिमी)" },
  "hero.trust_offline": { en: "Mode B", hi: "मोड B" },
  "hero.trust_offline_sub": { en: "Offline Resilient", hi: "ऑफ़लाइन रेजिलिएंट" },

  // --- Dignitary Quote (NationalLeadershipBanner) ---
  "quote.pm_quote": {
    en: "India's Digital Public Infrastructure has demonstrated how technology can expand opportunity, improve governance, protect consumer trust, and deliver transparent statutory services for hundreds of millions of people.",
    hi: "भारत के डिजिटल सार्वजनिक बुनियादी ढांचे ने यह सिद्ध किया है कि प्रौद्योगिकी किस प्रकार अवसरों का विस्तार कर सकती है, शासन में सुधार ला सकती है, उपभोक्ता विश्वास को सुदृढ़ कर सकती है और करोड़ों नागरिकों तक पारदर्शी विधिक सेवाएं पहुंचा सकती है।",
  },
  "quote.pm_name": { en: "Shri Narendra Modi", hi: "श्री नरेन्द्र मोदी" },
  "quote.pm_title": {
    en: "Hon'ble Prime Minister of India",
    hi: "माननीय प्रधानमंत्री, भारत",
  },
  "quote.pm_caption": {
    en: "National Address on Digital Governance, Citizen Empowerment & Consumer Rights",
    hi: "डिजिटल सुशासन, नागरिक सशक्तिकरण एवं उपभोक्ता संरक्षण पर राष्ट्रीय उद्बोधन",
  },
  "quote.mission_title": {
    en: "Department of Consumer Affairs • Legal Metrology Division",
    hi: "उपभोक्ता मामले विभाग • विधिक मापविज्ञान प्रभाग",
  },
  "quote.mission_desc": {
    en: "Ensuring fair measure in trade, statutory clarity in packaged commodities, and tamper-evident electronic evidence under the Legal Metrology (PC) Rules, 2011 & LM Act, 2009.",
    hi: "व्यापार में निष्पक्ष माप, पैकेज्ड वस्तुओं में विधिक स्पष्टता तथा विधिक मापविज्ञान (पैकेज्ड वस्तुएं) नियम, 2011 एवं विधिक मापविज्ञान अधिनियम, 2009 के तहत छेड़छाड़-मुक्त डिजिटल साक्ष्य सुनिश्चित करना।",
  },
  "quote.badge_usp": { en: "GSR 779(E) USP Mandate", hi: "GSR 779(E) यूएसपी अधिदेश" },
  "quote.badge_bsa": { en: "Section 63 BSA 2023 Evidence", hi: "धारा 63 बीएसए 2023 साक्ष्य" },
  "quote.badge_ecom": { en: "Rule 6(10) E-Commerce", hi: "नियम 6(10) ई-कॉमर्स" },

  // --- Statutory Omnibox ---
  "omnibox.placeholder": {
    en: "Search statutory rules, Table-I font schedule, banned units, GSR notifications, or case precedents...",
    hi: "विधिक नियम, तालिका-I फॉन्ट अनुसूची, प्रतिबंधित इकाइयां, राजपत्र अधिसूचनाएं या मामले खोजें...",
  },
  "omnibox.pill_table1": {
    en: "Table-I Font Schedule (Row 5 = 6.0 mm)",
    hi: "तालिका-I फॉन्ट अनुसूची (Row 5 = 6.0 मिमी)",
  },
  "omnibox.pill_banned": {
    en: "Prohibited Units (gms, ML, gm, ltrs)",
    hi: "प्रतिबंधित इकाइयां (gms, ML, gm, ltrs)",
  },
  "omnibox.pill_usp": {
    en: "USP Math (|USP×Qty - MRP| ≤ ₹0.02)",
    hi: "यूएसपी गणित (|USP×Qty - MRP| ≤ ₹0.02)",
  },
  "omnibox.pill_ecom": {
    en: "Rule 6(10) E-Commerce",
    hi: "नियम 6(10) ई-कॉमर्स",
  },
  "omnibox.pill_sec63": {
    en: "Section 63 BSA 2023 Merkle Proof",
    hi: "धारा 63 बीएसए 2023 मर्कल प्रमाण",
  },
  "omnibox.close": { en: "Close Schedule", hi: "अनुसूची बंद करें" },
  "omnibox.view_full": {
    en: "View Full Rules & Schedules Dossier",
    hi: "संपूर्ण विधिक नियम एवं अनुसूचियां देखें",
  },

  // --- Live Inspection Telemetry Section ---
  "demo.telemetry_label": {
    en: "Live Physical Inspection Telemetry",
    hi: "सजीव भौतिक निरीक्षण टेलीमेट्री",
  },
  "demo.case_id": { en: "Case: INSP-2026-0842-01", hi: "मामला: INSP-2026-0842-01" },
  "demo.headline": {
    en: "Fortune Sunlite Refined Sunflower Oil 1L, Principal Display Panel (PDP) Adjudication",
    hi: "फॉर्च्यून सनलाइट रिफाइंड सनफ्लावर ऑयल 1L, मुख्य प्रदर्शन पैनल (PDP) न्यायनिर्णयन",
  },
  "demo.status_fail": {
    en: "FAIL, PROHIBITED STATUTORY UNIT",
    hi: "अनुत्तीर्ण, प्रतिबंधित विधिक इकाई",
  },
  "demo.inspect_canvas": {
    en: "Inspect in Canvas",
    hi: "कैनवास में निरीक्षण करें",
  },
  "demo.quality_gate": {
    en: "Automated Statutory Quality Gate & Telemetry",
    hi: "स्वचालित विधिक गुणवत्ता द्वार एवं टेलीमेट्री",
  },
  "demo.blur_pass": {
    en: "Laplacian Blur: σ²=340 [PASS]",
    hi: "लाप्लासियन ब्लर: σ²=340 [उत्तीर्ण]",
  },
  "demo.glare_pass": {
    en: "Specular Glare: 2.1% [PASS]",
    hi: "स्पेक्युलर चमक: 2.1% [उत्तीर्ण]",
  },
  "demo.numeral_val": {
    en: "Table-I Numeral: 4.8 mm",
    hi: "तालिका-I अंक: 4.8 मिमी",
  },
  "demo.sha_val": {
    en: "Sec 63 SHA-256 Verified",
    hi: "धारा 63 SHA-256 सत्यापित",
  },
  "demo.contravention_title": {
    en: "Contravention Established under Rule 5",
    hi: "नियम 5 के अंतर्गत उल्लंघन स्थापित",
  },
  "demo.contravention_desc": {
    en: "The packaging declares Net Quantity as \"1000 ML\" and \"910 gms\". Under the LMPC Rules 2011, uppercase ML and pluralized gms are strictly prohibited symbols. Standard symbols are strictly ml or mL and g.",
    hi: "पैकेजिंग पर शुद्ध मात्रा \"1000 ML\" एवं \"910 gms\" घोषित है। एलएमपीसी नियम, 2011 के तहत बड़े अक्षरों में ML तथा बहुवचन gms सख्त रूप से प्रतिबंधित हैं। मानक विधिक प्रतीक केवल ml अथवा mL और g हैं।",
  },
  "demo.gazetted_officer": {
    en: "Gazetted Officer Verification",
    hi: "राजपत्रित अधिकारी सत्यापन",
  },

  // --- 4 Steps Statutory Protocol ---
  "protocol.label": {
    en: "Statutory Inspection Protocol",
    hi: "विधिक निरीक्षण प्रोटोकॉल",
  },
  "protocol.title": {
    en: "From Physical Capture to Adjudicated Notice in 4 Steps",
    hi: "4 चरणों में भौतिक अधिग्रहण से न्यायनिर्णित नोटिस तक",
  },
  "protocol.subtitle": {
    en: "Designed for field inspectors with zero technical friction. Every automated calculation is verified against legal schedules before notice drafting.",
    hi: "क्षेत्रीय निरीक्षकों के लिए सरल व सुगम प्रणाली। नोटिस प्रारूप तैयार करने से पूर्व प्रत्येक स्वचालित गणना की विधिक अनुसूचियों के अनुसार पुष्टि की जाती है।",
  },
  "protocol.step1_title": { en: "Evidence Ingestion", hi: "साक्ष्य अधिग्रहण" },
  "protocol.step1_desc": {
    en: "Capture Principal Display Panel (PDP) with ArUco 4x4 fiducial marker. Real-time blur and glare quality gates.",
    hi: "ArUco 4x4 मार्कर के साथ मुख्य प्रदर्शन पैनल (PDP) का अधिग्रहण। वास्तविक समय ब्लर एवं चमक गुणवत्ता जांच।",
  },
  "protocol.step2_title": { en: "Multilingual OCR", hi: "बहुभाषी ओसीआर" },
  "protocol.step2_desc": {
    en: "DBNet++ detection with PP-OCRv4 English and Devanagari Hindi recognition parses all statutory declarations.",
    hi: "DBNet++ डिटेक्शन एवं PP-OCRv4 अंग्रेजी व देवनागरी हिंदी पहचान द्वारा समस्त विधिक घोषणाओं का निष्कर्षण।",
  },
  "protocol.step3_title": { en: "Rule Engine & Math", hi: "नियम इंजन एवं गणित" },
  "protocol.step3_desc": {
    en: "Automated verification against Table-I font schedule, Unit Sale Price math (|USP × Qty - MRP| ≤ ₹0.02), and banned units.",
    hi: "तालिका-I फॉन्ट अनुसूची, इकाई विक्रय मूल्य गणित (|USP × Qty - MRP| ≤ ₹0.02) और प्रतिबंधित इकाइयों की स्वचालित जांच।",
  },
  "protocol.step4_title": { en: "Officer Adjudication", hi: "अधिकारी न्यायनिर्णयन" },
  "protocol.step4_desc": {
    en: "Human Legal Metrology Officer reviews evidence in split canvas and dispatches Form-1 Notice with Section 63 BSA certificate.",
    hi: "अधिकृत विधिक मापविज्ञान अधिकारी स्प्लिट कैनवास में साक्ष्य की समीक्षा करते हैं और धारा 63 प्रमाण पत्र सहित प्रपत्र-1 नोटिस जारी करते हैं।",
  },

  // --- Executive Dashboard ---
  "dash.welcome": {
    en: "Executive Inspection Control Centre",
    hi: "कार्यकारी निरीक्षण नियंत्रण केंद्र",
  },
  "dash.subtitle": {
    en: "Real-time statutory surveillance overview for packaged commodities. Review pending sensor uncertainties, inspect physical evidence, and issue Form-1 legal notices.",
    hi: "पैकेज्ड वस्तुओं के लिए वास्तविक समय विधिक निगरानी। लंबित सेंसर अनिश्चितताओं की समीक्षा करें, भौतिक साक्ष्यों की जांच करें और प्रपत्र-1 विधिक नोटिस जारी करें।",
  },
  "dash.active_inspector": { en: "Active Inspector", hi: "सक्रिय निरीक्षक" },
  "dash.jurisdiction_circle": { en: "Jurisdiction Circle", hi: "अधिकार क्षेत्र मंडल" },
  "dash.ist_time": { en: "Live Indian Standard Time", hi: "भारतीय मानक समय (IST)" },
  "dash.system_telemetry": { en: "System Telemetry", hi: "प्रणाली टेलीमेट्री" },
  "dash.mode_a_online": { en: "Online", hi: "ऑनलाइन" },
  "dash.mode_b_resilient": { en: "Resilient", hi: "रेजिलिएंट" },

  // --- Quick Operations Launchpad ---
  "dash.quick_scan": { en: "Physical Label Scan", hi: "भौतिक लेबल स्कैन" },
  "dash.quick_scan_desc": {
    en: "ArUco fiducial & Table-I metric scale",
    hi: "ArUco संदर्भ एवं तालिका-I मीट्रिक मापन",
  },
  "dash.quick_ecom": { en: "E-Commerce Listing Audit", hi: "ई-कॉमर्स लिस्टिंग ऑडिट" },
  "dash.quick_ecom_desc": {
    en: "Rule 6(10) digital marketplace verify",
    hi: "नियम 6(10) डिजिटल मार्केटप्लेस सत्यापन",
  },
  "dash.quick_notice": { en: "Issue Form-1 Notice", hi: "प्रपत्र-1 विधिक नोटिस जारी करें" },
  "dash.quick_notice_desc": {
    en: "Sec 63 BSA signed compounding notice",
    hi: "धारा 63 बीएसए हस्ताक्षरित शमन नोटिस",
  },
  "dash.quick_offline": { en: "Offline Cache & Sync", hi: "ऑफ़लाइन कैश एवं सिंक" },
  "dash.quick_offline_desc": {
    en: "SQLite resilient local pipeline (Mode B)",
    hi: "SQLite स्थानीय पाइपलाइन (मोड B)",
  },

  // --- Dashboard Metrics ---
  "metric.total": { en: "Total Packaging Cases", hi: "कुल निरीक्षण मामले" },
  "metric.passed": { en: "Statutory Compliant", hi: "विधिक रूप से अनुपालक" },
  "metric.failed": { en: "Violations Established", hi: "स्थापित विधिक उल्लंघन" },
  "metric.review": { en: "Human Review Pending", hi: "मानव समीक्षा / फोरेंसिक लंबित" },
  "metric.rate": { en: "Statutory Compliance Rate", hi: "विधिक अनुपालन दर" },
  "metric.total_sub": { en: "Central + Local Mode B", hi: "केंद्रीय + स्थानीय मोड B" },
  "metric.passed_sub": { en: "Full statutory compliance", hi: "पूर्ण विधिक अनुपालन" },
  "metric.failed_sub": { en: "Form-1 Notice actionable", hi: "प्रपत्र-1 नोटिस योग्य" },
  "metric.review_sub": { en: "Borderline sensor uncertainty", hi: "सीमावर्ती सेंसर अनिश्चितता" },

  // --- Dashboard Case Table ---
  "table.title": { en: "Statutory Case Register", hi: "विधिक मामला पंजी" },
  "table.search_placeholder": {
    en: "Search by commodity, manufacturer, registration, brand...",
    hi: "वस्तु, निर्माता, पंजीकरण संख्या या ब्रांड से खोजें...",
  },
  "table.tab_all": { en: "All Cases", hi: "सभी मामले" },
  "table.tab_pass": { en: "Compliant", hi: "अनुपालक (उत्तीर्ण)" },
  "table.tab_fail": { en: "Violations", hi: "उल्लंघन (FAIL)" },
  "table.tab_review": { en: "Pending Adjudication", hi: "समीक्षा लंबित (REVIEW)" },
  "table.col_commodity": { en: "Commodity & Case ID", hi: "वस्तु एवं मामला आईडी" },
  "table.col_mfg": { en: "Manufacturer / Packer", hi: "निर्माता / पैकर" },
  "table.col_net_qty": { en: "Net Qty & MRP", hi: "शुद्ध मात्रा एवं मूल्य" },
  "table.col_font": { en: "Table-I Font", hi: "तालिका-I फॉन्ट" },
  "table.col_status": { en: "Status", hi: "निर्णय स्थिति" },
  "table.col_actions": { en: "Actions", hi: "कार्रवाई" },
  "table.btn_adjudicate": { en: "Adjudicate", hi: "न्यायनिर्णयन" },
  "table.btn_view": { en: "View", hi: "देखें" },
  "table.btn_report": { en: "Audit Report", hi: "ऑडिट रिपोर्ट" },
  "table.empty": { en: "No inspection cases match the filter.", hi: "चयनित फिल्टर से मेल खाने वाला कोई मामला नहीं मिला।" },

  // --- Ticker Bulletins ---
  "ticker.directives": { en: "Statutory Directives", hi: "विधिक निर्देश" },
  "ticker.view_rule": { en: "View Rule", hi: "नियम देखें" },

  // --- Actions ---
  "action.new_case": { en: "New Inspection Case", hi: "नया निरीक्षण मामला" },
  "action.full_register": { en: "Full Register", hi: "संपूर्ण पंजी" },

  // --- Extended Dashboard & Triage Localizations ---
  "dash.search_statutory": {
    en: "Quick Statutory & Precedent Lookup",
    hi: "विधिक नियम एवं मामला त्वरित खोज",
  },
  "dash.search_sub": {
    en: "Query statutory rules, Table-I font schedule, banned units, or inspection dossier",
    hi: "विधिक नियमों, तालिका-I फॉन्ट अनुसूची, प्रतिबंधित इकाइयों या निरीक्षण फाइलों की खोज करें",
  },
  "table.col_case_product": { en: "Case / Product", hi: "मामला / उत्पाद" },
  "table.col_category": { en: "Category", hi: "श्रेणी" },
  "table.col_verdict": { en: "Compliance Verdict", hi: "विधिक निर्णय स्थिति" },
  "table.col_confidence": { en: "Confidence", hi: "सटीकता / विश्वास" },
  "table.loading": { en: "Loading inspection records...", hi: "निरीक्षण रिकॉर्ड लोड हो रहे हैं..." },
  "table.recent_cases": { en: "Recent Inspection Cases", hi: "हाल के निरीक्षण मामले" },
  "table.recent_cases_sub": {
    en: "Active packaging dossiers undergoing automated checks or officer adjudication.",
    hi: "स्वचालित जांच अथवा अधिकारी न्यायनिर्णयन के अधीन सक्रिय पैकेजिंग डोजियर।",
  },
  "triage.title": {
    en: "Officer Adjudication Queue (HITL)",
    hi: "अधिकारी न्यायनिर्णयन कतार (मानव-सत्यापन)",
  },
  "triage.desc": {
    en: "Review borderline measurements and sensor uncertainty cases requiring statutory sign-off.",
    hi: "विधिक हस्ताक्षर हेतु अपेक्षित सीमावर्ती मापन एवं सेंसर अनिश्चितता मामलों की समीक्षा करें।",
  },
  "triage.empty": {
    en: "All sensor uncertainty cases adjudicated.",
    hi: "सभी सेंसर अनिश्चितता मामलों का न्यायनिर्णयन पूर्ण हो चुका है।",
  },
  "triage.inspect": { en: "Inspect Case", hi: "मामले का निरीक्षण करें" },
  "triage.sign_notice": { en: "Sign Notice", hi: "नोटिस हस्ताक्षरित करें" },
  "triage.auto_cleared": { en: "Automated Rules Cleared", hi: "स्वचालित नियम उत्तीर्ण" },
  "triage.contraventions": { en: "Contraventions Found", hi: "विधिक उल्लंघन पाए गए" },
  "triage.review_needed": { en: "Borderline / Quality Retake", hi: "सीमावर्ती / पुनः कैप्चर अपेक्षित" },
  "triage.sensor_band": {
    en: "Sensor Uncertainty Band (k=2, 95% Conf)",
    hi: "सेंसर अनिश्चितता बैंड (k=2, 95% विश्वास)",
  },
  "triage.status_verdict": { en: "4-State Verdict", hi: "4-स्तरीय निर्णय" },
  "triage.sec63_status": { en: "Sec 63 Evidence Hash", hi: "धारा 63 साक्ष्य हैश" },
  "dash.assurance_title": {
    en: "Consumer Protection & Fair Trade Assurance",
    hi: "उपभोक्ता संरक्षण एवं निष्पक्ष व्यापार आश्वासन",
  },
  "dash.assurance_desc": {
    en: "Every finding is verifiable under Section 63 BSA 2023 with cryptographic Merkle proof.",
    hi: "प्रत्येक निष्कर्ष धारा 63 बीएसए 2023 के तहत क्रिप्टोग्राफिक मर्कल प्रमाण द्वारा न्यायालय-सत्यापनीय है।",
  },
  "dash.triage_needed": { en: "Officer Triage Needed", hi: "अधिकारी सत्यापन अपेक्षित" },
  "dash.cases_count": { en: "Cases", hi: "मामले" },
  "dash.triage_desc": {
    en: "Automated rules have identified borderline measurements within sensor uncertainty limits or degraded photographs requiring human officer adjudication.",
    hi: "स्वचालित नियमों ने सेंसर अनिश्चितता सीमा के भीतर सीमावर्ती मापों या विकृत तस्वीरों की पहचान की है, जिनके लिए मानव अधिकारी द्वारा विधिक न्यायनिर्णयन आवश्यक है।",
  },
  "dash.open_review_queue": { en: "Open Review Queue", hi: "समीक्षा कतार खोलें" },
  "dash.golden_skus": { en: "Pre-loaded Golden SKUs", hi: "पूर्व-लोड किए गए स्वर्ण एसकेयू (Golden SKUs)" },
  "dash.golden_skus_desc": {
    en: "Test end-to-end statutory adjudication against pre-configured golden demonstration cases:",
    hi: "पूर्व-कॉन्फ़िगर किए गए प्रदर्शन मामलों के साथ संपूर्ण विधिक न्यायनिर्णयन का परीक्षण करें:",
  },
  "dash.sec63_title": {
    en: "Section 63 BSA 2023 Evidentiary Invariant",
    hi: "धारा 63 बीएसए 2023 साक्ष्य सुरक्षा मानक",
  },
  "dash.sec63_desc": {
    en: "Electronic evidence certificates adhere strictly to Bharatiya Sakshya Adhiniyam, 2023. Repealed Section 65B Indian Evidence Act 1872 references are strictly forbidden.",
    hi: "इलेक्ट्रॉनिक साक्ष्य प्रमाण पत्र सख्त रूप से भारतीय साक्ष्य अधिनियम, 2023 के अनुसार तैयार किए जाते हैं। पूर्ववर्ती धारा 65B का उल्लेख पूर्णतः प्रतिबंधित है।",
  },
  "action.inspect": { en: "Inspect", hi: "निरीक्षण करें" },
};

