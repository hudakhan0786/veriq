import React, { useEffect, useState } from "react";
import { AlertCircle, ArrowRight, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PublicHeader } from "../components/layout/PublicHeader";
import { useAuth, type UserRole } from "../context/AuthContext";
import { ApiService } from "../services/api";
import { StorageService } from "../services/storage";
import { useLanguage } from "../context/LanguageContext";

const accessOptions: { value: UserRole; en: string; hi: string }[] = [
  { value: "inspector", en: "Field work", hi: "फील्ड कार्य" },
  { value: "controller", en: "Case review", hi: "मामले की समीक्षा" },
  { value: "administrator", en: "Workspace setup", hi: "कार्यस्थान सेटअप" },
  { value: "auditor", en: "Read-only reports", hi: "केवल रिपोर्ट देखें" },
];

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { user, login, roleMeta } = useAuth();
  const { language } = useLanguage();
  const isHindi = language === "hi";
  const configuredUsername = ((import.meta as any)?.env?.VITE_DEMO_OFFICER_USERNAME as string | undefined)?.trim() || "";
  const configuredPassword = ((import.meta as any)?.env?.VITE_DEMO_OFFICER_PASSWORD as string | undefined)?.trim() || "";
  const initialRole: UserRole = configuredUsername === "controller_south"
    ? "controller"
    : configuredUsername === "admin_central"
      ? "administrator"
      : configuredUsername === "viewer_analyst"
        ? "auditor"
        : "inspector";

  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [username, setUsername] = useState(configuredUsername);
  const [password, setPassword] = useState(configuredPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) navigate(roleMeta[user.role]?.landing || "/dashboard", { replace: true });
  }, [user, navigate, roleMeta]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError(isHindi ? "अपना यूज़रनेम और पासवर्ड भरें।" : "Enter your username and password.");
      return;
    }

    setIsSubmitting(true);
    const baseUrl = ((import.meta as any)?.env?.VITE_API_BASE_URL as string) || "/api/v1";
    let offline = false;

    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.access_token) {
          if (selectedRole === "controller") StorageService.setControllerAuthToken(data.access_token);
          else StorageService.setAuthToken(data.access_token);
        }
      } else if (response.status === 401) {
        setError(isHindi ? "यूज़रनेम या पासवर्ड सही नहीं है।" : "That username or password did not match.");
        setIsSubmitting(false);
        return;
      } else {
        offline = true;
      }
    } catch {
      offline = true;
    }

    const result = login(selectedRole, username.trim(), password, {
      name: isHindi ? "टीम सदस्य" : "Team member",
      initials: "V",
      designation: isHindi ? "Veriq उपयोगकर्ता" : "Veriq user",
      department: "",
      badgeNumber: "",
    });

    if (!result.ok) {
      setError(result.message || (isHindi ? "साइन इन नहीं हो सका।" : "Could not sign in."));
      setIsSubmitting(false);
      return;
    }

    if (offline) ApiService.setOperatingMode("MOCK");
    navigate(roleMeta[selectedRole]?.landing || "/dashboard", { replace: true });
  };

  return (
    <div className="veriq-public-page veriq-login-page">
      <PublicHeader />
      <main className="veriq-login-main">
        <section className="veriq-login-card">
          <div className="veriq-login-heading">
            <span className="veriq-login-icon"><LockKeyhole size={19} aria-hidden="true" /></span>
            <p className="veriq-eyebrow">{isHindi ? "स्टाफ एक्सेस" : "Staff access"}</p>
            <h1>{isHindi ? "कार्यस्थान में साइन इन करें" : "Sign in to your workspace"}</h1>
            <p>{isHindi ? "अपना खाता विवरण दर्ज करें।" : "Enter your account details to continue."}</p>
          </div>

          <form className="veriq-login-form" onSubmit={handleSubmit}>
            <label>
              <span>{isHindi ? "एक्सेस प्रकार" : "Access type"}</span>
              <select value={selectedRole} onChange={(event) => setSelectedRole(event.target.value as UserRole)}>
                {accessOptions.map((option) => (
                  <option key={option.value} value={option.value}>{isHindi ? option.hi : option.en}</option>
                ))}
              </select>
            </label>

            <label>
              <span>{isHindi ? "यूज़रनेम" : "Username"}</span>
              <input
                type="text"
                name="username"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder={isHindi ? "अपना यूज़रनेम लिखें" : "Enter your username"}
                required
              />
            </label>

            <label>
              <span>{isHindi ? "पासवर्ड" : "Password"}</span>
              <span className="veriq-password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={isHindi ? "अपना पासवर्ड लिखें" : "Enter your password"}
                  required
                />
                <button
                  type="button"
                  className="veriq-password-toggle"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? (isHindi ? "पासवर्ड छिपाएँ" : "Hide password") : (isHindi ? "पासवर्ड दिखाएँ" : "Show password")}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
            </label>

            {error && (
              <p className="veriq-login-error" role="alert">
                <AlertCircle size={16} aria-hidden="true" /> {error}
              </p>
            )}

            <button type="submit" className="veriq-button veriq-button-primary veriq-login-submit" disabled={isSubmitting}>
              {isSubmitting ? (isHindi ? "साइन इन हो रहा है..." : "Signing in...") : (isHindi ? "साइन इन" : "Sign in")}
              {!isSubmitting && <ArrowRight size={16} aria-hidden="true" />}
            </button>
          </form>

          <p className="veriq-login-public-note">
            {isHindi ? "लेबल गाइड पढ़ने के लिए साइन इन की जरूरत नहीं है।" : "The label guide is open to everyone. No sign-in is needed."}
          </p>
        </section>
      </main>
    </div>
  );
};

export default Login;
