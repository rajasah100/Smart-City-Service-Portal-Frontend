import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    FaArrowRight,
    FaBullhorn,
    FaCalendarAlt,
    FaCheckCircle,
    FaClipboardList,
    FaConciergeBell,
    FaDownload,
    FaExclamationCircle,
    FaGlobeAsia,
    FaLock,
    FaLockOpen,
    FaPhoneAlt,
    FaRegClock,
    FaSearch,
} from "react-icons/fa";
import { MdSos } from "react-icons/md";
import { RiGovernmentLine } from "react-icons/ri";
import PageHero from "../components/common/PageHero";
import Reveal from "../components/common/Reveal";
import useSiteSettings from "../hooks/useSiteSettings";

// Portal ka sachchi sewa (shulka sabai nishulk, online 24 ghanta)
// table: who = everyone | registered, time = instant | dependsDepartment, how = online | onlineAndPhone | officialSite
const SERVICES = [
    {
        key: "complaint", to: "/complaint", icon: FaExclamationCircle, category: "citizen", login: true,
        color: "text-[#dc143c] bg-[#dc143c]/10",
        table: { who: "registered", time: "dependsDepartment", how: "online" },
    },
    {
        key: "track", to: "/user/complaints", icon: FaClipboardList, category: "citizen", login: true,
        color: "text-[#003893] bg-[#003893]/10",
        table: { who: "registered", time: "instant", how: "online" },
    },
    {
        key: "events", to: "/events", icon: FaCalendarAlt, category: "citizen", login: true,
        color: "text-[#b7791f] bg-[#d9a441]/15",
        table: { who: "registered", time: "instant", how: "online" },
    },
    {
        key: "notices", to: "/notices", icon: FaBullhorn, category: "info", login: false,
        color: "text-[#2c5d79] bg-[#2c5d79]/10",
        table: { who: "everyone", time: "instant", how: "online" },
    },
    {
        key: "downloads", to: "/downloads", icon: FaDownload, category: "info", login: false,
        color: "text-[#2c5d79] bg-[#2c5d79]/10",
        table: { who: "everyone", time: "instant", how: "online" },
    },
    {
        key: "government", to: "/government", icon: RiGovernmentLine, category: "info", login: false, official: true,
        color: "text-[#003893] bg-[#003893]/10",
        table: { who: "everyone", time: "instant", how: "officialSite" },
    },
    {
        key: "emergency", to: "/emergency", icon: MdSos, category: "emergency", login: false,
        color: "text-red-600 bg-red-50",
        table: { who: "everyone", time: "instant", how: "onlineAndPhone" },
    },
];

const FILTERS = ["all", "citizen", "info", "emergency"];

