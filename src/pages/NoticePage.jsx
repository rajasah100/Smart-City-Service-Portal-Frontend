import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NepaliDate from "nepali-date-converter";
import {
    FaArrowRight,
    FaBuilding,
    FaBullhorn,
    FaChevronDown,
    FaDownload,
    FaExclamationCircle,
    FaFileImage,
    FaFilePdf,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaSearch,
} from "react-icons/fa";

import { getNewArrivals } from "../redux/slices/noticeSlice";
import { getDepartments } from "../redux/slices/departmentSlice";
import PageHero from "../components/common/PageHero";
import Reveal from "../components/common/Reveal";
import apiRequest from "../utils/apiRequest";

const CATEGORIES = ["", "notice", "tender", "news", "press"];
const PAGE_SIZE = 10;

const CATEGORY_STYLES = {
    notice: "bg-[#003893]/10 text-[#003893]",
    tender: "bg-amber-50 text-amber-700",
    news: "bg-green-50 text-green-700",
    press: "bg-purple-50 text-purple-700",
};

// BS miti ko tukra (din, mahina, sal) - list ko baya tira box ma
const bsParts = (date, isEn) => {
    try {
        const nd = new NepaliDate(new Date(date));
        const lang = isEn ? "en" : "np";
        return { day: nd.format("DD", lang), month: nd.format("MMMM", lang), year: nd.format("YYYY", lang) };
    } catch {
        return { day: "", month: "", year: "" };
    }
};

