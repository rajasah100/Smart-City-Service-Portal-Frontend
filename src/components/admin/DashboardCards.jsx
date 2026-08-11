import {
    LuClipboardList,
    LuClock3,
    LuUsers,
    LuBuilding2,
    LuBell,
    LuCalendarDays,
    LuLoaderCircle,
    LuCheckCheck,
} from "react-icons/lu";

const DashboardCards = ({
    complaints = [],
    departments = [],
    users = [],
    notices = [],
    events = [],
}) => {
    // Complaint Statistics
    const totalComplaints = complaints.length;

    const pendingComplaints = complaints.filter(
        (item) => item.status?.toLowerCase() === "pending"
    ).length;

    const inProgressComplaints = complaints.filter(
        (item) =>
            item.status?.toLowerCase() === "in-progress" ||
            item.status?.toLowerCase() === "assigned"
    ).length;

    const resolvedComplaints = complaints.filter(
        (item) =>
            item.status?.toLowerCase() === "resolved" ||
            item.status?.toLowerCase() === "completed"
    ).length;

    const cards = [
        {
            title: "Total Complaints",
            value: totalComplaints,
            icon: LuClipboardList,
            bg: "bg-blue-100",
            text: "text-blue-700",
            iconBg: "bg-blue-500",
        },
        {
            title: "Pending",
            value: pendingComplaints,
            icon: LuClock3,
            bg: "bg-yellow-100",
            text: "text-yellow-700",
            iconBg: "bg-yellow-500",
        },
        {
            title: "In Progress",
            value: inProgressComplaints,
            icon: LuLoaderCircle,
            bg: "bg-purple-100",
            text: "text-purple-700",
            iconBg: "bg-purple-500",
        },
        {
            title: "Resolved",
            value: resolvedComplaints,
            icon: LuCheckCheck,
            bg: "bg-green-100",
            text: "text-green-700",
            iconBg: "bg-green-500",
        },
        {
            title: "Departments",
            value: departments.length,
            icon: LuBuilding2,
            bg: "bg-cyan-100",
            text: "text-cyan-700",
            iconBg: "bg-cyan-500",
        },
        {
            title: "Users",
            value: users.length,
            icon: LuUsers,
            bg: "bg-pink-100",
            text: "text-pink-700",
            iconBg: "bg-pink-500",
        },
        {
            title: "Notices",
            value: notices.length,
            icon: LuBell,
            bg: "bg-orange-100",
            text: "text-orange-700",
            iconBg: "bg-orange-500",
        },
        {
            title: "Events",
            value: events.length,
            icon: LuCalendarDays,
            bg: "bg-indigo-100",
            text: "text-indigo-700",
            iconBg: "bg-indigo-500",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <div
                        key={card.title}
                        className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">{card.title}</p>

                                <h2 className={`text-3xl font-bold mt-2 ${card.text}`}>
                                    {card.value}
                                </h2>
                            </div>

                            <div
                                className={`w-14 h-14 rounded-2xl ${card.iconBg} text-white flex items-center justify-center group-hover:scale-110 transition-transform`}
                            >
                                <Icon size={28} />
                            </div>
                        </div>

                        <div className="mt-5">
                            <div className={`h-2 rounded-full ${card.bg}`}>
                                <div
                                    className={`h-2 rounded-full ${card.iconBg} w-2/3`}
                                ></div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default DashboardCards;