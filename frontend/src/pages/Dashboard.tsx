import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowRight, Check, Clock3, Plus, RefreshCw } from "lucide-react";
import { ApiService } from "../services/api";
import { InspectionSummary } from "../types/inspection";
import { useAuth } from "../context/AuthContext";
import { useCircle } from "../context/CircleContext";

type Filter = "ALL" | "REVIEW" | "FAIL";

const needsReview = (item: InspectionSummary) =>
  !item.adjudicated && ["REVIEW", "UNABLE_TO_VERIFY", "PENDING_REVIEW", "PENDING", "FAIL"].includes(item.overall_status);

const statusLabel = (item: InspectionSummary) => {
  if (item.overall_status === "PASS" || (item.overall_status === "COMPLETED" && item.ai_verdict !== "FAIL")) return "Compliant";
  if (item.overall_status === "FAIL") return "Finding recorded";
  if (item.overall_status === "UNABLE_TO_VERIFY") return "Needs new evidence";
  if (needsReview(item)) return "Needs review";
  if (item.overall_status === "COMPLETED") return "Complete";
  return "In progress";
};

const displayProduct = (item: InspectionSummary) => {
  if (item.product_name && !item.product_name.toLowerCase().includes("unlabeled")) return item.product_name;
  return item.establishment_name || "Packaged product";
};

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { activeCircle } = useCircle();
  const navigate = useNavigate();
  const [cases, setCases] = useState<InspectionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [filter, setFilter] = useState<Filter>("ALL");

  const loadCases = useCallback(async () => {
    setLoadFailed(false);
    try {
      const result = await ApiService.listInspections({ circleId: activeCircle });
      setCases(result.items);
    } catch (error) {
      console.error("Failed to load inspections:", error);
      setLoadFailed(true);
    } finally {
      setIsLoading(false);
    }
  }, [activeCircle]);

  useEffect(() => {
    void loadCases();
    window.addEventListener("nirikshak_data_updated", loadCases);
    return () => window.removeEventListener("nirikshak_data_updated", loadCases);
  }, [loadCases]);

  const orderedCases = useMemo(
    () => [...cases].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [cases]
  );
  const reviewCases = useMemo(() => orderedCases.filter(needsReview), [orderedCases]);
  const findingCases = useMemo(
    () => orderedCases.filter((item) => item.overall_status === "FAIL" || (item.violations_count ?? 0) > 0),
    [orderedCases]
  );
  const compliantCases = useMemo(
    () => orderedCases.filter((item) => item.overall_status === "PASS" || (item.overall_status === "COMPLETED" && item.ai_verdict !== "FAIL")),
    [orderedCases]
  );
  const recentCases = useMemo(
    () => orderedCases.filter((item) => Date.now() - new Date(item.created_at).getTime() <= 7 * 24 * 60 * 60 * 1000),
    [orderedCases]
  );
  const visibleCases = filter === "REVIEW" ? reviewCases : filter === "FAIL" ? findingCases : orderedCases;
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="veriq-dashboard">
      <section className="veriq-dashboard-heading">
        <div>
          <p className="veriq-eyebrow">Inspection desk</p>
          <h1>{greeting}{user?.name ? `, ${user.name.split(" ")[0]}` : ""}</h1>
          <p className="veriq-page-description">Your inspections, evidence and reviews in one place.</p>
        </div>
        <div className="veriq-dashboard-actions">
          <button type="button" className="veriq-button veriq-button-secondary" onClick={() => void loadCases()}>
            <RefreshCw size={15} /> Refresh
          </button>
          <Link to="/inspections/new" className="veriq-button veriq-button-primary">
            <Plus size={16} /> New inspection
          </Link>
        </div>
      </section>

      <section className="veriq-summary-grid" aria-label="Inspection totals">
        <article className="veriq-summary-item">
          <span className="veriq-summary-label">All inspections</span>
          <strong>{isLoading ? "..." : cases.length}</strong>
          <span className="veriq-summary-note">In this area</span>
        </article>
        <article className="veriq-summary-item">
          <span className="veriq-summary-label">Needs review</span>
          <strong>{isLoading ? "..." : reviewCases.length}</strong>
          <span className="veriq-summary-note">Officer action pending</span>
        </article>
        <article className="veriq-summary-item">
          <span className="veriq-summary-label">Findings</span>
          <strong>{isLoading ? "..." : findingCases.length}</strong>
          <span className="veriq-summary-note">Recorded for review</span>
        </article>
        <article className="veriq-summary-item">
          <span className="veriq-summary-label">Compliant</span>
          <strong>{isLoading ? "..." : compliantCases.length}</strong>
          <span className="veriq-summary-note">Completed without findings</span>
        </article>
      </section>

      <section className="veriq-case-section">
        <div className="veriq-section-heading">
          <div>
            <h2>Recent inspections</h2>
            <p>Activity from the last seven days: {recentCases.length}</p>
          </div>
          <Link className="veriq-text-link" to="/inspections">Open case register <ArrowRight size={15} /></Link>
        </div>

        <div className="veriq-filter-row" role="group" aria-label="Filter inspections">
          {(["ALL", "REVIEW", "FAIL"] as Filter[]).map((value) => (
            <button
              key={value}
              type="button"
              className={`veriq-filter ${filter === value ? "is-selected" : ""}`}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {value === "ALL" ? "All cases" : value === "REVIEW" ? "Needs review" : "Findings"}
            </button>
          ))}
        </div>

        {loadFailed ? (
          <div className="veriq-empty-state" role="alert">
            <AlertTriangle size={20} />
            <strong>Inspections could not be loaded</strong>
            <span>Check the connection and try again.</span>
            <button type="button" className="veriq-button veriq-button-secondary" onClick={() => void loadCases()}>Try again</button>
          </div>
        ) : isLoading ? (
          <div className="veriq-loading-rows" aria-label="Loading inspections" aria-busy="true">
            {[0, 1, 2].map((item) => <div key={item} />)}
          </div>
        ) : visibleCases.length === 0 ? (
          <div className="veriq-empty-state" role="status">
            <ClipboardEmptyIcon />
            <strong>{filter === "ALL" ? "No inspections yet" : "No matching inspections"}</strong>
            <span>{filter === "ALL" ? "Start a record when you are ready to inspect a product." : "Try another filter to see more cases."}</span>
            {filter === "ALL" && <Link to="/inspections/new" className="veriq-text-link">Start an inspection <ArrowRight size={15} /></Link>}
          </div>
        ) : (
          <div className="veriq-table-wrap">
            <table className="veriq-case-table">
              <thead>
                <tr><th>Case</th><th>Product or premises</th><th>Location</th><th>Opened</th><th>Status</th><th><span className="sr-only">Open case</span></th></tr>
              </thead>
              <tbody>
                {visibleCases.slice(0, 8).map((item) => {
                  const status = statusLabel(item);
                  return (
                    <tr key={item.id} onClick={() => navigate(`/inspections/${item.id}`)}>
                      <td className="veriq-case-id">{item.inspection_number || item.id}</td>
                      <td><strong>{displayProduct(item)}</strong><span>{item.brand_name || item.category?.replace(/_/g, " ") || "Packaged commodity"}</span></td>
                      <td>{item.location || item.establishment_name || "Location not recorded"}</td>
                      <td>{new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(item.created_at))}</td>
                      <td><span className={`veriq-status veriq-status-${status.replace(/ /g, "-").toLowerCase()}`}>
                        {status === "Compliant" ? <Check size={13} /> : status === "Needs review" ? <Clock3 size={13} /> : null}{status}
                      </span></td>
                      <td><Link to={`/inspections/${item.id}`} className="veriq-row-link" aria-label={`Open ${item.inspection_number || item.id}`}><ArrowRight size={16} /></Link></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

const ClipboardEmptyIcon: React.FC = () => <span className="veriq-empty-icon"><Clock3 size={20} /></span>;

export default Dashboard;
