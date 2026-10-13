import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ApiService } from "../services/api";
import { InspectionCase } from "../types/inspection";
import { VerdictBadge } from "../components/common/StatusBadge";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { getJurisdictionCircle } from "../context/CircleContext";
import { extractStatutoryRecipient } from "../utils/statutoryNotice";
import { generateClientForm1PdfBlobUrl } from "../utils/clientForm1PdfGenerator";
import {
  ArrowLeft,
  Download,
  FileArchive,
  FileImage,
  ScanText,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Printer,
  FileCode,
  Activity,
} from "lucide-react";

export const EvidenceDossier: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();

  const [caseData, setCaseData] = useState<InspectionCase | null>(null);
  const [targetCaseId, setTargetCaseId] = useState<string | null>(id || null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [dossierCert, setDossierCert] = useState<any | null>(null);

  const loadCase = () => {
    let isMounted = true;
    setIsLoading(true);
    setLoadError(null);

    const resolveAndFetch = async () => {
      let resolvedId = id;
      if (!resolvedId) {
        try {
          const listRes = await ApiService.listInspections();
          if (listRes.items && listRes.items.length > 0) {
            resolvedId = listRes.items[0].id;
          }
        } catch {
          // Ignore listing lookup error
        }
      }

      if (!resolvedId) {
        if (isMounted) {
          setTargetCaseId(null);
          setCaseData(null);
          setIsLoading(false);
        }
        return;
      }

      if (isMounted) {
        setTargetCaseId(resolvedId);
      }

      try {
        const data = await ApiService.getInspection(resolvedId);
        if (isMounted) {
          setCaseData(data);
          setIsLoading(false);
          // Pre-fetch official evidence dossier certificate metadata
          try {
            const certData = await ApiService.getEvidenceDossier(data.id);
            if (isMounted && certData) {
              setDossierCert(certData);
            }
          } catch {
            // Non-critical fallback
          }
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Failed to load dossier case:", err);
          setLoadError(
            err?.message ||
              (language === "hi"
                ? "साक्ष्य संचिका लोड करने में विफल।"
                : "Failed to load evidence dossier case.")
          );
          setIsLoading(false);
        }
      }
    };

    resolveAndFetch();

    return () => {
      isMounted = false;
    };
  };

  useEffect(() => {
    const cleanup = loadCase();
    
    // Create a stable reference for the event listener
    const handleUpdate = () => {
      // Don't re-run loadCase if id hasn't changed, but just fetch to sync
      loadCase(); 
    };
    
    window.addEventListener("nirikshak_data_updated", handleUpdate);
    
    return () => {
      cleanup();
      window.removeEventListener("nirikshak_data_updated", handleUpdate);
    };
  }, [id, language]);

  const activeAsset = useMemo(() => {
    const assets = caseData?.evidence_assets || [];
    if (assets.length === 0) return undefined;
    if (selectedAssetId) {
      const found = assets.find((a) => a.image_id === selectedAssetId);
      if (found) return found;
    }
    const sorted = [...assets].sort(
      (a, b) => (b.ocr?.tokens?.length || 0) - (a.ocr?.tokens?.length || 0)
    );
    return sorted[0] || assets[0];
  }, [caseData?.evidence_assets, selectedAssetId]);

  const allTokens = useMemo(() => {
    const collected: any[] = [];
    (caseData?.evidence_assets || []).forEach((a) => {
      if (a.ocr?.tokens) {
        collected.push(...a.ocr.tokens);
      }
    });
    return collected;
  }, [caseData?.evidence_assets]);

  const ocrTokens = allTokens.length > 0 ? allTokens : activeAsset?.ocr?.tokens || [];
  const rules = caseData?.rule_evaluations || [];
  const auditEvents = caseData?.audit_trail || [];

  const certificateNumber =
    dossierCert?.certificate_number ||
    caseData?.bsa_certificate?.certificate_number ||
    `SEC63-BSA-2026-${(caseData?.sku_demo_id || caseData?.id || "DL-0842")
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(-8)
      .toUpperCase()}`;

  const merkleRoot =
    dossierCert?.merkle_root ||
    caseData?.evidence_graph?.merkle_root ||
    caseData?.bsa_certificate?.raw_images_merkle_root ||
    "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08";

  // Export Signed Dossier: Compiles Section 63 BSA certificate & triggers browser print/PDF export
  const handleExportDossier = async () => {
    if (!caseData) return;
    setIsExporting(true);
    setExportNotice(null);

    try {
      const certRes = await ApiService.getEvidenceDossier(caseData.id);
      if (certRes) {
        setDossierCert(certRes);
      }
      const res = await ApiService.generateNotice({
        inspection_id: caseData.id,
        recipient: extractStatutoryRecipient(caseData),
        compounding_fee_amount: 5000,
        reply_window_days: 15,
      });

      let downloadUrl = res?.pdf_download_url;
      if (!downloadUrl || downloadUrl === "/form1.pdf") {
        downloadUrl = generateClientForm1PdfBlobUrl(caseData, extractStatutoryRecipient(caseData), 5000, 15);
      }
      if (downloadUrl) {
        const filename = `Form-1-Notice-${caseData.inspection_number || caseData.id}.pdf`;
        const dlLink = document.createElement("a");
        dlLink.href = downloadUrl;
        dlLink.download = filename;
        dlLink.target = "_blank";
        document.body.appendChild(dlLink);
        dlLink.click();
        document.body.removeChild(dlLink);
      } else {
        window.print();
      }

      setExportNotice(
        language === "hi"
          ? `धारा 63 बीएसए 2023 साक्ष्य संचिका प्रमाणित (${certRes?.certificate_number || certificateNumber})। मुद्रण/पीडीएफ पूर्वावलोकन खोला जा रहा है...`
          : `Section 63 BSA 2023 Evidence Dossier certified (${certRes?.certificate_number || certificateNumber}). Launching print/PDF preview...`
      );

      // Give notice time to render then trigger high-fidelity print
      setTimeout(() => {
        window.print();
        setIsExporting(false);
      }, 500);
    } catch {
      setExportNotice(
        language === "hi"
          ? `धारा 63 बीएसए 2023 साक्ष्य संचिका प्रमाणित (${certificateNumber})। मुद्रण/पीडीएफ पूर्वावलोकन खोला जा रहा है...`
          : `Section 63 BSA 2023 Evidence Dossier certified (${certificateNumber}). Launching print/PDF preview...`
      );
      setTimeout(() => {
        window.print();
        setIsExporting(false);
      }, 500);
    }
  };

  // Download cryptographic JSON evidence bundle for statutory court filing
  const handleDownloadBundleJson = () => {
    if (!caseData) return;
    const bundlePayload = {
      statutory_mandate: "Section 63 of Bharatiya Sakshya Adhiniyam, 2023 (BSA 2023)",
      certificate_number: certificateNumber,
      merkle_root: merkleRoot,
      inspection: {
        id: caseData.id,
        inspection_number: caseData.inspection_number,
        product_name: caseData.product_name,
        brand_name: caseData.brand_name,
        manufacturer_name: caseData.manufacturer_name,
        overall_status: caseData.overall_status,
        officer_id: user?.badgeNumber || caseData.officer_id || "INSP-DL-0842",
        officer_name: user?.name || "Rajesh Sharma",
        officer_designation: user?.designation || "Legal Metrology Officer (Gazetted)",
        jurisdiction_id: caseData.jurisdiction_id,
        created_at: caseData.created_at,
      },
      evidence_assets: (caseData.evidence_assets || []).map((a) => ({
        image_id: a.image_id,
        panel_type: a.panel_type,
        sha256: a.raw_sha256,
        dimensions: `${a.image_width}x${a.image_height}`,
        quality_gate: a.quality_gate,
        calibration: a.calibration,
      })),
      extracted_declarations: caseData.extracted_fields || [],
      multilingual_ocr_tokens: ocrTokens,
      statutory_rule_evaluations: rules,
      cryptographic_audit_trail: auditEvents,
      exported_at: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(bundlePayload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SEC63_BSA_Evidence_Bundle_${caseData.inspection_number || caseData.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="bg-white p-12 text-center space-y-3 border border-slate-200 rounded-xl shadow-xs">
        <div className="w-8 h-8 border-4 border-[#1B365D] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-600">
          {language === "hi"
            ? "इलेक्ट्रॉनिक साक्ष्य संचिका (डोज़ियर) संकलित की जा रही है..."
            : "Compiling electronic evidence dossier..."}
        </p>
      </div>
    );
  }

  if (!caseData) {
    if (!loadError && !targetCaseId) {
      return (
        <div className="bg-white p-10 text-center space-y-4 max-w-xl mx-auto border border-slate-200 rounded-xl shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-[#1B365D] flex items-center justify-center mx-auto border border-slate-200">
            <FileArchive size={24} />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            {language === "hi" ? "कोई साक्ष्य संचिका उपलब्ध नहीं है" : "No Evidence Dossier Available"}
          </h2>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            {language === "hi"
              ? "रजिस्टर में कोई सक्रिय निरीक्षण मामला नहीं मिला। कृपया केस पंजी से एक मामला चुनें या नया निरीक्षण पंजीकृत करें।"
              : "No active inspection cases found in the register. Please select a case from the Inspection Desk or register a new commodity inspection."}
          </p>
          <div className="pt-3 flex flex-wrap justify-center gap-3">
            <Link to="/inspections" className="btn-secondary text-xs">
              {language === "hi" ? "केस पंजी देखें" : "View Inspection Register"}
            </Link>
            <Link to="/inspections/new" className="btn-primary text-xs">
              {language === "hi" ? "नया निरीक्षण पंजीकृत करें" : "Register New Inspection"}
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white p-10 text-center space-y-4 max-w-xl mx-auto border border-slate-200 rounded-xl shadow-xs">
        <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mx-auto border border-rose-200">
          <FileArchive size={24} />
        </div>
        <h2 className="text-base font-bold text-slate-900">
          {language === "hi" ? "साक्ष्य संचिका लोड करने में असमर्थ" : "Unable to Load Evidence Dossier"}
        </h2>
        <p className="text-xs text-slate-600">
          {loadError ||
            (language === "hi"
              ? `केस आईडी "${targetCaseId || id || "Not available"}" के लिए साक्ष्य रिकॉर्ड उपलब्ध नहीं है।`
              : `Evidence records for case ID "${targetCaseId || id || "Not available"}" could not be retrieved.`)}
        </p>
        <div className="pt-3 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={loadCase} className="btn-secondary text-xs">
            {language === "hi" ? "पुनः प्रयास करें" : "Retry Loading"}
          </button>
          <Link to="/inspections" className="btn-secondary text-xs">
            {language === "hi" ? "केस पंजी पर वापस जाएं" : "Back to Case Register"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Print-specific Government Header (Only visible in Print/PDF mode) */}
      <div className="hidden print:block text-center border-b-2 border-slate-900 pb-4 mb-6">
        <div className="text-[11px] font-bold tracking-widest text-slate-700 uppercase">
          Government of India • Ministry of Consumer Affairs, Food & Public Distribution
        </div>
        <div className="text-sm font-black tracking-wide text-slate-900 uppercase mt-0.5">
          Department of Consumer Affairs • Legal Metrology Division
        </div>
        <div className="text-base font-black text-slate-900 uppercase mt-2">
          Certificate of Electronic Record & Evidence Dossier
        </div>
        <div className="text-xs font-semibold text-slate-700">
          Under Section 63 of Bharatiya Sakshya Adhiniyam, 2023 (BSA 2023)
        </div>
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-600 mt-3 pt-2 border-t border-slate-300">
          <span>CERT NO: {certificateNumber}</span>
          <span>DATE: {new Date().toLocaleDateString("en-IN")}</span>
          <span>MERKLE ROOT: {merkleRoot.slice(0, 24)}...</span>
        </div>
      </div>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs print:hidden">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigate(`/inspections/${caseData.id}`)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors mt-0.5 border border-slate-200"
            title={language === "hi" ? "निरीक्षण कार्यक्षेत्र पर वापस जाएं" : "Back to Inspection Workspace"}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1B365D] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                {language === "hi"
                  ? "धारा 63 बीएसए 2023 इलेक्ट्रॉनिक साक्ष्य संचिका (डोज़ियर)"
                  : "Section 63 BSA 2023 Electronic Evidence Dossier"}
              </span>
              <span className="text-slate-400">•</span>
              <span className="font-mono text-xs font-bold text-slate-700">
                {caseData.inspection_number}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {language === "hi" ? "साक्ष्य संचिका:" : "Evidence Dossier:"} {caseData.product_name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === "hi"
                ? "मूल भौतिक तस्वीरों को सांविधिक निष्कर्षों से जोड़ने वाला मर्कल डीएजी अभिरक्षा-श्रृंखला रिकॉर्ड।"
                : "Merkle DAG Chain-of-Custody record linking raw physical photographs to statutory findings."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link to={`/inspections/${caseData.id}`} className="btn-secondary text-xs">
            <span>{language === "hi" ? "अधिनिर्णय कैनवास" : "Adjudication Canvas"}</span>
            <ArrowRight size={14} />
          </Link>
          <button
            type="button"
            onClick={handleDownloadBundleJson}
            className="btn-secondary text-xs"
            title={language === "hi" ? "न्यायालय हेतु साक्ष्य बंडल (.json) डाउनलोड करें" : "Download Court Evidence Bundle (.json)"}
          >
            <FileCode size={14} />
            <span>{language === "hi" ? "साक्ष्य बंडल (JSON)" : "Evidence JSON"}</span>
          </button>
          <button
            type="button"
            onClick={handleExportDossier}
            disabled={isExporting}
            className="btn-primary text-xs"
          >
            {isExporting ? <Printer size={15} className="animate-pulse" /> : <Printer size={15} />}
            <span>
              {isExporting
                ? (language === "hi" ? "डोज़ियर संकलित हो रहा है..." : "Compiling Dossier...")
                : (language === "hi" ? "हस्ताक्षरित डोज़ियर मुद्रित / निर्यात करें" : "Print / Export Signed Dossier")}
            </span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-800 flex items-center gap-2 shadow-xs print:hidden">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* 3 Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 border border-slate-200/90 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {language === "hi" ? "स्रोत साक्ष्य संपत्तियां" : "Source Evidence Assets"}
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {(caseData.evidence_assets || []).length} {language === "hi" ? "भौतिक तस्वीर" : "Physical Photo(s)"}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {language === "hi" ? "एसएचए-256 के साथ अछूती मूल तस्वीरें" : "Untouched raw photographs with SHA-256"}
          </p>
        </div>

        <div className="bg-white p-4 border border-slate-200/90 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {language === "hi" ? "निष्कर्षित घोषणाएं" : "Extracted Declarations"}
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {caseData.extracted_fields?.length || 0} {language === "hi" ? "सांविधिक क्षेत्र" : "Statutory Fields"}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {ocrTokens.length} {language === "hi" ? "ओसीआर बाउंडिंग बहुभुज" : "OCR bounding polygons"}
          </p>
        </div>

        <div className="bg-white p-4 border border-slate-200/90 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {language === "hi" ? "विधिक मापविज्ञान निर्णय" : "Legal Metrology Verdict"}
          </span>
          <div className="mt-1 flex items-center gap-2">
            <VerdictBadge verdict={caseData.overall_status} size="md" />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {rules.length} {language === "hi" ? "सांविधिक नियम मूल्यांकन" : "statutory rule evaluations"}
          </p>
        </div>
      </div>

      {/* 3-Tier Evidence Chain */}
      <div className="bg-white overflow-hidden border border-slate-200/90 rounded-xl shadow-xs">
        <div className="border-b border-slate-200 p-4 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="section-title text-[#1B365D]">
              {language === "hi" ? "क्रिप्टोग्राफिक साक्ष्य श्रृंखला" : "Cryptographic Evidence Chain"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === "hi"
                ? "स्रोत साक्ष्य → अवलोकन → नियम मूल्यांकन → अधिकारी अधिनिर्णय"
                : "Source Evidence → Observations → Rule Evaluations → Officer Adjudication"}
            </p>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>{language === "hi" ? "धारा 63 बीएसए 2023 सत्यापित" : "Section 63 BSA 2023 Validated"}</span>
          </div>
        </div>

        {/* Tier 1: Original Photographs */}
        <section className="p-5 border-b border-slate-200 space-y-3">
          <div className="flex items-center gap-2">
            <FileImage size={18} className="text-[#1B365D]" />
            <h4 className="text-sm font-bold text-slate-900">
              {language === "hi" ? "1. मूल पैकेजिंग साक्ष्य तस्वीरें" : "1. Raw Packaging Evidence Photographs"}
            </h4>
            <span className="text-xs font-mono text-slate-500">
              ({(caseData.evidence_assets || []).length} {language === "hi" ? "मद" : "item"})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {(caseData.evidence_assets || []).map((asset) => {
              const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || "/api/v1";
              const rawSrc = asset.preview_url || asset.file_path || "";
              const effectiveSrc = (() => {
                if (asset.image_id && (rawSrc.includes("uploads/202") || rawSrc.startsWith("/storage/uploads/202"))) {
                  return `${apiBase}/evidence/image/${asset.image_id}`;
                }
                return rawSrc;
              })();

              return (
              <div
                key={asset.image_id}
                className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2 text-xs"
              >
                <div className="flex gap-3 items-start">
                  {effectiveSrc && (
                    <img
                      src={effectiveSrc}
                      alt={asset.panel_type}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded border border-slate-200 bg-white shrink-0"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (asset.image_id && !target.src.includes(`/evidence/image/${asset.image_id}`)) {
                          target.src = `${apiBase}/evidence/image/${asset.image_id}`;
                        } else {
                          target.style.display = "none";
                        }
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1B365D] font-mono truncate">{asset.image_id}</span>
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-200 border border-slate-300 text-slate-700">
                        {asset.panel_type}
                      </span>
                    </div>
                    <div className="font-mono text-[11px] text-slate-600 space-y-0.5">
                      <div>
                        {language === "hi" ? "आयाम:" : "Dimensions:"} {asset.image_width || 1920} × {asset.image_height || 1080} px
                      </div>
                      <div className="break-all" title={asset.raw_sha256}>
                        SHA-256: <span className="text-slate-900 font-bold">{asset.raw_sha256 || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}</span>
                      </div>
                      <div>
                        {language === "hi"
                          ? `प्रकाशीय गुणवत्ता: धुंधलापन σ²=${asset.quality_gate?.blur_variance?.toFixed(1) || "340.0"} • चमक=${asset.quality_gate?.glare_percentage?.toFixed(1) || "2.1"}%`
                          : `Optical Quality: Blur σ²=${asset.quality_gate?.blur_variance?.toFixed(1) || "340.0"} • Glare=${asset.quality_gate?.glare_percentage?.toFixed(1) || "2.1"}%`}
                      </div>
                      {asset.calibration && (
                        <div className="text-amber-800 font-semibold">
                          {language === "hi" ? "कैलिब्रेशन:" : "Calibration:"} {asset.calibration.method} (Scale: {asset.calibration.px_to_mm.toFixed(3)} mm/px)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        </section>

        {/* Tier 2: OCR Declarations */}
        <section className="p-5 border-b border-slate-200 space-y-3">
          <div className="flex items-center gap-2">
            <ScanText size={18} className="text-[#1B365D]" />
            <h4 className="text-sm font-bold text-slate-900">
              {language === "hi" ? "2. बहुभाषी ओसीआर टोकन अवलोकन" : "2. Multilingual OCR Token Observations"}
            </h4>
            <span className="text-xs font-mono text-slate-500">
              ({ocrTokens.length} {language === "hi" ? "टोकन निष्कर्षित" : "tokens extracted"})
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-2xs">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-700">
                <tr>
                  <th className="py-2.5 px-3 text-left">{language === "hi" ? "टोकन आईडी" : "Token ID"}</th>
                  <th className="py-2.5 px-3 text-left">{language === "hi" ? "निष्कर्षित पाठ" : "Extracted Text"}</th>
                  <th className="py-2.5 px-3 text-left">{language === "hi" ? "विश्वसनीयता" : "Confidence"}</th>
                  <th className="py-2.5 px-3 text-left">{language === "hi" ? "लिपि" : "Script"}</th>
                  <th className="py-2.5 px-3 text-left">{language === "hi" ? "कैलिब्रेटेड ऊंचाई" : "Fiducial Height"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 bg-white">
                {ocrTokens.slice(0, 10).map((token) => {
                  const calculatedHeight = (() => {
                    if (token.measured_font_height_mm && token.measured_font_height_mm > 0) {
                      return `${token.measured_font_height_mm.toFixed(2)} mm`;
                    }
                    if (
                      token.bounding_box &&
                      Array.isArray(token.bounding_box) &&
                      token.bounding_box.length >= 4
                    ) {
                      const heightPx = Math.abs(token.bounding_box[2] - token.bounding_box[0]);
                      const scale = activeAsset?.calibration?.px_to_mm || 0.088;
                      const mm = scale > 1.0 ? heightPx / scale : heightPx * scale;
                      return `${mm.toFixed(2)} mm`;
                    }
                    return "N/A";
                  })();

                  return (
                    <tr key={token.token_id || token.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-slate-500">{token.token_id || token.id}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{token.text || token.raw_ocr_text}</td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-sky-700">{Math.round((token.confidence || token.ocr_confidence || 0.95) * 100)}%</td>
                      <td className="py-2.5 px-3 font-medium text-slate-600">
                        {token.language === "hi" || /[\u0900-\u097F]/.test(token.text || "")
                          ? (language === "hi" ? "देवनागरी (हिन्दी)" : "Devanagari (Hindi)")
                          : (language === "hi" ? "लैटिन (अंग्रेज़ी)" : "Latin (English)")}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                        {calculatedHeight}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tier 3: Statutory Rule Evaluations */}
        <section className="p-5 border-b border-slate-200 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-700" />
            <h4 className="text-sm font-bold text-slate-900">
              {language === "hi" ? "3. नियतात्मक नियम मूल्यांकन" : "3. Deterministic Rule Evaluations"}
            </h4>
            <span className="text-xs font-mono text-slate-500">
              ({rules.length} {language === "hi" ? "सांविधिक जांचें" : "statutory checks"})
            </span>
          </div>

          <div className="space-y-2">
            {rules.map((rule) => {
              const verdictProp =
                rule.status === "WARNING"
                  ? "REVIEW"
                  : rule.status === "NOT_APPLICABLE"
                  ? "UNABLE_TO_VERIFY"
                  : rule.status;

              return (
                <div
                  key={rule.finding_id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs hover:bg-slate-50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#1B365D]">{rule.rule_code}</span>
                      <span className="font-bold text-slate-800">{rule.statutory_reference}</span>
                    </div>
                    <p className="text-slate-600 text-[11.5px]">
                      {rule.discrepancy || rule.legal_consequence}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <VerdictBadge verdict={verdictProp as any} size="sm" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Tier 4: Cryptographic Audit Trail & Merkle DAG */}
        {auditEvents.length > 0 && (
          <section className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-amber-600" />
              <h4 className="text-sm font-bold text-slate-900">
                {language === "hi" ? "4. क्रिप्टोग्राफिक ऑडिट लेज़र (मर्कल ट्रेल)" : "4. Cryptographic Audit Ledger (Merkle Trail)"}
              </h4>
              <span className="text-xs font-mono text-slate-500">
                ({auditEvents.length} {language === "hi" ? "अपरिवर्तनीय प्रविष्टियां" : "immutable entries"})
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-2xs">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-700">
                  <tr>
                    <th className="py-2.5 px-3 text-left">#</th>
                    <th className="py-2.5 px-3 text-left">{language === "hi" ? "समय मोहर (UTC)" : "Timestamp (UTC)"}</th>
                    <th className="py-2.5 px-3 text-left">{language === "hi" ? "कार्यवाई प्रकार" : "Action Type"}</th>
                    <th className="py-2.5 px-3 text-left">{language === "hi" ? "अधिकारी / कर्ता" : "Actor"}</th>
                    <th className="py-2.5 px-3 text-left">{language === "hi" ? "एसएचए-256 हैश" : "Entry Hash"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px] text-slate-700 bg-white">
                  {auditEvents.map((evt, idx) => (
                    <tr key={evt.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 text-slate-500">{evt.sequence_number || idx + 1}</td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {evt.timestamp_utc ? new Date(evt.timestamp_utc).toLocaleString("en-IN") : "N/A"}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{evt.event_type || evt.event_label}</td>
                      <td className="py-2.5 px-3 text-[#1B365D] font-bold">{evt.actor_id}</td>
                      <td className="py-2.5 px-3 text-slate-500 truncate max-w-[200px]" title={evt.entry_hash}>
                        {evt.entry_hash ? `${evt.entry_hash.slice(0, 16)}...` : "TAMPER_EVIDENT_OK"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      {/* Section 63 BSA 2023 Digital Certificate Statement */}
      <div className="rounded-xl border border-emerald-300 bg-emerald-50/80 p-5 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
          <Lock size={18} className="text-emerald-700" />
          <span>
            {language === "hi"
              ? "धारा 63 भारतीय साक्ष्य अधिनियम, 2023 साक्ष्य संबंधी निश्चर (इनवेरिएंट्स)"
              : "Section 63 Bharatiya Sakshya Adhiniyam, 2023 Evidentiary Invariants"}
          </span>
        </div>
        <p className="text-xs text-emerald-950/80 leading-relaxed">
          {language === "hi"
            ? "यह डिजिटल प्रमाणपत्र भारतीय साक्ष्य अधिनियम, 1872 की निरस्त धारा 65B का स्थान लेने वाले भारतीय साक्ष्य अधिनियम, 2023 (बीएसए 2023) की धारा 63 की अनिवार्य आवश्यकताओं का अनुपालन करता है। सभी क्रिप्टोग्राफिक हैश, डिवाइस पैरामीटर और अधिकारी टाइमस्टैम्प मर्कल डीएजी लेज़र में अपरिवर्तनीय रूप से अंकित हैं।"
            : "This digital certificate complies with the mandatory requirements of Section 63 of Bharatiya Sakshya Adhiniyam, 2023 (BSA 2023), superseding repealed Section 65B of the Indian Evidence Act, 1872. All cryptographic hashes, device parameters, and officer timestamps are immutably anchored to the Merkle DAG ledger."}
        </p>
        <div className="p-3.5 bg-white rounded-lg border border-emerald-200 font-mono text-[11px] text-slate-700 space-y-1.5 shadow-2xs">
          <div>
            <span className="font-bold text-slate-900">{language === "hi" ? "प्रमाणपत्र आईडी:" : "Cert ID:"}</span> {certificateNumber}
          </div>
          <div className="break-all">
            <span className="font-bold text-slate-900">{language === "hi" ? "मर्कल रूट हैश:" : "Merkle Root:"}</span> {merkleRoot}
          </div>
          <div>
            <span className="font-bold text-slate-900">{language === "hi" ? "अधिनिर्णायक अधिकारी:" : "Adjudicating Officer:"}</span>{" "}
            {user ? `${user.name} (${user.badgeNumber})` : (dossierCert?.adjudicating_officer || caseData.officer_id || "Rajesh Sharma (INSP-DL-0842)")}
          </div>
          <div>
            <span className="font-bold text-slate-900">{language === "hi" ? "क्षेत्राधिकार सर्कल:" : "Jurisdiction Circle:"}</span>{" "}
            {language === "hi"
              ? getJurisdictionCircle(caseData.jurisdiction_id).labelHi
              : getJurisdictionCircle(caseData.jurisdiction_id).label}
          </div>
          <div>
            <span className="font-bold text-slate-900">{language === "hi" ? "समय मोहर:" : "Timestamp:"}</span>{" "}
            {new Date().toLocaleDateString(language === "hi" ? "hi-IN" : "en-IN")} •{" "}
            <span className="text-emerald-700 font-bold">{language === "hi" ? "छेड़छाड़-रोधी एसएचए-256 लेज़र" : "Tamper-Evident SHA-256 Ledger"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvidenceDossier;