const Badge = ({ icon: Icon, children, tone = "slate" }) => {
    const tones = {
        slate: "bg-slate-100 text-slate-600",
        green: "bg-green-50 text-green-700",
        blue: "bg-[#003893]/10 text-[#003893]",
        amber: "bg-amber-50 text-amber-700",
    };

    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${tones[tone]}`}>
            <Icon className="text-[10px]" />
            {children}
        </span>
    );
};

const ServicePage = () => {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage === "en" ? "en-US" : "ne-NP";
    const settings = useSiteSettings();

    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    const keyword = search.trim().toLowerCase();

    const visible = SERVICES.filter((service) => {
        if (filter !== "all" && service.category !== filter) return false;
        if (!keyword) return true;

        const title = t(`servicesPage.items.${service.key}.title`).toLowerCase();
        const text = t(`servicesPage.items.${service.key}.text`).toLowerCase();

        return title.includes(keyword) || text.includes(keyword);
    });

    // Website sahayata ko lagi office ko phone matra (100 police ho, yaha haina)
    const helpPhone = settings.phone;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <PageHero
                icon={FaConciergeBell}
                badge={t("hero.services.badge")}
                title={t("hero.services.title")}
                description={t("hero.services.description")}
            />

            {/* Services */}
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <Reveal className="mb-10 text-center">
                    <span className="text-sm font-semibold uppercase tracking-widest text-[#d9a441]">
                        {t("servicesPage.label")}
                    </span>

                    <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
                        {t("servicesPage.title")}
                    </h2>

                    <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-[#d9a441]" />

                    <p className="mx-auto mt-4 max-w-2xl text-slate-500">{t("servicesPage.description")}</p>
                </Reveal>

                {/* Search + filter */}
                <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap gap-2">
                        {FILTERS.map((value) => (
                            <button
                                key={value}
                                onClick={() => setFilter(value)}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                    filter === value
                                        ? "bg-[#003893] text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                                {t(`servicesPage.filters.${value}`)}
                            </button>
                        ))}
                    </div>

                    <div className="relative md:w-72">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t("servicesPage.searchPlaceholder")}
                            className="w-full rounded-full border border-slate-200 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#003893] focus:ring-2 focus:ring-[#003893]/20"
                        />
                    </div>
                </div>

                {/* Cards */}
                {visible.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center text-slate-500">
                        {t("servicesPage.noResult")}
                    </p>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {visible.map(({ key, to, icon: Icon, color, login, official, category }, index) => {
                            // Aapatkalin card pura chaudai ma rato (card eklai nabasos ra chhito dekhiyos)
                            const isEmergency = category === "emergency";

                            return (
                            <Reveal
                                key={key}
                                delay={index * 60}
                                className={isEmergency ? "sm:col-span-2 lg:col-span-3" : ""}
                            >
                                <Link
                                    to={to}
                                    className={`group flex h-full flex-col rounded-2xl border p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                                        isEmergency
                                            ? "border-red-200 border-l-8 border-l-[#dc143c] bg-red-50/60 md:flex-row md:items-center md:gap-8"
                                            : "border-slate-200 border-t-4 border-t-[#003893] bg-white hover:border-t-[#dc143c]"
                                    }`}
                                >
                                    <div className={isEmergency ? "md:flex-1" : "contents"}>
                                    <div className="flex items-start gap-4">
                                        <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl transition group-hover:scale-110 ${color}`}>
                                            <Icon />
                                        </span>

                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#003893]">
                                                {t(`servicesPage.items.${key}.title`)}
                                            </h3>

                                            <p className="mt-1.5 text-sm leading-6 text-slate-500">
                                                {t(`servicesPage.items.${key}.text`)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex flex-wrap gap-2">
                                        <Badge icon={FaCheckCircle} tone="green">{t("servicesPage.badges.free")}</Badge>
                                        <Badge icon={FaRegClock}>{t("servicesPage.badges.allDay")}</Badge>
                                        {official ? (
                                            <Badge icon={FaGlobeAsia} tone="blue">{t("servicesPage.badges.external")}</Badge>
                                        ) : login ? (
                                            <Badge icon={FaLock} tone="amber">{t("servicesPage.badges.login")}</Badge>
                                        ) : (
                                            <Badge icon={FaLockOpen}>{t("servicesPage.badges.noLogin")}</Badge>
                                        )}
                                    </div>
                                    </div>

                                    <span className={`flex items-center justify-between text-sm font-semibold ${
                                        isEmergency
                                            ? "mt-5 gap-4 text-[#dc143c] md:mt-0 md:ml-auto md:shrink-0"
                                            : "mt-auto border-t border-slate-100 pt-4 text-[#003893]"
                                    }`}>
                                        <span className="mt-1">{t("servicesPage.open")}</span>
                                        <span className={`flex h-9 w-9 items-center justify-center rounded-full text-white transition group-hover:translate-x-1 ${isEmergency ? "bg-[#dc143c]" : "bg-[#003893] group-hover:bg-[#dc143c]"}`}>
                                            <FaArrowRight className="text-xs" />
                                        </span>
                                    </span>
                                </Link>
                            </Reveal>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Service information table (नागरिक बडापत्र jasto) */}
            <section className="bg-white py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal className="mb-8">
                        <span className="text-sm font-semibold uppercase tracking-widest text-[#d9a441]">
                            {t("servicesPage.table.label")}
                        </span>
                        <h2 className="mt-1 text-2xl font-bold text-slate-900">{t("servicesPage.table.title")}</h2>
                    </Reveal>

                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-[#003893] text-white">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">#</th>
                                    <th className="px-4 py-3 font-semibold">{t("servicesPage.table.service")}</th>
                                    <th className="px-4 py-3 font-semibold">{t("servicesPage.table.who")}</th>
                                    <th className="px-4 py-3 font-semibold">{t("servicesPage.table.fee")}</th>
                                    <th className="px-4 py-3 font-semibold">{t("servicesPage.table.time")}</th>
                                    <th className="px-4 py-3 font-semibold">{t("servicesPage.table.how")}</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {SERVICES.map(({ key, to, table }, index) => (
                                    <tr key={key} className="odd:bg-white even:bg-slate-50 hover:bg-[#003893]/5">
                                        <td className="px-4 py-3 text-slate-500">
                                            {(index + 1).toLocaleString(locale)}
                                        </td>
                                        <td className="px-4 py-3 font-medium">
                                            <Link to={to} className="text-[#003893] hover:underline">
                                                {t(`servicesPage.items.${key}.title`)}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">{t(`servicesPage.table.${table.who}`)}</td>
                                        <td className="px-4 py-3 font-medium text-green-700">{t("servicesPage.table.free")}</td>
                                        <td className="px-4 py-3 text-slate-600">{t(`servicesPage.table.${table.time}`)}</td>
                                        <td className="px-4 py-3 text-slate-600">{t(`servicesPage.table.${table.how}`)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Help */}
            <section className="bg-slate-50 pb-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-linear-to-r from-[#003893] to-[#0b1b3a] p-8 text-white md:flex-row">
                        <div>
                            <h2 className="text-xl font-bold">{t("servicesPage.help.title")}</h2>
                            <p className="mt-1 text-slate-300">{t("servicesPage.help.text")}</p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {helpPhone && (
                                <a
                                    href={`tel:${helpPhone}`}
                                    className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 font-semibold text-[#003893] transition hover:bg-slate-100"
                                >
                                    <FaPhoneAlt className="text-sm" />
                                    {t("servicesPage.help.call")} {helpPhone}
                                </a>
                            )}

                            <Link
                                to="/complaint"
                                className="rounded-lg bg-[#d9a441] px-5 py-2.5 font-semibold text-[#10151c] transition hover:bg-[#c8932f]"
                            >
                                {t("servicesPage.help.complaint")}
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </section>
        </div>
    );
};

export default ServicePage;
