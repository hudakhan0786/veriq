import React from "react";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { PublicHeader } from "../components/layout/PublicHeader";
import { useLanguage } from "../context/LanguageContext";

export const Landing: React.FC = () => {
  const { language } = useLanguage();
  const isHindi = language === "hi";
  const checklist = isHindi
    ? ["उत्पाद का नाम", "मात्रा", "कीमत", "तारीख और संपर्क जानकारी"]
    : ["Product name", "Quantity", "Price", "Date and contact details"];

  return (
    <div className="veriq-public-page">
      <PublicHeader />
      <main className="veriq-public-main">
        <section className="veriq-public-hero veriq-public-hero-simple">
          <div className="veriq-public-copy">
            <p className="veriq-eyebrow">{isHindi ? "खरीदारों के लिए सरल गाइड" : "A simple guide for shoppers"}</p>
            <h1>{isHindi ? "उत्पाद के लेबल पर क्या देखें" : "Know what to look for on a product label."}</h1>
            <p className="veriq-public-lede">
              {isHindi
                ? "पैकेज पर कीमत, मात्रा, तारीख और संपर्क जानकारी को समझने का आसान तरीका।"
                : "A plain-language guide to common details on packaged products, including price, quantity, dates and contact information."}
            </p>
            <div className="veriq-public-actions">
              <Link to="/rules" className="veriq-button veriq-button-primary">
                {isHindi ? "लेबल गाइड देखें" : "Read the label guide"}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <p className="veriq-public-small-note">
              {isHindi ? "गाइड पढ़ने के लिए साइन इन की जरूरत नहीं है।" : "No sign-in is needed to read the guide."}
            </p>
          </div>

          <aside className="veriq-label-check-card" aria-label={isHindi ? "लेबल पर आम जानकारी" : "Common label details"}>
            <p className="veriq-eyebrow">{isHindi ? "शुरुआत यहाँ से करें" : "A good place to start"}</p>
            <h2>{isHindi ? "ये जानकारी देखें" : "Look for these details"}</h2>
            <ul>
              {checklist.map((item) => (
                <li key={item}>
                  <span><Check size={14} aria-hidden="true" /></span>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/rules" className="veriq-text-link">
              {isHindi ? "सभी जाँच देखें" : "See all checks"}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </aside>
        </section>
      </main>
      <footer className="veriq-public-footer">
        {isHindi
          ? "यह सामान्य जानकारी के लिए एक आसान गाइड है। कुछ उत्पादों पर अतिरिक्त नियम लागू हो सकते हैं।"
          : "This is a quick general guide. Some products may have additional requirements."}
      </footer>
    </div>
  );
};

export default Landing;
