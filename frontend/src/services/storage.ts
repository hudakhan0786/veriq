/**
 * Client-Side Storage Service for Veriq
 * Handles temporary offline draft state, UI preferences, and session indicators.
 * 
 * Rules:
 * - Does NOT act as the authoritative legal datastore.
 * - Gracefully handles corrupted, missing, or malformed browser storage entries.
 */

export interface DraftInspection {
  product_name: string;
  brand_name?: string;
  manufacturer_name?: string;
  category: string;
  package_type: string;
  jurisdiction_id: string;
  notes?: string;
  declared_net_qty?: string;
  saved_at: string;
}

export interface UserPreferences {
  active_circle: string;
  show_bounding_boxes: boolean;
  loupe_zoom_level: number;
  contrast_high: boolean;
  mode_b_resilient_fallback: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  active_circle: "CIRCLE_DL_SOUTH_01",
  show_bounding_boxes: true,
  loupe_zoom_level: 2.5,
  contrast_high: false,
  mode_b_resilient_fallback: false,
};

const STORAGE_KEYS = {
  DRAFT_CASE: "Nirikshak_draft_inspection_v1",
  PREFERENCES: "Nirikshak_user_prefs_v1",
  TOKEN: "Nirikshak_auth_token_v1",
  CONTROLLER_TOKEN: "Nirikshak_controller_token_v1",
  ACTIVE_DEMO_SKU: "Nirikshak_active_demo_sku_v1",
};

export class StorageService {
  /**
   * Saves active inspection draft safely.
   */
  static saveDraft(draft: DraftInspection): boolean {
    try {
      if (typeof window === "undefined" || !window.localStorage) return false;
      window.localStorage.setItem(STORAGE_KEYS.DRAFT_CASE, JSON.stringify(draft));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Retrieves active draft inspection, returning null if missing or malformed.
   */
  static getDraft(): DraftInspection | null {
    try {
      if (typeof window === "undefined" || !window.localStorage) return null;
      const raw = window.localStorage.getItem(STORAGE_KEYS.DRAFT_CASE);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || !parsed.product_name) {
        return null;
      }
      return parsed as DraftInspection;
    } catch {
      return null;
    }
  }

  /**
   * Clears saved draft inspection.
   */
  static clearDraft(): void {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(STORAGE_KEYS.DRAFT_CASE);
      }
    } catch {
      // Ignore cleanup error
    }
  }

  /**
   * Retrieves user preferences with fallback to defaults.
   */
  static getPreferences(): UserPreferences {
    try {
      if (typeof window === "undefined" || !window.localStorage) return DEFAULT_PREFERENCES;
      const raw = window.localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (!raw) return DEFAULT_PREFERENCES;
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_PREFERENCES, ...parsed };
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }

  /**
   * Updates user preferences.
   */
  static savePreferences(prefs: Partial<UserPreferences>): void {
    try {
      if (typeof window === "undefined" || !window.localStorage) return;
      const current = this.getPreferences();
      const updated = { ...current, ...prefs };
      window.localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
    } catch {
      // Non-blocking
    }
  }

  /**
   * Auth token accessors (session storage preferred for security).
   */
  static getAuthToken(): string | null {
    try {
      if (typeof window === "undefined") return null;
      return window.sessionStorage?.getItem(STORAGE_KEYS.TOKEN) || window.localStorage?.getItem(STORAGE_KEYS.TOKEN);
    } catch {
      return null;
    }
  }

  static setAuthToken(token: string): void {
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage?.setItem(STORAGE_KEYS.TOKEN, token);
        window.localStorage?.setItem(STORAGE_KEYS.TOKEN, token);
      }
    } catch {
      // Non-blocking
    }
  }

  static clearAuthToken(): void {
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage?.removeItem(STORAGE_KEYS.TOKEN);
        window.localStorage?.removeItem(STORAGE_KEYS.TOKEN);
      }
    } catch {
      // Non-blocking
    }
  }

  static getControllerAuthToken(): string | null {
    try {
      if (typeof window === "undefined") return null;
      return window.sessionStorage?.getItem(STORAGE_KEYS.CONTROLLER_TOKEN) || window.localStorage?.getItem(STORAGE_KEYS.CONTROLLER_TOKEN);
    } catch {
      return null;
    }
  }

  static setControllerAuthToken(token: string): void {
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage?.setItem(STORAGE_KEYS.CONTROLLER_TOKEN, token);
        window.localStorage?.setItem(STORAGE_KEYS.CONTROLLER_TOKEN, token);
      }
    } catch {
      // Non-blocking
    }
  }

  static clearControllerAuthToken(): void {
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage?.removeItem(STORAGE_KEYS.CONTROLLER_TOKEN);
        window.localStorage?.removeItem(STORAGE_KEYS.CONTROLLER_TOKEN);
      }
    } catch {
      // Non-blocking
    }
  }
}
