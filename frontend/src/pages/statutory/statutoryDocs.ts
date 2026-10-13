import type { LegalDoc } from "./legalDocTypes";

/**
 * Statutory Enactments & Acts, deep-content pages.
 *
 * Citation ledger (verified against official sources, September 2026):
 *  - Legal Metrology Act, 2009 = Act No. 1 of 2010 (assent 08-01-2010, in force 01-03-2011).
 *    S.15 "Power of inspection, seizure, etc."; S.18 declarations on pre-packaged
 *    commodities; S.36 penalty for non-standard packages (imprisonment for subsequent
 *    offence omitted by the Jan Vishwas (Amendment of Provisions) Act, 2023);
 *    S.48 compounding of offences (S.25, S.27–39, S.45–47 compoundable).
 *  - LMPC Rules, 2011 = G.S.R. 202(E) dated 07-03-2011; e-commerce sub-rule 6(10)
 *    inserted by G.S.R. 629(E) dated 23-06-2017 (effective 01-01-2018); USP mandate
 *    G.S.R. 779(E) dated 28-10-2021 (effective 01-04-2022); QR-code electronic
 *    declarations enabled from 01-01-2024 via G.S.R. 456(E) dated 23-06-2023.
 *    Table-I font heights are the frozen schedule from AGENTS.md (ADL-01: Row 5 = 6.0 mm).
 *  - Section 63, Bharatiya Sakshya Adhiniyam, 2023 = Act No. 47 of 2023 (in force
 *    01-07-2024), replacing Section 65B of the repealed Indian Evidence Act, 1872;
 *    certificate under sub-section (4); certificate form prescribed in the Schedule.
 */

