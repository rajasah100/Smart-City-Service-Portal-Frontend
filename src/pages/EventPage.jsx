import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import EventHero from "../components/index/event/EventHero";
import EventFilter from "../components/index/event/EventFilter";
import EventCard from "../components/index/event/EventCard";

import { getEvents } from "../redux/slices/eventSlice";

const EventPage = () => {
    const dispatch = useDispatch();

    const { events, loading } = useSelector((state) => state.event);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        dispatch(getEvents());
    }, [dispatch]);

    const filteredEvents = events.filter((event) => {
        const matchSearch =
            event.title.toLowerCase().includes(search.toLowerCase()) ||
            event.description.toLowerCase().includes(search.toLowerCase());

        const matchCategory =
            category === "" || event.category === category;

        const matchStatus =
            status === "" || event.status === status;

        return matchSearch && matchCategory && matchStatus;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <EventHero />

            {/* Filter */}
            <EventFilter
                search={search}
                setSearch={setSearch}
                category={category}
                setCategory={setCategory}
                status={status}
                setStatus={setStatus}
            />

            {/* Events */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Upcoming Events
                    </h2>

                    <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
                        Explore upcoming programs, community activities, festivals,
                        health camps, training sessions, and many more.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="h-10 w-10 rounded-full border-4 border-[#2c5d79] border-t-transparent animate-spin"></div>
                    </div>
                ) : filteredEvents.length > 0 ? (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredEvents.map((event) => (
                            <EventCard
                                key={event._id}
                                event={event}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl bg-white border border-dashed border-gray-300 py-16 text-center">
                        <h3 className="text-xl font-semibold text-gray-700">
                            No Events Found
                        </h3>

                        <p className="mt-2 text-gray-500">
                            Try changing the search or filter options.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default EventPage;