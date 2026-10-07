import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { LuFileText, LuMapPin, LuPaperclip, LuX } from "react-icons/lu";
import { formatBS } from "../../utils/nepaliDate";
import { PRIORITY_STYLE, municipalityLabel } from "./deptUtils";

// Department le aafno notice herne (public page jastai sajilo, iframe binaa)
const NoticeView = ({ notice, onClose }) => {
    const { t, i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage === "en";

    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    const attachment = notice.attachment?.[0];
    const isImage = attachment && (attachment.type === "image" || /\.(jpe?g|png|gif|webp)$/i.test(attachment.url));
    const municipality = municipalityLabel(notice.municipality, isEn);

    // Body ma render: layout ko animation (transform) le fixed modal lai main bhitra nathunos
    return createPortal(
        <div className="fixed inset-0 z-60 flex items-end justify-center bg-slate-900/60 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
            <div
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
                className="animate-fade-up flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
            >
                <header className="relative shrink-0 bg-linear-to-r from-[#002a6e] to-[#003893] px-6 py-5 text-white">
                    <div className="absolute inset-x-0 top-0 h-1 bg-[#dc143c]" />
                    <button type="button" onClick={onClose} aria-label={t("deptDash.view.close")} className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
                        <LuX size={18} />
                    </button>
                    <div className="flex flex-wrap gap-2 text-xs font-semibold">
                        <span className="rounded-full bg-white/15 px-2.5 py-1">{t(`noticeTabs.${notice.category || "notice"}`)}</span>
                        <span className={`rounded-full px-2.5 py-1 ${PRIORITY_STYLE[notice.priority]?.badge}`}>{t(`userDash.priority.${notice.priority}`)}</span>
                        <span className={`rounded-full px-2.5 py-1 ${notice.status === "active" ? "bg-green-100 text-green-800" : "bg-slate-200 text-slate-700"}`}>
                            {t(`deptDash.notices.${notice.status === "active" ? "active" : "archived"}`)}
                        </span>
                    </div>
                    <h2 className="mt-3 pr-10 text-xl font-bold leading-snug">{notice.title}</h2>
                    <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/75">
                        <span>{formatBS(notice.createdAt, isEn)}</span>
                        {municipality && (
                            <span className="flex items-center gap-1">
                                <LuMapPin />
                                {municipality}
                                {notice.ward && ` - ${t("noticesPage.ward", { ward: /^\d+$/.test(notice.ward) ? Number(notice.ward).toLocaleString(isEn ? "en-US" : "ne-NP") : notice.ward })}`}
                            </span>
                        )}
                    </p>
                </header>

                <div className="flex-1 space-y-5 overflow-y-auto p-6">
                    <p className="whitespace-pre-line leading-7 text-slate-700">{notice.description}</p>

                    {attachment?.url ? (
                        isImage ? (
                            <a href={attachment.url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl border border-slate-200">
                                <img src={attachment.url} alt={attachment.altText || ""} className="max-h-96 w-full object-contain" />
                            </a>
                        ) : (
                            <a
                                href={attachment.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-[#003893]/40 hover:bg-[#003893]/5"
                            >
                                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-xl text-red-600">
                                    <LuFileText />
                                </span>
                                <span className="font-semibold text-[#003893]">{t("deptDash.notices.openAttachment")}</span>
                            </a>
                        )
                    ) : (
                        <p className="flex items-center gap-2 text-sm text-slate-400">
                            <LuPaperclip />
                            {t("deptDash.notices.noAttachment")}
                        </p>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default NoticeView;
