/**
 * Authoritative Demonstration Scenario Catalog for Veriq
 * Models the 7 Golden Statutory Demonstration Scenarios per 12_DEMO_PLAN.md
 * and 11_TESTING_AND_VALIDATION_PLAN.md.
 * 
 * Strict boundary:
 * - All demonstration cases are pre-certified golden test fixtures.
 * - Truthfully tagged as DEMO FIXTURE across all UI surfaces.
 * - Never misrepresents synthetic data as live seized enforcement records.
 */

export interface DemoScenarioItem {
  scenarioNumber: number;
  totalScenarios: number;
  skuId: string;
  caseId: string;
  inspectionNumber: string;
  title: string;
  titleHi: string;
  category: string;
  categoryHi: string;
  packageType: string;
  packageTypeHi: string;
  targetVerdict: "FAIL" | "PASS" | "REVIEW" | "UNABLE_TO_VERIFY";
  verdictLabel: string;
  verdictLabelHi: string;
  headlineViolation: string;
  headlineViolationHi: string;
  statutoryRules: string[];
  statutoryRulesHi: string[];
  testedCapabilities: string[];
  testedCapabilitiesHi: string[];
  detailedRationale: string;
  detailedRationaleHi: string;
  evaluatorGuide: string;
  evaluatorGuideHi: string;
  imagePath: string;
  pdpAreaCm2: number;
  expectedFontMm: number;
  observedFontMm?: number;
  mrpInr?: number;
  uspDeclared?: string;
  uspCalculated?: string;
}

