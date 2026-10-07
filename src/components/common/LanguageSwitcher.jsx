import { useTranslation } from "react-i18next";

// नेपाली / EN switch. variant="light" seto header ma, "dark" navbar ma
const LanguageSwitcher = ({ variant = "light" }) => {
    const { i18n, t } = useTranslation();
    const current = i18n.resolvedLanguage === "en" ? "en" : "ne";

    const base = "px-3 py-1 text-xs font-semibold transition";
    const styles = {
        light: {
            wrap: "border-[#003893]/30",
            active: "bg-[#003893] text-white",
            idle: "text-[#003893] hover:bg-[#003893]/10",
        },
        dark: {
            wrap: "border-white/30",
            active: "bg-white text-[#10151c]",
            idle: "text-white hover:bg-white/10",
        },
    }[variant];

    return (
        <div
            role="group"
            aria-label={t("gov.language")}
            className={`inline-flex shrink-0 overflow-hidden rounded-full border ${styles.wrap}`}
        >
            {[
                { code: "ne", label: "नेपाली" },
                { code: "en", label: "EN" },
            ].map(({ code, label }) => (
                <button
                    key={code}
                    type="button"
                    lang={code}
                    aria-pressed={current === code}
                    onClick={() => i18n.changeLanguage(code)}
                    className={`${base} ${current === code ? styles.active : styles.idle}`}
                >
                    {label}
                </button>
            ))}
        </div>
    );
};

export default LanguageSwitcher;
