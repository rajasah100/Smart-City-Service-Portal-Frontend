import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { applySeo } from "../../utils/seo";

// Route -> seo.pages ko key
const PUBLIC_PAGES = {
    "/": "home",
    "/services": "services",
    "/notices": "notices",
    "/events": "events",
    "/emergency": "emergency",
    "/about": "about",
    "/downloads": "downloads",
    "/government": "government",
    "/privacy": "privacy",
    "/terms": "terms",
    "/accessibility": "accessibility",
};

// Google ma nadekhaune (login chahine wa vyaktigat page)
const PRIVATE_PAGES = [
    ["/admin", "admin"],
    ["/department", "department"],
    ["/user", "dashboard"],
    ["/complaint", "complaint"],
    ["/login", "login"],
    ["/register", "register"],
    ["/forgot-password", "login"],
    ["/reset-password", "login"],
];

// Detail page (suchana/karyakram) le aafno SEO aafai rakhchhan
const DETAIL_PAGE = /^\/(notices|events)\/[^/]+$/;

const SeoManager = () => {
    const { pathname } = useLocation();
    const { t, i18n } = useTranslation();
    const lang = i18n.resolvedLanguage === "en" ? "en" : "ne";

    useEffect(() => {
        if (DETAIL_PAGE.test(pathname)) return;

        const path = pathname.replace(/\/+$/, "") || "/";
        const publicKey = PUBLIC_PAGES[path];
        const privateKey = PRIVATE_PAGES.find(([prefix]) => path === prefix || path.startsWith(`${prefix}/`))?.[1] || (path.endsWith("/register") ? "register" : null);
        const key = publicKey || privateKey || "notFound";

        applySeo({
            siteName: t("seo.siteName"),
            title: key === "home" ? t("seo.siteName") : t(`seo.pages.${key}.title`),
            description: t(`seo.pages.${key}.description`),
            path,
            lang,
            noindex: !publicKey,
        });

        // Home ko title ma pura tagline
        if (key === "home") document.title = t("seo.pages.home.title");
    }, [pathname, lang, t]);

    return null;
};

export default SeoManager;
