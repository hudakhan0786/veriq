import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  BarChart3,
  ChevronDown,
  ClipboardList,
  FileText,
  LogOut,
  Menu,
  MoreHorizontal,
  Radio,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { VeriqBrandLogo } from "../common/VeriqBrandLogo";
import { resetScrollToTop } from "../common/ScrollToTop";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useCircle } from "../../context/CircleContext";
import { ApiService } from "../../services/api";

interface HeaderProps {
  activeCircle: string;
  onCircleChange: (circleId: string) => void;
  onRefresh?: () => void;
  onToggleSidebar?: () => void;
  onOpenCommandPalette?: () => void;
  mobileOpen?: boolean;
  reviewCount?: number;
}

const primaryLinks = [
  { to: "/dashboard", label: "Overview", icon: BarChart3, end: true },
  { to: "/inspections", label: "Inspections", icon: ClipboardList, end: false },
  { to: "/review-queue", label: "Review", icon: ShieldCheck, end: false },
  { to: "/reports", label: "Reports", icon: FileText, end: false },
];

const otherLinks = [
  { to: "/rules", label: "Rules" },
  { to: "/demo", label: "Examples" },
  { to: "/settings", label: "Settings" },
];

export const Header: React.FC<HeaderProps> = ({
  activeCircle,
  onCircleChange,
  onRefresh,
  onToggleSidebar,
  onOpenCommandPalette,
  mobileOpen = false,
  reviewCount = 0,
}) => {
  const { user, logout } = useAuth();
  const { language, toggleLanguage, fontSize, setFontSize, highContrast, toggleHighContrast } = useLanguage();
  const { allCircles } = useCircle();
  const navigate = useNavigate();
  const [currentMode, setCurrentMode] = useState<"ONLINE" | "LOCAL_RESILIENT">("ONLINE");

  useEffect(() => {
    try {
      const mode = ApiService.getOperatingMode();
      const stored = localStorage.getItem("Nirikshak_mode");
      setCurrentMode(mode === "MOCK" || mode === "DEMO_FIXTURE" || stored === "LOCAL_RESILIENT" ? "LOCAL_RESILIENT" : "ONLINE");
    } catch {
      setCurrentMode("ONLINE");
    }
  }, []);

  const handleModeSwitch = () => {
    const next = currentMode === "ONLINE" ? "LOCAL_RESILIENT" : "ONLINE";
    setCurrentMode(next);
    try {
      localStorage.setItem("Nirikshak_mode", next);
      ApiService.setOperatingMode(next === "ONLINE" ? "LIVE" : "MOCK");
    } catch {
      // Keep the current session usable if browser storage is unavailable.
    }
    onRefresh?.();
  };

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  const linkLabel = (label: string) => {
    if (language !== "hi") return label;
    return ({ Overview: "अवलोकन", Inspections: "निरीक्षण", Review: "समीक्षा", Reports: "रिपोर्ट" } as Record<string, string>)[label] || label;
  };

  const renderPrimaryLinks = (mobile = false) => (
    <>
      {primaryLinks.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={() => {
            resetScrollToTop();
            if (mobile) onToggleSidebar?.();
          }}
          className={({ isActive }) => `veriq-nav-link ${isActive ? "is-active" : ""} ${mobile ? "veriq-nav-link-mobile" : ""}`}
        >
          {mobile && <Icon size={16} aria-hidden="true" />}
          <span>{linkLabel(label)}</span>
          {label === "Review" && reviewCount > 0 && <span className="veriq-nav-count">{reviewCount}</span>}
        </NavLink>
      ))}
      <details className={`veriq-more ${mobile ? "veriq-more-mobile" : ""}`}>
        <summary>
          {mobile ? <MoreHorizontal size={16} aria-hidden="true" /> : null}
          <span>{language === "hi" ? "अन्य" : "More"}</span>
          {!mobile && <ChevronDown size={13} aria-hidden="true" />}
        </summary>
        <div className="veriq-more-menu">
          {otherLinks.map((item) => (
            <Link key={item.to} to={item.to} onClick={() => mobile && onToggleSidebar?.()}>
              {item.label}
            </Link>
          ))}
        </div>
      </details>
    </>
  );

  return (
    <header className="veriq-header">
      <div className="veriq-header-row">
        <button
          type="button"
          className="veriq-menu-toggle"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
          onClick={onToggleSidebar}
        >
          {mobileOpen ? <X size={19} /> : <Menu size={19} />}
        </button>

        <VeriqBrandLogo tone="dark" size="sm" showSubtitle={false} className="veriq-header-brand" />

        <nav className="veriq-primary-nav" aria-label="Primary navigation">
          {renderPrimaryLinks()}
        </nav>

        <div className="veriq-header-tools">
          {onOpenCommandPalette && (
            <button type="button" className="veriq-search-button" onClick={onOpenCommandPalette} aria-label="Search cases and rules">
              <Search size={16} />
              <span>{language === "hi" ? "खोजें" : "Search"}</span>
              <kbd>⌘K</kbd>
            </button>
          )}

          <label className="veriq-circle-select">
            <span className="sr-only">Inspection area</span>
            <select value={activeCircle} onChange={(event) => onCircleChange(event.target.value)}>
              {allCircles.map((circle) => (
                <option key={circle.id} value={circle.id}>
                  {circle.label.split(" • ")[0]}
                </option>
              ))}
            </select>
            <ChevronDown size={13} aria-hidden="true" />
          </label>

          <button
            type="button"
            className={`veriq-mode-button ${currentMode === "ONLINE" ? "is-online" : "is-local"}`}
            onClick={handleModeSwitch}
            title={currentMode === "ONLINE" ? "Switch to local mode" : "Switch to online mode"}
          >
            <Radio size={14} />
            <span>{currentMode === "ONLINE" ? "Online" : "Local"}</span>
          </button>

          <details className="veriq-account">
            <summary aria-label="Account and accessibility settings">
              <span className="veriq-avatar">{user?.initials || "LM"}</span>
              <span className="veriq-account-name">{user?.name?.split(" ")[0] || "Officer"}</span>
              <ChevronDown size={13} aria-hidden="true" />
            </summary>
            <div className="veriq-account-menu">
              <strong>{user?.name}</strong>
              <span>{user?.designation || user?.role}</span>
              <button type="button" onClick={toggleLanguage}>{language === "en" ? "हिन्दी" : "English"}</button>
              <div className="veriq-accessibility-controls" aria-label="Text size">
                <button type="button" onClick={() => setFontSize("sm")} aria-pressed={fontSize === "sm"}>A−</button>
                <button type="button" onClick={() => setFontSize("md")} aria-pressed={fontSize === "md"}>A</button>
                <button type="button" onClick={() => setFontSize("lg")} aria-pressed={fontSize === "lg"}>A+</button>
                <button type="button" onClick={toggleHighContrast} aria-pressed={highContrast}>Contrast</button>
              </div>
              <button type="button" className="veriq-sign-out" onClick={handleSignOut}>
                <LogOut size={15} /> Sign out
              </button>
            </div>
          </details>
        </div>
      </div>

      {mobileOpen && (
        <nav className="veriq-mobile-nav" aria-label="Mobile navigation">
          {renderPrimaryLinks(true)}
          <Link to="/inspections/new" className="veriq-mobile-new" onClick={onToggleSidebar}>
            {language === "hi" ? "नया निरीक्षण" : "New inspection"}
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
