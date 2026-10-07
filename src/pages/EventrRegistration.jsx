import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    checkRegistration,
    getEventById,
    registerEvent,
} from "../redux/slices/eventSlice";

const EventrRegistration = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const { event, loading, registerLoading, isRegistered } = useSelector(
        (state) => state.event
    );

    const { userInfo } = useSelector((state) => state.auth);

    const [phone, setPhone] = useState("");

    useEffect(() => {
        dispatch(getEventById(id));
        dispatch(checkRegistration(id));
    }, [dispatch, id]);

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            await dispatch(
                registerEvent({
                    id,
                    phone,
                })
            ).unwrap();

            await dispatch(checkRegistration(id));

            toast.success("Event registration successful.");

            setPhone("");
        } catch (error) {
            toast.error(error.message || "Registration failed.");
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#2c5d79] border-t-transparent"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="py-24 text-center">
                <h2 className="text-3xl font-bold">Event not found</h2>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-gray-50 pt-28 pb-16">
            <div className="max-w-3xl mx-auto px-4">
                <Link
                    to={`/events/${event._id}`}
                    className="mb-6 inline-flex items-center gap-2 text-[#2c5d79]"
                >
                    <FaArrowLeft />
                    Back to Event
                </Link>

                <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
                    <img
                        src={
                            event.image?.url ||
                            "https://placehold.co/900x350?text=Event"
                        }
                        alt={event.title}
                        className="h-60 w-full object-cover"
                    />

                    <div className="p-8">
                        <h1 className="text-3xl font-bold">{event.title}</h1>

                        <div className="mt-5 space-y-3 text-gray-600">
                            <div className="flex items-center gap-2">
                                <FaCalendarAlt className="text-[#2c5d79]" />

                                <span>
                                    {new Date(event.startDate).toLocaleDateString("en-GB", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                    {" | "}
                                    {event.startTime} - {event.endTime}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-[#2c5d79]" />

                                <span>
                                    {[
                                        event.location?.venue,
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

                        <hr className="my-8" />

                        {isRegistered ? (
                            <div className="rounded-xl border border-green-300 bg-green-50 p-6 text-center">
                                <h2 className="text-2xl font-bold text-green-700">
                                    You have already registered for this event.
                                </h2>

                                <p className="mt-2 text-gray-600">
                                    Thank you for registering. We look forward to seeing you at
                                    the event.
                                </p>

                                <Link
                                    to={`/events/${event._id}`}
                                    className="mt-6 inline-block rounded-lg bg-[#2c5d79] px-6 py-3 text-white hover:bg-[#234b61]"
                                >
                                    Back to Event
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={submitHandler} className="space-y-5">
                                <div>
                                    <label className="mb-2 block font-medium">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        value={userInfo?.name || ""}
                                        disabled
                                        className="w-full rounded-lg border bg-gray-100 px-4 py-3"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block font-medium">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        value={userInfo?.email || ""}
                                        disabled
                                        className="w-full rounded-lg border bg-gray-100 px-4 py-3"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block font-medium">
                                        Phone Number
                                    </label>

                                    <input
                                        type="tel"
                                        placeholder="98XXXXXXXX"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        pattern="^(97|98)\d{8}$"
                                        title="Enter a valid Nepali mobile number"
                                        required
                                        className="w-full rounded-lg border px-4 py-3 focus:border-[#2c5d79] focus:outline-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={registerLoading}
                                    className="w-full rounded-lg bg-[#2c5d79] py-3 font-semibold text-white transition hover:bg-[#234b61] disabled:cursor-not-allowed disabled:bg-gray-400"
                                >
                                    {registerLoading
                                        ? "Registering..."
                                        : "Confirm Registration"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EventrRegistration;