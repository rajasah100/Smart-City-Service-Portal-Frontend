import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { getNotifications, markAllRead } from "../../redux/slices/notificationSlice";
import { FaCheckDouble } from "react-icons/fa";
import { LuBellOff } from "react-icons/lu";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";



const NotificationPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { notifications = [], unreadCount = 0, loading } = useSelector((state) => state.notification);

    useEffect(() => {
        dispatch(getNotifications());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-5xl mx-auto px-4">

                {/* Heading */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">
                                Notifications
                            </h1>

                            <p className="text-slate-500 mt-1">
                                Stay updated with your complaints and latest activities.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
                            <div className="bg-blue-50 rounded-xl px-5 py-3 flex gap-2 items-center justify-center">
                                <p className="text-sm text-slate-600">
                                    Total:
                                </p>
                                <h3 className="font-bold text-slate-800">
                                    {notifications.length}
                                </h3>
                            </div>

                            <div className="bg-red-50 rounded-xl px-5 py-3 flex gap-2 items-center justify-center">
                                <p className="text-sm text-slate-600">Unread:</p>

                                <h3 className="font-bold text-red-600">
                                    {unreadCount}
                                </h3>
                            </div>

                            {notifications.length > 0 && (
                                <button
                                    onClick={() => dispatch(markAllRead())}
                                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-3 rounded-xl transition cursor-pointer"
                                >
                                    <FaCheckDouble />
                                    Mark All Read
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
                        <p className="text-slate-500">
                            Loading notifications...
                        </p>
                    </div>
                ) : notifications.length === 0 ? (
                    // Empty State
                    <div className="bg-white rounded-2xl shadow-md border border-slate-200 py-24 flex flex-col items-center">
                        <LuBellOff className="text-5xl text-slate-300" />

                        <h2 className="mt-4 text-2xl font-semibold text-slate-700">
                            No Notifications
                        </h2>

                        <p>
                            You're all caught up.
                        </p>
                    </div>
                ) : (
                    // List
                    <div className="space-y-4">
                        {notifications.map((item) => (

                            <div
                                key={item._id}
                                className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition hover:shadow-md ${!item.isRead
                                    ? "border-blue-300"
                                    : "border-slate-200"
                                    }`}
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between px-6 py-5 border-b bg-slate-50">

                                    <div className="flex items-center gap-4">

                                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
                                            🔔
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-xl text-slate-800">
                                                {item.title}
                                            </h3>

                                            <p className="text-sm text-slate-500 mt-1">
                                                {formatDistanceToNow(new Date(item.createdAt), {
                                                    addSuffix: true,
                                                })}
                                            </p>
                                        </div>

                                    </div>

                                    {!item.isRead && (
                                        <span className="bg-blue-600 text-white text-xs px-4 py-1 rounded-full font-semibold">
                                            NEW
                                        </span>
                                    )}

                                </div>

                                {/* Body */}
                                <div className="p-6">

                                    <div className="grid md:grid-cols-2 gap-8">

                                        {/* Left */}
                                        <div className="space-y-5">

                                            <div>
                                                <p className="text-xs uppercase tracking-wide text-slate-500">
                                                    Complaint ID
                                                </p>

                                                <p className="font-mono text-lg font-bold text-blue-700">
                                                    {item.complaintId?.complaintId}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs uppercase tracking-wide text-slate-500">
                                                    Complaint
                                                </p>

                                                <p className="font-semibold text-slate-800">
                                                    {item.complaintId?.title}
                                                </p>
                                            </div>

                                        </div>

                                        {/* Right */}
                                        <div className="space-y-5">

                                            <div>
                                                <p className="text-xs uppercase tracking-wide text-slate-500">
                                                    Department
                                                </p>

                                                <p className="font-semibold text-slate-800">
                                                    {item.department?.name}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs uppercase tracking-wide text-slate-500">
                                                    Status
                                                </p>

                                                <span
                                                    className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold uppercase
              ${item.status === "resolved"
                                                            ? "bg-green-100 text-green-700"
                                                            : item.status === "rejected"
                                                                ? "bg-red-100 text-red-700"
                                                                : item.status === "assigned"
                                                                    ? "bg-blue-100 text-blue-700"
                                                                    : "bg-yellow-100 text-yellow-700"
                                                        }`}
                                                >
                                                    {item.status}
                                                </span>
                                            </div>

                                        </div>

                                    </div>

                                    {/* Official Message */}

                                    <div className="mt-8 rounded-xl border bg-blue-50 p-5">

                                        <p className="font-semibold text-blue-800 mb-2">
                                            Official Message
                                        </p>

                                        <p className="text-slate-700 leading-7">
                                            {item.message}
                                        </p>

                                    </div>

                                    {/* Officer Remark */}

                                    {item.resolutionNote && (
                                        <div className="mt-5 rounded-xl border bg-amber-50 p-5">

                                            <p className="font-semibold text-amber-800 mb-2">
                                                Officer Remark
                                            </p>

                                            <p className="text-slate-700">
                                                {item.resolutionNote}
                                            </p>

                                        </div>
                                    )}

                                    {/* Footer */}

                                    <div className="mt-6 flex items-center justify-between border-t pt-5">

                                        <span className="text-sm text-slate-500">
                                            Submitted{" "}
                                            {formatDistanceToNow(new Date(item.createdAt), {
                                                addSuffix: true,
                                            })}
                                        </span>

                                        {item.route && (
                                            <button
                                                onClick={() => navigate(item.route)}
                                                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
                                            >
                                                View Complaint
                                            </button>
                                        )}

                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}

export default NotificationPage
