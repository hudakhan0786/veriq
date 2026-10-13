import React, { createContext, useContext, useState, ReactNode } from "react";

export interface JurisdictionCircle {
  id: string;
  label: string;
  labelHi: string;
}

export const JURISDICTION_CIRCLES: JurisdictionCircle[] = [
  {
    id: "ALL",
    label: "ALL • All Circles (National View)",
    labelHi: "ALL • सभी मंडल (राष्ट्रीय दृश्य)",
  },
  {
    id: "CIRCLE_DL_SOUTH_01",
    label: "DL-SOUTH-01 • South Delhi Circle (Saket / Kalkaji)",
    labelHi: "DL-SOUTH-01 • दक्षिण दिल्ली मंडल (साकेत / कालकाजी)",
  },
  {
    id: "CIRCLE_DL_CENTRAL_02",
    label: "DL-CENTRAL-02 • Central Delhi Circle (Connaught Place)",
    labelHi: "DL-CENTRAL-02 • मध्य दिल्ली मंडल (कनॉट प्लेस)",
  },
  {
    id: "CIRCLE_UP_GBN_01",
    label: "UP-GBN-01 • Gautam Buddha Nagar Division (Noida / Gr. Noida)",
    labelHi: "UP-GBN-01 • गौतम बुद्ध नगर प्रभाग (नोएडा / ग्रेटर नोएडा)",
  },
  {
    id: "CIRCLE_MH_MUM_01",
    label: "MH-MUM-01 • Mumbai Suburban Enforcement Circle",
    labelHi: "MH-MUM-01 • मुंबई उपनगरीय प्रवर्तन मंडल",
  },
  {
    id: "CIRCLE_KA_BLR_01",
    label: "KA-BLR-01 • Bengaluru Urban Enforcement Depot",
    labelHi: "KA-BLR-01 • बेंगलुरु शहरी प्रवर्तन डिपो",
  },
];

export const getJurisdictionCircle = (id?: string, extra?: JurisdictionCircle[]): JurisdictionCircle => {
  const registry = extra && extra.length > 0 ? [...JURISDICTION_CIRCLES, ...extra] : JURISDICTION_CIRCLES;
  if (!id || id === "ALL" || id === "ALL_CIRCLES") return registry[0];
  const found = registry.find((c) => c.id === id);
  if (found) return found;
  const cleanId = id.replace("CIRCLE_", "");
  const partial = registry.find(
    (c) => c.id.includes(cleanId) || c.label.includes(cleanId)
  );
  return partial || {
    id,
    label: `${id} • Enforcement Circle`,
    labelHi: `${id} • प्रवर्तन मंडल`,
  };
};

/* ── Custom circle registry (feedback #least-priority: allow adding new circles) ──
   Pure, storage-injected helpers so the logic stays deterministic and unit-testable
   without a browser environment. */

const CUSTOM_CIRCLES_KEY = "Nirikshak_custom_circles";

/** Circle IDs follow the statutory registry style: CIRCLE_<REGION>_<NN>. */
export const CIRCLE_ID_PATTERN = /^[A-Z0-9]+(_[A-Z0-9]+)*$/;

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const resolveStorage = (storage?: StorageLike | null): StorageLike | null => {
  if (storage) return storage;
  if (typeof localStorage !== "undefined") return localStorage;
  return null;
};

export const normalizeCircleId = (raw: string): string => raw.trim().toUpperCase();

