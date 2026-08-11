import {
    LuX,
    LuMail,
    LuPhone,
    LuCalendarDays,
    LuBuilding2,
    LuShield,
    LuKey,
} from "react-icons/lu";
import { FaUserCircle } from "react-icons/fa";

const InfoCard = ({ icon, title, value }) => (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-600 shadow-sm">
                {icon}
            </div>

            <div>
                <p className="text-sm text-slate-500">{title}</p>
                <p className="font-semibold text-slate-800 break-all">
                    {value}
                </p>
            </div>
        </div>
    </div>
);

const UserViewModal = ({ open, user, onClose }) => {
    if (!open || !user) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            User Details
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            View complete profile information
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center"
                    >
                        <LuX size={22} />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-8">

                    {/* Profile */}
                    <div className="flex flex-col md:flex-row items-center gap-8">

                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                referrerPolicy="no-referrer"
                                className="w-32 h-32 rounded-full object-cover border-4 border-slate-200"
                            />
                        ) : (
                            <FaUserCircle
                                size={120}
                                className="text-slate-300"
                            />
                        )}

                        <div>
                            <h2 className="text-3xl font-bold text-slate-800">
                                {user.name}
                            </h2>

                            <p className="text-slate-500 mt-2">
                                {user.email}
                            </p>

                            <div className="mt-4">
                                <span
                                    className={`px-4 py-1 rounded-full text-sm font-semibold ${user.role === "admin"
                                        ? "bg-red-100 text-red-600"
                                        : "bg-green-100 text-green-600"
                                        }`}
                                >
                                    {user.role.charAt(0).toUpperCase() +
                                        user.role.slice(1)}
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* Information */}
                    <div className="grid md:grid-cols-2 gap-6 mt-10">

                        <InfoCard
                            icon={<LuMail size={20} />}
                            title="Email"
                            value={user.email || "-"}
                        />

                        <InfoCard
                            icon={<LuPhone size={20} />}
                            title="Phone"
                            value={user.phone || "-"}
                        />

                        <InfoCard
                            icon={<LuShield size={20} />}
                            title="Role"
                            value={
                                user.role
                                    ? user.role.charAt(0).toUpperCase() +
                                    user.role.slice(1)
                                    : "-"
                            }
                        />

                        <InfoCard
                            icon={<LuBuilding2 size={20} />}
                            title="Department"
                            value={
                                user.department?.name ||
                                user.department ||
                                "Not Assigned"
                            }
                        />

                        <InfoCard
                            icon={<LuKey size={20} />}
                            title="Auth Provider"
                            value={
                                user.authProvider === "google"
                                    ? "Google"
                                    : "Local"
                            }
                        />

                        <InfoCard
                            icon={<LuCalendarDays size={20} />}
                            title="Joined"
                            value={
                                user.createdAt
                                    ? new Date(user.createdAt).toLocaleDateString(
                                        "en-GB",
                                        {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        }
                                    )
                                    : "-"
                            }
                        />

                    </div>

                </div>

                {/* Footer */}
                <div className="border-t border-slate-200 px-8 py-5 flex justify-end bg-white">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition"
                    >
                        Close
                    </button>
                </div>

            </div>

        </div>
    );
};

export default UserViewModal;