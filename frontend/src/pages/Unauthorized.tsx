import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { m } from "framer-motion";
import { StateEmblem } from "../components/common/StateEmblem";
import { GovTopBar } from "../components/layout/GovTopBar";
import { GovFooter } from "../components/layout/GovFooter";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import {
  ShieldAlert,
  ArrowLeft,
  Home,
  UserCheck,
  Lock,
} from "lucide-react";

export const Unauthorized: React.FC = () => {
  const { user, switchOfficerRole } = useAuth();
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
          {/* Sovereign Security Header */}
          <div className="bg-[#1B365D] text-white p-6 sm:p-8 text-center relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center space-y-3">
              <StateEmblem size={44} tone="white" showMotto={true} />
              <div className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
                {language === "hi"
                  ? "विधिक मापविज्ञान (पैकेज्ड वस्तुएं) नियम, 2011 एवं अधिनियम, 2009 • सुरक्षा प्रतिबंध"
                  : "Legal Metrology (PC) Rules, 2011 & LM Act, 2009 • Statutory Access Boundary"}
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {language === "hi" ? "अनाधिकृत अभिगम" : "Access Denied // Restricted Authorization"}
              </h1>
            </div>
          </div>

          {/* Access Denied Body */}
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="flex justify-center mb-1">
              <img
                src="/assets/errors/error_403_restricted.svg"
                alt="403 Statutory Clearance Boundary Illustration"
                className="w-48 h-36 object-contain drop-shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full inline-block">
                {language === "hi"
                  ? "सुरक्षा कोड: 403 // अपर्याप्त भूमिका विशेषाधिकार"
                  : "Security Code: 403 // Role Privilege Insufficient"}
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                {language === "hi"
                  ? "इस अनुभाग तक पहुँचने की अनुमति नहीं है"
                  : "Statutory Clearance Required"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                {language === "hi"
                  ? `आप वर्तमान में ${user?.officerRole || "LMO"} के रूप में लॉग इन हैं। यह अनुभाग नियंत्रक (Controller) या व्यवस्थापक (Admin) की स्वीकृति के लिए आरक्षित है।`
                  : `Your authenticated role (${user?.role || "Inspector"}) lacks statutory delegation for this operational view. Controller or Administrator clearance is required.`}
              </p>
            </div>

            {/* Role Switcher Help for Field Prototype */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <UserCheck size={16} className="text-[#1B365D]" />
                <span>
                  {language === "hi"
                    ? "प्रदर्शन हेतु नियंत्रक (Controller) पहुंच चाहिए?"
                    : "Need Controller Access for Demonstration?"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {language === "hi"
                  ? "आप शीर्ष हेडर में भूमिका बदल सकते हैं या नियंत्रक क्रेडेंशियल का अनुकरण करने हेतु नीचे क्लिक करें:"
                  : "You can switch your role in the top header role toggle or click below to simulate Controller credentials:"}
              </p>
              <button
                type="button"
                onClick={() => {
                  switchOfficerRole("CONTROLLER");
                  navigate("/dashboard");
                }}
                className="w-full mt-2 py-2 px-3 rounded-lg bg-[#1B365D] text-white text-xs font-bold hover:bg-[#0A2540] transition-colors flex items-center justify-center gap-2 shadow-xs btn-press border border-transparent"
              >
                <Lock size={13} />
                <span>
                  {language === "hi"
                    ? "विधिक मापविज्ञान नियंत्रक की भूमिका में बदलें"
                    : "Switch to Controller of Legal Metrology Role"}
                </span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors btn-press"
              >
                <ArrowLeft size={14} />
                <span>{language === "hi" ? "पिछली स्क्रीन पर वापस जाएं" : "Back to Previous Screen"}</span>
              </button>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-amber-400 text-xs font-bold text-slate-950 hover:bg-amber-300 transition-colors shadow-xs btn-press"
              >
                <Home size={14} />
                <span>{language === "hi" ? "डैशबोर्ड पर लौटें" : "Return to Dashboard"}</span>
              </Link>
            </div>
          </div>
        </m.div>
      </main>

      {/* Official Government Footer */}
      <GovFooter />
    </div>
  );
};

export default Unauthorized;
