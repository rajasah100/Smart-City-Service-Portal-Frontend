import {
    LuUsers,
    LuUser,
    LuCalendarDays,
    LuBadgeCheck,
} from "react-icons/lu";

const UserStats = ({ users = [] }) => {
    const totalUsers = users.length;

    const regularUsers = users.filter(
        (user) => user.role === "user"
    ).length;

    const googleUsers = users.filter(
        (user) => user.authProvider === "google"
    ).length;

    const today = new Date().toDateString();

    const joinedToday = users.filter(
        (user) =>
            user.createdAt &&
            new Date(user.createdAt).toDateString() === today
    ).length;

    const cards = [
        {
            title: "Total Users",
            value: totalUsers,
            icon: LuUsers,
            bg: "bg-blue-100",
            color: "text-blue-600",
        },
        {
            title: "Regular Users",
            value: regularUsers,
            icon: LuUser,
            bg: "bg-green-100",
            color: "text-green-600",
        },
        {
            title: "Google Users",
            value: googleUsers,
            icon: LuBadgeCheck,
            bg: "bg-red-100",
            color: "text-red-600",
        },
        {
            title: "Joined Today",
            value: joinedToday,
            icon: LuCalendarDays,
            bg: "bg-cyan-100",
            color: "text-cyan-600",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
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

export default UserStats;