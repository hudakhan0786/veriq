import React, { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Universal scroll reset helper.
 * Unconditionally resets window, document, and all main scroll containers
 * to the exact top (0, 0) instantly.
 */
export const resetScrollToTop = () => {
  if (typeof window === "undefined") return;

  try {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  } catch {
    window.scrollTo(0, 0);
  }

  if (document.documentElement) {
    document.documentElement.scrollTop = 0;
  }
  if (document.body) {
    document.body.scrollTop = 0;
  }

  const main = document.getElementById("main-content");
  if (main) {
    main.scrollTop = 0;
  }

  // Also reset any scrollable work queue or table containers
  const scrollableContainers = document.querySelectorAll(".overflow-y-auto, [role='main']");
  scrollableContainers.forEach((container) => {
    (container as HTMLElement).scrollTop = 0;
  });
};

/**
 * Global ScrollToTop listener.
 * - Forces manual browser scroll restoration to eliminate browser scroll-memory jumping.
 * - Resets scroll to top immediately upon route, search, or case change.
 * - Gracefully scrolls to hash anchors if deep-linking is requested (e.g. #demo-showcase).
 */
export const ScrollToTop: React.FC = () => {
  const { pathname, search, hash } = useLocation();

  // Disable automatic browser scroll restoration on SPA navigations
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useLayoutEffect(() => {
    if (hash) {
      // Hash anchor deep-linking
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        const timer = setTimeout(() => {
          const delayedTarget = document.querySelector(hash);
          if (delayedTarget) {
            delayedTarget.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 150);
        return () => clearTimeout(timer);
      }
    } else {
      // Standard route navigation: force top
      resetScrollToTop();
    }
  }, [pathname, search, hash]);

  // Staggered checks to catch post-exit AnimatePresence paint, dynamic layout shifts and route transitions
  useEffect(() => {
    if (!hash) {
      resetScrollToTop();
      const raf = requestAnimationFrame(() => resetScrollToTop());
      const t1 = setTimeout(() => resetScrollToTop(), 50);
      const t2 = setTimeout(() => resetScrollToTop(), 150);
      const t3 = setTimeout(() => resetScrollToTop(), 300);
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [pathname, search, hash]);

  return null;
};
