"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import en from "@/locales/en";
import ko from "@/locales/ko";

export const TranslationContext = createContext(null);

const translations = { ko, en };
const LANGUAGE_STORAGE_KEY = "atc-language";
const LANGUAGE_CHANGE_EVENT = "atc-language-change";
const SUPPORTED_LANGUAGES = ["ko", "en"];

const subscribeToLanguage = (callback) => {
  window.addEventListener("storage", callback);
  window.addEventListener(LANGUAGE_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LANGUAGE_CHANGE_EVENT, callback);
  };
};

const getLanguageSnapshot = () => {
  try {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return SUPPORTED_LANGUAGES.includes(storedLanguage) ? storedLanguage : "ko";
  } catch {
    return "ko";
  }
};

const getServerLanguageSnapshot = () => "ko";

const getNestedValue = (object, path) => {
  return path.split(".").reduce((value, key) => value?.[key], object);
};

export default function TranslationProvider({ children }) {
  const language = useSyncExternalStore(
    subscribeToLanguage,
    getLanguageSnapshot,
    getServerLanguageSnapshot
  );

  const setLanguage = useCallback((nextLanguage) => {
    const currentLanguage = getLanguageSnapshot();
    const resolvedLanguage =
      typeof nextLanguage === "function"
        ? nextLanguage(currentLanguage)
        : nextLanguage;

    if (!SUPPORTED_LANGUAGES.includes(resolvedLanguage)) return;

    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, resolvedLanguage);
      window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT));
    } catch {
      // 저장소 접근이 제한된 환경에서는 기본 언어 유지
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => {
    const t = (key) => getNestedValue(translations[language], key) ?? key;

    const translate = (localizedValue) => {
      if (typeof localizedValue === "string") return localizedValue;

      return (
        localizedValue?.[language] ??
        localizedValue?.ko ??
        localizedValue?.en ??
        ""
      );
    };

    return { language, setLanguage, t, translate };
  }, [language, setLanguage]);

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}
