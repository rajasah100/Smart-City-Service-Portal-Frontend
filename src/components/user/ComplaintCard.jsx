import { LuEye } from "react-icons/lu";
import { Link } from "react-router-dom";

const ComplaintCard = ({ complaints = [] }) => {



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
        high: "bg-red-100 text-red-700",
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">

                    {/* Table Header */}
                    <thead className="bg-slate-100">
                        <tr className="text-left text-slate-700 text-sm">
                            <th className="px-6 py-4">Complaint ID</th>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Department</th>
                            <th className="px-6 py-4">Submitted</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Priority</th>
                            <th className="px-6 py-4 text-center">Action</th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                        {complaints.length > 0 ? (
                            complaints.map((complaint) => (
                                <tr
                                    key={complaint._id}
                                    className="border-t hover:bg-slate-50 transition"
                                >
                                    {/* Complaint ID */}
                                    <td className="px-6 py-4 font-semibold text-slate-800">
                                        {complaint.complaintId}
                                    </td>

                                    {/* Title */}
                                    <td className="px-6 py-4 max-w-xs">
                                        <h3 className="font-semibold text-slate-800 truncate">
                                            {complaint.title}
                                        </h3>

                                        <p className="text-xs text-slate-500 truncate">
                                            {complaint.description}
                                        </p>
                                    </td>

                                    {/* Department */}
                                    <td className="px-6 py-4">
                                        {complaint.department?.name || "-"}
                                    </td>

                                    {/* Submitted Date */}
                                    <td className="px-6 py-4 text-slate-600">
                                        {new Date(
                                            complaint.createdAt
                                        ).toLocaleDateString()}
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColor[complaint.status]
                                                }`}
                                        >
                                            {complaint.status
                                                .split("-")
                                                .map(
                                                    (word) =>
                                                        word.charAt(0).toUpperCase() +
                                                        word.slice(1)
                                                )
                                                .join(" ")}
                                        </span>
                                    </td>

                                    {/* Priority */}
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${priorityColor[complaint.priority]
                                                }`}
                                        >
                                            {complaint.priority}
                                        </span>
                                    </td>

                                    {/* Action */}
                                    <td className="px-6 py-4 text-center">
                                        <Link
                                            to={`/user/complaints/${complaint.complaintId}`}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4A6C8F] hover:bg-[#35516d] text-white transition"
                                        >
                                            <LuEye size={18} />

                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="py-16 text-center text-slate-500"
                                >
                                    No complaints found.
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default ComplaintCard;