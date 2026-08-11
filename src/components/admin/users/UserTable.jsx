import {
    LuEye,
    LuBadgeCheck,
    LuKeyRound,
} from "react-icons/lu";
import { FaUserCircle } from "react-icons/fa";

const UserTable = ({
    users = [],
    loading,
    onView,
    // onDelete,
}) => {
    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-20 text-center">
                Loading users...
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">
                        Users
                    </h2>

                    <p className="text-sm text-slate-500">
                        Manage all registered users.
                    </p>
                </div>

                <span className="px-4 py-2 rounded-xl bg-slate-100 text-sm font-semibold">
                    {users.length} Users
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full">

                    <thead className="bg-slate-50">
                        <tr className="text-left text-sm text-slate-600">
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Phone</th>
                            <th className="px-6 py-4">Provider</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4 text-center">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr
                                    key={user._id}
                                    className="border-t hover:bg-slate-50 transition"
                                >
                                    {/* User */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">

                                            {user.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    alt={user.name}
                                                    referrerPolicy="no-referrer"
                                                    className="w-11 h-11 rounded-full object-cover border"
                                                />
                                            ) : (
                                                <FaUserCircle
                                                    size={42}
                                                    className="text-slate-400"
                                                />
                                            )}

                                            <div>
                                                <h3 className="font-semibold text-slate-800">
                                                    {user.name}
                                                </h3>

                                                <p className="text-sm text-slate-500">
                                                    {user.email}
                                                </p>
                                            </div>

                                        </div>
                                    </td>

                                    {/* Phone */}
                                    <td className="px-6 py-4">
                                        {user.phone || "-"}
                                    </td>

                                    {/* Provider */}
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                                                user.authProvider === "google"
                                                    ? "bg-red-100 text-red-600"
                                                    : "bg-blue-100 text-blue-600"
                                            }`}
                                        >
                                            {user.authProvider === "google" ? (
                                                <LuBadgeCheck size={14} />
                                            ) : (
                                                <LuKeyRound size={14} />
                                            )}

                                            {user.authProvider === "google"
                                                ? "Google"
                                                : "Local"}
                                        </span>
                                    </td>

                                    {/* Joined */}
                                    <td className="px-6 py-4">
                                        {user.createdAt
                                            ? new Date(
                                                  user.createdAt
                                              ).toLocaleDateString("en-GB")
                                            : "-"}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">

                                            <button
                                                onClick={() => onView(user)}
                                                className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center"
                                            >
                                                <LuEye />
                                            </button>

                                            {/* <button
                                                onClick={() => onDelete(user)}
                                                className="w-9 h-9 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center"
                                            >
                                                <LuTrash2 />
                                            </button> */}

                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="py-20 text-center text-slate-500"
                                >
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default UserTable;