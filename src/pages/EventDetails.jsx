import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
    FaArrowLeft,
    FaBan,
    FaCalendarAlt,
    FaCheckCircle,
    FaChevronRight,
    FaClock,
    FaEnvelope,
    FaExclamationCircle,
    FaMapMarkedAlt,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaTicketAlt,
    FaUserTie,
} from "react-icons/fa";

import apiRequest from "../utils/apiRequest";
import { formatBS } from "../utils/nepaliDate";
import { applySeo, eventJsonLd } from "../utils/seo";
import { STATUS_STYLES } from "../components/index/event/eventUtils";

const InfoRow = ({ icon: Icon, label, children }) => (
    <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#003893]/10 text-[#003893]">
            <Icon />
        </span>
        <div className="min-w-0">
            <p className="text-xs text-slate-500">{label}</p>
            <div className="text-sm font-medium text-slate-800">{children}</div>
        </div>
    </div>
);

const EventDetails = () => {
    const { id } = useParams();
    const { t, i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage === "en";
    const { userInfo } = useSelector((state) => state.auth);
    const isCitizen = userInfo?.role === "user";

    // Kun ID ko data ho tyo pani rakhne, natra arko event kholda purano dekhincha
    const [result, setResult] = useState({ id: null, event: null, status: "loading" });
    const [registered, setRegistered] = useState({ id: null, value: false });
    const [others, setOthers] = useState([]);

    useEffect(() => {
        let ignore = false;

        apiRequest
            .get(`/events/${id}`)
            .then(({ data }) => {
                if (!ignore) setResult({ id, event: data.event, status: "ok" });
            })
            .catch((error) => {
                if (!ignore) setResult({ id, event: null, status: error.response?.status === 404 ? "notFound" : "failed" });
            });

        window.scrollTo({ top: 0 });

        return () => {
            ignore = true;
        };
    }, [id]);

    // Citizen le pahile nai darta gareko cha ki
    useEffect(() => {
        if (!isCitizen) return;

        let ignore = false;

        apiRequest
            .get(`/events/${id}/check`)
            .then(({ data }) => {
                if (!ignore) setRegistered({ id, value: !!data.isRegistered });
            })
            .catch(() => {});

        return () => {
            ignore = true;
        };
    }, [id, isCitizen]);

    // Arulai dekhaune aru karyakram (aagami pahile)
    useEffect(() => {
        let ignore = false;

        apiRequest
            .get("/events")
            .then(({ data }) => {
                if (ignore) return;

                const list = (data.events || []).filter((item) => item._id !== id);
                const active = list.filter((item) => item.status === "upcoming" || item.status === "ongoing");
                const rest = list
                    .filter((item) => item.status === "completed")
                    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

                setOthers([...active, ...rest].slice(0, 3));
            })
            .catch(() => {
                if (!ignore) setOthers([]);
            });

        return () => {
            ignore = true;
        };
    }, [id]);

    const event = result.id === id ? result.event : null;
    const status = result.id === id ? result.status : "loading";
    const isRegistered = registered.id === id && registered.value;

    // SEO: title, description, share image ra Google ko Event structured data
    useEffect(() => {
        if (!event?.title) return;
        applySeo({
            siteName: t("seo.siteName"),
            title: event.title,
            description: event.description,
            path: `/events/${id}`,
            image: event.image?.url,
            type: "article",
            lang: i18n.resolvedLanguage === "en" ? "en" : "ne",
            jsonLd: eventJsonLd(event, t("seo.siteName")),
        });
    }, [event, id, t, i18n.resolvedLanguage]);

    // ===== Loading =====
    if (status === "loading") {
        return (
            <section className="min-h-screen bg-slate-100 pb-16 pt-24">
                <div className="mx-auto max-w-7xl animate-pulse px-4 sm:px-6 lg:px-8">
                    <div className="h-72 rounded-2xl bg-slate-200" />
                    <div className="mt-8 grid gap-8 lg:grid-cols-3">
                        <div className="h-64 rounded-2xl bg-white lg:col-span-2" />
                        <div className="h-64 rounded-2xl bg-white" />
                    </div>
                </div>
            </section>
        );
    }

    // ===== Not found / error =====
    if (!event) {
        return (
            <section className="flex min-h-screen items-center justify-center bg-slate-100 px-4 pt-24">
                <div className="max-w-md rounded-2xl bg-white p-10 text-center shadow-sm">
                    <FaExclamationCircle className="mx-auto text-5xl text-[#dc143c]" />
                    <h1 className="mt-4 text-2xl font-bold text-slate-900">
                        {status === "notFound" ? t("eventDetail.notFoundTitle") : t("eventDetail.failed")}
                    </h1>
                    {status === "notFound" && <p className="mt-2 text-slate-500">{t("eventDetail.notFoundText")}</p>}
                    <Link
                        to="/events"
                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#003893] px-5 py-2.5 font-semibold text-white hover:bg-[#002a6e]"
                    >
                        <FaArrowLeft />
                        {t("eventDetail.back")}
                    </Link>
                </div>
            </section>
        );
    }

    const loc = event.location || {};
    const venue = [
        loc.venue,
        loc.tole,
        loc.ward && t("eventDetail.ward", { ward: loc.ward }),
        loc.municipality,
        loc.district,
    ]
        .filter(Boolean)
        .join(", ");

    const sameDay = new Date(event.startDate).toDateString() === new Date(event.endDate).toDateString();
    const dateText = sameDay || !event.endDate
        ? formatBS(event.startDate, isEn, "YYYY MMMM DD, ddd")
        : `${formatBS(event.startDate, isEn, "YYYY MMMM DD")} - ${formatBS(event.endDate, isEn, "YYYY MMMM DD")}`;

    const max = event.maxParticipants || 0;
    const current = event.currentParticipants || 0;
    const hasSeats = max === 0 || current < max;
    const percent = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0;
    const category = event.category && t(`eventsPage.categories.${event.category}`, { defaultValue: event.category });

    // Darta box ma ke dekhaune
    let registration;

    if (event.status === "cancelled") {
        registration = { icon: FaBan, tone: "red", text: t("eventDetail.cancelled") };
    } else if (!event.isRegistrationRequired) {
        registration = { icon: FaCheckCircle, tone: "green", text: t("eventDetail.notRequired") };
    } else if (isRegistered) {
        registration = { icon: FaCheckCircle, tone: "green", text: t("eventDetail.registered") };
    } else if (event.status !== "upcoming") {
        registration = { icon: FaBan, tone: "slate", text: t("eventDetail.closed") };
    } else if (!hasSeats) {
        registration = { icon: FaBan, tone: "red", text: t("eventDetail.full") };
    }

    const tones = {
        red: "bg-red-50 text-[#dc143c]",
        green: "bg-green-50 text-green-700",
        slate: "bg-slate-100 text-slate-600",
    };

    return (
        <section className="min-h-screen bg-slate-100 pb-16 pt-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                    <Link to="/" className="hover:text-[#003893]">{t("eventDetail.home")}</Link>
                    <FaChevronRight className="text-[10px]" />
                    <Link to="/events" className="hover:text-[#003893]">{t("eventDetail.events")}</Link>
                    <FaChevronRight className="text-[10px]" />
                    <span className="line-clamp-1 max-w-xs font-medium text-slate-700">{event.title}</span>
                </nav>

                {/* Banner */}
                <div className="animate-fade-up relative overflow-hidden rounded-2xl bg-[#10151c] shadow-md">
                    {/* Poster katiyos nabhanera: pachhadi blur, agadi pura photo */}
                    <img
                        src={event.image?.url || "https://placehold.co/1200x500?text=Event"}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-xl"
                    />
                    <img
                        src={event.image?.url || "https://placehold.co/1200x500?text=Event"}
                        alt={event.title}
                        className={`relative h-72 w-full object-contain sm:h-112 ${event.status === "completed" || event.status === "cancelled" ? "opacity-90" : ""}`}
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-[#0b1b3a]/95 via-[#0b1b3a]/40 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                        <div className="flex flex-wrap items-center gap-2">
                            {category && (
                                <span className="rounded-full bg-[#d9a441] px-3 py-1 text-xs font-bold text-[#10151c]">{category}</span>
                            )}
                            {event.status && (
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[event.status] || STATUS_STYLES.upcoming}`}>
                                    {t(`eventsPage.tabs.${event.status}`)}
                                </span>
                            )}
                        </div>

                        <h1 className="mt-3 max-w-3xl border-l-4 border-[#dc143c] pl-4 text-2xl font-bold leading-snug text-white sm:text-4xl">
                            {event.title}
                        </h1>

                        <p className="mt-3 flex items-center gap-2 pl-5 text-sm text-slate-200">
                            <FaCalendarAlt />
                            {dateText}
                        </p>
                    </div>
                </div>

                <div className="mt-8 grid gap-8 lg:grid-cols-3">

                    {/* ===== Main ===== */}
                    <div className="animate-fade-up space-y-6 lg:col-span-2" style={{ "--delay": "100ms" }}>
                        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
                            <h2 className="mb-4 flex items-center gap-3 text-lg font-bold text-slate-900">
                                <span className="h-6 w-1 rounded-full bg-[#dc143c]" />
                                {t("eventDetail.about")}
                            </h2>
                            <p className="whitespace-pre-line text-[15px] leading-8 text-slate-700">{event.description}</p>
                        </div>

                        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
                            <h2 className="mb-6 flex items-center gap-3 text-lg font-bold text-slate-900">
                                <span className="h-6 w-1 rounded-full bg-[#dc143c]" />
                                {t("eventDetail.info")}
                            </h2>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <InfoRow icon={FaCalendarAlt} label={t("eventDetail.date")}>
                                    {dateText}
                                    <span className="block text-xs font-normal text-slate-500">
                                        {new Date(event.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} AD
                                    </span>
                                </InfoRow>

                                {(event.startTime || event.endTime) && (
                                    <InfoRow icon={FaClock} label={t("eventDetail.time")}>
                                        {event.startTime}{event.endTime && ` - ${event.endTime}`}
                                    </InfoRow>
                                )}

                                {venue && (
                                    <InfoRow icon={FaMapMarkerAlt} label={t("eventDetail.venue")}>
                                        {venue}
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#003893] hover:underline"
                                        >
                                            <FaMapMarkedAlt />
                                            {t("eventDetail.viewMap")}
                                        </a>
                                    </InfoRow>
                                )}

                                {event.organizer && (
                                    <InfoRow icon={FaUserTie} label={t("eventDetail.organizer")}>
                                        {event.organizer}
                                    </InfoRow>
                                )}

                                {event.contact && (
                                    <InfoRow icon={FaPhoneAlt} label={t("eventDetail.contact")}>
                                        <a href={`tel:${event.contact}`} className="hover:text-[#003893]">{event.contact}</a>
                                    </InfoRow>
                                )}

                                {event.email && (
                                    <InfoRow icon={FaEnvelope} label={t("eventDetail.email")}>
                                        <a href={`mailto:${event.email}`} className="break-all hover:text-[#003893]">{event.email}</a>
                                    </InfoRow>
                                )}
                            </div>
                        </div>

                        <Link to="/events" className="inline-flex items-center gap-2 text-sm font-semibold text-[#003893] hover:underline">
                            <FaArrowLeft className="text-xs" />
                            {t("eventDetail.back")}
                        </Link>
                    </div>

                    {/* ===== Sidebar ===== */}
                    <aside className="animate-fade-up space-y-6 lg:sticky lg:top-28 lg:self-start" style={{ "--delay": "200ms" }}>

                        {/* Registration */}
                        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                            <h2 className="flex items-center gap-2 bg-[#003893] px-5 py-3 font-semibold text-white">
                                <FaTicketAlt />
                                {t("eventDetail.registration")}
                            </h2>

                            <div className="space-y-4 p-5">
                                {event.isRegistrationRequired && event.status !== "cancelled" && (
                                    <div>
                                        <p className="text-sm text-slate-600">
                                            {max > 0
                                                ? t("eventDetail.seatsFilled", { current, max })
                                                : t("eventDetail.seatsUnlimited", { count: current })}
                                        </p>

                                        {max > 0 && (
                                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-700 ${percent >= 90 ? "bg-[#dc143c]" : "bg-[#003893]"}`}
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {registration ? (
                                    <p className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium ${tones[registration.tone]}`}>
                                        <registration.icon className="shrink-0" />
                                        {registration.text}
                                    </p>
                                ) : userInfo ? (
                                    <Link
                                        to={`/events/${event._id}/register`}
                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#dc143c] py-3 font-semibold text-white transition hover:bg-[#b51031]"
                                    >
                                        <FaTicketAlt />
                                        {t("eventDetail.register")}
                                    </Link>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="flex w-full items-center justify-center rounded-lg border border-[#003893] py-3 font-semibold text-[#003893] transition hover:bg-[#003893] hover:text-white"
                                    >
                                        {t("eventDetail.loginToRegister")}
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Other events */}
                        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                            <h2 className="border-b border-slate-100 px-5 py-3 font-semibold text-slate-900">
                                {t("eventDetail.otherEvents")}
                            </h2>

                            {others.length === 0 ? (
                                <p className="px-5 py-6 text-sm text-slate-500">{t("eventDetail.noOtherEvents")}</p>
                            ) : (
                                <ul className="divide-y divide-slate-100">
                                    {others.map((item) => (
                                        <li key={item._id}>
                                            <Link to={`/events/${item._id}`} className="group flex gap-3 p-4 transition hover:bg-slate-50">
                                                <img
                                                    src={item.image?.url || "https://placehold.co/200x150?text=Event"}
                                                    alt=""
                                                    className="h-16 w-20 shrink-0 rounded-lg object-cover"
                                                />
                                                <div className="min-w-0">
                                                    <span className="text-xs text-[#dc143c]">{formatBS(item.startDate, isEn)}</span>
                                                    <span className="mt-0.5 line-clamp-2 block text-sm font-medium text-slate-800 group-hover:text-[#003893]">
                                                        {item.title}
                                                    </span>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
};

export default EventDetails;
