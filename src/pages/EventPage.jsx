import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FaChevronDown, FaSearch } from "react-icons/fa";

import EventHero from "../components/index/event/EventHero";
import EventCard from "../components/index/event/EventCard";
import FeaturedEvent from "../components/index/event/FeaturedEvent";
import Reveal from "../components/common/Reveal";
import { getEvents } from "../redux/slices/eventSlice";

const STATUSES = ["", "upcoming", "ongoing", "completed", "cancelled"];
const CATEGORIES = [
    "Health Camp", "Blood Donation", "Agriculture", "Training", "Meeting", "Festival",
    "Sports", "Education", "Culture", "Environment", "Other",
];
const PAGE_SIZE = 9;

// Kram: jari -> aagami (najik pahile) -> sampanna/radda (naya pahile)
const STATUS_ORDER = { ongoing: 0, upcoming: 1, completed: 2, cancelled: 3 };

const sortEvents = (list) =>
    [...list].sort((a, b) => {
        const order = (STATUS_ORDER[a.status] ?? 4) - (STATUS_ORDER[b.status] ?? 4);
        if (order !== 0) return order;

        const diff = new Date(a.startDate) - new Date(b.startDate);
        return a.status === "upcoming" || a.status === "ongoing" ? diff : -diff;
    });

const EventPage = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const { events = [], loading, error } = useSelector((state) => state.event);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("");
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    useEffect(() => {
        dispatch(getEvents());
    }, [dispatch]);

    const keyword = search.trim().toLowerCase();

    const filtered = sortEvents(
        events.filter((event) => {
            const matchSearch =
                !keyword ||
                event.title?.toLowerCase().includes(keyword) ||
                event.description?.toLowerCase().includes(keyword);

            return matchSearch && (!category || event.category === category) && (!status || event.status === status);
        })
    );

    const counts = events.reduce((acc, event) => {
        acc[event.status] = (acc[event.status] || 0) + 1;
        return acc;
    }, {});

    // Filter nagareko bela matra mathi thulo banner (jari wa najik aaune)
    const featured =
        !keyword && !category && (!status || status === "upcoming" || status === "ongoing")
            ? filtered.find((event) => event.status === "ongoing" || event.status === "upcoming")
            : null;

    const list = featured ? filtered.filter((event) => event._id !== featured._id) : filtered;
    const shown = list.slice(0, visibleCount);

    const changeFilter = (setter) => (value) => {
        setter(value);
        setVisibleCount(PAGE_SIZE);
    };

    const hasFilter = search || category || status;

    return (
        <div className="min-h-screen bg-slate-100 pb-16">
            <EventHero />

            <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">

                {/* Status tabs + filters */}
                <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div role="tablist" className="flex overflow-x-auto bg-[#003893]">
                        {STATUSES.map((value) => (
                            <button
                                key={value || "all"}
                                role="tab"
                                aria-selected={status === value}
                                onClick={() => changeFilter(setStatus)(value)}
                                className={`flex shrink-0 items-center gap-2 border-b-4 px-5 py-3.5 text-sm font-semibold transition ${
                                    status === value
                                        ? "border-[#dc143c] bg-white/15 text-white"
                                        : "border-transparent text-white/75 hover:bg-white/10 hover:text-white"
                                }`}
                            >
                                {t(`eventsPage.tabs.${value || "all"}`)}
                                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px]">
                                    {value ? counts[value] || 0 : events.length}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="grid gap-3 p-4 md:grid-cols-[1fr_16rem_auto]">
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => changeFilter(setSearch)(e.target.value)}
                                placeholder={t("eventsPage.searchPlaceholder")}
                                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#003893] focus:ring-2 focus:ring-[#003893]/20"
                            />
                        </div>

                        <select
                            value={category}
                            onChange={(e) => changeFilter(setCategory)(e.target.value)}
                            className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#003893] focus:ring-2 focus:ring-[#003893]/20"
                        >
                            <option value="">{t("eventsPage.allCategories")}</option>
                            {CATEGORIES.map((value) => (
                                <option key={value} value={value}>
                                    {t(`eventsPage.categories.${value}`)}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={() => {
                                setSearch("");
                                setCategory("");
                                setStatus("");
                                setVisibleCount(PAGE_SIZE);
                            }}
                            disabled={!hasFilter}
                            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                        >
                            {t("eventsPage.reset")}
                        </button>
                    </div>
                </div>

                {loading && events.length === 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div key={item} className="animate-pulse overflow-hidden rounded-2xl bg-white">
                                <div className="h-48 bg-slate-200" />
                                <div className="space-y-3 p-5">
                                    <div className="h-3 w-24 rounded bg-slate-200" />
                                    <div className="h-5 w-3/4 rounded bg-slate-200" />
                                    <div className="h-4 w-1/2 rounded bg-slate-200" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error && events.length === 0 ? (
                    <p className="rounded-xl border border-red-200 bg-red-50 py-10 text-center text-red-600">
                        {t("eventsPage.failed")}
                    </p>
                ) : filtered.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-slate-300 bg-white py-12 text-center text-slate-500">
                        {t("eventsPage.empty")}
                    </p>
                ) : (
                    <>
                        <FeaturedEvent event={featured} />

                        <p className="mb-4 text-sm text-slate-500">
                            {t("eventsPage.results", { count: filtered.length })}
                        </p>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {shown.map((event, index) => (
                                <Reveal key={event._id} delay={(index % PAGE_SIZE) * 60}>
                                    <EventCard event={event} />
                                </Reveal>
                            ))}
                        </div>

                        {list.length > visibleCount && (
                            <div className="mt-8 text-center">
                                <button
                                    onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                                    className="inline-flex items-center gap-2 rounded-lg border border-[#003893] px-6 py-2.5 text-sm font-semibold text-[#003893] transition hover:bg-[#003893] hover:text-white"
                                >
                                    {t("eventsPage.loadMore")}
                                    <FaChevronDown className="text-xs" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default EventPage;
