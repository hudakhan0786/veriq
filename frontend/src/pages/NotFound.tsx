import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { m } from "framer-motion";
import { StateEmblem } from "../components/common/StateEmblem";
import { GovTopBar } from "../components/layout/GovTopBar";
import { GovFooter } from "../components/layout/GovFooter";
import { useLanguage } from "../context/LanguageContext";
import { resetScrollToTop } from "../components/common/ScrollToTop";
import {
  FileQuestion,
  Home,
  ArrowLeft,
  ClipboardList,
} from "lucide-react";

export const NotFound: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Official GIGW 3.0 Top Utility Bar */}
      <GovTopBar />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <m.div 
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden"
        >
          {/* Sovereign Masthead */}
          <div className="bg-[#1B365D] text-white p-6 sm:p-8 text-center relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center space-y-3">
              <StateEmblem size={44} tone="white" showMotto={true} />
              <div className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
                {language === "hi"
                  ? "भारत सरकार • उपभोक्ता मामले विभाग"
                  : "Government of India • Department of Consumer Affairs"}
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {language === "hi" ? "विधिक मापविज्ञान पोर्टल" : "Legal Metrology Inspection Portal"}
              </h1>
            </div>
          </div>

          {/* 404 Error Body */}
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="flex justify-center mb-1">
              <img
                src="/assets/errors/error_404_dossier.svg"
                alt="404 Case Dossier Not Found Illustration"
                className="w-48 h-36 object-contain drop-shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full inline-block">
                {language === "hi" ? "त्रुटि कोड: 404 // सांविधिक रिकॉर्ड नहीं मिला" : "Error Code: 404 // Statutory Record Not Found"}
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                {language === "hi"
                  ? "पृष्ठ या निरीक्षण मामला नहीं मिला"
                  : "Requested Page or Case Dossier Not Found"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                {language === "hi"
                  ? "आपके द्वारा अनुरोधित URL या केस फ़ाइल उपलब्ध नहीं है अथवा स्थानांतरित कर दी गई है। कृपया नीचे दिए गए आधिकारिक विकल्पों का उपयोग करें।"
                  : "The statutory URL or inspection case record you requested does not exist, has expired, or may have been re-indexed in another enforcement division."}
              </p>
            </div>

            {/* Quick Recovery Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
              <Link
                to="/"
                onClick={resetScrollToTop}
                className="p-3 rounded-lg border border-slate-200 hover:border-[#1B365D] hover:bg-slate-50 transition-all flex items-center gap-3 text-left group"
              >
                <div className="p-2 rounded-lg bg-blue-50 text-[#1B365D] group-hover:bg-[#1B365D] group-hover:text-white transition-colors shrink-0">
                  <Home size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {language === "hi" ? "मुख्य पोर्टल (होम)" : "National Home Portal"}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {language === "hi" ? "राष्ट्रीय प्रवर्तन लैंडिंग पृष्ठ" : "Return to national public portal"}
                  </div>
                </div>
              </Link>

              <Link
                to="/inspections"
                onClick={resetScrollToTop}
                className="p-3 rounded-lg border border-slate-200 hover:border-[#1B365D] hover:bg-slate-50 transition-all flex items-center gap-3 text-left group"
              >
                <div className="p-2 rounded-lg bg-blue-50 text-[#1B365D] group-hover:bg-[#1B365D] group-hover:text-white transition-colors shrink-0">
                  <ClipboardList size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {language === "hi" ? "निरीक्षण पंजी" : "Inspection Register"}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {language === "hi" ? "सक्रिय जिंस मामले देखें" : "Browse active commodity cases"}
                  </div>
                </div>
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  resetScrollToTop();
                  navigate(-1);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors btn-press"
              >
                <ArrowLeft size={14} />
                <span>{language === "hi" ? "पिछली स्क्रीन पर वापस जाएं" : "Go Back to Previous Screen"}</span>
              </button>
              <Link
                to="/rules"
                onClick={resetScrollToTop}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#1B365D] text-xs font-bold text-white hover:bg-[#0A2540] transition-colors shadow-xs btn-press"
              >
                <span>{language === "hi" ? "एलएमपीसी सांविधिक नियम देखें" : "Browse LMPC Statutory Rules"}</span>
              </Link>
            </div>

            {/* Support / Helpdesk Disclaimer */}
            <div className="pt-2 text-[11px] text-slate-500 font-mono">
              {language === "hi"
                ? "राष्ट्रीय उपभोक्ता हेल्पलाइन: 1915 • ई-माप प्रवर्तन डेस्क • निरीक्षक"
                : "National Consumer Helpline: 1915 • eMaap Enforcement Desk • Veriq"}
            </div>
          </div>
        </m.div>
      </main>

      {/* Official Government Footer */}
      <GovFooter />
    </div>
  );
};

export default NotFound;
