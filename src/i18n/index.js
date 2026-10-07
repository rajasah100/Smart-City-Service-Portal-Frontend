import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./en";
import ne from "./ne";

export const LANGUAGE_STORAGE_KEY = "language";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            ne: { translation: ne },
            en: { translation: en },
        },
        // Sarkari website: default Nepali. User le chhaneko bhasha browser ma yaad rakhcha
        fallbackLng: "ne",
        supportedLngs: ["ne", "en"],
        detection: {
            order: ["localStorage"],
            lookupLocalStorage: LANGUAGE_STORAGE_KEY,
            caches: ["localStorage"],
        },
        interpolation: { escapeValue: false },
    });

// Screen reader ra browser le sahi bhasha chinos
const setHtmlLang = (lng) => {
    document.documentElement.lang = lng === "en" ? "en" : "ne";
};

setHtmlLang(i18n.resolvedLanguage);
i18n.on("languageChanged", setHtmlLang);

export default i18n;
