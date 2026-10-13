import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ApiService } from "../services/api";
import { InspectionCase } from "../types/inspection";
import { CaseWorkspace } from "../features/case/CaseWorkspace";
import { resetScrollToTop } from "../components/common/ScrollToTop";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { ArrowLeft, FileText, AlertCircle } from "lucide-react";

export const InspectionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();

  const [caseData, setCaseData] = useState<InspectionCase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    resetScrollToTop();
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const loadData = () => {
      ApiService.getInspection(id)
        .then((data) => {
          if (isMounted) {
            setCaseData(data);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          if (isMounted) {
            console.error("Failed to load inspection case:", err);
            setError(
              err.message ||
                (language === "hi"
                  ? "निरीक्षण केस नहीं मिला।"
                  : "Inspection case not found.")
            );
            setIsLoading(false);
          }
        });
    };

    loadData();
    window.addEventListener("nirikshak_data_updated", loadData);

    return () => {
      isMounted = false;
      window.removeEventListener("nirikshak_data_updated", loadData);
    };
  }, [id, language]);

  // If the statutory AI pipeline is running asynchronously on the live cloud server,
  // poll getInspection until the verdict, evidence assets, and evaluations are written.
  useEffect(() => {
    if (!caseData || (caseData.ai_verdict !== "PENDING" && (caseData.rule_evaluations?.length || 0) > 0 && (caseData.evidence_assets?.length || 0) > 0)) {
      return;
    }

    let isCancelled = false;
    const pollInterval = setInterval(async () => {
      try {
        const fresh = await ApiService.getInspection(caseData.id);
        if (!isCancelled && fresh) {
          const evidenceCountChanged = (fresh.evidence_assets?.length || 0) > (caseData.evidence_assets?.length || 0);
          const rulesCountChanged = (fresh.rule_evaluations?.length || 0) > (caseData.rule_evaluations?.length || 0);
          const verdictReady = fresh.ai_verdict && fresh.ai_verdict !== "PENDING";

          if (evidenceCountChanged || rulesCountChanged || verdictReady) {
            setCaseData(fresh);
            if (verdictReady && (fresh.rule_evaluations?.length || 0) > 0) {
              clearInterval(pollInterval);
            }
          }
        }
      } catch {
        // Silently retry on transient network drops
      }
    }, 2500);

    return () => {
      isCancelled = true;
      clearInterval(pollInterval);
    };
  }, [caseData?.id, caseData?.ai_verdict, caseData?.rule_evaluations?.length, caseData?.evidence_assets?.length]);

  if (isLoading) {
    return (
      <div className="bg-white p-12 text-center rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="w-8 h-8 border-4 border-[#1B365D] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-600 font-mono">
          {language === "hi"
            ? "सांविधिक केस फ़ाइल और क्रिप्टोग्राफ़िक साक्ष्य संपत्तियां लोड हो रही हैं..."
            : "Loading statutory case file and cryptographic evidence assets..."}
        </p>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="bg-white p-10 text-center rounded-xl border border-slate-200 shadow-xs space-y-4 max-w-xl mx-auto">
        <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mx-auto border border-rose-200">
          <AlertCircle size={26} />
        </div>
        <h2 className="text-base font-bold text-slate-900">
          {language === "hi" ? "निरीक्षण केस नहीं मिला" : "Inspection Case Not Found"}
        </h2>
        <p className="text-xs text-slate-600">
          {language === "hi" ? (
            <>
              केस संदर्भ आईडी{" "}
              <code className="font-mono bg-slate-100 text-slate-900 border border-slate-200 px-1.5 py-0.5 rounded">{id}</code>{" "}
              डेटास्टोर से पुनर्प्राप्त नहीं की जा सकी।
            </>
          ) : (
            <>
              Case reference ID{" "}
              <code className="font-mono bg-slate-100 text-slate-900 border border-slate-200 px-1.5 py-0.5 rounded">{id}</code> could
              not be retrieved from datastore.
            </>
          )}
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Link to="/inspections" className="btn-secondary text-xs">
            {language === "hi" ? "केस पंजी पर वापस जाएं" : "Back to Case Register"}
          </Link>
          <button
            type="button"
            onClick={() => {
              if (!id) return;
              setIsLoading(true);
              setError(null);
              ApiService.getInspection(id)
                .then((data) => {
                  setCaseData(data);
                  setIsLoading(false);
                })
                .catch(() => {
                  navigate("/inspections/demo-fortune-sunlite");
                });
            }}
            className="btn-primary text-xs cursor-pointer"
          >
            {language === "hi" ? "केस कार्यक्षेत्र पुनर्प्राप्त करें" : "Recover Case Workspace"}
          </button>
          <Link to="/inspections/demo-fortune-sunlite" className="btn-secondary text-xs">
            {language === "hi" ? "फॉर्च्यून सनलाइट डेमो लोड करें" : "Load Fortune Sunlite Demo"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {caseData.ai_verdict === "PENDING" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 text-amber-900 shadow-xs">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </div>
          <div className="text-xs flex-1">
            <span className="font-bold">
              {language === "hi"
                ? "विधिक AI पाइपलाइन क्लाउड सर्वर पर सक्रिय रूप से विश्लेषित कर रही है..."
                : "Statutory AI Pipeline is actively analyzing packaging facets on cloud server..."}
            </span>
            <span className="ml-2 text-amber-800">
              {language === "hi"
                ? "बहुभाषी OCR और नियम 6 अनुपालन परिणाम स्वतः यहाँ प्रदर्शित होंगे (पृष्ठ रीलोड की आवश्यकता नहीं)।"
                : "Multilingual OCR tokens, calibration scales, and Rule 6 evaluations will automatically appear as processing completes (no reload needed)."}
            </span>
          </div>
        </div>
      )}

      <CaseWorkspace
        caseData={caseData}
        onBack={() => navigate("/inspections")}
        onCaseUpdated={(updated) => setCaseData(updated)}
        officerRole={user?.officerRole || "INSPECTOR"}
        onSelectCase={(caseId) => navigate(`/inspections/${caseId}`)}
      />
    </div>
  );
};

export default InspectionDetails;
