import React from "react";
import { InspectionCase, EvidenceAsset } from "../../types/inspection";
import { useLanguage } from "../../context/LanguageContext";

interface EvidenceProvenancePanelProps {
  caseData: InspectionCase;
  activeAsset?: EvidenceAsset;
  onSelectFinding?: (findingId: string) => void;
}

export const EvidenceProvenancePanel: React.FC<EvidenceProvenancePanelProps> = ({
  caseData,
  activeAsset,
}) => {
  const { language } = useLanguage();
  const asset = activeAsset || caseData.evidence_assets[0];
  const dagNodes = caseData.evidence_graph?.nodes || [];

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 sm:p-5 space-y-5">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-[#1B365D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B365D]">
            {language === "hi"
              ? "साक्ष्य उद्भव (स्रोत) एवं SHA-256 आर्टिफैक्ट श्रृंखला"
              : "Evidence Provenance & SHA-256 Artifact Chain"}
          </h3>
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
          {language === "hi"
            ? "बैकएंड-सत्यापित साक्ष्य अभिरक्षा श्रृंखला जो मूल भौतिक कैप्चर को व्युत्पन्न विश्लेषणात्मक परतों से अलग करती है।"
            : "Backend-verified evidentiary custody trail distinguishing original physical captures from derived analytical layers."}
        </p>
      </div>

      {/* Operational Non-Mutation Notice */}
      <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-[#1B365D] flex items-start gap-2.5 shadow-2xs">
        <svg className="w-4 h-4 text-[#1B365D] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="space-y-0.5">
          <span className="font-bold text-[#1B365D]">
            {language === "hi" ? "मूल साक्ष्य अखंडता संरक्षण:" : "Original Evidence Integrity Preservation:"}
          </span>
          <p className="text-[11px] text-slate-700 leading-relaxed">
            {language === "hi"
              ? "मूल साक्ष्य को स्वतंत्र रूप से संरक्षित किया जाता है; व्युत्पन्न एनोटेशन और विश्लेषण परतें मूल साक्ष्य आर्टिफैक्ट को अधिलेखित (ओवरराइट) नहीं करती हैं।"
              : "Original evidence is preserved independently; derived annotations and analysis layers do not overwrite the original evidence artifact."}
          </p>
        </div>
      </div>

      {/* 1. Original vs Derived Dual Column Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Original Evidence Card */}
        <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-2.5 text-xs shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
            <span className="font-bold text-slate-900 uppercase text-[11px] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              {language === "hi" ? "मूल साक्ष्य (अछूता)" : "Original Evidence (Untouched)"}
            </span>
            <span className="px-2 py-0.5 rounded bg-[#1B365D] text-white font-mono text-[10px] font-bold shadow-2xs">
              {language === "hi" ? "प्राथमिक स्रोत" : "PRIMARY SOURCE"}
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px] text-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-sans text-slate-500 font-medium">{language === "hi" ? "परिसंपत्ति संदर्भ:" : "Asset Reference:"}</span>
              <span className="font-bold text-slate-900">{asset?.image_id || (language === "hi" ? "अनिर्धारित" : "Unassigned")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-sans text-slate-500 font-medium">{language === "hi" ? "कैप्चर स्रोत:" : "Capture Source:"}</span>
              <span className="text-slate-800 font-semibold">
                {language === "hi" && caseData.capture_source === "PHYSICAL_FIELD"
                  ? "भौतिक क्षेत्र (फील्ड)"
                  : (caseData.capture_source || "PHYSICAL_FIELD")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-sans text-slate-500 font-medium">{language === "hi" ? "पैकेजिंग पहलू:" : "Packaging Facet:"}</span>
              <span className="text-slate-800 font-semibold">
                {language === "hi"
                  ? (asset?.panel_type === "PDP_FRONT"
                      ? "पीडीपी (मुख्य सम्मुख पैनल)"
                      : asset?.panel_type === "SIDE_PANEL"
                      ? "पार्श्व (साइड) पैनल"
                      : asset?.panel_type === "BACK_PANEL"
                      ? "पृष्ठ (बैक) पैनल"
                      : asset?.panel_type || "PDP_FRONT")
                  : (asset?.panel_type || "PDP_FRONT")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-sans text-slate-500 font-medium">{language === "hi" ? "मूल फ़ाइल नाम:" : "Original Filename:"}</span>
              <span className="text-slate-800 font-medium truncate max-w-[170px]" title={asset?.original_filename}>
                {asset?.original_filename || "packaging_pdp.jpg"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-sans text-slate-500 font-medium">{language === "hi" ? "रिज़ॉल्यूशन:" : "Resolution:"}</span>
              <span className="text-slate-800">{asset?.image_width} × {asset?.image_height} px</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-sans text-slate-500 font-medium">{language === "hi" ? "MIME प्रकार:" : "MIME Type:"}</span>
              <span className="text-slate-800">{asset?.mime_type || "image/jpeg"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-sans text-slate-500 font-medium">{language === "hi" ? "अछूता संरक्षित:" : "Preserved Untouched:"}</span>
              <span className="text-emerald-700 font-bold">
                {asset?.is_original_untouched !== false
                  ? (language === "hi" ? "हाँ (केवल-पठनीय)" : "YES (READ-ONLY)")
                  : (language === "hi" ? "नहीं" : "NO")}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <span className="font-sans text-slate-500 font-semibold block text-[10px] uppercase">
                {language === "hi" ? "प्रामाणिक SHA-256 (बैकएंड रिकॉर्ड):" : "Canonical SHA-256 (Backend Record):"}
              </span>
              <span className="text-slate-700 block truncate text-[10px] select-all bg-white p-1.5 rounded-lg border border-slate-200 mt-1 font-mono shadow-2xs" title={asset?.raw_sha256}>
                {asset?.raw_sha256 || (language === "hi" ? "लंबित हैश पंजीकरण" : "Pending hash registration")}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Derived Analytical Artifacts */}
        <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-2.5 text-xs shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
            <span className="font-bold text-slate-900 uppercase text-[11px] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              {language === "hi" ? "व्युत्पन्न विश्लेषणात्मक आर्टिफैक्ट" : "Derived Analytical Artifacts"}
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200 font-mono text-[10px] font-bold shadow-2xs">
              {language === "hi" ? "विश्लेषण परतें" : "ANALYSIS LAYERS"}
            </span>
          </div>

          <div className="space-y-1.5 text-[11px] text-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">{language === "hi" ? "प्रकाशीय गुणवत्ता द्वार:" : "Optical Quality Gate:"}</span>
              <span className={`font-mono font-bold ${asset?.quality_gate?.passed ? "text-emerald-700" : "text-amber-700"}`}>
                {asset?.quality_gate?.passed
                  ? (language === "hi" ? "उत्तीर्ण (PASSED)" : "PASSED")
                  : (language === "hi" ? "अस्वीकृत (सत्यापन में असमर्थ)" : "REJECTED (UNABLE_TO_VERIFY)")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">{language === "hi" ? "मीट्रिक पैमाना गुणक:" : "Metric Scale Factor:"}</span>
              <span className="font-mono text-slate-800 font-semibold">
                {asset?.calibration?.px_to_mm
                  ? `${asset.calibration.px_to_mm.toFixed(2)} px/mm`
                  : (language === "hi" ? "अपरिमित/अंशांकित नहीं" : "Uncalibrated")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">{language === "hi" ? "बहुभाषी ओसीआर टोकन:" : "Multilingual OCR Tokens:"}</span>
              <span className="font-mono text-slate-900 font-bold">
                {asset?.ocr?.total_tokens || asset?.ocr?.tokens?.length || 0} {language === "hi" ? "टोकन" : "tokens"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">{language === "hi" ? "ओसीआर इंजन उद्भव:" : "OCR Engine Provenance:"}</span>
              <span className="font-mono text-[10px] text-slate-700 font-medium">
                DBNet++ / PP-OCRv4 / PP-OCRv3
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">{language === "hi" ? "निष्कर्षित घोषणाएं:" : "Extracted Declarations:"}</span>
              <span className="font-mono text-slate-900 font-bold">
                {caseData.extracted_fields?.length || 0} {language === "hi" ? "फ़ील्ड" : "fields"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">{language === "hi" ? "नियम इंजन निर्धारण:" : "Rule Engine Determinations:"}</span>
              <span className="font-mono text-slate-900 font-bold">
                {caseData.rule_evaluations?.length || 0} {language === "hi" ? "निष्कर्ष" : "findings"}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-500 font-semibold block text-[10px] uppercase">
                {language === "hi" ? "अधिकारी न्यायिक निर्णय स्थिति:" : "Officer Adjudication Status:"}
              </span>
              <span className="font-mono font-bold text-[#1B365D] block mt-1">
                {caseData.adjudication
                  ? (language === "hi"
                      ? (caseData.adjudication.verdict === "CONFIRM_VIOLATION"
                          ? "उल्लंघन की पुष्टि (CONFIRM VIOLATION)"
                          : caseData.adjudication.verdict === "DISMISS_AS_COMPLIANT"
                          ? "अनुपालन के रूप में खारिज (DISMISS COMPLIANT)"
                          : caseData.adjudication.verdict === "REQUEST_RETEST"
                          ? "पुनः परीक्षण अनुरोध (REQUEST RETEST)"
                          : caseData.adjudication.verdict)
                      : caseData.adjudication.verdict)
                  : (language === "hi" ? "अधिकारी न्यायिक निर्णय की प्रतीक्षा" : "Awaiting Officer Adjudication")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Dynamic Evidence Graph / Merkle DAG */}
      <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div>
            <h4 className="text-xs font-bold uppercase text-[#1B365D]">
              {language === "hi"
                ? "गतिशील साक्ष्य ग्राफ़ (धारा 63 बीएसए 2023)"
                : "Dynamic Evidence Graph (Section 63 BSA 2023)"}
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">
              {language === "hi"
                ? "बैकएंड अनुबंध द्वारा प्रदान किए गए डेटा-संचालित पाइपलाइन नोड्स।"
                : "Data-driven pipeline nodes as provided by backend contract."}
            </p>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 font-bold border border-slate-200 shadow-2xs">
            {dagNodes.length} {language === "hi" ? "नोड्स जुड़े हुए" : "NODES LINKED"}
          </span>
        </div>

        {/* Dynamic Nodes Renderer (Supports 0 -> N nodes without fixed 7-node assumption) */}
        {dagNodes.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 italic bg-slate-50 rounded-xl border border-slate-200">
            {language === "hi"
              ? "इस निरीक्षण मामले हेतु अभी तक कोई साक्ष्य ग्राफ़ नोड्स प्रदान नहीं किए गए हैं।"
              : "No evidence graph nodes provided for this inspection case yet."}
          </div>
        ) : (
          <div className="space-y-2">
            {dagNodes.map((node, index) => (
              <div
                key={node.node_id || `node_${index}`}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-xs font-mono space-y-1.5 hover:bg-white hover:shadow-2xs transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1B365D] text-white flex items-center justify-center text-[10px] font-bold shadow-2xs">
                      {node.sequence_number || index + 1}
                    </span>
                    <span className="font-bold text-slate-900 text-xs">
                      {node.stage_name}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-500">
                    {node.timestamp_utc ? new Date(node.timestamp_utc).toLocaleTimeString(language === "hi" ? "hi-IN" : "en-IN") : ""}
                  </span>
                </div>

                <div className="text-[11px] text-slate-600 truncate bg-white p-1.5 rounded-lg border border-slate-200 shadow-2xs" title={node.payload_sha256}>
                  <span className="text-slate-500 select-none">SHA-256: </span>
                  <span className="text-slate-900 font-semibold">{node.payload_sha256}</span>
                </div>

                {node.metadata && Object.keys(node.metadata).length > 0 && (
                  <div className="text-[10px] text-slate-600 font-sans flex items-center gap-2 flex-wrap pt-0.5">
                    {Object.entries(node.metadata).map(([k, v]) => (
                      <span key={k} className="bg-slate-200/70 px-2 py-0.5 rounded text-slate-800 font-medium">
                        <span className="font-semibold">{k}:</span> {String(v)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Merkle Root Footer if supplied */}
        {caseData.evidence_graph?.merkle_root && (
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono flex items-center justify-between text-[11px] shadow-2xs">
            <span className="font-semibold text-slate-600">
              {language === "hi" ? "मर्कल उद्भव (रूट) मूल:" : "Merkle Provenance Root:"}
            </span>
            <span className="text-slate-900 font-bold truncate max-w-[260px]" title={caseData.evidence_graph.merkle_root}>
              {caseData.evidence_graph.merkle_root}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
