import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiX } from "react-icons/fi";
import AIOrb from "./AIOrb";

const TEASER_KEY = "aiTeaserSeen";

const seenTeaser = () => {
    try {
        return sessionStorage.getItem(TEASER_KEY) === "1";
    } catch {
        return true;
    }
};

const markTeaser = () => {
    try {
        sessionStorage.setItem(TEASER_KEY, "1");
    } catch {
        // Storage block bhae pani chalcha
    }
};

// Kunako AI button: chamkine ring, ani session ma ek choti "Namaste!" bubble
const FloatingAIButton = ({ onClick, hidden = false }) => {
    const { t } = useTranslation();
    const [teaser, setTeaser] = useState(false);

    useEffect(() => {
        if (seenTeaser()) return undefined;
        const show = setTimeout(() => setTeaser(true), 2500);
        const hide = setTimeout(() => {
            setTeaser(false);
            markTeaser();
        }, 11000);
        return () => {
            clearTimeout(show);
            clearTimeout(hide);
        };
    }, []);

    const openChat = () => {
        setTeaser(false);
        markTeaser();
        onClick();
    };

    return (
        <div className={`print:hidden fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 transition-all duration-300 ${hidden ? "pointer-events-none translate-y-2 opacity-0" : "opacity-100"}`}>
            {teaser && !hidden && (
                <div className="ai-pop relative max-w-56 rounded-2xl rounded-br-md bg-white py-2.5 pl-4 pr-8 text-sm font-medium text-slate-800 shadow-xl ring-1 ring-slate-200">
                    <button type="button" onClick={openChat} className="text-left">
                        {t("ai.teaser")}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setTeaser(false);
                            markTeaser();
                        }}
                        aria-label={t("ai.close")}
                        className="absolute right-2 top-2 rounded p-0.5 text-slate-400 hover:text-slate-700"
                    >
                        <FiX size={14} />
                    </button>
                </div>
            )}

            <button
                type="button"
                onClick={openChat}
                aria-label={`${t("ai.title")} - ${t("ai.subtitle")}`}
                className="ai-glow group relative isolate flex items-center gap-3 rounded-full bg-linear-to-r from-[#001a4d] via-[#002a6e] to-[#003893] p-1.5 text-white shadow-2xl shadow-[#003893]/40 ring-1 ring-white/15 transition duration-300 hover:-translate-y-0.5 md:pr-5"
            >
                <AIOrb size="md" />
                <span className="hidden text-left md:block">
                    <span className="block text-sm font-bold leading-tight">{t("ai.title")}</span>
                    <span className="block text-xs text-white/70">{t("ai.subtitle")}</span>
                </span>
            </button>
        </div>
    );
};

export default FloatingAIButton;
