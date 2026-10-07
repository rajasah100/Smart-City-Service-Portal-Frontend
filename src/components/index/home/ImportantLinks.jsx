import { useTranslation } from "react-i18next";
import { FaExternalLinkAlt } from "react-icons/fa";
import Reveal from "../../common/Reveal";

// Asli sarkari website haru (naya tab ma khulcha)
const LINKS = [
    { ne: "नेपाल सरकारको पोर्टल", en: "Government of Nepal Portal", url: "https://nepal.gov.np" },
    { ne: "संघीय मामिला तथा सामान्य प्रशासन मन्त्रालय", en: "Ministry of Federal Affairs and General Administration", url: "https://mofaga.gov.np" },
    { ne: "बिपद पोर्टल", en: "BIPAD Disaster Portal", url: "https://bipad.gov.np" },
    { ne: "जल तथा मौसम विज्ञान विभाग", en: "Department of Hydrology and Meteorology", url: "https://www.dhm.gov.np" },
    { ne: "राष्ट्रिय परिचयपत्र", en: "National ID Card", url: "https://donidcr.gov.np" },
    { ne: "आन्तरिक राजस्व विभाग", en: "Inland Revenue Department", url: "https://ird.gov.np" },
];

const ImportantLinks = () => {
    const { t, i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage === "en";

    return (
        <section className="bg-white py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="mb-8">
                    <span className="text-sm font-semibold uppercase tracking-widest text-[#d9a441]">
                        {t("homeGov.links.label")}
                    </span>

                    <h2 className="mt-1 text-2xl font-bold text-slate-900">
                        {t("homeGov.links.title")}
                    </h2>
                </Reveal>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {LINKS.map((link, index) => (
                        <Reveal key={link.url} delay={index * 50}>
                            <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 border-l-4 border-l-[#003893] bg-white px-5 py-4 transition hover:border-l-[#dc143c] hover:shadow-md"
                            >
                                <span className="text-sm font-medium text-slate-800 group-hover:text-[#003893]">
                                    {isEn ? link.en : link.ne}
                                </span>

                                <FaExternalLinkAlt className="shrink-0 text-xs text-slate-400 group-hover:text-[#dc143c]" />
                            </a>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ImportantLinks;
