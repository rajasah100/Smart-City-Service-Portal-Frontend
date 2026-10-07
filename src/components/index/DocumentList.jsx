import { useTranslation } from "react-i18next";
import NepaliDate from "nepali-date-converter";
import { FaDownload, FaFileAlt, FaFileImage, FaFilePdf } from "react-icons/fa";

// Download garna milne kagajat ko list (Home ra Downloads page dubai ma)
const DocumentList = ({ documents, loading }) => {
    const { t, i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage === "en";

    const bsDate = (date) => {
        try {
            return new NepaliDate(new Date(date)).format("YYYY-MM-DD", isEn ? "en" : "np");
        } catch {
            return "";
        }
    };

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="h-16 animate-pulse rounded-xl bg-slate-100" />
                ))}
            </div>
        );
    }

    if (documents.length === 0) {
        return (
            <p className="rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center text-slate-500">
                {t("downloads.empty")}
            </p>
        );
    }

    return (
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {documents.map((doc) => {
                const isPdf = doc.file?.format === "pdf" || doc.file?.resourceType === "raw";
                const Icon = isPdf ? FaFilePdf : doc.file?.resourceType === "image" ? FaFileImage : FaFileAlt;
                const title = isEn ? doc.titleEn || doc.titleNe : doc.titleNe;

                return (
                    <li key={doc._id} className="flex items-center gap-4 px-4 py-3 transition hover:bg-slate-50">
                        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xl ${isPdf ? "bg-red-50 text-[#dc143c]" : "bg-[#003893]/10 text-[#003893]"}`}>
                            <Icon />
                        </span>

                        <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-slate-800">{title}</p>
                            <p className="text-xs text-slate-500">
                                {t(`downloads.categories.${doc.category || "other"}`)} · {bsDate(doc.createdAt)}
                            </p>
                        </div>

                        {doc.file?.url && (
                            <a
                                href={doc.file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex shrink-0 items-center gap-2 rounded-lg border border-[#003893] px-3 py-1.5 text-sm font-medium text-[#003893] transition hover:bg-[#003893] hover:text-white"
                            >
                                <FaDownload className="text-xs" />
                                <span className="hidden sm:inline">{t("downloads.download")}</span>
                            </a>
                        )}
                    </li>
                );
            })}
        </ul>
    );
};

export default DocumentList;
