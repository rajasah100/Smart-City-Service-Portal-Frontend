import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaHouseDamage, FaWater, FaFire, FaHeartbeat } from "react-icons/fa";
import SectionHeading from "./SectionHeading";

// Content i18n/en.js ra i18n/ne.js ko "emergency.guide" ma cha
const guides = [
    { id: "earthquake", icon: FaHouseDamage },
    { id: "flood", icon: FaWater },
    { id: "fire", icon: FaFire },
    { id: "medical", icon: FaHeartbeat },
];

const PHASES = ["Before", "During", "After"];

const stepStyles = {
    Before: "bg-[#003893]/10 text-[#003893]",
    During: "bg-red-50 text-red-600",
    After: "bg-green-50 text-green-700",
};

const SafetyGuide = () => {
    const { t } = useTranslation();
    const [active, setActive] = useState(guides[0].id);

    return (
        <section id="safety-guide" className="bg-slate-50 py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">

                <SectionHeading
                    label={t("emergency.guide.label")}
                    title={t("emergency.guide.title")}
                    description={t("emergency.guide.description")}
                />

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-3">
                    {guides.map(({ id, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActive(id)}
                            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                                active === id
                                    ? "bg-[#10151c] text-[#d9a441] shadow-md"
                                    : "bg-white text-slate-600 hover:bg-slate-100"
                            }`}
                        >
                            <Icon />
                            {t(`emergency.guide.tabs.${id}`)}
                        </button>
                    ))}
                </div>

                {/* Steps */}
                <div className="mt-10 grid gap-6 md:grid-cols-3">
                    {PHASES.map((phase) => {
                        const items = t(`emergency.guide.steps.${active}.${phase}`, {
                            returnObjects: true,
                        });

                        return (
                            <div
                                key={phase}
                                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${stepStyles[phase]}`}>
                                    {t(`emergency.guide.phases.${phase}`)}
                                </span>

                                <ul className="mt-5 space-y-3">
                                    {(Array.isArray(items) ? items : []).map((item) => (
                                        <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
                                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d9a441]" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default SafetyGuide;
