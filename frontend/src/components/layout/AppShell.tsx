import React, { useState, useEffect, useCallback, ReactNode } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Header } from "./Header";
import { ApiService } from "../../services/api";
import { InspectionSummary } from "../../types/inspection";
import { CommandPalette } from "../common/CommandPalette";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useCircle } from "../../context/CircleContext";

interface AppShellProps {
  children: ReactNode;
  activeCircle?: string;
  onCircleChange?: (circleId: string) => void;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { language } = useLanguage();
  const { activeCircle, setActiveCircle } = useCircle();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [cases, setCases] = useState<InspectionSummary[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const navigate = useNavigate();

  // Global Ctrl+K / Cmd+K shortcut listener for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const loadCases = useCallback(async () => {
    try {
      const res = await ApiService.listInspections({ circleId: activeCircle });
      setCases(res.items);
    } catch (err) {
      console.error("Failed to load cases in AppShell:", err);
    }
  }, [activeCircle]);

  useEffect(() => {
    loadCases();
    window.addEventListener("nirikshak_data_updated", loadCases);
    return () => window.removeEventListener("nirikshak_data_updated", loadCases);
  }, [loadCases]);

  const pendingReviewCount = cases.filter(
    (c) =>
      !c.adjudicated &&
      (c.overall_status === "REVIEW" ||
        c.overall_status === "UNABLE_TO_VERIFY" ||
        c.overall_status === "PENDING_REVIEW" ||
        c.overall_status === "PENDING" ||
        c.overall_status === "FAIL")
  ).length;

  return (
    <div className="app-shell veriq-app min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 print:min-h-0 print:overflow-visible print:bg-white print:block">
      {/* WCAG 2.1 AA Accessible Skip Link */}
      <a href="#main-content" className="skip-link">
        {language === "hi" ? "मुख्य वैधानिक सामग्री पर जाएं" : "Skip to main statutory content"}
      </a>

      <div className="shrink-0 z-40 print:hidden">
        <Header
          activeCircle={activeCircle}
          onCircleChange={(c) => {
            setActiveCircle(c);
            loadCases();
          }}
          onRefresh={loadCases}
          onToggleSidebar={() => setMobileSidebarOpen((prev) => !prev)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          mobileOpen={mobileSidebarOpen}
          reviewCount={pendingReviewCount}
        />
      </div>

      <main id="main-content" tabIndex={-1} role="main" className="veriq-main focus:outline-none">
        <div className="veriq-page-content">
            <AnimatePresence>
              {notification && (
                <m.div
                  role="status"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
                  className="mb-4 p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-800 flex items-center justify-between shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{notification}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotification(null)}
                    className="text-emerald-700 hover:text-emerald-950 font-bold"
                  >
                    ✕
                  </button>
                </m.div>
              )}
            </AnimatePresence>

            {children}
        </div>
      </main>

      {/* Universal Command Search Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
};
