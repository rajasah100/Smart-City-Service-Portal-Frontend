import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaArrowRight } from "react-icons/fa";
import useHomeContent from "../../../hooks/useHomeContent";
import Reveal from "../../common/Reveal";
import DocumentList from "../DocumentList";

// Home ma pachhillo 5 kagajat. Kunai kagajat nabhae section dekhaudaina
const HomeDownloads = () => {
    const { t } = useTranslation();
    const documents = useHomeContent("/documents");

    if (!documents || documents.length === 0) return null;

    return (
        <section className="bg-slate-50 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <span className="text-sm font-semibold uppercase tracking-widest text-[#d9a441]">
                            {t("downloads.label")}
                        </span>
                        <h2 className="mt-1 text-2xl font-bold text-slate-900">{t("downloads.title")}</h2>
                    </div>

                    <Link
                        to="/downloads"
                        className="flex items-center gap-2 text-sm font-semibold text-[#003893] hover:underline"
                    >
                        {t("downloads.viewAll")}
                        <FaArrowRight className="text-xs" />
                    </Link>
                </Reveal>

                <Reveal>
                    <DocumentList documents={documents.slice(0, 5)} loading={false} />
                </Reveal>
            </div>
        </section>
    );
};

export default HomeDownloads;
