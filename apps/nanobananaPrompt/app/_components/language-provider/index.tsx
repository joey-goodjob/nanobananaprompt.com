"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type LanguageOption = {
  code: string;
  label: string;
  locale: string;
};

type LanguageContextValue = {
  language: LanguageOption;
  setLanguage: (language: LanguageOption) => void;
  languages: LanguageOption[];
};

const languageOptions: LanguageOption[] = [
  { code: "zh-CN", label: "中文", locale: "zh" },
  { code: "en", label: "English", locale: "en" },
];

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

const COOKIE_NAME = "nanobanana-lang";

function getLanguageFromCookie(): LanguageOption | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;
  const code = match.split("=")[1];
  return languageOptions.find((opt) => opt.code === code) ?? null;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] =
    useState<LanguageOption>(languageOptions[0]);

  useEffect(() => {
    const stored = getLanguageFromCookie();
    if (stored) {
      setLanguageState(stored);
    }
  }, []);

  const updateLanguage = (nextLanguage: LanguageOption) => {
    setLanguageState(nextLanguage);
    if (typeof document !== "undefined") {
      document.cookie = `${COOKIE_NAME}=${nextLanguage.code}; path=/; max-age=31536000`;
    }
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage: updateLanguage,
      languages: languageOptions,
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