const NoticePage = () => {
    const { t, i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage === "en";
    const dispatch = useDispatch();

    const { newArrivals = [] } = useSelector((state) => state.notice);
    const { departments = [] } = useSelector((state) => state.department);

    const [category, setCategory] = useState("");
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // null = load hudai, [] = kehi bhetiyena
    const [notices, setNotices] = useState(null);
    const [failed, setFailed] = useState(false);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search.trim()), 400);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        dispatch(getDepartments());
        if (newArrivals.length === 0) dispatch(getNewArrivals());
    }, [dispatch, newArrivals.length]);

    // Filter badlida naya list (purano response le naya lai nametos bhanera ignore)
    useEffect(() => {
        let ignore = false;

        apiRequest
            .get("/notices", {
                params: {
                    search: debouncedSearch || undefined,
                    department: department || undefined,
                    category: category || undefined,
                },
            })
            .then(({ data }) => {
                if (ignore) return;
                setNotices(Array.isArray(data) ? data : []);
                setFailed(false);
                setVisibleCount(PAGE_SIZE);
            })
            .catch(() => {
                if (ignore) return;
                setNotices([]);
                setFailed(true);
            });

        return () => {
            ignore = true;
        };
    }, [debouncedSearch, department, category]);

    const changeFilter = (setter) => (value) => {
        setNotices(null);
        setter(value);
    };

    const resetFilters = () => {
        setNotices(null);
        setSearch("");
        setDebouncedSearch("");
        setDepartment("");
        setCategory("");
    };

    const loading = notices === null;
    const shown = loading ? [] : notices.slice(0, visibleCount);
    const hasFilter = search || department || category;

    return (
        <div className="min-h-screen bg-slate-100 pb-16">
            <PageHero
                icon={FaBullhorn}
                badge={t("hero.notices.badge")}
                title={t("hero.notices.title")}
                description={t("hero.notices.description")}
            />

            <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">

                {/* Category tabs + filters */}
                <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div role="tablist" className="flex overflow-x-auto bg-[#003893]">
                        {CATEGORIES.map((value) => (
                            <button
                                key={value || "all"}
                                role="tab"
                                aria-selected={category === value}
                                onClick={() => category !== value && changeFilter(setCategory)(value)}
                                className={`shrink-0 border-b-4 px-5 py-3.5 text-sm font-semibold transition ${
                                    category === value
                                        ? "border-[#dc143c] bg-white/15 text-white"
                                        : "border-transparent text-white/75 hover:bg-white/10 hover:text-white"
                                }`}
                            >
                                {value ? t(`noticeTabs.${value}`) : t("noticesPage.all")}
                            </button>
                        ))}
                    </div>

                    <div className="grid gap-3 p-4 md:grid-cols-[1fr_16rem_auto]">
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={t("noticesPage.searchPlaceholder")}
                                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#003893] focus:ring-2 focus:ring-[#003893]/20"
                            />
                        </div>

                        <select
                            value={department}
                            onChange={(e) => changeFilter(setDepartment)(e.target.value)}
                            className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#003893] focus:ring-2 focus:ring-[#003893]/20"
                        >
                            <option value="">{t("noticesPage.allDepartments")}</option>
                            {departments.map((dept) => (
                                <option key={dept._id} value={dept._id}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={resetFilters}
                            disabled={!hasFilter}
                            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                        >
                            {t("noticesPage.reset")}
                        </button>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">

                    {/* Notice list */}
                    <div className="lg:col-span-2">
                        {!loading && !failed && (
                            <p className="mb-3 text-sm text-slate-500">
                                {t("noticesPage.results", { count: notices.length })}
                            </p>
                        )}

                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4].map((item) => (
                                    <div key={item} className="flex animate-pulse gap-4 rounded-xl bg-white p-4">
                                        <div className="h-20 w-20 shrink-0 rounded-lg bg-slate-200" />
                                        <div className="flex-1 space-y-3 py-1">
                                            <div className="h-4 w-1/3 rounded bg-slate-200" />
                                            <div className="h-5 w-3/4 rounded bg-slate-200" />
                                            <div className="h-4 w-1/2 rounded bg-slate-200" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : failed ? (
                            <p className="rounded-xl border border-red-200 bg-red-50 py-10 text-center text-red-600">
                                {t("noticesPage.failed")}
                            </p>
                        ) : notices.length === 0 ? (
                            <p className="rounded-xl border border-dashed border-slate-300 bg-white py-12 text-center text-slate-500">
                                {t("noticesPage.empty")}
                            </p>
                        ) : (
                            <ul className="space-y-3">
                                {shown.map((notice, index) => {
                                    const date = bsParts(notice.createdAt, isEn);
                                    const cat = notice.category || "notice";
                                    const file = notice.attachment?.[0];
                                    const urgent = notice.priority === "high";

                                    return (
                                        <Reveal as="li" key={notice._id} delay={(index % PAGE_SIZE) * 40}>
                                            <Link
                                                to={`/notices/${notice._id}`}
                                                className={`group flex gap-4 rounded-xl border bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                                                    urgent ? "border-red-200 border-l-4 border-l-[#dc143c]" : "border-slate-200 hover:border-[#003893]/30"
                                                }`}
                                            >
                                                {/* BS date box */}
                                                <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-lg bg-[#003893] text-white">
                                                    <span className="text-2xl font-bold leading-none">{date.day}</span>
                                                    <span className="mt-1 text-xs">{date.month}</span>
                                                    <span className="text-[10px] text-white/70">{date.year}</span>
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${CATEGORY_STYLES[cat] || CATEGORY_STYLES.notice}`}>
                                                            {t(`noticeTabs.${cat}`)}
                                                        </span>

                                                        {urgent && (
                                                            <span className="flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#dc143c]">
                                                                <FaExclamationCircle />
                                                                {t("noticesPage.urgent")}
                                                            </span>
                                                        )}

                                                        {file && (
                                                            <span className="flex items-center gap-1 text-[11px] text-slate-500">
                                                                {file.type === "pdf" ? <FaFilePdf className="text-[#dc143c]" /> : <FaFileImage className="text-[#2c5d79]" />}
                                                                {file.type === "pdf" ? t("noticesPage.pdf") : t("noticesPage.image")}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h2 className="mt-1.5 line-clamp-2 font-semibold text-slate-900 group-hover:text-[#003893]">
                                                        {notice.title}
                                                    </h2>

                                                    <p className="mt-1 line-clamp-1 text-sm text-slate-500">{notice.description}</p>

                                                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                                                        {notice.department?.name && (
                                                            <span className="flex items-center gap-1.5">
                                                                <FaBuilding className="text-slate-400" />
                                                                {notice.department.name}
                                                            </span>
                                                        )}
                                                        {notice.ward && (
                                                            <span className="flex items-center gap-1.5">
                                                                <FaMapMarkerAlt className="text-slate-400" />
                                                                {t("noticesPage.ward", { ward: notice.ward })}
                                                            </span>
                                                        )}
                                                        <span className="ml-auto flex items-center gap-1 font-semibold text-[#003893]">
                                                            {t("noticesPage.readMore")}
                                                            <FaArrowRight className="transition group-hover:translate-x-1" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </Reveal>
                                    );
                                })}
                            </ul>
                        )}

                        {!loading && notices.length > visibleCount && (
                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                                    className="inline-flex items-center gap-2 rounded-lg border border-[#003893] px-6 py-2.5 text-sm font-semibold text-[#003893] transition hover:bg-[#003893] hover:text-white"
                                >
                                    {t("noticesPage.loadMore")}
                                    <FaChevronDown className="text-xs" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
                        <Reveal className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <h2 className="flex items-center gap-2 bg-[#003893] px-4 py-3 font-semibold text-white">
                                <FaBullhorn />
                                {t("noticesPage.sidebar.latest")}
                            </h2>

                            <ul className="divide-y divide-slate-100">
                                {newArrivals.slice(0, 5).map((notice) => {
                                    const date = bsParts(notice.createdAt, isEn);

                                    return (
                                        <li key={notice._id}>
                                            <Link to={`/notices/${notice._id}`} className="block px-4 py-3 transition hover:bg-slate-50">
                                                <span className="text-xs text-[#dc143c]">
                                                    {date.year} {date.month} {date.day}
                                                </span>
                                                <span className="mt-0.5 line-clamp-2 block text-sm font-medium text-slate-800 hover:text-[#003893]">
                                                    {notice.title}
                                                </span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </Reveal>

                        <Reveal delay={100} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <h2 className="mb-3 font-semibold text-slate-900">{t("noticesPage.sidebar.links")}</h2>

                            <div className="space-y-2">
                                {[
                                    { to: "/downloads", icon: FaDownload, label: t("noticesPage.sidebar.downloads") },
                                    { to: "/complaint", icon: FaExclamationCircle, label: t("noticesPage.sidebar.complaint") },
                                    { to: "/emergency", icon: FaPhoneAlt, label: t("noticesPage.sidebar.emergency") },
                                ].map(({ to, icon: Icon, label }) => (
                                    <Link
                                        key={to}
                                        to={to}
                                        className="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-2.5 text-sm text-slate-700 transition hover:border-[#003893]/30 hover:bg-[#003893]/5 hover:text-[#003893]"
                                    >
                                        <Icon className="text-[#003893]" />
                                        {label}
                                        <FaArrowRight className="ml-auto text-xs text-slate-400" />
                                    </Link>
                                ))}
                            </div>
                        </Reveal>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default NoticePage;
