import type { LegalDoc } from "./statutory/legalDocTypes";

/**
 * GIGW 3.0 Mandatory Policy Pages, bilingual deep content for Veriq,
 * authored in the unified LegalDoc model shared with the statutory enactment
 * and standards pages (rendered by the same dark-slate document template).
 *
 * Content follows the standard Government of India portal policy templates
 * (Terms & Conditions, Privacy Policy, Hyperlink Policy, Copyright Policy,
 * Accessibility Statement) and only cites statutes already referenced in this
 * repository: Legal Metrology Act 2009, LMPC Rules 2011, Sec 63 BSA 2023,
 * the Information Technology Act 2000 (Sec 43 & 66, as displayed on the Login
 * gateway) and the Digital Personal Data Protection Act, 2023 (Act No. 22 of
 * 2023, assent 11 August 2023).
 */

export const POLICY_DOCS: LegalDoc[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // 1. Terms & Conditions
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "terms-and-conditions",
    category: "policy",
    titleEn: "Terms & Conditions",
    titleHi: "नियम एवं शर्तें",
    shortEn: "Terms & Conditions",
    shortHi: "नियम एवं शर्तें",
    ledeEn:
      "These terms govern access to and use of Veriq, the digital compliance-verification workstation deployed for the Department of Consumer Affairs, Government of India. Access is restricted to appointed Legal Metrology Officers and departmental personnel; every action on the portal is authenticated, logged and legally attributable. By signing in you accept these conditions in full.",
    ledeHi:
      "ये नियम एवं शर्तें उपभोक्ता मामले विभाग, भारत सरकार द्वारा तैनात डिजिटल अनुपालन-सत्यापन कार्यस्थान Veriq की पहुंच एवं उपयोग को नियंत्रित करती हैं। पहुंच नियुक्त विधिक मापविज्ञान अधिकारियों एवं विभागीय कार्मिकों तक सीमित है; पोर्टल पर प्रत्येक क्रिया प्रमाणित, लॉगबद्ध एवं विधिक रूप से आरोप्य है। साइन-इन करके आप इन शर्तों को पूर्णतः स्वीकार करते हैं।",
    sourceUrl: "https://consumeraffairs.nic.in/",
    sourceLabelEn: "Department of Consumer Affairs",
    sourceLabelHi: "उपभोक्ता मामले विभाग",
    meta: [
      {
        labelEn: "Instrument Type",
        labelHi: "साधन प्रकार",
        valueEn: "Mandatory portal usage terms",
        valueHi: "अनिवार्य पोर्टल उपयोग शर्तें",
      },
      {
        labelEn: "Governing Law",
        labelHi: "शासक विधि",
        valueEn: "Laws of India, IT Act 2000, Legal Metrology Act 2009 & LMPC Rules 2011",
        valueHi: "भारत के विधियां, आईटी अधिनियम 2000, विधिक मापविज्ञान अधिनियम 2009 एवं एलएमपीसी नियम 2011",
      },
      {
        labelEn: "Authorised Users",
        labelHi: "अधिकृत उपयोगकर्ता",
        valueEn: "LMOs, Controllers, departmental admins & auditors only",
        valueHi: "केवल LMO, नियंत्रक, विभागीय प्रशासक एवं ऑडिटर",
      },
      {
        labelEn: "Enforcement Basis",
        labelHi: "प्रवर्तन आधार",
        valueEn: "IT Act 2000, Sections 43 & 66",
        valueHi: "आईटी अधिनियम 2000, धारा 43 एवं 66",
      },
    ],
    related: ["privacy-policy", "accessibility-statement", "hyperlink-policy", "copyright-policy"],
    sections: [
      {
        id: "authorised-use",
        headingEn: "Authorised Use & Role Restriction",
        headingHi: "अधिकृत उपयोग एवं भूमिका प्रतिबंध",
        blocks: [
          {
            kind: "p",
            en: "This workstation is restricted to gazetted Legal Metrology Officers (LMOs), Controllers, departmental administrators and authorised auditors. Access is granted exclusively through role-based credentials issued by the Department, and every session is bound to the officer's identity, jurisdictional circle and role. Use of the portal for any purpose outside statutory inspection, verification and adjudication workflows is prohibited.",
            hi: "यह कार्यस्थान गजटेड विधिक मापविज्ञान अधिकारियों (LMO), नियंत्रकों, विभागीय प्रशासकों एवं अधिकृत ऑडिटरों तक सीमित है। पहुंच विभाग द्वारा जारी भूमिका-आधारित क्रेडेंशियल से विशेष रूप से दी जाती है, तथा प्रत्येक सत्र अधिकारी की पहचान, अधिकार-क्षेत्र मंडल एवं भूमिका से बद्ध होता है। सांवधिक निरीक्षण, सत्यापन एवं न्यायिक निर्णय कार्यप्रवाह के बाहर किसी भी उद्देश्य हेतु पोर्टल का उपयोग निषिद्ध है।",
          },
          {
            kind: "list",
            itemsEn: [
              "Credentials are personal and non-transferable; sharing, lending or delegating credentials is a security violation.",
              "Officers act only within their assigned jurisdictional circle; cross-circle actions are rejected by the platform.",
              "Any suspected unauthorised access must be reported to the Controller immediately.",
            ],
            itemsHi: [
              "क्रेडेंशियल व्यक्तिगत एवं अंतरण-अयोग्य हैं; क्रेडेंशियल साझा करना, उधार देना या प्रत्यायोजित करना सुरक्षा उल्लंघन है।",
              "अधिकारी केवल अपने नियत अधिकार-क्षेत्र मंडल के भीतर कार्य करें; मंडल-पार क्रियाएं प्लेटफॉर्म द्वारा अस्वीकृत होती हैं।",
              "किसी भी संदिग्ध अनधिकृत पहुंच की सूचना तुरंत नियंत्रक को दी जानी चाहिए।",
            ],
          },
        ],
      },
      {
        id: "it-act-warnings",
        headingEn: "Unauthorised Access, IT Act 2000, Sections 43 & 66",
        headingHi: "अनधिकृत पहुंच, आईटी अधिनियम 2000, धारा 43 एवं 66",
        blocks: [
          {
            kind: "p",
            en: "Accessing this portal without authorisation, or exceeding authorised access, attracts civil and criminal liability under the Information Technology Act, 2000. Under Section 43, any person who, without permission of the owner, secures access, downloads, copies or extracts data, introduces viruses, damages or disrupts a computer system, denies access, or fraudulently charges services, is liable to pay damages by way of compensation, up to the adjudicated amount (up to ₹1 crore under the adjudication framework). Where any such act is done dishonestly or fraudulently, Section 66 additionally provides punishment with imprisonment which may extend to three years, or fine which may extend to five lakh rupees, or both.",
            hi: "इस पोर्टल तक अनधिकृत पहुंच, या अधिकृत पहुंच की सीमा पार करना, सूचना प्रौद्योगिकी अधिनियम, 2000 के अंतर्गत दीवानी एवं दांडिक दायित्व उत्पन्न करता है। धारा 43 के अंतर्गत, कोई भी व्यक्ति जो, स्वामी की अनुमति के बिना, पहुंच प्राप्त करे, डेटा डाउनलोड, प्रतिलिपि या निष्कर्षण करे, वायरस प्रविष्ट करे, कंप्यूटर तंत्र को क्षति या व्यवधान पहुंचाए, पहुंच अस्वीकृत करे, या धोखे से सेवा शुल्क लगवाए, वह न्यायनिर्णीत राशि (अधिनिर्णय ढांचे के अंतर्गत ₹1 करोड़ तक) तक क्षतिपूर्ति के रूप में दामित है। जहां ऐसा कृत्य किसी को धोखा देकर या धूर्तता से किया जाए, वहां धारा 66 अतिरिक्त रूप से तीन वर्ष तक विस्तृत कारावास, या पांच लाख रुपये तक विस्तृत जुर्माना, या दोनों का दंड प्रावधान करती है।",
          },
          {
            kind: "note",
            tone: "warning",
            en: "Non-repudiation: all portal activity, logins, evidence captures, adjudications, report exports and administrative changes, is recorded with device attestation, timestamps and cryptographic hashes under Section 63 of the Bharatiya Sakshya Adhiniyam, 2023. A user cannot credibly deny actions performed with their credentials.",
            hi: "अननिषेध्यता (Non-repudiation): पोर्टल की समस्त गतिविधि, लॉगिन, साक्ष्य कैप्चर, न्यायिक निर्णय, रिपोर्ट निर्यात एवं प्रशासनिक परिवर्तन, डिवाइस प्रमाणीकरण, टाइमस्टैम्प एवं क्रिप्टोग्राफिक हैश सहित भारतीय साक्ष्य अधिनियम, 2023 की धारा 63 के अंतर्गत अभिलिखित होती है। अपने क्रेडेंशियल से किए गए कृत्यों से उपयोगकर्ता विश्वसनीय रूप से इनकार नहीं कर सकता।",
          },
        ],
      },
      {
        id: "hitl",
        headingEn: "Augmented Assistant, Human-in-the-Loop",
        headingHi: "संवर्धित सहायक, मानव-सहित निर्णय",
        blocks: [
          {
            kind: "p",
            en: "Veriq is strictly an augmented diagnostic assistant. All automated findings are recommendations presented to a qualified Legal Metrology Officer, who holds sole statutory authority over adjudication, statutory notices and compounding decisions under the Legal Metrology Act, 2009 and the LMPC Rules, 2011. The system never issues notices, fines or compounding orders autonomously.",
            hi: "Veriq कठोरतः एक संवर्धित नैदानिक सहायक है। सभी स्वचालित निष्कर्ष योग्य विधिक मापविज्ञान अधिकारी को प्रस्तुत सिफारिशें हैं, जिनके पास विधिक मापविज्ञान अधिनियम, 2009 एवं LMPC नियम, 2011 के अंतर्गत न्यायिक निर्णय, सांवधिक नोटिस एवं समझौता-निर्णयों पर अकेला वैधानिक अधिकार है। प्रणाली कभी स्वतः नोटिस, जुर्माना या समझौता-आदेश जारी नहीं करती।",
          },
        ],
      },
      {
        id: "demo-data",
        headingEn: "Demonstration & Synthetic Data",
        headingHi: "प्रदर्शन एवं सिंथेटिक डेटा",
        blocks: [
          {
            kind: "p",
            en: "Scenarios labelled DEMO FIXTURE are pre-certified synthetic demonstrations, and records labelled SYNTHETIC are fabricated test data. They exist for training, evaluation and presentation continuity only. They must never be represented as real enforcement records, seized-goods evidence or statistical enforcement outcomes, and they are cryptographically separated from genuine case dossiers in the evidence ledger.",
            hi: "DEMO FIXTURE लेबल वाले परिदृश्य पूर्व-प्रमाणित सिंथेटिक प्रदर्शन हैं, तथा SYNTHETIC लेबल वाले अभिलेख निर्मित परीक्षण डेटा हैं। ये केवल प्रशिक्षण, मूल्यांकन एवं प्रस्तुति निरंतरता हेतु हैं। इन्हें कभी भी वास्तविक प्रवर्तन अभिलेख, जब्त-वस्तु साक्ष्य या सांख्यिकीय प्रवर्तन परिणामों के रूप में प्रस्तुत न करें, तथा ये साक्ष्य लेजर में वास्तविक मामला डोजियर से क्रिप्टोग्राफिक रूप से पृथक हैं।",
          },
        ],
      },
      {
        id: "availability",
        headingEn: "Availability, Local Mode & Liability",
        headingHi: "उपलब्धता, स्थानीय मोड एवं दायित्व",
        blocks: [
          {
            kind: "p",
            en: "The Department strives to keep this portal available at all times, including a local resilient mode (Mode B, localhost:8000) that lets officers conduct inspections with local storage during connectivity blackouts. However, service continuity is not warranted, and the portal is provided on an as-available basis for statutory convenience. These terms are governed by the laws of India, and disputes fall under the jurisdiction of the competent courts at New Delhi.",
            hi: "विभाग इस पोर्टल को सदैव उपलब्ध रखने का प्रयास करता है, जिसमें स्थानीय लचीला मोड (मोड बी, localhost:8000) शामिल है जो कनेक्टिविटी कालेप के दौरान अधिकारियों को स्थानीय भंडारण सहित निरीक्षण करने देता है। परंतु सेवा निरंतरता की गारंटी नहीं है, और पोर्टल सांवधिक सुविधा हेतु यथा-उपलब्ध आधार पर दिया गया है। ये नियम भारत के विधियों द्वारा शासित हैं तथा विवाद नई दिल्ली के सक्षम न्यायालयों के अधिकार-क्षेत्र में आते हैं।",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 2. Privacy Policy
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "privacy-policy",
    category: "policy",
    titleEn: "Privacy Policy",
    titleHi: "गोपनीयता नीति",
    shortEn: "Privacy Policy",
    shortHi: "गोपनीयता नीति",
    ledeEn:
      "This policy describes how Veriq handles officer and inspection data, aligned with the Digital Personal Data Protection Act, 2023. The portal collects the minimum information required to perform statutory verification workflows, processes it for lawful enforcement purposes only, and never sells or shares it with commercial third parties.",
    ledeHi:
      "यह नीति बताती है कि Veriq अधिकारी एवं निरीक्षण डेटा को कैसे संभालता है, जो डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम, 2023 के अनुरूप है। पोर्टल सांवधिक सत्यापन कार्यप्रवाह हेतु आवश्यक न्यूनतम जानकारी एकत्र करता है, उसे केवल विधिक प्रवर्तन उद्देश्यों हेतु संसाधित करता है, तथा कभी भी व्यावसायिक तृतीय-पक्षों को बेचता या साझा नहीं करता।",
    sourceUrl: "https://www.meity.gov.in/",
    sourceLabelEn: "MeitY, DPDP Act 2023",
    sourceLabelHi: "MeitY, DPDP अधिनियम 2023",
    meta: [
      {
        labelEn: "Statutory Anchor",
        labelHi: "सांवधिक आधार",
        valueEn: "Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023)",
        valueHi: "डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम, 2023 (अधिनियम संख्या 22 वर्ष 2023)",
      },
      {
        labelEn: "Data Fiduciary",
        labelHi: "डेटा फिड्यूशियरी",
        valueEn: "Department of Consumer Affairs, Government of India",
        valueHi: "उपभोक्ता मामले विभाग, भारत सरकार",
      },
      {
        labelEn: "Data Principals",
        labelHi: "डेटा प्रिंसिपल",
        valueEn: "Officers, administrators & auditors using this portal",
        valueHi: "इस पोर्टल का उपयोग करने वाले अधिकारी, प्रशासक एवं ऑडिटर",
      },
      {
        labelEn: "Trackers",
        labelHi: "ट्रैकर",
        valueEn: "Zero third-party advertising or analytics trackers",
        valueHi: "शून्य तृतीय-पक्ष विज्ञापन या एनालिटिक्स ट्रैकर",
      },
    ],
    related: ["terms-and-conditions", "accessibility-statement", "section-63-bsa-2023", "hyperlink-policy"],
    sections: [
      {
        id: "dpdp-alignment",
        headingEn: "DPDP Act 2023 Alignment",
        headingHi: "DPDP अधिनियम 2023 संरेखण",
        blocks: [
          {
            kind: "p",
            en: "The Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023) governs the processing of digital personal data in India. Under this policy, the Department of Consumer Affairs acts as the Data Fiduciary and portal users (officers, administrators, auditors) are Data Principals. Processing of personal data on this portal rests on the lawful-basis of performing a statutory function and the officer's consent at credential issuance, and is restricted to the purposes stated here.",
            hi: "डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम, 2023 (अधिनियम संख्या 22 वर्ष 2023) भारत में डिजिटल व्यक्तिगत डेटा के संसाधन को विनियमित करता है। इस नीति के अंतर्गत उपभोक्ता मामले विभाग डेटा फिड्यूशियरी के रूप में तथा पोर्टल उपयोगकर्ता (अधिकारी, प्रशासक, ऑडिटर) डेटा प्रिंसिपल के रूप में हैं। इस पोर्टल पर व्यक्तिगत डेटा का संसाधन सांवधिक कार्य-निष्पादन के विधिक आधार पर तथा क्रेडेंशियल जारी होते समय अधिकारी की सहमति पर टिका है, और यह यहां वर्णित उद्देश्यों तक सीमित है।",
          },
          {
            kind: "list",
            itemsEn: [
              "Purpose limitation: data is processed only for authentication, statutory inspection workflows, evidence integrity and audit.",
              "Data minimisation: only fields required by the enforcement workflow are collected, no demographic profiling, no commercial analytics.",
              "Security safeguards: role-based access, encrypted transport, hashed evidence and append-only audit trails.",
            ],
            itemsHi: [
              "उद्देश्य सीमा: डेटा केवल प्रमाणीकरण, सांवधिक निरीक्षण कार्यप्रवाह, साक्ष्य अखंडता एवं ऑडिट हेतु संसाधित होता है।",
              "डेटा न्यूनीकरण: केवल प्रवर्तन कार्यप्रवाह द्वारा आवश्यक क्षेत्र एकत्र होते हैं, कोई जनसांख्यिकीय प्रोफ़ाइलिंग नहीं, कोई व्यावसायिक एनालिटिक्स नहीं।",
              "सुरक्षा सुरक्षा-उपाय: भूमिका-आधारित पहुंच, एन्क्रिप्टेड परिवहन, हैशबद्ध साक्ष्य एवं केवल-संलग्न ऑडिट ट्रेल।",
            ],
          },
        ],
      },
      {
        id: "collected",
        headingEn: "Information Collected",
        headingHi: "एकत्रित जानकारी",
        blocks: [
          {
            kind: "list",
            itemsEn: [
              "Officer logs: name, badge number, role, jurisdictional circle, session timestamps and action history.",
              "Audit trails: every adjudication, report export and administrative change, anchored into the SHA-256 Merkle chain.",
              "Device telemetry: browser/user-agent headers, hardware MAC / serial and OS identifiers captured for evidence attestation, local monotonic timestamps, and optional GNSS coordinates (nullable, with jurisdictional circle fallback).",
              "Case dossiers: packaged-commodity photographs, calibration measurements, OCR tokens, rule-evaluation results and drafted notices.",
            ],
            itemsHi: [
              "अधिकारी लॉग: नाम, बैज संख्या, भूमिका, अधिकार-क्षेत्र मंडल, सत्र टाइमस्टैम्प एवं क्रिया-इतिहास।",
              "ऑडिट ट्रेल: प्रत्येक न्यायिक निर्णय, रिपोर्ट निर्यात एवं प्रशासनिक परिवर्तन, SHA-256 मर्कल श्रृंखला में अंकित।",
              "डिवाइस टेलीमेट्री: साक्ष्य प्रमाणीकरण हेतु कैप्चर ब्राउज़र/यूज़र-एजेंट हेडर, हार्डवेयर MAC / सीरियल एवं OS पहचानकर्ता, स्थानीय मोनोटोनिक टाइमस्टैम्प, तथा वैकल्पिक GNSS निर्देशांक (nullable, अधिकार-क्षेत्र मंडल फॉलबैक सहित)।",
              "मामला डोजियर: पैकेज्ड वस्तु फोटोग्राफ, अंशांकन माप, OCR टोकन, नियम-मूल्यांकन परिणाम एवं ड्राफ्ट नोटिस।",
            ],
          },
          {
            kind: "note",
            tone: "info",
            en: "Device telemetry exists for evidentiary attestation only (Section 63 BSA 2023 certificate fields), it is never used for behavioural tracking or advertising.",
            hi: "डिवाइस टेलीमेट्री केवल साक्ष्यात्मक प्रमाणीकरण हेतु है (धारा 63 बीएसए 2023 प्रमाणपत्र क्षेत्र), इसका उपयोग कभी व्यवहार-ट्रैकिंग या विज्ञापन हेतु नहीं होता।",
          },
        ],
      },
      {
        id: "storage",
        headingEn: "Storage, Retention & Offline Mode",
        headingHi: "भंडारण, प्रतिधारण एवं ऑफ़लाइन मोड",
        blocks: [
          {
            kind: "p",
            en: "Session tokens, language and accessibility preferences, and offline draft cases are stored in your browser's local storage so the workstation functions during connectivity blackouts (Mode B, including local SQLite storage on the field device). This data never leaves your device unless synced to the central datastore. Inspection records and evidence are retained by the Department as statutory enforcement records under the applicable retention rules; evidence integrity is anchored into the Section 63 BSA 2023 hash ledger for the life of the record.",
            hi: "सत्र टोकन, भाषा एवं सुगम्यता वरीयताएं, तथा ऑफ़लाइन ड्राफ्ट मामले आपके ब्राउज़र के स्थानीय भंडारण में रखे जाते हैं ताकि कनेक्टिविटी कालेप (मोड बी, फील्ड डिवाइस पर स्थानीय SQLite भंडारण सहित) के दौरान कार्यस्थान कार्य कर सके। केंद्रीय डेटास्टोर में सिंक होने तक यह डेटा आपके डिवाइस से बाहर नहीं जाता। निरीक्षण अभिलेख एवं साक्ष्य लागू प्रतिधारण नियमों के अंतर्गत विभाग द्वारा सांवधिक प्रवर्तन अभिलेखों के रूप में सुरक्षित रखे जाते हैं; अभिलेख-जीवन भर धारा 63 बीएसए 2023 हैश लेजर में साक्ष्य अखंडता अंकित रहती है।",
          },
        ],
      },
      {
        id: "rights",
        headingEn: "Data Principal Rights & Non-Disclosure",
        headingHi: "डेटा प्रिंसिपल अधिकार एवं गैर-प्रकटीकरण",
        blocks: [
          {
            kind: "list",
            itemsEn: [
              "Access & correction: officers may request access to, and correction of, their personal records through their jurisdictional Controller.",
              "Grievance redressal: grievances are routed to the designated Grievance Officer of the Department of Consumer Affairs and, where unresolved, to the Data Protection Board of India as constituted under the DPDP Act 2023.",
              "Non-disclosure: personal data and case dossiers are disclosed only to authorised departmental roles, to courts or authorities acting under statutory powers, and never to commercial entities.",
              "Breach handling: suspected personal-data breaches are logged, investigated and reported in accordance with the Department's obligations under the DPDP Act 2023.",
            ],
            itemsHi: [
              "पहुंच एवं सुधार: अधिकारी अपने अधिकार-क्षेत्र के नियंत्रक के माध्यम से अपने व्यक्तिगत अभिलेखों तक पहुंच एवं सुधार का अनुरोध कर सकते हैं।",
              "शिकायत निवारण: शिकायतें उपभोक्ता मामले विभाग के नियत शिकायत अधिकारी को, तथा अनुत्तरित रहने पर DPDP अधिनियम 2023 के अंतर्गत गठित डेटा संरक्षण बोर्ड, भारत को भेजी जाती हैं।",
              "गैर-प्रकटीकरण: व्यक्तिगत डेटा एवं मामला डोजियर केवल अधिकृत विभागीय भूमिकाओं को, सांवधिक शक्तियों के अंतर्गत कार्य करने वाली न्यायालयों या प्राधिकरणों को प्रकट होते हैं, कभी व्यावसायिक इकाइयों को नहीं।",
              "उल्लंघन प्रबंधन: संदिग्ध व्यक्तिगत-डेटा उल्लंघन DPDP अधिनियम 2023 के अंतर्गत विभाग के दायित्वों के अनुरूप लॉगबद्ध, जांचे एवं रिपोर्ट किए जाते हैं।",
            ],
          },
        ],
      },
      {
        id: "trackers",
        headingEn: "No Third-Party Trackers",
        headingHi: "कोई तृतीय-पक्ष ट्रैकर नहीं",
        blocks: [
          {
            kind: "p",
            en: "This portal does not use advertising cookies or third-party analytics trackers. External links (e-Maap, DoCA, e-Gazette, National Consumer Helpline) are provided for reference and are governed by their respective organisations' policies, see the Hyperlink Policy for the outbound advisory.",
            hi: "यह पोर्टल विज्ञापन कुकीज़ या तृतीय-पक्ष एनालिटिक्स ट्रैकर का उपयोग नहीं करता। बाहरी लिंक (ई-माप, DoCA, ई-राजपत्र, राष्ट्रीय उपभोक्ता हेल्पलाइन) केवल संदर्भ हेतु हैं और उन पर संबंधित संगठनों की नीतियां लागू होती हैं, बाह्य परामर्श हेतु हाइपरलिंक नीति देखें।",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 3. Hyperlink Policy
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "hyperlink-policy",
    category: "policy",
    titleEn: "Hyperlink Policy",
    titleHi: "हाइपरलिंक नीति",
    shortEn: "Hyperlink Policy",
    shortHi: "हाइपरलिंक नीति",
    ledeEn:
      "Links from this portal to external systems, NIC services, the Department of Consumer Affairs, the e-Gazette and allied government portals, follow the Government of India hyperlink guidelines. This page states the criteria for outbound links, the advisory shown when you leave the portal, and the conditions under which other sites may link to Veriq.",
    ledeHi:
      "इस पोर्टल से बाहरी तंत्रों, NIC सेवाएं, उपभोक्ता मामले विभाग, ई-राजपत्र एवं संबद्ध सरकारी पोर्टल, के लिंक भारत सरकार के हाइपरलिंक दिशानिर्देशों के अनुरूप हैं। यह पृष्ठ बाह्य लिंकों के मानदंड, पोर्टल छोड़ते समय दिखाया जाने वाला परामर्श, तथा वे शर्तें बताता है जिनके अंतर्गत अन्य साइटें Veriq से जोड़ सकती हैं।",
    sourceUrl: "https://india.gov.in/",
    sourceLabelEn: "National Portal of India, Linking Guidelines",
    sourceLabelHi: "भारत का राष्ट्रीय पोर्टल, लिंकिंग दिशानिर्देश",
    meta: [
      {
        labelEn: "Policy Basis",
        labelHi: "नीति आधार",
        valueEn: "Government of India web-content guidelines (GIGW 3.0 aligned)",
        valueHi: "भारत सरकार वेब-सामग्री दिशानिर्देश (GIGW 3.0 अनुरूप)",
      },
      {
        labelEn: "Outbound Links",
        labelHi: "बाह्य लिंक",
        valueEn: "New tab, rel=\"noopener noreferrer\", external-link icon",
        valueHi: "नया टैब, rel=\"noopener noreferrer\", बाहरी-लिंक आइकन",
      },
      {
        labelEn: "Outbound Criteria",
        labelHi: "बाह्य मानदंड",
        valueEn: "Official government & statutory portals only",
        valueHi: "केवल आधिकारिक सरकारी एवं वैधानिक पोर्टल",
      },
      {
        labelEn: "Inbound Links",
        labelHi: "आगामी लिंक",
        valueEn: "Free for government bodies; permission route for others",
        valueHi: "सरकारी निकायों हेतु निःशुल्क; अन्य हेतु अनुमति मार्ग",
      },
    ],
    related: ["privacy-policy", "gigw-3-0", "terms-and-conditions", "copyright-policy"],
    sections: [
      {
        id: "outbound",
        headingEn: "Outbound Links, Criteria & Advisory",
        headingHi: "बाह्य लिंक, मानदंड एवं परामर्श",
        blocks: [
          {
            kind: "p",
            en: "This portal links only to official government or statutory systems: e-Maap (the National Legal Metrology Portal), the Department of Consumer Affairs, the e-Gazette of India, the National Consumer Helpline (1915) and the National Portal of India (india.gov.in). Each outbound link opens in a new browser tab, carries rel=\"noopener noreferrer\" for security, and displays an external-link icon so users always know when they are leaving a Government of India platform.",
            hi: "यह पोर्टल केवल आधिकारिक सरकारी या वैधानिक तंत्रों से जोड़ता है: ई-माप (राष्ट्रीय विधिक मापविज्ञान पोर्टल), उपभोक्ता मामले विभाग, भारत का ई-राजपत्र, राष्ट्रीय उपभोक्ता हेल्पलाइन (1915) एवं भारत का राष्ट्रीय पोर्टल (india.gov.in)। प्रत्येक बाह्य लिंक नए ब्राउज़र टैब में खुलता है, सुरक्षा हेतु rel=\"noopener noreferrer\" धारण करता है, तथा बाहरी-लिंक आइकन दिखाता है ताकि उपयोगकर्ता सदैव जाने कि वे भारत सरकार का प्लेटफॉर्म छोड़ रहे हैं।",
          },
          {
            kind: "list",
            itemsEn: [
              "Outbound redirect advisory: when a visitor leaves this portal via an external link, the Department of Consumer Affairs is not responsible for the content, availability, accuracy or privacy practices of that destination.",
              "A hyperlink does not constitute endorsement of the linked site, its organisation or its content.",
              "External portals are referenced for statutory convenience (gazette lookup, registration, consumer grievances), never for advertising or commercial referral.",
              "Outbound links are reviewed periodically; broken or defunct government links are repaired or removed (GIGW broken-link hygiene).",
            ],
            itemsHi: [
              "बाह्य रीडायरेक्ट परामर्श: जब कोई आगंतुक बाह्य लिंक से इस पोर्टल छोड़ता है, तो उस गंतव्य की सामग्री, उपलब्धता, शुद्धता या गोपनीयता प्रथाओं हेतु उपभोक्ता मामले विभाग उत्तरदायी नहीं है।",
              "कोई हाइपरलिंक लिंक की गई साइट, उसके संगठन या उसकी सामग्री का समर्थन नहीं दर्शाता।",
              "बाह्य पोर्टल सांवधिक सुविधा (राजपत्र खोज, पंजीकरण, उपभोक्ता शिकायतें) हेतु संदर्भित हैं, कभी विज्ञापन या व्यावसायिक रेफ़रल हेतु नहीं।",
              "बाह्य लिंकों की आवधिक समीक्षा होती है; टूटे या निष्क्रिय सरकारी लिंक मरम्मत या हटाए जाते हैं (GIGW टूटे-लिंक स्वच्छता)।",
            ],
          },
        ],
      },
      {
        id: "inbound",
        headingEn: "Linking to This Portal",
        headingHi: "इस पोर्टल से लिंक करना",
        blocks: [
          {
            kind: "p",
            en: "Government departments, statutory bodies and courts may link directly to pages on this portal, including the statutory document pages, without prior permission. Other organisations, academic institutions and commercial entities must route linking requests through the Department of Consumer Affairs, and such links must not imply partnership, endorsement or affiliation with the Department. Framing this portal inside another site's chrome, or presenting its content as another service's own, is not permitted.",
            hi: "सरकारी विभाग, वैधानिक निकाय एवं न्यायालय बिना पूर्व अनुमति इस पोर्टल के पृष्ठों, सांवधिक दस्तावेज़ पृष्ठों सहित, से सीधे जोड़ सकते हैं। अन्य संगठनों, शैक्षणिक संस्थाओं एवं व्यावसायिक इकाइयों को लिंकिंग अनुरोध उपभोक्ता मामले विभाग से होकर जाना चाहिए, तथा ऐसे लिंक विभाग के साथ साझेदारी, समर्थन या संबद्धता का आभास नहीं देने चाहिए। इस पोर्टल को दूसरी साइट के फ्रेम में रखना, या उसकी सामग्री किसी अन्य सेवा की अपनी दिखाना, अनुमत नहीं है।",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 4. Copyright Policy
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "copyright-policy",
    category: "policy",
    titleEn: "Copyright Policy",
    titleHi: "कॉपीराइट नीति",
    shortEn: "Copyright Policy",
    shortHi: "कॉपीराइट नीति",
    ledeEn:
      "Material featured on this portal, software algorithms, interface design, inspection workflows, statutory schedules, report formats and certificates, is the property of the Department of Consumer Affairs, Government of India. This page distinguishes what may be freely reproduced for official proceedings from what remains a proprietary enforcement tool.",
    ledeHi:
      "इस पोर्टल पर प्रस्तुत सामग्री, सॉफ्टवेयर एल्गोरिदम, इंटरफ़ेस डिज़ाइन, निरीक्षण कार्यप्रवाह, सांवधिक अनुसूचियां, रिपोर्ट प्रारूप एवं प्रमाणपत्र, उपभोक्ता मामले विभाग, भारत सरकार की संपत्ति है। यह पृष्ठ पृथक्करित करता है कि आधिकारिक कार्यवाही हेतु क्या निःशुल्क पुनःप्रस्तुत किया जा सकता है और क्या प्रोप्राइटरी प्रवर्तन उपकरण बना रहेगा।",
    sourceUrl: "https://consumeraffairs.nic.in/",
    sourceLabelEn: "Department of Consumer Affairs",
    sourceLabelHi: "उपभोक्ता मामले विभाग",
    meta: [
      {
        labelEn: "Rights Holder",
        labelHi: "अधिकार धारक",
        valueEn: "Department of Consumer Affairs, Government of India",
        valueHi: "उपभोक्ता मामले विभाग, भारत सरकार",
      },
      {
        labelEn: "Open Components",
        labelHi: "ओपन घटक",
        valueEn: "Permissive licences only, Apache-2.0, MIT, BSD-3-Clause",
        valueHi: "केवल अनुमतिप्रद लाइसेंस, Apache-2.0, MIT, BSD-3-Clause",
      },
      {
        labelEn: "Prohibited Licences",
        labelHi: "निषिद्ध लाइसेंस",
        valueEn: "Zero AGPL-3.0 / copyleft dependencies (CI enforced)",
        valueHi: "शून्य AGPL-3.0 / कॉपीलेफ्ट निर्भरताएं (CI प्रवर्तित)",
      },
      {
        labelEn: "Open Data",
        labelHi: "खुला डेटा",
        valueEn: "Public notices & statutory texts follow Govt open-data norms",
        valueHi: "सार्वजनिक सूचनाएं एवं सांवधिक पाठ सरकारी खुले-डेटा मानदंडों के अनुसार",
      },
    ],
    related: ["terms-and-conditions", "hyperlink-policy", "gigw-3-0", "privacy-policy"],
    sections: [
      {
        id: "ownership",
        headingEn: "Ownership of the Platform",
        headingHi: "प्लेटफॉर्म का स्वामित्व",
        blocks: [
          {
            kind: "p",
            en: "The design, source code, computer-vision and rule-engine algorithms, UI/UX, inspection workflows, report templates, Section 63 BSA 2023 certificate formats and statutory schedules presented in this workstation are owned by the Department of Consumer Affairs, Government of India, and developed for the Department's statutory enforcement functions. The Veriq name and identity are likewise reserved for official Departmental use.",
            hi: "इस कार्यस्थान में प्रस्तुत डिज़ाइन, सोर्स कोड, कंप्यूटर-विज़न एवं नियम-इंजन एल्गोरिदम, UI/UX, निरीक्षण कार्यप्रवाह, रिपोर्ट टेम्पलेट, धारा 63 बीएसए 2023 प्रमाणपत्र प्रारूप एवं सांवधिक अनुसूचियां उपभोक्ता मामले विभाग, भारत सरकार की संपत्ति हैं तथा विभाग के सांवधिक प्रवर्तन कार्यों हेतु विकसित हैं। Veriq नाम एवं पहचान समान रूप से आधिकारिक विभागीय उपयोग हेतु आरक्षित हैं।",
          },
        ],
      },
      {
        id: "permitted",
        headingEn: "Permitted Reproduction, Public Record vs Proprietary Tool",
        headingHi: "अनुमत पुनःप्रस्तुति, सार्वजनिक अभिलेख बनाम प्रोप्राइटरी उपकरण",
        blocks: [
          {
            kind: "list",
            itemsEn: [
              "Freely reproducible for official use: inspection dossiers, Form-1 notices, Section 63 BSA 2023 certificates and statutory schedules generated through this portal may be reproduced in judicial or departmental proceedings without fee, provided the origin is acknowledged and the material is not altered.",
              "Public notices and statutory texts referenced from the e-Gazette follow Government of India open-data and open-government norms; users should consult the issuing authority's own terms for republication.",
              "Proprietary (permission required): the platform's source code, algorithms, training fixtures, UI design system and internal workflows may not be copied, re-hosted, reverse-engineered or embedded in other services without prior written permission from the Department.",
              "Commercial reproduction of any platform material, or use outside statutory enforcement, requires prior written permission from the Department of Consumer Affairs, Government of India.",
            ],
            itemsHi: [
              "आधिकारिक उपयोग हेतु निःशुल्क पुनःप्रस्तुति-योग्य: इस पोर्टल से जनरेटेड निरीक्षण डोजियर, प्रपत्र-1 नोटिस, धारा 63 बीएसए 2023 प्रमाणपत्र एवं सांवधिक अनुसूचियां न्यायिक या विभागीय कार्यवाही में बिना शुल्क पुनःप्रस्तुत की जा सकती हैं, बशर्ते मूल स्रोत का उल्लेख हो और सामग्री अपरिवर्तित हो।",
              "ई-राजपत्र से संदर्भित सार्वजनिक सूचनाएं एवं सांवधिक पाठ भारत सरकार के खुले-डेटा एवं खुले-शासन मानदंडों के अधीन हैं; पुनःप्रकाशन हेतु जारीकर्ता प्राधिकरण की अपनी शर्तें देखें।",
              "प्रोप्राइटरी (अनुमति आवश्यक): प्लेटफॉर्म का सोर्स कोड, एल्गोरिदम, प्रशिक्षण फ़िक्स्चर, UI डिज़ाइन तंत्र एवं आंतरिक कार्यप्रवाह विभाग की पूर्व लिखित अनुमति के बिना प्रतिलिपित, पुनः-होस्ट, रिवर्स-इंजीनियर या अन्य सेवाओं में अंतर्भूत नहीं किए जा सकते।",
              "किसी भी प्लेटफॉर्म सामग्री की व्यावसायिक पुनःप्रस्तुति, या सांवधिक प्रवर्तन से बाहर उपयोग, हेतु उपभोक्ता मामले विभाग, भारत सरकार की पूर्व लिखित अनुमति आवश्यक है।",
            ],
          },
        ],
      },
      {
        id: "third-party",
        headingEn: "Third-Party Open-Source Components",
        headingHi: "तृतीय-पक्ष ओपन-सोर्स घटक",
        blocks: [
          {
            kind: "p",
            en: "This platform incorporates third-party open-source components strictly under permissive licences (Apache-2.0, MIT, BSD-3-Clause, PostgreSQL Licence). Core model components, DBNet++ and PP-OCRv4 for text detection/recognition, RT-DETR and Tesseract 5, are used under their Apache-2.0 terms. Zero copyleft AGPL-3.0 code (including Ultralytics YOLO variants) is installed, imported or vendored; any such dependency triggers automatic CI rejection.",
            hi: "यह प्लेटफॉर्म तृतीय-पक्ष ओपन-सोर्स घटक केवल अनुमतिप्रद लाइसेंसों (Apache-2.0, MIT, BSD-3-Clause, PostgreSQL लाइसेंस) के अंतर्गत सम्मिलित करता है। मूल मॉडल घटक, टेक्स्ट डिटेक्शन/रिकग्निशन हेतु DBNet++ एवं PP-OCRv4, RT-DETR एवं Tesseract 5, अपनी Apache-2.0 शर्तों के अंतर्गत प्रयुक्त हैं। शून्य कॉपीलेफ्ट AGPL-3.0 कोड (Ultralytics YOLO रूपांतरों सहित) इंस्टॉल, इंपोर्ट या वेंडर किया जाता है; ऐसी कोई भी निर्भरता स्वचालित CI अस्वीकृति उत्पन्न करती है।",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 5. Accessibility Statement
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "accessibility-statement",
    category: "policy",
    titleEn: "Accessibility Statement",
    titleHi: "पहुंच-योग्यता विवरण",
    shortEn: "Accessibility Statement",
    shortHi: "पहुंच-योग्यता विवरण",
    ledeEn:
      "Veriq is engineered to conform with GIGW 3.0 and targets WCAG 2.1 Level AA, so that every officer, including those using assistive technology, working on low-bandwidth field connections, or preferring a bilingual interface, can complete statutory workflows independently. This statement documents the implemented features, compatibility envelope and the designated feedback channel.",
    ledeHi:
      "Veriq GIGW 3.0 के अनुरूप इंजीनियर्ड है तथा WCAG 2.1 स्तर AA को लक्षित करता है, ताकि प्रत्येक अधिकारी, सहायक तकनीक का उपयोग करने वाले, कम-बैंडविड्थ फील्ड कनेक्शन पर कार्यरत या द्विभाषी इंटरफ़ेस पसंद करने वाले सहित, सांवधिक कार्यप्रवाह स्वतंत्र रूप से पूर्ण कर सके। यह विवरण क्रियान्वित सुविधाएं, संगतता परिधि एवं नियत प्रतिक्रिया माध्यम दस्तावेजित करता है।",
    sourceUrl: "https://www.meity.gov.in/",
    sourceLabelEn: "MeitY, GIGW 3.0",
    sourceLabelHi: "MeitY, GIGW 3.0",
    meta: [
      {
        labelEn: "Conformance Target",
        labelHi: "अनुरूपता लक्ष्य",
        valueEn: "GIGW 3.0 & WCAG 2.1 Level AA",
        valueHi: "GIGW 3.0 एवं WCAG 2.1 स्तर AA",
      },
      {
        labelEn: "Contrast Commitment",
        labelHi: "कंट्रास्ट प्रतिबद्धता",
        valueEn: "WCAG-compliant body contrast + high-contrast mode",
        valueHi: "WCAG-अनुरूप मुख्य कंट्रास्ट + हाई-कंट्रास्ट मोड",
      },
      {
        labelEn: "Typography",
        labelHi: "अक्षर-शैली",
        valueEn: "Scalable A- / A / A+ text controls, tabular numerals",
        valueHi: "स्केलेबल A- / A / A+ पाठ नियंत्रण, टैबुलर अंक",
      },
      {
        labelEn: "Feedback Channel",
        labelHi: "प्रतिक्रिया माध्यम",
        valueEn: "Accessibility Officer, DoCA • NCH 1915",
        valueHi: "सुगम्यता अधिकारी, DoCA • NCH 1915",
      },
    ],
    related: ["gigw-3-0", "terms-and-conditions", "privacy-policy", "hyperlink-policy"],
    sections: [
      {
        id: "commitment",
        headingEn: "Our Commitment",
        headingHi: "हमारी प्रतिबद्धता",
        blocks: [
          {
            kind: "p",
            en: "Veriq's interface is built against the Guidelines for Indian Government Websites (GIGW 3.0) with WCAG 2.1 Level AA as the working conformance target. Accessibility is treated as a functional requirement of a statutory enforcement tool: an officer who cannot read a verdict, operate a camera flow or navigate an adjudication canvas with a keyboard cannot perform their legal duty.",
            hi: "निरीक्षक का इंटरफ़ेस भारतीय सरकारी वेबसाइट दिशानिर्देशों (GIGW 3.0) के विरुद्ध, WCAG 2.1 स्तर AA को कार्यशील अनुरूपता लक्ष्य मानकर बनाया गया है। सुगम्यता को एक सांवधिक प्रवर्तन उपकरण की कार्यात्मक आवश्यकता माना गया है: जो अधिकारी निर्णय नहीं पढ़ सकता, कैमरा प्रवाह नहीं चला सकता या कीबोर्ड से एडज्युडिकेशन कैनवास नहीं चला सकता, वह अपना विधिक कर्तव्य निभा नहीं सकता।",
          },
        ],
      },
      {
        id: "features",
        headingEn: "Implemented Accessibility Features",
        headingHi: "क्रियान्वित सुगम्यता सुविधाएं",
        blocks: [
          {
            kind: "list",
            itemsEn: [
              "Keyboard-operable interface with visible focus indicators and a skip-to-content \"Screen Reader Access\" link in the top utility bar.",
              "A- / A / A+ text-size controls with a persistent preference, plus tabular numerals so measurements and timestamps align in columns.",
              "High-contrast mode toggle that forces black/white rendering for low-vision users.",
              "Bilingual English / हिन्दी interface across portal chrome and governed documents.",
              "Semantic landmarks and ARIA attributes: role=\"contentinfo\" footer, aria-label=\"Breadcrumb\" and \"Table of Contents\" navigation, labelled form fields and dialogs.",
              "Print-friendly statutory layouts so on-screen and paper records match.",
              "Respect for prefers-reduced-motion: non-essential transitions disable automatically when the OS requests it.",
            ],
            itemsHi: [
              "दृश्य फ़ोकस संकेतों एवं शीर्ष यूटिलिटी बार में कंटेंट-तक-छोड़ें \"Screen Reader Access\" लिंक सहित कीबोर्ड-संचालित इंटरफ़ेस।",
              "A- / A / A+ पाठ आकार नियंत्रण स्थायी वरीयता सहित, तथा टैबुलर अंक जिससे माप एवं टाइमस्टैम्प कॉलम में संरेखित हों।",
              "हाई-कंट्रास्ट मोड टॉगल जो दृष्टिबाधित उपयोगकर्ताओं हेतु काला/सफेद रेंडरिंग लागू करता है।",
              "पोर्टल क्रोम एवं शासित दस्तावेज़ों में द्विभाषी English / हिन्दी इंटरफ़ेस।",
              "शब्दार्थिक लैंडमार्क एवं ARIA गुण: role=\"contentinfo\" फुटर, aria-label=\"Breadcrumb\" एवं \"Table of Contents\" नेविगेशन, लेबलबद्ध फ़ॉर्म क्षेत्र एवं डायलॉग।",
              "प्रिंट-अनुकूल सांवधिक लेआउट ताकि स्क्रीन एवं कागज़ी अभिलेख मेल खाएं।",
              "prefers-reduced-motion का सम्मान: OS अनुरोध करने पर गैर-आवश्यक ट्रांज़िशन स्वतः अक्षम।",
            ],
          },
        ],
      },
      {
        id: "compatibility",
        headingEn: "Screen-Reader Compatibility & Supported Browsers",
        headingHi: "स्क्रीन-रीडर संगतता एवं समर्थित ब्राउज़र",
        blocks: [
          {
            kind: "p",
            en: "The portal is designed for current versions of Chrome, Edge, Firefox and Safari on desktop, and responsive layouts support field use on mobile devices. Content is authored against standard accessibility trees (semantic HTML, native buttons and links, labelled inputs) so that screen readers on Windows, macOS, Android and iOS can announce statutory documents, verdicts and navigation meaningfully. Tabular data uses real table markup with header rows for linearised reading.",
            hi: "पोर्टल डेस्कटॉप पर Chrome, Edge, Firefox एवं Safari के वर्तमान संस्करणों हेतु डिज़ाइन किया गया है, तथा उत्तरदाशी लेआउट मोबाइल उपकरणों पर फील्ड उपयोग का समर्थन करते हैं। सामग्री मानक सुगम्यता-वृक्षों (शब्दार्थिक HTML, नेटिव बटन एवं लिंक, लेबलबद्ध इनपुट) के विरुद्ध रची जाती है ताकि Windows, macOS, Android एवं iOS के स्क्रीन-रीडर सांवधिक दस्तावेज़, निर्णय एवं नेविगेशन अर्थपूर्ण रूप से घोषित कर सकें। तालिकाओं में रैखिक-पठन हेतु हेडर पंक्तियों सहित वास्तविक टेबल मार्कअप है।",
          },
        ],
      },
      {
        id: "officer",
        headingEn: "Designated Accessibility Officer & Feedback",
        headingHi: "नियत सुगम्यता अधिकारी एवं प्रतिक्रिया",
        blocks: [
          {
            kind: "p",
            en: "Accessibility feedback and barrier reports are received by the designated Accessibility Officer, Legal Metrology Division, Department of Consumer Affairs, Krishi Bhawan, New Delhi, 110001. Officers may also route feedback through their jurisdictional Controller. Citizens' accessibility feedback on the underlying statutory processes can be directed to the National Consumer Helpline (1915).",
            hi: "सुगम्यता प्रतिक्रिया एवं बाधा रिपोर्ट नियत सुगम्यता अधिकारी, विधिक मापविज्ञान प्रभाग, उपभोक्ता मामले विभाग, कृषि भवन, नई दिल्ली, 110001 को प्राप्त होती हैं। अधिकारी प्रतिक्रिया अपने अधिकार-क्षेत्र के नियंत्रक के माध्यम से भी भेज सकते हैं। अंतर्निहित सांवधिक प्रक्रियाओं पर नागरिकों की सुगम्यता प्रतिक्रिया राष्ट्रीय उपभोक्ता हेल्पलाइन (1915) को निर्देशित की जा सकती है।",
          },
          {
            kind: "note",
            tone: "info",
            en: "Verified feedback is addressed in the next release cycle; if a barrier blocks a statutory workflow, report it as high priority so an interim workaround can be issued to affected circles.",
            hi: "सत्यापित प्रतिक्रिया अगले रिलीज़ चक्र में संबोधित होती है; यदि कोई बाधा सांवधिक कार्यप्रवाह रोकती है, तो उसे उच्च प्राथमिकता पर रिपोर्ट करें ताकि प्रभावित मंडलों को अंतरिम उपाय जारी किया जा सके।",
          },
        ],
      },
    ],
  },
];

/** Slugs of the five mandatory GIGW policy pages (URLs unchanged: /policies/<slug>). */
export const POLICY_SLUGS = POLICY_DOCS.map((doc) => doc.slug) as string[];

/** Union type of all valid policy slugs, for type-safe routing. */
export type PolicySlug = (typeof POLICY_SLUGS)[number];
