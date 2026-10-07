import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaBullhorn, FaCheckCircle, FaInbox, FaUsers } from "react-icons/fa";
import apiRequest from "../../../utils/apiRequest";

const ITEMS = [
    { key: "citizens", icon: FaUsers },
    { key: "complaints", icon: FaInbox },
    { key: "resolved", icon: FaCheckCircle },
    { key: "notices", icon: FaBullhorn },
];

const reducedMotion = () =>
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// 0 bata asli sankhya samma gandai jane (1 second)
const CountUp = ({ value, locale }) => {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (reducedMotion()) {
            const id = requestAnimationFrame(() => setDisplay(value));
            return () => cancelAnimationFrame(id);
        }

        let frame;
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min(1, (now - start) / 1000);
            setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));
            if (progress < 1) frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [value]);

    return display.toLocaleString(locale);
};

// Database bata aaune asli tathyanka (nakkali number haina)
const HomeStats = () => {
    const { t, i18n } = useTranslation();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        apiRequest
            .get("/settings/stats")
            .then(({ data }) => setStats(data.stats))
            .catch(() => setStats(null));
    }, []);

    if (!stats) return null;

    const locale = i18n.resolvedLanguage === "en" ? "en-US" : "ne-NP";

    return (
        <section className="bg-white py-8">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
                {ITEMS.map(({ key, icon: Icon }) => (
                    <div key={key} className="flex items-center gap-3 rounded-xl border border-slate-200 border-t-4 border-t-[#003893] bg-white p-4 shadow-sm">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#003893]/10">
                            <Icon className="h-5 w-5 text-[#003893]" />
                        </div>

                        <div>
                            <p className="text-2xl font-bold text-[#003893]">
                                <CountUp value={stats[key] || 0} locale={locale} />
                            </p>
                            <p className="text-xs text-slate-500">{t(`homeGov.stats.${key}`)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HomeStats;
