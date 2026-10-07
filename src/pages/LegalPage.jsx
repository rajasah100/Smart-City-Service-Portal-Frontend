import { useTranslation } from "react-i18next";
import { FaFileContract, FaShieldAlt, FaUniversalAccess } from "react-icons/fa";
import PageHero from "../components/common/PageHero";
import LanguageSwitcher from "../components/common/LanguageSwitcher";
import useSiteSettings from "../hooks/useSiteSettings";

const ICONS = {
    privacy: FaShieldAlt,
    terms: FaFileContract,
    accessibility: FaUniversalAccess,
};

// Privacy Policy / Terms of Use / Accessibility (content i18n ko "legal" ma)
const LegalPage = ({ page }) => {
    const { t, i18n } = useTranslation();
    const settings = useSiteSettings();
    const isEn = i18n.resolvedLanguage === "en";

    const sections = t(`legal.${page}.sections`, { returnObjects: true });

    return (
        <div className="min-h-screen bg-slate-50">
            <PageHero
                icon={ICONS[page]}
                badge={t(`legal.${page}.badge`)}
                title={t(`legal.${page}.title`)}
                description={t(`legal.${page}.description`)}
            />

            <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Accessibility page ma setting yahi bata badalna milne */}
                {page === "accessibility" && (
                    <div className="mb-8 flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-5">
                        <span className="text-sm font-medium text-slate-700">{t("gov.language")}:</span>
                        <LanguageSwitcher />
                    </div>
                )}

                <div className="space-y-6">
                    {(Array.isArray(sections) ? sections : []).map((section, index) => (
                        <article key={section.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="flex items-center gap-3 text-lg font-bold text-slate-900">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#003893] text-sm text-white">
                                    {(index + 1).toLocaleString(isEn ? "en-US" : "ne-NP")}
                                </span>
                                {section.title}
                            </h2>

                            <ul className="mt-4 space-y-2.5 pl-11">
                                {section.items.map((item) => (
                                    <li key={item} className="flex gap-3 leading-7 text-slate-600">
                                        <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#dc143c]" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>

                {/* Sampark */}
                <p className="mt-8 text-center text-sm text-slate-500">
                    {isEn ? settings.officeEn : settings.officeNe}, {isEn ? settings.nameEn : settings.nameNe}
                    {settings.email && <> · <a href={`mailto:${settings.email}`} className="text-[#003893] hover:underline">{settings.email}</a></>}
                    {settings.phone && <> · <a href={`tel:${settings.phone}`} className="text-[#003893] hover:underline">{settings.phone}</a></>}
                </p>
            </section>
        </div>
    );
};

export default LegalPage;
