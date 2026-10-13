import React from "react";
import { CalendarDays, Globe2, Info, Package, Phone, Scale, Tag } from "lucide-react";
import { PublicHeader } from "../components/layout/PublicHeader";
import { useLanguage } from "../context/LanguageContext";

export const Rules: React.FC = () => {
  const { language } = useLanguage();
  const isHindi = language === "hi";
  const checks = isHindi
    ? [
        { icon: Package, title: "उत्पाद का नाम", text: "पैकेज पर साफ लिखा होना चाहिए कि उसके अंदर क्या है।" },
        { icon: Scale, title: "मात्रा", text: "वजन, आयतन, लंबाई या वस्तुओं की संख्या देखें।" },
        { icon: Tag, title: "कीमत", text: "कर सहित अधिकतम खुदरा मूल्य (MRP) देखें। जहाँ लागू हो, इकाई मूल्य भी दिया जा सकता है।" },
        { icon: CalendarDays, title: "तारीख", text: "निर्माण, पैकिंग या आयात का महीना और वर्ष देखें। कुछ उत्पादों पर उपयोग की अंतिम तारीख भी होती है।" },
        { icon: Phone, title: "कंपनी से संपर्क", text: "निर्माता, पैकर या आयातक का नाम-पता और ग्राहक सहायता विवरण देखें।" },
        { icon: Globe2, title: "आयातित उत्पाद", text: "आयात किए गए उत्पाद पर मूल देश की जानकारी देखें।" },
      ]
    : [
        { icon: Package, title: "Product name", text: "The package should clearly say what is inside." },
        { icon: Scale, title: "Quantity", text: "Check the weight, volume, length or number of items." },
        { icon: Tag, title: "Price", text: "Look for the maximum retail price (MRP), including taxes. A unit price may also be shown where required." },
        { icon: CalendarDays, title: "Date", text: "Check the month and year of manufacture, packing or import. Some products also show a best-before or use-by date." },
        { icon: Phone, title: "Who to contact", text: "Look for the maker, packer or importer name and address, along with consumer-care details." },
        { icon: Globe2, title: "Imported products", text: "For imported products, look for the country of origin." },
      ];

  return (
    <div className="veriq-public-page">
      <PublicHeader />
      <main className="veriq-public-main veriq-guide-main">
        <section className="veriq-guide-intro">
          <p className="veriq-eyebrow">{isHindi ? "सरल सार्वजनिक गाइड" : "Plain-language guide"}</p>
          <h1>{isHindi ? "पैकेज के लेबल पर क्या देखें" : "What to check on a package label"}</h1>
          <p>
            {isHindi
              ? "खरीदने से पहले पैकेज पर दी गई मुख्य जानकारी को देखने के लिए इस छोटी सूची का उपयोग करें।"
              : "Use this short checklist to understand the main information shown on a packaged product."}
          </p>
        </section>

        <section className="veriq-guide-grid" aria-label={isHindi ? "लेबल जाँच सूची" : "Label checklist"}>
          {checks.map(({ icon: Icon, title, text }) => (
            <article className="veriq-guide-card" key={title}>
              <span className="veriq-guide-icon"><Icon size={19} strokeWidth={1.8} aria-hidden="true" /></span>
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
        </section>

        <section className="veriq-guide-help">
          <Info size={18} aria-hidden="true" />
          <div>
            <h2>{isHindi ? "कुछ साफ न दिखे?" : "Something unclear?"}</h2>
            <p>
              {isHindi
                ? "पैकेज और खरीद की रसीद संभालकर रखें। जानकारी समझने के लिए विक्रेता या उत्पाद बनाने वाली कंपनी से पूछें।"
                : "Keep the package and receipt. Ask the seller or product company if you need help understanding a label."}
            </p>
          </div>
        </section>

        <p className="veriq-guide-note">
          {isHindi
            ? "यह सामान्य जानकारी के लिए एक आसान गाइड है। कुछ उत्पादों पर अतिरिक्त नियम लागू हो सकते हैं।"
            : "This is a quick general guide. Some products may have additional requirements."}
        </p>
      </main>
    </div>
  );
};

export default Rules;
