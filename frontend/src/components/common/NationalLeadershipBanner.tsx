import React from "react";
import { Scale, Award, ShieldCheck, Quote } from "lucide-react";
import { StateEmblem } from "./StateEmblem";
import { useLanguage } from "../../context/LanguageContext";

export const NationalLeadershipBanner: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section className="relative z-10 py-8 sm:py-12 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white shadow-md border border-slate-200/80 p-5 sm:p-7 relative overflow-hidden">
          {/* Top Tricolor Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-slate-200 to-[#138808]" />

        <div className="grid lg:grid-cols-12 gap-6 items-center">
          {/* Left Column (7 cols): Hon'ble Prime Minister Spotlight Card */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Circular Dignitary Portrait with Tricolor Ring Accent */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-[#FF9933] via-white to-[#138808] shadow-md">
                <img
                  src="/assets/pm_modi_portrait_clean.png"
                  alt="Shri Narendra Modi, Hon'ble Prime Minister of India"
                  className="w-full h-full rounded-full object-cover bg-slate-100"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-govNavy text-white p-1 rounded-full shadow-xs border border-amber-400">
                <Award size={14} className="text-amber-400" />
              </div>
            </div>

            {/* Quotation Content */}
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex items-start gap-1 justify-center sm:justify-start">
                <Quote size={22} className="text-rose-600 fill-rose-600 shrink-0 rotate-180" />
                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed italic">
                  {t(
                    "quote.pm_quote",
                    "India's Digital Public Infrastructure has demonstrated how technology can expand opportunity, improve governance, protect consumer trust, and deliver transparent statutory services for hundreds of millions of people."
                  )}
                </p>
              </div>

              {/* Accent Underline */}
              <div className="h-0.5 w-16 bg-rose-600 rounded-full mx-auto sm:mx-0" />

              {/* Dignitary Attribution */}
              <div className="pt-1">
                <h4 className="text-xs sm:text-sm font-black text-govNavy leading-tight">
                  {t("quote.pm_name", "Shri Narendra Modi")}
                </h4>
                <p className="text-[11px] font-bold text-amber-700 leading-tight">
                  {t("quote.pm_title", "Hon'ble Prime Minister of India")}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {t(
                    "quote.pm_caption",
                    "National Address on Digital Governance, Citizen Empowerment & Consumer Rights"
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Department of Consumer Affairs Legal Metrology Mission */}
          <div className="lg:col-span-5 lg:border-l lg:border-slate-200 lg:pl-6 space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200/60">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-govNavy">
              <StateEmblem size={18} tone="navy" />
              <span>
                {t(
                  "quote.mission_title",
                  "Department of Consumer Affairs • Legal Metrology Division"
                )}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {t(
                "quote.mission_desc",
                "Ensuring fair measure in trade, statutory clarity in packaged commodities, and tamper-evident electronic evidence under the Legal Metrology (PC) Rules, 2011 & LM Act, 2009."
              )}
            </p>

            {/* Statutory Gazette Notification Badges */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100/80 text-amber-900 border border-amber-300">
                <ShieldCheck size={11} className="text-amber-700" />
                <span>{t("quote.badge_usp", "GSR 779(E) USP Mandate")}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100/80 text-emerald-900 border border-emerald-300">
                <ShieldCheck size={11} className="text-emerald-700" />
                <span>{t("quote.badge_bsa", "Section 63 BSA 2023 Evidence")}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100/80 text-blue-900 border border-blue-300">
                <ShieldCheck size={11} className="text-blue-700" />
                <span>{t("quote.badge_ecom", "Rule 6(10) E-Commerce")}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
};
