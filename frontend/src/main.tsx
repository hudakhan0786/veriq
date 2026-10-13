import React from "react";
import ReactDOM from "react-dom/client";
import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    {/* LazyMotion keeps the motion bundle lean; MotionConfig honours the
        user's prefers-reduced-motion setting across every animation. */}
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </LazyMotion>
  </React.StrictMode>
);
