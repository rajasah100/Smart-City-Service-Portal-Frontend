import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    FiAlertTriangle,
    FiArrowRight,
    FiArrowUp,
    FiBell,
    FiCalendar,
    FiCheck,
    FiCheckCircle,
    FiCopy,
    FiEdit3,
    FiFileText,
    FiMic,
    FiSearch,
} from "react-icons/fi";
import { FaBuildingColumns } from "react-icons/fa6";
import { sendAIMessage, setComplaintData } from "../../redux/slices/aiSlice";
import AIText from "./AIText";
import AIOrb from "./AIOrb";

const QUICK = [
    { key: "problem", icon: FiEdit3, tone: "from-[#003893] to-[#2563eb]" },
    { key: "emergency", icon: FiAlertTriangle, tone: "from-[#dc143c] to-[#f43f5e]" },
    { key: "notices", icon: FiBell, tone: "from-amber-500 to-orange-500" },
    { key: "track", icon: FiSearch, tone: "from-emerald-600 to-teal-500" },
    { key: "departments", icon: FaBuildingColumns, tone: "from-indigo-600 to-violet-500" },
    { key: "events", icon: FiCalendar, tone: "from-sky-600 to-cyan-500" },
];

const ERROR_KEY = { RATE_LIMIT: "rateLimit", AI_UNAVAILABLE: "unavailable" };
const MAX_LENGTH = 1000;

// Ek choti pura dekhaisakeko jawaf pheri typewriter nagarne
const revealed = new Set();
const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const SpeechRecognition = typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

// Naya jawaf akshar-akshar gari dekhaune
const useTypewriter = (id, text, enabled) => {
    const [count, setCount] = useState(() => (enabled && !revealed.has(id) && !prefersReducedMotion() ? 0 : text.length));

    useEffect(() => {
        if (count >= text.length) {
            revealed.add(id);
            return undefined;
        }
        const step = Math.max(2, Math.ceil(text.length / 90));
        const timer = setTimeout(() => setCount((value) => Math.min(text.length, value + step)), 18);
        return () => clearTimeout(timer);
    }, [count, text.length, id]);

    return { shown: text.slice(0, count), done: count >= text.length };
};

const timeLabel = (at, isEn) =>
    at ? new Date(at).toLocaleTimeString(isEn ? "en-US" : "ne-NP", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }) : "";

// Gunaso ko draft: gradient border card, form kholda draft Redux ma (ComplaintPage le bharchha)
const DraftCard = ({ data, onDone }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const canFile = userInfo?.role === "user";

    const open = () => {
        if (canFile) {
            dispatch(setComplaintData({ department: data.department, departmentName: data.departmentName, title: data.title, description: data.description, priority: data.priority }));
            navigate("/complaint");
        } else {
            navigate("/login");
        }
        onDone();
    };

    return (
        <div className="ai-pop mt-3 rounded-2xl bg-linear-to-br from-[#003893] via-[#2563eb] to-[#dc143c] p-px shadow-lg shadow-[#003893]/10">
            <div className="overflow-hidden rounded-[15px] bg-white">
                <div className="flex items-center justify-between gap-2 bg-linear-to-r from-[#003893]/8 to-transparent px-4 py-2.5">
                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#003893]">
                        <FiFileText />
                        {t("ai.draft.title")}
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                        <FiCheckCircle size={11} />
                        {t("ai.draftReady")}
                    </span>
                </div>

                <div className="space-y-2 px-4 pb-3 pt-1">
                    <p className="text-[15px] font-semibold leading-snug text-slate-900">{data.title}</p>
                    <div className="flex flex-wrap gap-1.5 text-[11px] font-medium">
                        {data.departmentName && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">{data.departmentName}</span>}
                        <span
                            className={`rounded-full px-2.5 py-1 ${
                                data.priority === "high" ? "bg-red-50 text-[#dc143c]" : data.priority === "low" ? "bg-slate-100 text-slate-600" : "bg-amber-50 text-amber-700"
                            }`}
                        >
                            {t("ai.draft.priority")}: {t(`userDash.priority.${data.priority}`)}
                        </span>
                    </div>
                    <p className="text-[11px] leading-5 text-slate-500">{t("ai.draft.note")}</p>
                </div>

                <button
                    type="button"
                    onClick={open}
                    className="group flex w-full items-center justify-center gap-2 bg-linear-to-r from-[#002a6e] to-[#003893] py-3 text-sm font-semibold text-white transition hover:from-[#003893] hover:to-[#2563eb]"
                >
                    {canFile ? t("ai.draft.open") : t("ai.draft.login")}
                    <FiArrowRight className="transition group-hover:translate-x-1" />
                </button>
            </div>
        </div>
    );
};

const CopyButton = ({ text }) => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // Clipboard anumati chhaina
        }
    };

    return (
        <button
            type="button"
            onClick={copy}
            title={copied ? t("ai.copied") : t("ai.copy")}
            aria-label={copied ? t("ai.copied") : t("ai.copy")}
            className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-slate-400 opacity-0 transition hover:bg-slate-100 hover:text-slate-700 focus:opacity-100 group-hover:opacity-100"
        >
            {copied ? <FiCheck className="text-emerald-600" /> : <FiCopy />}
            {copied ? t("ai.copied") : t("ai.copy")}
        </button>
    );
};

