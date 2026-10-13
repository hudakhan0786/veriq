import type { LegalDoc } from "./legalDocTypes";

/**
 * Standards & Security Architecture, deep-content pages.
 *
 * Honesty constraint (CLAIMS_WE_MUST_NOT_MAKE.md): these pages describe the
 * conformance engineering and cryptographic architecture actually implemented
 * in this repository. They do not assert that any external certification has
 * been issued to the platform, certification status is stated only where a
 * competent authority has issued it, and never claimed on the platform's own
 * behalf. The Section 63 BSA hash workflow described here matches the
 * implemented evidence pipeline (SHA-256 hashing at capture, append-only
 * Merkle chain-of-custody, Ed25519 officer signature, Annexure-B certificate).
 */

export const STANDARD_DOCS: LegalDoc[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // 1. GIGW 3.0 Compliance Framework
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "gigw-3-0",
    category: "standards",
    titleEn: "GIGW 3.0, Guidelines for Indian Government Websites",
    titleHi: "GIGW 3.0, भारतीय सरकारी वेबसाइट दिशानिर्देश",
    shortEn: "GIGW 3.0",
    shortHi: "GIGW 3.0",
    ledeEn:
      "The Guidelines for Indian Government Websites (GIGW) issued under the authority of the Ministry of Electronics and Information Technology (MeitY) are the binding usability, accessibility and quality standard for Government of India web presence, including enforcement platforms like Veriq. This page documents how the workstation is engineered to conform, feature by feature.",
    ledeHi:
      "इलेक्ट्रॉनिक्स एवं सूचना प्रौद्योगिकी मंत्रालय (MeitY) के प्राधिकार से जारी भारतीय सरकारी वेबसाइट दिशानिर्देश (GIGW) भारत सरकार की वेब उपस्थिति, Veriq जैसे प्रवर्तन प्लेटफॉर्म सहित, हेतु बाध्यकारी प्रयोग-योग्यता, सुगम्यता एवं गुणवत्ता मानक हैं। यह पृष्ठ दस्तावेजित करता है कि यह कार्यस्थान कैसे, सुविधा-दर-सुविधा, अनुरूप इंजीनियर्ड है।",
    sourceUrl: "https://www.meity.gov.in/",
    sourceLabelEn: "MeitY, Official Guidelines Portal",
    sourceLabelHi: "MeitY, आधिकारिक दिशानिर्देश पोर्टल",
    meta: [
      {
        labelEn: "Issuing Authority",
        labelHi: "जारीकर्ता प्राधिकरण",
        valueEn: "Ministry of Electronics & IT (MeitY), Government of India",
        valueHi: "इलेक्ट्रॉनिक्स एवं सूचना प्रौद्योगिकी मंत्रालय (MeitY), भारत सरकार",
      },
      {
        labelEn: "Accessibility Target",
        labelHi: "सुगम्यता लक्ष्य",
        valueEn: "WCAG 2.1 Level AA",
        valueHi: "WCAG 2.1 स्तर AA",
      },
      {
        labelEn: "Applies To",
        labelHi: "लागू होता है",
        valueEn: "Government websites & mobile applications",
        valueHi: "सरकारी वेबसाइटें एवं मोबाइल अनुप्रयोग",
      },
      {
        labelEn: "Scope of This Page",
        labelHi: "इस पृष्ठ का विस्तार",
        valueEn: "Conformance engineering, not an issued certificate",
        valueHi: "अनुरूपता इंजीनियरिंग, जारी प्रमाणपत्र नहीं",
      },
    ],
    related: ["accessibility-statement", "sha256-merkle-chain", "hyperlink-policy"],
    sections: [
      {
        id: "mandate",
        headingEn: "The GIGW Mandate",
        headingHi: "GIGW अधिदेश",
        blocks: [
          {
            kind: "p",
            en: "GIGW exists so that every citizen and officer interacting with a Government of India service receives a predictable, accessible, secure experience, regardless of ability, device, language or connectivity. The guidelines cover four broad domains: accessibility, usability, content governance and technical quality. For an enforcement platform like Veriq, conformance is not cosmetic: a field officer on a low-bandwidth rural connection, or one using a screen reader, must be able to complete a statutory workflow end-to-end.",
            hi: "GIGW का उद्देश्य है कि भारत सरकार की सेवा से जुड़ने वाला प्रत्येक नागरिक एवं अधिकारी, क्षमता, उपकरण, भाषा या कनेक्टिविटी चाहे जो भी हो, एक सुधारित, सुगम्य, सुरक्षित अनुभव प्राप्त करे। दिशानिर्देश चार व्यापक क्षेत्रों को कवर करते हैं: सुगम्यता, प्रयोग-योग्यता, सामग्री शासन एवं तकनीकी गुणवत्ता। Veriq जैसे प्रवर्तन प्लेटफॉर्म हेतु अनुरूपता सामान्य सज्जा नहीं है: कम-बैंडविड्थ ग्रामीण कनेक्शन पर या स्क्रीन-रीडर का उपयोग करते हुए फील्ड अधिकारी को संपूर्ण सांवधिक कार्यप्रवाह स्वयं पूर्ण करने योग्य होना चाहिए।",
          },
          {
            kind: "note",
            tone: "statutory",
            en: "Honesty note: this page documents the conformance engineering built into Veriq. Formal GIGW quality certification is issued by the competent certifying authority through audit; until such an audit is completed for a deployment, no certificate is claimed on this portal's behalf.",
            hi: "ईमानदारी टिप्पणी: यह पृष्ठ Veriq में अंतर्निहित अनुरूपता इंजीनियरिंग का दस्तावेज़ है। औपचारिक GIGW गुणवत्ता प्रमाणीकरण सक्षम प्रमाणीकरण प्राधिकरण द्वारा ऑडिट से जारी होता है; ऐसे ऑडिट के किसी डिप्लॉयमेंट हेतु पूर्ण होने तक इस पोर्टल की ओर से कोई प्रमाणपत्र दावा नहीं किया जाता।",
          },
        ],
      },
      {
        id: "accessibility",
        headingEn: "Accessibility Engineering (WCAG 2.1 AA)",
        headingHi: "सुगम्यता इंजीनियरिंग (WCAG 2.1 AA)",
        blocks: [
          {
            kind: "list",
            itemsEn: [
              "GIGW 3.0 top utility bar: skip-to-content \"Screen Reader Access\" link, A- / A / A+ font-size controls, high-contrast toggle and a bilingual English / हिन्दी switch.",
              "Semantic landmarks: <header>, <nav> with aria-label=\"Breadcrumb\" and \"Table of Contents\", <main id=\"main-content\">, <footer role=\"contentinfo\">.",
              "Keyboard-operable everything: TOC links, search field, print button and footer navigation are all reachable and actionable via keyboard, with a visible focus ring defined globally.",
              "Contrast: body text on the dark statutory surfaces is set at WCAG-compliant luminance contrast; the high-contrast mode additionally forces black/white rendering for low-vision users.",
              "Reduced motion: if the operating system requests it, non-essential page transitions are disabled automatically.",
              "Tabular numerals for measurements, timestamps and hash values so digits align column-wise for both humans and screen readers.",
            ],
            itemsHi: [
              "GIGW 3.0 शीर्ष यूटिलिटी बार: कंटेंट-तक-छोड़ें \"Screen Reader Access\" लिंक, A- / A / A+ पाठ आकार नियंत्रण, हाई-कंट्रास्ट टॉगल एवं द्विभाषी English / हिन्दी स्विच।",
              "शब्दार्थिक लैंडमार्क: <header>, aria-label=\"Breadcrumb\" एवं \"Table of Contents\" सहित <nav>, <main id=\"main-content\">, <footer role=\"contentinfo\">।",
              "कीबोर्ड से संचालन योग्य सब कुछ: TOC लिंक, खोज क्षेत्र, प्रिंट बटन एवं फुटर नेविगेशन सभी कीबोर्ड से पहुंच-योग्य एवं क्रियाशील हैं, वैश्विक दृश्य फ़ोकस रिंग सहित।",
              "कंट्रास्ट: गहरे सांवधिक सतहों पर मुख्य पाठ WCAG-अनुरूप ल्यूमिनेंस कंट्रास्ट पर सेट है; हाई-कंट्रास्ट मोड अतिरिक्त रूप से दृष्टिबाधित उपयोगकर्ताओं हेतु काला/सफेद रेंडरिंग लागू करता है।",
              "सीमित गति: यदि ऑपरेटिंग सिस्टम अनुरोध करे तो गैर-आवश्यक पृष्ठ ट्रांज़िशन स्वतः अक्षम हो जाते हैं।",
              "माप, टाइमस्टैम्प एवं हैश मानों हेतु टैबुलर अंक, जिससे अंक मानव एवं स्क्रीन-रीडर दोनों हेतु कॉलम-वार संरेखित रहें।",
            ],
          },
        ],
      },
      {
        id: "content-governance",
        headingEn: "Content Governance & Metadata",
        headingHi: "सामग्री शासन एवं मेटाडेटा",
        blocks: [
          {
            kind: "list",
            itemsEn: [
              "Every document page carries a \"Last Updated\" stamp and the platform version tag (Version 1.0.0-SIH26034), rendered identically in the footer.",
              "Statutory metadata headers: each enactment page displays Gazette number, enactment date, effective date and enforcing authority as structured badges, machine-readable and human-readable.",
              "Broken link hygiene: internal links are compiled routes validated at build time; external links to NIC / DoCA / e-Gazette / PIB open in a new tab with rel=\"noopener noreferrer\" and are marked with an external-link icon so users know they are leaving the portal.",
              "Bilingual parity: every governed document (enactments, policies, standards) is maintained in both English and Hindi, switchable from the utility bar.",
              "Print parity: statutory documents render print-friendly via a dedicated print stylesheet, so a paper record matches the on-screen record.",
            ],
            itemsHi: [
              "प्रत्येक दस्तावेज़ पृष्ठ पर \"अंतिम अद्यतन\" टाइमस्टैम्प एवं प्लेटफॉर्म संस्करण टैग (Version 1.0.0-SIH26034), फुटर में समरूप रेंडर।",
              "सांवधिक मेटाडेटा हेडर: प्रत्येक अधिनियम पृष्ठ राजपत्र संख्या, अधिनियमन दिनांक, प्रभावी दिनांक एवं प्रवर्तन प्राधिकरण संरचित बैजों के रूप में दिखाता है, मशीन-पठनीय एवं मानव-पठनीय।",
              "टूटे-लिंक स्वच्छता: आंतरिक लिंक कंपाइल-समय पर सत्यापित रूट हैं; NIC / DoCA / ई-राजपत्र / PIB हेतु बाहरी लिंक rel=\"noopener noreferrer\" सहित नए टैब में खुलते हैं और बाहरी-लिंक आइकन से चिह्नित हैं ताकि उपयोगकर्ता जाने कि वे पोर्टल छोड़ रहे हैं।",
              "द्विभाषी समता: प्रत्येक शासित दस्तावेज़ (अधिनियम, नीतियां, मानक) अंग्रेज़ी एवं हिन्दी दोनों में अनुरक्षित है, यूटिलिटी बार से स्विच-योग्य।",
              "प्रिंट समता: सांवधिक दस्तावेज़ समर्पित प्रिंट स्टाइलशीट से प्रिंट-अनुकूल रेंडर होते हैं, ताकि कागज़ी अभिलेख स्क्रीन अभिलेख से मेल खाए।",
            ],
          },
        ],
      },
      {
        id: "security-quality",
        headingEn: "Security & Quality Alignment",
        headingHi: "सुरक्षा एवं गुणवत्ता संरेखण",
        blocks: [
          {
            kind: "list",
            itemsEn: [
              "Role-based access control (LMO / Administrator / Auditor) with JWT sessions, aligned to the security architecture in the repository's Section 10 specification.",
              "No third-party advertising or analytics trackers; only first-party functional storage for offline resilience (Mode B).",
              "Cryptographic evidence integrity via the SHA-256 Merkle chain-of-custody (see the companion standard page).",
              "Source-code auditability: the platform is developed as an open, auditable codebase with permissive (Apache-2.0 / MIT / BSD) dependencies only, zero copyleft AGPL components, enforced in CI.",
            ],
            itemsHi: [
              "भूमिका-आधारित पहुंच नियंत्रण (LMO / प्रशासक / ऑडिटर) JWT सत्रों सहित, रिपॉजिटरी के धारा 10 विनिर्देशन की सुरक्षा वास्तुकला के अनुरूप।",
              "कोई तृतीय-पक्ष विज्ञापन या एनालिटिक्स ट्रैकर नहीं; ऑफ़लाइन लचीलेपन (मोड बी) हेतु केवल प्रथम-पक्ष कार्यात्मक भंडारण।",
              "SHA-256 मर्कल कस्टडी श्रृंखला द्वारा क्रिप्टोग्राफिक साक्ष्य अखंडता (संगत मानक पृष्ठ देखें)।",
              "सोर्स-कोड ऑडिट-योग्यता: प्लेटफॉर्म खुले, ऑडिट-योग्य कोडबेस के रूप में विकसित है, केवल अनुमतिप्रद (Apache-2.0 / MIT / BSD) निर्भरताओं सहित, शून्य कॉपीलेफ्ट AGPL घटक, CI में प्रवर्तित।",
            ],
          },
        ],
      },
      {
        id: "checklist",
        headingEn: "Veriq Conformance Checklist",
        headingHi: "Veriq अनुरूपता चेकलिस्ट",
        blocks: [
          {
            kind: "table",
            headersEn: ["GIGW Requirement", "Veriq Implementation"],
            headersHi: ["GIGW आवश्यकता", "Veriq क्रियान्वयन"],
            rowsEn: [
              ["Skip to content link", "Top-bar \"Screen Reader Access\" → #main-content"],
              ["Font-size adjustment", "A- / A / A+ controls, persistent preference"],
              ["High contrast mode", "Utility-bar toggle forcing black/white rendering"],
              ["Bilingual content", "Full English / हिन्दी document parity with switch"],
              ["Breadcrumb navigation", "Home > Category > Document on every governed page"],
              ["Sticky table of contents", "Scroll-spied TOC on every statutory document"],
              ["Search within content", "Instant text search with match highlighting"],
              ["IST date & time", "Live IST clock in the sovereign masthead"],
              ["Version identification", "Version 1.0.0-SIH26034 in footer & policy headers"],
              ["Helpdesk / feedback channel", "National Consumer Helpline 1915 + jurisdictional Controller routes"],
            ],
            rowsHi: [
              ["कंटेंट तक छोड़ें लिंक", "शीर्ष-बार \"Screen Reader Access\" → #main-content"],
              ["फ़ॉन्ट आकार समायोजन", "A- / A / A+ नियंत्रण, स्थायी वरीयता"],
              ["हाई कंट्रास्ट मोड", "काला/सफेद रेंडरिंग लागू करने वाला यूटिलिटी-बार टॉगल"],
              ["द्विभाषी सामग्री", "पूर्ण English / हिन्दी दस्तावेज़ समता, स्विच सहित"],
              ["ब्रेडक्रम्ब नेविगेशन", "प्रत्येक शासित पृष्ठ पर मुख्य पृष्ठ > श्रेणी > दस्तावेज़"],
              ["स्टिकी विषय-सूची", "प्रत्येक सांवधिक दस्तावेज़ पर स्क्रॉल-स्पाई TOC"],
              ["सामग्री में खोज", "मैच हाईलाइटिंग सहित त्वरित पाठ खोज"],
              ["IST दिनांक एवं समय", "संप्रभु मास्टहेड में लाइव IST घड़ी"],
              ["संस्करण पहचान", "फुटर एवं नीति हेडर में Version 1.0.0-SIH26034"],
              ["हेल्पडेस्क / प्रतिक्रिया माध्यम", "राष्ट्रीय उपभोक्ता हेल्पलाइन 1915 + अधिकार-क्षेत्र नियंत्रक मार्ग"],
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 2. SHA-256 Merkle Chain, Section 63 BSA Hash Ledger
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "sha256-merkle-chain",
    category: "standards",
    titleEn: "SHA-256 Merkle Chain Integrity, Section 63 BSA Hash Ledger",
    titleHi: "SHA-256 मर्कल श्रृंखला अखंडता, धारा 63 बीएसए हैश लेजर",
    shortEn: "SHA-256 Merkle",
    shortHi: "SHA-256 मर्कल",
    ledeEn:
      "The cryptographic spine of every Veriq inspection: each photograph, OCR token stream, rule verdict and officer attestation is SHA-256 hashed at the moment of creation and sealed into an append-only Merkle ledger, so that the Section 63(4) certificate an officer signs is backed by tamper-evident, independently re-computable mathematics.",
    ledeHi:
      "प्रत्येक Veriq निरीक्षण की क्रिप्टोग्राफिक रीढ़: प्रत्येक फोटोग्राफ, OCR टोकन प्रवाह, नियम निर्णय एवं अधिकारी प्रमाणीकरण निर्माण के क्षण SHA-256 हैश होता है और केवल-संलग्न मर्कल लेजर में मुहरबंद होता है, ताकि अधिकारी द्वारा हस्ताक्षरित धारा 63(4) प्रमाणपत्र छेड़छाड़-रोधी, स्वतंत्र रूप से पुनः-गणना-योग्य गणित पर आधारित हो।",
    sourceUrl: "https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf",
    sourceLabelEn: "NIST FIPS 180-4, SHA-256 Specification",
    sourceLabelHi: "NIST FIPS 180-4, SHA-256 विनिर्देशन",
    meta: [
      {
        labelEn: "Hash Function",
        labelHi: "हैश फलन",
        valueEn: "SHA-256 (FIPS 180-4), 256-bit digest",
        valueHi: "SHA-256 (FIPS 180-4), 256-बिट डाइजेस्ट",
      },
      {
        labelEn: "Ledger Model",
        labelHi: "लेजर मॉडल",
        valueEn: "Append-only Merkle tree (chain-of-custody)",
        valueHi: "केवल-संलग्न मर्कल वृक्ष (कस्टडी श्रृंखला)",
      },
      {
        labelEn: "Statutory Anchor",
        labelHi: "सांवधिक आधार",
        valueEn: "Section 63(4), Bharatiya Sakshya Adhiniyam, 2023",
        valueHi: "धारा 63(4), भारतीय साक्ष्य अधिनियम, 2023",
      },
      {
        labelEn: "Officer Signature",
        labelHi: "अधिकारी हस्ताक्षर",
        valueEn: "Ed25519 cryptographic signature, post-adjudication",
        valueHi: "Ed25519 क्रिप्टोग्राफिक हस्ताक्षर, न्यायिक निर्णयोत्तर",
      },
    ],
    related: ["section-63-bsa-2023", "gigw-3-0"],
    sections: [
      {
        id: "why",
        headingEn: "Why a Merkle Ledger for Enforcement Evidence",
        headingHi: "प्रवर्तन साक्ष्य हेतु मर्कल लेजर क्यों",
        blocks: [
          {
            kind: "p",
            en: "An electronic record is only admissible under Section 63 of the Bharatiya Sakshya Adhiniyam, 2023 if its integrity can be shown. A bare file can be edited; a hash proves a file is unchanged only if the hash itself is trustworthy. The Merkle construction solves the trust problem: every evidence item becomes a leaf hash, leaf hashes are paired and re-hashed upward into a single root, and the root is what the officer's certificate declares. Any change to any byte of any leaf changes its hash, which cascades through every parent and produces a different root, the tampering is mathematically evident even if only the root was preserved.",
            hi: "भारतीय साक्ष्य अधिनियम, 2023 की धारा 63 के अंतर्गत कोई इलेक्ट्रॉनिक अभिलेख तभी ग्राह्य है जब उसकी अखंडता दिखाई जा सके। एक साधारण फ़ाइल संपादित की जा सकती है; हैश केवल तब प्रमाणित करता है कि फ़ाइल अपरिवर्तित है यदि स्वयं हैश विश्वसनीय हो। मर्कल रचना इस विश्वास की समस्या का समाधान करती है: प्रत्येक साक्ष्य वस्तु एक लीफ हैश बनती है, लीफ हैश जोड़े में ऊपर की ओर पुनः-हैश होकर एक एकल रूट बनाते हैं, और अधिकारी का प्रमाणपत्र उसी रूट की घोषणा करता है। किसी भी लीफ के किसी भी बाइट का परिवर्तन उसका हैश बदल देता है, जो प्रत्येक पैरेंट से गुजरते हुए भिन्न रूट उत्पन्न करता है, छेड़छाड़ गणितीय रूप से स्पष्ट है, यहां तक कि केवल रूट सुरक्षित होने पर भी।",
          },
          {
            kind: "code",
            captionEn: "Merkle construction (append-only)",
            captionHi: "मर्कल रचना (केवल-संलग्न)",
            text: `leaf_1 = SHA256(photo_bytes)          leaf_2 = SHA256(ocr_tokens)
leaf_3 = SHA256(rule_evaluation)      leaf_4 = SHA256(officer_attestation)

h_12   = SHA256(leaf_1 || leaf_2)
h_34   = SHA256(leaf_3 || leaf_4)
root   = SHA256(h_12 || h_34)   ← printed on the Sec 63(4) certificate`,
          },
        ],
      },
      {
        id: "what-is-hashed",
        headingEn: "What Gets Sealed Into the Chain",
        headingHi: "श्रृंखला में क्या मुहरबंद होता है",
        blocks: [
          {
            kind: "list",
            itemsEn: [
              "Raw captured photograph bytes (at the instant of capture, pre-OCR).",
              "OCR token stream with bounding polygons and language tags.",
              "Normalized statutory facts and the full rule-evaluation result (4-state verdict, per-rule scores).",
              "Device attestation record: MAC / serial, OS, clock_source, GNSS (nullable with circle fallback).",
              "Officer adjudication trail and the Ed25519-signed outcome.",
              "Certificate issuance events (Annexure-B, Form-1 notice drafts).",
            ],
            itemsHi: [
              "कैप्चर किए गए फोटोग्राफ के रॉ बाइट्स (कैप्चर के क्षण, OCR से पूर्व)।",
              "बाउंडिंग पॉलीगॉन एवं भाषा टैग सहित OCR टोकन प्रवाह।",
              "सामान्यीकृत सांवधिक तथ्य एवं पूर्ण नियम-मूल्यांकन परिणाम (4-राज्य निर्णय, प्रति-नियम स्कोर)।",
              "डिवाइस प्रमाणीकरण अभिलेख: MAC / सीरियल, OS, clock_source, GNSS (मंडल फॉलबैक सहित nullable)।",
              "अधिकारी न्यायिक निर्णय ट्रेल एवं Ed25519-हस्ताक्षरित परिणाम।",
              "प्रमाणपत्र निर्गम घटनाएं (अनुलग्नक-B, प्रपत्र-1 नोटिस ड्राफ्ट)।",
            ],
          },
        ],
      },
      {
        id: "tamper-evidence",
        headingEn: "Tamper-Evidence & Audit Workflow",
        headingHi: "छेड़छाड़-रोधी एवं ऑडिट कार्यप्रवाह",
        blocks: [
          {
            kind: "list",
            itemsEn: [
              "Verification: an auditor re-hashes the evidence leaves and re-derives the root independently, no proprietary tooling required, any FIPS 180-4 SHA-256 implementation suffices.",
              "Match: recomputed root equals the certificate root → the dossier is byte-for-byte intact since sealing.",
              "Mismatch: any difference pinpoints which subtree diverges, giving auditors the exact evidence item that changed.",
              "Immutability: the ledger is append-only by design, corrections are new sealed records, never edits of sealed ones.",
              "Dispute path: in proceedings, the officer presents the certificate (containing the root) alongside the dossier; the court-side recomputation closes the chain of custody.",
            ],
            itemsHi: [
              "सत्यापन: ऑडिटर साक्ष्य लीफ़ों को पुनः-हैश कर स्वतंत्र रूप से रूट पुनः-व्युत्पन्न करता है, कोई प्रोप्राइटरी टूलिंग आवश्यक नहीं, कोई भी FIPS 180-4 SHA-256 क्रियान्वयन पर्याप्त है।",
              "मेल: पुनर्गणित रूट = प्रमाणपत्र रूट → डोजियर मुहर के बाद से बाइट-दर-बाइट अक्षत है।",
              "बेमेल: कोई भी अंतर बताता है कि कौन-सा सबट्री भिन्न हुआ, ऑडिटरों को बदली हुई सटीक साक्ष्य वस्तु देता है।",
              "अपरिवर्तनीयता: लेजर डिज़ाइन से केवल-संलग्न है, संशोधन नई मुहरबंद अभिलेख होते हैं, मुहरबंद अभिलेखों के संपादन कभी नहीं।",
              "विवाद पथ: कार्यवाही में अधिकारी प्रमाणपत्र (रूट सहित) डोजियर के साथ प्रस्तुत करता है; न्यायालय-पक्ष पुनर्गणना कस्टडी श्रृंखला बंद कर देती है।",
            ],
          },
        ],
      },
      {
        id: "implementation",
        headingEn: "Platform Implementation Details",
        headingHi: "प्लेटफॉर्म क्रियान्वयन विवरण",
        blocks: [
          {
            kind: "list",
            itemsEn: [
              "Hashing is performed client-side at capture so the hash predates any server contact, critical for Mode B offline inspections.",
              "Offline queue: during connectivity blackouts, sealed records queue locally and sync into the central ledger with their original capture-time hashes intact.",
              "Signature: after human adjudication the officer signs with Ed25519; the signature covers the verdict, not just the image, binding the human decision to the sealed evidence.",
              "Certificate: the Annexure-B Section 63(4) certificate embeds the leaf hash, device particulars, Merkle root and officer identity, and exports as PDF/A.",
              "Demo-separation guard: every demo/demo-fixture record is labelled SYNTHETIC / DEMO FIXTURE and is cryptographically distinct from enforcement records, synthetic evidence can never be represented as a seized-goods record.",
            ],
            itemsHi: [
              "हैशिंग कैप्चर पर क्लाइंट-पक्ष में होती है ताकि हैश किसी सर्वर-संपर्क से पूर्व बने, मोड बी ऑफ़लाइन निरीक्षणों हेतु अत्यावश्यक।",
              "ऑफ़लाइन कतार: कनेक्टिविटी कालेप के दौरान मुहरबंद अभिलेख स्थानीय रूप से कतारबद्ध होते हैं और मूल कैप्चर-समय हैश के साथ केंद्रीय लेजर में सिंक होते हैं।",
              "हस्ताक्षर: मानव न्यायिक निर्णय के बाद अधिकारी Ed25519 से हस्ताक्षर करता है; हस्ताक्षर केवल छवि नहीं, निर्णय को भी कवर करता है, मानव निर्णय को मुहरबंद साक्ष्य से बांधता है।",
              "प्रमाणपत्र: अनुलग्नक-B धारा 63(4) प्रमाणपत्र लीफ हैश, डिवाइस विवरण, मर्कल रूट एवं अधिकारी पहचान अंतर्भूत करता है, और PDF/A के रूप में निर्यात होता है।",
              "डेमो-पृथक्करण रक्षा: प्रत्येक डेमो / डेमो-फ़िक्स्चर अभिलेख SYNTHETIC / DEMO FIXTURE लेबलित तथा प्रवर्तन अभिलेखों से क्रिप्टोग्राफिक रूप से भिन्न है, सिंथेटिक साक्ष्य कभी भी जब्त-वस्तु अभिलेख के रूप में प्रस्तुत नहीं किया जा सकता।",
            ],
          },
          {
            kind: "note",
            tone: "statutory",
            en: "Scope of the mathematics: the Merkle ledger proves that records have not changed since sealing. It does not, by itself, prove who created them, that is the role of device attestation and the officer's signature. The Section 63(4) certificate therefore combines all three: hash (integrity), device (provenance), officer (responsibility).",
            hi: "गणित का विस्तार: मर्कल लेजर सिद्ध करता है कि अभिलेख मुहर के बाद अपरिवर्तित हैं। यह स्वयं यह सिद्ध नहीं करता कि उन्हें किसने बनाया, वह डिवाइस प्रमाणीकरण एवं अधिकारी के हस्ताक्षर की भूमिका है। अतः धारा 63(4) प्रमाणपत्र तीनों को संयोजित करता है: हैश (अखंडता), डिवाइस (उद्गम), अधिकारी (उत्तरदायित्व)।",
          },
        ],
      },
    ],
  },
];
