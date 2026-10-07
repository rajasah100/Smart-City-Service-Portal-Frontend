import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NepaliDate from "nepali-date-converter";

import { getEvents } from "../../redux/slices/eventSlice";

const LatestEvent = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isEn = i18n.resolvedLanguage === "en";

  const { events = [], loading, error } = useSelector(
    (state) => state.event
  );

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  // Pahile upcoming/ongoing event (najik ko pahile)
  const upcomingEvents = events
    .filter(
      (event) => event.status === "upcoming" || event.status === "ongoing"
    )
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() -
        new Date(b.startDate).getTime()
    );

  // Upcoming chaina bhane bhakhar sakiyeka event dekhaune (naya pahile)
  const hasUpcoming = upcomingEvents.length > 0;

  const latestEvents = (
    hasUpcoming
      ? upcomingEvents
      : events
          .filter((event) => event.status === "completed")
          .sort(
            (a, b) =>
              new Date(b.startDate).getTime() -
              new Date(a.startDate).getTime()
          )
  ).slice(0, 3);

  const statusBadge = {
    upcoming: "bg-blue-50 text-[#003893]",
    ongoing: "bg-green-50 text-green-700",
    completed: "bg-slate-100 text-slate-600",
    cancelled: "bg-red-50 text-red-600",
  };

  // Sarkari site jastai BS miti
  const formatDate = (date) => {
    if (!date) return t("homeGov.board.dateNA");

    try {
      return new NepaliDate(new Date(date)).format("YYYY MMMM DD", isEn ? "en" : "np");
    } catch {
      return t("homeGov.board.dateNA");
    }
  };

  return (
    <section>
      {/* Heading */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-[#d9a441]">
            {hasUpcoming || latestEvents.length === 0
              ? t("homeGov.board.eventsLabelUpcoming")
              : t("homeGov.board.eventsLabelRecent")}
          </p>

          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {t("homeGov.board.eventsTitle")}
          </h2>
        </div>

        <Link
          to="/events"
          className="group flex items-center gap-2 text-sm font-semibold text-[#2c5d79] transition hover:text-[#234b61]"
        >
          {t("homeGov.board.viewAll")}
          <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
          <p className="text-sm text-red-600">
            {t("homeGov.board.failedEvents")}
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && !error && (
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex animate-pulse gap-3 rounded-xl border border-slate-200 bg-white p-3"
            >
              <div className="h-20 w-24 shrink-0 rounded-lg bg-slate-200" />

              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 w-3/4 rounded bg-slate-200" />
                <div className="h-3 w-1/2 rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Events */}
      {!loading && !error && (
        <div className="space-y-3">
          {latestEvents.length > 0 ? (
            latestEvents.map((event) => (
              <Link
                key={event._id}
                to={`/events/${event._id}`}
                className="group flex gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-[#003893]/30 hover:shadow-md"
              >
                <img
                  src={event.image?.url || "https://placehold.co/300x200?text=Event"}
                  alt=""
                  className="h-20 w-24 shrink-0 rounded-lg object-cover"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 text-sm font-semibold text-slate-800 group-hover:text-[#003893]">
                      {event.title}
                    </h3>

                    {statusBadge[event.status] && (
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${statusBadge[event.status]}`}>
                        {t(`homeGov.board.status.${event.status}`)}
                      </span>
                    )}
                  </div>

                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#dc143c]">
                    <FaCalendarAlt className="shrink-0" />
                    {formatDate(event.startDate)}
                  </p>

                  <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                    <FaMapMarkerAlt className="shrink-0" />
                    <span className="truncate">
                      {event.location?.municipality ||
                        event.location?.address ||
                        t("homeGov.board.locationNA")}
                    </span>
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center">
              <p className="text-sm text-slate-500">
                {t("homeGov.board.noEvents")}
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default LatestEvent;
