import {
    LuMapPin,
    LuCalendarDays,
    LuUser,
} from "react-icons/lu";

const statusColor = {
    pending: "bg-yellow-100 text-yellow-700",
    assigned: "bg-blue-100 text-blue-700",
    "in-progress": "bg-purple-100 text-purple-700",
    resolved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
};

const priorityColor = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-700",
};

const ComplaintLocationList = ({
    complaints = [],
    loading,
    selectedComplaint,
    setSelectedComplaint,
}) => {
    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow border p-8 text-center">
                Loading complaints...
            </div>
        );
    }

    if (complaints.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow border p-8 text-center text-slate-500">
                No complaints found.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow border overflow-hidden">

            {/* Header */}

            <div className="px-5 py-4 border-b bg-slate-50">

                <h2 className="text-lg font-bold text-slate-800">
                    Complaint List
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                    Select a complaint to locate it on the map.
                </p>

            </div>

            {/* Scroll List */}

            <div className="max-h-175 overflow-y-auto">

                {complaints.map((complaint) => (

                    <div
                        key={complaint._id}
                        onClick={() => setSelectedComplaint(complaint)}
                        className={`cursor-pointer p-5 border-b transition-all duration-200 hover:bg-slate-50
            ${selectedComplaint?._id === complaint._id
                                ? "bg-blue-50 border-l-4 border-[#0f4c81]"
                                : ""
                            }`}
                    >

                        {/* Complaint ID */}

                        <div className="flex justify-between items-start">

                            <h3 className="font-bold text-[#0f4c81]">
                                {complaint.complaintId}
                            </h3>

                            <span
                                className={`text-xs px-3 py-1 rounded-full capitalize font-semibold ${statusColor[complaint.status]}`}
                            >
                                {complaint.status}
                            </span>

                        </div>

                        {/* Title */}

                        <h4 className="font-semibold text-slate-800 mt-3">
                            {complaint.title}
                        </h4>

                        {/* Description */}

                        <p className="text-sm text-slate-500 line-clamp-2 mt-1">
                            {complaint.description}
                        </p>

                        {/* Citizen */}

                        <div className="flex items-center gap-2 mt-4 text-sm text-slate-600">

                            <LuUser size={16} />

                            <span>
                                {complaint.user?.name || "Unknown User"}
                            </span>

                        </div>

                        {/* Location */}

                        <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">

                            <LuMapPin size={16} />

                            <span>
                                {complaint.location?.municipality},
                                Ward {complaint.location?.ward}
                            </span>

                        </div>

                        {/* Date */}

                        <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">

                            <LuCalendarDays size={16} />

                            <span>
                                {new Date(complaint.createdAt).toLocaleDateString()}
                            </span>

                        </div>

                        {/* Priority */}

                        <div className="mt-4">

                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${priorityColor[complaint.priority]}`}
                            >
                                {complaint.priority} Priority
                            </span>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
};

export default ComplaintLocationList;