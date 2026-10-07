import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import { LuArrowRight, LuBell, LuBellOff, LuCheck, LuCheckCheck, LuFileText, LuSiren, LuTrash2 } from "react-icons/lu";

import { deleteNotification, getNotifications, markAllRead, markAsRead } from "../../redux/slices/notificationSlice";
import UserPageHeader from "../../components/user/UserPageHeader";
import Reveal from "../../components/common/Reveal";
import { statusStyle } from "../../components/user/complaintStyles";

const NotificationPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { notifications = [], unreadCount = 0, loading } = useSelector((state) => state.notification);
    const [tab, setTab] = useState("all");

    useEffect(() => {
        dispatch(getNotifications());
    }, [dispatch]);

    const list = tab === "unread" ? notifications.filter((item) => !item.isRead) : notifications;

    const open = (item) => {
        if (!item.isRead) dispatch(markAsRead(item._id));
        if (item.route) navigate(item.route);
    };

    const remove = async (item) => {
        try {
            await dispatch(deleteNotification(item._id)).unwrap();
            toast.success(t("userPages.notifications.deleted"));
        } catch {
            // slice le error dekhaucha
        }
    };

    return (
        <div className="space-y-6">
            <UserPageHeader icon={LuBell} title={t("userPages.notifications.title")} text={t("userPages.notifications.text")}>
                {unreadCount > 0 && (
                    <button
                        onClick={() => dispatch(markAllRead())}
                        className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
                    >
                        <LuCheckCheck />
                        {t("userPages.notifications.markAll")}
                    </button>
                )}
            </UserPageHeader>

            {/* Tabs */}
            <div className="flex gap-2">
                {[
                    { key: "all", count: notifications.length },
                    { key: "unread", count: unreadCount },
                ].map(({ key, count }) => (
                    <button
                        key={key}
                        onClick={() => setTab(key)}
                        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                            tab === key ? "bg-[#003893] text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                        {t(`userPages.notifications.${key}`)}
                        <span className={`rounded-full px-2 py-0.5 text-[11px] ${tab === key ? "bg-white/20" : "bg-slate-100"}`}>{count}</span>
                    </button>
                ))}
            </div>

            {loading && notifications.length === 0 ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((item) => <div key={item} className="h-24 animate-pulse rounded-2xl bg-white" />)}
                </div>
            ) : list.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
                    <LuBellOff className="mx-auto text-5xl text-slate-300" />
                    <p className="mt-3 text-slate-500">
                        {tab === "unread" ? t("userPages.notifications.emptyUnread") : t("userPages.notifications.empty")}
                    </p>
                </div>
            ) : (
                <ul className="space-y-3">
                    {list.map((item, index) => {
                        const isSos = item.type === "emergency";
                        const Icon = isSos ? LuSiren : item.complaintId ? LuFileText : LuBell;

                        return (
                            <Reveal as="li" key={item._id} delay={Math.min(index, 8) * 40}>
                                <div
                                    className={`group rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
                                        item.isRead ? "border-slate-200" : "border-[#003893]/30 bg-[#003893]/3"
                                    }`}
                                >
                                    <div className="flex gap-4">
                                        <span
                                            className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${
                                                isSos ? "bg-red-50 text-[#dc143c]" : "bg-[#003893]/10 text-[#003893]"
                                            }`}
                                        >
                                            <Icon />
                                            {!item.isRead && <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-[#dc143c]" />}
                                        </span>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h2 className={`text-slate-900 ${item.isRead ? "font-medium" : "font-bold"}`}>{item.title}</h2>
                                                {item.status && (
                                                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusStyle(item.status).badge}`}>
                                                        {t(`userDash.status.${item.status}`, { defaultValue: item.status })}
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mt-1 text-sm leading-6 text-slate-600">{item.message}</p>

                                            {(item.complaintId?.complaintId || item.department?.name) && (
                                                <p className="mt-2 flex flex-wrap gap-x-4 text-xs text-slate-500">
                                                    {item.complaintId?.complaintId && (
                                                        <span>{t("userPages.notifications.complaint")}: <b className="font-mono text-[#003893]">{item.complaintId.complaintId}</b></span>
                                                    )}
                                                    {item.department?.name && (
                                                        <span>{t("userPages.notifications.department")}: {item.department.name}</span>
                                                    )}
                                                </p>
                                            )}

                                            {item.resolutionNote && (
                                                <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-slate-700">
                                                    <b className="text-amber-800">{t("userPages.notifications.note")}:</b> {item.resolutionNote}
                                                </p>
                                            )}

                                            <div className="mt-3 flex flex-wrap items-center gap-3">
                                                <span className="text-xs text-slate-400">
                                                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                                                </span>

                                                <div className="ml-auto flex items-center gap-2">
                                                    {!item.isRead && (
                                                        <button
                                                            onClick={() => dispatch(markAsRead(item._id))}
                                                            className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-slate-500 transition hover:bg-slate-100 hover:text-[#003893]"
                                                        >
                                                            <LuCheck />
                                                            {t("userPages.notifications.markRead")}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => remove(item)}
                                                        aria-label={t("userPages.notifications.delete")}
                                                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-[#dc143c]"
                                                    >
                                                        <LuTrash2 />
                                                    </button>
                                                    {item.route && (
                                                        <button
                                                            onClick={() => open(item)}
                                                            className="flex items-center gap-1 rounded-lg bg-[#003893] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#002a6e]"
                                                        >
                                                            {t("userPages.notifications.open")}
                                                            <LuArrowRight />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default NotificationPage;