export const STATUTORY_DOCS: LegalDoc[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // 1. The Legal Metrology Act, 2009
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "legal-metrology-act-2009",
    category: "statutory",
    titleEn: "The Legal Metrology Act, 2009",
    titleHi: "विधिक मापविज्ञान अधिनियम, 2009",
    shortEn: "The Legal Metrology Act, 2009",
    shortHi: "विधिक मापविज्ञान अधिनियम, 2009",
    ledeEn:
      "The parent statute governing weights and measures across India. It prescribes standard units, regulates pre-packaged commodities, empowers Legal Metrology Officers to inspect, search and seize, and penalises non-standard packages. Veriq operates entirely as an augmented diagnostic assistant under this Act, every finding is a recommendation for the human Legal Metrology Officer, who alone holds adjudication authority.",
    ledeHi:
      "सम्पूर्ण भारत में वजन एवं माप को नियंत्रित करने वाला मूल विधान। यह मानक इकाइयां निर्धारित करता है, पैकेज्ड वस्तुओं का विनियमन करता है, विधिक मापविज्ञान अधिकारियों को निरीक्षण, तलाशी एवं जब्ती की शक्तियां देता है, और गैर-मानक पैकेजों पर दंड विहित करता है। Veriq पूर्णतः इस अधिनियम के अंतर्गत एक संवर्धित नैदानिक सहायक के रूप में कार्य करता है, प्रत्येक निष्कर्ष मानव विधिक मापविज्ञान अधिकारी के लिए प्रस्तुत सिफारिश है, जिन्हें अकेले न्यायिक निर्णय का अधिकार है।",
    sourceUrl: "https://www.indiacode.nic.in/handle/123456789/1997",
    sourceLabelEn: "Read the Act on India Code",
    sourceLabelHi: "भारत कोड पर अधिनियम पढ़ें",
    meta: [
      {
        labelEn: "Statutory Authority",
        labelHi: "विधिक प्राधिकार",
        valueEn: "Act No. 1 of 2010",
        valueHi: "अधिनियम संख्या 1 वर्ष 2010",
      },
      {
        labelEn: "Enactment Date",
        labelHi: "अधिनियमन दिनांक",
        valueEn: "Presidential assent 8 January 2010",
        valueHi: "राष्ट्रपति की स्वीकृति 8 जनवरी 2010",
      },
      {
        labelEn: "In Force From",
        labelHi: "प्रभावी दिनांक",
        valueEn: "1 March 2011 (whole of India)",
        valueHi: "1 मार्च 2011 (सम्पूर्ण भारत)",
      },
      {
        labelEn: "Enforcing Authority",
        labelHi: "प्रवर्तन प्राधिकरण",
        valueEn: "Dept. of Consumer Affairs, Govt. of India & State Controllers",
        valueHi: "उपभोक्ता मामले विभाग, भारत सरकार एवं राज्य नियंत्रक",
      },
    ],
    related: ["lmpc-rules-2011", "section-63-bsa-2023", "ecommerce-rule-6-10", "usp-gsr-779e"],
    sections: [
      {
        id: "scope",
        headingEn: "Scope & Object",
        headingHi: "विस्तार एवं उद्देश्य",
        blocks: [
          {
            kind: "p",
            en: "The Legal Metrology Act, 2009 (Act No. 1 of 2010) extends to the whole of India and establishes the national framework for units of measurement, verification and stamping of weights and measures, and the regulation of pre-packaged commodities offered in trade and commerce. It was enacted to consolidate and replace the Standards of Weights and Measures Act, 1976 and the Standards of Weights and Measures (Enforcement) Act, 1985, simplifying compliance for trade while strengthening consumer protection.",
            hi: "विधिक मापविज्ञान अधिनियम, 2009 (अधिनियम संख्या 1 वर्ष 2010) सम्पूर्ण भारत पर लागू होता है और माप की इकाइयों, वजन-माप के सत्यापन एवं अंकन, तथा व्यापार में प्रस्तुत पैकेज्ड वस्तुओं के विनियमन हेतु राष्ट्रीय ढांचा स्थापित करता है। इसे मानक वजन एवं माप अधिनियम, 1976 तथा मानक वजन एवं माप (प्रवर्तन) अधिनियम, 1985 को समेकित कर उन्हें प्रतिस्थापित करने हेतु बनाया गया था, जिससे उपभोक्ता संरक्षण सुदृढ़ होते हुए व्यापार हेतु अनुपालन सरल हो।",
          },
          {
            kind: "list",
            itemsEn: [
              "Standard units based on the metric system, kept traceable to national standards maintained by the Central Government.",
              "Appointment of a Controller of Legal Metrology and supporting Legal Metrology Officers (LMOs) by each State / Union Territory.",
              "Mandatory declarations on pre-packaged commodities, prescribed in detail under the LMPC Rules, 2011.",
              "Powers of verification, inspection, search and seizure, backed by offences, penalties and compounding provisions.",
            ],
            itemsHi: [
              "मात्रक प्रणाली पर आधारित मानक इकाइयां, जो केंद्र सरकार द्वारा अनुरक्षित राष्ट्रीय मानकों तक पता-योग्य (traceable) हैं।",
              "प्रत्येक राज्य / केंद्र शासित प्रदेश द्वारा विधिक मापविज्ञान नियंत्रक तथा सहायक विधिक मापविज्ञान अधिकारियों (LMO) की नियुक्ति।",
              "पैकेज्ड वस्तुओं पर अनिवार्य घोषणाएं, जिन्हें LMPC नियम, 2011 के अंतर्गत विस्तृत रूप से विहित किया गया है।",
              "सत्यापन, निरीक्षण, तलाशी एवं जब्ती की शक्तियां, जो अपराध, दंड एवं समझौता (compounding) प्रावधानों द्वारा समर्थित हैं।",
            ],
          },
        ],
      },
      {
        id: "declarations-s18",
        headingEn: "Declarations on Pre-packaged Commodities, Section 18",
        headingHi: "पैकेज्ड वस्तुओं पर घोषणाएं, धारा 18",
        blocks: [
          {
            kind: "p",
            en: "Section 18 is the foundation of packaged-commodity enforcement. It provides that no person shall manufacture, pack, sell, import, distribute, deliver, offer, expose or possess for sale any pre-packaged commodity unless the package carries the declarations prescribed under the rules. In practice, the prescribed declarations are those set out in Rule 6 of the Legal Metrology (Packaged Commodities) Rules, 2011.",
            hi: "धारा 18 पैकेज्ड वस्तु प्रवर्तन की आधारशिला है। यह प्रावधान करती है कि कोई भी व्यक्ति किसी पैकेज्ड वस्तु को तब तक निर्माण, पैकिंग, विक्रय, आयात, वितरण, वितरण-प्रेषण, ऑफर, प्रदर्शन या बिक्री हेतु धारण नहीं करेगा, जब तक कि पैकेज पर नियमों में विहित घोषणाएं अंकित न हों। व्यवहार में, विहित घोषणाएं विधिक मापविज्ञान (पैकेज्ड वस्तुएं) नियम, 2011 के नियम 6 में निर्दिष्ट हैं।",
          },
          {
            kind: "note",
            tone: "statutory",
            en: "Veriq mapping: the platform's statutory rule engine parses OCR tokens from the captured label and validates each Rule 6(1) declaration against Section 18, manufacturer identity, net quantity, dates, MRP, consumer care and country of origin, before the officer reviews the verdict.",
            hi: "Veriq मैपिंग: प्लेटफॉर्म का सांविधिक नियम इंजन कैप्चर किए गए लेबल से OCR टोकन पार्स करता है और अधिकारी द्वारा निर्णय समीक्षा से पहले धारा 18 के विरुद्ध प्रत्येक नियम 6(1) घोषणा को सत्यापित करता है, निर्माता पहचान, शुद्ध मात्रा, दिनांक, अधिकतम खुदरा मूल्य, उपभोक्ता देखभाल एवं मूल देश।",
          },
        ],
      },
      {
        id: "powers-s15",
        headingEn: "Powers of Inspection, Search & Seizure, Section 15",
        headingHi: "निरीक्षण, तलाशी एवं जब्ती की शक्तियां, धारा 15",
        blocks: [
          {
            kind: "p",
            en: "Section 15 (\"Power of inspection, seizure, etc.\") arms the Director, the Controller and legal metrology officers with the core enforcement powers used during field inspections. Where an officer has reason to believe, from written information, personal knowledge or otherwise, that weights, measures or goods connected with an apparent or likely offence are kept or transported, the officer may:",
            hi: "धारा 15 (\"निरीक्षण, जब्ती इत्यादि की शक्ति\") निदेशक, नियंत्रक एवं विधिक मापविज्ञान अधिकारियों को फील्ड निरीक्षणों में प्रयुक्त होने वाली मूल प्रवर्तन शक्तियां प्रदान करती है। जब किसी अधिकारी को, लिखित सूचना, व्यक्तिगत ज्ञान या अन्यथा, यह विश्वास हो कि किसी स्पष्ट या संभावित अपराध से जुड़े वजन, माप या वस्तुएं किसी परिसर में रखी या परिवहित हो रही हैं, तो वह अधिकारी:",
          },
          {
            kind: "list",
            itemsEn: [
              "Enter any premises at any reasonable time to search and inspect the weights, measures, goods and related records, registers or documents.",
              "Seize any weights, measures, goods, records, registers, documents or articles that may furnish evidence of an offence committed or likely to be committed.",
              "Call for and inspect any document or record relating to the weight or measure; the person in custody must produce it.",
              "Dispose of seized goods subject to speedy or natural decay in the prescribed manner.",
            ],
            itemsHi: [
              "किसी भी उचित समय परिसर में प्रवेश कर वजन, माप, वस्तुओं एवं संबंधित अभिलेखों, रजिस्टरों या दस्तावेजों की तलाशी व निरीक्षण कर सकता है।",
              "किसी भी वजन, माप, वस्तु, अभिलेख, रजिस्टर, दस्तावेज़ या वस्तु को जब्त कर सकता है जो किए गए या संभावित अपराध के साक्ष्य प्रस्तुत कर सकते हों।",
              "वजन या माप से संबंधित कोई भी दस्तावेज़ या अभिलेख प्रस्तुत करने को कह सकता है; जिसकी कस्टडी में वह है, उसे प्रस्तुत करना अनिवार्य है।",
              "तीव्र या प्राकृतिक अपघटन की सीमा में जब्त की गई वस्तुओं को विहित प्रक्रिया से निपटा सकता है।",
            ],
          },
          {
            kind: "p",
            en: "Every search and seizure under Section 15 must follow the search and seizure procedure of the Code of Criminal Procedure, 1973 (2 of 1974), and a formal seizure memo must be handed to the party. This is why every Veriq capture, photograph, hash, timestamp and device identity, is anchored into a tamper-evident ledger: the officer's eventual notice must survive evidentiary scrutiny under Section 63 of the Bharatiya Sakshya Adhiniyam, 2023.",
            hi: "धारा 15 के अंतर्गत प्रत्येक तलाशी एवं जब्ती अपराध प्रक्रिया संहिता, 1973 (2 वर्ष 1974) की तलाशी-जब्ती प्रक्रिया के अनुरूप होनी चाहिए और पक्षकार को औपचारिक जब्ती ज्ञापन (seizure memo) सौंपा जाना चाहिए। इसी कारण Veriq का प्रत्येक कैप्चर, फोटोग्राफ, हैश, टाइमस्टैम्प एवं डिवाइस पहचान, छेड़छाड़-रोधी लेजर में अंकित होता है: अधिकारी के अंतिम नोटिस को भारतीय साक्ष्य अधिनियम, 2023 की धारा 63 के अंतर्गत साक्ष्य परीक्षण टिकाना होता है।",
          },
        ],
      },
      {
        id: "penalties-s36",
        headingEn: "Penalties for Non-Standard Packages, Section 36",
        headingHi: "गैर-मानक पैकेजों हेतु दंड, धारा 36",
        blocks: [
          {
            kind: "p",
            en: "Section 36 penalises the manufacture, packing, import, sale, distribution, delivery or other transfer of any non-standard package, i.e., a package whose statutory declarations are missing or non-compliant. The monetary penalty schedule is:",
            hi: "धारा 36 किसी भी गैर-मानक पैकेज, अर्थात् जिस पैकेज पर सांविधिक घोषणाएं अनुपस्थित या अनुपालन-बाहर हैं, के निर्माण, पैकिंग, आयात, विक्रय, वितरण, प्रेषण या अन्य हस्तांतरण पर दंड विहित करती है। दंड अनुसूची इस प्रकार है:",
          },
          {
            kind: "table",
            headersEn: ["Offence Stage", "Penalty (Section 36)"],
            headersHi: ["अपराध चरण", "दंड (धारा 36)"],
            rowsEn: [
              ["First conviction", "Fine which may extend to ₹25,000"],
              ["Second or subsequent conviction", "Fine which may extend to ₹50,000 (imprisonment provision omitted by the Jan Vishwas (Amendment of Provisions) Act, 2023)"],
            ],
            rowsHi: [
              ["प्रथम दोषसिद्धि", "जुर्माना जो ₹25,000 तक विस्तृत हो सकता है"],
              ["द्वितीय या उत्तरवर्ती दोषसिद्धि", "जुर्माना जो ₹50,000 तक विस्तृत हो सकता है (उत्तरवर्ती अपराध हेतु कारावास प्रावधान जन विश्वास (उपबंध संशोधन) अधिनियम, 2023 द्वारा हटा दिया गया)"],
            ],
          },
          {
            kind: "note",
            tone: "warning",
            en: "Human-in-the-Loop mandate: Veriq never issues a penalty. A Section 36 finding is rendered as one of the four epistemic verdicts, PASS, FAIL, REVIEW or UNABLE_TO_VERIFY, and a qualified Legal Metrology Officer must adjudicate before any statutory notice is drafted or signed.",
            hi: "मानव-सहित निर्णय अनिवार्यता: Veriq कभी दंड जारी नहीं करता। धारा 36 का निष्कर्ष चार ज्ञानमीमांसीय निर्णयों में से एक के रूप में प्रस्तुत होता है, PASS, FAIL, REVIEW या UNABLE_TO_VERIFY, और कोई भी सांविधिक नोटिस तैयार या हस्ताक्षरित होने से पहले योग्य विधिक मापविज्ञान अधिकारी का न्यायिक निर्णय आवश्यक है।",
          },
        ],
      },
      {
        id: "compounding-s48",
        headingEn: "Compounding of Offences, Section 48",
        headingHi: "अपराधों का समझौता, धारा 48",
        blocks: [
          {
            kind: "p",
            en: "Section 48 allows most first-order offences to be closed administratively. Any offence punishable under Section 25, Sections 27 to 39, or Sections 45 to 47, or under rules made under the Act, may be compounded by the Controller or an authorised legal metrology officer on payment of the prescribed sum, which is credited to the Government. Once compounded, no further proceedings are taken against the offender for the same offence.",
            hi: "धारा 48 अधिकांश प्रथम-स्तरीय अपराधों को प्रशासनिक रूप से निपटाने की अनुमति देती है। धारा 25, धारा 27 से 39, या धारा 45 से 47 के अंतर्गत दंडनीय कोई भी अपराध, या इस अधिनियम के अंतर्गत बनाए गए नियमों का उल्लंघन, नियंत्रक या अधिकृत विधिक मापविज्ञान अधिकारी द्वारा विहित राशि के भुगतान पर समझौता (compound) किया जा सकता है, जो सरकार के पक्ष में जमा होती है। एक बार समझौता होने पर उसी अपराध हेतु अपराधी के विरुद्ध कोई और कार्यवाही नहीं की जाती।",
          },
          {
            kind: "list",
            itemsEn: [
              "Compounding is administrative discretion, not automatic: the authorised officer evaluates the offence before accepting the prescribed fee.",
              "It applies to the enumerated offence sections (25, 27–39, 45–47), repeat or aggravated matters may fall outside compounding in practice.",
              "The compounding record, like any enforcement record, must be evidenced to statutory standards, in Veriq it is hashed into the Section 63 BSA evidence ledger.",
            ],
            itemsHi: [
              "समझौता प्रशासनिक विवेक है, स्वतः नहीं: अधिकृत अधिकारी विहित शुल्क स्वीकार करने से पहले अपराध का मूल्यांकन करता है।",
              "यह गणनाबद्ध अपराध धाराओं (25, 27–39, 45–47) पर लागू होता है, बार-बार या गंभीर मामले व्यवहार में समझौते के बाहर हो सकते हैं।",
              "समझौता अभिलेख, किसी भी प्रवर्तन अभिलेख की भांति, सांविधिक मानकों पर साक्ष्यबद्ध होना चाहिए, Veriq में इसे धारा 63 बीएसए साक्ष्य लेजर में हैश किया जाता है।",
            ],
          },
        ],
      },
      {
        id: "nirikshak-workflow",
        headingEn: "Enforcement Workflow Inside Veriq",
        headingHi: "Veriq के अंदर प्रवर्तन कार्यप्रवाह",
        blocks: [
          {
            kind: "list",
            itemsEn: [
              "Evidence intake: officer photographs the label; the optical quality gate blocks blur and glare before OCR runs.",
              "Extraction: multilingual OCR and the statutory parser extract Section 18 declarations from the label.",
              "Evaluation: the rule engine scores every Rule 6 declaration and renders a 4-state verdict (PASS / FAIL / REVIEW / UNABLE_TO_VERIFY).",
              "Adjudication: the LMO reviews findings on the Adjudication Canvas and signs the outcome, the system never self-executes.",
              "Documentation: the drafted inspection notice (Section 36 route) and Section 63 BSA 2023 electronic-evidence certificate are sealed with SHA-256 hashes and the officer's cryptographic signature.",
            ],
            itemsHi: [
              "साक्ष्य प्राप्ति: अधिकारी लेबल का फोटोग्राफ लेता है; ऑप्टिकल गुणवत्ता गेट धुंधलापन एवं चमक को OCR से पहले रोकता है।",
              "निष्कर्षण: बहुभाषी OCR एवं सांविधिक पार्सर लेबल से धारा 18 की घोषणाएं निकालते हैं।",
              "मूल्यांकन: नियम इंजन प्रत्येक नियम 6 घोषणा का स्कोर करता है और 4-राज्य निर्णय (PASS / FAIL / REVIEW / UNABLE_TO_VERIFY) देता है।",
              "न्यायिक निर्णय: LMO एडज्युडिकेशन कैनवास पर निष्कर्षों की समीक्षा कर परिणाम पर हस्ताक्षर करता है, प्रणाली कभी स्वयं निष्पादित नहीं करती।",
              "दस्तावेज़ीकरण: प्रारूप निरीक्षण नोटिस (धारा 36 पथ) एवं धारा 63 बीएसए 2023 इलेक्ट्रॉनिक-साक्ष्य प्रमाणपत्र SHA-256 हैश एवं अधिकारी के क्रिप्टोग्राफिक हस्ताक्षर से मुहरबंद होते हैं।",
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 2. LMPC Rules, 2011 (As Amended 2024)
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "lmpc-rules-2011",
    category: "statutory",
    titleEn: "Legal Metrology (Packaged Commodities) Rules, 2011",
    titleHi: "विधिक मापविज्ञान (पैकेज्ड वस्तुएं) नियम, 2011",
    shortEn: "LMPC Rules, 2011 (As Amended 2024)",
    shortHi: "एलएमपीसी नियम, 2011 (यथा संशोधित 2024)",
    ledeEn:
      "The subordinate legislation that operationalises Section 18 of the Legal Metrology Act, 2009. It prescribes every mandatory declaration on a pre-packaged commodity, the font-height schedule for label numerals, QR-code electronic declarations, the Unit Sale Price mandate and the e-commerce disclosure regime that Veriq verifies field-to-rule.",
    ledeHi:
      "वह उपविधिका जो विधिक मापविज्ञान अधिनियम, 2009 की धारा 18 को क्रियान्वित करती है। यह पैकेज्ड वस्तु पर प्रत्येक अनिवार्य घोषणा, लेबल अंकों की अक्षर-ऊंचाई अनुसूची, QR-कोड इलेक्ट्रॉनिक घोषणाएं, इकाई विक्रय मूल्य अधिदेश तथा ई-कॉमर्स प्रकटीकरण प्रणाली विहित करती है, जिसे Veriq क्षेत्र-से-नियम सत्यापित करता है।",
    sourceUrl: "https://consumeraffairs.gov.in/pages/legal-metrology-act",
    sourceLabelEn: "DoCA, Official Rules & Amendments",
    sourceLabelHi: "DoCA, आधिकारिक नियम एवं संशोधन",
    meta: [
      {
        labelEn: "Gazette No.",
        labelHi: "राजपत्र संख्या",
        valueEn: "G.S.R. 202(E), dated 7 March 2011",
        valueHi: "जी.एस.आर. 202(ई), दिनांक 7 मार्च 2011",
      },
      {
        labelEn: "Enabling Act",
        labelHi: "सशक्त अधिनियम",
        valueEn: "Legal Metrology Act, 2009 (Act No. 1 of 2010)",
        valueHi: "विधिक मापविज्ञान अधिनियम, 2009 (अधिनियम संख्या 1 वर्ष 2010)",
      },
      {
        labelEn: "Status",
        labelHi: "स्थिति",
        valueEn: "As amended, QR-code regime effective 1 January 2024",
        valueHi: "यथा संशोधित, QR-कोड प्रणाली 1 जनवरी 2024 से प्रभावी",
      },
      {
        labelEn: "Enforcing Authority",
        labelHi: "प्रवर्तन प्राधिकरण",
        valueEn: "Dept. of Consumer Affairs & State Legal Metrology wings",
        valueHi: "उपभोक्ता मामले विभाग एवं राज्य विधिक मापविज्ञान प्रभाग",
      },
    ],
    related: ["legal-metrology-act-2009", "ecommerce-rule-6-10", "usp-gsr-779e", "section-63-bsa-2023"],
    sections: [
      {
        id: "scope",
        headingEn: "Scope, Registration & Application",
        headingHi: "विस्तार, पंजीकरण एवं प्रयोग",
        blocks: [
          {
            kind: "p",
            en: "The LMPC Rules, 2011 apply to every pre-packaged commodity intended for retail sale, whether manufactured, packed or imported in India. Manufacturers, packers and importers of pre-packaged commodities must register with the Director / Controller of Legal Metrology (Rule 27) through the national Legal Metrology portal before such commodities may be offered for sale.",
            hi: "LMPC नियम, 2011 प्रत्येक पैकेज्ड वस्तु पर लागू होते हैं जो खुदरा बिक्री हेतु हो, चाहे भारत में निर्मित, पैक या आयातित हो। पैकेज्ड वस्तुओं के निर्माता, पैकर एवं आयातकों को ऐसी वस्तुएं बेचने से पहले राष्ट्रीय विधिक मापविज्ञान पोर्टल के माध्यम से निदेशक / नियंत्रक (नियम 27) से पंजीकरण कराना अनिवार्य है।",
          },
          {
            kind: "note",
            tone: "info",
            en: "Registration and declarations operate under distinct rules: Rule 27 covers entity registration, while Rule 6 covers package-level declarations. Veriq verifies the declaration layer; entity registration is checked through the e-Maap national portal integration.",
            hi: "पंजीकरण एवं घोषणाएं भिन्न नियमों के अंतर्गत चलती हैं: नियम 27 इकाई पंजीकरण करता है, जबकि नियम 6 पैकेज-स्तर घोषणाएं। Veriq घोषणा परत को सत्यापित करता है; इकाई पंजीकरण ई-माप राष्ट्रीय पोर्टल एकीकरण से जांचा जाता है।",
          },
        ],
      },
      {
        id: "rule6-declarations",
        headingEn: "Mandatory Declarations, Rule 6(1)",
        headingHi: "अनिवार्य घोषणाएं, नियम 6(1)",
        blocks: [
          {
            kind: "p",
            en: "Every pre-packaged commodity sold in India must carry the following declarations, legible and conspicuous, in Devanagari (Hindi) or English:",
            hi: "भारत में बेची जाने वाली प्रत्येक पैकेज्ड वस्तु पर निम्न घोषणाएं, सुपाठ्य एवं सुस्पष्ट रूप से, देवनागरी (हिन्दी) या अंग्रेज़ी में होनी चाहिए:",
          },
          {
            kind: "list",
            itemsEn: [
              "Name and full address of the manufacturer, packer or importer (and the unit, where multiple units exist).",
              "Common or generic name of the commodity.",
              "Net quantity in standard metric units (g / kg, ml / L, m, or number).",
              "Month and year of manufacture, pre-packing or import.",
              "Retail sale price (MRP) inclusive of all taxes, declared in Indian currency.",
              "Consumer care details, name, address, telephone number and e-mail.",
              "Dimensions of the commodity where applicable (e.g., textiles, floor coverings).",
              "Country of origin or manufacture or assembly for imported packages.",
            ],
            itemsHi: [
              "निर्माता, पैकर या आयातक का नाम एवं पूर्ण पता (और जहां लागू हो, इकाई का नाम)।",
              "वस्तु का सामान्य या सामान्य-नाम (generic name)।",
              "मानक मात्रक इकाइयों में शुद्ध मात्रा (ग्राम / किग्रा, मिली / ली, मीटर, या संख्या)।",
              "निर्माण, प्री-पैकिंग या आयात का माह एवं वर्ष।",
              "खुदरा विक्रय मूल्य (MRP) समस्त करों सहित, भारतीय मुद्रा में घोषित।",
              "उपभोक्ता देखभाल विवरण, नाम, पता, दूरभाष संख्या एवं ई-मेल।",
              "जहां लागू हो, वस्तु की विमाएं (जैसे वस्त्र, फर्श आवरण)।",
              "आयातित पैकेजों हेतु मूल देश या निर्माण या असेंबली का देश।",
            ],
          },
          {
            kind: "note",
            tone: "statutory",
            en: "Banned units: Veriq flags non-standard quantity expressions such as \"gms\", \"gm\", \"ML\", \"ltrs\", the LMPC Rules require standard metric symbols. Indic numerals are normalised by the extraction layer before evaluation.",
            hi: "निषिद्ध इकाइयां: Veriq गैर-मानक मात्रा अभिव्यक्तियों जैसे \"gms\", \"gm\", \"ML\", \"ltrs\" को चिह्नित करता है, LMPC नियमों हेतु मानक मात्रक प्रतीक अनिवार्य हैं। मूल्यांकन से पहले निष्कर्षण परत देशज (Indic) अंकों को सामान्यीकृत करती है।",
          },
        ],
      },
      {
        id: "font-schedule",
        headingEn: "Minimum Font-Height Schedule (Table-I)",
        headingHi: "न्यूनतम अक्षर-ऊंचाई अनुसूची (तालिका-I)",
        blocks: [
          {
            kind: "p",
            en: "The numerals and letters of the net-quantity and MRP declarations must meet the minimum height prescribed by the font schedule, based on the surface area of the principal display panel (PDP). Veriq computes the PDP area from ArUco scale calibration and homography rectification, then checks the measured numeral height against this schedule:",
            hi: "शुद्ध मात्रा एवं MRP घोषणाओं के अंक एवं अक्षर अक्षर-ऊंचाई अनुसूची द्वारा विहित न्यूनतम ऊंचाई पूर्ण करें, जो प्रधान प्रदर्शन पैनल (PDP) के सतह क्षेत्र पर निर्भर है। Veriq ArUco स्केल अंशांकन एवं होमोग्राफी रेक्टिफिकेशन से PDP क्षेत्रफल निकालता है, फिर मापी गई अंक-ऊंचाई को इस अनुसूची से जांचता है:",
          },
          {
            kind: "table",
            headersEn: ["PDP Surface Area", "Minimum Numeral Height"],
            headersHi: ["PDP सतह क्षेत्रफल", "न्यूनतम अंक ऊंचाई"],
            rowsEn: [
              ["Up to 50 cm²", "1.0 mm"],
              ["Above 50 cm² up to 100 cm²", "1.5 mm"],
              ["Above 100 cm² up to 500 cm²", "2.5 mm"],
              ["Above 500 cm² up to 2500 cm²", "4.0 mm"],
              ["Above 2500 cm²", "6.0 mm"],
            ],
            rowsHi: [
              ["50 वर्ग सेमी तक", "1.0 मिमी"],
              ["50 वर्ग सेमी से अधिक, 100 वर्ग सेमी तक", "1.5 मिमी"],
              ["100 वर्ग सेमी से अधिक, 500 वर्ग सेमी तक", "2.5 मिमी"],
              ["500 वर्ग सेमी से अधिक, 2500 वर्ग सेमी तक", "4.0 मिमी"],
              ["2500 वर्ग सेमी से अधिक", "6.0 मिमी"],
            ],
          },
          {
            kind: "note",
            tone: "warning",
            en: "Row 5 is 6.0 mm, never 8.0 mm (ADL-01). Any component or document citing 8.0 mm for the >2500 cm² band is in violation of the repository's frozen decision log.",
            hi: "पंक्ति 5 = 6.0 मिमी, कभी 8.0 मिमी नहीं (ADL-01)। >2500 वर्ग सेमी श्रेणी हेतु 8.0 मिमी उद्धृत करने वाला कोई भी घटक या दस्तावेज़ रिपॉजिटरी के स्थिर निर्णय लॉज के विरुद्ध है।",
          },
        ],
      },
      {
        id: "qr-code",
        headingEn: "QR-Code Electronic Declarations (From 1 January 2024)",
        headingHi: "QR-कोड इलेक्ट्रॉनिक घोषणाएं (1 जनवरी 2024 से)",
        blocks: [
          {
            kind: "p",
            en: "The declaration rules were progressively amended to admit electronic disclosure. A first relaxation allowed QR-code declarations for electronic products (effective 1 July 2022), and the amendment notified via G.S.R. 456(E), dated 23 June 2023, in force from 1 January 2024, widened the regime: certain mandatory details (such as the full manufacturer address, size/dimensions or commodity specifications) may be declared through a QR code on the package, provided the label also carries a printed instruction telling the consumer to \"scan the QR code\" for information not printed on the package.",
            hi: "घोषणा नियमों में क्रमिक संशोधनों द्वारा इलेक्ट्रॉनिक प्रकटीकरण की अनुमति दी गई। पहली छूट इलेक्ट्रॉनिक उत्पादों हेतु QR-कोड घोषणाएं (1 जुलाई 2022 से प्रभावी), तत्पश्चात जी.एस.आर. 456(ई), दिनांक 23 जून 2023, 1 जनवरी 2024 से प्रभावी, द्वारा इस प्रणाली को विस्तृत किया गया: कुछ अनिवार्य विवरण (जैसे पूर्ण निर्माता पता, आकार/विमाएं या वस्तु विनिर्देश) पैकेज पर QR-कोड द्वारा घोषित किए जा सकते हैं, बशर्ते लेबल पर उपभोक्ता को यह लिखित निर्देश भी हो कि पैकेज पर अनमुद्रित जानकारी हेतु \"QR कोड स्कैन करें\"।",
          },
          {
            kind: "list",
            itemsEn: [
              "Core identifiers, net quantity, MRP and consumer care, must remain printed on the package; the QR route is a partial relaxation, not a full digital substitution.",
              "The printed \"scan the QR code\" instruction is itself a mandatory declaration.",
              "Veriq treats QR-declared fields as REVIEW-prone: officers are prompted to scan and confirm the digital content during adjudication.",
            ],
            itemsHi: [
              "मूल पहचानकर्ता, शुद्ध मात्रा, MRP एवं उपभोक्ता देखभाल, पैकेज पर अनिवार्यतः अनमुद्रित रहें; QR मार्ग आंशिक छूट है, पूर्ण डिजिटल प्रतिस्थापन नहीं।",
              "अनमुद्रित \"QR कोड स्कैन करें\" निर्देश स्वयं एक अनिवार्य घोषणा है।",
              "Veriq QR-घोषित क्षेत्रों को REVIEW-प्रवण मानता है: अधिकारियों को न्यायिक निर्णय के दौरान डिजिटल सामग्री स्कैन कर पुष्टि करने का संकेत दिया जाता है।",
            ],
          },
        ],
      },
      {
        id: "verification",
        headingEn: "How Veriq Verifies LMPC Compliance",
        headingHi: "Veriq LMPC अनुपालन कैसे सत्यापित करता है",
        blocks: [
          {
            kind: "list",
            itemsEn: [
              "Optical gate: blur and glare checks reject unusable captures (UNABLE_TO_VERIFY) before any legal evaluation.",
              "Calibration: ArUco markers and planar homography recover true label scale for font-height measurement.",
              "Extraction: PP-OCRv4 (English + Devanagari) tokens are parsed into statutory fields; banned units and Indic numerals are normalised.",
              "Rule engine: every Rule 6 declaration, the Table-I font schedule and the USP invariant are evaluated into a 4-state verdict.",
              "Evidence: the full dossier is SHA-256 hashed into the Section 63 BSA 2023 chain of custody.",
            ],
            itemsHi: [
              "ऑप्टिकल गेट: धुंधलापन एवं चमक जांच अनुपयोगी कैप्चर को (UNABLE_TO_VERIFY) किसी भी विधिक मूल्यांकन से पहले अस्वीकृत करती है।",
              "अंशांकन: ArUco मार्कर एवं प्लानर होमोग्राफी अक्षर-ऊंचाई मापन हेतु सत्य लेबल स्केल पुनर्प्राप्त करते हैं।",
              "निष्कर्षण: PP-OCRv4 (अंग्रेज़ी + देवनागरी) टोकन सांविधिक क्षेत्रों में पार्स होते हैं; निषिद्ध इकाइयां एवं देशज अंक सामान्यीकृत होते हैं।",
              "नियम इंजन: प्रत्येक नियम 6 घोषणा, तालिका-I अक्षर-ऊंचाई अनुसूची एवं USP अपरिवर्तनीयता का मूल्यांकन 4-राज्य निर्णय में होता है।",
              "साक्ष्य: पूर्ण डोजियर SHA-256 हैश द्वारा धारा 63 बीएसए 2023 कस्टडी श्रृंखला में अंकित होता है।",
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 3. Section 63 BSA 2023
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "section-63-bsa-2023",
    category: "statutory",
    titleEn: "Section 63 BSA 2023, Admissibility of Electronic Records",
    titleHi: "धारा 63 बीएसए 2023, इलेक्ट्रॉनिक अभिलेखों की ग्राह्यता",
    shortEn: "Section 63 BSA 2023 (Admissibility)",
    shortHi: "धारा 63 बीएसए 2023 (साक्ष्य ग्राह्यता)",
    ledeEn:
      "The provision that decides whether Veriq's digital evidence stands in a court of law. Section 63 of the Bharatiya Sakshya Adhiniyam, 2023 replaced Section 65B of the repealed Indian Evidence Act, 1872 as the sole gateway for electronic records, and prescribes the certificate regime that every inspection dossier, hash and officer notice must satisfy.",
    ledeHi:
      "वह प्रावधान जो तय करता है कि Veriq का डिजिटल साक्ष्य न्यायालय में टिकेगा या नहीं। भारतीय साक्ष्य अधिनियम, 2023 की धारा 63 ने निरस्त भारतीय साक्ष्य अधिनियम, 1872 की धारा 65B को प्रतिस्थापित कर इलेक्ट्रॉनिक अभिलेखों हेतु एकमात्र द्वार बना दिया है, और वह प्रमाणपत्र प्रणाली विहित करती है जिसे प्रत्येक निरीक्षण डोजियर, हैश एवं अधिकारी नोटिस को पूर्ण करना होगा।",
    sourceUrl: "https://www.indiacode.nic.in/handle/123456789/20080",
    sourceLabelEn: "Read the Adhiniyam on India Code",
    sourceLabelHi: "भारत कोड पर अधिनियम पढ़ें",
    meta: [
      {
        labelEn: "Statutory Authority",
        labelHi: "विधिक प्राधिकार",
        valueEn: "Bharatiya Sakshya Adhiniyam, 2023, Act No. 47 of 2023",
        valueHi: "भारतीय साक्ष्य अधिनियम, 2023, अधिनियम संख्या 47 वर्ष 2023",
      },
      {
        labelEn: "In Force From",
        labelHi: "प्रभावी दिनांक",
        valueEn: "1 July 2024",
        valueHi: "1 जुलाई 2024",
      },
      {
        labelEn: "Replaces",
        labelHi: "प्रतिस्थापित करता है",
        valueEn: "Section 65B, Indian Evidence Act, 1872 (repealed)",
        valueHi: "धारा 65B, भारतीय साक्ष्य अधिनियम, 1872 (निरस्त)",
      },
      {
        labelEn: "Certificate",
        labelHi: "प्रमाणपत्र",
        valueEn: "Sub-section (4) certificate; form prescribed in the Schedule",
        valueHi: "उपधारा (4) प्रमाणपत्र; प्रपत्र अनुसूची में विहित",
      },
    ],
    related: ["sha256-merkle-chain", "legal-metrology-act-2009", "lmpc-rules-2011"],
    sections: [
      {
        id: "transition",
        headingEn: "From Section 65B IEA 1872 to Section 63 BSA 2023",
        headingHi: "धारा 65B आईईए 1872 से धारा 63 बीएसए 2023 तक",
        blocks: [
          {
            kind: "p",
            en: "For 151 years the admissibility of electronic records in Indian proceedings ran through Section 65B of the Indian Evidence Act, 1872. The Indian Evidence Act was repealed and replaced by the Bharatiya Sakshya Adhiniyam, 2023 (Act No. 47 of 2023), in force from 1 July 2024. Its Section 63 (\"Admissibility of electronic records\") carries forward the substance of the old regime, but modernises it for communication devices, updates the certificate machinery and prescribes the certificate form in a Schedule to the Adhiniyam itself.",
            hi: "151 वर्षों तक भारतीय कार्यवाहियों में इलेक्ट्रॉनिक अभिलेखों की ग्राह्यता भारतीय साक्ष्य अधिनियम, 1872 की धारा 65B से संचालित होती थी। भारतीय साक्ष्य अधिनियम को निरस्त कर भारतीय साक्ष्य अधिनियम, 2023 (अधिनियम संख्या 47 वर्ष 2023) लागू किया गया, जो 1 जुलाई 2024 से प्रभावी है। इसकी धारा 63 (\"इलेक्ट्रॉनिक अभिलेखों की ग्राह्यता\") पुरानी प्रणाली का सार आगे बढ़ाती है, परंतु इसे संचार उपकरणों हेतु आधुनिक बनाती है, प्रमाणपत्र तंत्र को अद्यतन करती है और प्रमाणपत्र प्रपत्र को अधिनियम की अनुसूची में विहित करती है।",
          },
          {
            kind: "note",
            tone: "warning",
            en: "Repository mandate (CLAIMS_WE_MUST_NOT_MAKE / ADR-10): every certificate, schema and notice generated by Veriq cites Section 63 of the Bharatiya Sakshya Adhiniyam, 2023, never the repealed Section 65B of the Indian Evidence Act, 1872.",
            hi: "रिपॉजिटरी अनिवार्यता (CLAIMS_WE_MUST_NOT_MAKE / ADR-10): Veriq द्वारा जनरेटेड प्रत्येक प्रमाणपत्र, स्कीमा एवं नोटिस भारतीय साक्ष्य अधिनियम, 2023 की धारा 63 उद्धृत करता है, कभी भी निरस्त भारतीय साक्ष्य अधिनियम, 1872 की धारा 65B नहीं।",
          },
        ],
      },
      {
        id: "conditions",
        headingEn: "Conditions for Admissibility, Sub-sections (1) to (3)",
        headingHi: "ग्राह्यता की शर्तें, उपधारा (1) से (3)",
        blocks: [
          {
            kind: "p",
            en: "Notwithstanding anything else in the Adhiniyam, information contained in an electronic record produced from a computer, communication device or electronic device is admissible in any proceeding, in evidence, or for inspection, subject to the statutory conditions. In substance, the party must show that:",
            hi: "अधिनियम में अंतर्विष्ट किसी भी अन्य बात के होते हुए भी, कंप्यूटर, संचार उपकरण या इलेक्ट्रॉनिक उपकरण से प्रस्तुत इलेक्ट्रॉनिक अभिलेख में अंतर्विष्ट सूचना किसी भी कार्यवाही में, साक्ष्य के रूप में या निरीक्षण हेतु, ग्राह्य है, सांवधिक शर्तों के अधीन। सारतः पक्षकार को यह दिखाना होता है कि:",
          },
          {
            kind: "list",
            itemsEn: [
              "The computer, communication device or system was regularly used by the person having lawful control over it, in the ordinary course of activities.",
              "Information of the kind contained in the record was regularly fed into the device in the ordinary course of those activities.",
              "The device was operating properly, or where not operating properly, was such that the improper operation did not affect the accuracy of the record.",
              "The information contained in the record reproduces (or is derived from) such information regularly fed into the device in the ordinary course.",
            ],
            itemsHi: [
              "कंप्यूटर, संचार उपकरण या तंत्र का विधिक नियंत्रण रखने वाले व्यक्ति द्वारा उसका सामान्य गतिविधियों के क्रम में नियमित उपयोग होता था।",
              "अभिलेख में अंतर्विष्ट प्रकार की सूचना उन गतिविधियों के सामान्य क्रम में नियमित रूप से उपकरण में भरी जाती थी।",
              "उपकरण सुचारु रूप से संचालित हो रहा था, अथवा जहां ठीक से संचालित नहीं हो रहा था, वह इस प्रकार था कि दोषपूर्ण संचालन से अभिलेख की शुद्धता प्रभावित नहीं हुई।",
              "अभिलेख में अंतर्विष्ट सूचना सामान्य क्रम में नियमित भरी गई सूचना का पुनरुत्पादन (या व्युत्पन्न) है।",
            ],
          },
        ],
      },
      {
        id: "certificate",
        headingEn: "The Section 63(4) Certificate & Expert Attestation",
        headingHi: "धारा 63(4) प्रमाणपत्र एवं विशेषज्ञ प्रमाणीकरण",
        blocks: [
          {
            kind: "p",
            en: "The dual-certificate machinery is the heart of Section 63. A certificate identifying the electronic record and describing the manner in which it was produced, together with the particulars of the device, must be signed by a person occupying a responsible official position in relation to the operation of the relevant device. The Adhiniyam further contemplates certification by an expert, and prescribes the form of the certificate in its Schedule.",
            hi: "द्वि-प्रमाणपत्र तंत्र धारा 63 का हृदय है। इलेक्ट्रॉनिक अभिलेख को पहचानने वाला तथा उसके उत्पादन की विधि का वर्णन करने वाला, उपकरण के विवरण सहित, एक प्रमाणपत्र संबंधित उपकरण के संचालन के संबंध में उत्तरदायी आधिकारिक पद धारण करने वाले व्यक्ति द्वारा हस्ताक्षरित होना चाहिए। अधिनियम विशेषज्ञ द्वारा प्रमाणीकरण की भी परिकल्पना करता है और प्रमाणपत्र का प्रपत्र अपनी अनुसूची में विहित करता है।",
          },
          {
            kind: "list",
            itemsEn: [
              "Identity of the electronic record (hash value is the strongest identifier).",
              "Manner of production, which device, which process, in which ordinary course of activity.",
              "Particulars of the device, manufacturer, model, serial / MAC identifiers.",
              "Signature of the responsible official, in Veriq, the adjudicating Legal Metrology Officer.",
              "Where required, the expert certificate supporting the device / process integrity.",
            ],
            itemsHi: [
              "इलेक्ट्रॉनिक अभिलेख की पहचान (हैश मान सर्वाधिक प्रबल पहचानकर्ता है)।",
              "उत्पादन की विधि, कौन-सा उपकरण, कौन-सी प्रक्रिया, किस सामान्य गतिविधि क्रम में।",
              "उपकरण के विवरण, निर्माता, मॉडल, सीरियल / MAC पहचानकर्ता।",
              "उत्तरदायी आधिकारिक के हस्ताक्षर, Veriq में, न्यायिक निर्णय करने वाले विधिक मापविज्ञान अधिकारी।",
              "जहां आवश्यक हो, उपकरण / प्रक्रिया अखंडता को समर्थन देने वाला विशेषज्ञ प्रमाणपत्र।",
            ],
          },
        ],
      },
      {
        id: "hash-custody",
        headingEn: "Hash Integrity & Chain of Custody",
        headingHi: "हैश अखंडता एवं कस्टडी श्रृंखला",
        blocks: [
          {
            kind: "p",
            en: "A Section 63 certificate is only as strong as the integrity of the underlying record. Veriq therefore binds every captured photograph to a SHA-256 hash at the moment of capture, chains inspection records into an append-only Merkle ledger, and prints the root hash on the officer's certificate, so any later alteration of even one byte is mathematically detectable. See the SHA-256 Merkle Chain standard page for the cryptographic architecture.",
            hi: "धारा 63 प्रमाणपत्र उतना ही प्रबल है जितनी अंतर्निहित अभिलेख की अखंडता। अतः Veriq प्रत्येक कैप्चर किए गए फोटोग्राफ को कैप्चर के क्षण ही SHA-256 हैश से बांधता है, निरीक्षण अभिलेखों को केवल-संलग्न (append-only) मर्कल लेजर में श्रृंखलाबद्ध करता है, और रूट हैश अधिकारी के प्रमाणपत्र पर अंकित करता है, ताकि बाद में एक बाइट का भी परिवर्तन गणितीय रूप से पहचाना जा सके। क्रिप्टोग्राफिक वास्तुकला हेतु SHA-256 मर्कल श्रृंखला मानक पृष्ठ देखें।",
          },
          {
            kind: "code",
            captionEn: "Illustrative certificate skeleton (Annexure-B of the inspection dossier)",
            captionHi: "उदाहरण प्रमाणपत्र कंकाल (निरीक्षण डोजियर का अनुलग्नक-B)",
            text: `CERTIFICATE UNDER SECTION 63(4), BHARATIYA SAKSHYA ADHINIYAM, 2023
─────────────────────────────────────────────────────────────
Electronic record   : inspection_photo_20260913T114201.jpg
SHA-256             : 9f2c7a4e1b8d... (64 hex chars, truncated)
Produced by device  : CAM-CAPTURE-7, S/N XY-4482,
                      OS 6.2.1, clock_source: LOCAL_DEVICE_MONOTONIC
GNSS coordinates    : 28.6139N, 77.2090E (nullable, circle fallback)
Merkle root         : a71d...f03c (append-only Section 63 ledger)
Responsible official: <LMO name, badge no.>, signature`,
          },
        ],
      },
      {
        id: "nirikshak-automation",
        headingEn: "Automated Certification for LMO Field Audits",
        headingHi: "LMO फील्ड ऑडिट हेतु स्वचालित प्रमाणीकरण",
        blocks: [
          {
            kind: "list",
            itemsEn: [
              "Device attestation: hardware MAC / serial, operating system and local monotonic UTC timestamp (clock_source: LOCAL_DEVICE_MONOTONIC) are captured at evidence creation.",
              "Location binding: available GNSS coordinates are recorded and nullable with jurisdictional circle fallback for blackout conditions (Mode B).",
              "Hash ledger: image SHA-256, OCR token stream and rule-evaluation result are sealed into the Merkle chain-of-custody.",
              "Certificate generation: the Annexure-B certificate is auto-drafted for the officer, signed cryptographically (Ed25519) after human adjudication, and exported as a PDF/A notice bundle.",
            ],
            itemsHi: [
              "डिवाइस प्रमाणीकरण: हार्डवेयर MAC / सीरियल, ऑपरेटिंग सिस्टम एवं स्थानीय मोनोटोनिक UTC टाइमस्टैम्प (clock_source: LOCAL_DEVICE_MONOTONIC) साक्ष्य निर्माण पर कैप्चर होते हैं।",
              "स्थान बाइंडिंग: उपलब्ध GNSS निर्देशांक अभिलिखित होते हैं और ब्लैकआउट (मोड बी) हेतु अधिकार-क्षेत्र मंडल फॉलबैक सहित nullable रहते हैं।",
              "हैश लेजर: छवि SHA-256, OCR टोकन प्रवाह एवं नियम-मूल्यांकन परिणाम मर्कल कस्टडी श्रृंखला में मुहरबंद होते हैं।",
              "प्रमाणपत्र जनरेशन: अनुलग्नक-B प्रमाणपत्र अधिकारी हेतु स्वतः ड्राफ्ट होता है, मानव न्यायिक निर्णय के बाद क्रिप्टोग्राफिक (Ed25519) हस्ताक्षरित होता है, और PDF/A नोटिस बंडल के रूप में निर्यात होता है।",
            ],
          },
          {
            kind: "note",
            tone: "statutory",
            en: "The certificate is a draft until the human officer signs. This preserves the constitutional HITL principle: the machine attests to integrity, the officer attests to truth.",
            hi: "मानव अधिकारी के हस्ताक्षर तक प्रमाणपत्र ड्राफ्ट है। यह संवैधानिक मानव-सहित (HITL) सिद्धांत सुरक्षित रखता है: मशीन अखंडता का प्रमाण देती है, अधिकारी सत्य का।",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 4. E-Commerce Compliance, Rule 6(10)
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "ecommerce-rule-6-10",
    category: "statutory",
    titleEn: "E-Commerce Compliance, Rule 6(10) of the LMPC Rules",
    titleHi: "ई-कॉमर्स अनुपालन, LMPC नियमों का नियम 6(10)",
    shortEn: "E-Commerce Compliance GSR 629(E)",
    shortHi: "ई-कॉमर्स अनुपालन जीएसआर 629(ई)",
    ledeEn:
      "Digital storefronts carry the same statutory duty as a shrink-wrapped label. Rule 6(10), inserted into the LMPC Rules, 2011 by the amendment notified as G.S.R. 629(E) dated 23 June 2017, effective 1 January 2018, obliges every e-commerce entity to display the mandatory declarations on the product listing before the transaction, with a deliberate statutory exemption for manufacturing dates and a 2026 country-of-origin strengthening.",
    ledeHi:
      "डिजिटल स्टोरफ्रंट पर वही सांवधिक दायित्व है जो श्रिंक-रैप लेबल पर होता है। नियम 6(10), जो जी.एस.आर. 629(ई) दिनांक 23 जून 2017, प्रभावी 1 जनवरी 2018 से अधिसूचित संशोधन द्वारा LMPC नियम, 2011 में सम्मिलित हुआ, प्रत्येक ई-कॉमर्स इकाई को लेन-देन से पहले उत्पाद लिस्टिंग पर अनिवार्य घोषणाएं प्रदर्शित करने हेतु बाध्य करता है, जिसमें निर्माण दिनांक हेतु जानबूझकर सांवधिक छूट तथा 2026 का मूल-देश सुदृढ़ीकरण शामिल है।",
    sourceUrl: "https://consumeraffairs.gov.in/pages/legal-metrology-act",
    sourceLabelEn: "DoCA, Amendment Notifications",
    sourceLabelHi: "DoCA, संशोधन अधिसूचनाएं",
    meta: [
      {
        labelEn: "Gazette No.",
        labelHi: "राजपत्र संख्या",
        valueEn: "G.S.R. 629(E), dated 23 June 2017",
        valueHi: "जी.एस.आर. 629(ई), दिनांक 23 जून 2017",
      },
      {
        labelEn: "Effective From",
        labelHi: "प्रभावी दिनांक",
        valueEn: "1 January 2018",
        valueHi: "1 जनवरी 2018",
      },
      {
        labelEn: "Enabling Law",
        labelHi: "सशक्त विधि",
        valueEn: "LMPC Rules, 2011, Legal Metrology Act, 2009",
        valueHi: "LMPC नियम, 2011, विधिक मापविज्ञान अधिनियम, 2009",
      },
      {
        labelEn: "Scope",
        labelHi: "विस्तार",
        valueEn: "All e-commerce entities offering pre-packaged commodities",
        valueHi: "पैकेज्ड वस्तुएं प्रस्तुत करने वाली समस्त ई-कॉमर्स इकाइयां",
      },
    ],
    related: ["lmpc-rules-2011", "usp-gsr-779e", "legal-metrology-act-2009"],
    sections: [
      {
        id: "digital-parity",
        headingEn: "Digital–Physical Parity",
        headingHi: "डिजिटल–भौतिक समता",
        blocks: [
          {
            kind: "p",
            en: "Rule 6(10) extends the physical label regime to digital sales channels. Every e-commerce entity must ensure that the declarations required under Rule 6, as printed on the package label, are also displayed on the digital or electronic platform, prior to the sale being concluded. The rule exists because a consumer buying online cannot physically read the pack: the listing page must therefore reproduce the statutory label information.",
            hi: "नियम 6(10) भौतिक लेबल प्रणाली को डिजिटल विक्रय-माध्यमों तक विस्तारित करता है। प्रत्येक ई-कॉमर्स इकाई को यह सुनिश्चित करना होगा कि नियम 6 के अंतर्गत आवश्यक घोषणाएं, जैसी पैकेज लेबल पर अनमुद्रित हैं, विक्रय पूर्ण होने से पहले डिजिटल या इलेक्ट्रॉनिक प्लेटफॉर्म पर भी प्रदर्शित हों। यह नियम इसलिए है कि ऑनलाइन खरीदने वाला उपभोक्ता पैक भौतिक रूप से नहीं पढ़ सकता: अतः लिस्टिंग पृष्ठ को सांवधिक लेबल सूचना पुनरुत्पादित करनी चाहिए।",
          },
          {
            kind: "note",
            tone: "info",
            en: "Definition: the 2017 amendment also inserted \"e-commerce\" into the LMPC definitions, covering online marketplaces, inventory-led platforms and any digital or electronic means by which a pre-packaged commodity is offered for sale.",
            hi: "परिभाषा: 2017 संशोधन ने LMPC परिभाषाओं में \"ई-कॉमर्स\" भी जोड़ा, जिसमें ऑनलाइन मार्केटप्लेस, इन्वेंटरी-आधारित प्लेटफॉर्म तथा किसी पैकेज्ड वस्तु को बिक्री हेतु प्रस्तुत करने का कोई भी डिजिटल या इलेक्ट्रॉनिक साधन सम्मिलित है।",
          },
        ],
      },
      {
        id: "listing-declarations",
        headingEn: "Mandatory Listing Declarations",
        headingHi: "अनिवार्य लिस्टिंग घोषणाएं",
        blocks: [
          {
            kind: "table",
            headersEn: ["Declaration", "Physical Package (Rule 6(1))", "E-Commerce Listing (Rule 6(10))"],
            headersHi: ["घोषणा", "भौतिक पैकेज (नियम 6(1))", "ई-कॉमर्स लिस्टिंग (नियम 6(10))"],
            rowsEn: [
              ["Manufacturer / packer / importer name & address", "Mandatory", "Mandatory"],
              ["Common / generic name of commodity", "Mandatory", "Mandatory"],
              ["Net quantity", "Mandatory", "Mandatory"],
              ["Month & year of manufacture / pre-packing", "Mandatory", "STATUTORILY EXEMPT on listings"],
              ["Retail sale price (MRP, incl. all taxes)", "Mandatory", "Mandatory"],
              ["Consumer care details", "Mandatory", "Mandatory"],
              ["Country of origin (imported goods)", "Mandatory", "Mandatory, searchable/sortable display per 2026 amendments"],
              ["Unit sale price (G.S.R. 779(E))", "Mandatory (from 1 April 2022)", "Mandatory"],
            ],
            rowsHi: [
              ["निर्माता / पैकर / आयातक नाम एवं पता", "अनिवार्य", "अनिवार्य"],
              ["वस्तु का सामान्य / जेनेरिक नाम", "अनिवार्य", "अनिवार्य"],
              ["शुद्ध मात्रा", "अनिवार्य", "अनिवार्य"],
              ["निर्माण / प्री-पैकिंग का माह एवं वर्ष", "अनिवार्य", "लिस्टिंग पर सांवधिक रूप से छूट प्राप्त"],
              ["खुदरा विक्रय मूल्य (MRP, समस्त कर सहित)", "अनिवार्य", "अनिवार्य"],
              ["उपभोक्ता देखभाल विवरण", "अनिवार्य", "अनिवार्य"],
              ["मूल देश (आयातित वस्तुएं)", "अनिवार्य", "अनिवार्य, 2026 संशोधनों के अनुसार खोज/क्रम-योग्य प्रदर्शन"],
              ["इकाई विक्रय मूल्य (जी.एस.आर. 779(ई))", "अनिवार्य (1 अप्रैल 2022 से)", "अनिवार्य"],
            ],
          },
          {
            kind: "note",
            tone: "statutory",
            en: "Why manufacturing dates are exempt online: inventory rotates across fulfilment centres, so a listing page cannot truthfully carry a single manufacturing month/year. Marking an e-commerce listing non-compliant for a missing manufacturing date is a basic legal error, Veriq's rule engine skips that check for Rule 6(10) evaluations while enforcing it on physical packages.",
            hi: "निर्माण दिनांक ऑनलाइन क्यों छूट प्राप्त है: इन्वेंटरी फुलफिलमेंट सेंटरों में घूमती रहती है, अतः लिस्टिंग पृष्ठ ईमानदारीपूर्वक एकल निर्माण माह/वर्ष नहीं दिखा सकता। निर्माण दिनांक अनुपस्थिति हेतु ई-कॉमर्स लिस्टिंग को अनुपालन-बाहर मानना मूलभूत विधिक त्रुटि है, Veriq का नियम इंजन नियम 6(10) मूल्यांकन में वह जांच छोड़ देता है, जबकि भौतिक पैकेजों पर इसे लागू रखता है।",
          },
        ],
      },
      {
        id: "country-origin",
        headingEn: "Country of Origin Strengthening (2026)",
        headingHi: "मूल देश सुदृढ़ीकरण (2026)",
        blocks: [
          {
            kind: "p",
            en: "The amendment rules of 2026 tighten imported-goods disclosure on marketplaces: e-commerce entities selling imported products must display the country of origin for each product and provide a searchable or sortable country-of-origin filter, so consumers can exercise preference without leaving the listing experience. Veriq's e-commerce scrutiny (FR-02) validates both the declaration and the filter capability.",
            hi: "2026 के संशोधन नियम मार्केटप्लेस पर आयातित वस्तुओं के प्रकटीकरण को कसते हैं: आयातित उत्पाद बेचने वाली ई-कॉमर्स इकाइयों को प्रत्येक उत्पाद हेतु मूल देश प्रदर्शित करना तथा खोजने-योग्य या क्रम-योग्य मूल-देश फ़िल्टर उपलब्ध कराना अनिवार्य है, ताकि उपभोक्ता लिस्टिंग अनुभव छोड़े बिना अपनी प्राथमिकता का प्रयोग कर सके। Veriq का ई-कॉमर्स अंकन (FR-02) घोषणा एवं फ़िल्टर क्षमता दोनों को सत्यापित करता है।",
          },
        ],
      },
      {
        id: "violations",
        headingEn: "Common Listing Violations Veriq Detects",
        headingHi: "Veriq द्वारा पहचानी जाने वाली सामान्य लिस्टिंग विसंगतियां",
        blocks: [
          {
            kind: "list",
            itemsEn: [
              "Missing manufacturer / importer address on the listing page (most frequent violation).",
              "Net quantity absent or expressed in banned units (\"gms\", \"ML\", \"ltrs\").",
              "MRP missing, or MRP not inclusive of all taxes.",
              "Country of origin absent for imported goods, or not searchable/sortable where required.",
              "Unit sale price missing or mathematically inconsistent with MRP ÷ net quantity.",
              "Listing image of the label that contradicts the declared text (image-vs-text conflict resolution flow).",
            ],
            itemsHi: [
              "लिस्टिंग पृष्ठ पर निर्माता / आयातक पता अनुपस्थित (सर्वाधिक सामान्य विसंगति)।",
              "शुद्ध मात्रा अनुपस्थित या निषिद्ध इकाइयों में (\"gms\", \"ML\", \"ltrs\")।",
              "MRP अनुपस्थित, या MRP समस्त करों सहित नहीं।",
              "आयातित वस्तुओं हेतु मूल देश अनुपस्थित, या जहां आवश्यक वहां खोज/क्रम-योग्य नहीं।",
              "इकाई विक्रय मूल्य अनुपस्थित या MRP ÷ शुद्ध मात्रा से गणितीय असंगत।",
              "लेबल की लिस्टिंग छवि जो घोषित पाठ के विरुद्ध हो (छवि-बनाम-पाठ संघर्ष समाधान प्रवाह)।",
            ],
          },
          {
            kind: "p",
            en: "Enforcement context: marketplaces have historically argued intermediary status under Section 79 of the Information Technology Act, 2000 to distance themselves from seller declarations. Rule 6(10) closes that gap by binding the e-commerce entity itself to the display obligation, Veriq records both the listing URL and the captured label image as co-located evidence.",
            hi: "प्रवर्तन संदर्भ: मार्केटप्लेस ने ऐतिहासिक रूप से सूचना प्रौद्योगिकी अधिनियम, 2000 की धारा 79 के अंतर्गत मध्यस्थ (intermediary) दर्जा दावा कर विक्रेता घोषणाओं से स्वयं को दूर रखा है। नियम 6(10) उस अंतर को बंद करता है क्योंकि यह ई-कॉमर्स इकाई को स्वयं प्रदर्शन दायित्व से बांधता है, Veriq लिस्टिंग URL एवं कैप्चर की गई लेबल छवि दोनों को सह-स्थित साक्ष्य के रूप में अभिलिखित करता है।",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 5. Unit Sale Price Mandate, G.S.R. 779(E)
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "usp-gsr-779e",
    category: "statutory",
    titleEn: "Unit Sale Price (USP) Mandate, G.S.R. 779(E)",
    titleHi: "इकाई विक्रय मूल्य (USP) अधिदेश, जी.एस.आर. 779(ई)",
    shortEn: "Unit Sale Price Mandate GSR 779(E)",
    shortHi: "इकाई विक्रय मूल्य अधिदेश जीएसआर 779(ई)",
    ledeEn:
      "The anti-shrinkflation mandate. Through the amendment notified as G.S.R. 779(E) dated 28 October 2021, effective 1 April 2022, the LMPC Rules require every pre-packaged commodity to declare a Unit Sale Price: the MRP broken down per gram, per millilitre, per metre or per number, so consumers can compare packs of different sizes on equal footing.",
    ledeHi:
      "श्रिंकफ्लेशन-रोधी अधिदेश। जी.एस.आर. 779(ई) दिनांक 28 अक्टूबर 2021, प्रभावी 1 अप्रैल 2022, द्वारा अधिसूचित संशोधन के माध्यम से LMPC नियम प्रत्येक पैकेज्ड वस्तु पर इकाई विक्रय मूल्य (USP) घोषित करना अनिवार्य करते हैं: MRP को प्रति ग्राम, प्रति मिलीलीटर, प्रति मीटर या प्रति संख्या तोड़कर, ताकि उपभोक्ता भिन्न आकारों की तुलना समान आधार पर कर सके।",
    sourceUrl: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1776806",
    sourceLabelEn: "PIB, Amendment Press Release",
    sourceLabelHi: "PIB, संशोधन प्रेस विज्ञप्ति",
    meta: [
      {
        labelEn: "Gazette No.",
        labelHi: "राजपत्र संख्या",
        valueEn: "G.S.R. 779(E), dated 28 October 2021",
        valueHi: "जी.एस.आर. 779(ई), दिनांक 28 अक्टूबर 2021",
      },
      {
        labelEn: "Effective From",
        labelHi: "प्रभावी दिनांक",
        valueEn: "1 April 2022",
        valueHi: "1 अप्रैल 2022",
      },
      {
        labelEn: "Declaration",
        labelHi: "घोषणा",
        valueEn: "Rule 6(1), Unit Sale Price, rounded to 2 decimal places",
        valueHi: "नियम 6(1), इकाई विक्रय मूल्य, 2 दशमलव तक पूर्णांकित",
      },
      {
        labelEn: "Invariant",
        labelHi: "अपरिवर्तनीयता",
        valueEn: "USP = MRP ÷ Net Quantity",
        valueHi: "USP = MRP ÷ शुद्ध मात्रा",
      },
    ],
    related: ["lmpc-rules-2011", "ecommerce-rule-6-10", "legal-metrology-act-2009"],
    sections: [
      {
        id: "what-is-usp",
        headingEn: "What the Unit Sale Price Prevents",
        headingHi: "इकाई विक्रय मूल्य क्या रोकता है",
        blocks: [
          {
            kind: "p",
            en: "Deceptive pack sizing, shrinking the contents while keeping the same price and the same box, is invisible when only the MRP is displayed. The Unit Sale Price exposes it: by forcing every pack to declare its MRP per unit of content, two brands of 500 g and 480 g at the same ₹100 MRP immediately reveal different per-gram prices (₹0.20 vs ₹0.208). The mandate therefore protects the consumer's ability to compare value across package sizes and across brands.",
            hi: "भ्रामक पैक आकार, वही मूल्य और वही बॉक्स रखते हुए सामग्री घटाना, केवल MRP दिखाने पर अदृश्य रहता है। इकाई विक्रय मूल्य उसे उजागर करता है: प्रत्येक पैक को अपनी सामग्री-इकाई प्रति MRP घोषित करने के लिए बाध्य करके, एक ही ₹100 MRP वाले 500 ग्राम और 480 ग्राम के दो ब्रांड तुरंत भिन्न प्रति-ग्राम मूल्य दिखाते हैं (₹0.20 बनाम ₹0.208)। अतः यह अधिदेश पैकेज आकारों एवं ब्रांडों में मूल्य तुलना की उपभोक्ता क्षमता की रक्षा करता है।",
          },
        ],
      },
      {
        id: "mechanics",
        headingEn: "Declaration Mechanics",
        headingHi: "घोषणा तंत्र",
        blocks: [
          {
            kind: "list",
            itemsEn: [
              "Unit Sale Price = Retail Sale Price (MRP) ÷ Net Quantity, rounded off to the nearest two decimal places.",
              "\"₹ / per g\" for commodities with net quantity less than 1 kg; \"₹ / per kg\" for 1 kg or more.",
              "\"₹ / per ml\" for net quantity less than 1 litre; \"₹ / per litre\" for 1 litre or more.",
              "\"₹ / per metre\" for length-based commodities.",
              "\"₹ / per number (unit)\" only where the commodity is actually sold by number or unit.",
            ],
            itemsHi: [
              "इकाई विक्रय मूल्य = खुदरा विक्रय मूल्य (MRP) ÷ शुद्ध मात्रा, निकटतम दो दशमलव स्थानों तक पूर्णांकित।",
              "\"₹ / प्रति ग्राम\" जब शुद्ध मात्रा 1 किग्रा से कम हो; \"₹ / प्रति किग्रा\" जब 1 किग्रा या अधिक।",
              "\"₹ / प्रति मिली\" जब शुद्ध मात्रा 1 लीटर से कम; \"₹ / प्रति लीटर\" जब 1 लीटर या अधिक।",
              "\"₹ / प्रति मीटर\" लंबाई-आधारित वस्तुओं हेतु।",
              "\"₹ / प्रति संख्या (इकाई)\" केवल जहां वस्तु वास्तव में संख्या या इकाई से बेची जाती है।",
            ],
          },
          {
            kind: "p",
            en: "Refinements effective 1 October 2022 (LMPC Amendment Rules, 2022): the per-number declaration is required only where sale genuinely happens by number or unit, and packages where the MRP equals the unit sale price (e.g., single-unit packs) are exempt from repeating a separate USP declaration. Veriq's temporal epoch router applies the USP check only to manufacturing dates within the mandate window.",
            hi: "1 अक्टूबर 2022 से प्रभावी परिष्कार (LMPC संशोधन नियम, 2022): प्रति-संख्या घोषणा केवल तब आवश्यक है जब विक्रय वास्तव में संख्या या इकाई से हो, तथा जिन पैकेजों में MRP ही इकाई विक्रय मूल्य के बराबर है (जैसे एकल-इकाई पैक), वहां पृथक USP घोषणा दोहराने से छूट है। Veriq का कालिक युग राउटर (temporal epoch router) USP जांच केवल अधिदेश विंडो में आने वाली निर्माण दिनांकों पर लागू करता है।",
          },
        ],
      },
      {
        id: "validation",
        headingEn: "Veriq USP Math Validation",
        headingHi: "Veriq USP गणित सत्यापन",
        blocks: [
          {
            kind: "p",
            en: "The rule engine does not merely check USP presence, it recomputes the invariant and measures the deviation. The frozen tolerance from the repository's decision log is:",
            hi: "नियम इंजन केवल USP की उपस्थिति नहीं जांचता, वह अपरिवर्तनीयता को पुनः गणना कर विचलन मापता है। रिपॉजिटरी के निर्णय लॉज की स्थिर सहनशीलता है:",
          },
          {
            kind: "code",
            captionEn: "USP invariant (repository rule-engine tolerance)",
            captionHi: "USP अपरिवर्तनीयता (रिपॉजिटरी नियम-इंजन सहनशीलता)",
            text: `|(USP × NetQty) − MRP| ≤ ₹0.02`,
          },
          {
            kind: "table",
            headersEn: ["MRP", "Net Quantity", "Computed USP", "Verdict Path"],
            headersHi: ["MRP", "शुद्ध मात्रा", "गणित USP", "निर्णय पथ"],
            rowsEn: [
              ["₹100.00", "500 g", "₹0.20 / g", "PASS when declared USP rounds to 0.20"],
              ["₹104.00", "480 g", "₹0.2167 / g → ₹0.22 declared", "PASS (declared = rounded computation)"],
              ["₹100.00", "500 g", "declared ₹0.25 / g", "FAIL, declared USP ≠ MRP ÷ NetQty"],
            ],
            rowsHi: [
              ["₹100.00", "500 ग्राम", "₹0.20 / ग्राम", "PASS जब घोषित USP 0.20 तक पूर्णांकित हो"],
              ["₹104.00", "480 ग्राम", "₹0.2167 / ग्राम → ₹0.22 घोषित", "PASS (घोषित = पूर्णांकित गणना)"],
              ["₹100.00", "500 ग्राम", "घोषित ₹0.25 / ग्राम", "FAIL, घोषित USP ≠ MRP ÷ शुद्ध मात्रा"],
            ],
          },
          {
            kind: "note",
            tone: "info",
            en: "Rounding rule: the platform compares the declared USP against the statutory rounding of MRP ÷ NetQty to two decimals, then applies the ₹0.02 invariant as the REVIEW band boundary, borderline deviations inside the band route to officer review, outside it route to FAIL.",
            hi: "पूर्णांकन नियम: प्लेटफॉर्म घोषित USP की तुलना MRP ÷ शुद्ध मात्रा के सांवधिक दो-दशमलव पूर्णांकन से करता है, फिर ₹0.02 अपरिवर्तनीयता को REVIEW बैंड सीमा के रूप में लागू करता है, बैंड के भीतर के सीमांत विचलन अधिकारी समीक्षा हेतु और बाहर के FAIL हेतु रूट होते हैं।",
          },
        ],
      },
    ],
  },
];
