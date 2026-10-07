import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaArrowRight, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { formatBS } from "../../../utils/nepaliDate";
import { eventLocation } from "./eventUtils";

const DAY_MS = 24 * 60 * 60 * 1000;

// Event suru huna kati din baki (startDate + startTime)
const daysUntil = (event) => {
    const start = new Date(event.startDate);
    const [hour, minute] = (event.startTime || "00:00").split(":").map(Number);
    start.setHours(hour || 0, minute || 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDay = new Date(start);
    startDay.setHours(0, 0, 0, 0);

    return Math.round((startDay - today) / DAY_MS);
};

// Najik aaune (wa chalirakheko) karyakram ko thulo banner
const FeaturedEvent = ({ event }) => {
    const { t, i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage === "en";

    if (!event) return null;

    const days = daysUntil(event);
    const countdown =
        event.status === "ongoing"
            ? t("eventsPage.happeningNow")
            : days <= 0
              ? t("eventsPage.today")
              : t("eventsPage.daysLeft", { count: days });

    return (
        <Link
            to={`/events/${event._id}`}
            className="animate-fade-up group mb-10 grid overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-xl md:grid-cols-5"
        >
            <div className="relative h-56 overflow-hidden md:col-span-2 md:h-full md:min-h-72">
                <img
                    src={event.image?.url || "https://placehold.co/800x600?text=Event"}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-[#d9a441] px-3 py-1 text-xs font-bold text-[#10151c]">
                    <FaStar />
                    {t("eventsPage.featured")}
                </span>
            </div>

            <div className="flex flex-col justify-center border-l-4 border-[#dc143c] p-6 md:col-span-3 md:p-10">
                <span className="w-fit rounded-full bg-[#dc143c]/10 px-3 py-1 text-sm font-bold text-[#dc143c]">
                    {countdown}
                </span>

                {event.category && (
                    <span className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#d9a441]">
                        {t(`eventsPage.categories.${event.category}`, { defaultValue: event.category })}
                    </span>
                )}

                <h2 className="mt-1 text-2xl font-bold text-slate-900 group-hover:text-[#003893] sm:text-3xl">
                    {event.title}
                </h2>

                <p className="mt-3 line-clamp-2 text-slate-500">{event.description}</p>

                <div className="mt-5 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                    <p className="flex items-center gap-2">
                        <FaCalendarAlt className="text-[#003893]" />
                        {formatBS(event.startDate, isEn, "YYYY MMMM DD, ddd")}
                    </p>
                    {event.startTime && (
                        <p className="flex items-center gap-2">
                            <FaClock className="text-[#003893]" />
                            {event.startTime}{event.endTime && ` - ${event.endTime}`}
                        </p>
                    )}
                    {eventLocation(event) && (
                        <p className="flex items-center gap-2 sm:col-span-2">
                            <FaMapMarkerAlt className="text-[#003893]" />
                            {eventLocation(event)}
                        </p>
                    )}
                </div>

                <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg bg-[#003893] px-5 py-2.5 text-sm font-semibold text-white transition group-hover:bg-[#dc143c]">
                    {t("eventsPage.viewDetails")}
                    <FaArrowRight className="text-xs transition group-hover:translate-x-1" />
                </span>
            </div>
        </Link>
    );
};

export default FeaturedEvent;
