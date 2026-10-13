/**
 * Golden Demonstration SKU Mock Fixtures & Adapters for Veriq
 * Maps 1:1 with integration/fixtures/sku_demo_01 to sku_demo_06.
 * Frozen per 12_DEMO_PLAN.md, 11_TESTING_AND_VALIDATION_PLAN.md, and 16_DECISION_LOG.md.
 * 
 * Strict rule: Clearly tagged as DEMO/MOCK fixtures.
 */

import {
  InspectionCase,
  DashboardSummary,
  AuditEvent,
  AuditEventType,
  AuditActorType,
  HandoffReadinessState,
  CaseReadinessChecklist,
} from "../types/inspection";
import { getDeviceModel, getDeviceOS } from "../utils/clientDeviceInfo";

export const GOLDEN_SKU_CASES: Record<string, InspectionCase> = {
  "SKU-DEMO-01": {
    id: "insp_demo_01_biscuit",
    inspection_number: "INSP-20260910-B144",
    created_at: "2026-09-10T09:15:00Z",
    officer_id: "INSP-DL-0842",
    jurisdiction_id: "CIRCLE_DL_SOUTH_01",
    capture_source: "PHYSICAL_FIELD",
    product_name: "Premium Butter Cookies 200g",
    brand_name: "Sunfeast Bakery",
    manufacturer_name: "Sunfeast Foods India Pvt Ltd",
    category: "FOOD_SNACKS",
    package_type: "RECTANGULAR",
    workflow_status: "COMPLETED",
    overall_status: "FAIL",
    ai_verdict: "FAIL",
    establishment_name: "Aggarwal Supermart, Kalkaji",
    premises_address: "B-42, Main Market, Kalkaji, New Delhi 110019",
    inspection_type: "ROUTINE_MARKET_SURVEILLANCE",
    sku_demo_id: "SKU-DEMO-01",
    is_mock_fixture: true,
    epoch_applied: "EPOCH_2017_GSR_629",
    principal_display_panel: {
      package_type: "RECTANGULAR",
      package_area_cm2: 360.0,
      pdp_area_cm2: 144.0,
      pdp_area_percentage: 40.0,
      bounding_box: [120, 80, 1850, 1020],
    },
    evidence_assets: [
      {
        image_id: "img_demo_01_pdp",
        inspection_id: "insp_demo_01_biscuit",
        file_path: "/storage/uploads/sku_demo_01_biscuit.jpg",
        preview_url: "/storage/uploads/sku_demo_01_biscuit.jpg",
        raw_sha256: "a3f5e1b2c4d6879012345678abcdef0123456789abcdef0123456789abcdef01",
        panel_type: "PDP_FRONT",
        image_width: 1920,
        image_height: 1080,
        is_original_untouched: true,
        quality_gate: {
          passed: true,
          blur_variance: 312.4,
          glare_percentage: 1.1,
          skew_angle_deg: 1.2,
          advice: "FRAME_OPTIMAL: Good illumination and sharpness",
        },
        calibration: {
          is_calibrated: true,
          method: "ARUCO_4X4_50",
          px_to_mm: 11.85,
          confidence: 0.99,
          reference_bounding_box: [78, 78, 242, 242],
          margin_of_error_pct: 1.2,
        },
        ocr: {
          image_id: "img_demo_01_pdp",
          total_tokens: 5,
          mean_confidence: 0.972,
          execution_time_ms: 112,
          full_text: "Sunfeast Premium Butter Cookies\nNet Wt: 200 gms\nMRP Rs. 75.00 (incl. of all taxes)\nशुद्ध मात्रा: २०० ग्राम\nMfg Date: 08/2026",
          tokens: [
            {
              token_id: "tok_01_01",
              text: "Sunfeast Premium Butter Cookies",
              confidence: 0.99,
              polygon: [[840, 475], [1300, 475], [1300, 520], [840, 520]],
              bounding_box: [475, 840, 520, 1300],
              language: "en",
              model_source: "DBNet++",
            },
            {
              token_id: "tok_01_02",
              text: "Net Wt: 200 gms",
              confidence: 0.984,
              polygon: [[840, 530], [1050, 530], [1050, 565], [840, 565]],
              bounding_box: [530, 840, 565, 1050],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_01_03",
              text: "MRP Rs. 75.00 (incl. of all taxes)",
              confidence: 0.991,
              polygon: [[840, 570], [1150, 570], [1150, 605], [840, 605]],
              bounding_box: [570, 840, 605, 1150],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_01_04",
              text: "शुद्ध मात्रा: २०० ग्राम",
              confidence: 0.942,
              polygon: [[840, 605], [1100, 605], [1100, 635], [840, 635]],
              bounding_box: [605, 840, 635, 1100],
              language: "hi",
              model_source: "PP-OCRv3_Devanagari",
            },
            {
              token_id: "tok_01_05",
              text: "Mfg Date: 08/2026",
              confidence: 0.965,
              polygon: [[840, 635], [1050, 635], [1050, 655], [840, 655]],
              bounding_box: [635, 840, 655, 1050],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
          ],
        },
      },
    ],
    extracted_fields: [
      {
        field_id: "fld_01_brand",
        field_type: "BRAND_NAME",
        raw_ocr_text: "Sunfeast Premium Butter Cookies",
        normalized_value: { brand: "Sunfeast" },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [475, 840, 520, 1300],
        measured_font_height_mm: 5.2,
        measurement_confidence: 0.98,
        token_ids: ["tok_01_01"],
      },
      {
        field_id: "fld_01_net_qty",
        field_type: "NET_QUANTITY",
        raw_ocr_text: "Net Wt: 200 gms",
        normalized_value: {
          magnitude: 200.0,
          unit: "gms",
          has_banned_unit: true,
          banned_unit_found: "gms",
        },
        detection_confidence: 0.984,
        ocr_confidence: 0.971,
        bounding_box: [530, 840, 565, 1050],
        measured_font_height_mm: 1.84,
        measurement_confidence: 0.94,
        token_ids: ["tok_01_02"],
      },
      {
        field_id: "fld_01_mrp",
        field_type: "MRP",
        raw_ocr_text: "MRP Rs. 75.00 (incl. of all taxes)",
        normalized_value: {
          amount: 75.0,
          currency: "INR",
          tax_inclusive: true,
        },
        detection_confidence: 0.991,
        ocr_confidence: 0.985,
        bounding_box: [570, 840, 605, 1150],
        measured_font_height_mm: 3.2,
        measurement_confidence: 0.96,
        token_ids: ["tok_01_03"],
      },
    ],
    rule_evaluations: [
      {
        finding_id: "eval_01_01",
        rule_code: "RULE_06_1_H_NET_QTY_FONT",
        statutory_reference: "Rule 6(1)(h) read with Table-I, G.S.R. 629(E)",
        status: "FAIL",
        severity: "CRITICAL",
        required_value: ">= 2.50 mm (PDP area 144 cm2)",
        measured_value: "1.84 mm",
        discrepancy: "Deficit 0.66 mm (-26.4%)",
        legal_consequence: "Misbranded packaging under Section 36(1) LM Act 2009",
        evidence_box: [530, 840, 565, 1050],
        field_type: "NET_QUANTITY",
      },
      {
        finding_id: "eval_01_02",
        rule_code: "SECTION_11_RULE_12_PROHIBITED_UNITS",
        statutory_reference: "Section 11 LM Act 2009 read with Rule 12 LMPC Rules 2011",
        status: "FAIL",
        severity: "CRITICAL",
        required_value: "Standard SI metric symbol 'g'",
        measured_value: "Non-standard unit 'gms'",
        discrepancy: "Prohibited unit 'gms' used instead of standard unit 'g'",
        legal_consequence: "Violation of non-standard unit prohibition under Section 29 / 36(1) LM Act 2009",
        evidence_box: [350, 200, 410, 550],
        field_type: "NET_QUANTITY",
      },
    ],
    evidence_graph: {
      inspection_id: "insp_demo_01_biscuit",
      merkle_root: "9e7c5b2a10df840291abc09845ef1234908123456789abcdef0123456789abcd",
      nodes: [
        {
          node_id: "node_01_raw",
          stage_name: "RAW_IMAGE",
          payload_sha256: "a3f5e1b2c4d6879012345678abcdef0123456789abcdef0123456789abcdef01",
          timestamp_utc: "2026-09-10T09:15:01Z",
          metadata: { dimensions: "1920x1080", channels: 3 },
        },
        {
          node_id: "node_01_calib",
          stage_name: "CALIBRATION",
          payload_sha256: "11223344556677889900aabbccddeeff00112233445566778899aabbccddeeff",
          timestamp_utc: "2026-09-10T09:15:02Z",
          metadata: { fiducial: "ARUCO_4X4_50", px_to_mm: 11.85 },
        },
        {
          node_id: "node_01_ocr",
          stage_name: "OCR_TOKENS",
          payload_sha256: "aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899",
          timestamp_utc: "2026-09-10T09:15:03Z",
          metadata: { token_count: 5, mean_confidence: 0.972 },
        },
        {
          node_id: "node_01_rules",
          stage_name: "RULE_FINDINGS",
          payload_sha256: "deadbeef00112233445566778899aabbccddeeff00112233445566778899aabb",
          timestamp_utc: "2026-09-10T09:15:04Z",
          metadata: { violations_found: 2, composite_verdict: "FAIL" },
        },
      ],
      is_tamper_verified: true,
      verification_timestamp: "2026-09-10T09:15:05Z",
    },
    bsa_certificate: {
      certificate_number: "CERT-BSA2023-20260910-B144",
      inspection_id: "insp_demo_01_biscuit",
      statutory_law_ref: "Section 63 of Bharatiya Sakshya Adhiniyam, 2023",
      device_model: getDeviceModel(),
      operating_system: getDeviceOS(),
      clock_source: "LOCAL_DEVICE_MONOTONIC",
      raw_images_merkle_root: "a3f5e1b2c4d6879012345678abcdef0123456789abcdef0123456789abcdef01",
      evidence_bundle_sha256: "9e7c5b2a10df840291abc09845ef1234908123456789abcdef0123456789abcd",
      issuing_officer_id: "INSP-DL-0842",
      issuing_officer_name: "Rajesh Sharma",
      officer_signature_token: "SIG_TOKEN_ED25519_DL_0842_VERIFIED",
      generated_at: "2026-09-10T09:15:05Z",
    },
  },

  "SKU-DEMO-02": {
    id: "insp_demo_02_curry",
    inspection_number: "INSP-20260910-C300",
    created_at: "2026-09-10T09:30:00Z",
    officer_id: "INSP-DL-0842",
    jurisdiction_id: "CIRCLE_DL_SOUTH_01",
    capture_source: "PHYSICAL_FIELD",
    product_name: "Ready-to-Eat Dal Makhani 300g",
    brand_name: "Tandoori Royal",
    category: "FOOD_SNACKS",
    package_type: "FLEXIBLE_POUCH",
    workflow_status: "COMPLETED",
    overall_status: "FAIL",
    ai_verdict: "FAIL",
    establishment_name: "Modern Departmental Store",
    premises_address: "Shop 12, Sector 14 Market, Saket, New Delhi",
    inspection_type: "ROUTINE_MARKET_SURVEILLANCE",
    sku_demo_id: "SKU-DEMO-02",
    is_mock_fixture: true,
    principal_display_panel: {
      package_type: "FLEXIBLE_POUCH",
      package_area_cm2: 320.0,
      pdp_area_cm2: 160.0,
      pdp_area_percentage: 50.0,
      bounding_box: [100, 100, 1700, 900],
    },
    evidence_assets: [
      {
        image_id: "img_demo_02",
        inspection_id: "insp_demo_02_curry",
        file_path: "/storage/uploads/sku_demo_02_curry.jpg",
        preview_url: "/storage/uploads/sku_demo_02_curry.jpg",
        raw_sha256: "b4e6f2c3d5e7980123456789abcdef0123456789abcdef0123456789abcdef02",
        panel_type: "PDP_FRONT",
        image_width: 1920,
        image_height: 1080,
        is_original_untouched: true,
        quality_gate: {
          passed: true,
          blur_variance: 280.0,
          glare_percentage: 1.4,
          skew_angle_deg: 2.1,
          advice: "FRAME_OPTIMAL",
        },
        calibration: {
          is_calibrated: true,
          method: "ARUCO_4X4_50",
          px_to_mm: 12.10,
          confidence: 0.98,
          reference_bounding_box: [78, 78, 242, 242],
        },
        ocr: {
          image_id: "img_demo_02",
          total_tokens: 5,
          mean_confidence: 0.978,
          execution_time_ms: 124,
          full_text: "Kitchens of India Dal Makhani\nNet Qty: 300 g\nMRP Rs. 120.00 (incl. of all taxes)\nUnit Sale Price: Rs. 0.55 / g\nConsumer Care: feedback@itc.in",
          tokens: [
            {
              token_id: "tok_02_01",
              text: "Kitchens of India Dal Makhani",
              confidence: 0.99,
              polygon: [[780, 130], [1320, 130], [1320, 260], [780, 260]],
              bounding_box: [130, 780, 260, 1320],
              language: "en",
              model_source: "DBNet++",
            },
            {
              token_id: "tok_02_02",
              text: "Net Qty: 300 g",
              confidence: 0.98,
              polygon: [[780, 720], [1050, 720], [1050, 780], [780, 780]],
              bounding_box: [720, 780, 780, 1050],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_02_03",
              text: "MRP Rs. 120.00 (incl. of all taxes)",
              confidence: 0.99,
              polygon: [[780, 790], [1320, 790], [1320, 835], [780, 835]],
              bounding_box: [790, 780, 835, 1320],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_02_04",
              text: "Unit Sale Price: Rs. 0.55 / g",
              confidence: 0.96,
              polygon: [[780, 835], [1320, 835], [1320, 870], [780, 870]],
              bounding_box: [835, 780, 870, 1320],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_02_05",
              text: "Consumer Care: feedback@itc.in",
              confidence: 0.97,
              polygon: [[780, 870], [1320, 870], [1320, 960], [780, 960]],
              bounding_box: [870, 780, 960, 1320],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
          ],
        },
      },
    ],
    extracted_fields: [
      {
        field_id: "fld_02_brand",
        field_type: "BRAND_NAME",
        raw_ocr_text: "Kitchens of India Dal Makhani",
        normalized_value: { brand: "Kitchens of India" },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [130, 780, 260, 1320],
        measured_font_height_mm: 6.2,
        measurement_confidence: 0.98,
        token_ids: ["tok_02_01"],
      },
      {
        field_id: "fld_02_net_qty",
        field_type: "NET_QUANTITY",
        raw_ocr_text: "Net Qty: 300 g",
        normalized_value: { magnitude: 300.0, unit: "g", has_banned_unit: false },
        detection_confidence: 0.98,
        ocr_confidence: 0.98,
        bounding_box: [720, 780, 780, 1050],
        measured_font_height_mm: 2.65,
        token_ids: ["tok_02_02"],
      },
      {
        field_id: "fld_02_mrp",
        field_type: "MRP",
        raw_ocr_text: "MRP Rs. 120.00 (incl. of all taxes)",
        normalized_value: { amount: 120.0, currency: "INR", tax_inclusive: true },
        detection_confidence: 0.99,
        ocr_confidence: 0.98,
        bounding_box: [790, 780, 835, 1320],
        token_ids: ["tok_02_03"],
      },
      {
        field_id: "fld_02_usp",
        field_type: "UNIT_SALE_PRICE",
        raw_ocr_text: "Unit Sale Price: Rs. 0.55 / g",
        normalized_value: { price_per_unit: 0.55, unit: "g" },
        detection_confidence: 0.96,
        ocr_confidence: 0.95,
        bounding_box: [835, 780, 870, 1320],
        token_ids: ["tok_02_04"],
      },
      {
        field_id: "fld_02_care",
        field_type: "CONSUMER_CARE",
        raw_ocr_text: "Consumer Care: feedback@itc.in",
        normalized_value: { email: "feedback@itc.in" },
        detection_confidence: 0.97,
        ocr_confidence: 0.97,
        bounding_box: [870, 780, 960, 1320],
        token_ids: ["tok_02_05"],
      },
    ],
    rule_evaluations: [
      {
        finding_id: "eval_02_01",
        rule_code: "RULE_06_1_K_USP_COMPUTATION",
        statutory_reference: "Rule 6(1)(k), G.S.R. 779(E)",
        status: "FAIL",
        severity: "CRITICAL",
        required_value: "Rs. 0.40 / g (MRP 120 / 300g)",
        measured_value: "Declared Rs. 0.55 / g",
        discrepancy: "USP arithmetic mismatch: 300g * Rs 0.55/g = Rs 165.00 != declared MRP Rs 120.00 (Discrepancy Rs 45.00)",
        legal_consequence: "Non-compliance under Section 36(1) LM Act 2009",
      },
      {
        finding_id: "eval_02_02",
        rule_code: "RULE_06_1_N_CONSUMER_CARE",
        statutory_reference: "Rule 6(1)(n) LMPC Rules 2011",
        status: "FAIL",
        severity: "MAJOR",
        required_value: "Complete contact: Name, Address, Phone, Email",
        measured_value: "Missing Email declaration",
        discrepancy: "Consumer care email address omitted",
        legal_consequence: "Deficient consumer redressal declaration under Section 36(1)",
      },
    ],
  },

  "SKU-DEMO-03": {
    id: "insp_demo_03_water",
    inspection_number: "INSP-20260910-W001",
    created_at: "2026-09-10T10:00:00Z",
    officer_id: "INSP-DL-0842",
    jurisdiction_id: "CIRCLE_DL_SOUTH_01",
    capture_source: "PHYSICAL_FIELD",
    product_name: "Natural Mineral Water 1L",
    brand_name: "Himalayan Purity",
    category: "BEVERAGES",
    package_type: "CYLINDRICAL",
    workflow_status: "COMPLETED",
    overall_status: "PASS",
    ai_verdict: "PASS",
    establishment_name: "Kishan Lal General Store",
    premises_address: "Plot 8, Okhla Phase-II, New Delhi 110020",
    inspection_type: "ROUTINE_MARKET_SURVEILLANCE",
    sku_demo_id: "SKU-DEMO-03",
    is_mock_fixture: true,
    principal_display_panel: {
      package_type: "CYLINDRICAL",
      package_area_cm2: 600.0,
      pdp_area_cm2: 240.0,
      pdp_area_percentage: 40.0,
      bounding_box: [100, 100, 1800, 800],
    },
    evidence_assets: [
      {
        image_id: "img_demo_03",
        inspection_id: "insp_demo_03_water",
        file_path: "/storage/uploads/sku_demo_03_water.jpg",
        preview_url: "/storage/uploads/sku_demo_03_water.jpg",
        raw_sha256: "c5f7a3d4e6f8091234567890abcdef0123456789abcdef0123456789abcdef03",
        panel_type: "PDP_FRONT",
        image_width: 1920,
        image_height: 1080,
        is_original_untouched: true,
        quality_gate: {
          passed: true,
          blur_variance: 420.5,
          glare_percentage: 0.6,
          skew_angle_deg: 0.8,
          advice: "FRAME_OPTIMAL",
        },
        calibration: {
          is_calibrated: true,
          method: "ARUCO_4X4_50",
          px_to_mm: 13.20,
          confidence: 0.99,
          reference_bounding_box: [78, 78, 242, 242],
        },
        ocr: {
          image_id: "img_demo_03",
          total_tokens: 5,
          mean_confidence: 0.985,
          execution_time_ms: 110,
          full_text: "Alkaline 88 Smooth Hydration\nNet Volume: 1 L\nMRP Rs. 20.00 (incl. of all taxes)\nUnit Sale Price: Rs. 20.00 / L\nAqua Pure Beverages Pvt. Ltd. Haridwar",
          tokens: [
            {
              token_id: "tok_03_01",
              text: "Alkaline 88 Smooth Hydration",
              confidence: 0.99,
              polygon: [[950, 380], [1080, 380], [1080, 610], [950, 610]],
              bounding_box: [380, 950, 610, 1080],
              language: "en",
              model_source: "DBNet++",
            },
            {
              token_id: "tok_03_02",
              text: "Net Volume: 1 L",
              confidence: 0.99,
              polygon: [[950, 620], [1120, 620], [1120, 675], [950, 675]],
              bounding_box: [620, 950, 675, 1120],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_03_03",
              text: "MRP Rs. 20.00 (incl. of all taxes)",
              confidence: 0.99,
              polygon: [[950, 680], [1120, 680], [1120, 710], [950, 710]],
              bounding_box: [680, 950, 710, 1120],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_03_04",
              text: "Unit Sale Price: Rs. 20.00 / L",
              confidence: 0.98,
              polygon: [[950, 710], [1120, 710], [1120, 740], [950, 740]],
              bounding_box: [710, 950, 740, 1120],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_03_05",
              text: "Aqua Pure Beverages Pvt. Ltd.",
              confidence: 0.97,
              polygon: [[1100, 380], [1160, 380], [1160, 560], [1100, 560]],
              bounding_box: [380, 1100, 560, 1160],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
          ],
        },
      },
    ],
    extracted_fields: [
      {
        field_id: "fld_03_brand",
        field_type: "BRAND_NAME",
        raw_ocr_text: "Alkaline 88 Smooth Hydration",
        normalized_value: { brand: "Alkaline 88" },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [380, 950, 610, 1080],
        measured_font_height_mm: 7.5,
        token_ids: ["tok_03_01"],
      },
      {
        field_id: "fld_03_net_qty",
        field_type: "NET_QUANTITY",
        raw_ocr_text: "Net Volume: 1 L",
        normalized_value: { magnitude: 1.0, unit: "L", has_banned_unit: false },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [620, 950, 675, 1120],
        measured_font_height_mm: 3.10,
        token_ids: ["tok_03_02"],
      },
      {
        field_id: "fld_03_mrp",
        field_type: "MRP",
        raw_ocr_text: "MRP Rs. 20.00 (incl. of all taxes)",
        normalized_value: { amount: 20.0, currency: "INR", tax_inclusive: true },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [680, 950, 710, 1120],
        token_ids: ["tok_03_03"],
      },
      {
        field_id: "fld_03_usp",
        field_type: "UNIT_SALE_PRICE",
        raw_ocr_text: "Unit Sale Price: Rs. 20.00 / L",
        normalized_value: { price_per_unit: 20.0, unit: "L" },
        detection_confidence: 0.98,
        ocr_confidence: 0.98,
        bounding_box: [710, 950, 740, 1120],
        token_ids: ["tok_03_04"],
      },
      {
        field_id: "fld_03_mfg",
        field_type: "MANUFACTURER",
        raw_ocr_text: "Aqua Pure Beverages Pvt. Ltd., Plot 42, Industrial Area Phase-II, Haridwar 249403, Uttarakhand, India",
        normalized_value: { name: "Aqua Pure Beverages Pvt. Ltd." },
        detection_confidence: 0.97,
        ocr_confidence: 0.96,
        bounding_box: [380, 1100, 560, 1160],
        token_ids: ["tok_03_05"],
      },
    ],
    rule_evaluations: [
      {
        finding_id: "eval_03_01",
        rule_code: "RULE_06_1_H_NET_QTY_FONT",
        statutory_reference: "Rule 6(1)(h) read with Table-I, G.S.R. 629(E)",
        status: "PASS",
        severity: "CRITICAL",
        required_value: ">= 2.50 mm (PDP area 240 cm2)",
        measured_value: "3.10 mm",
        discrepancy: "None (+0.60 mm compliant buffer)",
        legal_consequence: "Fully compliant",
      },
      {
        finding_id: "eval_03_02",
        rule_code: "RULE_06_1_K_USP_COMPUTATION",
        statutory_reference: "Rule 6(1)(k), G.S.R. 779(E)",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Rs. 20.00 / L (MRP 20 / 1L)",
        measured_value: "Rs. 20.00 / L",
        discrepancy: "0.00",
        legal_consequence: "Compliant",
      },
    ],
  },

  "SKU-DEMO-04": {
    id: "insp_demo_04_soap",
    inspection_number: "INSP-20260910-S125",
    created_at: "2026-09-10T10:45:00Z",
    officer_id: "INSP-DL-0842",
    jurisdiction_id: "CIRCLE_DL_SOUTH_01",
    capture_source: "PHYSICAL_FIELD",
    product_name: "Herbal Bathing Bar 125g",
    brand_name: "AyurVeda Naturals",
    category: "COSMETICS",
    package_type: "RECTANGULAR",
    workflow_status: "PENDING_REVIEW",
    overall_status: "REVIEW",
    ai_verdict: "REVIEW",
    establishment_name: "Siddhivinayak Chemist & Retail",
    premises_address: "Shop 4, C-Block, Greater Kailash-I, New Delhi",
    inspection_type: "COMPLAINT_VERIFICATION",
    sku_demo_id: "SKU-DEMO-04",
    is_mock_fixture: true,
    principal_display_panel: {
      package_type: "RECTANGULAR",
      package_area_cm2: 275.0,
      pdp_area_cm2: 110.0,
      pdp_area_percentage: 40.0,
      bounding_box: [150, 100, 1600, 950],
    },
    evidence_assets: [
      {
        image_id: "img_demo_04",
        inspection_id: "insp_demo_04_soap",
        file_path: "/storage/uploads/sku_demo_04_soap.jpg",
        preview_url: "/storage/uploads/sku_demo_04_soap.jpg",
        raw_sha256: "d6a8b4e5f7a9102345678901abcdef0123456789abcdef0123456789abcdef04",
        panel_type: "PDP_FRONT",
        image_width: 1920,
        image_height: 1080,
        is_original_untouched: true,
        quality_gate: {
          passed: true,
          blur_variance: 295.0,
          glare_percentage: 0.9,
          skew_angle_deg: 1.1,
          advice: "FRAME_OPTIMAL",
        },
        calibration: {
          is_calibrated: true,
          method: "ARUCO_4X4_50",
          px_to_mm: 12.05,
          confidence: 0.98,
          reference_bounding_box: [78, 78, 242, 242],
          margin_of_error_pct: 3.2,
        },
        ocr: {
          image_id: "img_demo_04",
          total_tokens: 5,
          mean_confidence: 0.965,
          execution_time_ms: 118,
          full_text: "Medimix Ayurvedic 18 Herbs Bathing Bar\nNet Weight: 125 g\nMRP Rs. 45.00 (incl. of all taxes)\nUSP Rs. 0.36 / g\nCholayil Private Limited",
          tokens: [
            {
              token_id: "tok_04_01",
              text: "Medimix Ayurvedic 18 Herbs",
              confidence: 0.98,
              polygon: [[885, 355], [1215, 355], [1215, 440], [885, 440]],
              bounding_box: [355, 885, 440, 1215],
              language: "en",
              model_source: "DBNet++",
            },
            {
              token_id: "tok_04_02",
              text: "Net Weight: 125 g",
              confidence: 0.97,
              polygon: [[885, 460], [1120, 460], [1120, 510], [885, 510]],
              bounding_box: [460, 885, 510, 1120],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_04_03",
              text: "MRP Rs. 45.00 (incl. of all taxes)",
              confidence: 0.98,
              polygon: [[885, 570], [1215, 570], [1215, 605], [885, 605]],
              bounding_box: [570, 885, 605, 1215],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_04_04",
              text: "USP Rs. 0.36 / g",
              confidence: 0.96,
              polygon: [[885, 605], [1215, 605], [1215, 635], [885, 635]],
              bounding_box: [605, 885, 635, 1215],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_04_05",
              text: "Cholayil Private Limited",
              confidence: 0.95,
              polygon: [[885, 635], [1215, 635], [1215, 715], [885, 715]],
              bounding_box: [635, 885, 715, 1215],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
          ],
        },
      },
    ],
    extracted_fields: [
      {
        field_id: "fld_04_brand",
        field_type: "BRAND_NAME",
        raw_ocr_text: "Medimix Ayurvedic 18 Herbs Bathing Bar",
        normalized_value: { brand: "Medimix" },
        detection_confidence: 0.98,
        ocr_confidence: 0.98,
        bounding_box: [355, 885, 440, 1215],
        measured_font_height_mm: 5.5,
        token_ids: ["tok_04_01"],
      },
      {
        field_id: "fld_04_net_qty",
        field_type: "NET_QUANTITY",
        raw_ocr_text: "Net Weight: 125 g",
        normalized_value: { magnitude: 125.0, unit: "g", has_banned_unit: false },
        detection_confidence: 0.97,
        ocr_confidence: 0.96,
        bounding_box: [460, 885, 510, 1120],
        measured_font_height_mm: 2.46,
        measurement_confidence: 0.91,
        token_ids: ["tok_04_02"],
      },
      {
        field_id: "fld_04_mrp",
        field_type: "MRP",
        raw_ocr_text: "MRP Rs. 45.00 (incl. of all taxes)",
        normalized_value: { amount: 45.0, currency: "INR", tax_inclusive: true },
        detection_confidence: 0.98,
        ocr_confidence: 0.98,
        bounding_box: [570, 885, 605, 1215],
        token_ids: ["tok_04_03"],
      },
      {
        field_id: "fld_04_usp",
        field_type: "UNIT_SALE_PRICE",
        raw_ocr_text: "USP Rs. 0.36 / g",
        normalized_value: { price_per_unit: 0.36, unit: "g" },
        detection_confidence: 0.96,
        ocr_confidence: 0.95,
        bounding_box: [605, 885, 635, 1215],
        token_ids: ["tok_04_04"],
      },
      {
        field_id: "fld_04_mfg",
        field_type: "MANUFACTURER",
        raw_ocr_text: "Cholayil Private Limited, Haridwar, Uttarakhand",
        normalized_value: { name: "Cholayil Private Limited" },
        detection_confidence: 0.96,
        ocr_confidence: 0.95,
        bounding_box: [635, 885, 715, 1215],
        token_ids: ["tok_04_05"],
      },
    ],
    rule_evaluations: [
      {
        finding_id: "eval_04_01",
        rule_code: "RULE_06_1_H_NET_QTY_FONT",
        statutory_reference: "Rule 6(1)(h) read with Table-I, G.S.R. 629(E)",
        status: "REVIEW",
        severity: "CRITICAL",
        required_value: ">= 2.50 mm (PDP area 110 cm2)",
        measured_value: "2.46 mm",
        discrepancy: "Borderline measurement: 2.46 mm is within +-0.08 mm uncertainty band of 2.50 mm threshold. Physical caliper verification recommended.",
        legal_consequence: "Requires officer verification before legal notice",
        evidence_box: [460, 885, 510, 1120],
        field_type: "NET_QUANTITY",
      },
    ],
  },

  "SKU-DEMO-05": {
    id: "insp_demo_05_chips",
    inspection_number: "INSP-20260910-G090",
    created_at: "2026-09-10T11:15:00Z",
    officer_id: "INSP-DL-0842",
    jurisdiction_id: "CIRCLE_DL_SOUTH_01",
    capture_source: "PHYSICAL_FIELD",
    product_name: "Crispy Potato Chips 90g (Metallic Foil Pouch)",
    brand_name: "Lekker Crunch",
    category: "FOOD_SNACKS",
    package_type: "FLEXIBLE_POUCH",
    workflow_status: "OPEN",
    overall_status: "UNABLE_TO_VERIFY",
    ai_verdict: "UNABLE_TO_VERIFY",
    establishment_name: "Chawla Snacks Depot",
    premises_address: "Godown 19, Badarpur Border, New Delhi",
    inspection_type: "SURPRISE_ENFORCEMENT_RAID",
    sku_demo_id: "SKU-DEMO-05",
    is_mock_fixture: true,
    principal_display_panel: {
      package_type: "FLEXIBLE_POUCH",
      package_area_cm2: 420.0,
      pdp_area_cm2: 210.0,
      pdp_area_percentage: 50.0,
      bounding_box: [100, 100, 1750, 950],
    },
    evidence_assets: [
      {
        image_id: "img_demo_05",
        inspection_id: "insp_demo_05_chips",
        file_path: "/storage/uploads/sku_demo_05_chips.jpg",
        preview_url: "/storage/uploads/sku_demo_05_chips.jpg",
        raw_sha256: "e7b9c5f6a8b0213456789012abcdef0123456789abcdef0123456789abcdef05",
        panel_type: "PDP_FRONT",
        image_width: 1920,
        image_height: 1080,
        is_original_untouched: true,
        quality_gate: {
          passed: false,
          blur_variance: 310.0,
          glare_percentage: 6.4,
          skew_angle_deg: 2.5,
          advice: "REDUCE_GLARE",
          rejection_reason: "SPECULAR_GLARE: Glare coverage 6.40% exceeds acceptable maximum 3.00%. Tilt camera slightly to avoid direct light reflection.",
        },
        calibration: {
          is_calibrated: false,
          method: "ARUCO_4X4_50",
          px_to_mm: 12.0,
          confidence: 0.0,
          reference_bounding_box: [78, 78, 242, 242],
        },
      },
    ],
    extracted_fields: [
      {
        field_id: "fld_05_glare",
        field_type: "QUALITY_GATE_GLARE",
        raw_ocr_text: "Specular Reflection Glare Bloom (6.4% coverage)",
        normalized_value: { glare_coverage_pct: 6.4 },
        detection_confidence: 0.99,
        ocr_confidence: 0.35,
        bounding_box: [450, 920, 620, 1180],
      },
    ],
    rule_evaluations: [
      {
        finding_id: "eval_05_01",
        rule_code: "QUALITY_GATE_OPTICAL_REJECTION",
        statutory_reference: "Section 63 BSA 2023 Evidentiary Clarity Standard",
        status: "UNABLE_TO_VERIFY",
        severity: "CRITICAL",
        required_value: "Specular glare <= 3.00%",
        measured_value: "6.40% glare bloom",
        discrepancy: "Harsh specular reflection obscures Net Quantity text region",
        legal_consequence: "Image inadmissible for statutory enforcement without re-capture",
      },
    ],
  },

  "SKU-DEMO-06": {
    id: "insp_demo_06_earbuds",
    inspection_number: "INSP-20260910-E199",
    created_at: "2026-09-10T11:45:00Z",
    officer_id: "INSP-DL-0842",
    jurisdiction_id: "CIRCLE_DL_SOUTH_01",
    capture_source: "ECOMMERCE_URL",
    product_name: "Wireless Bluetooth Earbuds (Imported Listing)",
    brand_name: "AudioTech",
    category: "ELECTRONICS_COMMODITY",
    package_type: "ECOMMERCE_LISTING",
    workflow_status: "COMPLETED",
    overall_status: "FAIL",
    ai_verdict: "FAIL",
    establishment_name: "AudioTech Marketplace Seller (Listing Audit Demo)",
    premises_address: "Online Marketplace Targeted URL",
    inspection_type: "COMPLAINT_VERIFICATION",
    sku_demo_id: "SKU-DEMO-06",
    is_mock_fixture: true,
    evidence_assets: [
      {
        image_id: "img_demo_06",
        inspection_id: "insp_demo_06_earbuds",
        file_path: "/storage/uploads/sku_demo_06_listing.png",
        preview_url: "/storage/uploads/sku_demo_06_listing.png",
        raw_sha256: "f8c0d6e7b1a2345678901234abcdef0123456789abcdef0123456789abcdef06",
        panel_type: "ECOMMERCE_SNAPSHOT",
        image_width: 1280,
        image_height: 960,
        quality_gate: {
          passed: true,
          blur_variance: 500.0,
          glare_percentage: 0.0,
          skew_angle_deg: 0.0,
          advice: "DIGITAL_SNAPSHOT_OPTIMAL",
        },
        ocr: {
          image_id: "img_demo_06",
          total_tokens: 5,
          mean_confidence: 0.992,
          execution_time_ms: 95,
          full_text: "AudioTech True Wireless Earbuds Bluetooth 5.3\nPrice: ₹1,999.00 (Inclusive of all taxes)\nNet Quantity: 1 unit\nCountry of Origin: [MISSING STATUTORY DECLARATION]\nImported & Marketed by: AudioTech Imports India Pvt Ltd",
          tokens: [
            {
              token_id: "tok_06_01",
              text: "AudioTech True Wireless Earbuds Bluetooth 5.3",
              confidence: 0.99,
              polygon: [[520, 80], [1240, 80], [1240, 160], [520, 160]],
              bounding_box: [80, 520, 160, 1240],
              language: "en",
              model_source: "DOM_PARSER",
            },
            {
              token_id: "tok_06_02",
              text: "Price: ₹1,999.00 (Inclusive of all taxes)",
              confidence: 0.99,
              polygon: [[520, 180], [850, 180], [850, 240], [520, 240]],
              bounding_box: [180, 520, 240, 850],
              language: "en",
              model_source: "DOM_PARSER",
            },
            {
              token_id: "tok_06_03",
              text: "Net Quantity: 1 unit",
              confidence: 0.99,
              polygon: [[520, 260], [850, 260], [850, 310], [520, 310]],
              bounding_box: [260, 520, 310, 850],
              language: "en",
              model_source: "DOM_PARSER",
            },
            {
              token_id: "tok_06_04",
              text: "Country of Origin: [MISSING STATUTORY DECLARATION]",
              confidence: 0.99,
              polygon: [[520, 330], [1200, 330], [1200, 400], [520, 400]],
              bounding_box: [330, 520, 400, 1200],
              language: "en",
              model_source: "RULE_6_10_EVALUATOR",
            },
            {
              token_id: "tok_06_05",
              text: "Imported & Marketed by: AudioTech Imports India Pvt Ltd",
              confidence: 0.98,
              polygon: [[520, 420], [1200, 420], [1200, 490], [520, 490]],
              bounding_box: [420, 520, 490, 1200],
              language: "en",
              model_source: "DOM_PARSER",
            },
          ],
        },
      },
    ],
    extracted_fields: [
      {
        field_id: "fld_06_title",
        field_type: "PRODUCT_NAME",
        raw_ocr_text: "AudioTech True Wireless Earbuds Bluetooth 5.3",
        normalized_value: { name: "AudioTech True Wireless Earbuds Bluetooth 5.3" },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [80, 520, 160, 1240],
        token_ids: ["tok_06_01"],
      },
      {
        field_id: "fld_06_mrp",
        field_type: "MRP",
        raw_ocr_text: "Price: ₹1,999.00 (Inclusive of all taxes)",
        normalized_value: { amount: 1999.0, currency: "INR", tax_inclusive: true },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [180, 520, 240, 850],
        token_ids: ["tok_06_02"],
      },
      {
        field_id: "fld_06_net_qty",
        field_type: "NET_QUANTITY",
        raw_ocr_text: "Net Quantity: 1 unit",
        normalized_value: { magnitude: 1.0, unit: "unit" },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [260, 520, 310, 850],
        token_ids: ["tok_06_03"],
      },
      {
        field_id: "fld_06_origin",
        field_type: "COUNTRY_OF_ORIGIN",
        raw_ocr_text: "Country of Origin: [MISSING STATUTORY DECLARATION]",
        normalized_value: { country_of_origin: null, violation: true },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [330, 520, 400, 1200],
        token_ids: ["tok_06_04"],
      },
      {
        field_id: "fld_06_importer",
        field_type: "IMPORTER",
        raw_ocr_text: "Imported & Marketed by: AudioTech Imports India Pvt Ltd",
        normalized_value: { name: "AudioTech Imports India Pvt Ltd" },
        detection_confidence: 0.98,
        ocr_confidence: 0.98,
        bounding_box: [420, 520, 490, 1200],
        token_ids: ["tok_06_05"],
      },
    ],
    rule_evaluations: [
      {
        finding_id: "eval_06_01",
        rule_code: "RULE_06_10_ECOMM_MANDATORY_DECLARATIONS",
        statutory_reference: "Rule 6(10) read with Rule 6(1)(p) and G.S.R. 128(E)",
        status: "FAIL",
        severity: "CRITICAL",
        required_value: "Mandatory Country of Origin display on e-commerce listing",
        measured_value: "Omitted / Undeclared",
        discrepancy: "Listing lacks statutory Country of Origin declaration",
        legal_consequence: "Violation under Rule 6(10) enforceable under Section 36(1) LM Act 2009",
      },
      {
        finding_id: "eval_06_02",
        rule_code: "RULE_06_10_MFG_DATE_EXEMPTION",
        statutory_reference: "Rule 6(10) / G.S.R. 594(E)",
        status: "NOT_APPLICABLE",
        severity: "MINOR",
        required_value: "Statutory Exemption under Rule 6(10)",
        measured_value: "EXEMPT_DIGITAL_LISTING",
        discrepancy: "Digital e-commerce listings are statutory exempt from declaring date of manufacture under Rule 6(10) GSR 594(E).",
        legal_consequence: "No penalty; statutory exemption recorded for audit trail",
      },
    ],
  },

  "INS-2026-0001": {
    id: "INS-2026-0001",
    inspection_number: "LM/DEL/2026/000184",
    created_at: "2026-09-10T09:15:00+05:30",
    officer_id: "LMO-DL-084",
    jurisdiction_id: "CIRCLE_DL_SOUTH_01",
    capture_source: "PHYSICAL_FIELD",
    product_name: "Aashirvaad Whole Wheat Atta 500g",
    brand_name: "Aashirvaad",
    manufacturer_name: "ITC Limited",
    establishment_name: "Azadpur Wholesale Mandi",
    premises_address: "Shop 14, Block B, Azadpur Wholesale Mandi, Delhi 110033",
    inspection_type: "ROUTINE_MARKET_SURVEILLANCE",
    category: "FOOD_SNACKS",
    package_type: "FLEXIBLE_POUCH",
    workflow_status: "COMPLETED",
    overall_status: "PASS",
    ai_verdict: "PASS",
    declared_net_quantity: "500 g",
    location: "Azadpur Wholesale Market, Delhi",
    overall_confidence: 0.98,
    is_mock_fixture: true,
    sku_demo_id: "INS-2026-0001",
    principal_display_panel: {
      package_type: "FLEXIBLE_POUCH",
      package_area_cm2: 360.0,
      pdp_area_cm2: 144.0,
      pdp_area_percentage: 40.0,
      bounding_box: [100, 100, 900, 700],
    },
    calibration_summary: {
      available: true,
      aruco_detected: true,
      aruco_marker_id: 0,
      scale_mm_per_px: 0.2604,
      sensor_uncertainty_mm: 0.8,
      method: "ArUco 4x4 Planar Homography (50mm)",
      referenceObject: "ArUco #0 (50mm fiducial)",
      referenceLengthMm: 50,
      measuredPixels: 192,
      scaleMmPerPixel: 0.2604,
      uncertaintyMm: 0.8,
    },
    measurements: [
      {
        id: "MEAS-001",
        name: "Pack width",
        observedValue: 182.4,
        declaredValue: 180,
        unit: "mm",
        toleranceMin: 175,
        toleranceMax: 185,
        deviation: 2.4,
        status: "PASS",
        source: "IMG-001 / calibrated scale",
      },
      {
        id: "MEAS-002",
        name: "Pack height",
        observedValue: 282.1,
        declaredValue: 280,
        unit: "mm",
        toleranceMin: 275,
        toleranceMax: 285,
        deviation: 2.1,
        status: "PASS",
        source: "IMG-001 / calibrated scale",
      },
      {
        id: "MEAS-003",
        name: "Numeral Font Height (Table-I)",
        observedValue: 4.2,
        declaredValue: 2.5,
        unit: "mm",
        requirementSchedule: "Table-I Row 3 (≥ 2.5 mm)",
        toleranceMin: 2.5,
        toleranceMax: 10.0,
        deviation: 1.7,
        status: "PASS",
        source: "DBNet++ detection overlay",
      },
    ],
    evidence_assets: [
      {
        image_id: "IMG-001",
        inspection_id: "INS-2026-0001",
        file_path: "/assets/aashirvaad-atta-demo.svg",
        preview_url: "/assets/aashirvaad-atta-demo.svg",
        raw_sha256: "b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2",
        panel_type: "PDP_FRONT",
        image_width: 900,
        image_height: 1100,
        is_original_untouched: true,
        quality_gate: {
          passed: true,
          blur_variance: 420.5,
          glare_percentage: 0.8,
          skew_angle_deg: 0.9,
          advice: "FRAME_OPTIMAL: Sharp focus and uniform illumination",
        },
        calibration: {
          is_calibrated: true,
          method: "ARUCO_4X4_50",
          px_to_mm: 0.2604,
          confidence: 0.99,
          reference_bounding_box: [80, 40, 180, 140],
          margin_of_error_pct: 0.8,
        },
        ocr: {
          image_id: "IMG-001",
          total_tokens: 5,
          mean_confidence: 0.985,
          execution_time_ms: 110,
          full_text: "Aashirvaad Whole Wheat Atta\nNet Quantity: 500 g\nMRP Rs. 32.00 (incl. of all taxes)\nBatch: AWT26K0712 • Pkd: 08/2026\nPacked by: ITC Limited, 37 J.L. Nehru Road, Kolkata 700071",
          tokens: [
            {
              token_id: "tok_atta_01",
              text: "Aashirvaad Whole Wheat Atta",
              confidence: 0.99,
              polygon: [[180, 140], [720, 140], [720, 340], [180, 340]],
              bounding_box: [140, 180, 340, 720],
              language: "en",
              model_source: "DBNet++",
            },
            {
              token_id: "tok_atta_02",
              text: "Net Quantity: 500 g",
              confidence: 0.98,
              polygon: [[290, 580], [610, 580], [610, 690], [290, 690]],
              bounding_box: [580, 290, 690, 610],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_atta_03",
              text: "MRP Rs. 32.00 (incl. of all taxes)",
              confidence: 0.98,
              polygon: [[280, 730], [620, 730], [620, 895], [280, 895]],
              bounding_box: [730, 280, 895, 620],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_atta_04",
              text: "Batch: AWT26K0712 • Pkd: 08/2026",
              confidence: 0.96,
              polygon: [[230, 965], [670, 965], [670, 995], [230, 995]],
              bounding_box: [965, 230, 995, 670],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_atta_05",
              text: "Packed by: ITC Limited, 37 J.L. Nehru Road, Kolkata 700071",
              confidence: 0.95,
              polygon: [[200, 915], [700, 915], [700, 965], [200, 965]],
              bounding_box: [915, 200, 965, 700],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
          ],
        },
      },
    ],
    extracted_fields: [
      {
        field_id: "fld_atta_name",
        field_type: "GENERIC_NAME",
        raw_ocr_text: "Aashirvaad Whole Wheat Atta",
        normalized_value: { text: "Aashirvaad Whole Wheat Atta" },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [140, 180, 340, 720],
      },
      {
        field_id: "fld_atta_net_qty",
        field_type: "NET_QUANTITY",
        raw_ocr_text: "Net Quantity: 500 g",
        normalized_value: { magnitude: 500.0, unit: "g", has_banned_unit: false },
        detection_confidence: 0.98,
        ocr_confidence: 0.98,
        bounding_box: [580, 290, 690, 610],
      },
      {
        field_id: "fld_atta_mrp",
        field_type: "MRP",
        raw_ocr_text: "MRP Rs. 32.00 (incl. of all taxes)",
        normalized_value: { amount_inr: 32.0, is_tax_inclusive: true },
        detection_confidence: 0.98,
        ocr_confidence: 0.98,
        bounding_box: [730, 280, 895, 620],
      },
      {
        field_id: "fld_atta_batch",
        field_type: "DATE_OF_MANUFACTURE",
        raw_ocr_text: "Batch: AWT26K0712 • Pkd: 08/2026",
        normalized_value: { batch_number: "AWT26K0712", date_of_packing: "08/2026" },
        detection_confidence: 0.96,
        ocr_confidence: 0.96,
        bounding_box: [965, 230, 995, 670],
      },
      {
        field_id: "fld_atta_packer",
        field_type: "MANUFACTURER_ADDRESS",
        raw_ocr_text: "Packed by: ITC Limited, 37 J.L. Nehru Road, Kolkata 700071",
        normalized_value: { name: "ITC Limited", address: "37 J.L. Nehru Road", city: "Kolkata", pincode: "700071" },
        detection_confidence: 0.95,
        ocr_confidence: 0.95,
        bounding_box: [915, 200, 965, 700],
      },
      {
        field_id: "fld_atta_usp",
        field_type: "UNIT_SALE_PRICE",
        raw_ocr_text: "Unit Sale Price: ₹ 0.064 / g",
        normalized_value: { unit_price: 0.064, unit: "g", matches_formula: true },
        detection_confidence: 0.97,
        ocr_confidence: 0.97,
        bounding_box: [870, 250, 905, 650],
      },
    ],
    rule_evaluations: [
      {
        finding_id: "eval_atta_01",
        rule_code: "RULE_6_1_H_TABLE_I",
        statutory_reference: "Rule 6(1)(h) read with Table-I",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Numeral font height ≥ 2.5 mm for PDP area 144 cm²",
        measured_value: "4.20 mm",
        discrepancy: "Full compliance verified",
        legal_consequence: "Statutory font schedule satisfied.",
      },
      {
        finding_id: "eval_atta_02",
        rule_code: "RULE_6_1_E_MRP",
        statutory_reference: "Rule 6(1)(e) read with Rule 18(1)",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "MRP with tax inclusive clause",
        measured_value: "₹32.00 (incl. of all taxes)",
        discrepancy: "Full compliance verified",
        legal_consequence: "Statutory price declaration complete.",
      },
      {
        finding_id: "eval_atta_03",
        rule_code: "SECOND_SCHEDULE_UNITS",
        statutory_reference: "Section 11 read with Second Schedule",
        status: "PASS",
        severity: "MAJOR",
        required_value: "Permissible SI unit (g)",
        measured_value: "g",
        discrepancy: "No prohibited colloquial abbreviations detected",
        legal_consequence: "Standard SI unit verified.",
      },
    ],
    conflicts: [],
  },

  "INS-2026-0002": {
    id: "INS-2026-0002",
    inspection_number: "LM/NOI/2026/000231",
    created_at: "2026-09-09T14:35:00+05:30",
    officer_id: "LMO-UP-023",
    jurisdiction_id: "CIRCLE_UP_GBN_01",
    capture_source: "PHYSICAL_FIELD",
    product_name: "FizzUp Lemon Drink 1L",
    brand_name: "FizzUp",
    manufacturer_name: "FizzUp Beverages Pvt Ltd",
    establishment_name: "Great India Refreshments",
    premises_address: "Plot 12, Sector 18 Commercial Complex, Noida, UP 201301",
    inspection_type: "COMPLAINT_VERIFICATION",
    category: "BEVERAGES",
    package_type: "CYLINDRICAL",
    workflow_status: "PENDING_REVIEW",
    overall_status: "REVIEW",
    ai_verdict: "REVIEW",
    declared_net_quantity: "1 L",
    location: "Sector 18 Market, Noida",
    overall_confidence: 0.90,
    has_conflicts: true,
    is_mock_fixture: true,
    sku_demo_id: "INS-2026-0002",
    principal_display_panel: {
      package_type: "CYLINDRICAL",
      package_area_cm2: 600.0,
      pdp_area_cm2: 240.0,
      pdp_area_percentage: 40.0,
      bounding_box: [100, 100, 950, 750],
    },
    calibration_summary: {
      available: true,
      aruco_detected: true,
      aruco_marker_id: 1,
      scale_mm_per_px: 0.2653,
      sensor_uncertainty_mm: 1.1,
      method: "ArUco 4x4 Planar Homography (50mm)",
      referenceObject: "ArUco #1 (50mm fiducial)",
      referenceLengthMm: 50,
      measuredPixels: 188,
      scaleMmPerPixel: 0.2653,
      uncertaintyMm: 1.1,
    },
    measurements: [
      {
        id: "MEAS-101",
        name: "Bottle height",
        observedValue: 313.4,
        declaredValue: 315,
        unit: "mm",
        toleranceMin: 305,
        toleranceMax: 325,
        deviation: -1.6,
        status: "PASS",
        source: "IMG-101 / calibrated scale",
      },
    ],
    conflicts: [
      {
        id: "CON-001",
        field: "MRP",
        expected: "Single consistent MRP (₹48.00)",
        observed: "Dual Price Markings: ₹48.00 vs ₹45.00",
        severity: "HIGH",
        description: "Two price markings were detected on the submitted packaging body. Human review is required under Rule 18(1) to determine applicable retail price.",
        requiresHumanDecision: true,
        resolved: false,
      },
    ],
    evidence_assets: [
      {
        image_id: "IMG-101",
        inspection_id: "INS-2026-0002",
        file_path: "/assets/fizzup-lemon-demo.svg",
        preview_url: "/assets/fizzup-lemon-demo.svg",
        raw_sha256: "c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3",
        panel_type: "PDP_FRONT",
        image_width: 900,
        image_height: 1100,
        is_original_untouched: true,
        quality_gate: {
          passed: true,
          blur_variance: 380.2,
          glare_percentage: 1.2,
          skew_angle_deg: 2.1,
          advice: "FRAME_OPTIMAL: Good visibility",
        },
        calibration: {
          is_calibrated: true,
          method: "ARUCO_4X4_50",
          px_to_mm: 0.2653,
          confidence: 0.98,
          reference_bounding_box: [80, 40, 180, 140],
          margin_of_error_pct: 1.1,
        },
        ocr: {
          image_id: "IMG-101",
          total_tokens: 4,
          mean_confidence: 0.92,
          execution_time_ms: 115,
          full_text: "FizzUp Lemon Drink 1L\nNet Quantity: 1 L\nMRP Rs. 48.00\nSpecial Price Rs. 45.00\nMfg by: FizzUp Beverages Pvt Ltd, Pune 411001\nBatch: FZ26L891 • Pkd: 08/2026",
          tokens: [
            {
              token_id: "tok_fizz_01",
              text: "FizzUp Lemon Drink",
              confidence: 0.97,
              polygon: [[220, 270], [680, 270], [680, 385], [220, 385]],
              bounding_box: [270, 220, 385, 680],
              language: "en",
              model_source: "DBNet++",
            },
            {
              token_id: "tok_fizz_02",
              text: "Net Quantity: 1 L",
              confidence: 0.96,
              polygon: [[320, 440], [580, 440], [580, 520], [320, 520]],
              bounding_box: [440, 320, 520, 580],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_fizz_03",
              text: "MRP Rs. 48.00",
              confidence: 0.91,
              polygon: [[470, 580], [700, 580], [700, 670], [470, 670]],
              bounding_box: [580, 470, 670, 700],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_fizz_04",
              text: "Special Price Rs. 45.00",
              confidence: 0.89,
              polygon: [[200, 580], [430, 580], [430, 670], [200, 670]],
              bounding_box: [580, 200, 670, 430],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_fizz_05",
              text: "Mfg by: FizzUp Beverages Pvt Ltd, Pune 411001",
              confidence: 0.95,
              polygon: [[180, 760], [720, 760], [720, 795], [180, 795]],
              bounding_box: [760, 180, 795, 720],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_fizz_06",
              text: "Batch: FZ26L891 • Pkd: 08/2026",
              confidence: 0.94,
              polygon: [[230, 795], [670, 795], [670, 825], [230, 825]],
              bounding_box: [795, 230, 825, 670],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
          ],
        },
      },
    ],
    extracted_fields: [
      {
        field_id: "fld_fizz_name",
        field_type: "GENERIC_NAME",
        raw_ocr_text: "FizzUp Lemon Drink",
        normalized_value: { text: "FizzUp Lemon Drink" },
        detection_confidence: 0.97,
        ocr_confidence: 0.97,
        bounding_box: [270, 220, 385, 680],
      },
      {
        field_id: "fld_fizz_net_qty",
        field_type: "NET_QUANTITY",
        raw_ocr_text: "Net Quantity: 1 L",
        normalized_value: { magnitude: 1.0, unit: "L", has_banned_unit: false },
        detection_confidence: 0.96,
        ocr_confidence: 0.96,
        bounding_box: [440, 320, 520, 580],
      },
      {
        field_id: "fld_fizz_mrp1",
        field_type: "MRP",
        raw_ocr_text: "MRP Rs. 48.00",
        normalized_value: { amount_inr: 48.0, is_tax_inclusive: true },
        detection_confidence: 0.91,
        ocr_confidence: 0.91,
        bounding_box: [580, 470, 670, 700],
      },
      {
        field_id: "fld_fizz_mrp2",
        field_type: "UNKNOWN",
        raw_ocr_text: "Special Price Rs. 45.00",
        normalized_value: { amount_inr: 45.0 },
        detection_confidence: 0.89,
        ocr_confidence: 0.89,
        bounding_box: [580, 200, 670, 430],
      },
      {
        field_id: "fld_fizz_mfg",
        field_type: "MANUFACTURER_ADDRESS",
        raw_ocr_text: "Mfg by: FizzUp Beverages Pvt Ltd, Pune 411001",
        normalized_value: { name: "FizzUp Beverages Pvt Ltd", city: "Pune", pincode: "411001" },
        detection_confidence: 0.95,
        ocr_confidence: 0.95,
        bounding_box: [760, 180, 795, 720],
      },
      {
        field_id: "fld_fizz_batch",
        field_type: "DATE_OF_MANUFACTURE",
        raw_ocr_text: "Batch: FZ26L891 • Pkd: 08/2026",
        normalized_value: { batch_number: "FZ26L891", date_of_packing: "08/2026" },
        detection_confidence: 0.94,
        ocr_confidence: 0.94,
        bounding_box: [795, 230, 825, 670],
      },
    ],
    rule_evaluations: [
      {
        finding_id: "eval_fizz_01",
        rule_code: "RULE_6_1_E_MRP_CONFLICT",
        statutory_reference: "Rule 6(1)(e) read with Rule 18(1) and Rule 23",
        status: "REVIEW",
        severity: "CRITICAL",
        required_value: "Single unambiguous MRP declaration",
        measured_value: "Dual price markings (₹48.00 & ₹45.00)",
        discrepancy: "Multiple conflicting price markings detected on packaging surface",
        legal_consequence: "Potential overcharging risk or undeclared discount sticker; officer verification required.",
      },
      {
        finding_id: "eval_fizz_02",
        rule_code: "RULE_6_1_K_USP",
        statutory_reference: "Rule 6(1)(k) / GSR 779(E)",
        status: "PASS",
        severity: "MAJOR",
        required_value: "USP declared in Rs. per L",
        measured_value: "₹48.00 / L",
        discrepancy: "Mathematical consistency verified",
        legal_consequence: "Unit Sale Price compliant.",
      },
    ],
  },

  "INS-2026-0003": {
    id: "INS-2026-0003",
    inspection_number: "LM/BJN/2026/000094",
    created_at: "2026-09-08T11:05:00+05:30",
    officer_id: "LMO-UP-094",
    jurisdiction_id: "CIRCLE_UP_GBN_01",
    capture_source: "PHYSICAL_FIELD",
    product_name: "CleanHome Floor Cleaner 250g",
    brand_name: "CleanHome",
    manufacturer_name: "CleanHome Chemical Industries Ltd",
    establishment_name: "Bijnor Departmental Mart",
    premises_address: "Station Road, Bijnor, Uttar Pradesh 246701",
    inspection_type: "SURPRISE_ENFORCEMENT_RAID",
    category: "HOUSEHOLD_COMMODITY",
    package_type: "RECTANGULAR",
    workflow_status: "DRAFT",
    overall_status: "UNABLE_TO_VERIFY",
    ai_verdict: "UNABLE_TO_VERIFY",
    declared_net_quantity: "250 g",
    location: "Bijnor Main Market, Uttar Pradesh",
    overall_confidence: 0.71,
    evidence_gap: true,
    is_mock_fixture: true,
    sku_demo_id: "INS-2026-0003",
    principal_display_panel: {
      package_type: "RECTANGULAR",
      package_area_cm2: 200.0,
      pdp_area_cm2: 80.0,
      pdp_area_percentage: 40.0,
      bounding_box: [120, 120, 800, 600],
    },
    calibration_summary: {
      available: false,
      method: "Not available",
      referenceObject: "",
      referenceLengthMm: 0,
      measuredPixels: 0,
      scaleMmPerPixel: 0,
      uncertaintyMm: 0,
    },
    measurements: [],
    conflicts: [],
    evidence_assets: [
      {
        image_id: "IMG-201",
        inspection_id: "INS-2026-0003",
        file_path: "/assets/cleanhome-cleaner-demo.svg",
        preview_url: "/assets/cleanhome-cleaner-demo.svg",
        raw_sha256: "d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4",
        panel_type: "PDP_FRONT",
        image_width: 900,
        image_height: 1100,
        is_original_untouched: true,
        quality_gate: {
          passed: true,
          blur_variance: 220.1,
          glare_percentage: 1.8,
          skew_angle_deg: 5.4,
          advice: "CALIBRATION_FIDUCIAL_MISSING: Place ArUco 50mm marker next to package",
        },
        calibration: {
          is_calibrated: false,
          method: "UNRESOLVED",
          px_to_mm: 0,
          confidence: 0.0,
        },
        ocr: {
          image_id: "IMG-201",
          total_tokens: 5,
          mean_confidence: 0.79,
          execution_time_ms: 120,
          full_text: "CleanHome Floor Cleaner\nNet Weight: 250 g\nMRP Rs. 99.00 (incl. of all taxes)\nMfg by: CleanHome Chemical Industries Ltd, Vapi 396195\nBatch: CH26M014 • Pkd: 07/2026",
          tokens: [
            {
              token_id: "tok_clean_01",
              text: "CleanHome Floor Cleaner",
              confidence: 0.87,
              polygon: [[200, 315], [700, 315], [700, 420], [200, 420]],
              bounding_box: [315, 200, 420, 700],
              language: "en",
              model_source: "DBNet++",
            },
            {
              token_id: "tok_clean_02",
              text: "Net Weight: 250 g",
              confidence: 0.82,
              polygon: [[320, 490], [580, 490], [580, 575], [320, 575]],
              bounding_box: [490, 320, 575, 580],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_clean_03",
              text: "MRP Rs. 99.00 (incl. of all taxes)",
              confidence: 0.78,
              polygon: [[310, 620], [590, 620], [590, 745], [310, 745]],
              bounding_box: [620, 310, 745, 590],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_clean_04",
              text: "Mfg by: CleanHome Chemical Industries Ltd, Vapi 396195",
              confidence: 0.84,
              polygon: [[180, 805], [720, 805], [720, 835], [180, 835]],
              bounding_box: [805, 180, 835, 720],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_clean_05",
              text: "Batch: CH26M014 • Pkd: 07/2026",
              confidence: 0.80,
              polygon: [[230, 835], [670, 835], [670, 865], [230, 865]],
              bounding_box: [835, 230, 865, 670],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
          ],
        },
      },
    ],
    extracted_fields: [
      {
        field_id: "fld_clean_name",
        field_type: "GENERIC_NAME",
        raw_ocr_text: "CleanHome Floor Cleaner",
        normalized_value: { text: "CleanHome Floor Cleaner" },
        detection_confidence: 0.87,
        ocr_confidence: 0.87,
        bounding_box: [315, 200, 420, 700],
      },
      {
        field_id: "fld_clean_net_qty",
        field_type: "NET_QUANTITY",
        raw_ocr_text: "Net Weight: 250 g",
        normalized_value: { magnitude: 250.0, unit: "g" },
        detection_confidence: 0.82,
        ocr_confidence: 0.82,
        bounding_box: [490, 320, 575, 580],
      },
      {
        field_id: "fld_clean_mrp",
        field_type: "MRP",
        raw_ocr_text: "MRP Rs. 99.00 (incl. of all taxes)",
        normalized_value: { amount_inr: 99.0, is_tax_inclusive: true },
        detection_confidence: 0.78,
        ocr_confidence: 0.78,
        bounding_box: [620, 310, 745, 590],
      },
      {
        field_id: "fld_clean_mfg",
        field_type: "MANUFACTURER_ADDRESS",
        raw_ocr_text: "Mfg by: CleanHome Chemical Industries Ltd, Vapi 396195",
        normalized_value: { name: "CleanHome Chemical Industries Ltd", city: "Vapi", pincode: "396195" },
        detection_confidence: 0.84,
        ocr_confidence: 0.84,
        bounding_box: [805, 180, 835, 720],
      },
      {
        field_id: "fld_clean_batch",
        field_type: "DATE_OF_MANUFACTURE",
        raw_ocr_text: "Batch: CH26M014 • Pkd: 07/2026",
        normalized_value: { batch_number: "CH26M014", date_of_packing: "07/2026" },
        detection_confidence: 0.80,
        ocr_confidence: 0.80,
        bounding_box: [835, 230, 865, 670],
      },
    ],
    rule_evaluations: [
      {
        finding_id: "eval_clean_01",
        rule_code: "RULE_6_1_H_TABLE_I",
        statutory_reference: "Rule 6(1)(h) read with Table-I",
        status: "UNABLE_TO_VERIFY",
        severity: "CRITICAL",
        required_value: "Numeral font height verification under Table-I",
        measured_value: "UNRESOLVED_NO_CALIBRATION",
        discrepancy: "Dimensional height cannot be computed without fiducial scale standard on packaging plane",
        legal_consequence: "Evidence gap; photographic recapture with 50mm ArUco fiducial required under Section 63 BSA 2023.",
      },
      {
        finding_id: "eval_clean_02",
        rule_code: "RULE_6_1_E_MRP",
        statutory_reference: "Rule 6(1)(e)",
        status: "PASS",
        severity: "MAJOR",
        required_value: "MRP declaration present",
        measured_value: "₹99.00 (incl. of all taxes)",
        discrepancy: "Price declaration visible",
        legal_consequence: "MRP detected.",
      },
    ],
  },

  "demo-fortune-sunlite": {
    id: "demo-fortune-sunlite",
    inspection_number: "INSP-20260910-F001",
    created_at: "2026-09-10T11:00:00+05:30",
    officer_id: "INSP-DL-0842",
    jurisdiction_id: "CIRCLE_DL_SOUTH_01",
    capture_source: "PHYSICAL_FIELD",
    product_name: "Fortune Sunlite Refined Sunflower Oil 1L",
    brand_name: "Fortune",
    manufacturer_name: "Adani Wilmar Limited",
    establishment_name: "Central Depot Retail Store",
    premises_address: "Shop 12, South Extension Part-II, New Delhi 110049",
    inspection_type: "ROUTINE_MARKET_SURVEILLANCE",
    category: "EDIBLE_OIL",
    package_type: "FLEXIBLE_POUCH",
    workflow_status: "COMPLETED",
    overall_status: "PASS",
    ai_verdict: "PASS",
    declared_net_quantity: "1 L / 910 g",
    location: "South Extension, New Delhi",
    overall_confidence: 0.99,
    is_mock_fixture: true,
    sku_demo_id: "demo-fortune-sunlite",
    principal_display_panel: {
      package_type: "FLEXIBLE_POUCH",
      package_area_cm2: 450.0,
      pdp_area_cm2: 180.0,
      pdp_area_percentage: 40.0,
      bounding_box: [80, 80, 920, 720],
    },
    calibration_summary: {
      available: true,
      method: "ArUco 4x4 (50mm)",
      referenceObject: "ArUco 4x4 (50mm)",
      referenceLengthMm: 50,
      measuredPixels: 215,
      scaleMmPerPixel: 0.2325,
      uncertaintyMm: 0.6,
    },
    measurements: [
      {
        id: "MEAS-FORT-01",
        name: "Numeral Font Height (Table-I)",
        observedValue: 4.8,
        declaredValue: 2.5,
        unit: "mm",
        requirementSchedule: "Table-I Row 3 (≥ 2.5 mm)",
        toleranceMin: 2.5,
        toleranceMax: 10.0,
        deviation: 2.3,
        status: "PASS",
        source: "ArUco calibrated DBNet++",
      },
      {
        id: "MEAS-FORT-02",
        name: "Unit Sale Price Consistency",
        observedValue: 145.0,
        declaredValue: 145.0,
        unit: "₹/L",
        toleranceMin: 144.98,
        toleranceMax: 145.02,
        deviation: 0.0,
        status: "PASS",
        source: "USP Math Engine (Rule 6(1)(k))",
      },
    ],
    evidence_assets: [
      {
        image_id: "img_fortune_01",
        inspection_id: "demo-fortune-sunlite",
        file_path: "/assets/fortune-sunlite-demo.svg",
        preview_url: "/assets/fortune-sunlite-demo.svg",
        raw_sha256: "e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5",
        panel_type: "PDP_FRONT",
        image_width: 900,
        image_height: 1100,
        is_original_untouched: true,
        quality_gate: {
          passed: true,
          blur_variance: 450.2,
          glare_percentage: 0.5,
          skew_angle_deg: 0.4,
          advice: "FRAME_OPTIMAL: Excellent illumination",
        },
        calibration: {
          is_calibrated: true,
          method: "ARUCO_4X4_50",
          px_to_mm: 0.2325,
          confidence: 0.99,
          reference_bounding_box: [80, 40, 180, 140],
          margin_of_error_pct: 0.6,
        },
        ocr: {
          image_id: "img_fortune_01",
          total_tokens: 7,
          mean_confidence: 0.99,
          execution_time_ms: 105,
          full_text: "Fortune Sunlite Refined Sunflower Oil\nNet Quantity: 1 L (910 g)\nMRP Rs. 145.00 (incl. of all taxes)\nUnit Sale Price: ₹ 145.00 / L\nMfg by: Adani Wilmar Limited, Fortune House, Ahmedabad 380009\nConsumer Care: 1800-233-9999 • customercare@adaniwilmar.in\nBatch: AWL26S09 • Pkd: 08/2026",
          tokens: [
            {
              token_id: "tok_fort_01",
              text: "Fortune Sunlite Refined Sunflower Oil",
              confidence: 0.99,
              polygon: [[180, 140], [720, 140], [720, 340], [180, 340]],
              bounding_box: [140, 180, 340, 720],
              language: "en",
              model_source: "DBNet++",
            },
            {
              token_id: "tok_fort_02",
              text: "Net Quantity: 1 L (910 g)",
              confidence: 0.99,
              polygon: [[290, 580], [610, 580], [610, 690], [290, 690]],
              bounding_box: [580, 290, 690, 610],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_fort_03",
              text: "MRP Rs. 145.00 (incl. of all taxes)",
              confidence: 0.99,
              polygon: [[280, 730], [620, 730], [620, 870], [280, 870]],
              bounding_box: [730, 280, 870, 620],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_fort_04",
              text: "Unit Sale Price: ₹ 145.00 / L",
              confidence: 0.98,
              polygon: [[250, 870], [650, 870], [650, 905], [250, 905]],
              bounding_box: [870, 250, 905, 650],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_fort_05",
              text: "Mfg by: Adani Wilmar Limited, Fortune House, Ahmedabad 380009",
              confidence: 0.97,
              polygon: [[180, 915], [720, 915], [720, 945], [180, 945]],
              bounding_box: [915, 180, 945, 720],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_fort_06",
              text: "Consumer Care: 1800-233-9999 • customercare@adaniwilmar.in",
              confidence: 0.96,
              polygon: [[180, 945], [720, 945], [720, 970], [180, 970]],
              bounding_box: [945, 180, 970, 720],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_fort_07",
              text: "Batch: AWL26S09 • Pkd: 08/2026",
              confidence: 0.96,
              polygon: [[230, 965], [670, 965], [670, 995], [230, 995]],
              bounding_box: [965, 230, 995, 670],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
          ],
        },
      },
    ],
    extracted_fields: [
      {
        field_id: "fld_fort_name",
        field_type: "GENERIC_NAME",
        raw_ocr_text: "Fortune Sunlite Refined Sunflower Oil",
        normalized_value: { text: "Fortune Sunlite Refined Sunflower Oil" },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [140, 180, 340, 720],
      },
      {
        field_id: "fld_fort_net_qty",
        field_type: "NET_QUANTITY",
        raw_ocr_text: "Net Quantity: 1 L (910 g)",
        normalized_value: { magnitude: 1.0, unit: "L", equivalent_weight_g: 910 },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [580, 290, 690, 610],
      },
      {
        field_id: "fld_fort_mrp",
        field_type: "MRP",
        raw_ocr_text: "MRP Rs. 145.00 (incl. of all taxes)",
        normalized_value: { amount_inr: 145.0, is_tax_inclusive: true },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [730, 280, 870, 620],
      },
      {
        field_id: "fld_fort_usp",
        field_type: "UNIT_SALE_PRICE",
        raw_ocr_text: "Unit Sale Price: ₹ 145.00 / L",
        normalized_value: { price_per_unit_inr: 145.0, denominator_unit: "L" },
        detection_confidence: 0.98,
        ocr_confidence: 0.98,
        bounding_box: [870, 250, 905, 650],
      },
      {
        field_id: "fld_fort_mfg",
        field_type: "MANUFACTURER_ADDRESS",
        raw_ocr_text: "Mfg by: Adani Wilmar Limited, Fortune House, Ahmedabad 380009",
        normalized_value: { name: "Adani Wilmar Limited", city: "Ahmedabad", pincode: "380009" },
        detection_confidence: 0.97,
        ocr_confidence: 0.97,
        bounding_box: [915, 180, 945, 720],
      },
      {
        field_id: "fld_fort_consumer",
        field_type: "CONSUMER_CARE_CONTACT",
        raw_ocr_text: "Consumer Care: 1800-233-9999 • customercare@adaniwilmar.in",
        normalized_value: { phone: "1800-233-9999", email: "customercare@adaniwilmar.in" },
        detection_confidence: 0.96,
        ocr_confidence: 0.96,
        bounding_box: [945, 180, 970, 720],
      },
      {
        field_id: "fld_fort_batch",
        field_type: "DATE_OF_MANUFACTURE",
        raw_ocr_text: "Batch: AWL26S09 • Pkd: 08/2026",
        normalized_value: { batch_number: "AWL26S09", date_of_packing: "08/2026" },
        detection_confidence: 0.96,
        ocr_confidence: 0.96,
        bounding_box: [965, 230, 995, 670],
      },
    ],
    rule_evaluations: [
      {
        finding_id: "eval_fort_01",
        rule_code: "RULE_6_1_H_TABLE_I",
        statutory_reference: "Rule 6(1)(h) read with Table-I",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Numeral font height ≥ 2.5 mm",
        measured_value: "4.80 mm",
        discrepancy: "Compliant font height verified",
        legal_consequence: "Table-I satisfied.",
      },
      {
        finding_id: "eval_fort_02",
        rule_code: "RULE_6_1_K_USP",
        statutory_reference: "Rule 6(1)(k) / GSR 779(E)",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "|(USP × NetQty) - MRP| ≤ ₹0.02",
        measured_value: "|(145.00 × 1.0) - 145.00| = ₹0.00",
        discrepancy: "Exact mathematical consistency",
        legal_consequence: "Unit Sale Price math verified.",
      },
    ],
    conflicts: [],
  },

"REAL-PKG-WATCH": {
    id: "demo-fastrack-watch",
    inspection_number: "INSP-20260912-W001",
    created_at: "2026-09-12T10:30:00+05:30",
    officer_id: "INSP-DL-0842",
    jurisdiction_id: "CIRCLE_DL_SOUTH_01",
    capture_source: "PHYSICAL_FIELD",
    product_name: "Fastrack Casual Analog Watch",
    brand_name: "Fastrack",
    manufacturer_name: "Titan Company Limited",
    establishment_name: "Titan Eyeplus & Watches Retail Store",
    premises_address: "Shop 18, South Extension Part-II, New Delhi 110049",
    inspection_type: "ROUTINE_MARKET_SURVEILLANCE",
    category: "NON_FOOD",
    package_type: "RECTANGULAR",
    workflow_status: "COMPLETED",
    overall_status: "PASS",
    ai_verdict: "PASS",
    declared_net_quantity: "01 NUMBER",
    location: "Koramangala, Bengaluru / Hosur 635126",
    overall_confidence: 0.98,
    is_mock_fixture: true,
    sku_demo_id: "REAL-PKG-WATCH",
    epoch_applied: "EPOCH_2022_GSR_779",
    principal_display_panel: {
      package_type: "RECTANGULAR",
      package_area_cm2: 240.0,
      pdp_area_cm2: 96.0,
      pdp_area_percentage: 40.0,
      bounding_box: [60, 60, 940, 780],
    },
    calibration_summary: {
      available: true,
      method: "ISO-7810 Standard Card (85.6mm)",
      referenceObject: "ISO-7810 Standard Card (85.6mm)",
      referenceLengthMm: 85.6,
      measuredPixels: 372,
      scaleMmPerPixel: 0.23,
      uncertaintyMm: 0.5,
    },
    measurements: [
      {
        id: "MEAS-WATCH-01",
        name: "Numeral Font Height (Table-I)",
        observedValue: 3.2,
        declaredValue: 1.5,
        unit: "mm",
        requirementSchedule: "Table-I Row 2 (Area 50-100 cm² >= 1.5 mm)",
        toleranceMin: 1.5,
        toleranceMax: 8.0,
        deviation: 1.7,
        status: "PASS",
        source: "Calibrated DBNet++",
      },
      {
        id: "MEAS-WATCH-02",
        name: "Rule 6(1)(da) Single Unit Distinct Item Exemption",
        observedValue: 2425.0,
        declaredValue: 2425.0,
        unit: "₹/N",
        toleranceMin: 2424.98,
        toleranceMax: 2425.02,
        deviation: 0.0,
        status: "PASS",
        source: "Rule 6(1)(da) Second Proviso Exemption",
      },
    ],
    evidence_assets: [
      {
        image_id: "img_watch_01_front",
        inspection_id: "demo-fastrack-watch",
        file_path: "/storage/uploads/real_products/watch_front.jpg",
        preview_url: "/storage/uploads/real_products/watch_front.jpg",
        raw_sha256: "b1a2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90",
        panel_type: "PDP_FRONT",
        image_width: 1920,
        image_height: 1440,
        is_original_untouched: true,
        quality_gate: {
          passed: true,
          blur_variance: 420.5,
          glare_percentage: 0.8,
          skew_angle_deg: 0.3,
          advice: "FRAME_OPTIMAL: Front branding and dial casing clearly resolved",
        },
        calibration: {
          is_calibrated: true,
          method: "ISO_7810_CARD",
          px_to_mm: 0.23,
          confidence: 0.99,
          reference_bounding_box: [120, 60, 240, 220],
          margin_of_error_pct: 0.5,
        },
        ocr: {
          image_id: "img_watch_01_front",
          total_tokens: 3,
          mean_confidence: 0.99,
          execution_time_ms: 88,
          full_text: "Fastrack\nCASUAL ANALOG\nWATER RESISTANT",
          tokens: [
            {
              token_id: "tok_w_f01",
              text: "Fastrack",
              confidence: 0.99,
              polygon: [[200, 300], [600, 300], [600, 420], [200, 420]],
              bounding_box: [300, 200, 420, 600],
              language: "en",
              model_source: "DBNet++",
            },
            {
              token_id: "tok_w_f02",
              text: "CASUAL ANALOG",
              confidence: 0.98,
              polygon: [[250, 440], [550, 440], [550, 500], [250, 500]],
              bounding_box: [440, 250, 500, 550],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_w_f03",
              text: "WATER RESISTANT",
              confidence: 0.97,
              polygon: [[270, 520], [530, 520], [530, 560], [270, 560]],
              bounding_box: [520, 270, 560, 530],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
          ],
        },
      },
      {
        image_id: "img_watch_02_macro",
        inspection_id: "demo-fastrack-watch",
        file_path: "/storage/uploads/real_products/watch_macro.jpg",
        preview_url: "/storage/uploads/real_products/watch_macro.jpg",
        raw_sha256: "c2b3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90a1",
        panel_type: "SIDE_PANEL",
        image_width: 1920,
        image_height: 1440,
        is_original_untouched: true,
        quality_gate: {
          passed: true,
          blur_variance: 512.0,
          glare_percentage: 0.4,
          skew_angle_deg: 0.2,
          advice: "FRAME_OPTIMAL: 180° Inversion Auto-Corrected with Full High-Confidence Transcriptions",
        },
        calibration: {
          is_calibrated: true,
          method: "ISO_7810_CARD",
          px_to_mm: 0.18,
          confidence: 0.99,
          reference_bounding_box: [80, 50, 220, 200],
          margin_of_error_pct: 0.4,
        },
        ocr: {
          image_id: "img_watch_02_macro",
          total_tokens: 6,
          mean_confidence: 0.98,
          execution_time_ms: 115,
          full_text: "TITAN COMPANY LIMITED\nMRP ₹ 2425.00 (INCL. OF ALL TAXES)\nNET QTY: 01 NUMBER\nCOUNTRY OF ORIGIN: CHINA\nMONTH & YEAR OF PKG: 07/2026\nCUSTOMER CARE: 080-67547700 / customercare@titan.co.in",
          tokens: [
            {
              token_id: "tok_w_m01",
              text: "TITAN COMPANY LIMITED",
              confidence: 0.99,
              polygon: [[100, 80], [800, 80], [800, 140], [100, 140]],
              bounding_box: [80, 100, 140, 800],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_w_m02",
              text: "MRP ₹ 2425.00 (INCL. OF ALL TAXES)",
              confidence: 0.99,
              polygon: [[100, 150], [850, 150], [850, 210], [100, 210]],
              bounding_box: [150, 100, 210, 850],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_w_m03",
              text: "NET QTY: 01 NUMBER",
              confidence: 0.98,
              polygon: [[100, 220], [600, 220], [600, 270], [100, 270]],
              bounding_box: [220, 100, 270, 600],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_w_m04",
              text: "COUNTRY OF ORIGIN: CHINA",
              confidence: 0.98,
              polygon: [[100, 280], [700, 280], [700, 330], [100, 330]],
              bounding_box: [280, 100, 330, 700],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_w_m05",
              text: "MONTH & YEAR OF PKG: 07/2026",
              confidence: 0.97,
              polygon: [[100, 340], [750, 340], [750, 390], [100, 390]],
              bounding_box: [340, 100, 390, 750],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_w_m06",
              text: "CUSTOMER CARE: 080-67547700 / customercare@titan.co.in",
              confidence: 0.97,
              polygon: [[100, 400], [900, 400], [900, 450], [100, 450]],
              bounding_box: [400, 100, 450, 900],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
          ],
        },
      },
    ],
    extracted_fields: [
      {
        field_id: "fld_w_name",
        field_type: "PRODUCT_NAME",
        raw_ocr_text: "Fastrack CASUAL ANALOG WATCH",
        normalized_value: { text: "Fastrack Casual Analog Watch" },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [300, 200, 420, 600],
      },
      {
        field_id: "fld_w_net_qty",
        field_type: "NET_QUANTITY",
        raw_ocr_text: "NET QTY: 01 NUMBER",
        normalized_value: { magnitude: 1.0, unit: "N", raw_unit: "NUMBER" },
        detection_confidence: 0.98,
        ocr_confidence: 0.98,
        bounding_box: [220, 100, 270, 600],
      },
      {
        field_id: "fld_w_mrp",
        field_type: "MRP",
        raw_ocr_text: "MRP ₹ 2425.00 (INCL. OF ALL TAXES)",
        normalized_value: { amount_inr: 2425.0, is_tax_inclusive: true },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [150, 100, 210, 850],
      },
      {
        field_id: "fld_w_origin",
        field_type: "COUNTRY_OF_ORIGIN",
        raw_ocr_text: "COUNTRY OF ORIGIN: CHINA",
        normalized_value: { country: "CHINA" },
        detection_confidence: 0.98,
        ocr_confidence: 0.98,
        bounding_box: [280, 100, 330, 700],
      },
      {
        field_id: "fld_w_mfg_date",
        field_type: "DATE_OF_MANUFACTURE",
        raw_ocr_text: "MONTH & YEAR OF PKG: 07/2026",
        normalized_value: { month: 7, year: 2026 },
        detection_confidence: 0.97,
        ocr_confidence: 0.97,
        bounding_box: [340, 100, 390, 750],
      },
      {
        field_id: "fld_w_mfg_addr",
        field_type: "MANUFACTURER_ADDRESS",
        raw_ocr_text: "TITAN COMPANY LIMITED, 3 SIPCOT IND COMPLEX HOSUR 635126 / BENGALURU",
        normalized_value: {
          name: "Titan Company Limited",
          city: "Hosur",
          state: "Tamil Nadu",
          pincode: "635126",
        },
        detection_confidence: 0.98,
        ocr_confidence: 0.98,
        bounding_box: [80, 100, 140, 800],
      },
      {
        field_id: "fld_w_care",
        field_type: "CONSUMER_CARE",
        raw_ocr_text: "080-67547700 / customercare@titan.co.in",
        normalized_value: { phone: "080-67547700", email: "customercare@titan.co.in" },
        detection_confidence: 0.97,
        ocr_confidence: 0.97,
        bounding_box: [400, 100, 450, 900],
      },
    ],
    rule_evaluations: [
      {
        finding_id: "eval_w_01",
        rule_code: "RULE_06_1_E_MRP",
        statutory_reference: "Rule 6(1)(e) Legal Metrology (PC) Rules, 2011",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Maximum Retail Price inclusive of all taxes declared",
        measured_value: "₹ 2425.00 (INCL. OF ALL TAXES)",
        discrepancy: "Full statutory MRP declaration present with inclusive tax clause.",
        legal_consequence: "Rule 6(1)(e) verified compliant.",
      },
      {
        finding_id: "eval_w_02",
        rule_code: "RULE_06_1_F_NET_QTY",
        statutory_reference: "Rule 6(1)(f) read with Rule 12 LMPC Rules, 2011 & Section 11 LM Act, 2009",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Standard unit declaration (number/countable items: 'NUMBER' or 'N')",
        measured_value: "01 NUMBER",
        discrepancy: "Valid statutory unit conforming to Schedule II of LMPC Rules.",
        legal_consequence: "Net quantity verified compliant.",
      },
      {
        finding_id: "eval_w_03",
        rule_code: "RULE_06_1_H_NET_QTY_FONT",
        statutory_reference: "Rule 6(1)(h) read with Table-I, G.S.R. 629(E)",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Minimum numeral font height >= 1.50 mm (PDP 50-100 cm²)",
        measured_value: "3.20 mm",
        discrepancy: "Exceeds Table-I Row 2 minimum statutory threshold.",
        legal_consequence: "Table-I font height schedule satisfied.",
      },
      {
        finding_id: "eval_w_04",
        rule_code: "RULE_06_1_DA_USP_EXEMPTION",
        statutory_reference: "Rule 6(1)(da) Second Proviso / G.S.R. 779(E)",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Unit Sale Price declaration or statutory single-item exemption",
        measured_value: "EXEMPT_SINGLE_DISTINCT_UNIT",
        discrepancy: "Package contains exactly 1 distinct wearable unit; statutory exemption under Rule 6(1)(da) applies.",
        legal_consequence: "Unit Sale Price exempt per Legal Metrology Gazette notification.",
      },
      {
        finding_id: "eval_w_05",
        rule_code: "RULE_06_1_D_MFG_DATE",
        statutory_reference: "Rule 6(1)(d) Legal Metrology (PC) Rules, 2011",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Month and year of manufacture or packaging declared",
        measured_value: "07/2026",
        discrepancy: "Compliant month/year declaration present.",
        legal_consequence: "Rule 6(1)(d) verified compliant.",
      },
      {
        finding_id: "eval_w_06",
        rule_code: "RULE_06_1_P_COUNTRY_OF_ORIGIN",
        statutory_reference: "Rule 6(1)(p) read with Rule 6(10) / G.S.R. 594(E)",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Country of Origin declared on imported package",
        measured_value: "CHINA",
        discrepancy: "Mandatory country of origin declared prominently.",
        legal_consequence: "Country of origin verified compliant.",
      },
      {
        finding_id: "eval_w_07",
        rule_code: "RULE_06_1_A_MANUFACTURER",
        statutory_reference: "Rule 6(1)(a) & (b) Legal Metrology (PC) Rules, 2011",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Name and complete address of importer/packer",
        measured_value: "TITAN COMPANY LIMITED, HOSUR 635126",
        discrepancy: "Valid corporate name, industrial estate, city, state, and PIN code.",
        legal_consequence: "Manufacturer/importer address verified compliant.",
      },
      {
        finding_id: "eval_w_08",
        rule_code: "RULE_06_1_N_CONSUMER_CARE",
        statutory_reference: "Rule 6(1)(n) Legal Metrology (PC) Rules, 2011",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Consumer care telephone number and email address",
        measured_value: "080-67547700 / customercare@titan.co.in",
        discrepancy: "Both telephone hotline and electronic contact details declared.",
        legal_consequence: "Consumer care details verified compliant.",
      },
    ],
    conflicts: [],
  },

  "REAL-PKG-BRAHMI": {
    id: "demo-himalaya-brahmi",
    inspection_number: "INSP-20260912-B002",
    created_at: "2026-09-12T11:00:00+05:30",
    officer_id: "INSP-DL-0842",
    jurisdiction_id: "CIRCLE_DL_SOUTH_01",
    capture_source: "PHYSICAL_FIELD",
    product_name: "Himalaya Pure Herbs Brahmi (60 Tablets)",
    brand_name: "Himalaya Pure Herbs",
    manufacturer_name: "The Himalaya Drug Company",
    establishment_name: "Apollo Pharmacy, Green Park",
    premises_address: "A-12, Green Park Main, New Delhi 110016",
    inspection_type: "ROUTINE_MARKET_SURVEILLANCE",
    category: "MEDICINE_SUPPLEMENTS",
    package_type: "CYLINDRICAL",
    workflow_status: "COMPLETED",
    overall_status: "PASS",
    ai_verdict: "PASS",
    declared_net_quantity: "60 Tablets",
    location: "Peenya Industrial Area, Bengaluru 562162",
    overall_confidence: 0.99,
    is_mock_fixture: true,
    sku_demo_id: "REAL-PKG-BRAHMI",
    epoch_applied: "EPOCH_2022_GSR_779",
    principal_display_panel: {
      package_type: "CYLINDRICAL",
      package_area_cm2: 120.0,
      pdp_area_cm2: 48.0,
      pdp_area_percentage: 40.0,
      bounding_box: [50, 50, 850, 750],
    },
    calibration_summary: {
      available: true,
      method: "Planar Metric Homography (95mm height standard)",
      referenceObject: "Bottle Height Reference Standard",
      referenceLengthMm: 95.0,
      measuredPixels: 420,
      scaleMmPerPixel: 0.226,
      uncertaintyMm: 0.4,
    },
    measurements: [
      {
        id: "MEAS-BRAHMI-01",
        name: "Numeral Font Height (Table-I)",
        observedValue: 2.1,
        declaredValue: 1.0,
        unit: "mm",
        requirementSchedule: "Table-I Row 1 (Area <= 50 cm² >= 1.0 mm)",
        toleranceMin: 1.0,
        toleranceMax: 5.0,
        deviation: 1.1,
        status: "PASS",
        source: "Calibrated DBNet++",
      },
      {
        id: "MEAS-BRAHMI-02",
        name: "Unit Sale Price Consistency (USP)",
        observedValue: 4.33,
        declaredValue: 4.33,
        unit: "₹/TAB.",
        toleranceMin: 4.31,
        toleranceMax: 4.35,
        deviation: 0.0,
        status: "PASS",
        source: "USP Math Engine (260 INR / 60 Tablets)",
      },
    ],
    evidence_assets: [
      {
        image_id: "img_brahmi_01_front",
        inspection_id: "demo-himalaya-brahmi",
        file_path: "/storage/uploads/real_products/brahmi_front.jpg",
        preview_url: "/storage/uploads/real_products/brahmi_front.jpg",
        raw_sha256: "d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4",
        panel_type: "PDP_FRONT",
        image_width: 1920,
        image_height: 1440,
        is_original_untouched: true,
        quality_gate: {
          passed: true,
          blur_variance: 490.0,
          glare_percentage: 0.5,
          skew_angle_deg: 0.2,
          advice: "FRAME_OPTIMAL: High-clarity cylindrical front projection",
        },
        calibration: {
          is_calibrated: true,
          method: "MANUAL_FIXED",
          px_to_mm: 0.226,
          confidence: 0.99,
          reference_bounding_box: [100, 60, 200, 180],
          margin_of_error_pct: 0.4,
        },
        ocr: {
          image_id: "img_brahmi_01_front",
          total_tokens: 3,
          mean_confidence: 0.99,
          execution_time_ms: 92,
          full_text: "Himalaya SINCE 1930\nPure Herbs\nBRAHMI Mind Wellness",
          tokens: [
            {
              token_id: "tok_b_f01",
              text: "Himalaya SINCE 1930",
              confidence: 0.99,
              polygon: [[200, 250], [600, 250], [600, 320], [200, 320]],
              bounding_box: [250, 200, 320, 600],
              language: "en",
              model_source: "DBNet++",
            },
            {
              token_id: "tok_b_f02",
              text: "Pure Herbs",
              confidence: 0.99,
              polygon: [[240, 340], [560, 340], [560, 400], [240, 400]],
              bounding_box: [340, 240, 400, 560],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_b_f03",
              text: "BRAHMI Mind Wellness",
              confidence: 0.98,
              polygon: [[180, 420], [620, 420], [620, 500], [180, 500]],
              bounding_box: [420, 180, 500, 620],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
          ],
        },
      },
      {
        image_id: "img_brahmi_02_lm",
        inspection_id: "demo-himalaya-brahmi",
        file_path: "/storage/uploads/real_products/brahmi_lm_panel.jpg",
        preview_url: "/storage/uploads/real_products/brahmi_lm_panel.jpg",
        raw_sha256: "e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5",
        panel_type: "SIDE_PANEL",
        image_width: 1920,
        image_height: 1440,
        is_original_untouched: true,
        quality_gate: {
          passed: true,
          blur_variance: 530.0,
          glare_percentage: 0.3,
          skew_angle_deg: 0.1,
          advice: "FRAME_OPTIMAL: Statutory panel with clear MRP and USP stamping",
        },
        calibration: {
          is_calibrated: true,
          method: "MANUAL_FIXED",
          px_to_mm: 0.226,
          confidence: 0.99,
          reference_bounding_box: [80, 50, 180, 160],
          margin_of_error_pct: 0.4,
        },
        ocr: {
          image_id: "img_brahmi_02_lm",
          total_tokens: 5,
          mean_confidence: 0.99,
          execution_time_ms: 108,
          full_text: "Net Qty.: 60 Tablets\nM.R.P. Rs. 260.00 (Incl. of all taxes)\nUSP: Rs. 4.33 / TAB.\nMFD.: 05/2026\nEXP.: 04/2029",
          tokens: [
            {
              token_id: "tok_b_l01",
              text: "Net Qty.: 60 Tablets",
              confidence: 0.99,
              polygon: [[100, 100], [550, 100], [550, 160], [100, 160]],
              bounding_box: [100, 100, 160, 550],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_b_l02",
              text: "M.R.P. Rs. 260.00 (Incl. of all taxes)",
              confidence: 0.99,
              polygon: [[100, 180], [750, 180], [750, 240], [100, 240]],
              bounding_box: [180, 100, 240, 750],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_b_l03",
              text: "USP: Rs. 4.33 / TAB.",
              confidence: 0.99,
              polygon: [[100, 260], [600, 260], [600, 320], [100, 320]],
              bounding_box: [260, 100, 320, 600],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_b_l04",
              text: "MFD.: 05/2026",
              confidence: 0.98,
              polygon: [[100, 340], [450, 340], [450, 400], [100, 400]],
              bounding_box: [340, 100, 400, 450],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_b_l05",
              text: "EXP.: 04/2029",
              confidence: 0.98,
              polygon: [[100, 420], [450, 420], [450, 480], [100, 480]],
              bounding_box: [420, 100, 480, 450],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
          ],
        },
      },
      {
        image_id: "img_brahmi_03_back",
        inspection_id: "demo-himalaya-brahmi",
        file_path: "/storage/uploads/real_products/brahmi_back.jpg",
        preview_url: "/storage/uploads/real_products/brahmi_back.jpg",
        raw_sha256: "f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6",
        panel_type: "BACK_PANEL",
        image_width: 1920,
        image_height: 1440,
        is_original_untouched: true,
        quality_gate: {
          passed: true,
          blur_variance: 465.0,
          glare_percentage: 0.6,
          skew_angle_deg: 0.2,
          advice: "FRAME_OPTIMAL: Address and consumer care clearly resolved",
        },
        calibration: {
          is_calibrated: true,
          method: "MANUAL_FIXED",
          px_to_mm: 0.226,
          confidence: 0.99,
          reference_bounding_box: [100, 80, 200, 200],
          margin_of_error_pct: 0.4,
        },
        ocr: {
          image_id: "img_brahmi_03_back",
          total_tokens: 3,
          mean_confidence: 0.98,
          execution_time_ms: 95,
          full_text: "Mfg by: The Himalaya Drug Company\nMakali, Bengaluru 562 162, India\nCare: 1800 208 1930 / care@himalayawellness.com",
          tokens: [
            {
              token_id: "tok_b_b01",
              text: "Mfg by: The Himalaya Drug Company",
              confidence: 0.99,
              polygon: [[100, 120], [700, 120], [700, 180], [100, 180]],
              bounding_box: [120, 100, 180, 700],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_b_b02",
              text: "Makali, Bengaluru 562 162, India",
              confidence: 0.98,
              polygon: [[100, 200], [680, 200], [680, 260], [100, 260]],
              bounding_box: [200, 100, 260, 680],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_b_b03",
              text: "Care: 1800 208 1930 / care@himalayawellness.com",
              confidence: 0.97,
              polygon: [[100, 280], [800, 280], [800, 340], [100, 340]],
              bounding_box: [280, 100, 340, 800],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
          ],
        },
      },
    ],
    extracted_fields: [
      {
        field_id: "fld_b_name",
        field_type: "PRODUCT_NAME",
        raw_ocr_text: "Himalaya Pure Herbs BRAHMI Mind Wellness",
        normalized_value: { text: "Himalaya Pure Herbs Brahmi Mind Wellness" },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [250, 200, 500, 620],
      },
      {
        field_id: "fld_b_net_qty",
        field_type: "NET_QUANTITY",
        raw_ocr_text: "Net Qty.: 60 Tablets",
        normalized_value: { magnitude: 60.0, unit: "N", raw_unit: "Tablets" },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [100, 100, 160, 550],
      },
      {
        field_id: "fld_b_mrp",
        field_type: "MRP",
        raw_ocr_text: "M.R.P. Rs. 260.00 (Incl. of all taxes)",
        normalized_value: { amount_inr: 260.0, is_tax_inclusive: true },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [180, 100, 240, 750],
      },
      {
        field_id: "fld_b_usp",
        field_type: "UNIT_SALE_PRICE",
        raw_ocr_text: "USP: Rs. 4.33 / TAB.",
        normalized_value: { rate_inr: 4.33, unit: "TAB." },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [260, 100, 320, 600],
      },
      {
        field_id: "fld_b_mfg_date",
        field_type: "DATE_OF_MANUFACTURE",
        raw_ocr_text: "MFD.: 05/2026",
        normalized_value: { month: 5, year: 2026 },
        detection_confidence: 0.98,
        ocr_confidence: 0.98,
        bounding_box: [340, 100, 400, 450],
      },
      {
        field_id: "fld_b_mfg_addr",
        field_type: "MANUFACTURER_ADDRESS",
        raw_ocr_text: "The Himalaya Drug Company, Makali, Bengaluru 562 162, India",
        normalized_value: {
          name: "The Himalaya Drug Company",
          city: "Bengaluru",
          state: "Karnataka",
          pincode: "562162",
        },
        detection_confidence: 0.98,
        ocr_confidence: 0.98,
        bounding_box: [120, 100, 260, 700],
      },
      {
        field_id: "fld_b_care",
        field_type: "CONSUMER_CARE",
        raw_ocr_text: "1800 208 1930 / care@himalayawellness.com",
        normalized_value: { phone: "1800 208 1930", email: "care@himalayawellness.com" },
        detection_confidence: 0.97,
        ocr_confidence: 0.97,
        bounding_box: [280, 100, 340, 800],
      },
    ],
    rule_evaluations: [
      {
        finding_id: "eval_b_01",
        rule_code: "RULE_06_1_E_MRP",
        statutory_reference: "Rule 6(1)(e) Legal Metrology (PC) Rules, 2011",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Maximum Retail Price inclusive of all taxes",
        measured_value: "Rs. 260.00 (Incl. of all taxes)",
        discrepancy: "Valid statutory MRP declaration.",
        legal_consequence: "Rule 6(1)(e) verified compliant.",
      },
      {
        finding_id: "eval_b_02",
        rule_code: "RULE_06_1_F_NET_QTY",
        statutory_reference: "Rule 6(1)(f) read with Rule 12 LMPC Rules, 2011 & Section 11 LM Act, 2009",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Countable unit declared (Tablets / N)",
        measured_value: "60 Tablets",
        discrepancy: "Permissible unit of count under Schedule II.",
        legal_consequence: "Net quantity verified compliant.",
      },
      {
        finding_id: "eval_b_03",
        rule_code: "RULE_06_1_H_NET_QTY_FONT",
        statutory_reference: "Rule 6(1)(h) read with Table-I, G.S.R. 629(E)",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Minimum numeral font height >= 1.00 mm (PDP <= 50 cm²)",
        measured_value: "2.10 mm",
        discrepancy: "Comfortably exceeds Table-I Row 1 threshold.",
        legal_consequence: "Table-I font height schedule satisfied.",
      },
      {
        finding_id: "eval_b_04",
        rule_code: "RULE_06_1_DA_USP_MATH",
        statutory_reference: "Rule 6(1)(da) / G.S.R. 779(E)",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "|(USP × NetQty) - MRP| <= ₹0.20 for countable items",
        measured_value: "|(4.33 × 60) - 260.00| = |259.80 - 260.00| = ₹0.20",
        discrepancy: "Unit Sale Price matches retail price within statutory rounding margin.",
        legal_consequence: "Rule 6(1)(da) verified compliant.",
      },
      {
        finding_id: "eval_b_05",
        rule_code: "RULE_06_1_D_MFG_DATE",
        statutory_reference: "Rule 6(1)(d) Legal Metrology (PC) Rules, 2011",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Month and year of manufacture declared",
        measured_value: "05/2026",
        discrepancy: "Valid manufacturing date present.",
        legal_consequence: "Rule 6(1)(d) verified compliant.",
      },
      {
        finding_id: "eval_b_06",
        rule_code: "RULE_06_1_A_MANUFACTURER",
        statutory_reference: "Rule 6(1)(a) Legal Metrology (PC) Rules, 2011",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Name and address of manufacturer",
        measured_value: "The Himalaya Drug Company, Bengaluru 562162",
        discrepancy: "Full corporate name, locality, city, state, and PIN code present.",
        legal_consequence: "Manufacturer address verified compliant.",
      },
      {
        finding_id: "eval_b_07",
        rule_code: "RULE_06_1_N_CONSUMER_CARE",
        statutory_reference: "Rule 6(1)(n) Legal Metrology (PC) Rules, 2011",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Consumer care telephone and email details",
        measured_value: "1800 208 1930 / care@himalayawellness.com",
        discrepancy: "Both toll-free phone hotline and electronic email present.",
        legal_consequence: "Consumer care verified compliant.",
      },
    ],
    conflicts: [],
  },

  "REAL-PKG-FACEWASH": {
    id: "demo-dot-and-key",
    inspection_number: "INSP-20260912-D003",
    created_at: "2026-09-12T11:30:00+05:30",
    officer_id: "INSP-DL-0842",
    jurisdiction_id: "CIRCLE_DL_SOUTH_01",
    capture_source: "PHYSICAL_FIELD",
    product_name: "Dot & Key Cica Blemish Clearing Face Wash 100ml",
    brand_name: "Dot & Key",
    manufacturer_name: "RSH Wellness Pvt Ltd",
    establishment_name: "Nykaa Luxe Beauty Store",
    premises_address: "Shop 4, Select Citywalk, Saket, New Delhi 110017",
    inspection_type: "ROUTINE_MARKET_SURVEILLANCE",
    category: "COSMETICS_PERSONAL_CARE",
    package_type: "FLEXIBLE_POUCH",
    workflow_status: "COMPLETED",
    overall_status: "PASS",
    ai_verdict: "PASS",
    declared_net_quantity: "100 ml",
    location: "Baddi 173205 / Kolkata 700019",
    overall_confidence: 0.98,
    is_mock_fixture: true,
    sku_demo_id: "REAL-PKG-FACEWASH",
    epoch_applied: "EPOCH_2022_GSR_779",
    principal_display_panel: {
      package_type: "FLEXIBLE_POUCH",
      package_area_cm2: 187.5,
      pdp_area_cm2: 75.0,
      pdp_area_percentage: 40.0,
      bounding_box: [40, 40, 920, 800],
    },
    calibration_summary: {
      available: true,
      method: "Planar Metric Scale Calibration",
      referenceObject: "Tube Width Benchmark",
      referenceLengthMm: 55.0,
      measuredPixels: 250,
      scaleMmPerPixel: 0.22,
      uncertaintyMm: 0.4,
    },
    measurements: [
      {
        id: "MEAS-DOTKEY-01",
        name: "Numeral Font Height (Table-I)",
        observedValue: 2.8,
        declaredValue: 1.5,
        unit: "mm",
        requirementSchedule: "Table-I Row 2 (Area 50-100 cm² >= 1.5 mm)",
        toleranceMin: 1.5,
        toleranceMax: 6.0,
        deviation: 1.3,
        status: "PASS",
        source: "Calibrated DBNet++",
      },
      {
        id: "MEAS-DOTKEY-02",
        name: "Unit Sale Price Consistency (USP)",
        observedValue: 2.49,
        declaredValue: 2.49,
        unit: "₹/ml",
        toleranceMin: 2.48,
        toleranceMax: 2.50,
        deviation: 0.0,
        status: "PASS",
        source: "USP Math Engine (249 INR / 100 ml)",
      },
    ],
    evidence_assets: [
      {
        image_id: "img_dotkey_01_back",
        inspection_id: "demo-dot-and-key",
        file_path: "/storage/uploads/real_products/facewash_back.jpg",
        preview_url: "/storage/uploads/real_products/facewash_back.jpg",
        raw_sha256: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
        panel_type: "BACK_PANEL",
        image_width: 1920,
        image_height: 1440,
        is_original_untouched: true,
        quality_gate: {
          passed: true,
          blur_variance: 480.0,
          glare_percentage: 0.7,
          skew_angle_deg: 0.3,
          advice: "FRAME_OPTIMAL: Back statutory declarations and manufacturer addresses clear",
        },
        calibration: {
          is_calibrated: true,
          method: "MANUAL_FIXED",
          px_to_mm: 0.22,
          confidence: 0.99,
          reference_bounding_box: [60, 40, 160, 180],
          margin_of_error_pct: 0.4,
        },
        ocr: {
          image_id: "img_dotkey_01_back",
          total_tokens: 4,
          mean_confidence: 0.98,
          execution_time_ms: 102,
          full_text: "Manufactured by: RSH Wellness Pvt Ltd, Plot No. 12, Ind Area, Baddi 173205 HP\nMarketed by: Dot & Key Wellness LLP, Kolkata 700019\nCountry of Origin: India\nCustomer Care: care@dotandkey.com",
          tokens: [
            {
              token_id: "tok_d_b01",
              text: "Manufactured by: RSH Wellness Pvt Ltd, Plot No. 12, Ind Area, Baddi 173205 HP",
              confidence: 0.99,
              polygon: [[100, 100], [850, 100], [850, 160], [100, 160]],
              bounding_box: [100, 100, 160, 850],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_d_b02",
              text: "Marketed by: Dot & Key Wellness LLP, Kolkata 700019",
              confidence: 0.98,
              polygon: [[100, 180], [750, 180], [750, 240], [100, 240]],
              bounding_box: [180, 100, 240, 750],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_d_b03",
              text: "Country of Origin: India",
              confidence: 0.99,
              polygon: [[100, 260], [500, 260], [500, 310], [100, 310]],
              bounding_box: [260, 100, 310, 500],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_d_b04",
              text: "Customer Care: care@dotandkey.com",
              confidence: 0.98,
              polygon: [[100, 330], [650, 330], [650, 380], [100, 380]],
              bounding_box: [330, 100, 380, 650],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
          ],
        },
      },
      {
        image_id: "img_dotkey_02_macro",
        inspection_id: "demo-dot-and-key",
        file_path: "/storage/uploads/real_products/facewash_macro.jpg",
        preview_url: "/storage/uploads/real_products/facewash_macro.jpg",
        raw_sha256: "b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3",
        panel_type: "SIDE_PANEL",
        image_width: 1920,
        image_height: 1440,
        is_original_untouched: true,
        quality_gate: {
          passed: true,
          blur_variance: 520.0,
          glare_percentage: 0.4,
          skew_angle_deg: 0.1,
          advice: "FRAME_OPTIMAL: High-resolution crimp seal macro",
        },
        calibration: {
          is_calibrated: true,
          method: "MANUAL_FIXED",
          px_to_mm: 0.19,
          confidence: 0.99,
          reference_bounding_box: [80, 50, 200, 180],
          margin_of_error_pct: 0.3,
        },
        ocr: {
          image_id: "img_dotkey_02_macro",
          total_tokens: 4,
          mean_confidence: 0.99,
          execution_time_ms: 85,
          full_text: "NET VOL: 100 ml\nMRP ₹ 249.00 (INCL. OF ALL TAXES)\nUSP: ₹ 2.49 / ml\nMFG: 03/2026",
          tokens: [
            {
              token_id: "tok_d_m01",
              text: "NET VOL: 100 ml",
              confidence: 0.99,
              polygon: [[100, 80], [550, 80], [550, 140], [100, 140]],
              bounding_box: [80, 100, 140, 550],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_d_m02",
              text: "MRP ₹ 249.00 (INCL. OF ALL TAXES)",
              confidence: 0.99,
              polygon: [[100, 160], [800, 160], [800, 220], [100, 220]],
              bounding_box: [160, 100, 220, 800],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_d_m03",
              text: "USP: ₹ 2.49 / ml",
              confidence: 0.99,
              polygon: [[100, 240], [550, 240], [550, 290], [100, 290]],
              bounding_box: [240, 100, 290, 550],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_d_m04",
              text: "MFG: 03/2026",
              confidence: 0.98,
              polygon: [[100, 310], [450, 310], [450, 360], [100, 360]],
              bounding_box: [310, 100, 360, 450],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
          ],
        },
      },
    ],
    extracted_fields: [
      {
        field_id: "fld_d_name",
        field_type: "PRODUCT_NAME",
        raw_ocr_text: "Dot & Key Cica Blemish Clearing Face Wash",
        normalized_value: { text: "Dot & Key Cica Blemish Clearing Face Wash" },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [80, 100, 140, 550],
      },
      {
        field_id: "fld_d_net_qty",
        field_type: "NET_QUANTITY",
        raw_ocr_text: "NET VOL: 100 ml",
        normalized_value: { magnitude: 100.0, unit: "ml" },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [80, 100, 140, 550],
      },
      {
        field_id: "fld_d_mrp",
        field_type: "MRP",
        raw_ocr_text: "MRP ₹ 249.00 (INCL. OF ALL TAXES)",
        normalized_value: { amount_inr: 249.0, is_tax_inclusive: true },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [160, 100, 220, 800],
      },
      {
        field_id: "fld_d_usp",
        field_type: "UNIT_SALE_PRICE",
        raw_ocr_text: "USP: ₹ 2.49 / ml",
        normalized_value: { rate_inr: 2.49, unit: "ml" },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [240, 100, 290, 550],
      },
      {
        field_id: "fld_d_mfg_date",
        field_type: "DATE_OF_MANUFACTURE",
        raw_ocr_text: "MFG: 03/2026",
        normalized_value: { month: 3, year: 2026 },
        detection_confidence: 0.98,
        ocr_confidence: 0.98,
        bounding_box: [310, 100, 360, 450],
      },
      {
        field_id: "fld_d_origin",
        field_type: "COUNTRY_OF_ORIGIN",
        raw_ocr_text: "Country of Origin: India",
        normalized_value: { country: "India" },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [260, 100, 310, 500],
      },
      {
        field_id: "fld_d_mfg_addr",
        field_type: "MANUFACTURER_ADDRESS",
        raw_ocr_text: "RSH Wellness Pvt Ltd, Plot No. 12, Ind Area, Baddi 173205 HP",
        normalized_value: {
          name: "RSH Wellness Pvt Ltd",
          city: "Baddi",
          state: "Himachal Pradesh",
          pincode: "173205",
        },
        detection_confidence: 0.98,
        ocr_confidence: 0.98,
        bounding_box: [100, 100, 160, 850],
      },
      {
        field_id: "fld_d_care",
        field_type: "CONSUMER_CARE",
        raw_ocr_text: "care@dotandkey.com",
        normalized_value: { email: "care@dotandkey.com" },
        detection_confidence: 0.98,
        ocr_confidence: 0.98,
        bounding_box: [330, 100, 380, 650],
      },
    ],
    rule_evaluations: [
      {
        finding_id: "eval_d_01",
        rule_code: "RULE_06_1_E_MRP",
        statutory_reference: "Rule 6(1)(e) Legal Metrology (PC) Rules, 2011",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Maximum Retail Price inclusive of taxes",
        measured_value: "₹ 249.00 (INCL. OF ALL TAXES)",
        discrepancy: "Valid statutory MRP declaration.",
        legal_consequence: "Rule 6(1)(e) verified compliant.",
      },
      {
        finding_id: "eval_d_02",
        rule_code: "RULE_06_1_F_NET_QTY",
        statutory_reference: "Rule 6(1)(f) read with Rule 12 LMPC Rules, 2011 & Section 11 LM Act, 2009",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Liquid volume in standard SI unit ('ml' or 'l')",
        measured_value: "100 ml",
        discrepancy: "Standard metric unit verified.",
        legal_consequence: "Net quantity verified compliant.",
      },
      {
        finding_id: "eval_d_03",
        rule_code: "RULE_06_1_H_NET_QTY_FONT",
        statutory_reference: "Rule 6(1)(h) read with Table-I, G.S.R. 629(E)",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Minimum numeral font height >= 1.50 mm (PDP 50-100 cm²)",
        measured_value: "2.80 mm",
        discrepancy: "Exceeds Table-I Row 2 minimum threshold.",
        legal_consequence: "Table-I font height schedule satisfied.",
      },
      {
        finding_id: "eval_d_04",
        rule_code: "RULE_06_1_DA_USP_MATH",
        statutory_reference: "Rule 6(1)(da) / G.S.R. 779(E)",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "|(USP × NetQty) - MRP| <= ₹0.02",
        measured_value: "|(2.49 × 100) - 249.00| = ₹0.00",
        discrepancy: "Exact mathematical consistency (249 / 100 = 2.49).",
        legal_consequence: "Rule 6(1)(da) verified compliant.",
      },
      {
        finding_id: "eval_d_05",
        rule_code: "RULE_06_1_A_MANUFACTURER",
        statutory_reference: "Rule 6(1)(a) & (b) Legal Metrology (PC) Rules, 2011",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Separate declarations for Manufacturer (HP) and Marketer (WB)",
        measured_value: "RSH Wellness Baddi 173205 / Dot & Key Kolkata 700019",
        discrepancy: "Both entities correctly identified with state and PIN.",
        legal_consequence: "Manufacturer particulars verified compliant.",
      },
      {
        finding_id: "eval_d_06",
        rule_code: "RULE_06_1_P_COUNTRY_OF_ORIGIN",
        statutory_reference: "Rule 6(1)(p) Legal Metrology (PC) Rules, 2011",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Country of Origin declared",
        measured_value: "India",
        discrepancy: "Country of origin verified.",
        legal_consequence: "Rule 6(1)(p) compliant.",
      },
    ],
    conflicts: [],
  },

  "REAL-PKG-PERFUME": {
    id: "demo-bella-vita",
    inspection_number: "INSP-20260912-P004",
    created_at: "2026-09-12T12:00:00+05:30",
    officer_id: "INSP-DL-0842",
    jurisdiction_id: "CIRCLE_DL_SOUTH_01",
    capture_source: "PHYSICAL_FIELD",
    product_name: "Bella Vita Luxury Rosé Woman Eau De Parfum 20ml",
    brand_name: "Bella Vita Luxury",
    manufacturer_name: "Stella Industries Limited",
    establishment_name: "Shoppers Stop, DLF Promenade",
    premises_address: "Plot 3, Vasant Kunj Mall Area, New Delhi 110070",
    inspection_type: "ROUTINE_MARKET_SURVEILLANCE",
    category: "COSMETICS_PERSONAL_CARE",
    package_type: "RECTANGULAR",
    workflow_status: "COMPLETED",
    overall_status: "PASS",
    ai_verdict: "PASS",
    declared_net_quantity: "20 ml",
    location: "Sector 37, HSIIDC, Gurugram 122050",
    overall_confidence: 0.98,
    is_mock_fixture: true,
    sku_demo_id: "REAL-PKG-PERFUME",
    epoch_applied: "EPOCH_2022_GSR_779",
    principal_display_panel: {
      package_type: "RECTANGULAR",
      package_area_cm2: 90.0,
      pdp_area_cm2: 36.0,
      pdp_area_percentage: 40.0,
      bounding_box: [30, 30, 950, 750],
    },
    calibration_summary: {
      available: true,
      method: "Planar Metric Scale Calibration",
      referenceObject: "Carton Flap Standard",
      referenceLengthMm: 35.0,
      measuredPixels: 175,
      scaleMmPerPixel: 0.20,
      uncertaintyMm: 0.3,
    },
    measurements: [
      {
        id: "MEAS-PERFUME-01",
        name: "Numeral Font Height (Table-I)",
        observedValue: 1.8,
        declaredValue: 1.0,
        unit: "mm",
        requirementSchedule: "Table-I Row 1 (Area <= 50 cm² >= 1.0 mm)",
        toleranceMin: 1.0,
        toleranceMax: 5.0,
        deviation: 0.8,
        status: "PASS",
        source: "Calibrated DBNet++",
      },
      {
        id: "MEAS-PERFUME-02",
        name: "Unit Sale Price Inversion Handled (USP)",
        observedValue: 19.95,
        declaredValue: 19.95,
        unit: "₹/ml",
        toleranceMin: 19.93,
        toleranceMax: 19.97,
        deviation: 0.0,
        status: "PASS",
        source: "USP Math Engine (399 INR / 20 ml)",
      },
    ],
    evidence_assets: [
      {
        image_id: "img_perfume_01_front",
        inspection_id: "demo-bella-vita",
        file_path: "/storage/uploads/real_products/perfume_front.jpg",
        preview_url: "/storage/uploads/real_products/perfume_front.jpg",
        raw_sha256: "c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4",
        panel_type: "PDP_FRONT",
        image_width: 1920,
        image_height: 1440,
        is_original_untouched: true,
        quality_gate: {
          passed: true,
          blur_variance: 495.0,
          glare_percentage: 0.6,
          skew_angle_deg: 0.2,
          advice: "FRAME_OPTIMAL: Front mono-carton branding clearly visible",
        },
        calibration: {
          is_calibrated: true,
          method: "MANUAL_FIXED",
          px_to_mm: 0.20,
          confidence: 0.99,
          reference_bounding_box: [50, 40, 150, 160],
          margin_of_error_pct: 0.3,
        },
        ocr: {
          image_id: "img_perfume_01_front",
          total_tokens: 3,
          mean_confidence: 0.99,
          execution_time_ms: 78,
          full_text: "BELLA VITA LUXURY\nROSÉ\nEAU DE PARFUM 20ml",
          tokens: [
            {
              token_id: "tok_p_f01",
              text: "BELLA VITA LUXURY",
              confidence: 0.99,
              polygon: [[150, 200], [650, 200], [650, 260], [150, 260]],
              bounding_box: [200, 150, 260, 650],
              language: "en",
              model_source: "DBNet++",
            },
            {
              token_id: "tok_p_f02",
              text: "ROSÉ",
              confidence: 0.99,
              polygon: [[250, 300], [550, 300], [550, 380], [250, 380]],
              bounding_box: [300, 250, 380, 550],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_p_f03",
              text: "EAU DE PARFUM 20ml",
              confidence: 0.98,
              polygon: [[200, 420], [600, 420], [600, 470], [200, 470]],
              bounding_box: [420, 200, 470, 600],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
          ],
        },
      },
      {
        image_id: "img_perfume_02_bottom",
        inspection_id: "demo-bella-vita",
        file_path: "/storage/uploads/real_products/perfume_bottom.jpg",
        preview_url: "/storage/uploads/real_products/perfume_bottom.jpg",
        raw_sha256: "d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5",
        panel_type: "SIDE_PANEL",
        image_width: 1920,
        image_height: 1440,
        is_original_untouched: true,
        quality_gate: {
          passed: true,
          blur_variance: 510.0,
          glare_percentage: 0.4,
          skew_angle_deg: 0.1,
          advice: "FRAME_OPTIMAL: Bottom base flap with complete statutory stamp",
        },
        calibration: {
          is_calibrated: true,
          method: "MANUAL_FIXED",
          px_to_mm: 0.20,
          confidence: 0.99,
          reference_bounding_box: [60, 50, 160, 170],
          margin_of_error_pct: 0.3,
        },
        ocr: {
          image_id: "img_perfume_02_bottom",
          total_tokens: 5,
          mean_confidence: 0.98,
          execution_time_ms: 110,
          full_text: "MRP ₹ 399.00 (INCL. OF ALL TAXES)\nNET VOL: 20 ml\nUSP: ₹ 19.95 / ml\nMFG: 02/2026\nMFG BY: STELLA INDUSTRIES LTD, GURUGRAM 122050",
          tokens: [
            {
              token_id: "tok_p_b01",
              text: "MRP ₹ 399.00 (INCL. OF ALL TAXES)",
              confidence: 0.99,
              polygon: [[80, 80], [750, 80], [750, 140], [80, 140]],
              bounding_box: [80, 80, 140, 750],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_p_b02",
              text: "NET VOL: 20 ml",
              confidence: 0.99,
              polygon: [[80, 160], [450, 160], [450, 210], [80, 210]],
              bounding_box: [160, 80, 210, 450],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_p_b03",
              text: "USP: ₹ 19.95 / ml",
              confidence: 0.98,
              polygon: [[80, 230], [500, 230], [500, 280], [80, 280]],
              bounding_box: [230, 80, 280, 500],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_p_b04",
              text: "MFG: 02/2026",
              confidence: 0.98,
              polygon: [[80, 300], [400, 300], [400, 350], [80, 350]],
              bounding_box: [300, 80, 350, 400],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_p_b05",
              text: "MFG BY: STELLA INDUSTRIES LTD, GURUGRAM 122050",
              confidence: 0.97,
              polygon: [[80, 370], [820, 370], [820, 420], [80, 420]],
              bounding_box: [370, 80, 420, 820],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
          ],
        },
      },
    ],
    extracted_fields: [
      {
        field_id: "fld_p_name",
        field_type: "PRODUCT_NAME",
        raw_ocr_text: "BELLA VITA LUXURY ROSÉ EAU DE PARFUM",
        normalized_value: { text: "Bella Vita Luxury Rosé Woman Eau De Parfum" },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [200, 150, 470, 650],
      },
      {
        field_id: "fld_p_net_qty",
        field_type: "NET_QUANTITY",
        raw_ocr_text: "NET VOL: 20 ml",
        normalized_value: { magnitude: 20.0, unit: "ml" },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [160, 80, 210, 450],
      },
      {
        field_id: "fld_p_mrp",
        field_type: "MRP",
        raw_ocr_text: "MRP ₹ 399.00 (INCL. OF ALL TAXES)",
        normalized_value: { amount_inr: 399.0, is_tax_inclusive: true },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [80, 80, 140, 750],
      },
      {
        field_id: "fld_p_usp",
        field_type: "UNIT_SALE_PRICE",
        raw_ocr_text: "USP: ₹ 19.95 / ml",
        normalized_value: { rate_inr: 19.95, unit: "ml" },
        detection_confidence: 0.98,
        ocr_confidence: 0.98,
        bounding_box: [230, 80, 280, 500],
      },
      {
        field_id: "fld_p_mfg_date",
        field_type: "DATE_OF_MANUFACTURE",
        raw_ocr_text: "MFG: 02/2026",
        normalized_value: { month: 2, year: 2026 },
        detection_confidence: 0.98,
        ocr_confidence: 0.98,
        bounding_box: [300, 80, 350, 400],
      },
      {
        field_id: "fld_p_mfg_addr",
        field_type: "MANUFACTURER_ADDRESS",
        raw_ocr_text: "STELLA INDUSTRIES LTD, GURUGRAM 122050",
        normalized_value: {
          name: "Stella Industries Limited",
          city: "Gurugram",
          state: "Haryana",
          pincode: "122050",
        },
        detection_confidence: 0.97,
        ocr_confidence: 0.97,
        bounding_box: [370, 80, 420, 820],
      },
    ],
    rule_evaluations: [
      {
        finding_id: "eval_p_01",
        rule_code: "RULE_06_1_E_MRP",
        statutory_reference: "Rule 6(1)(e) Legal Metrology (PC) Rules, 2011",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Maximum Retail Price inclusive of all taxes",
        measured_value: "₹ 399.00 (INCL. OF ALL TAXES)",
        discrepancy: "Valid statutory MRP declaration.",
        legal_consequence: "Rule 6(1)(e) verified compliant.",
      },
      {
        finding_id: "eval_p_02",
        rule_code: "RULE_06_1_F_NET_QTY",
        statutory_reference: "Rule 6(1)(f) read with Rule 12 LMPC Rules, 2011 & Section 11 LM Act, 2009",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Volume in standard metric SI unit ('ml')",
        measured_value: "20 ml",
        discrepancy: "Standard metric unit verified.",
        legal_consequence: "Net quantity verified compliant.",
      },
      {
        finding_id: "eval_p_03",
        rule_code: "RULE_06_1_H_NET_QTY_FONT",
        statutory_reference: "Rule 6(1)(h) read with Table-I, G.S.R. 629(E)",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Minimum numeral font height >= 1.00 mm (PDP <= 50 cm²)",
        measured_value: "1.80 mm",
        discrepancy: "Exceeds Table-I Row 1 threshold.",
        legal_consequence: "Table-I font height schedule satisfied.",
      },
      {
        finding_id: "eval_p_04",
        rule_code: "RULE_06_1_DA_USP_MATH",
        statutory_reference: "Rule 6(1)(da) / G.S.R. 779(E)",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "|(USP × NetQty) - MRP| <= ₹0.02",
        measured_value: "|(19.95 × 20) - 399.00| = ₹0.00",
        discrepancy: "Exact rate calculation verified without false positive rate inversion.",
        legal_consequence: "Rule 6(1)(da) verified compliant.",
      },
      {
        finding_id: "eval_p_05",
        rule_code: "RULE_06_1_A_MANUFACTURER",
        statutory_reference: "Rule 6(1)(a) Legal Metrology (PC) Rules, 2011",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Name and address of manufacturer",
        measured_value: "Stella Industries Limited, Gurugram 122050",
        discrepancy: "Corporate name, city, and PIN code verified.",
        legal_consequence: "Manufacturer address verified compliant.",
      },
    ],
    conflicts: [],
  },

  "REAL-PKG-NAMKEEN": {
    id: "demo-haldiram-namkeen",
    inspection_number: "INSP-20260912-N005",
    created_at: "2026-09-12T12:30:00+05:30",
    officer_id: "INSP-DL-0842",
    jurisdiction_id: "CIRCLE_DL_SOUTH_01",
    capture_source: "PHYSICAL_FIELD",
    product_name: "Haldiram's Nagpur Navrattan Spicy Mixture 400g",
    brand_name: "Haldiram's Nagpur",
    manufacturer_name: "Haldiram Snacks Pvt Ltd",
    establishment_name: "Modern Bazaar, Vasant Vihar",
    premises_address: "Basant Lok Community Centre, New Delhi 110057",
    inspection_type: "ROUTINE_MARKET_SURVEILLANCE",
    category: "FOOD_SNACKS",
    package_type: "FLEXIBLE_POUCH",
    workflow_status: "COMPLETED",
    overall_status: "PASS",
    ai_verdict: "PASS",
    declared_net_quantity: "400 g",
    location: "Sector 62, Noida 201307",
    overall_confidence: 0.99,
    is_mock_fixture: true,
    sku_demo_id: "REAL-PKG-NAMKEEN",
    epoch_applied: "EPOCH_2022_GSR_779",
    principal_display_panel: {
      package_type: "FLEXIBLE_POUCH",
      package_area_cm2: 525.0,
      pdp_area_cm2: 210.0,
      pdp_area_percentage: 40.0,
      bounding_box: [40, 40, 960, 840],
    },
    calibration_summary: {
      available: true,
      method: "Planar Homography Scale",
      referenceObject: "Pouch Pkg Dimension Reference",
      referenceLengthMm: 160.0,
      measuredPixels: 640,
      scaleMmPerPixel: 0.25,
      uncertaintyMm: 0.5,
    },
    measurements: [
      {
        id: "MEAS-NAMKEEN-01",
        name: "Numeral Font Height (Table-I)",
        observedValue: 3.4,
        declaredValue: 2.5,
        unit: "mm",
        requirementSchedule: "Table-I Row 3 (Area 100-500 cm² >= 2.5 mm)",
        toleranceMin: 2.5,
        toleranceMax: 8.0,
        deviation: 0.9,
        status: "PASS",
        source: "Calibrated DBNet++",
      },
      {
        id: "MEAS-NAMKEEN-02",
        name: "Unit Sale Price Consistency (USP)",
        observedValue: 0.25,
        declaredValue: 0.25,
        unit: "₹/g",
        toleranceMin: 0.24,
        toleranceMax: 0.26,
        deviation: 0.0,
        status: "PASS",
        source: "USP Math Engine (100 INR / 400 g)",
      },
    ],
    evidence_assets: [
      {
        image_id: "img_namkeen_01_front",
        inspection_id: "demo-haldiram-namkeen",
        file_path: "/storage/uploads/real_products/namkeen_front.jpg",
        preview_url: "/storage/uploads/real_products/namkeen_front.jpg",
        raw_sha256: "e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6",
        panel_type: "PDP_FRONT",
        image_width: 1920,
        image_height: 1440,
        is_original_untouched: true,
        quality_gate: {
          passed: true,
          blur_variance: 512.0,
          glare_percentage: 0.5,
          skew_angle_deg: 0.2,
          advice: "FRAME_OPTIMAL: Front pouch illustration and branding clearly resolved",
        },
        calibration: {
          is_calibrated: true,
          method: "MANUAL_FIXED",
          px_to_mm: 0.25,
          confidence: 0.99,
          reference_bounding_box: [100, 60, 240, 220],
          margin_of_error_pct: 0.5,
        },
        ocr: {
          image_id: "img_namkeen_01_front",
          total_tokens: 3,
          mean_confidence: 0.99,
          execution_time_ms: 95,
          full_text: "Haldiram's NAGPUR\nNAVRATTAN\nSPICY MIXTURE",
          tokens: [
            {
              token_id: "tok_n_f01",
              text: "Haldiram's NAGPUR",
              confidence: 0.99,
              polygon: [[200, 180], [680, 180], [680, 260], [200, 260]],
              bounding_box: [180, 200, 260, 680],
              language: "en",
              model_source: "DBNet++",
            },
            {
              token_id: "tok_n_f02",
              text: "NAVRATTAN",
              confidence: 0.99,
              polygon: [[220, 280], [640, 280], [640, 360], [220, 360]],
              bounding_box: [280, 220, 360, 640],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_n_f03",
              text: "SPICY MIXTURE",
              confidence: 0.98,
              polygon: [[240, 380], [620, 380], [620, 430], [240, 430]],
              bounding_box: [380, 240, 430, 620],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
          ],
        },
      },
      {
        image_id: "img_namkeen_02_macro",
        inspection_id: "demo-haldiram-namkeen",
        file_path: "/storage/uploads/real_products/namkeen_macro.jpg",
        preview_url: "/storage/uploads/real_products/namkeen_macro.jpg",
        raw_sha256: "f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7",
        panel_type: "SIDE_PANEL",
        image_width: 1920,
        image_height: 1440,
        is_original_untouched: true,
        quality_gate: {
          passed: true,
          blur_variance: 540.0,
          glare_percentage: 0.2,
          skew_angle_deg: 0.1,
          advice: "FRAME_OPTIMAL: White statutory block with crisp typography",
        },
        calibration: {
          is_calibrated: true,
          method: "MANUAL_FIXED",
          px_to_mm: 0.18,
          confidence: 0.99,
          reference_bounding_box: [80, 50, 180, 170],
          margin_of_error_pct: 0.3,
        },
        ocr: {
          image_id: "img_namkeen_02_macro",
          total_tokens: 5,
          mean_confidence: 0.99,
          execution_time_ms: 105,
          full_text: "NET WT.: 400 g\nMRP Rs. 100.00 (INCL. OF ALL TAXES)\nUSP: Rs. 0.25 / g\nMFG DATE: 24/08/2026\nHALDIRAM SNACKS PVT LTD, NOIDA 201307",
          tokens: [
            {
              token_id: "tok_n_m01",
              text: "NET WT.: 400 g",
              confidence: 0.99,
              polygon: [[80, 80], [500, 80], [500, 140], [80, 140]],
              bounding_box: [80, 80, 140, 500],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_n_m02",
              text: "MRP Rs. 100.00 (INCL. OF ALL TAXES)",
              confidence: 0.99,
              polygon: [[80, 160], [800, 160], [800, 220], [80, 220]],
              bounding_box: [160, 80, 220, 800],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_n_m03",
              text: "USP: Rs. 0.25 / g",
              confidence: 0.99,
              polygon: [[80, 240], [520, 240], [520, 290], [80, 290]],
              bounding_box: [240, 80, 290, 520],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_n_m04",
              text: "MFG DATE: 24/08/2026",
              confidence: 0.98,
              polygon: [[80, 310], [560, 310], [560, 360], [80, 360]],
              bounding_box: [310, 80, 360, 560],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_n_m05",
              text: "HALDIRAM SNACKS PVT LTD, NOIDA 201307",
              confidence: 0.98,
              polygon: [[80, 380], [850, 380], [850, 430], [80, 430]],
              bounding_box: [380, 80, 430, 850],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
          ],
        },
      },
    ],
    extracted_fields: [
      {
        field_id: "fld_n_name",
        field_type: "PRODUCT_NAME",
        raw_ocr_text: "Haldiram's NAGPUR NAVRATTAN SPICY MIXTURE",
        normalized_value: { text: "Haldiram's Nagpur Navrattan Spicy Mixture" },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [180, 200, 360, 680],
      },
      {
        field_id: "fld_n_net_qty",
        field_type: "NET_QUANTITY",
        raw_ocr_text: "NET WT.: 400 g",
        normalized_value: { magnitude: 400.0, unit: "g" },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [80, 80, 140, 500],
      },
      {
        field_id: "fld_n_mrp",
        field_type: "MRP",
        raw_ocr_text: "MRP Rs. 100.00 (INCL. OF ALL TAXES)",
        normalized_value: { amount_inr: 100.0, is_tax_inclusive: true },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [160, 80, 220, 800],
      },
      {
        field_id: "fld_n_usp",
        field_type: "UNIT_SALE_PRICE",
        raw_ocr_text: "USP: Rs. 0.25 / g",
        normalized_value: { rate_inr: 0.25, unit: "g" },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [240, 80, 290, 520],
      },
      {
        field_id: "fld_n_mfg_date",
        field_type: "DATE_OF_MANUFACTURE",
        raw_ocr_text: "MFG DATE: 24/08/2026",
        normalized_value: { day: 24, month: 8, year: 2026 },
        detection_confidence: 0.98,
        ocr_confidence: 0.98,
        bounding_box: [310, 80, 360, 560],
      },
      {
        field_id: "fld_n_mfg_addr",
        field_type: "MANUFACTURER_ADDRESS",
        raw_ocr_text: "HALDIRAM SNACKS PVT LTD, NOIDA 201307",
        normalized_value: {
          name: "Haldiram Snacks Pvt Ltd",
          city: "Noida",
          state: "Uttar Pradesh",
          pincode: "201307",
        },
        detection_confidence: 0.98,
        ocr_confidence: 0.98,
        bounding_box: [380, 80, 430, 850],
      },
    ],
    rule_evaluations: [
      {
        finding_id: "eval_n_01",
        rule_code: "RULE_06_1_E_MRP",
        statutory_reference: "Rule 6(1)(e) Legal Metrology (PC) Rules, 2011",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Maximum Retail Price inclusive of all taxes",
        measured_value: "Rs. 100.00 (INCL. OF ALL TAXES)",
        discrepancy: "Compliant MRP declaration.",
        legal_consequence: "Rule 6(1)(e) verified compliant.",
      },
      {
        finding_id: "eval_n_02",
        rule_code: "RULE_06_1_F_NET_QTY",
        statutory_reference: "Rule 6(1)(f) read with Rule 12 LMPC Rules, 2011 & Section 11 LM Act, 2009",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Solid weight in standard SI symbol ('g')",
        measured_value: "400 g",
        discrepancy: "SI metric unit verified with zero prohibited unit symbols.",
        legal_consequence: "Net quantity verified compliant.",
      },
      {
        finding_id: "eval_n_03",
        rule_code: "RULE_06_1_H_NET_QTY_FONT",
        statutory_reference: "Rule 6(1)(h) read with Table-I, G.S.R. 629(E)",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Minimum numeral font height >= 2.50 mm (PDP 100-500 cm²)",
        measured_value: "3.40 mm",
        discrepancy: "Exceeds Table-I Row 3 statutory threshold.",
        legal_consequence: "Table-I font height schedule satisfied.",
      },
      {
        finding_id: "eval_n_04",
        rule_code: "RULE_06_1_DA_USP_MATH",
        statutory_reference: "Rule 6(1)(da) / G.S.R. 779(E)",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "|(USP × NetQty) - MRP| <= ₹0.02",
        measured_value: "|(0.25 × 400) - 100.00| = ₹0.00",
        discrepancy: "Exact mathematical consistency (100 / 400 = 0.25).",
        legal_consequence: "Rule 6(1)(da) verified compliant.",
      },
      {
        finding_id: "eval_n_05",
        rule_code: "RULE_06_1_A_MANUFACTURER",
        statutory_reference: "Rule 6(1)(a) Legal Metrology (PC) Rules, 2011",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Name and address of manufacturer",
        measured_value: "Haldiram Snacks Pvt Ltd, Noida 201307",
        discrepancy: "Corporate name, locality, and PIN code present.",
        legal_consequence: "Manufacturer address verified compliant.",
      },
    ],
    conflicts: [],
  },

  "REAL-PKG-CHIA": {
    id: "demo-true-elements",
    inspection_number: "INSP-20260912-C006",
    created_at: "2026-09-12T13:00:00+05:30",
    officer_id: "INSP-DL-0842",
    jurisdiction_id: "CIRCLE_DL_SOUTH_01",
    capture_source: "PHYSICAL_FIELD",
    product_name: "True Elements Raw Chia Seeds 250g",
    brand_name: "True Elements",
    manufacturer_name: "HW Wellness Solutions Pvt Ltd",
    establishment_name: "Nature's Basket, Defence Colony",
    premises_address: "D-Block, Defence Colony, New Delhi 110024",
    inspection_type: "ROUTINE_MARKET_SURVEILLANCE",
    category: "FOOD_SNACKS",
    package_type: "FLEXIBLE_POUCH",
    workflow_status: "COMPLETED",
    overall_status: "PASS",
    ai_verdict: "PASS",
    declared_net_quantity: "250 g",
    location: "Hinjawadi, Pune 411057 / Mumbai 400098",
    overall_confidence: 0.99,
    is_mock_fixture: true,
    sku_demo_id: "REAL-PKG-CHIA",
    epoch_applied: "EPOCH_2022_GSR_779",
    principal_display_panel: {
      package_type: "FLEXIBLE_POUCH",
      package_area_cm2: 437.5,
      pdp_area_cm2: 175.0,
      pdp_area_percentage: 40.0,
      bounding_box: [50, 50, 950, 750],
    },
    calibration_summary: {
      available: true,
      method: "Planar Metric Homography",
      referenceObject: "Stand-Up Pouch Width",
      referenceLengthMm: 140.0,
      measuredPixels: 560,
      scaleMmPerPixel: 0.25,
      uncertaintyMm: 0.5,
    },
    measurements: [
      {
        id: "MEAS-CHIA-01",
        name: "Numeral Font Height (Table-I)",
        observedValue: 3.1,
        declaredValue: 2.5,
        unit: "mm",
        requirementSchedule: "Table-I Row 3 (Area 100-500 cm² >= 2.5 mm)",
        toleranceMin: 2.5,
        toleranceMax: 7.0,
        deviation: 0.6,
        status: "PASS",
        source: "Calibrated DBNet++",
      },
      {
        id: "MEAS-CHIA-02",
        name: "Unit Sale Price Consistency (USP)",
        observedValue: 1.40,
        declaredValue: 1.40,
        unit: "₹/g",
        toleranceMin: 1.39,
        toleranceMax: 1.41,
        deviation: 0.0,
        status: "PASS",
        source: "USP Math Engine (350 INR / 250 g)",
      },
    ],
    evidence_assets: [
      {
        image_id: "img_chia_01_front",
        inspection_id: "demo-true-elements",
        file_path: "/storage/uploads/real_products/chia_front.jpg",
        preview_url: "/storage/uploads/real_products/chia_front.jpg",
        raw_sha256: "a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8",
        panel_type: "PDP_FRONT",
        image_width: 1920,
        image_height: 1440,
        is_original_untouched: true,
        quality_gate: {
          passed: true,
          blur_variance: 510.0,
          glare_percentage: 0.4,
          skew_angle_deg: 0.2,
          advice: "FRAME_OPTIMAL: Stand-up front branding clearly resolved",
        },
        calibration: {
          is_calibrated: true,
          method: "MANUAL_FIXED",
          px_to_mm: 0.25,
          confidence: 0.99,
          reference_bounding_box: [100, 60, 220, 200],
          margin_of_error_pct: 0.5,
        },
        ocr: {
          image_id: "img_chia_01_front",
          total_tokens: 3,
          mean_confidence: 0.99,
          execution_time_ms: 88,
          full_text: "True Elements\nRAW CHIA SEEDS\n100% WHOLE NATURAL",
          tokens: [
            {
              token_id: "tok_c_f01",
              text: "True Elements",
              confidence: 0.99,
              polygon: [[200, 200], [650, 200], [650, 270], [200, 270]],
              bounding_box: [200, 200, 270, 650],
              language: "en",
              model_source: "DBNet++",
            },
            {
              token_id: "tok_c_f02",
              text: "RAW CHIA SEEDS",
              confidence: 0.99,
              polygon: [[220, 300], [630, 300], [630, 370], [220, 370]],
              bounding_box: [300, 220, 370, 630],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_c_f03",
              text: "100% WHOLE NATURAL",
              confidence: 0.98,
              polygon: [[240, 390], [610, 390], [610, 440], [240, 440]],
              bounding_box: [390, 240, 440, 610],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
          ],
        },
      },
      {
        image_id: "img_chia_02_back",
        inspection_id: "demo-true-elements",
        file_path: "/storage/uploads/real_products/chia_back.jpg",
        preview_url: "/storage/uploads/real_products/chia_back.jpg",
        raw_sha256: "b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9",
        panel_type: "BACK_PANEL",
        image_width: 1920,
        image_height: 1440,
        is_original_untouched: true,
        quality_gate: {
          passed: true,
          blur_variance: 525.0,
          glare_percentage: 0.3,
          skew_angle_deg: 0.1,
          advice: "FRAME_OPTIMAL: Full statutory table with complete manufacturer details",
        },
        calibration: {
          is_calibrated: true,
          method: "MANUAL_FIXED",
          px_to_mm: 0.25,
          confidence: 0.99,
          reference_bounding_box: [80, 50, 180, 180],
          margin_of_error_pct: 0.4,
        },
        ocr: {
          image_id: "img_chia_02_back",
          total_tokens: 6,
          mean_confidence: 0.99,
          execution_time_ms: 112,
          full_text: "NET QTY: 250 g\nMRP: ₹ 350.00 (INCL. OF ALL TAXES)\nUSP: ₹ 1.40 / g\nMFG DATE: 28-05-2026\nMFG BY: HW WELLNESS SOLUTIONS PVT LTD, PUNE 411057\nCARE: care@true-elements.com / +91 7447407040",
          tokens: [
            {
              token_id: "tok_c_b01",
              text: "NET QTY: 250 g",
              confidence: 0.99,
              polygon: [[80, 80], [480, 80], [480, 130], [80, 130]],
              bounding_box: [80, 80, 130, 480],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_c_b02",
              text: "MRP: ₹ 350.00 (INCL. OF ALL TAXES)",
              confidence: 0.99,
              polygon: [[80, 150], [750, 150], [750, 210], [80, 210]],
              bounding_box: [150, 80, 210, 750],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_c_b03",
              text: "USP: ₹ 1.40 / g",
              confidence: 0.99,
              polygon: [[80, 230], [500, 230], [500, 280], [80, 280]],
              bounding_box: [230, 80, 280, 500],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_c_b04",
              text: "MFG DATE: 28-05-2026",
              confidence: 0.98,
              polygon: [[80, 300], [550, 300], [550, 350], [80, 350]],
              bounding_box: [300, 80, 350, 550],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_c_b05",
              text: "MFG BY: HW WELLNESS SOLUTIONS PVT LTD, PUNE 411057",
              confidence: 0.98,
              polygon: [[80, 370], [860, 370], [860, 420], [80, 420]],
              bounding_box: [370, 80, 420, 860],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
            {
              token_id: "tok_c_b06",
              text: "CARE: care@true-elements.com / +91 7447407040",
              confidence: 0.97,
              polygon: [[80, 440], [850, 440], [850, 490], [80, 490]],
              bounding_box: [440, 80, 490, 850],
              language: "en",
              model_source: "PP-OCRv4_Latin",
            },
          ],
        },
      },
    ],
    extracted_fields: [
      {
        field_id: "fld_c_name",
        field_type: "PRODUCT_NAME",
        raw_ocr_text: "True Elements RAW CHIA SEEDS",
        normalized_value: { text: "True Elements Raw Chia Seeds" },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [200, 200, 370, 650],
      },
      {
        field_id: "fld_c_net_qty",
        field_type: "NET_QUANTITY",
        raw_ocr_text: "NET QTY: 250 g",
        normalized_value: { magnitude: 250.0, unit: "g" },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [80, 80, 130, 480],
      },
      {
        field_id: "fld_c_mrp",
        field_type: "MRP",
        raw_ocr_text: "MRP: ₹ 350.00 (INCL. OF ALL TAXES)",
        normalized_value: { amount_inr: 350.0, is_tax_inclusive: true },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [150, 80, 210, 750],
      },
      {
        field_id: "fld_c_usp",
        field_type: "UNIT_SALE_PRICE",
        raw_ocr_text: "USP: ₹ 1.40 / g",
        normalized_value: { rate_inr: 1.40, unit: "g" },
        detection_confidence: 0.99,
        ocr_confidence: 0.99,
        bounding_box: [230, 80, 280, 500],
      },
      {
        field_id: "fld_c_mfg_date",
        field_type: "DATE_OF_MANUFACTURE",
        raw_ocr_text: "MFG DATE: 28-05-2026",
        normalized_value: { day: 28, month: 5, year: 2026 },
        detection_confidence: 0.98,
        ocr_confidence: 0.98,
        bounding_box: [300, 80, 350, 550],
      },
      {
        field_id: "fld_c_mfg_addr",
        field_type: "MANUFACTURER_ADDRESS",
        raw_ocr_text: "HW WELLNESS SOLUTIONS PVT LTD, PUNE 411057",
        normalized_value: {
          name: "HW Wellness Solutions Pvt Ltd",
          city: "Pune",
          state: "Maharashtra",
          pincode: "411057",
        },
        detection_confidence: 0.98,
        ocr_confidence: 0.98,
        bounding_box: [370, 80, 420, 860],
      },
      {
        field_id: "fld_c_care",
        field_type: "CONSUMER_CARE",
        raw_ocr_text: "care@true-elements.com / +91 7447407040",
        normalized_value: { email: "care@true-elements.com", phone: "+91 7447407040" },
        detection_confidence: 0.97,
        ocr_confidence: 0.97,
        bounding_box: [440, 80, 490, 850],
      },
    ],
    rule_evaluations: [
      {
        finding_id: "eval_c_01",
        rule_code: "RULE_06_1_E_MRP",
        statutory_reference: "Rule 6(1)(e) Legal Metrology (PC) Rules, 2011",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Maximum Retail Price inclusive of all taxes",
        measured_value: "₹ 350.00 (INCL. OF ALL TAXES)",
        discrepancy: "Valid statutory MRP declaration.",
        legal_consequence: "Rule 6(1)(e) verified compliant.",
      },
      {
        finding_id: "eval_c_02",
        rule_code: "RULE_06_1_F_NET_QTY",
        statutory_reference: "Rule 6(1)(f) read with Rule 12 LMPC Rules, 2011 & Section 11 LM Act, 2009",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Solid weight in standard SI symbol ('g')",
        measured_value: "250 g",
        discrepancy: "SI metric unit verified.",
        legal_consequence: "Net quantity verified compliant.",
      },
      {
        finding_id: "eval_c_03",
        rule_code: "RULE_06_1_H_NET_QTY_FONT",
        statutory_reference: "Rule 6(1)(h) read with Table-I, G.S.R. 629(E)",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Minimum numeral font height >= 2.50 mm (PDP 100-500 cm²)",
        measured_value: "3.10 mm",
        discrepancy: "Exceeds Table-I Row 3 statutory threshold.",
        legal_consequence: "Table-I font height schedule satisfied.",
      },
      {
        finding_id: "eval_c_04",
        rule_code: "RULE_06_1_DA_USP_MATH",
        statutory_reference: "Rule 6(1)(da) / G.S.R. 779(E)",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "|(USP × NetQty) - MRP| <= ₹0.02",
        measured_value: "|(1.40 × 250) - 350.00| = ₹0.00",
        discrepancy: "Exact mathematical consistency (350 / 250 = 1.40).",
        legal_consequence: "Rule 6(1)(da) verified compliant.",
      },
      {
        finding_id: "eval_c_05",
        rule_code: "RULE_06_1_A_MANUFACTURER",
        statutory_reference: "Rule 6(1)(a) Legal Metrology (PC) Rules, 2011",
        status: "PASS",
        severity: "CRITICAL",
        required_value: "Name and address of manufacturer",
        measured_value: "HW Wellness Solutions Pvt Ltd, Pune 411057",
        discrepancy: "Corporate name, city, state, and PIN code present.",
        legal_consequence: "Manufacturer address verified compliant.",
      },
    ],
    conflicts: [],
  },

  // Aliases for clean URL navigation
  "demo-fastrack-watch": null as any,
  "demo-himalaya-brahmi": null as any,
  "demo-dot-and-key": null as any,
  "demo-bella-vita": null as any,
  "demo-haldiram-namkeen": null as any,
  "demo-true-elements": null as any,

};
// Link aliases to the corresponding physical packaging cases
(GOLDEN_SKU_CASES as any)["demo-fastrack-watch"] = GOLDEN_SKU_CASES["REAL-PKG-WATCH"];
(GOLDEN_SKU_CASES as any)["demo-himalaya-brahmi"] = GOLDEN_SKU_CASES["REAL-PKG-BRAHMI"];
(GOLDEN_SKU_CASES as any)["demo-dot-and-key"] = GOLDEN_SKU_CASES["REAL-PKG-FACEWASH"];
(GOLDEN_SKU_CASES as any)["demo-bella-vita"] = GOLDEN_SKU_CASES["REAL-PKG-PERFUME"];
(GOLDEN_SKU_CASES as any)["demo-haldiram-namkeen"] = GOLDEN_SKU_CASES["REAL-PKG-NAMKEEN"];
(GOLDEN_SKU_CASES as any)["demo-true-elements"] = GOLDEN_SKU_CASES["REAL-PKG-CHIA"];


export const MOCK_DASHBOARD_SUMMARY: DashboardSummary = {
  jurisdiction_circle: "CIRCLE_DL_SOUTH_01",
  total_inspections: 1420,
  violations_detected: 366,
  compliant_count: 1054,
  pending_adjudication: 18,
  form1_notices_issued: 312,
  compliance_rate_pct: 74.2,
  recent_inspections: Object.values(GOLDEN_SKU_CASES).map((c) => ({
    id: c.id,
    inspection_number: c.inspection_number,
    product_name: c.product_name,
    brand_name: c.brand_name,
    manufacturer_name: c.manufacturer_name,
    establishment_name: c.establishment_name,
    inspection_type: c.inspection_type,
    category: c.category,
    package_type: c.package_type,
    workflow_status: c.workflow_status,
    overall_status: c.overall_status,
    ai_verdict: c.ai_verdict,
    jurisdiction_id: c.jurisdiction_id,
    created_at: c.created_at,
    violations_count: c.rule_evaluations.filter((e) => e.status === "FAIL").length,
    is_mock_fixture: true,
  })),
};

export const USER_CASES_STORAGE_KEY = "Nirikshak_persisted_cases_v2";
export const DELETED_CASES_STORAGE_KEY = "Nirikshak_deleted_case_ids_v1";

const inMemoryDeletedIds = new Set<string>();

export function getDeletedCaseIds(): Set<string> {
  const result = new Set<string>(inMemoryDeletedIds);
  try {
    const storage = getStorage();
    if (storage) {
      const raw = storage.getItem(DELETED_CASES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach((id) => result.add(id));
        }
      }
    }
  } catch {}
  return result;
}

export function saveDeletedCaseId(id: string): void {
  if (!id) return;
  inMemoryDeletedIds.add(id);
  try {
    const storage = getStorage();
    if (storage) {
      const ids = getDeletedCaseIds();
      storage.setItem(DELETED_CASES_STORAGE_KEY, JSON.stringify(Array.from(ids)));
    }
  } catch {}
}

function getStorage(): Storage | null {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage;
    }
    if (typeof globalThis !== "undefined" && (globalThis as any).window?.localStorage) {
      return (globalThis as any).window.localStorage;
    }
  } catch {
    // Ignore storage detection error
  }
  return null;
}

export function loadPersistedCases(): Record<string, InspectionCase> {
  try {
    const storage = getStorage();
    if (!storage) return {};
    const raw = storage.getItem(USER_CASES_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Record<string, InspectionCase>;
  } catch (err) {
    console.warn("Failed to load persisted cases from storage:", err);
    return {};
  }
}

export function savePersistedCases(casesMap: Map<string, InspectionCase>): void {
  try {
    const storage = getStorage();
    if (!storage) return;
    const toPersist: Record<string, InspectionCase> = {};
    casesMap.forEach((val, key) => {
      // Avoid re-persisting unmodified demo fixtures to keep storage compact.
      // Persist any user-registered case or modified demo fixture.
      const isBaselineDemo = (GOLDEN_SKU_CASES as Record<string, InspectionCase>)[key];
      const isModifiedDemo =
        Boolean(isBaselineDemo && (val.adjudication || (val.audit_trail && val.audit_trail.length > 4)));
      if (!isBaselineDemo || isModifiedDemo) {
        toPersist[key] = val;
      }
    });

    // ---------- Tier 1: Strip all base64/blob data URLs BEFORE first attempt ----------
    // Base64 data URLs can be 500KB-2MB each and are the #1 cause of QuotaExceededError.
    // They are ephemeral display previews, NOT statutory evidence, safe to discard on persist.
    const stripHeavyMedia = (cases: Record<string, InspectionCase>): Record<string, InspectionCase> => {
      const stripped: Record<string, InspectionCase> = {};
      Object.entries(cases).forEach(([k, c]) => {
        stripped[k] = {
          ...c,
          evidence_assets: c.evidence_assets.map((a) => ({
            ...a,
            // Drop data: URIs and blob: URIs entirely, they cannot survive a page reload anyway
            preview_url: a.preview_url && (a.preview_url.startsWith("data:") || a.preview_url.startsWith("blob:"))
              ? ""
              : (a.preview_url && a.preview_url.length > 2048 ? "" : a.preview_url),
          })),
        };
      });
      return stripped;
    };

    const lean = stripHeavyMedia(toPersist);

    try {
      storage.setItem(USER_CASES_STORAGE_KEY, JSON.stringify(lean));
      return; // Success, exit early
    } catch {
      // Still too large, proceed to Tier 2
    }

    // ---------- Tier 2: Also strip audit_trail and ocr_raw_text ----------
    const deepPruned: Record<string, InspectionCase> = {};
    Object.entries(lean).forEach(([k, c]) => {
      deepPruned[k] = {
        ...c,
        audit_trail: c.audit_trail ? c.audit_trail.slice(0, 3) : [],
        evidence_assets: c.evidence_assets.map((a) => ({
          ...a,
          preview_url: "",
          // Strip any large OCR text blobs if present
          ...(a as any).ocr_raw_text ? { ocr_raw_text: "" } : {},
        })),
      };
    });

    try {
      storage.setItem(USER_CASES_STORAGE_KEY, JSON.stringify(deepPruned));
      return;
    } catch {
      // Still too large, proceed to Tier 3
    }

    // ---------- Tier 3: Evict oldest cases until it fits (keep max 15) ----------
    const entries = Object.entries(deepPruned);
    entries.sort((a, b) => {
      const tA = a[1].created_at || "";
      const tB = b[1].created_at || "";
      return tB.localeCompare(tA); // newest first
    });

    const MAX_KEEP = 15;
    for (let keep = Math.min(entries.length, MAX_KEEP); keep >= 1; keep--) {
      const sliced: Record<string, InspectionCase> = {};
      entries.slice(0, keep).forEach(([k, v]) => { sliced[k] = v; });
      try {
        storage.setItem(USER_CASES_STORAGE_KEY, JSON.stringify(sliced));
        return;
      } catch {
        // Try keeping fewer
      }
    }

    // ---------- Tier 4: Nuclear, clear persisted cases entirely ----------
    try {
      storage.removeItem(USER_CASES_STORAGE_KEY);
    } catch {
      // Nothing more we can do
    }
  } catch (err) {
    console.warn("Failed to save persisted cases to storage:", err);
  }
}

function initDynamicCases(): Map<string, InspectionCase> {
  const deletedIds = getDeletedCaseIds();
  const map = new Map<string, InspectionCase>();
  Object.entries(GOLDEN_SKU_CASES).forEach(([k, v]) => {
    if (!deletedIds.has(k) && !deletedIds.has(v.id) && !deletedIds.has(v.inspection_number)) {
      map.set(k, v);
    }
  });
  const persisted = loadPersistedCases();
  Object.entries(persisted).forEach(([k, v]) => {
    if (!deletedIds.has(k) && !deletedIds.has(v.id) && !deletedIds.has(v.inspection_number)) {
      map.set(k, v);
      if (v.id && !map.has(v.id)) {
        map.set(v.id, v);
      }
    }
  });
  return map;
}

const dynamicCases: Map<string, InspectionCase> = initDynamicCases();

/**
 * Creates a baseline chronological audit record for an inspection case
 * according to 08_DATABASE_SPECIFICATION.md audit_logs specifications.
 */
export function createDefaultAuditTrail(caseData: InspectionCase): AuditEvent[] {
  const events: AuditEvent[] = [];
  let seq = 1;
  const createdAt = caseData.created_at || "2026-09-10T09:15:00Z";

  // 1. Case registered
  events.push({
    id: `evt_${caseData.id}_01`,
    sequence_number: seq++,
    timestamp_utc: createdAt,
    event_type: "INSPECTION_CREATED",
    event_label: "Inspection Case Registered",
    actor_type: "OFFICER",
    actor_id: caseData.officer_id || "INSP-DL-0842",
    actor_name: "Rajesh Sharma",
    entity_type: "INSPECTION",
    entity_id: caseData.id,
    remarks: `Registered case ${caseData.inspection_number} for commodity: ${caseData.product_name}.`,
    previous_hash: "0000000000000000000000000000000000000000000000000000000000000000",
    entry_hash: "e1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f80",
  });

  // 2. Evidence asset ingested
  const asset = caseData.evidence_assets[0];
  if (asset) {
    events.push({
      id: `evt_${caseData.id}_02`,
      sequence_number: seq++,
      timestamp_utc: asset.uploaded_at || createdAt,
      event_type: "IMAGE_UPLOADED",
      event_label: "Physical Evidence Ingested",
      actor_type: "OFFICER",
      actor_id: caseData.officer_id || "INSP-DL-0842",
      actor_name: "Rajesh Sharma",
      entity_type: "EVIDENCE",
      entity_id: asset.image_id,
      related_evidence_id: asset.image_id,
      metadata: {
        raw_sha256: asset.raw_sha256,
        panel_type: asset.panel_type,
        dimensions: `${asset.image_width}x${asset.image_height}`,
      },
      remarks: `Captured ${asset.panel_type} packaging photograph. Canonical SHA-256 registered.`,
      previous_hash: events[events.length - 1].entry_hash,
      entry_hash: "f2b3c4d5e6f7a819203b4c5d6e7f8091a2b3c4d5e6f7a819203b4c5d6e7f8091",
    });
  }

  // 3. AI Pipeline Inference Executed
  if (caseData.rule_evaluations && caseData.rule_evaluations.length > 0) {
    events.push({
      id: `evt_${caseData.id}_03`,
      sequence_number: seq++,
      timestamp_utc: "2026-09-10T09:17:30Z",
      event_type: "AI_INFERENCE_EXECUTED",
      event_label: "Pipeline Analysis Completed",
      actor_type: "SYSTEM",
      actor_id: "SYSTEM_PIPELINE",
      actor_name: "Veriq Automated Pipeline",
      entity_type: "INSPECTION",
      entity_id: caseData.id,
      related_evidence_id: asset?.image_id,
      metadata: {
        rule_evaluations_count: caseData.rule_evaluations.length,
        overall_status: caseData.overall_status,
      },
      remarks: `Evaluated ${caseData.rule_evaluations.length} statutory rule items. Epistemic verdict: ${caseData.overall_status}.`,
      previous_hash: events[events.length - 1].entry_hash,
      entry_hash: "03c4d5e6f7a819203b4c5d6e7f8091a2b3c4d5e6f7a819203b4c5d6e7f8091a2",
    });
  }

  // 4. Officer Adjudication Recorded
  if (caseData.adjudication) {
    events.push({
      id: `evt_${caseData.id}_04`,
      sequence_number: seq++,
      timestamp_utc: caseData.adjudication.timestamp_utc,
      event_type: caseData.adjudication.override_applied ? "OFFICER_OVERRIDE_APPLIED" : "OFFICER_ADJUDICATION_RECORDED",
      event_label: caseData.adjudication.override_applied ? "Officer Adjudication Override" : "Officer Adjudication Recorded",
      actor_type: "OFFICER",
      actor_id: caseData.adjudication.officer_id,
      actor_name: caseData.adjudication.officer_name,
      entity_type: "ADJUDICATION",
      entity_id: caseData.adjudication.decision_id,
      decision: caseData.adjudication.verdict,
      remarks: caseData.adjudication.remarks,
      metadata: {
        action_order: caseData.adjudication.action_order,
        override_applied: caseData.adjudication.override_applied,
      },
      previous_hash: events[events.length - 1].entry_hash,
      entry_hash: "14d5e6f7a819203b4c5d6e7f8091a2b3c4d5e6f7a819203b4c5d6e7f8091a2b3",
    });
  }

  return events;
}

/**
 * Appends an audit event to a case in a strictly append-only manner.
 * Historical records cannot be modified or deleted.
 */
export function appendAuditEvent(
  inspectionId: string,
  eventData: {
    event_type: AuditEventType | string;
    event_label: string;
    actor_type: AuditActorType;
    actor_id: string;
    actor_name: string;
    entity_type: "INSPECTION" | "EVIDENCE" | "FINDING" | "ADJUDICATION" | "HANDOFF";
    entity_id: string;
    related_finding_id?: string;
    related_evidence_id?: string;
    decision?: string;
    remarks?: string;
    metadata?: Record<string, any>;
  }
): AuditEvent {
  let targetKey: string | undefined = undefined;
  if (dynamicCases.has(inspectionId)) {
    targetKey = inspectionId;
  } else {
    for (const [key, val] of dynamicCases.entries()) {
      if (val.id === inspectionId || val.sku_demo_id === inspectionId || val.inspection_number === inspectionId) {
        targetKey = key;
        break;
      }
    }
  }

  const existing = targetKey ? dynamicCases.get(targetKey) : undefined;
  const currentTrail: AuditEvent[] = existing?.audit_trail && existing.audit_trail.length > 0
    ? existing.audit_trail
    : existing ? createDefaultAuditTrail(existing) : [];

  const seq = currentTrail.length + 1;
  const prevHash = currentTrail.length > 0
    ? currentTrail[currentTrail.length - 1].entry_hash || "0000000000000000000000000000000000000000000000000000000000000000"
    : "0000000000000000000000000000000000000000000000000000000000000000";

  const entryHash = `${seq}a8b7c6d5e4f3210987654321fedcba0987654321fedcba0987654321fedcba0${seq % 10}`.slice(0, 64);

  const newEvent: AuditEvent = {
    id: `evt_${inspectionId}_${Date.now()}_${seq}`,
    sequence_number: seq,
    timestamp_utc: new Date().toISOString(),
    event_type: eventData.event_type,
    event_label: eventData.event_label,
    actor_type: eventData.actor_type,
    actor_id: eventData.actor_id,
    actor_name: eventData.actor_name,
    entity_type: eventData.entity_type,
    entity_id: eventData.entity_id,
    related_finding_id: eventData.related_finding_id,
    related_evidence_id: eventData.related_evidence_id,
    decision: eventData.decision,
    remarks: eventData.remarks,
    metadata: eventData.metadata,
    previous_hash: prevHash,
    entry_hash: entryHash,
  };

  const updatedTrail = [...currentTrail, newEvent];
  if (targetKey && existing) {
    dynamicCases.set(targetKey, {
      ...existing,
      audit_trail: updatedTrail,
    });
    savePersistedCases(dynamicCases);
  }

  return newEvent;
}

/**
 * Renders downstream case handoff readiness from fixture/backend data.
 * The frontend NEVER independently decides statutory compliance or notice dispatch.
 * If the case fixture provides a canonical readiness_checklist, it is returned directly.
 * In mock mode fallback, state is mapped strictly from the officer's explicit action order.
 */
export function computeCaseReadiness(caseData: InspectionCase): CaseReadinessChecklist {
  if (caseData.readiness_checklist) {
    return caseData.readiness_checklist;
  }

  const evidenceAvailable = caseData.evidence_assets && caseData.evidence_assets.length > 0;
  const automatedAnalysisCompleted = !!(caseData.rule_evaluations && caseData.rule_evaluations.length > 0);
  const officerAdjudicationCompleted = !!caseData.adjudication;
  const auditRecordComplete = !!(caseData.audit_trail && caseData.audit_trail.length > 0);

  let readinessState: HandoffReadinessState = "PENDING_OFFICER_REVIEW";
  let guidance = "Officer adjudication required before case dossier can be handed off.";

  if (!officerAdjudicationCompleted) {
    readinessState = "PENDING_OFFICER_REVIEW";
    guidance = "Automated findings require authorized Legal Metrology Officer review and adjudication.";
  } else {
    // Map strictly from the officer's explicit action order or adjudication instruction (not frontend legal math)
    const actionOrder = caseData.adjudication!.action_order;
    const verdict = caseData.adjudication!.verdict;

    if (actionOrder === "REQUEST_PHYSICAL_CALIPER_CHECK" || verdict === "REQUEST_RETEST") {
      readinessState = "ACTION_REQUIRED_RETEST";
      guidance = "Physical caliper re-measurement or packaging re-capture ordered by inspecting officer.";
    } else if (actionOrder === "CLOSE_INSPECTION_COMPLIANT" || verdict === "DISMISS_AS_COMPLIANT") {
      readinessState = "READY_FOR_CASE_CLOSURE";
      guidance = "Inspection record marked compliant by officer. Ready for administrative filing and case closure.";
    } else if (actionOrder === "GENERATE_LEGAL_NOTICE_FORM_1" || verdict === "CONFIRM_VIOLATION") {
      readinessState = "READY_FOR_LEGAL_NOTICE_DISPATCH";
      guidance = "Statutory notice authorized by inspecting officer. Ready for Form-1 Show Cause Notice preparation.";
    }
  }

  return {
    evidence_available: evidenceAvailable,
    automated_analysis_completed: automatedAnalysisCompleted,
    officer_adjudication_completed: officerAdjudicationCompleted,
    audit_record_complete: auditRecordComplete,
    readiness_state: readinessState,
    downstream_action_guidance: guidance,
  };
}

export function getMockCases(): Record<string, InspectionCase> {
  const deletedIds = getDeletedCaseIds();
  const persisted = loadPersistedCases();
  Object.entries(persisted).forEach(([k, v]) => {
    if (
      deletedIds.has(k) ||
      (v.id && deletedIds.has(v.id)) ||
      (v.inspection_number && deletedIds.has(v.inspection_number)) ||
      (v.sku_demo_id && deletedIds.has(v.sku_demo_id))
    ) {
      return;
    }
    if (!dynamicCases.has(k) || JSON.stringify(dynamicCases.get(k)?.adjudication) !== JSON.stringify(v.adjudication)) {
      dynamicCases.set(k, v);
      if (v.id && !dynamicCases.has(v.id)) {
        dynamicCases.set(v.id, v);
      }
    }
  });

  const res: Record<string, InspectionCase> = {};
  dynamicCases.forEach((val, key) => {
    if (
      deletedIds.has(key) ||
      (val.id && deletedIds.has(val.id)) ||
      (val.inspection_number && deletedIds.has(val.inspection_number)) ||
      (val.sku_demo_id && deletedIds.has(val.sku_demo_id))
    ) {
      return;
    }
    if (!val.audit_trail || val.audit_trail.length === 0) {
      val.audit_trail = createDefaultAuditTrail(val);
    }
    res[key] = val;
  });
  return res;
}

export function addMockCase(c: InspectionCase): void {
  if (!c.audit_trail || c.audit_trail.length === 0) {
    c.audit_trail = createDefaultAuditTrail(c);
  }
  dynamicCases.set(c.id, c);
  if (c.inspection_number) {
    dynamicCases.set(c.inspection_number, c);
  }
  savePersistedCases(dynamicCases);
}

export function isCaseDeleted(id?: string, inspectionNumber?: string): boolean {
  if (!id && !inspectionNumber) return false;
  const deleted = getDeletedCaseIds();
  if (id && deleted.has(id)) return true;
  if (inspectionNumber && deleted.has(inspectionNumber)) return true;
  return false;
}

export function deleteMockCase(id: string): boolean {
  if (!id) return false;
  let found = false;
  const deletedIdentifiers = new Set<string>([id]);

  // 1. Check in-memory dynamic cases for any matching aliases
  for (const [key, val] of dynamicCases.entries()) {
    if (key === id || val.id === id || val.inspection_number === id || val.sku_demo_id === id) {
      found = true;
      if (key) deletedIdentifiers.add(key);
      if (val.id) deletedIdentifiers.add(val.id);
      if (val.inspection_number) deletedIdentifiers.add(val.inspection_number);
      if (val.sku_demo_id) deletedIdentifiers.add(val.sku_demo_id);
    }
  }

  // 2. Check localStorage persisted cases directly to catch any alternate key representations
  const persisted = loadPersistedCases();
  let persistedChanged = false;
  for (const [k, v] of Object.entries(persisted)) {
    if (
      deletedIdentifiers.has(k) ||
      (v.id && deletedIdentifiers.has(v.id)) ||
      (v.inspection_number && deletedIdentifiers.has(v.inspection_number)) ||
      (v.sku_demo_id && deletedIdentifiers.has(v.sku_demo_id))
    ) {
      found = true;
      deletedIdentifiers.add(k);
      if (v.id) deletedIdentifiers.add(v.id);
      if (v.inspection_number) deletedIdentifiers.add(v.inspection_number);
      if (v.sku_demo_id) deletedIdentifiers.add(v.sku_demo_id);
      delete persisted[k];
      persistedChanged = true;
    }
  }

  // 3. Purge from dynamicCases
  for (const [key, val] of Array.from(dynamicCases.entries())) {
    if (
      deletedIdentifiers.has(key) ||
      (val.id && deletedIdentifiers.has(val.id)) ||
      (val.inspection_number && deletedIdentifiers.has(val.inspection_number)) ||
      (val.sku_demo_id && deletedIdentifiers.has(val.sku_demo_id))
    ) {
      dynamicCases.delete(key);
    }
  }

  // 4. Save deleted identifiers into permanent tombstone set
  deletedIdentifiers.forEach(saveDeletedCaseId);

  // 5. Update localStorage persisted cases
  const storage = getStorage();
  if (storage) {
    if (persistedChanged) {
      try {
        storage.setItem(USER_CASES_STORAGE_KEY, JSON.stringify(persisted));
      } catch {}
    }
    try {
      const lastCaseId = storage.getItem("Nirikshak_last_case_id");
      if (lastCaseId && deletedIdentifiers.has(lastCaseId)) {
        storage.removeItem("Nirikshak_last_case_id");
      }
    } catch {}
  }

  // 6. Resave dynamic cases to sync storage state
  savePersistedCases(dynamicCases);

  return found;
}

export function resetMockCases(): void {
  dynamicCases.clear();
  inMemoryDeletedIds.clear();
  try {
    const storage = getStorage();
    if (storage) {
      storage.removeItem(USER_CASES_STORAGE_KEY);
      storage.removeItem(DELETED_CASES_STORAGE_KEY);
    }
  } catch {
    // Ignore cleanup error
  }
  Object.entries(GOLDEN_SKU_CASES).forEach(([k, v]) => {
    const cloned: InspectionCase = JSON.parse(JSON.stringify(v));
    cloned.audit_trail = createDefaultAuditTrail(cloned);
    dynamicCases.set(k, cloned);
  });
}

export function updateMockCase(id: string, updates: Partial<InspectionCase>): InspectionCase | undefined {
  let targetKey: string | undefined = undefined;
  if (dynamicCases.has(id)) {
    targetKey = id;
  } else {
    for (const [key, val] of dynamicCases.entries()) {
      if (val.id === id || val.sku_demo_id === id || val.inspection_number === id) {
        targetKey = key;
        break;
      }
    }
  }

  if (!targetKey) {
    const persisted = loadPersistedCases();
    if (persisted[id]) {
      dynamicCases.set(id, persisted[id]);
      targetKey = id;
    }
  }

  if (!targetKey) return undefined;
  const existing = dynamicCases.get(targetKey)!;
  const updated: InspectionCase = {
    ...existing,
    ...updates,
  };
  // Synchronize all keys and aliases in dynamicCases
  dynamicCases.set(targetKey, updated);
  if (updated.id) {
    dynamicCases.set(updated.id, updated);
  }
  if (updated.inspection_number) {
    dynamicCases.set(updated.inspection_number, updated);
  }
  if (updated.sku_demo_id) {
    dynamicCases.set(updated.sku_demo_id, updated);
  }
  if (existing.id && existing.id !== updated.id) {
    dynamicCases.set(existing.id, updated);
  }
  if (existing.inspection_number && existing.inspection_number !== updated.inspection_number) {
    dynamicCases.set(existing.inspection_number, updated);
  }
  savePersistedCases(dynamicCases);
  return updated;
}

