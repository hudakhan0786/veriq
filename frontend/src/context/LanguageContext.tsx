import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  fontSize: "sm" | "md" | "lg";
  setFontSize: (size: "sm" | "md" | "lg") => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  toggleHighContrast: () => void;
  t: (key: string, defaultText: string) => string;
}

import { DICTIONARY } from "./translations";


const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem("Nirikshak_lang") as Language) || "en";
  });

  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">("md");
  const [highContrast, setHighContrast] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("Nirikshak_lang", language);
  }, [language]);

  // Adjust root HTML font size based on A- / A / A+
  useEffect(() => {
    const root = document.documentElement;
    if (fontSize === "sm") {
      root.style.fontSize = "14.5px";
    } else if (fontSize === "lg") {
      root.style.fontSize = "17.5px";
    } else {
      root.style.fontSize = "16px";
    }
  }, [fontSize]);

  // High contrast mode class
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add("high-contrast-mode");
    } else {
      document.documentElement.classList.remove("high-contrast-mode");
    }
  }, [highContrast]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "hi" : "en"));
  };

  const toggleHighContrast = () => {
    setHighContrast((prev) => !prev);
  };

  const t = (key: string, defaultText: string): string => {
    const entry = DICTIONARY[key];
    if (!entry) return defaultText;
    return entry[language] || defaultText;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        toggleHighContrast,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: "en",
      setLanguage: () => {},
      toggleLanguage: () => {},
      fontSize: "md",
      setFontSize: () => {},
      highContrast: false,
      setHighContrast: () => {},
      toggleHighContrast: () => {},
      t: (key: string, defaultText: string) => defaultText || key,
    };
  }
  return context;
};
