import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ApiService } from "../services/api";
import { InspectionSummary, InspectionCase } from "../types/inspection";
import { CaseRegistry } from "../features/desk/CaseRegistry";
import { NewInspectionModal } from "../features/new-inspection/NewInspectionModal";
import { useCircle } from "../context/CircleContext";
import { resetScrollToTop } from "../components/common/ScrollToTop";

export const CaseRegistryPage: React.FC = () => {
  const [cases, setCases] = useState<InspectionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { activeCircle } = useCircle();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const loadCases = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await ApiService.listInspections({
        circleId: activeCircle && activeCircle !== "ALL" ? activeCircle : undefined,
      });
      setCases(res.items);
    } catch (err) {
      console.error("Failed to load cases:", err);
    } finally {
      setIsLoading(false);
    }
  }, [activeCircle]);

  useEffect(() => {
    loadCases();
    window.addEventListener("nirikshak_data_updated", loadCases);
    return () => window.removeEventListener("nirikshak_data_updated", loadCases);
  }, [loadCases]);

  const handleSelectCase = (caseId: string) => {
    resetScrollToTop();
    navigate(`/inspections/${caseId}`);
  };

  const handleCaseCreated = (newCase: InspectionCase) => {
    setIsModalOpen(false);
    resetScrollToTop();
    navigate(`/inspections/${newCase.id}`);
  };

  const handleDeleteCase = async (caseId: string) => {
    // 1. Instant optimistic UI removal
    setCases((prev) => prev.filter((c) => c.id !== caseId && c.inspection_number !== caseId));
    try {
      await ApiService.deleteInspection(caseId);
    } catch (err) {
      console.error("Failed to delete case:", err);
    } finally {
      await loadCases();
    }
  };

  return (
    <div className="space-y-4">
      <CaseRegistry
        cases={cases}
        activeCircle={activeCircle}
        onSelectCase={handleSelectCase}
        onNewInspectionClick={() => navigate("/inspections/new")}
        isLoading={isLoading}
        onRefresh={loadCases}
        onDeleteCase={handleDeleteCase}
      />

      <NewInspectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultCircleId={activeCircle}
        onSuccess={handleCaseCreated}
      />
    </div>
  );
};

export default CaseRegistryPage;
