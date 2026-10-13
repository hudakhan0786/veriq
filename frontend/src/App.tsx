import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { CircleProvider } from "./context/CircleContext";
import { AppShell } from "./components/layout/AppShell";
import { AnimatedPage } from "./components/common/motion";
import { ScrollToTop, resetScrollToTop } from "./components/common/ScrollToTop";
import { PageSkeleton } from "./components/common/LoadingSkeleton";

// Route-Level Code Splitting: Lazy-load all pages to ensure minimal initial bundle size
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CaseRegistryPage = lazy(() => import("./pages/CaseRegistryPage"));
const NewInspection = lazy(() => import("./pages/NewInspection"));
const InspectionDetails = lazy(() => import("./pages/InspectionDetails"));
const EvidenceDossier = lazy(() => import("./pages/EvidenceDossier"));
const ReviewQueue = lazy(() => import("./pages/ReviewQueue"));
const Rules = lazy(() => import("./pages/Rules"));
const Reports = lazy(() => import("./pages/Reports"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const DemoSuite = lazy(() => import("./pages/DemoSuite"));
const StatutoryDocumentPage = lazy(() => import("./pages/statutory/StatutoryDocumentPage"));
import { LEGAL_DOCS, docBasePath } from "./pages/statutory/legalDocRegistry";

// Protected Workstation Route Wrapper
const ProtectedWorkstation: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return (
    <AppShell>
      <Suspense fallback={<PageSkeleton />}>
        <AnimatedPage>{children}</AnimatedPage>
      </Suspense>
    </AppShell>
  );
};

// Route transitions: the keyed Routes keeps the outgoing page mounted just
// long enough for its exit variant to play (AnimatePresence mode="wait").
const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" onExitComplete={() => resetScrollToTop()}>
      <Suspense fallback={<PageSkeleton />}>
        <Routes location={location} key={location.pathname}>
          {/* Public Portal & Login */}
          <Route path="/" element={<AnimatedPage><Landing /></AnimatedPage>} />
          <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />

          {/* GIGW 3.0 Governed Document Pages â€” Statutory Enactments, Policies & Standards */}
          {LEGAL_DOCS.map((doc) => (
            <Route
              key={doc.slug}
              path={`${docBasePath(doc.category)}/${doc.slug}`}
              element={<AnimatedPage><StatutoryDocumentPage slug={doc.slug} /></AnimatedPage>}
            />
          ))}

          {/* Authenticated Inspection Workstation */}
          <Route
            path="/dashboard"
            element={
              <ProtectedWorkstation>
                <Dashboard />
              </ProtectedWorkstation>
            }
          />
          <Route
            path="/inspections"
            element={
              <ProtectedWorkstation>
                <CaseRegistryPage />
              </ProtectedWorkstation>
            }
          />
          <Route
            path="/inspections/new"
            element={
              <ProtectedWorkstation>
                <NewInspection />
              </ProtectedWorkstation>
            }
          />
          <Route
            path="/inspections/:id"
            element={
              <ProtectedWorkstation>
                <InspectionDetails />
              </ProtectedWorkstation>
            }
          />
          <Route
            path="/inspections/:id/evidence"
            element={
              <ProtectedWorkstation>
                <EvidenceDossier />
              </ProtectedWorkstation>
            }
          />
          <Route
            path="/review-queue"
            element={
              <ProtectedWorkstation>
                <ReviewQueue />
              </ProtectedWorkstation>
            }
          />
          <Route
            path="/rules"
            element={<AnimatedPage><Rules /></AnimatedPage>}
          />
          <Route
            path="/reports"
            element={
              <ProtectedWorkstation>
                <Reports />
              </ProtectedWorkstation>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedWorkstation>
                <Settings />
              </ProtectedWorkstation>
            }
          />
          <Route
            path="/demo"
            element={
              <ProtectedWorkstation>
                <DemoSuite />
              </ProtectedWorkstation>
            }
          />

          <Route path="/unauthorized" element={<AnimatedPage><Unauthorized /></AnimatedPage>} />
          <Route path="/404" element={<AnimatedPage><NotFound /></AnimatedPage>} />

          {/* Fallback 404 Not Found Page */}
          <Route path="*" element={<AnimatedPage><NotFound /></AnimatedPage>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <LanguageProvider>
        <AuthProvider>
          <CircleProvider>
            <AnimatedRoutes />
          </CircleProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default App;
