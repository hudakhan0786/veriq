/**
 * Standalone Mock API Service for UI Development (SIH26034)
 * Allows frontend to operate without live backend server.
 */

export interface MockInspectionSummary {
  id: string;
  inspection_number: string;
  product_name: string;
  status: "PASS" | "FAIL" | "REVIEW" | "UNABLE_TO_VERIFY";
  timestamp: string;
}

export class MockApiService {
  static async getDashboardSummary() {
    return {
      total_inspections: 1420,
      compliance_rate_pct: 74.2,
      active_circle: "CIRCLE_DL_SOUTH_01",
      violations_by_rule: {
        RULE_06_1_H_NET_QTY_FONT: 184,
        RULE_06_1_K_USP: 112,
        RULE_06_1_N_CONSUMER_CARE: 71,
      },
    };
  }

  static async submitAdjudication(
    inspectionId: string,
    verdict: string,
    remarks: string,
    pinHash: string
  ) {
    if (!remarks || remarks.trim().length === 0) {
      throw new Error("Mandatory officer justification remarks required for adjudication override.");
    }
    return {
      status: "SUCCESS",
      inspection_id: inspectionId,
      final_verdict: verdict,
      officer_pin_hash: pinHash,
      adjudicated_at: new Date().toISOString(),
    };
  }
}
