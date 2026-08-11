import { useEffect } from "react";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getEvents } from "../../redux/slices/eventSlice";

const LatestEvent = () => {
  const dispatch = useDispatch();

  const { events } = useSelector((state) => state.event);

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  const latestEvents = [...events]
    .filter((event) => event.status === "upcoming")
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 3);

  return (
    <div>
      {/* Heading */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-[#d9a441]">
            Upcoming
          </p>

          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Latest Events
          </h2>
        </div>

        <Link
          to="/events"
          className="flex items-center gap-2 text-sm font-semibold text-[#2c5d79] transition hover:text-[#234b61]"
        >
          View All
          <FaArrowRight className="text-xs" />
        </Link>
      </div>

      {/* Cards */}
      <div className="space-y-5">
        {latestEvents.length > 0 ? (
          latestEvents.map((event) => (
            <Link
              key={event._id}
              to={`/events/${event._id}`}
              className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={
                    event.image?.url ||
                    "https://placehold.co/600x400?text=Event"
                  }
                  alt={event.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <span className="absolute left-3 top-3 rounded-full bg-[#d9a441] px-3 py-1 text-xs font-semibold text-white">
                  {event.category}
                </span>

                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="line-clamp-2 text-lg font-bold text-white">
                    {event.title}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="flex items-center justify-between p-4 text-sm text-slate-600">
                <span className="flex items-center gap-2">
                  <FaCalendarAlt className="text-[#2c5d79]" />
                  {new Date(event.startDate).toLocaleDateString()}
                </span>

                <span className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-[#2c5d79]" />
                  {event.location?.municipality}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white py-10 text-center">
            <p className="text-gray-500">
              No upcoming events available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestEvent;