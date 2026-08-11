import { FaArrowRight, FaCalendarAlt, FaClock, FaMapMarkedAlt } from "react-icons/fa";
import { Link } from "react-router-dom";


const statusColors = {
    upcoming: "bg-blue-100 text-blue-700",
    ongoing: "bg-green-100 text-green-700",
    completed: "bg-gray-200 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
};

const EventCard = ({ event }) => {
    return (
        <div className="group overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            {/* Image */}
            <div className="relative h-52 overflow-hidden">
                <img
                    src={event.image?.url || "https://placehold.co/600x400?text=Event"}
                    alt={event.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />

                {/* Category */}
                <span className="absolute left-4 top-4 rounded-full bg-yellow-500 px-3 py-1 text-xs capitalize text-white font-semibold">
                    {event.category}
                </span>

                {/* Status */}
                <span
                className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColors[event.status]}`}
                >
                    {event.status}
                </span>
            </div>

            {/* Body */}
            <div className="p-6">
                <h3 className="line-clamp-2 text-xl font-bold text-slate-800">
                    {event.title}
                </h3>

                <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                    {event.description}
                </p>

                {/* Info */}
                <div className="mt-5 space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-[#2c5d79]" />
                        <span>
                            {new Date(event.startDate).toLocaleDateString()}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <FaClock className="text-[#2c5d79]" />
                        <span>
                            {event.startTime} - {event.endTime}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <FaMapMarkedAlt className="text-[#2c5d79]" />
                        <span className="line-clamp-1">
                            {event.location?.venue}, {" "}
                            {event.location?.municipality}
                        </span>
                    </div>
                </div>

                {/* Button */}
                <Link 
                to={`/events/${event._id}`}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-500 py-3 font-medium text-white transition hover:bg-yellow-600"
                >
                    View Details
                    <FaArrowRight className="transition group-hover:translate-x-1" />
                 </Link>
            </div>
        </div>
    )
}

export default EventCard
