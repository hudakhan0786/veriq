import React, { useEffect, useRef } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { m, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "xl",
}) => {
  const { language } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
  }[maxWidth];

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
          onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <m.div
            ref={modalRef}
            className={`relative w-full ${maxWidthClasses} rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl transition-all my-auto max-h-[calc(100dvh-2rem)] flex flex-col overflow-hidden`}
            variants={{
              hidden: { opacity: 0, scale: 0.95, y: 8 },
              visible: {
                opacity: 1,
                scale: 1,
                y: 0,
                transition: { duration: 0.18, ease: [0.05, 0.7, 0.1, 1] },
              },
            }}
          >
            {/* National Tricolor Top Accent */}
            <div className="h-1 bg-gradient-to-r from-[#ff9933] via-white to-[#138808] w-full shrink-0" />

            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 px-5 sm:px-6 py-3.5 sm:py-4 bg-slate-50 shrink-0">
              <div>
                <h2 id="modal-headline" className="text-base font-bold text-slate-900 tracking-tight">
                  {title}
                </h2>
                {subtitle && (
                  <p className="mt-0.5 text-xs text-slate-500 font-normal">
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={language === "hi" ? "संवाद बंद करें" : "Close dialog"}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B365D] transition-colors shrink-0"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto px-5 sm:px-6 py-4 sm:py-5 flex-1 min-h-0 bg-white text-slate-800 custom-scrollbar">{children}</div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
};
