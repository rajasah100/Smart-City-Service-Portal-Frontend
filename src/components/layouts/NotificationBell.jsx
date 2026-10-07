import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";
import { LuBell, LuBellOff, LuCheckCheck, LuFileText, LuSiren, LuX } from "react-icons/lu";
import { markAllRead, markAsRead } from "../../redux/slices/notificationSlice";

const MAX_ITEMS = 6;

// Navbar ko ghanti + dropdown (desktop: bell muni, mobile: screen ko chaudai)
const NotificationBell = ({ mobile = false }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { notifications = [], unreadCount = 0 } = useSelector((state) => state.notification);

    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Bahira click wa Esc thichda band garne
    useEffect(() => {
        if (!open) return;

        const onClick = (event) => {
            if (ref.current && !ref.current.contains(event.target)) setOpen(false);
        };
        const onKey = (event) => {
            if (event.key === "Escape") setOpen(false);
        };

        document.addEventListener("mousedown", onClick);
        document.addEventListener("keydown", onKey);

        return () => {
            document.removeEventListener("mousedown", onClick);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const openItem = (item) => {
        if (!item.isRead) dispatch(markAsRead(item._id));
        setOpen(false);
        navigate(item.route || "/user/notifications");
    };

    const items = notifications.slice(0, MAX_ITEMS);

    return (
        <div className="relative" ref={ref}>
            {/* Bell */}
            <button
                onClick={() => setOpen((value) => !value)}
                aria-label={t("notifications.title")}
                aria-expanded={open}
                className={`relative rounded-full border p-2 transition ${
                    open ? "border-white bg-white text-[#003893]" : "border-white/30 text-white hover:bg-white/10"
                }`}
            >
                <LuBell className="h-5 w-5" />

                {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-[#dc143c] opacity-60 motion-safe:animate-ping" />
                        <span className="relative flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#003893] bg-[#dc143c] px-1 text-[10px] font-bold text-white">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    role="dialog"
                    aria-label={t("notifications.title")}
                    className={`dropdown-in z-[9999] flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-2xl ${
                        mobile
                            ? "fixed inset-x-3 top-22 mx-auto max-h-[75vh] max-w-md"
                            : "absolute right-0 mt-3 w-96 origin-top-right"
                    }`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between bg-[#003893] px-4 py-3 text-white">
                        <div>
                            <h3 className="font-semibold">{t("notifications.title")}</h3>
                            <p className="text-xs text-white/70">{t("notifications.unread", { count: unreadCount })}</p>
                        </div>

                        <div className="flex items-center gap-1">
                            {unreadCount > 0 && (
                                <button
                                    onClick={() => dispatch(markAllRead())}
                                    className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-white/90 transition hover:bg-white/10"
                                >
                                    <LuCheckCheck />
                                    {t("notifications.markAll")}
                                </button>
                            )}
                            <button
                                onClick={() => setOpen(false)}
                                aria-label={t("notifications.close")}
                                className="rounded-lg p-1.5 text-white/80 transition hover:bg-white/10"
                            >
                                <LuX />
                            </button>
                        </div>
                    </div>

                    {/* List */}
                    <div className="max-h-96 flex-1 overflow-y-auto">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center px-6 py-12 text-slate-400">
                                <LuBellOff className="text-4xl" />
                                <p className="mt-3 text-sm">{t("notifications.empty")}</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {items.map((item, index) => {
                                    const isSos = item.type === "emergency";
                                    const Icon = isSos ? LuSiren : item.complaintId ? LuFileText : LuBell;

                                    return (
                                        <li
                                            key={item._id}
                                            className="dropdown-item-in"
                                            style={{ "--delay": `${index * 40}ms` }}
                                        >
                                            <button
                                                onClick={() => openItem(item)}
                                                className={`flex w-full gap-3 px-4 py-3 text-left transition hover:bg-slate-50 ${
                                                    item.isRead ? "" : "bg-[#003893]/5"
                                                }`}
                                            >
                                                <span
                                                    className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                                        isSos ? "bg-red-50 text-[#dc143c]" : "bg-[#003893]/10 text-[#003893]"
                                                    }`}
                                                >
                                                    <Icon />
                                                    {!item.isRead && (
                                                        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#dc143c]" />
                                                    )}
                                                </span>

                                                <span className="min-w-0 flex-1">
                                                    {item.title && (
                                                        <span className={`block truncate text-sm text-slate-900 ${item.isRead ? "font-medium" : "font-bold"}`}>
                                                            {item.title}
                                                        </span>
                                                    )}
                                                    <span className="line-clamp-2 block text-xs leading-5 text-slate-600">{item.message}</span>
                                                    <span className="mt-1 block text-[11px] text-slate-400">
                                                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                                                    </span>
                                                </span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>

                    {/* Footer */}
                    <Link
                        to="/user/notifications"
                        onClick={() => setOpen(false)}
                        className="border-t border-slate-100 py-3 text-center text-sm font-semibold text-[#003893] transition hover:bg-slate-50"
                    >
                        {t("notifications.viewAll")}
                    </Link>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
