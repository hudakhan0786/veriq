import React, { useEffect } from "react";
import { StatutoryDemoShowcase } from "../features/demo/StatutoryDemoShowcase";
import { resetScrollToTop } from "../components/common/ScrollToTop";

export const DemoSuite: React.FC = () => {
  useEffect(() => {
    resetScrollToTop();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <StatutoryDemoShowcase variant="full" />
    </div>
  );
};

export default DemoSuite;
