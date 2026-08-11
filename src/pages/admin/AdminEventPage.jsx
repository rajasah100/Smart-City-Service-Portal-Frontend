import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getEvents,
    deleteEvent,
    cancelEvent,
} from "../../redux/slices/eventSlice";
import AddEventModal from "../../components/admin/events/AddEventModal";
import EditEventModal from "./EditEventModal";

const AdminEventPage = () => {
    const dispatch = useDispatch();

    const { events, loading, error } = useSelector(
        (state) => state.event
    );

    const [search, setSearch] = useState("");
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        dispatch(getEvents());
    }, [dispatch]);


    const handleDelete = (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this event?"
        );

        if (confirmDelete) {
            dispatch(deleteEvent(id));
        }
    };


    const handleCancel = (id) => {
        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this event?"
        );

        if (confirmCancel) {
            dispatch(cancelEvent(id));
        }
    };


    const filteredEvents = events?.filter((event) =>
        event.title
            ?.toLowerCase()
            .includes(search.toLowerCase())
    );


    return (
        <div className="p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">

                <div>
                    <h1 className="text-2xl font-bold">
                        Event Management
                    </h1>

                    <p className="text-gray-500">
                        Manage city events and programs
                    </p>
                </div>


                <button
                    onClick={() => setOpenAdd(true)}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                >
                    + Add Event
                </button>

            </div>


            {/* Search */}
            <div className="mb-5">

                <input
                    type="text"
                    placeholder="Search event..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-3 rounded-lg w-full md:w-96"
                />

            </div>



            {loading && (
                <p>Loading events...</p>
            )}


            {error && (
                <p className="text-red-500">
                    {error}
                </p>
            )}



            {/* Table */}

            <div className="overflow-x-auto bg-white rounded-xl shadow">

                <table className="w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="p-3 text-left">
                                Title
                            </th>

                            <th className="p-3">
                                Date
                            </th>

                            <th className="p-3">
                                Venue
                            </th>

                            <th className="p-3">
                                Participants
                            </th>

                            <th className="p-3">
                                Status
                            </th>

                            <th className="p-3">
                                Actions
                            </th>

                        </tr>

                    </thead>



                    <tbody>


                        {filteredEvents?.length > 0 ? (

                            filteredEvents.map((event) => (

                                <tr
                                    key={event._id}
                                    className="border-t"
                                >


                                    <td className="p-3">

                                        <div className="font-medium">
                                            {event.title}
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            {event.category}
                                        </div>

                                    </td>



                                    <td className="p-3 text-center">

                                        {new Date(
                                            event.startDate
                                        ).toLocaleDateString()}

                                    </td>



                                    <td className="p-3 text-center">

                                        {event.location?.venue || "N/A"}

                                    </td>



                                    <td className="p-3 text-center">

                                        {event.currentParticipants || 0}
                                        /
                                        {event.maxParticipants || 0}

                                    </td>



                                    <td className="p-3 text-center">

                                        <span
                                            className={`
                    px-3 py-1 rounded-full text-sm
                    ${event.status === "completed"
                                                    ? "bg-gray-200"
                                                    :
                                                    event.status === "ongoing"
                                                        ? "bg-green-200"
                                                        :
                                                        event.status === "cancelled"
                                                            ? "bg-red-200"
                                                            :
                                                            "bg-blue-200"
                                                }
                    `}
                                        >

                                            {event.status}

                                        </span>

                                    </td>



                                    <td className="p-3">

                                        <div className="flex gap-2 justify-center">


                                            <button
                                                onClick={() => {
                                                    setSelectedEvent(event);
                                                    setOpenEdit(true);
                                                }}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded"
                                            >
                                                Edit
                                            </button>



                                            {event.status !== "cancelled" && (

                                                <button
                                                    onClick={() => handleCancel(event._id)}
                                                    className="bg-orange-500 text-white px-3 py-1 rounded"
                                                >
                                                    Cancel
                                                </button>

                                            )}



                                            <button
                                                onClick={() => handleDelete(event._id)}
                                                className="bg-red-600 text-white px-3 py-1 rounded"
                                            >
                                                Delete
                                            </button>


                                        </div>

                                    </td>


                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="text-center p-5"
                                >
                                    No events found
                                </td>

                            </tr>

                        )}


                    </tbody>


                </table>

            </div>

            {/* Add Event Modal */}
            {
                openAdd && (
                    <AddEventModal
                        closeModal={() => setOpenAdd(false)}
                    />
                )
            }

            {openEdit && (
                <EditEventModal
                    event={selectedEvent}
                    closeModal={() => {
                        setOpenEdit(false);
                        setSelectedEvent(null);
                    }}
                />
            )}

        </div>
    );
};


export default AdminEventPage;