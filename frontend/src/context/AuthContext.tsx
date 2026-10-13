import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { OfficerRole } from "../types/inspection";
import { LiveApiService } from "../services/liveApi";
import { StorageService } from "../services/storage";

export type UserRole = "inspector" | "controller" | "administrator" | "auditor";

export interface SessionUser {
  name: string;
  email: string;
  role: UserRole;
  officerRole: OfficerRole;
  department: string;
  designation: string;
  initials: string;
  badgeNumber: string;
}

export const roleMeta: Record<UserRole, { label: string; designation: string; landing: string; description: string; badge: string }> = {
  inspector: {
    label: "Legal Metrology Officer (Inspector)",
    designation: "Field Enforcement Officer",
    landing: "/dashboard",
    description: "Conduct physical packaging inspections, verify optical quality gates, and record evidence.",
    badge: "INSP-DL-0842",
  },
  controller: {
    label: "Controller of Legal Metrology",
    designation: "Notice Issuing Authority / District Controller",
    landing: "/review-queue",
    description: "Adjudicate borderline findings, issue Form-1 legal compounding notices, and review Section 63 certificates.",
    badge: "CTRL-DL-0012",
  },
  administrator: {
    label: "System Administrator",
    designation: "Platform Administrator",
    landing: "/settings",
    description: "Manage jurisdiction circles, sensor calibration thresholds, and workstation telemetry.",
    badge: "ADMIN-SYS-001",
  },
  auditor: {
    label: "Statutory Compliance Auditor",
    designation: "Section 63 BSA Audit Cell",
    landing: "/reports",
    description: "Inspect Merkle DAG chains-of-custody, tamper-evident hash ledgers, and compliance analytics.",
    badge: "AUDIT-GOI-044",
  },
};

export const demoUsers: Record<UserRole, SessionUser> = {
  inspector: {
    name: "Rajesh Sharma",
    email: "inspector.lmo@nic.in",
    role: "inspector",
    officerRole: "INSPECTOR",
    department: "Department of Consumer Affairs",
    designation: roleMeta.inspector.designation,
    initials: "RS",
    badgeNumber: "INSP-DL-0842",
  },
  controller: {
    name: "S.K. Verma",
    email: "controller.clm@nic.in",
    role: "controller",
    officerRole: "CONTROLLER",
    department: "Directorate of Legal Metrology",
    designation: roleMeta.controller.designation,
    initials: "SKV",
    badgeNumber: "CTRL-DL-0012",
  },
  administrator: {
    name: "Dr. Alok Verma",
    email: "admin.metrology@nic.in",
    role: "administrator",
    officerRole: "CONTROLLER",
    department: "National Informatics / DoCA",
    designation: roleMeta.administrator.designation,
    initials: "AV",
    badgeNumber: "ADMIN-SYS-001",
  },
  auditor: {
    name: "Neha Gupta",
    email: "auditor.doca@nic.in",
    role: "auditor",
    officerRole: "INSPECTOR",
    department: "Legal Metrology Audit Cell",
    designation: roleMeta.auditor.designation,
    initials: "NG",
    badgeNumber: "AUDIT-GOI-044",
  },
};

interface AuthContextValue {
  user: SessionUser | null;
  login: (
    role: UserRole,
    email?: string,
    password?: string,
    customProps?: Partial<SessionUser>
  ) => { ok: boolean; message?: string };
  logout: () => void;
  switchOfficerRole: (role: OfficerRole) => void;
  roleMeta: typeof roleMeta;
  demoUsers: typeof demoUsers;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SessionUser | null>(() => {
    try {
      const stored = localStorage.getItem("Nirikshak_session");
      if (!stored || stored === "null" || stored === "undefined") {
        return null;
      }
      return JSON.parse(stored);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("Nirikshak_session", JSON.stringify(user));
      // Pre-warm Bearer JWT authentication for live Render backend in the background
      const targetRole = user.officerRole === "CONTROLLER" ? "controller" : "inspector";
      LiveApiService.getInstance().ensureAuthenticated(targetRole).catch(() => {});
    } else {
      localStorage.removeItem("Nirikshak_session");
      StorageService.clearAuthToken();
      StorageService.clearControllerAuthToken();
    }
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      roleMeta,
      demoUsers,
      login: (role, email, _password, customProps) => {
        const expected = demoUsers[role] || demoUsers.inspector;
        const resolvedUser: SessionUser = {
          ...expected,
          email: email || expected.email,
          ...(customProps || {}),
        };
        try {
          localStorage.setItem("Nirikshak_session", JSON.stringify(resolvedUser));
        } catch {
          // ignore localStorage quota or access errors
        }
        setUser(resolvedUser);
        const targetRole = resolvedUser.officerRole === "CONTROLLER" ? "controller" : "inspector";
        LiveApiService.getInstance().ensureAuthenticated(targetRole).catch(() => {});
        return { ok: true };
      },
      logout: () => {
        try {
          localStorage.removeItem("Nirikshak_session");
        } catch {
          // ignore
        }
        setUser(null);
        StorageService.clearAuthToken();
        StorageService.clearControllerAuthToken();
      },
      switchOfficerRole: (newOfficerRole: OfficerRole) => {
        const target = newOfficerRole === "CONTROLLER" ? demoUsers.controller : demoUsers.inspector;
        try {
          localStorage.setItem("Nirikshak_session", JSON.stringify(target));
        } catch {
          // ignore
        }
        setUser(target);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
