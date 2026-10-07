import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FiMaximize2, FiMinimize2, FiRotateCcw, FiX } from "react-icons/fi";
import { clearChat } from "../../redux/slices/aiSlice";
import AIComplaintChat from "./AIComplaintChat";
import AIOrb from "./AIOrb";

const iconButton = "flex h-9 w-9 items-center justify-center rounded-xl text-white/85 ring-1 ring-white/10 transition hover:bg-white/15 hover:text-white";

// Daya bata khulne AI chat (mobile ma pura screen, desktop ma thulo banauna milne)
const AIChatDrawer = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const hasMessages = useSelector((state) => state.ai.messages.length > 0);
    const [wide, setWide] = useState(false);

    // Esc le band
    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    return (
        <>
            <div
                onClick={onClose}
                aria-hidden="true"
                className={`print:hidden fixed inset-0 z-9998 bg-slate-950/40 backdrop-blur-[2px] transition-opacity duration-300 ${open ? "visible opacity-100" : "invisible opacity-0"}`}
            />

            <aside
                role="dialog"
                aria-modal="true"
                aria-label={t("ai.name")}
                aria-hidden={!open}
                className={`print:hidden fixed right-0 top-0 z-9999 flex h-dvh w-full flex-col overflow-hidden bg-white shadow-[0_0_60px_-10px_rgba(0,42,110,0.45)] transition-all duration-300 ease-out sm:right-3 sm:top-3 sm:h-[calc(100dvh-1.5rem)] sm:rounded-3xl ${
                    wide ? "sm:w-[min(48rem,calc(100vw-1.5rem))]" : "sm:w-110"
                } ${open ? "translate-x-0 opacity-100" : "invisible translate-x-[110%] opacity-0"}`}
            >
                {/* Header */}
                <header className="relative shrink-0 overflow-hidden bg-linear-to-br from-[#001a4d] via-[#002a6e] to-[#003893] px-4 pb-4 pt-5 text-white">
                    <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-[#2563eb]/40 blur-2xl" aria-hidden="true" />
                    <div className="pointer-events-none absolute -bottom-16 left-10 h-32 w-32 rounded-full bg-[#dc143c]/30 blur-2xl" aria-hidden="true" />
                    <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#dc143c] via-amber-400 to-[#2563eb]" />

                    <div className="relative flex items-center gap-3">
                        <span className="relative">
                            <AIOrb size="md" />
                            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#002a6e] bg-emerald-400" />
                        </span>
                        <div className="min-w-0 flex-1">
                            <h2 className="truncate text-base font-bold tracking-tight">{t("ai.name")}</h2>
                            <p className="flex items-center gap-1.5 text-xs text-white/70">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                </span>
                                {t("ai.online")} · {t("ai.official")}
                            </p>
                        </div>

                        {hasMessages && (
                            <button type="button" onClick={() => dispatch(clearChat())} title={t("ai.clear")} aria-label={t("ai.clear")} className={iconButton}>
                                <FiRotateCcw size={16} />
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => setWide((value) => !value)}
                            title={wide ? t("ai.collapse") : t("ai.expand")}
                            aria-label={wide ? t("ai.collapse") : t("ai.expand")}
                            className={`${iconButton} hidden sm:flex`}
                        >
                            {wide ? <FiMinimize2 size={16} /> : <FiMaximize2 size={16} />}
                        </button>
                        <button type="button" onClick={onClose} aria-label={t("ai.close")} className={iconButton}>
                            <FiX size={18} />
                        </button>
                    </div>
                </header>

                <div className="min-h-0 flex-1">
                    <AIComplaintChat open={open} onNavigate={onClose} />
                </div>
            </aside>
        </>
    );
};

export default AIChatDrawer;
