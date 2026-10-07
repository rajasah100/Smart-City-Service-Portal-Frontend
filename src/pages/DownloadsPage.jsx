import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaDownload } from "react-icons/fa";
import PageHero from "../components/common/PageHero";
import DocumentList from "../components/index/DocumentList";
import useHomeContent from "../hooks/useHomeContent";

const CATEGORIES = ["act", "regulation", "procedure", "form", "report", "other"];

const DownloadsPage = () => {
    const { t } = useTranslation();
    const [category, setCategory] = useState("");
    const documents = useHomeContent("/documents", category ? { category } : undefined);

    return (
        <div className="min-h-screen bg-slate-50">
            <PageHero
                icon={FaDownload}
                badge={t("downloads.label")}
                title={t("downloads.title")}
                description={t("downloads.description")}
            />

            <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Category filter */}
                <div className="mb-6 flex flex-wrap gap-2">
                    {["", ...CATEGORIES].map((value) => (
                        <button
                            key={value || "all"}
                            onClick={() => setCategory(value)}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                category === value
                                    ? "bg-[#003893] text-white"
                                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                            }`}
                        >
                            {value ? t(`downloads.categories.${value}`) : t("downloads.all")}
                        </button>
                    ))}
                </div>

                <DocumentList documents={documents || []} loading={documents === null} />
            </section>
        </div>
    );
};

export default DownloadsPage;
