import React from "react";
import { m, type Variants } from "framer-motion";
import { resetScrollToTop } from "./ScrollToTop";

/**
 * Shared motion system, "Corporate" personality per the motion design doctrine:
 * MD3 standard easing cubic-bezier(0.2, 0, 0, 1), entrances use MD3 Emphasized,
 * durations 200-400ms, stagger budgets under 400ms, zero gratuitous overshoot.
 * All components honour prefers-reduced-motion via MotionConfig in main.tsx.
 */

export const EASE_STANDARD: [number, number, number, number] = [0.2, 0, 0, 1];
export const EASE_EMPHASIZED: [number, number, number, number] = [0.05, 0.7, 0.1, 1];

/** Route-level entrance/exit. Entrances slightly longer than exits. */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: EASE_STANDARD },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.16, ease: EASE_STANDARD },
  },
};

/** Scroll-into-view entrance for sections and cards. */
export const revealVariants: Variants = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: EASE_EMPHASIZED },
  },
};

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger slot in seconds (keep total cascade under 400ms). */
  delay?: number;
  as?: "div" | "section" | "li" | "article";
}

/** Fades-and-rises content into view the first time it enters the viewport. */
export const Reveal: React.FC<RevealProps> = ({ children, className, delay = 0, as = "div" }) => {
  const Tag = m[as];
  return (
    <Tag
      className={className}
      variants={revealVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ delay: Math.min(delay, 0.3) }}
    >
      {children}
    </Tag>
  );
};

/**
 * Wraps a routed page element. Used as the direct child of each <Route>;
 * exit runs via variant propagation while <AnimatePresence> holds the old
 * <Routes key={pathname}> subtree during the transition.
 */
export const AnimatedPage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  React.useLayoutEffect(() => {
    resetScrollToTop();
  }, []);

  React.useEffect(() => {
    resetScrollToTop();
    const raf = requestAnimationFrame(() => resetScrollToTop());
    const t1 = setTimeout(() => resetScrollToTop(), 60);
    const t2 = setTimeout(() => resetScrollToTop(), 180);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <m.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="animated-page print:transform-none print:overflow-visible print:h-auto print:block"
    >
      {children}
    </m.div>
  );
};