// AI ko jawaf: typewriter, ani sakiyepachhi action ra copy
const AssistantMessage = ({ msg, animate, onGrow, onNavigate }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const isEn = i18n.resolvedLanguage === "en";
    const { shown, done } = useTypewriter(msg.id, msg.text, animate);

    useEffect(() => {
        onGrow();
    }, [shown.length, onGrow]);

    if (msg.errorCode) {
        return (
            <div className="ai-pop flex gap-2.5">
                <AIOrb size="sm" />
                <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-red-50 px-4 py-3 text-sm leading-6 text-red-800 ring-1 ring-red-200">
                    {t(`ai.errors.${ERROR_KEY[msg.errorCode] || "generic"}`)}
                </div>
            </div>
        );
    }

    return (
        <div className="ai-pop group flex gap-2.5">
            <AIOrb size="sm" className="mt-0.5" />
            <div className="min-w-0 max-w-[88%]">
                <div className="mb-1 flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-600">{t("ai.name")}</span>
                    <span>{timeLabel(msg.at, isEn)}</span>
                </div>
                <div className="rounded-2xl rounded-tl-md bg-white px-4 py-3 text-sm text-slate-700 shadow-sm ring-1 ring-slate-200/80">
                    {msg.text && (
                        <div className={done ? "" : "ai-caret"}>
                            <AIText text={shown} />
                        </div>
                    )}

                    {done &&
                        msg.actions?.map((action, index) =>
                            action.type === "draft_complaint" ? (
                                <DraftCard key={index} data={action.data} onDone={onNavigate} />
                            ) : action.type === "open_page" ? (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => {
                                        navigate(action.path);
                                        onNavigate();
                                    }}
                                    className="ai-pop group/btn mr-2 mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#003893]/8 px-3.5 py-1.5 text-xs font-semibold text-[#003893] ring-1 ring-[#003893]/20 transition hover:bg-[#003893] hover:text-white"
                                >
                                    {t(`ai.pages.${action.page}`, { defaultValue: action.page })}
                                    <FiArrowRight className="transition group-hover/btn:translate-x-0.5" />
                                </button>
                            ) : null
                        )}
                </div>
                {done && msg.text && (
                    <div className="mt-1 flex">
                        <CopyButton text={msg.text} />
                    </div>
                )}
            </div>
        </div>
    );
};

