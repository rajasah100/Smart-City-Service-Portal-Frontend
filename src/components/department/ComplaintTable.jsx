

import {
    LuEye,
    LuCalendar,
} from "react-icons/lu";
import { useState } from "react";
import ComplaintView from "./complaintView";

const statusColor = {
    pending: "bg-yellow-100 text-yellow-700",
    assigned: "bg-blue-100 text-blue-700",
    "in-progress": "bg-purple-100 text-purple-700",
    resolved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
};

const priorityColor = {
    low: "text-green-600",
    medium: "text-yellow-600",
    high: "text-red-600",
};

const ComplaintTable = ({ complaints }) => {
    const [selectedComplaint, setSelectedComplaint] = useState(null);



    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead className="bg-slate-100">
                        <tr className="text-left text-sm text-slate-700">

                            <th className="px-6 py-4">Complaint ID</th>

                            <th className="px-6 py-4">Citizen</th>

                            <th className="px-6 py-4">Title</th>

                            <th className="px-6 py-4">Priority</th>

                            <th className="px-6 py-4">Status</th>

                            <th className="px-6 py-4">Created</th>

                            <th className="px-6 py-4 text-center">
                                Action
                            </th>

                        </tr>
                    </thead>

                    <tbody>

                        {complaints.map((complaint) => (

                            <tr
                                key={complaint._id}
                                className="border-t hover:bg-slate-50 transition"
                            >

                                <td className="px-6 py-5 font-semibold">
                                    {complaint.complaintId}
                                </td>

                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">

                                        {/* Avatar */}
                                        <div className="w-11 h-11 rounded-full overflow-hidden bg-[#0f4c81] flex items-center justify-center shrink-0">

                                            {complaint.user?.avatar ? (
                                                <img
                                                    src={complaint.user?.avatar}
                                                    alt={complaint.user?.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-white font-bold text-lg">
                                                    {complaint.user?.name?.charAt(0).toUpperCase()}
                                                </span>
                                            )}

                                        </div>

                                        {/* Citizen Info */}
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-gray-800 whitespace-nowrap">
                                                {complaint.user?.name || "Unknown User"}
                                            </h3>

                                            <p className="text-sm text-gray-500">
                                                {complaint.user?.phone || "No Phone"}
                                            </p>
                                        </div>

                                    </div>
                                </td>

                                <td className="px-6 py-5">

                                    <p className="font-semibold">
                                        {complaint.title}
                                    </p>

                                    <p className="text-xs text-slate-500 line-clamp-1">
                                        {complaint.description}
                                    </p>

                                </td>

                                <td className="px-6 py-5">

                                    <span
                                        className={`font-semibold capitalize ${priorityColor[complaint.priority]}`}
                                    >
                                        {complaint.priority}
                                    </span>

                                </td>

                                <td className="px-6 py-5">

                                    <span
                                        className={`px-4 py-2 rounded-full font-semibold capitalize ${statusColor[complaint.status]}`}
                                    >
                                        {complaint.status}
                                    </span>

                                </td>

                                <td className="px-6 py-5">

                                    <div className="flex items-center gap-2 text-slate-600">

                                        <LuCalendar />

                                        {new Date(
                                            complaint.createdAt
                                        ).toLocaleDateString()}

                                    </div>

                                </td>

                                <td className="px-6 py-5 text-center">

                                    <button
                                        onClick={() => setSelectedComplaint(complaint)}
                                        className="px-4 py-2 bg-[#4A6C8F] hover:bg-[#35516d] text-white rounded-lg flex items-center gap-2"
                                    >
                                        <LuEye size={18} />
                                        View
                                    </button>
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {selectedComplaint && (
                <ComplaintView
                    key={selectedComplaint?._id}
                    complaint={selectedComplaint}
                    onClose={() => setSelectedComplaint(null)}
                />
            )}
        </div>
    );
};

export default ComplaintTable;