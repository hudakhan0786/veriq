import React, { useState, useEffect } from "react";
import { DEMO_SCENARIOS } from "../../features/demo/demoCatalog";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  SearchCheck,
  Users,
  GitBranch,
  FileArchive,
  BarChart3,
  Settings,
  Plus,
  ShieldCheck,
  Scale,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { InspectionSummary } from "../../types/inspection";
import { StateEmblem } from "../common/StateEmblem";
import { resetScrollToTop } from "../common/ScrollToTop";
import { AnimatePresence, m } from "framer-motion";

interface SidebarProps {
  pendingCasesCount?: number;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  activeCircle?: string;
  cases?: InspectionSummary[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  pendingCasesCount = 0,
  mobileOpen = false,
  onCloseMobile,
  activeCircle,
  cases = [],
}) => {
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("nirikshak_sidebar_collapsed") === "true";
  });

  useEffect(() => {
    localStorage.setItem("nirikshak_sidebar_collapsed", String(isCollapsed));
  }, [isCollapsed]);
  const location = useLocation();

  const isController = user?.officerRole === "CONTROLLER";

  // Global Alt+N shortcut to initiate a new inspection case
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key.toLowerCase() === "n" || e.code === "KeyN")) {
        e.preventDefault();
        onCloseMobile?.();
        resetScrollToTop();
        navigate("/inspections/new");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, onCloseMobile]);

  const handleSignOut = () => {
    onCloseMobile?.();
    logout();
    navigate("/login");
  };

  const isItemActive = (path: string): boolean => {
    const current = location.pathname;
    if (path === "/dashboard") {
      return current === "/dashboard";
    }
    if (path === "/inspections/new") {
      return current === "/inspections/new";
    }
    if (path === "/demo") {
      return current === "/demo";
    }
    if (path === "/inspections") {
      return current === "/inspections" || current === "/inspections/";
    }
    if (path.startsWith("/inspections/")) {
      const cleanPath = path.split("?")[0];
      return current === cleanPath || current.startsWith(cleanPath + "/");
    }
    if (path === "/settings") {
      return current === "/settings";
    }
    return current === path || current.startsWith(path + "/");
  };

  const currentCaseMatch = location.pathname.match(/^\/inspections\/([^/]+)/);
  const currentRouteCaseId = currentCaseMatch && currentCaseMatch[1] !== "new" ? currentCaseMatch[1] : null;

  const activeCase = currentRouteCaseId
    ? cases?.find(
        (c) =>
          c.id === currentRouteCaseId ||
          c.inspection_number === currentRouteCaseId ||
          c.id.toLowerCase() === currentRouteCaseId.toLowerCase()
      )
    : null;

  // Dedicated Active Adjudication Workspace Card (Designed authentically for Legal Metrology Enforcement)
  const renderActiveWorkspaceCard = (inMobile = false) => {
    if (!currentRouteCaseId) return null;

    if (isCollapsed && !inMobile) {
      return (
        <div key="active-workspace-collapsed" className="relative mx-auto my-1.5 flex justify-center">
          <Link
            to={`/inspections/${currentRouteCaseId}?view=CANVAS`}
            title={`${language === "hi" ? "अधिनिर्णय कार्यक्षेत्र (सक्रिय)" : "Adjudication Workspace (Active)"}: ${activeCase?.inspection_number || currentRouteCaseId}`}
            className="relative w-10 h-10 rounded-xl bg-blue-50/95 hover:bg-blue-100 text-[#1B365D] flex items-center justify-center border border-blue-200/90 shadow-2xs transition-all group"
          >
            <Scale size={18} className="text-[#1B365D] group-hover:scale-110 transition-transform" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white" />
            </span>
          </Link>
        </div>
      );
    }

    return (
      <div
        key="active-workspace-card"
        className="my-2 rounded-xl border border-blue-200/90 bg-gradient-to-br from-blue-50/95 via-sky-50/30 to-slate-50/90 p-2.5 shadow-2xs transition-all hover:border-blue-300 select-none"
      >
        {/* Top Micro-bar: Case Number + Live Status */}
        <div className="flex items-center justify-between gap-1 text-[10px] font-mono mb-1.5 pb-1 border-b border-blue-100/80">
          <span
            className="font-bold text-slate-600 truncate max-w-[130px]"
            title={activeCase?.inspection_number || currentRouteCaseId}
          >
            {activeCase?.inspection_number || (currentRouteCaseId.length > 16 ? `${currentRouteCaseId.slice(0, 14)}...` : currentRouteCaseId)}
          </span>
          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200/80 shrink-0 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{language === "hi" ? "सक्रिय" : "Active"}</span>
          </span>
        </div>

        {/* Main Title Row: Emblem Icon + Adjudication Workspace Title + Commodity Subtitle */}
        <Link
          to={`/inspections/${currentRouteCaseId}?view=CANVAS`}
          onClick={inMobile ? onCloseMobile : undefined}
          className="group block"
          title={language === "hi" ? "अधिनिर्णय कार्यक्षेत्र खोलें" : "Open Adjudication Workspace"}
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#1B365D] text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <Scale size={14} className="text-white stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-[#1B365D] block truncate leading-tight group-hover:text-blue-900 transition-colors">
                {language === "hi" ? "अधिनिर्णय कार्यक्षेत्र" : "Adjudication Workspace"}
              </span>
              {activeCase?.product_name ? (
                <span
                  className="text-[10px] text-slate-500 font-medium block truncate leading-tight mt-0.5"
                  title={activeCase.product_name}
                >
                  {activeCase.product_name}
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-medium block truncate leading-tight mt-0.5">
                  {language === "hi" ? "सांविधिक विधिक परीक्षण" : "Statutory Adjudication"}
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>
    );
  };

  // Official Legal Metrology Functional Grouping (Clean, non-repetitive)
  const navGroups = [
    {
      title: language === "hi" ? "प्रवर्तन कार्यक्षेत्र" : "Enforcement Desk",
      items: [
        {
          label: t("nav.dashboard", "Executive Dashboard"),
          path: "/dashboard",
          icon: Home,
        },
        {
          label: t("nav.register", "Case Registry"),
          path: "/inspections",
          icon: SearchCheck,
        },
        {
          label: t("nav.review", "Review Queue"),
          path: "/review-queue",
          icon: Users,
          badge: pendingCasesCount > 0 ? pendingCasesCount : undefined,
          badgeType: "warning" as const,
        },
        {
          label: t("nav.reports", "Reports & Notices"),
          path: "/reports",
          icon: BarChart3,
        },
      ],
    },
    {
      title: language === "hi" ? "सांविधिक मानक एवं संदर्भ" : "Standards & System",
      items: [
        {
          label: t("nav.rules", "Rules & Schedules"),
          path: "/rules",
          icon: GitBranch,
        },
        {
          label: language === "hi" ? "सांविधिक डेमो सूट" : "Statutory Demo Suite",
          path: "/demo",
          icon: Scale,
          badge: DEMO_SCENARIOS.length.toString(),
          badgeType: "info" as const,
        },
        {
          label: t("nav.settings", "Station Settings"),
          path: "/settings",
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <>
      {/* 1. Desktop Sidebar: Pure flex child that fits exactly within AppShell */}
      <m.aside
        initial={false}
        animate={{ width: isCollapsed ? 68 : 256 }}
        transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
        className="hidden lg:flex h-full shrink-0 flex-col border-r border-slate-200 bg-white text-slate-700 shadow-xs select-none z-30 overflow-hidden print:!hidden"
      >
        {/* Desktop Header / Collapse Bar */}
        <div
          className={`flex items-center border-b border-slate-100 shrink-0 ${
            isCollapsed ? "justify-center py-2.5" : "justify-between px-3.5 py-2.5"
          }`}
        >
          {isCollapsed ? (
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <ChevronRight size={15} />
            </button>
          ) : (
            <>
              <div className="min-w-0 flex flex-col">
                <span className="text-xs font-bold text-slate-800 tracking-tight truncate leading-tight">
                  {language === "hi" ? "विधिक कार्यस्थान" : "LMO Workstation"}
                </span>
                <span className="text-[10px] text-slate-400 font-medium truncate leading-tight">
                  {language === "hi" ? "प्रवर्तन कार्यक्षेत्र" : "Enforcement Portal"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="w-6 h-6 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-400 hover:text-slate-700 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft size={13} />
              </button>
            </>
          )}
        </div>

        {/* Primary Action Button: New Inspection Case */}
        <div className={`shrink-0 ${isCollapsed ? "py-2.5 px-2 flex justify-center" : "p-3 pb-2"}`}>
          <Link
            to="/inspections/new"
            onClick={() => {
              onCloseMobile?.();
              resetScrollToTop();
            }}
            title={isCollapsed ? t("action.new_case", "New Inspection Case") : "New Inspection Case (Alt+N)"}
            className={`flex items-center transition-colors group ${
              isCollapsed
                ? "w-10 h-10 justify-center rounded-xl bg-[#1B365D] hover:bg-[#0A2540] text-white shadow-sm hover:shadow border border-[#152a48]"
                : "w-full gap-2.5 py-2.5 px-3.5 bg-[#1B365D] hover:bg-[#0A2540] text-white text-xs font-bold rounded-xl shadow-sm hover:shadow border border-[#152a48]"
            }`}
          >
            <div className="w-5 h-5 rounded-md bg-[#FF9933] text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <Plus size={13} className="stroke-[3]" />
            </div>
            {!isCollapsed && (
              <span className="truncate tracking-wide">
                {t("action.new_case", "New Inspection Case")}
              </span>
            )}
          </Link>
        </div>

        {/* Scrollable Navigation Links */}
        <div className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden space-y-4 custom-scrollbar ${isCollapsed ? "px-2 py-2" : "px-3 py-1"}`}>
          <nav className="space-y-4">
            {navGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-1">
                {!isCollapsed ? (
                  <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {group.title}
                  </p>
                ) : (
                  <div className="h-px bg-slate-100 my-2 mx-2" />
                )}

                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isItemActive(item.path);
                  const isCaseRegistry = item.path === "/inspections";

                  return (
                    <React.Fragment key={item.path}>
                      <Link
                        to={item.path}
                        onClick={onCloseMobile}
                        title={isCollapsed ? item.label : undefined}
                        className={`group relative flex items-center transition-colors ${
                          isCollapsed
                            ? `w-10 h-10 mx-auto justify-center rounded-xl ${
                                active
                                  ? "bg-blue-50/90 text-[#1B365D] font-bold border border-blue-200/80 shadow-2xs"
                                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 border border-transparent"
                              }`
                            : `w-full justify-between py-2 px-3 text-xs font-semibold rounded-xl ${
                                active
                                  ? "bg-blue-50/90 text-[#1B365D] font-bold border border-blue-200/80 shadow-2xs"
                                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 border border-transparent"
                              }`
                        }`}
                      >
                        <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-2.5"}`}>
                          <Icon
                            size={18}
                            className={`shrink-0 transition-colors ${
                              active
                                ? "text-[#1B365D]"
                                : "text-slate-400 group-hover:text-slate-600"
                            }`}
                          />
                          {!isCollapsed && <span className="truncate">{item.label}</span>}
                        </div>

                        {!isCollapsed && item.badge !== undefined && (
                          item.badgeType === "warning" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10.5px] font-mono font-bold rounded-full shrink-0 bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              <span>{item.badge}</span>
                            </span>
                          ) : (
                            <span
                              className={`px-2 py-0.5 text-[10.5px] font-semibold rounded-full shrink-0 border transition-colors ${
                                active
                                  ? "bg-blue-100 text-[#1B365D] border-blue-300 shadow-2xs"
                                  : "bg-slate-100 text-slate-700 border-slate-200"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )
                        )}
                      </Link>

                      {/* Dedicated Active Adjudication Workspace Section */}
                      {isCaseRegistry && renderActiveWorkspaceCard(false)}
                    </React.Fragment>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Desktop Statutory Compliance Strip Footer */}
        <div className="shrink-0 p-2.5 border-t border-slate-200/70 bg-slate-50/80">
          {!isCollapsed ? (
            <div className="p-2 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="flex items-center gap-1.5 font-bold text-slate-800">
                  <ShieldCheck size={14} className="text-[#1B365D] shrink-0" />
                  <span>LMPC 2011</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/80 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Sec 63 BSA</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-100">
                <span className="text-slate-500 shrink-0">Jurisdiction:</span>
                {activeCircle && (
                  <span className="font-semibold text-slate-700 truncate text-right pl-1" title={`Active Jurisdiction: ${activeCircle}`}>
                    {activeCircle.replace(/^CIRCLE_/, "")}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-1" title="LMPC Rules, 2011 & Section 63 BSA 2023 Verified">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#1B365D] shadow-2xs">
                <ShieldCheck size={18} className="text-[#1B365D]" />
              </div>
            </div>
          )}
        </div>
      </m.aside>

      {/* 2. Mobile Responsive Slide-Over Drawer (Phones & Tablets < 1024px) */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[70] lg:hidden">
            {/* Touch Backdrop */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Mobile Drawer Panel */}
            <m.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
              className="fixed inset-y-0 left-0 w-72 max-w-[85vw] h-[100dvh] flex flex-col bg-white shadow-2xl z-[71] border-r border-slate-200 select-none print:!hidden"
            >
              {/* Mobile Drawer Header */}
              <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4 bg-slate-50 shrink-0">
                <div className="flex items-center gap-2.5">
                  <StateEmblem size={22} tone="navy" showMotto={true} className="shrink-0" />
                  <div className="leading-tight">
                    <span className="font-extrabold text-xs tracking-tight text-[#1B365D] block">Veriq</span>
                    <span className="text-[9.5px] font-medium text-slate-500 block">LMO Workstation</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
                  aria-label="Close Navigation Menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Primary Action Button */}
              <div className="p-3 pb-2 shrink-0">
                <Link
                  to="/inspections/new"
                  onClick={() => {
                    onCloseMobile?.();
                    resetScrollToTop();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#1B365D] hover:bg-[#0A2540] text-white text-xs font-bold rounded-xl shadow-sm transition-colors border border-[#152a48] px-3.5"
                >
                  <div className="w-5 h-5 rounded-md bg-[#FF9933] text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                    <Plus size={13} className="stroke-[3]" />
                  </div>
                  <span className="truncate tracking-wide">
                    {t("action.new_case", "New Inspection Case")}
                  </span>
                </Link>
              </div>

              {/* Mobile Scrollable Nav Links */}
              <div className="flex-1 min-h-0 overflow-y-auto px-3 py-1 space-y-4 custom-scrollbar">
                <nav className="space-y-4">
                  {navGroups.map((group, groupIdx) => (
                    <div key={groupIdx} className="space-y-1">
                      <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        {group.title}
                      </p>

                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const active = isItemActive(item.path);
                        const isCaseRegistry = item.path === "/inspections";

                        return (
                          <React.Fragment key={item.path}>
                            <Link
                              to={item.path}
                              onClick={onCloseMobile}
                              className={`group relative w-full flex items-center justify-between py-2.5 text-xs font-semibold rounded-xl transition-colors px-3 ${
                                active
                                  ? "bg-blue-50/90 text-[#1B365D] font-bold border border-blue-200/80 shadow-2xs"
                                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 border border-transparent"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <Icon
                                  size={18}
                                  className={`shrink-0 transition-colors ${
                                    active
                                      ? "text-[#1B365D]"
                                      : "text-slate-400 group-hover:text-slate-600"
                                  }`}
                                />
                                <span className="truncate">{item.label}</span>
                              </div>

                              {item.badge !== undefined && (
                                item.badgeType === "warning" ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10.5px] font-mono font-bold rounded-full shrink-0 bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                    <span>{item.badge}</span>
                                  </span>
                                ) : (
                                  <span
                                    className={`px-2 py-0.5 text-[10.5px] font-semibold rounded-full shrink-0 border transition-colors ${
                                      active
                                        ? "bg-blue-100 text-[#1B365D] border-blue-300 shadow-2xs"
                                        : "bg-slate-100 text-slate-700 border-slate-200"
                                    }`}
                                  >
                                    {item.badge}
                                  </span>
                                )
                              )}
                            </Link>

                            {/* Dedicated Active Adjudication Workspace Section on Mobile */}
                            {isCaseRegistry && renderActiveWorkspaceCard(true)}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  ))}
                </nav>
              </div>

              {/* Mobile Drawer Footer: Thumb-Accessible Sign Out + Circle */}
              <div className="shrink-0 p-3.5 border-t border-slate-200 bg-slate-50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#1B365D] text-amber-300 font-bold text-xs flex items-center justify-center border border-amber-300/40 shrink-0">
                      {user?.initials || "RS"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.name || "Rajesh Sharma"}</p>
                      <p className="text-[10px] font-mono text-slate-500 truncate">{user?.badgeNumber || "INSP-DL-0842"}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                  >
                    <LogOut size={13} />
                    <span>{language === "hi" ? "साइन आउट" : "Sign Out"}</span>
                  </button>
                </div>
                {activeCircle && (
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200/60">
                    <span className="truncate">Circle: {activeCircle}</span>
                    <span className="text-emerald-700 font-bold shrink-0">DSC Active</span>
                  </div>
                )}
              </div>
            </m.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
