import { useEffect } from "react";
import {
    FaArrowLeft,
    FaCalendarAlt,
    FaClock,
    FaMapMarkerAlt,
    FaPhone,
    FaUser,
    FaUsers,
    FaEnvelope,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getEventById } from "../redux/slices/eventSlice";

const statusColors = {
    upcoming: "bg-blue-100 text-blue-700",
    ongoing: "bg-green-100 text-green-700",
    completed: "bg-gray-200 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
};

const EventDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { event, loading } = useSelector((state) => state.event);
    // console.log(event)

    useEffect(() => {
        dispatch(getEventById(id));
    }, [dispatch, id]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#2c5d79] border-t-transparent"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <h2 className="text-3xl font-bold text-gray-700">
                    Event Not Found
                </h2>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-gray-50 pt-26 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back */}
                <Link
                    to="/events"
                    className="inline-flex items-center gap-2 text-[#2c5d79] font-medium hover:text-[#234b61] mb-8"
                >
                    <FaArrowLeft />
                    Back to Events
                </Link>

                <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
                    {/* Image */}
                    <img
                        src={
                            event.image?.url ||
                            "https://placehold.co/1200x500?text=Event"
                        }
                        alt={event.title}
                        className="h-72 sm:h-96 w-full object-cover"
                    />

                    <div className="p-6 sm:p-8">
                        {/* Category & Status */}
                        <div className="flex flex-wrap gap-3 mb-5">
                            <span className="rounded-full bg-yellow-500 px-4 py-1 text-sm font-medium text-white">
                                {event.category}
                            </span>

                            <span
                                className={`rounded-full px-4 py-1 text-sm font-medium capitalize ${statusColors[event.status]
                                    }`}
                            >
                                {event.status}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
                            {event.title}
                        </h1>

                        {/* Description */}
                        <p className="mt-5 leading-8 text-gray-600">
                            {event.description}
                        </p>

                        {/* Information */}
                        <div className="mt-10 grid gap-8 md:grid-cols-2">
                            {/* Left */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-3">
                                    <FaCalendarAlt className="text-[#2c5d79]" />
                                    <span>
                                        {new Date(event.startDate).toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}{" "}
                                        -{" "}
                                        {new Date(event.endDate).toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <FaClock className="text-[#2c5d79]" />
                                    <span>
                                        {event.startTime} - {event.endTime}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <FaMapMarkerAlt className="text-[#2c5d79]" />
                                    <span>
                                        {[
                                            event.location?.venue,
                                            event.location?.tole,
                                            event.location?.ward &&
                                            `Ward ${event.location.ward}`,
                                            event.location?.municipality,
                                            event.location?.district,
                                        ]
                                            .filter(Boolean)
                                            .join(", ")}
                                    </span>
                                </div>
                            </div>

                            {/* Right */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-3">
                                    <FaUser className="text-[#2c5d79]" />
                                    <span>{event.organizer}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <FaPhone className="text-[#2c5d79]" />
                                    <span>{event.contact}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <FaEnvelope className="text-[#2c5d79]" />
                                    <span>{event.email || "N/A"}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <FaUsers className="text-[#2c5d79]" />
                                    <span>
                                        {event.currentParticipants} / {event.maxParticipants}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Registration Button */}
                        <div className="mt-10">
                            {event.isRegistrationRequired ? (
                                event.status === "upcoming" ? (
                                    event.maxParticipants === 0 ||
                                        event.currentParticipants < event.maxParticipants ? (
                                        <button
                                            onClick={() => navigate(`/events/${event._id}/register`)}
                                            className="inline-flex items-center gap-2 rounded-lg bg-[#2c5d79] px-6 py-3 font-medium text-white transition hover:bg-[#234b61]"
                                        >
                                            Register Now
                                        </button>
                                    ) : (
                                        <button
                                            disabled
                                            className="cursor-not-allowed rounded-lg bg-red-500 px-6 py-3 text-white"
                                        >
                                            Registration Full
                                        </button>
                                    )
                                ) : (
                                    <button
                                        disabled
                                        className="cursor-not-allowed rounded-lg bg-gray-400 px-6 py-3 text-white"
                                    >
                                        Registration Closed
                                    </button>
                                )
                            ) : (
                                <button
                                    disabled
                                    className="cursor-not-allowed rounded-lg bg-gray-300 px-6 py-3 text-gray-600"
                                >
                                    Registration Not Required
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EventDetails;