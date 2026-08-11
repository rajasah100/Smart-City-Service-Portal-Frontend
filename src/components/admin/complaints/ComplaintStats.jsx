import {
    LuClipboardList,
    LuClock3,
    LuLoaderCircle,
    LuCircleCheckBig,
    LuTriangleAlert,
} from "react-icons/lu";

const ComplaintStats = ({ complaints = [] }) => {
    const totalComplaints = complaints.length;

    const pendingComplaints = complaints.filter(
        (complaint) => complaint.status === "pending"
    ).length;

    const inProgressComplaints = complaints.filter(
        (complaint) =>
            complaint.status === "in_progress" ||
            complaint.status === "in-progress"
    ).length;

    const resolvedComplaints = complaints.filter(
        (complaint) =>
            complaint.status === "resolved" ||
            complaint.status === "completed"
    ).length;

    const urgentComplaints = complaints.filter(
        (complaint) => complaint.priority === "high"
    ).length;

    const cards = [
        {
            title: "Total Complaints",
            value: totalComplaints,
            icon: LuClipboardList,
            bg: "bg-blue-100",
            color: "text-blue-600",
        },
        {
            title: "Pending",
            value: pendingComplaints,
            icon: LuClock3,
            bg: "bg-yellow-100",
            color: "text-yellow-600",
        },
        {
            title: "In Progress",
            value: inProgressComplaints,
            icon: LuLoaderCircle,
            bg: "bg-indigo-100",
            color: "text-indigo-600",
        },
        {
            title: "Resolved",
            value: resolvedComplaints,
            icon: LuCircleCheckBig,
            bg: "bg-green-100",
            color: "text-green-600",
        },
        {
            title: "High Priority",
            value: urgentComplaints,
            icon: LuTriangleAlert,
            bg: "bg-red-100",
            color: "text-red-600",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <div
                        key={card.title}
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">
                                    {card.title}
                                </p>

                                <h2 className="text-3xl font-bold text-slate-800 mt-2">
                                    {card.value}
                                </h2>
                            </div>

                            <div
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.bg}`}
                            >
                                <Icon
                                    size={26}
                                    className={card.color}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ComplaintStats;