export const DEMO_SCENARIOS: DemoScenarioItem[] = [
  {
    scenarioNumber: 1,
    totalScenarios: 13,
    skuId: "SKU-DEMO-01",
    caseId: "SKU-DEMO-01",
    inspectionNumber: "INSP-20260910-B144",
    title: "Sunfeast Butter Cookies 200g",
    titleHi: "सनफीस्ट बटर कुकीज़ 200g",
    category: "Food & Snacks",
    categoryHi: "खाद्य एवं स्नैक्स",
    packageType: "Rectangular Cardboard Carton",
    packageTypeHi: "आयताकार गत्ता कार्टन",
    targetVerdict: "FAIL",
    verdictLabel: "STATUTORY VIOLATION",
    verdictLabelHi: "सांविधिक उल्लंघन (अनुत्तीर्ण)",
    headlineViolation: "Table-I Font Deficit 1.84 mm vs 2.50 mm + Banned 'gms' Unit",
    headlineViolationHi: "तालिका-I फॉन्ट कमी 1.84 मिमी बनाम 2.50 मिमी + प्रतिबंधित 'gms' इकाई",
    statutoryRules: [
      "Rule 6(1)(h) read with Table-I, G.S.R. 629(E)",
      "Section 11 LM Act, 2009 read with Rule 12 LMPC Rules, 2011",
      "Section 36(1) Legal Metrology Act, 2009 read with LMPC Rules, 2011",
    ],
    statutoryRulesHi: [
      "नियम 6(1)(h) सहपठित तालिका-I, जीएसआर 629(E)",
      "धारा 11 एलएम अधिनियम, 2009 सहपठित नियम 12 एलएमपीसी नियम, 2011",
      "धारा 36(1) विधिक मापविज्ञान अधिनियम, 2009 सहपठित एलएमपीसी नियम, 2011",
    ],
    testedCapabilities: [
      "Optical Quality Gate (Sharpness & Exposure Verified)",
      "ArUco 4x4 Planar Metric Homography Calibration",
      "Multilingual DBNet++ & PP-OCRv4 Tokenization",
      "Table-I Minimum Numeral Height Schedule Engine",
      "Banned Unit Regex Flagger ('gms' -> standard 'g')",
      "Section 63 BSA 2023 Merkle Proof & Form-1 Compounding Notice",
    ],
    testedCapabilitiesHi: [
      "प्रकाशीय गुणवत्ता द्वार (तीक्ष्णता एवं उद्भासन सत्यापित)",
      "ArUco 4x4 समतलीय मीट्रिक होमोग्राफी अंशांकन",
      "बहुभाषी DBNet++ एवं PP-OCRv4 टोकनीकरण",
      "तालिका-I न्यूनतम अंक ऊंचाई अनुसूची इंजन",
      "प्रतिबंधित मात्रक फ़्लैगर ('gms' -> मानक 'g')",
      "धारा 63 बीएसए 2023 मर्कल प्रमाण एवं प्रपत्र-1 समझौता नोटिस",
    ],
    detailedRationale:
      "Principal Display Panel area (144 cm²) falls within 100 < Area <= 500 cm² bracket, mandating minimum 2.50 mm numeral height under Table-I Row 3. Measured height is 1.84 mm (-26.4% deficit). In addition, using 'gms' instead of SI standard 'g' contravenes Rule 12 of LMPC Rules, 2011 and Section 11 of the LM Act, 2009.",
    detailedRationaleHi:
      "मुख्य प्रदर्शन पैनल क्षेत्रफल (144 सेमी²) 100 < क्षेत्रफल <= 500 सेमी² ब्रैकेट में आता है, जिसके अंतर्गत तालिका-I पंक्ति 3 के अनुसार न्यूनतम 2.50 मिमी अंक ऊंचाई अनिवार्य है। मापी गई ऊंचाई 1.84 मिमी (-26.4% कमी) है। साथ ही, मानक 'g' के स्थान पर 'gms' का प्रयोग एलएमपीसी नियम, 2011 के नियम 12 एवं एलएम अधिनियम, 2009 की धारा 11 का स्पष्ट उल्लंघन है।",
    evaluatorGuide:
      "Inspect the calibrated packaging canvas to verify the red bounding box around '200 gms'. Note the 1.84 mm vs 2.50 mm deficit in the rule card, and click 'Generate Form-1 Notice' to view the automated compounding notice.",
    evaluatorGuideHi:
      "कैलिब्रेटेड पैकेजिंग कैनवास पर '200 gms' के चारों ओर लाल बाउंडिंग बॉक्स का निरीक्षण करें। नियम कार्ड में 1.84 मिमी बनाम 2.50 मिमी का अंतर देखें और स्वचालित नोटिस हेतु 'प्रपत्र-1 नोटिस तैयार करें' पर क्लिक करें।",
    imagePath: "/storage/uploads/sku_demo_01_biscuit.jpg",
    pdpAreaCm2: 144.0,
    expectedFontMm: 2.5,
    observedFontMm: 1.84,
    mrpInr: 75.0,
  },
  {
    scenarioNumber: 2,
    totalScenarios: 13,
    skuId: "SKU-DEMO-02",
    caseId: "SKU-DEMO-02",
    inspectionNumber: "INSP-20260910-C208",
    title: "Ready Curry Retort Pouch 300g",
    titleHi: "रेडी करी रिटॉर्ट पाउच 300g",
    category: "Ready-to-Eat Food",
    categoryHi: "तैयार खाद्य उत्पाद",
    packageType: "Flexible Stand-up Pouch",
    packageTypeHi: "फ्लेक्सिबल स्टैंड-अप पाउच",
    targetVerdict: "FAIL",
    verdictLabel: "USP MATH MISMATCH",
    verdictLabelHi: "यूएसपी गणितीय विसंगति (अनुत्तीर्ण)",
    headlineViolation: "Rule 6(1)(e) USP Mismatch (Declared ₹0.28 vs Calc ₹0.23/g) + Missing Email",
    headlineViolationHi: "नियम 6(1)(e) यूएसपी विसंगति (घोषित ₹0.28 बनाम परिकलित ₹0.23/g) + ईमेल अनुपस्थित",
    statutoryRules: [
      "Rule 6(1)(e) read with GSR 779(E) (Unit Sale Price Mandate)",
      "Rule 6(1)(ab) Consumer Care Details Mandate (Missing Email)",
      "Section 36(1) LM Act, 2009 & LMPC Rules, 2011",
    ],
    statutoryRulesHi: [
      "नियम 6(1)(e) सहपठित जीएसआर 779(E) (इकाई विक्रय मूल्य)",
      "नियम 6(1)(ab) उपभोक्ता सेवा विवरण (ईमेल अनुपस्थित)",
      "धारा 36(1) विधिक मापविज्ञान अधिनियम, 2009 एवं एलएमपीसी नियम, 2011",
    ],
    testedCapabilities: [
      "Unit Sale Price (USP) Mathematical Verification Engine",
      "Consumer Care Contact Details Extraction & Validation",
      "Temporal Epoch Router (Enforcing post-Jan 2022 USP mandate)",
      "Multi-finding Severity Aggregation",
    ],
    testedCapabilitiesHi: [
      "इकाई विक्रय मूल्य (यूएसपी) गणितीय सत्यापन इंजन",
      "उपभोक्ता सेवा संपर्क विवरण निष्कर्षण एवं सत्यापन",
      "कालिक कालखंड राउटर (जनवरी 2022 उपरांत यूएसपी जनादेश)",
      "बहु-खोज गंभीरता एकत्रीकरण",
    ],
    detailedRationale:
      "MRP is ₹70.00 for 300 g. Calculated USP is ₹70 / 300 = ₹0.2333/g (rounded to ₹0.23/g). Package declares ₹0.28/g, which deviates by ₹0.05/g (|Declared - Calculated| = 0.05 > 0.02 INR statutory tolerance). Furthermore, consumer care email is missing.",
    detailedRationaleHi:
      "300 ग्राम हेतु एमआरपी ₹70.00 है। परिकलित यूएसपी ₹70 / 300 = ₹0.2333/ग्राम (निकटतम ₹0.23/ग्राम) है। पैकेज पर ₹0.28/ग्राम घोषित है, जो ₹0.05/ग्राम विचलित है (सांविधिक सहिष्णुता सीमा ₹0.02 से अधिक)। साथ ही उपभोक्ता देखभाल ईमेल अनुपस्थित है।",
    evaluatorGuide:
      "Examine the Unit Sale Price discrepancy card. Notice that the mathematical validation engine automatically computes the expected rate per gram and flags both the math mismatch and consumer care omission.",
    evaluatorGuideHi:
      "इकाई विक्रय मूल्य विसंगति कार्ड का परीक्षण करें। देखें कि गणितीय सत्यापन इंजन स्वचालित रूप से प्रति ग्राम अपेक्षित दर की गणना करता है और विसंगति को रेखांकित करता है।",
    imagePath: "/storage/uploads/sku_demo_02_curry.jpg",
    pdpAreaCm2: 120.0,
    expectedFontMm: 2.5,
    observedFontMm: 2.7,
    mrpInr: 70.0,
    uspDeclared: "₹0.28 / g",
    uspCalculated: "₹0.23 / g",
  },
  {
    scenarioNumber: 3,
    totalScenarios: 13,
    skuId: "SKU-DEMO-03",
    caseId: "SKU-DEMO-03",
    inspectionNumber: "INSP-20260910-W312",
    title: "Packaged Natural Mineral Water 1L",
    titleHi: "पैकेजबंद प्राकृतिक खनिज जल 1L",
    category: "Beverages / Water",
    categoryHi: "पेय पदार्थ / जल",
    packageType: "Cylindrical PET Bottle",
    packageTypeHi: "बेलनाकार पीईटी बोतल",
    targetVerdict: "PASS",
    verdictLabel: "100% STATUTORY COMPLIANT",
    verdictLabelHi: "100% सांविधिक अनुपालन (उत्तीर्ण)",
    headlineViolation: "Full Statutory Compliance (Cylindrical PDP 40% Area, Font 3.1mm, Valid USP)",
    headlineViolationHi: "पूर्ण सांविधिक अनुपालन (बेलनाकार पीडीपी 40% क्षेत्रफल, फॉन्ट 3.1मिमी, मान्य यूएसपी)",
    statutoryRules: [
      "Rule 6(1) Complete Mandatory Declarations Verified",
      "Rule 6(1)(h) Table-I Row 3 (Observed 3.10 mm >= 2.50 mm)",
      "Rule 6(1)(e) USP Consistent (₹20.00 / L)",
      "Section 11 LM Act, 2009 & Rule 12 LMPC Rules, 2011 (Standard SI unit 'L' verified)",
    ],
    statutoryRulesHi: [
      "नियम 6(1) संपूर्ण अनिवार्य घोषणाएं सत्यापित",
      "नियम 6(1)(h) तालिका-I पंक्ति 3 (प्रेक्षित 3.10 मिमी >= 2.50 मिमी)",
      "नियम 6(1)(e) यूएसपी सुसंगत (₹20.00 / L)",
      "धारा 11 एलएम अधिनियम, 2009 व नियम 12 एलएमपीसी नियम, 2011 (मानक एसआई मात्रक 'L' सत्यापित)",
    ],
    testedCapabilities: [
      "Cylindrical Packaging Surface Area Geometry Calculation",
      "Principal Display Panel (PDP) 40% Projection Schedule",
      "Full Metric Schedule Verification",
      "Section 63 BSA Tamper-Proof Clearance Certificate Generation",
    ],
    testedCapabilitiesHi: [
      "बेलनाकार पैकेजिंग सतह क्षेत्रफल ज्यामिति गणना",
      "मुख्य प्रदर्शन पैनल (पीडीपी) 40% प्रक्षेपण अनुसूची",
      "पूर्ण मीट्रिक अनुसूची सत्यापन",
      "धारा 63 बीएसए छेड़छाड़-रोधी प्रमाण पत्र उत्पादन",
    ],
    detailedRationale:
      "Cylindrical container has surface area of 785 cm² with 40% PDP area of 314 cm² (requiring >= 2.50 mm height). Observed numeral height is 3.10 mm (+24% safety margin). MRP ₹20.00 matches calculated USP of ₹20.00 / L. All mandatory declarations present.",
    detailedRationaleHi:
      "बेलनाकार कंटेनर का सतह क्षेत्रफल 785 सेमी² है जिसमें 40% पीडीपी क्षेत्रफल 314 सेमी² है (न्यूनतम 2.50 मिमी आवश्यक)। प्रेक्षित अंक ऊंचाई 3.10 मिमी (+24% सुरक्षा मार्जिन) है। एमआरपी ₹20.00 परिकलित यूएसपी ₹20.00 / L से पूर्णतः मेल खाता है।",
    evaluatorGuide:
      "Notice the green PASS indicators across all 5 statutory dimensions. The officer can issue an official Certificate of Compliance under Section 63 of BSA 2023 with cryptographic signature.",
    evaluatorGuideHi:
      "सभी 5 सांविधिक आयामों में हरे PASS संकेतकों का अवलोकन करें। अधिकारी डिजिटल हस्ताक्षर के साथ धारा 63 के तहत अनुपालन प्रमाण पत्र जारी कर सकता है।",
    imagePath: "/storage/uploads/sku_demo_03_water.jpg",
    pdpAreaCm2: 314.0,
    expectedFontMm: 2.5,
    observedFontMm: 3.1,
    mrpInr: 20.0,
    uspDeclared: "₹20.00 / L",
    uspCalculated: "₹20.00 / L",
  },
  {
    scenarioNumber: 4,
    totalScenarios: 13,
    skuId: "SKU-DEMO-04",
    caseId: "SKU-DEMO-04",
    inspectionNumber: "INSP-20260910-S419",
    title: "Herbal Bathing Soap Bar 125g",
    titleHi: "हर्बल बाथिंग साबुन बार 125g",
    category: "Cosmetics & Personal Care",
    categoryHi: "सौंदर्य प्रसाधन एवं व्यक्तिगत स्वच्छता",
    packageType: "Rectangular Paper Wrap",
    packageTypeHi: "आयताकार पेपर रैपर",
    targetVerdict: "REVIEW",
    verdictLabel: "HUMAN OFFICER REVIEW",
    verdictLabelHi: "मानव अधिकारी समीक्षा (रिव्यू)",
    headlineViolation: "Borderline Font Measurement (2.46 mm within sensor k=2 uncertainty band)",
    headlineViolationHi: "सीमांत फॉन्ट माप (सेंसर k=2 अनिश्चितता बैंड में 2.46 मिमी)",
    statutoryRules: [
      "Rule 6(1)(h) read with Table-I Row 3 (Required >= 2.50 mm)",
      "ISO/IEC Guide 98-3 (GUM) Metrological Measurement Uncertainty",
      "Human-in-the-Loop (HITL) Statutory Adjudication Principle",
    ],
    statutoryRulesHi: [
      "नियम 6(1)(h) सहपठित तालिका-I पंक्ति 3 (अपेक्षित >= 2.50 मिमी)",
      "आईएसओ/आईईसी गाइड 98-3 माप संबंधी अनिश्चितता सिद्धांत",
      "ह्यूमन-इन-द-लूप (एचआईटीएल) सांविधिक निर्णय सिद्धांत",
    ],
    testedCapabilities: [
      "Metrological Sensor Uncertainty Band Computation (k=2, 95% Confidence)",
      "Epistemic 4-State Verdict Classification (REVIEW vs premature FAIL)",
      "Zero False Accusation Evidentiary Guardrail",
      "Officer Manual Caliper Retest Recommendation Interface",
    ],
    testedCapabilitiesHi: [
      "मापिकी सेंसर अनिश्चितता बैंड गणना (k=2, 95% विश्वास अंतराल)",
      "ज्ञानमीमांसा 4-अवस्था निर्णय वर्गीकरण (समीक्षा बनाम असामयिक असफलता)",
      "शून्य असत्य आरोप साक्ष्य सुरक्षा तंत्र",
      "अधिकारी भौतिक कैलिपर पुनः परीक्षण संस्तुति इंटरफेस",
    ],
    detailedRationale:
      "Required minimum height is 2.50 mm. The optical vision pipeline measured 2.46 mm. However, sensor calibration margin of error is +/- 0.08 mm (95% confidence). Because 2.50 mm lies within [2.38, 2.54] mm, the system refuses to issue a false violation and escalates to human officer review.",
    detailedRationaleHi:
      "अपेक्षित न्यूनतम ऊंचाई 2.50 मिमी है। ऑप्टिकल विजन पाइपलाइन ने 2.46 मिमी मापा। हालांकि सेंसर अंशांकन त्रुटि सीमा +/- 0.08 मिमी (95% विश्वास) है। चूंकि 2.50 मिमी [2.38, 2.54] मिमी बैंड के भीतर आता है, सिस्टम असत्य आरोप लगाने से बचते हुए मानव अधिकारी समीक्षा हेतु अग्रेषित करता है।",
    evaluatorGuide:
      "Examine how the system protects the merchant from unwarranted prosecution. The officer can record physical digital caliper measurements or order a re-inspection.",
    evaluatorGuideHi:
      "परीक्षण करें कि कैसे सिस्टम विक्रेता को अवांछित अभियोजन से बचाता है। अधिकारी भौतिक डिजिटल कैलिपर माप दर्ज कर सकता है।",
    imagePath: "/storage/uploads/sku_demo_04_soap.jpg",
    pdpAreaCm2: 110.0,
    expectedFontMm: 2.5,
    observedFontMm: 2.46,
    mrpInr: 45.0,
  },
  {
    scenarioNumber: 5,
    totalScenarios: 13,
    skuId: "SKU-DEMO-05",
    caseId: "SKU-DEMO-05",
    inspectionNumber: "INSP-20260910-P525",
    title: "Crispy Potato Chips 75g",
    titleHi: "कुरकुरी आलू चिप्स 75g",
    category: "Food & Snacks",
    categoryHi: "खाद्य एवं स्नैक्स",
    packageType: "Glossy Metallic Pillow Pouch",
    packageTypeHi: "चमकदार मेटैलिक तकिया पाउच",
    targetVerdict: "UNABLE_TO_VERIFY",
    verdictLabel: "OPTICAL RETAKE REQUIRED",
    verdictLabelHi: "प्रकाशीय पुनः कैप्चर आवश्यक",
    headlineViolation: "Specular Glare Bloom (6.4% > 3.0% threshold) Obscuring Declarations",
    headlineViolationHi: "चकाचौंध फैलाव (6.4% > 3.0% सीमा) से घोषणाएं अस्पष्ट",
    statutoryRules: [
      "Section 63 BSA 2023 Digital Evidence Quality Standards",
      "Optical Quality Gate Thresholds (Glare Variance <= 3.0%)",
      "Field Inspector Guidance Protocol",
    ],
    statutoryRulesHi: [
      "धारा 63 बीएसए 2023 डिजिटल साक्ष्य गुणवत्ता मानक",
      "प्रकाशीय गुणवत्ता द्वार सीमाएं (चकाचौंध प्रसरण <= 3.0%)",
      "क्षेत्रीय निरीक्षक मार्गदर्शन प्रोटोकॉल",
    ],
    testedCapabilities: [
      "Automated Specular Glare & Reflection Detection",
      "Laplacian Blur Variance Quality Gate",
      "Real-time Camera HUD Retake Guidance Advisor",
      "Prevention of Judicial Rejection under Section 63 BSA 2023",
    ],
    testedCapabilitiesHi: [
      "स्वचालित चकाचौंध एवं परावर्तन पहचान",
      "लाप्लासियन ब्लर प्रसरण गुणवत्ता द्वार",
      "रीयल-टाइम कैमरा एचयूडी पुनः कैप्चर मार्गदर्शन",
      "धारा 63 बीएसए के तहत न्यायिक अस्वीकृति की रोकथाम",
    ],
    detailedRationale:
      "Glossy packaging caused specular flash bloom covering 6.4% of the panel area (statutory tolerance <= 3.0%). The net quantity text is obscured by glare. Rather than hallucinating or guessing OCR values, the system classifies the case as UNABLE_TO_VERIFY and instructs the officer to tilt the camera 15°.",
    detailedRationaleHi:
      "चमकदार पैकेजिंग के कारण 6.4% पैनल क्षेत्र पर फ्लैश चकाचौंध उत्पन्न हुई (सांविधिक सीमा <= 3.0%)। चकाचौंध से शुद्ध मात्रा का पाठ अस्पष्ट हो गया। ओसीआर में अनुमान लगाने के बजाय सिस्टम इसे UNABLE_TO_VERIFY वर्गीकृत करता है और कैमरे को 15° झुकाने की सलाह देता है।",
    evaluatorGuide:
      "Observe the Optical Quality Gate diagnostics card displaying the glare warning. Notice the camera re-shoot advisory providing exact angle corrections.",
    evaluatorGuideHi:
      "चकाचौंध चेतावनी प्रदर्शित करने वाले प्रकाशीय गुणवत्ता द्वार नैदानिक कार्ड का अवलोकन करें। कोण सुधार प्रदान करने वाली पुनः शूट सलाह देखें।",
    imagePath: "/storage/uploads/sku_demo_05_chips.jpg",
    pdpAreaCm2: 210.0,
    expectedFontMm: 2.5,
    mrpInr: 20.0,
  },
  {
    scenarioNumber: 6,
    totalScenarios: 13,
    skuId: "SKU-DEMO-06",
    caseId: "SKU-DEMO-06",
    inspectionNumber: "INSP-20260910-E631",
    title: "Premium Wireless Earbuds (E-Commerce)",
    titleHi: "प्रीमियम वायरलेस ईयरबड्स (ई-कॉमर्स)",
    category: "Electronics / E-Commerce",
    categoryHi: "इलेक्ट्रॉनिक्स / ई-कॉमर्स",
    packageType: "Digital Marketplace Single Listing",
    packageTypeHi: "डिजिटल मार्केटप्लेस एकल लिस्टिंग",
    targetVerdict: "FAIL",
    verdictLabel: "E-COMMERCE RULE 6(10) VIOLATION",
    verdictLabelHi: "ई-कॉमर्स नियम 6(10) उल्लंघन (अनुत्तीर्ण)",
    headlineViolation: "Rule 6(10) / GSR 594(E) Missing Mandatory Country of Origin Declaration",
    headlineViolationHi: "नियम 6(10) / जीएसआर 594(E) अनिवार्य मूल देश घोषणा अनुपस्थित",
    statutoryRules: [
      "Rule 6(10) read with Rule 6(1)(p) and G.S.R. 128(E) LMPC Rules, 2011",
      "Statutory Exemption for Mfg Date on digital listings (GSR 594(E))",
      "Section 36(1) read with Section 49 Legal Metrology Act, 2009 & LMPC Rules, 2011",
    ],
    statutoryRulesHi: [
      "नियम 6(10) सहपठित नियम 6(1)(p) एवं जीएसआर 128(E) एलएमपीसी नियम, 2011",
      "डिजिटल लिस्टिंग पर निर्माण तिथि हेतु सांविधिक छूट (जीएसआर 594(E))",
      "धारा 36(1) सहपठित धारा 49 विधिक मापविज्ञान अधिनियम, 2009 एवं एलएमपीसी नियम, 2011",
    ],
    testedCapabilities: [
      "E-Commerce Listing DOM & Snapshot Parsing Pipeline",
      "Country of Origin Verification with Indic Boundaries",
      "Rule 6(10) Statutory Exemption Architecture (Prevents False Mfg Date Flags)",
      "Digital Evidence Audit Record for Online Marketplaces",
    ],
    testedCapabilitiesHi: [
      "ई-कॉमर्स लिस्टिंग डोम एवं स्नैपशॉट पार्सिंग पाइपलाइन",
      "भारतीय सीमाओं के साथ मूल देश सत्यापन",
      "नियम 6(10) सांविधिक छूट आर्किटेक्चर (निर्माण तिथि पर असत्य झंडा रोक)",
      "ऑनलाइन मार्केटप्लेस हेतु डिजिटल साक्ष्य ऑडिट रिकॉर्ड",
    ],
    detailedRationale:
      "Under Rule 6(10) of LMPC Rules, 2011, all digital e-commerce marketplaces must declare manufacturer, net quantity, MRP, consumer care, and country of origin. This listing omits the Country of Origin. Importantly, the engine correctly identifies the statutory exemption for Manufacturing Date under GSR 594(E) and records an audit exemption instead of a false violation.",
    detailedRationaleHi:
      "एलएमपीसी नियम 2011 के नियम 6(10) के अंतर्गत सभी ई-कॉमर्स लिस्टिंग पर निर्माता, शुद्ध मात्रा, एमआरपी, उपभोक्ता सेवा और मूल देश का उल्लेख अनिवार्य है। लिस्टिंग में मूल देश अनुपस्थित है। प्रणाली निर्माण तिथि हेतु सांविधिक छूट को सही ढंग से पहचानती है।",
    evaluatorGuide:
      "Examine the E-Commerce audit panel. Notice that Country of Origin is flagged as a CRITICAL violation while Date of Manufacture is marked NOT_APPLICABLE with explicit citation to GSR 594(E).",
    evaluatorGuideHi:
      "ई-कॉमर्स ऑडिट पैनल का परीक्षण करें। ध्यान दें कि मूल देश को गंभीर उल्लंघन के रूप में चिह्नित किया गया है, जबकि निर्माण तिथि को जीएसआर 594(E) के तहत छूट दी गई है।",
    imagePath: "/storage/uploads/sku_demo_06_listing.png",
    pdpAreaCm2: 400.0,
    expectedFontMm: 2.5,
    mrpInr: 1499.0,
  },
  {
    scenarioNumber: 7,
    totalScenarios: 13,
    skuId: "demo-fortune-sunlite",
    caseId: "demo-fortune-sunlite",
    inspectionNumber: "INSP-20260910-F001",
    title: "Fortune Sunlite Refined Sunflower Oil 1L",
    titleHi: "फॉर्च्यून सनलाइट रिफाइंड सूर्यमुखी तेल 1L",
    category: "Edible Oils",
    categoryHi: "खाद्य तेल",
    packageType: "Flexible Liquid Pouch",
    packageTypeHi: "फ्लेक्सिबल लिक्विड पाउच",
    targetVerdict: "PASS",
    verdictLabel: "END-TO-END CALIBRATED BENCHMARK",
    verdictLabelHi: "एंड-टू-एंड अंशांकित बेंचमार्क (उत्तीर्ण)",
    headlineViolation: "Complete End-to-End Benchmark: ArUco Fiducial, Table-I Compliance, Section 63 Proof",
    headlineViolationHi: "पूर्ण बेंचमार्क: ArUco संदर्भ मानक, तालिका-I अनुपालन, धारा 63 प्रमाण",
    statutoryRules: [
      "Rule 6(1) Edible Oil Mandatory Declarations (Dual Units: 1 L / 910 g)",
      "Rule 6(1)(h) Table-I Row 3 (Observed 3.80 mm >= 2.50 mm)",
      "Rule 6(1)(k) Unit Sale Price Consistency (₹145.00 / L)",
      "Section 63 BSA 2023 Digital Evidence Certificate Generation",
    ],
    statutoryRulesHi: [
      "नियम 6(1) खाद्य तेल अनिवार्य घोषणाएं (दोहरी इकाइयां: 1 L / 910 g)",
      "नियम 6(1)(h) तालिका-I पंक्ति 3 (प्रेक्षित 3.80 मिमी >= 2.50 मिमी)",
      "नियम 6(1)(k) इकाई विक्रय मूल्य सुसंगतता (₹145.00 / L)",
      "धारा 63 बीएसए 2023 डिजिटल साक्ष्य प्रमाण पत्र उत्पादन",
    ],
    testedCapabilities: [
      "50mm ArUco Marker Planar Metric Rectification",
      "Edible Oil Dual Declaration Schedule (Volume + Mass in grams)",
      "Full Cryptographic SHA-256 Merkle DAG Chain of Custody",
      "ReportLab Form 1 Notice & Section 63 BSA Certificate",
    ],
    testedCapabilitiesHi: [
      "50 मिमी ArUco मार्कर समतलीय मीट्रिक परिशोधन",
      "खाद्य तेल दोहरी घोषणा अनुसूची (आयतन + ग्राम में द्रव्यमान)",
      "पूर्ण क्रिप्टोग्राफ़िक SHA-256 मर्कल डीएजी कस्टडी श्रृंखला",
      "रिपोर्टलैब प्रपत्र 1 नोटिस एवं धारा 63 बीएसए प्रमाण पत्र",
    ],
    detailedRationale:
      "High-fidelity reference case with 50mm ArUco fiducial detected (0.2325 mm/px scale). Both volume (1 L) and mass (910 g) are properly declared per Legal Metrology rules for edible oil packaging. Numeral font height of 3.80 mm comfortably exceeds Table-I 2.50 mm threshold. Complete SHA-256 Merkle DAG and Section 63 certificate verified.",
    detailedRationaleHi:
      "50 मिमी ArUco संदर्भ मानक सहित उच्च-सटीकता संदर्भ मामला। खाद्य तेल पैकेजिंग नियमों के अनुसार आयतन (1 L) और द्रव्यमान (910 ग्राम) दोनों विधिवत घोषित हैं। अंक ऊंचाई 3.80 मिमी तालिका-I के 2.50 मिमी से अधिक है। मर्कल डीएजी और धारा 63 प्रमाण पत्र सत्यापित।",
    evaluatorGuide:
      "This is the comprehensive showcase for end-to-end adjudication. Click through the Canvas, HUD, Audit Timeline, and Evidence Dossier tabs to see all 12 stages of the Veriq pipeline operating harmoniously.",
    evaluatorGuideHi:
      "यह एंड-टू-एंड न्यायनिर्णयन हेतु विस्तृत प्रदर्शन है। निरीक्षक पाइपलाइन के सभी 12 चरणों को सामंजस्य से कार्य करते हुए देखने के लिए कैनवास, एचयूडी, ऑडिट टाइमलाइन और साक्ष्य डोजियर टैब देखें।",
    imagePath: "/storage/uploads/REAL-PKG-01_8901719134845.jpg",
    pdpAreaCm2: 180.0,
    expectedFontMm: 2.5,
    observedFontMm: 3.8,
    mrpInr: 145.0,
    uspDeclared: "₹145.00 / L",
    uspCalculated: "₹145.00 / L",
  },
  {
    scenarioNumber: 8,
    totalScenarios: 13,
    skuId: "REAL-PKG-WATCH",
    caseId: "demo-fastrack-watch",
    inspectionNumber: "INSP-20260912-W001",
    title: "Fastrack Casual Analog Watch",
    titleHi: "फास्टट्रैक कैजुअल एनालॉग घड़ी",
    category: "Watches & Wearables",
    categoryHi: "घड़ियां एवं वियरेबल्स",
    packageType: "Tin / Metallic Box",
    packageTypeHi: "टिन / धातु बॉक्स",
    targetVerdict: "PASS",
    verdictLabel: "STATUTORY COMPLIANT",
    verdictLabelHi: "सांविधिक रूप से अनुपालित (उत्तीर्ण)",
    headlineViolation: "Compliant Rule 6 Declarations with Rule 6(1)(da) Distinct Unit USP Exemption",
    headlineViolationHi: "नियम 6(1)(da) विशिष्ट एकल इकाई यूएसपी छूट सहित नियम 6 अनुपालित घोषणाएं",
    statutoryRules: [
      "Rule 6(1)(da) Second Proviso (Exemption of Unit Sale Price for Distinct Single Unit)",
      "Rule 6(1)(a) & (b) Manufacturer & Marketer Declarations (Titan Company Limited)",
      "Rule 6(1)(p) Country of Origin Mandatory Declaration (CHINA)",
      "Rule 6(1)(e) Maximum Retail Price (₹ 2425.00 incl. of all taxes)",
    ],
    statutoryRulesHi: [
      "नियम 6(1)(da) द्वितीय परंतुक (विशिष्ट एकल वस्तु हेतु यूएसपी छूट)",
      "नियम 6(1)(a) एवं (b) निर्माता व विपणक घोषणाएं (टाइटन कंपनी लिमिटेड)",
      "नियम 6(1)(p) मूल देश की अनिवार्य घोषणा (चीन)",
      "नियम 6(1)(e) अधिकतम खुदरा मूल्य (₹ 2425.00 सभी कर सहित)",
    ],
    testedCapabilities: [
      "180° Inverted Crop Auto-Detection & Rectification",
      "Multi-Angle Packaging Tri-Panel Fusion (Front PDP + Back Panel + Macro)",
      "Rule 6(1)(da) Distinct Wearable USP Exemption Engine",
      "Section 63 BSA 2023 Digital Panchnama Generation",
    ],
    testedCapabilitiesHi: [
      "180° उल्टे क्रॉप का स्वतः पता लगाना एवं सीधा करना",
      "बहु-कोणीय पैकेजिंग त्रि-पैनल संलयन (फ्रंट PDP + बैक पैनल + मैक्रो)",
      "नियम 6(1)(da) विशिष्ट वियरेबल यूएसपी छूट इंजन",
      "धारा 63 बीएसए 2023 डिजिटल पंचनामा उत्पादन",
    ],
    detailedRationale:
      "Physical examination of real Titan Fastrack packaging. The macro close-up panel was captured upside down in the field; the OCR auto-inversion engine successfully detected 180° rotation, restoring confidence from 0.72 to 0.98. Declarations verified: MRP ₹ 2425.00, Net Qty 01 NUMBER, Country of Origin CHINA, Mfg Date 07/2026. Under Rule 6(1)(da) Second Proviso, packages containing a single distinct unit are statutory exempt from Unit Sale Price declarations.",
    detailedRationaleHi:
      "वास्तविक टाइटन फास्टट्रैक पैकेजिंग का भौतिक परीक्षण। फील्ड में मैक्रो क्लोज़-अप पैनल उल्टा कैप्चर हुआ था; ओसीआर ऑटो-इंवर्जन इंजन ने 180° घूर्णन का स्वतः पता लगाकर विश्वसनीयता 0.72 से 0.98 कर दी। सभी घोषणाएं सत्यापित: एमआरपी ₹ 2425.00, शुद्ध मात्रा 01 NUMBER, मूल देश चीन, निर्माण 07/2026। नियम 6(1)(da) के तहत एकल इकाई हेतु यूएसपी छूट लागू है।",
    evaluatorGuide:
      "Examine the Multi-Facet selector bar to view Front PDP, Back Panel, and Macro Close-Up. Notice how the auto-inversion engine correctly transcribed upside-down text from the macro shot, and verify the statutory Rule 6(1)(da) USP exemption card.",
    evaluatorGuideHi:
      "फ्रंट PDP, बैक पैनल, और मैक्रो क्लोज़-अप देखने के लिए मल्टी-फ़ैसेट चयनकर्ता बार देखें। ध्यान दें कि कैसे इंजन ने उल्टे शॉट को सही किया और नियम 6(1)(da) छूट कार्ड सत्यापित करें।",
    imagePath: "/storage/uploads/real_products/watch_front.jpg",
    pdpAreaCm2: 96.0,
    expectedFontMm: 1.5,
    observedFontMm: 3.2,
    mrpInr: 2425.0,
    uspDeclared: "EXEMPT (Rule 6(1)(da))",
    uspCalculated: "EXEMPT",
  },
  {
    scenarioNumber: 9,
    totalScenarios: 13,
    skuId: "REAL-PKG-BRAHMI",
    caseId: "demo-himalaya-brahmi",
    inspectionNumber: "INSP-20260912-B002",
    title: "Himalaya Pure Herbs Brahmi (60 Tablets)",
    titleHi: "हिमालया प्योर हर्ब्स ब्राह्मी (60 टैबलेट्स)",
    category: "Ayurvedic & Health Supplements",
    categoryHi: "आयुर्वेदिक एवं स्वास्थ्य पूरक",
    packageType: "Cylindrical HDPE Container",
    packageTypeHi: "बेलनाकार एचडीपीई कंटेनर",
    targetVerdict: "PASS",
    verdictLabel: "STATUTORY COMPLIANT",
    verdictLabelHi: "सांविधिक रूप से अनुपालित (उत्तीर्ण)",
    headlineViolation: "Medical Tablets Schedule: Accurate USP Rs. 4.33/TAB & Table-I Height Verified",
    headlineViolationHi: "चिकित्सीय गोलियां अनुसूची: सटीक यूएसपी रु. 4.33/TAB एवं तालिका-I ऊंचाई सत्यापित",
    statutoryRules: [
      "Rule 6(1)(da) Countable Solid Form Unit Sale Price (Rs. 4.33 / TAB.)",
      "Rule 6(1)(h) read with Table-I (Area <= 50 cm2 mandates >= 1.0 mm)",
      "Rule 6(1)(d) Month & Year of Manufacture (05/2026) & Expiry (04/2029)",
      "Rule 6(1)(a) Manufacturer Particulars (The Himalaya Drug Company, Bengaluru)",
    ],
    statutoryRulesHi: [
      "नियम 6(1)(da) गणनीय ठोस रूप इकाई विक्रय मूल्य (रु. 4.33 / TAB.)",
      "नियम 6(1)(h) सहपठित तालिका-I (क्षेत्रफल <= 50 सेमी² हेतु >= 1.0 मिमी)",
      "नियम 6(1)(d) निर्माण माह व वर्ष (05/2026) एवं समाप्ति (04/2029)",
      "नियम 6(1)(a) निर्माता विवरण (द हिमालया ड्रग कंपनी, बेंगलुरु)",
    ],
    testedCapabilities: [
      "Tri-Panel Semantic Fusion (Front PDP + Side LM Panel + Back Panel)",
      "Tablets Countable Rate Denominator Parsing ('/TAB.')",
      "Floating-Point USP Math Cross-Check (|4.33 * 60 - 260| <= 0.20)",
      "Cylindrical Surface Area PDP Projection (Rule 5)",
    ],
    testedCapabilitiesHi: [
      "त्रि-पैनल सिमेंटिक संलयन (फ्रंट PDP + साइड LM पैनल + बैक पैनल)",
      "टैबलेट्स गणनीय दर विभाजक पार्सिंग ('/TAB.')",
      "फ्लोटिंग-पॉइंट यूएसपी गणित मिलान (|4.33 * 60 - 260| <= 0.20)",
      "बेलनाकार सतह क्षेत्रफल PDP प्रक्षेपण (नियम 5)",
    ],
    detailedRationale:
      "Physical sample of Himalaya Brahmi 60 Tablets container. The legal declarations are distributed across facets: Net Qty (60 Tablets), MRP (Rs. 260.00), USP (Rs. 4.33/TAB.), and Mfg Date (05/2026) reside on the left LM panel, while corporate manufacturing premises are on the back panel. CrossFacetSemanticFusion aggregated all panels into unified commodity facts. Unit Sale Price math: 260 / 60 = 4.333 -> Rs. 4.33/TAB., satisfying Rule 6(1)(da) tolerance. Numeral font height of 2.1 mm exceeds Table-I Row 1 (1.0 mm).",
    detailedRationaleHi:
      "हिमालया ब्राह्मी 60 टैबलेट्स कंटेनर का भौतिक नमूना। सांविधिक घोषणाएं विभिन्न पैनलों पर वितरित हैं: शुद्ध मात्रा (60 टैबलेट्स), एमआरपी (रु. 260.00), यूएसपी (रु. 4.33/TAB.), और निर्माण (05/2026) बाएं एलएम पैनल पर हैं, जबकि निर्माता का पता पिछले पैनल पर है। क्रॉस-फ़ैसेट फ़्यूज़न ने सभी पैनलों को एकीकृत किया। यूएसपी गणित पूरी तरह सटीक है।",
    evaluatorGuide:
      "Click between 'Front PDP', 'Side LM Panel', and 'Back Panel' in the facet bar. Note how the Extracted Declarations card seamlessly pulls Net Qty from the LM panel and Manufacturer address from the Back panel with full audit provenance.",
    evaluatorGuideHi:
      "फ़ैसेट बार में 'फ्रंट PDP', 'साइड LM पैनल', और 'बैक पैनल' के बीच क्लिक करें। देखें कि कैसे निकाली गई घोषणाएं कार्ड एलएम पैनल और बैक पैनल दोनों से विवरण प्रदर्शित करता है।",
    imagePath: "/storage/uploads/real_products/brahmi_front.jpg",
    pdpAreaCm2: 48.0,
    expectedFontMm: 1.0,
    observedFontMm: 2.1,
    mrpInr: 260.0,
    uspDeclared: "Rs. 4.33 / TAB.",
    uspCalculated: "Rs. 4.33 / TAB.",
  },
  {
    scenarioNumber: 10,
    totalScenarios: 13,
    skuId: "REAL-PKG-FACEWASH",
    caseId: "demo-dot-and-key",
    inspectionNumber: "INSP-20260912-D003",
    title: "Dot & Key Cica Blemish Clearing Face Wash (100 ml)",
    titleHi: "डॉट एंड की सिका ब्लेमिश क्लीयरिंग फेस वॉश (100 मिली)",
    category: "Cosmetics & Personal Care",
    categoryHi: "प्रसाधन एवं व्यक्तिगत देखभाल",
    packageType: "Flexible Plastic Tube",
    packageTypeHi: "लचीली प्लास्टिक ट्यूब",
    targetVerdict: "PASS",
    verdictLabel: "STATUTORY COMPLIANT",
    verdictLabelHi: "सांविधिक रूप से अनुपालित (उत्तीर्ण)",
    headlineViolation: "Cosmetics Labeling: Strict Unit Sale Price ₹2.49/ml & Dual Address Validated",
    headlineViolationHi: "प्रसाधन लेबलिंग: सख्त इकाई विक्रय मूल्य ₹2.49/मिली एवं दोहरा पता सत्यापित",
    statutoryRules: [
      "Rule 6(1)(da) Liquid Metric Unit Sale Price (₹ 2.49 / ml)",
      "Rule 6(1)(a) & (b) Manufacturer (RSH Wellness, Baddi) & Marketer (Dot & Key, Kolkata)",
      "Rule 6(1)(h) read with Table-I Row 2 (Area 50-100 cm2 mandates >= 1.5 mm)",
      "Rule 6(1)(n) Consumer Care Contact Details (care@dotandkey.com)",
    ],
    statutoryRulesHi: [
      "नियम 6(1)(da) तरल मीट्रिक इकाई विक्रय मूल्य (₹ 2.49 / मिली)",
      "नियम 6(1)(a) एवं (b) निर्माता (आरएसएच वेलनेस, बद्दी) एवं विपणक (डॉट एंड की, कोलकाता)",
      "नियम 6(1)(h) सहपठित तालिका-I पंक्ति 2 (क्षेत्रफल 50-100 सेमी² हेतु >= 1.5 मिमी)",
      "नियम 6(1)(n) उपभोक्ता सेवा संपर्क विवरण (care@dotandkey.com)",
    ],
    testedCapabilities: [
      "Dual Address Parser (Differentiates Manufacturer in HP vs Marketer in WB)",
      "Exact Liquid Unit Sale Price Math (249 INR / 100 ml = 2.49 INR/ml)",
      "Macro Close-Up Panel Alignment & Text Box Calibration",
      "Cosmetics Rule 6 Invariant Verification",
    ],
    testedCapabilitiesHi: [
      "दोहरा पता पार्सर (हिमाचल में निर्माता बनाम पं. बंगाल में विपणक का पृथक्करण)",
      "सटीक तरल यूएसपी गणित (249 INR / 100 ml = 2.49 INR/ml)",
      "मैक्रो क्लोज़-अप पैनल संरेखण एवं टेक्स्ट बॉक्स अंशांकन",
      "प्रसाधन नियम 6 अपरिवर्तनीय सत्यापन",
    ],
    detailedRationale:
      "Physical sample of Dot & Key Cica Face Wash flexible tube. The packaging contains both manufacturing premises in Baddi, Himachal Pradesh (173205) and marketing registered office in Kolkata, West Bengal (700019). The extractor correctly differentiated both entities. Unit Sale Price math: ₹ 249.00 / 100 ml = ₹ 2.49 / ml, exactly matching declared USP. Numeral height on the macro stamp measures 2.8 mm against 1.5 mm Table-I threshold.",
    detailedRationaleHi:
      "डॉट एंड की सिका फेस वॉश ट्यूब का भौतिक नमूना। पैकेजिंग में बद्दी, हिमाचल प्रदेश में निर्माता और कोलकाता में विपणक दोनों पते हैं। निष्कर्षण इंजन ने दोनों संस्थाओं को सही ढंग से अलग किया। यूएसपी गणित 249 / 100 = ₹2.49/मिली एकदम सटीक है। अंक ऊंचाई 2.8 मिमी तालिका-I के 1.5 मिमी से अधिक है।",
    evaluatorGuide:
      "Examine the 'Manufacturer & Marketer' field in the Adjudication Canvas to verify both RSH Wellness (Manufacturer) and Dot & Key (Marketer) are captured with their respective state and PIN boundaries.",
    evaluatorGuideHi:
      "कैनवास में 'निर्माता व विपणक' फ़ील्ड की जांच करें ताकि सत्यापित हो सके कि आरएसएच वेलनेस (निर्माता) और डॉट एंड की (विपणक) दोनों को उनके राज्य व पिन कोड सहित सही ढंग से कैप्चर किया गया है।",
    imagePath: "/storage/uploads/real_products/facewash_back.jpg",
    pdpAreaCm2: 75.0,
    expectedFontMm: 1.5,
    observedFontMm: 2.8,
    mrpInr: 249.0,
    uspDeclared: "₹ 2.49 / ml",
    uspCalculated: "₹ 2.49 / ml",
  },
  {
    scenarioNumber: 11,
    totalScenarios: 13,
    skuId: "REAL-PKG-PERFUME",
    caseId: "demo-bella-vita",
    inspectionNumber: "INSP-20260912-P004",
    title: "Bella Vita Luxury Rosé Eau De Parfum (20 ml)",
    titleHi: "बेला वीटा लक्ज़री रोज़ ईयू डी परफ्यूम (20 मिली)",
    category: "Fragrances & Cosmetics",
    categoryHi: "सुगंध एवं प्रसाधन",
    packageType: "Mono-Carton Glass Vial",
    packageTypeHi: "मोनो-कार्टन ग्लास शीशी",
    targetVerdict: "PASS",
    verdictLabel: "STATUTORY COMPLIANT",
    verdictLabelHi: "सांविधिक रूप से अनुपालित (उत्तीर्ण)",
    headlineViolation: "Luxury Fragrance: Rate Inversion Normalization & Base Panel Fusion Verified",
    headlineViolationHi: "लक्ज़री परफ्यूम: दर व्युत्क्रम सामान्यीकरण एवं आधार पैनल संलयन सत्यापित",
    statutoryRules: [
      "Rule 6(1)(da) Unit Sale Price Inversion Normalization (₹ 19.95 / ml)",
      "Rule 6(1)(a) Manufacturer Premises (Stella Industries Ltd, Gurugram 122050)",
      "Rule 6(1)(h) read with Table-I Row 1 (Area <= 50 cm2 mandates >= 1.0 mm)",
      "Rule 6(1)(e) MRP ₹ 399.00 (inclusive of all taxes)",
    ],
    statutoryRulesHi: [
      "नियम 6(1)(da) इकाई विक्रय मूल्य व्युत्क्रम सामान्यीकरण (₹ 19.95 / मिली)",
      "नियम 6(1)(a) निर्माता परिसर (स्टेला इंडस्ट्रीज लिमिटेड, गुरुग्राम 122050)",
      "नियम 6(1)(h) सहपठित तालिका-I पंक्ति 1 (क्षेत्रफल <= 50 सेमी² हेतु >= 1.0 मिमी)",
      "नियम 6(1)(e) एमआरपी ₹ 399.00 (सभी कर सहित)",
    ],
    testedCapabilities: [
      "Rate Inversion Defense (Correctly maps '₹19.95 per ml' from micro-stamp)",
      "Bottom-Base Panel Parsing & Metric Fusion",
      "High-Density Numeral Font Height Extraction (1.8 mm)",
      "Consumer Care Hotline & Email Validation",
    ],
    testedCapabilitiesHi: [
      "दर व्युत्क्रम रक्षा (माइक्रो-स्टैम्प से '₹19.95 per ml' का सटीक मानचित्रण)",
      "निचले आधार पैनल पार्सिंग एवं मीट्रिक संलयन",
      "उच्च घनत्व अंक ऊंचाई निष्कर्षण (1.8 मिमी)",
      "उपभोक्ता सेवा हेल्पलाइन व ईमेल सत्यापन",
    ],
    detailedRationale:
      "Physical sample of Bella Vita Luxury Rosé Eau De Parfum 20 ml carton. The legal metrology stamp resides on the bottom/back flap. Extracted MRP is ₹ 399.00 and declared Net Qty is 20 ml. The rate normalizer calculated 399 / 20 = 19.95 INR/ml, perfectly matching declared USP '₹ 19.95 / ml'. Numeral font height on the small carton base measures 1.8 mm, safely surpassing Table-I Row 1 requirement of 1.0 mm.",
    detailedRationaleHi:
      "बेला वीटा लक्ज़री रोज़ 20 मिली कार्टन का भौतिक नमूना। मापविज्ञान विवरण नीचे/पिछले फ्लैप पर स्थित है। निकाली गई एमआरपी ₹ 399.00 और घोषित मात्रा 20 मिली है। दर सामान्यीकरण ने 399 / 20 = 19.95 रुपये/मिली का परिकलन किया जो घोषित यूएसपी से मेल खाता है। अंक ऊंचाई 1.8 मिमी तालिका-I के 1.0 मिमी से अधिक है।",
    evaluatorGuide:
      "Switch to 'Bottom Flap' facet to observe the small-form batch stamping. Note how the USP math card validates the high unit price (₹ 19.95/ml) without false positive rounding warnings.",
    evaluatorGuideHi:
      "छोटे रूप वाले बैच अंकन को देखने के लिए 'बॉटम फ्लैप' फ़ैसेट पर स्विच करें। देखें कि कैसे यूएसपी कार्ड बिना किसी गलत चेतावनी के ₹ 19.95/मिली का सत्यापन करता है।",
    imagePath: "/storage/uploads/real_products/perfume_front.jpg",
    pdpAreaCm2: 36.0,
    expectedFontMm: 1.0,
    observedFontMm: 1.8,
    mrpInr: 399.0,
    uspDeclared: "₹ 19.95 / ml",
    uspCalculated: "₹ 19.95 / ml",
  },
  {
    scenarioNumber: 12,
    totalScenarios: 13,
    skuId: "REAL-PKG-NAMKEEN",
    caseId: "demo-haldiram-namkeen",
    inspectionNumber: "INSP-20260912-N005",
    title: "Haldiram's Nagpur Navrattan Mixture (400g)",
    titleHi: "हल्दीराम नागपुर नवरत्न नमकीन (400 ग्राम)",
    category: "Packaged Food & Snacks",
    categoryHi: "पैकेजबंद खाद्य एवं स्नैक्स",
    packageType: "Flexible Nitrogen-Flushed Pouch",
    packageTypeHi: "लचीला नाइट्रोजन-युक्त पाउच",
    targetVerdict: "PASS",
    verdictLabel: "STATUTORY COMPLIANT",
    verdictLabelHi: "सांविधिक रूप से अनुपालित (उत्तीर्ण)",
    headlineViolation: "Multi-Panel Food Packaging: Accurate USP Rs. 0.25/g & Standard 'g' Unit",
    headlineViolationHi: "मल्टी-पैनल खाद्य पैकेजिंग: सटीक यूएसपी रु. 0.25/g एवं मानक 'g' इकाई",
    statutoryRules: [
      "Rule 6(1)(da) Unit Sale Price Verification (Rs. 0.25 / g)",
      "Section 11 LM Act SI Unit Adherence (Standard symbol 'g' verified)",
      "Rule 6(1)(h) read with Table-I Row 3 (Area 100-500 cm2 mandates >= 2.5 mm)",
      "Rule 6(1)(d) Manufacturing Date (24/08/2026) & Expiry Window",
    ],
    statutoryRulesHi: [
      "नियम 6(1)(da) इकाई विक्रय मूल्य सत्यापन (रु. 0.25 / ग्राम)",
      "धारा 11 एलएम अधिनियम एसआई मात्रक अनुपालन (मानक 'g' सत्यापित)",
      "नियम 6(1)(h) सहपठित तालिका-I पंक्ति 3 (क्षेत्रफल 100-500 सेमी² हेतु >= 2.5 मिमी)",
      "नियम 6(1)(d) निर्माण तिथि (24/08/2026) एवं उपयोग अवधि",
    ],
    testedCapabilities: [
      "Tri-Facet Packaging Fusion (Front PDP + Back Nutrition Panel + Macro Stamp)",
      "Banned Unit Check (Confirmed standard 'g' used, zero 'gms' false positive)",
      "Exact Gram-Level USP Math Cross-Check (100 INR / 400 g = 0.25 INR/g)",
      "Flexible Pouch Area Calculation with 40% PDP Ratio (Rule 5(1))",
    ],
    testedCapabilitiesHi: [
      "त्रि-फ़ैसेट पैकेजिंग संलयन (फ्रंट PDP + बैक पोषण पैनल + मैक्रो स्टैम्प)",
      "प्रतिबंधित मात्रक जांच (मानक 'g' की पुष्टि, शून्य 'gms' गलत चेतावनी)",
      "सटीक ग्राम-स्तरीय यूएसपी गणित (100 INR / 400 g = 0.25 INR/g)",
      "40% PDP अनुपात सहित लचीले पाउच का क्षेत्रफल परिकलन (नियम 5(1))",
    ],
    detailedRationale:
      "Physical sample of Haldiram's Nagpur Navrattan 400g flexible snack pouch. In this category, manufacturers frequently misprint prohibited 'gms'; this certified sample strictly adheres to standard 'g'. The legal stamp on the macro panel clearly declares MRP Rs. 100.00, Net Qty 400 g, and USP Rs. 0.25 / g. The USP engine confirms 100 / 400 = 0.25 INR/g (deviation 0.00). Numeral font height on the white stamp block measures 3.4 mm against Table-I Row 3 threshold of 2.5 mm.",
    detailedRationaleHi:
      "हल्दीराम नागपुर नवरत्न 400 ग्राम लचीले नमकीन पाउच का भौतिक नमूना। इस श्रेणी में निर्माता अक्सर प्रतिबंधित 'gms' लिखते हैं; इस प्रमाणित नमूने में मानक 'g' का विधिवत पालन किया गया है। मैक्रो पैनल पर एमआरपी रु. 100.00, शुद्ध मात्रा 400 ग्राम, और यूएसपी रु. 0.25/g है। यूएसपी इंजन ने 100 / 400 = 0.25 की पुष्टि की। अंक ऊंचाई 3.4 मिमी तालिका-I के 2.5 मिमी से अधिक है।",
    evaluatorGuide:
      "Toggle between 'Front PDP' and 'Macro Close-Up'. Inspect the Rule 12 / Section 11 unit validator to verify the SI symbol 'g' is green/passed, and check the Table-I 3.4 mm font measurement.",
    evaluatorGuideHi:
      "'फ्रंट PDP' और 'मैक्रो क्लोज़-अप' के बीच टॉगल करें। नियम 12 / धारा 11 मात्रक सत्यापनकर्ता की जांच करें कि एसआई प्रतीक 'g' हरा/उत्तीर्ण है और 3.4 मिमी फॉन्ट माप देखें।",
    imagePath: "/storage/uploads/real_products/namkeen_front.jpg",
    pdpAreaCm2: 210.0,
    expectedFontMm: 2.5,
    observedFontMm: 3.4,
    mrpInr: 100.0,
    uspDeclared: "Rs. 0.25 / g",
    uspCalculated: "Rs. 0.25 / g",
  },
  {
    scenarioNumber: 13,
    totalScenarios: 13,
    skuId: "REAL-PKG-CHIA",
    caseId: "demo-true-elements",
    inspectionNumber: "INSP-20260912-C006",
    title: "True Elements Raw Chia Seeds (250g)",
    titleHi: "ट्रू एलिमेंट्स रॉ चिया सीड्स (250 ग्राम)",
    category: "Organic & Health Foods",
    categoryHi: "जैविक एवं स्वास्थ्य खाद्य पदार्थ",
    packageType: "Stand-Up Zip Pouch",
    packageTypeHi: "स्टैंड-अप ज़िप पाउच",
    targetVerdict: "PASS",
    verdictLabel: "STATUTORY COMPLIANT",
    verdictLabelHi: "सांविधिक रूप से अनुपालित (उत्तीर्ण)",
    headlineViolation: "Stand-Up Pouch: Accurate USP ₹1.40/g & Table-I 3.1mm Font Schedule Verified",
    headlineViolationHi: "स्टैंड-अप पाउच: सटीक यूएसपी ₹1.40/g एवं तालिका-I 3.1 मिमी फॉन्ट अनुसूची सत्यापित",
    statutoryRules: [
      "Rule 6(1)(da) Unit Sale Price Calculation (₹ 1.40 / g)",
      "Rule 6(1)(h) read with Table-I Row 3 (Area 100-500 cm2 mandates >= 2.5 mm)",
      "Rule 6(1)(d) Date of Packaging & Manufacturing (28-05-2026)",
      "Rule 6(1)(a) Manufacturer Premises (HW Wellness Solutions Pvt Ltd, Mumbai / Pune)",
    ],
    statutoryRulesHi: [
      "नियम 6(1)(da) इकाई विक्रय मूल्य परिकलन (₹ 1.40 / ग्राम)",
      "नियम 6(1)(h) सहपठित तालिका-I पंक्ति 3 (क्षेत्रफल 100-500 सेमी² हेतु >= 2.5 मिमी)",
      "नियम 6(1)(d) पैकेजिंग एवं निर्माण तिथि (28-05-2026)",
      "नियम 6(1)(a) निर्माता परिसर (एचडब्ल्यू वेलनेस सॉल्यूशंस प्राइवेट लिमिटेड, मुंबई / पुणे)",
    ],
    testedCapabilities: [
      "Bi-Panel Packaging Fusion (Front PDP + Back Declarations Panel)",
      "Stand-Up Zip Pouch Effective Surface Area Computation",
      "Metric Decimal Rate Verification (350 INR / 250 g = 1.40 INR/g)",
      "Customer Support Hotline & Web URL Extraction",
    ],
    testedCapabilitiesHi: [
      "द्वि-पैनल पैकेजिंग संलयन (फ्रंट PDP + बैक घोषणाएं पैनल)",
      "स्टैंड-अप ज़िप पाउच प्रभावी सतह क्षेत्रफल गणना",
      "मीट्रिक दशमलव दर सत्यापन (350 INR / 250 g = 1.40 INR/g)",
      "ग्राहक सेवा हेल्पलाइन एवं वेब यूआरएल निष्कर्षण",
    ],
    detailedRationale:
      "Physical sample of True Elements Raw Chia Seeds 250g stand-up zip pouch. Both front branding and comprehensive back legal metrology declarations were captured. Extracted declarations: MRP ₹ 350.00, Net Qty 250 g, USP ₹ 1.40 / g, Mfg Date 28-05-2026. The mathematical engine verifies |(1.40 * 250) - 350| = 0.00 INR. Numeral font height on the declared quantity measures 3.1 mm, comfortably satisfying Table-I Row 3 (2.5 mm). Full Section 63 BSA 2023 evidence chain recorded.",
    detailedRationaleHi:
      "ट्रू एलिमेंट्स रॉ चिया सीड्स 250 ग्राम स्टैंड-अप ज़िप पाउच का भौतिक नमूना। फ्रंट ब्रांडिंग और बैक पैनल दोनों को कैप्चर किया गया। निकाली गई घोषणाएं: एमआरपी ₹ 350.00, शुद्ध मात्रा 250 ग्राम, यूएसपी ₹ 1.40/g, निर्माण 28-05-2026। गणितीय इंजन ने शत-प्रतिशत मिलान की पुष्टि की। अंक ऊंचाई 3.1 मिमी तालिका-I के 2.5 मिमी से अधिक है।",
    evaluatorGuide:
      "Examine the 'Back Panel' facet to inspect the comprehensive statutory declaration matrix, verifying font height, SI metric units, and the exact ₹ 1.40/g USP calculation.",
    evaluatorGuideHi:
      "फॉन्ट ऊंचाई, एसआई मात्रक और सटीक ₹ 1.40/g यूएसपी गणना का सत्यापन करने के लिए 'बैक पैनल' फ़ैसेट का निरीक्षण करें।",
    imagePath: "/storage/uploads/real_products/chia_front.jpg",
    pdpAreaCm2: 175.0,
    expectedFontMm: 2.5,
    observedFontMm: 3.1,
    mrpInr: 350.0,
    uspDeclared: "₹ 1.40 / g",
    uspCalculated: "₹ 1.40 / g",
  },
];

