import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { VeriqBrandLogo } from "../common/VeriqBrandLogo";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

export const PublicHeader: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();
  const { user, roleMeta } = useAuth();
  const isHindi = language === "hi";
  const accountPath = user ? roleMeta[user.role]?.landing || "/dashboard" : "/login";

  return (
    <header className="veriq-public-header">
      <VeriqBrandLogo tone="dark" size="md" />
      <nav aria-label={isHindi ? "मुख्य नेविगेशन" : "Main navigation"}>
        <Link to="/">{isHindi ? "होम" : "Home"}</Link>
        <Link to="/rules">{isHindi ? "लेबल गाइड" : "Label guide"}</Link>
        <button type="button" onClick={toggleLanguage}>
          {isHindi ? "English" : "हिन्दी"}
        </button>
        <Link className="veriq-public-login" to={accountPath}>
          {user ? (isHindi ? "कार्यस्थान खोलें" : "Open workspace") : (isHindi ? "स्टाफ साइन इन" : "Staff sign in")}
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </nav>
    </header>
  );
};

export default PublicHeader;
