import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    FaArrowRight,
    FaBell,
    FaBuilding,
    FaCheckCircle,
    FaPaperPlane,
    FaSearch,
    FaUserPlus,
} from "react-icons/fa";
import Reveal from "../../common/Reveal";

const ICONS = [FaUserPlus, FaPaperPlane, FaBuilding, FaBell];

// Gunaso kasari garne: 4 step timeline (desktop: tersho, mobile: thado)
const ComplaintProcess = () => {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage === "en" ? "en-US" : "ne-NP";

    const steps = t("homeGov.process.steps", { returnObjects: true });
    const badges = t("homeGov.process.badges", { returnObjects: true });
    const stepList = Array.isArray(steps) ? steps : [];

    return (
        <section className="relative overflow-hidden bg-linear-to-br from-[#003893] via-[#0b2f6e] to-[#0b1b3a] py-20">
            {/* Halka background pattern */}
            <div
                className="pointer-events-none absolute inset-0 opacity-10"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 15% 20%, #d9a441 0%, transparent 35%), radial-gradient(circle at 85% 80%, #dc143c 0%, transparent 35%)",
                }}
            />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Heading */}
                <Reveal className="mx-auto mb-14 max-w-2xl text-center">
                    <span className="text-sm font-semibold uppercase tracking-widest text-[#d9a441]">
                        {t("homeGov.process.label")}
                    </span>

                    <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
                        {t("homeGov.process.title")}
                    </h2>

                    <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-[#d9a441]" />

                    <p className="mt-4 text-slate-300">{t("homeGov.process.description")}</p>

                    {Array.isArray(badges) && (
                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                            {badges.map((badge) => (
                                <span
                                    key={badge}
                                    className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white"
                                >
                                    <FaCheckCircle className="text-[#d9a441]" />
                                    {badge}
                                </span>
                            ))}
                        </div>
                    )}
                </Reveal>

                {/* Timeline */}
                <Reveal>
                    <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-6">

                        {/* Desktop: icon haru jodne tersho rekha */}
                        <div
                            aria-hidden="true"
                            className="process-line absolute left-[12.5%] right-[12.5%] top-10 hidden h-1 rounded-full bg-linear-to-r from-[#d9a441] via-[#f0c66b] to-[#d9a441] lg:block"
                        />

                        {/* Mobile/tablet: thado rekha */}
                        <div
                            aria-hidden="true"
                            className="process-line-vertical absolute bottom-10 left-10 top-10 w-1 rounded-full bg-[#d9a441]/70 lg:hidden"
                        />

                        {stepList.map((step, index) => {
                            const Icon = ICONS[index] || FaBell;
                            const number = (index + 1).toLocaleString(locale);

                            return (
                                <li
                                    key={step.title}
                                    className="relative flex gap-5 lg:flex-col lg:items-center lg:text-center"
                                >
                                    {/* Icon circle */}
                                    <div className="relative z-10 shrink-0">
                                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl text-[#003893] shadow-lg ring-8 ring-white/10 transition duration-300 hover:scale-105">
                                            <Icon />
                                        </div>

                                        <span className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#dc143c] text-sm font-bold text-white">
                                            {number}
                                        </span>
                                    </div>

                                    {/* Text card */}
                                    <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:bg-white/10 lg:mt-6 lg:w-full">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-[#d9a441]">
                                            {t("homeGov.process.step", { n: number })}
                                        </p>

                                        <h3 className="mt-1 text-lg font-semibold text-white">{step.title}</h3>

                                        <p className="mt-2 text-sm leading-6 text-slate-300">{step.text}</p>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                </Reveal>

                {/* Buttons */}
                <div className="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                        to="/complaint"
                        className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#d9a441] px-8 py-3 font-semibold text-[#10151c] shadow-lg transition hover:bg-[#c8932f] sm:w-auto"
                    >
                        {t("homeGov.process.cta")}
                        <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                    </Link>

                    <Link
                        to="/user/complaints"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/40 px-8 py-3 font-semibold text-white transition hover:bg-white hover:text-[#003893] sm:w-auto"
                    >
                        <FaSearch className="text-sm" />
                        {t("homeGov.process.track")}
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ComplaintProcess;