export const getDemoScenarioById = (id: string): DemoScenarioItem | undefined => {
  if (!id) return undefined;
  const lower = id.toLowerCase().trim();
  return (
    DEMO_SCENARIOS.find(
      (s) =>
        s.skuId.toLowerCase() === lower ||
        s.caseId.toLowerCase() === lower ||
        s.inspectionNumber.toLowerCase() === lower
    ) ||
    DEMO_SCENARIOS.find((s) => {
      if (lower.includes("biscuit") || lower.includes("cookie") || lower.includes("demo-01") || lower === "1") {
        return s.skuId === "SKU-DEMO-01";
      }
      if (lower.includes("curry") || lower.includes("dal") || lower.includes("demo-02") || lower === "2") {
        return s.skuId === "SKU-DEMO-02";
      }
      if (lower.includes("water") || lower.includes("demo-03") || lower === "3") {
        return s.skuId === "SKU-DEMO-03";
      }
      if (lower.includes("soap") || lower.includes("demo-04") || lower === "4") {
        return s.skuId === "SKU-DEMO-04";
      }
      if (lower.includes("chips") || lower.includes("potato") || lower.includes("demo-05") || lower === "5") {
        return s.skuId === "SKU-DEMO-05";
      }
      if (lower.includes("earbuds") || lower.includes("ecomm") || lower.includes("demo-06") || lower === "6") {
        return s.skuId === "SKU-DEMO-06";
      }
      if (lower.includes("fortune") || lower.includes("sunlite") || lower.includes("oil") || lower === "7") {
        return s.skuId === "demo-fortune-sunlite";
      }
      if (lower.includes("watch") || lower.includes("fastrack") || lower === "8") {
        return s.skuId === "REAL-PKG-WATCH";
      }
      if (lower.includes("brahmi") || lower.includes("himalaya") || lower === "9") {
        return s.skuId === "REAL-PKG-BRAHMI";
      }
      if (lower.includes("facewash") || lower.includes("dotkey") || lower.includes("dot-and-key") || lower === "10") {
        return s.skuId === "REAL-PKG-FACEWASH";
      }
      if (lower.includes("perfume") || lower.includes("bellavita") || lower.includes("bella-vita") || lower === "11") {
        return s.skuId === "REAL-PKG-PERFUME";
      }
      if (lower.includes("namkeen") || lower.includes("haldiram") || lower === "12") {
        return s.skuId === "REAL-PKG-NAMKEEN";
      }
      if (lower.includes("chia") || lower.includes("true-elements") || lower === "13") {
        return s.skuId === "REAL-PKG-CHIA";
      }
      return false;
    })
  );
};
