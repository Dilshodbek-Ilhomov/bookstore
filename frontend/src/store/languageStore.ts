// ============================================
// BookStore — Language Store (Zustand)
// ============================================

import { create } from "zustand";
import { translations, type Language, type Dictionary } from "@/lib/i18n";

interface LanguageState {
  language: Language;
  t: Dictionary;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  hydrateLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: "uz",
  t: translations.uz,

  setLanguage: (lang) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("bookstore_lang", lang);
      document.documentElement.lang = lang;
    }
    set({ language: lang, t: translations[lang] });
  },

  toggleLanguage: () => {
    const nextLang: Language = get().language === "uz" ? "en" : "uz";
    get().setLanguage(nextLang);
  },

  hydrateLanguage: () => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("bookstore_lang") as Language | null;
    if (stored && (stored === "uz" || stored === "en")) {
      document.documentElement.lang = stored;
      set({ language: stored, t: translations[stored] });
    } else {
      document.documentElement.lang = "uz";
    }
  },
}));
