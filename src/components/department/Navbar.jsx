import { LuBell, LuBellOff } from "react-icons/lu"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDepartmentProfile } from "../../redux/slices/departmentSlice";
import { useState } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom"
import { getDepartmentNotifications, markAllDepartmentNotificationsRead } from "../../redux/slices/departmentNotificationSlice";
import { formatDistanceToNow } from "date-fns"



const Navbar = () => {
    const [notificationOpen, setNotificationOpen] = useState(false);
    const notificationRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { department } = useSelector((state) => state.department);

    const { notifications, unreadCount } = useSelector((state) => state.departmentNotification);

    useEffect(() => {
        if (!department) {
            dispatch(getDepartmentProfile());
        }

        dispatch(getDepartmentNotifications());
    }, [dispatch, department]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(e.target)
            ) {
                setNotificationOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-20 flex items-center justify-between px-3 sm:px-6">

            {/* left */}
            <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-[#10151c]">
                    Department Dashboard
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                    Welcome back! Manage complaints efficently
                </p>
            </div>

            {/* Right */}
            <div className="flex items-center gap-5">

               
               

                {/* Notification */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setNotificationOpen(!notificationOpen)}
                        className="relative w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
                    >
                        <LuBell size={20} />

                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center px-1">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {notificationOpen && (
                        <div
                            className="fixed top-20 left-4 right-4 sm:absolute sm:top-14 sm:right-0 sm:left-auto sm:w-105 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-9999"
                        >

                            {/* Header */}
                            <div className="px-5 py-4 border-b flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-lg">
                                        Department Notifications
                                    </h3>

                                    <p className="text-sm text-slate-500">
                                        {unreadCount} unread notification
                                        {unreadCount !== 1 && "s"}
                                    </p>
                                </div>


                            </div>

                            {/* Body */}
                            <div className="max-h-105 overflow-y-auto">

                                {notifications.length === 0 ? (
                                    <div className="py-14 flex flex-col items-center">
                                        <LuBellOff
                                            size={45}
                                            className="text-slate-300"
                                        />

                                        <p className="mt-3 text-slate-500">
                                            No notifications
                                        </p>
                                    </div>
                                ) : (
                                    notifications.slice(0, 4).map((item) => (
                                        <div
                                            key={item._id}
                                            onClick={() => {
                                                setNotificationOpen(false);
                                            }}
                                            className={`cursor-pointer p-4 border-b transition ${!item.isRead
                                                ? "bg-blue-50 border-l-4 border-blue-500"
                                                : "hover:bg-slate-50"
                                                }`}
                                        >
                                            <div className="flex justify-between">

                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-slate-800">
                                                        {item.title}
                                                    </h4>

                                                    <p className="text-sm text-slate-600 mt-1">
                                                        {item.message}
                                                    </p>

                                                    <div className="flex gap-2 mt-3">
                                                        <span className="px-2 py-1 rounded-full bg-slate-100 text-xs font-medium">
                                                            {item.complaint?.complaintId}
                                                        </span>

                                                        <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs capitalize">
                                                            {item.complaint?.priority}
                                                        </span>
                                                    </div>

                                                    <p className="text-xs text-slate-400 mt-3">
                                                        {formatDistanceToNow(new Date(item.createdAt), {
                                                            addSuffix: true,
                                                        })}
                                                    </p>
                                                </div>

                                                {!item.isRead && (
                                                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-2"></span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            {notifications.length > 4 && (
                                <div className="p-4 border-t bg-slate-50">
                                    <button
                                        onClick={async () => {
                                            await dispatch(markAllDepartmentNotificationsRead());

                                            setNotificationOpen(false);

                                            navigate("/department/complaints");
                                        }}
                                        className="w-full py-3 text-[#0f4c81] font-semibold hover:bg-slate-50 border-t cursor-pointer"
                                    >
                                        View All Complaints
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* profile */}
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full text-white bg-[#0f4c81] flex items-center justify-center font-bold text-lg uppercase">
                        {department?.name?.split(" ").map((word) => word[0]).join("").slice(0, 2) || "DP"}
                    </div>

                    <div className="hidden md:block">
                        <h4 className="font-semibold text-[#10151c]">
                            {department?.name || "Department Admin"}
                        </h4>

                        <p className="text-sm text-slate-500">
                            {department?.email || "Department"}
                        </p>
                    </div>
                </div>
            </div>

        </header>
    )
}

export default Navbar
