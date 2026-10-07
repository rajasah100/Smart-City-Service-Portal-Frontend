import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllRegistrations } from "../../redux/slices/eventSlice";

const EventRegistrationPage = () => {
    const dispatch = useDispatch();

    const {
        registrations,
        registrationLoading,
    } = useSelector((state) => state.event);

    const [search, setSearch] = useState("");
    const [selectedEvent, setSelectedEvent] = useState("");

    useEffect(() => {
        dispatch(getAllRegistrations());
    }, [dispatch]);

    const eventOptions = useMemo(() => {
        const events = registrations.map(
            (item) => item.event?.title
        );

        return [...new Set(events)];
    }, [registrations]);

    const filteredRegistrations = registrations.filter((item) => {
        const matchesSearch =
            item.fullName
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
            item.email
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
            item.phone
                ?.includes(search);

        const matchesEvent =
            selectedEvent === "" ||
            item.event?.title === selectedEvent;

        return matchesSearch && matchesEvent;
    });

    return (
        <div>

            <div className="flex justify-between items-center mb-6">

                <div>
                    <h1 className="text-2xl font-bold">
                        Event Registrations
                    </h1>

                    <p className="text-gray-500">
                        View all registered users.
                    </p>
                </div>

                <div className="bg-blue-600 text-white px-5 py-3 rounded-lg">
                    Total Registrations : {registrations.length}
                </div>

            </div>

            {/* Search & Filter */}

            <div className="bg-white rounded-xl shadow p-4 mb-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="border rounded-lg p-3"
                    />

                    <select
                        value={selectedEvent}
                        onChange={(e) =>
                            setSelectedEvent(e.target.value)
                        }
                        className="border rounded-lg p-3"
                    >
                        <option value="">
                            All Events
                        </option>

                        {eventOptions.map((event) => (
                            <option
                                key={event}
                                value={event}
                            >
                                {event}
                            </option>
                        ))}
                    </select>

                </div>

            </div>

            {/* Registration Table */}

            <div className="overflow-x-auto bg-white rounded-xl shadow">

                <table className="w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="p-3 text-left">
                                Participant
                            </th>

                            <th className="p-3 text-left">
                                Event
                            </th>

                            <th className="p-3 text-center">
                                Phone
                            </th>

                            <th className="p-3 text-center">
                                Registered On
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {registrationLoading ? (

                            <tr>

                                <td
                                    colSpan="4"
                                    className="text-center p-6"
                                >
                                    Loading...
                                </td>

                            </tr>

                        ) : filteredRegistrations.length > 0 ? (

                            filteredRegistrations.map((registration) => (

                                <tr
                                    key={registration._id}
                                    className="border-t hover:bg-gray-50"
                                >

                                    <td className="p-3">

                                        <div className="font-medium">
                                            {registration.fullName}
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            {registration.email}
                                        </div>

                                    </td>

                                    <td className="p-3">
                                        {registration.event?.title}
                                    </td>

                                    <td className="p-3 text-center">
                                        {registration.phone}
                                    </td>

                                    <td className="p-3 text-center">
                                        {new Date(
                                            registration.createdAt
                                        ).toLocaleDateString()}
                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan="4"
                                    className="text-center p-6 text-gray-500"
                                >
                                    No registrations found.
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>
        </div>
    );
};

export default EventRegistrationPage;