/** Returns a human-readable error message, or null when the circle is valid. */
export const validateNewCircle = (
  id: string,
  label: string,
  labelHi: string,
  existingIds: string[]
): string | null => {
  const trimmedId = normalizeCircleId(id);
  const trimmedLabel = label.trim();
  const trimmedLabelHi = labelHi.trim();
  if (trimmedId.length < 3 || trimmedId.length > 40) {
    return "Circle ID must be between 3 and 40 characters.";
  }
  if (!CIRCLE_ID_PATTERN.test(trimmedId)) {
    return "Circle ID may only contain A-Z, 0-9 and underscores (e.g. CIRCLE_DL_WEST_05).";
  }
  if (existingIds.includes(trimmedId)) {
    return "A circle with this ID already exists.";
  }
  if (trimmedLabel.length < 3 || trimmedLabel.length > 80) {
    return "Display name must be between 3 and 80 characters.";
  }
  if (trimmedLabelHi && (trimmedLabelHi.length < 3 || trimmedLabelHi.length > 80)) {
    return "Hindi name must be between 3 and 80 characters.";
  }
  return null;
};

export const readCustomCircles = (storage?: StorageLike | null): JurisdictionCircle[] => {
  const store = resolveStorage(storage);
  if (!store) return [];
  try {
    const raw = store.getItem(CUSTOM_CIRCLES_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((entry) => {
      const c = entry as Partial<JurisdictionCircle> | null;
      if (!c || typeof c.id !== "string" || typeof c.label !== "string" || !c.id.trim() || !c.label.trim()) {
        return [];
      }
      return [
        {
          id: c.id,
          label: c.label,
          labelHi: typeof c.labelHi === "string" && c.labelHi.trim() ? c.labelHi : c.label,
        },
      ];
    });
  } catch {
    return [];
  }
};

export const saveCustomCircles = (circles: JurisdictionCircle[], storage?: StorageLike | null): boolean => {
  const store = resolveStorage(storage);
  if (!store) return false;
  try {
    store.setItem(CUSTOM_CIRCLES_KEY, JSON.stringify(circles));
    return true;
  } catch {
    return false;
  }
};

export interface AddCircleResult {
  ok: boolean;
  error?: string;
  circle?: JurisdictionCircle;
}

interface CircleContextType {
  activeCircle: string;
  setActiveCircle: (circleId: string) => void;
  currentCircle: JurisdictionCircle;
  customCircles: JurisdictionCircle[];
  allCircles: JurisdictionCircle[];
  addCustomCircle: (id: string, label: string, labelHi?: string) => AddCircleResult;
}

const CircleContext = createContext<CircleContextType | undefined>(undefined);

export const CircleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeCircle, setActiveCircleState] = useState<string>(() => {
    try {
      return localStorage.getItem("Nirikshak_active_circle") || "ALL";
    } catch {
      return "ALL";
    }
  });

  const [customCircles, setCustomCircles] = useState<JurisdictionCircle[]>(() =>
    readCustomCircles()
  );

  const allCircles: JurisdictionCircle[] = [...JURISDICTION_CIRCLES, ...customCircles];

  const setActiveCircle = (circleId: string) => {
    setActiveCircleState(circleId);
    try {
      localStorage.setItem("Nirikshak_active_circle", circleId);
    } catch {
      // ignore
    }
  };

  const addCustomCircle = (id: string, label: string, labelHi = ""): AddCircleResult => {
    const circleId = normalizeCircleId(id);
    const error = validateNewCircle(circleId, label, labelHi, allCircles.map((c) => c.id));
    if (error) {
      return { ok: false, error };
    }
    const circle: JurisdictionCircle = {
      id: circleId,
      label: label.trim(),
      labelHi: labelHi.trim() || label.trim(),
    };
    const next = [...customCircles, circle];
    if (!saveCustomCircles(next)) {
      return {
        ok: false,
        error: "Unable to save the circle in this browser (local storage unavailable).",
      };
    }
    setCustomCircles(next);
    return { ok: true, circle };
  };

  const currentCircle = getJurisdictionCircle(activeCircle, customCircles);

  return (
    <CircleContext.Provider
      value={{ activeCircle, setActiveCircle, currentCircle, customCircles, allCircles, addCustomCircle }}
    >
      {children}
    </CircleContext.Provider>
  );
};

export const useCircle = (): CircleContextType => {
  const context = useContext(CircleContext);
  if (!context) {
    throw new Error("useCircle must be used within a CircleProvider");
  }
  return context;
};
