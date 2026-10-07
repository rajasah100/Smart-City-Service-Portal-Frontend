import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaArrowRight, FaClock, FaMapMarkerAlt, FaTicketAlt, FaUsers } from "react-icons/fa";
import { bsParts } from "../../../utils/nepaliDate";
import { STATUS_STYLES, eventLocation } from "./eventUtils";


const EventCard = ({ event }) => {
    const { t, i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage === "en";
    const date = bsParts(event.startDate, isEn);
    const location = eventLocation(event);
    const finished = event.status === "completed" || event.status === "cancelled";

    return (
        <Link
            to={`/events/${event._id}`}
            className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                finished ? "opacity-90" : ""
            }`}
        >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={event.image?.url || "https://placehold.co/600x400?text=Event"}
                    alt=""
                    className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${finished ? "grayscale-[40%]" : ""}`}
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />

                {/* BS date box */}
                <div className="absolute bottom-3 left-3 flex h-16 w-16 flex-col items-center justify-center rounded-lg bg-white text-center shadow-md">
                    <span className="text-xl font-bold leading-none text-[#dc143c]">{date.day}</span>
                    <span className="mt-0.5 text-[10px] font-medium text-[#003893]">{date.month}</span>
                    <span className="text-[9px] text-slate-500">{date.year}</span>
                </div>

                {event.status && (
                    <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[event.status] || STATUS_STYLES.upcoming}`}>
                        {t(`eventsPage.tabs.${event.status}`)}
                    </span>
                )}
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col p-5">
                {event.category && (
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#d9a441]">
                        {t(`eventsPage.categories.${event.category}`, { defaultValue: event.category })}
                    </span>
                )}

                <h3 className="mt-1 line-clamp-2 text-lg font-bold text-slate-900 group-hover:text-[#003893]">
                    {event.title}
                </h3>

                <div className="mt-3 space-y-1.5 text-sm text-slate-500">
                    {(event.startTime || event.endTime) && (
                        <p className="flex items-center gap-2">
                            <FaClock className="shrink-0 text-[#003893]" />
                            {event.startTime}{event.endTime && ` - ${event.endTime}`}
                        </p>
                    )}

                    <p className="flex items-center gap-2">
                        <FaMapMarkerAlt className="shrink-0 text-[#003893]" />
                        <span className="line-clamp-1">{location || t("eventsPage.locationNA")}</span>
                    </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {event.isRegistrationRequired && !finished ? (
                        <>
                            <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-700">
                                <FaTicketAlt className="text-[10px]" />
                                {t("eventsPage.registrationOpen")}
                            </span>
                            {event.maxParticipants > 0 && (
                                <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                                    <FaUsers className="text-[10px]" />
                                    {t("eventsPage.seats", { current: event.currentParticipants || 0, max: event.maxParticipants })}
                                </span>
                            )}
                        </>
                    ) : (
                        !event.isRegistrationRequired && (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                                {t("eventsPage.free")}
                            </span>
                        )
                    )}
                </div>

                <span className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-semibold text-[#003893]">
                    <span className="pt-1">{t("eventsPage.viewDetails")}</span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#003893] text-white transition group-hover:translate-x-1 group-hover:bg-[#dc143c]">
                        <FaArrowRight className="text-xs" />
                    </span>
                </span>
            </div>
        </Link>
    );
};

export default EventCard;