// Chat: swagat, sandesh, input (voice sahit)
const AIComplaintChat = ({ open, onNavigate }) => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage === "en";
    const { userInfo } = useSelector((state) => state.auth);
    const { messages, loading } = useSelector((state) => state.ai);

    const [input, setInput] = useState("");
    const [listening, setListening] = useState(false);
    const [voiceError, setVoiceError] = useState(false);
    const scrollRef = useRef(null);
    const inputRef = useRef(null);
    const recognitionRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        const box = scrollRef.current;
        if (box) box.scrollTop = box.scrollHeight;
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages.length, loading, scrollToBottom]);

    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 300);
    }, [open]);

    useEffect(() => () => recognitionRef.current?.abort(), []);

    // Textarea lekhda aafai thulo (5 line samma)
    const resize = () => {
        const el = inputRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
    };

    const send = (text) => {
        const message = text.trim();
        if (!message || loading) return;
        recognitionRef.current?.abort();
        dispatch(sendAIMessage({ message, language: isEn ? "en" : "ne" }));
        setInput("");
        requestAnimationFrame(resize);
    };

    const toggleVoice = () => {
        if (listening) {
            recognitionRef.current?.stop();
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = isEn ? "en-US" : "ne-NP";
        recognition.interimResults = true;
        recognition.continuous = false;
        recognition.onresult = (event) => {
            const transcript = Array.from(event.results).map((result) => result[0].transcript).join("");
            setInput(transcript);
            requestAnimationFrame(resize);
        };
        recognition.onerror = () => setVoiceError(true);
        recognition.onend = () => setListening(false);

        recognitionRef.current = recognition;
        setVoiceError(false);
        setListening(true);
        recognition.start();
    };

    const hour = new Date().getHours();
    const greeting = t(`ai.greeting.${hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening"}`);
    const firstName = userInfo?.name?.split(" ")[0];
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");

    return (
        <div className="flex h-full flex-col">
            {/* Sandesh */}
            <div
                ref={scrollRef}
                aria-live="polite"
                className="flex-1 overflow-y-auto bg-slate-50 bg-[radial-gradient(#dbe3ef_1px,transparent_1px)] bg-size-[18px_18px] px-4 py-5"
            >
                {messages.length === 0 ? (
                    <div className="flex min-h-full flex-col">
                        <div className="animate-fade-up flex flex-col items-center px-2 pb-6 pt-4 text-center">
                            <AIOrb size="lg" />
                            <h3 className="mt-4 bg-linear-to-r from-[#002a6e] via-[#003893] to-[#dc143c] bg-clip-text text-2xl font-bold text-transparent">
                                {firstName ? t("ai.greetingName", { greeting, name: firstName }) : `${greeting}!`}
                            </h3>
                            <p className="mt-1.5 max-w-xs text-sm leading-6 text-slate-500">{t("ai.tagline")}</p>
                        </div>

                        <p className="mb-2.5 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">{t("ai.suggestions")}</p>
                        <div className="grid grid-cols-2 gap-2.5">
                            {QUICK.filter(({ key }) => key !== "track" || userInfo).map(({ key, icon: Icon, tone }, index) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => send(t(`ai.quick.${key}.prompt`))}
                                    style={{ "--delay": `${index * 60}ms` }}
                                    className="animate-fade-up group flex flex-col items-start gap-2 rounded-2xl bg-white p-3.5 text-left shadow-sm ring-1 ring-slate-200/80 transition duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-[#003893]/30"
                                >
                                    <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br text-white shadow-sm ${tone}`}>
                                        <Icon size={16} />
                                    </span>
                                    <span>
                                        <span className="block text-sm font-semibold text-slate-900">{t(`ai.quick.${key}.label`)}</span>
                                        <span className="mt-0.5 block text-[11px] leading-4 text-slate-500">{t(`ai.quickDesc.${key}`)}</span>
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {messages.map((msg) =>
                            msg.role === "user" ? (
                                <div key={msg.id} className="ai-pop flex flex-col items-end">
                                    <div className="max-w-[85%] whitespace-pre-line rounded-2xl rounded-tr-md bg-linear-to-br from-[#003893] to-[#2563eb] px-4 py-2.5 text-sm leading-6 text-white shadow-md shadow-[#003893]/15">
                                        {msg.text}
                                    </div>
                                    <span className="mt-1 text-[11px] text-slate-400">{timeLabel(msg.at, isEn)}</span>
                                </div>
                            ) : (
                                <AssistantMessage
                                    key={msg.id}
                                    msg={msg}
                                    animate={msg.id === lastAssistant?.id}
                                    onGrow={scrollToBottom}
                                    onNavigate={onNavigate}
                                />
                            )
                        )}

                        {loading && (
                            <div className="ai-pop flex items-center gap-2.5">
                                <AIOrb size="sm" />
                                <div className="flex items-center gap-2.5 rounded-2xl rounded-tl-md bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200/80">
                                    <span className="flex gap-1">
                                        {[0, 150, 300].map((delay) => (
                                            <span key={delay} className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#003893]" style={{ animationDelay: `${delay}ms` }} />
                                        ))}
                                    </span>
                                    <span className="ai-shimmer text-sm font-medium">{t("ai.thinking")}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Input */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    send(input);
                }}
                className="shrink-0 bg-white px-3 pb-3 pt-2"
            >
                {(listening || voiceError) && (
                    <p className={`mb-2 flex items-center justify-center gap-2 text-xs font-medium ${voiceError ? "text-amber-700" : "text-[#dc143c]"}`}>
                        {listening && <span className="h-2 w-2 animate-ping rounded-full bg-[#dc143c]" />}
                        {listening ? t("ai.listening") : t("ai.voiceError")}
                    </p>
                )}

                <div className="flex items-end gap-1.5 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-900/5 transition focus-within:border-[#003893]/50 focus-within:ring-4 focus-within:ring-[#003893]/10">
                    {SpeechRecognition && (
                        <button
                            type="button"
                            onClick={toggleVoice}
                            title={t("ai.voice")}
                            aria-label={t("ai.voice")}
                            aria-pressed={listening}
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                                listening ? "bg-[#dc143c] text-white shadow-md shadow-[#dc143c]/30" : "text-slate-500 hover:bg-slate-100 hover:text-[#003893]"
                            }`}
                        >
                            <FiMic size={18} />
                        </button>
                    )}

                    <textarea
                        ref={inputRef}
                        rows={1}
                        value={input}
                        maxLength={MAX_LENGTH}
                        onChange={(e) => {
                            setInput(e.target.value);
                            resize();
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                send(input);
                            }
                        }}
                        placeholder={t("ai.placeholder")}
                        aria-label={t("ai.placeholder")}
                        className="max-h-35 min-h-10 flex-1 resize-none bg-transparent px-2 py-2.5 text-sm leading-5 text-slate-800 outline-none placeholder:text-slate-400"
                    />

                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        aria-label={t("ai.send")}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#003893] to-[#2563eb] text-white shadow-md shadow-[#003893]/25 transition hover:scale-105 disabled:scale-100 disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none"
                    >
                        <FiArrowUp size={18} />
                    </button>
                </div>

                <div className="mt-1.5 flex items-center justify-between px-1 text-[10.5px] text-slate-400">
                    <span>{t("ai.disclaimer")}</span>
                    {input.length > MAX_LENGTH - 200 && <span className="shrink-0 pl-2">{input.length}/{MAX_LENGTH}</span>}
                </div>
            </form>
        </div>
    );
};

export default AIComplaintChat;
