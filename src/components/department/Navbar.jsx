import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { LuBell, LuBellOff, LuCalendarDays, LuCheckCheck, LuMenu } from "react-icons/lu";
import { getDepartmentProfile } from "../../redux/slices/departmentSlice";
import {
    getDepartmentNotifications,
    markAllDepartmentNotificationsRead,
    markDepartmentNotificationRead,
} from "../../redux/slices/departmentNotificationSlice";
import LanguageSwitcher from "../common/LanguageSwitcher";
import { formatBS } from "../../utils/nepaliDate";
import { currentMenu } from "./deptMenu";
import { PRIORITY_STYLE, initials } from "./deptUtils";

// Department ko mathi ko bar: page ko shirshak, miti, bhasha, notification
const Navbar = ({ onMenu }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { t, i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage === "en";
    const num = (n) => Number(n).toLocaleString(isEn ? "en-US" : "ne-NP");

    const [open, setOpen] = useState(false);
    const panelRef = useRef(null);

    const { department } = useSelector((state) => state.department);
    const { notifications = [], unreadCount } = useSelector((state) => state.departmentNotification);
    const menu = currentMenu(pathname);

    // Profile sadhai taja (login ko data ma sewa kshetra hudaina), notification pani
    useEffect(() => {
        dispatch(getDepartmentProfile());
        dispatch(getDepartmentNotifications());
    }, [dispatch]);

    useEffect(() => {
        const close = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    const openNotification = (item) => {
        setOpen(false);
        if (!item.isRead) dispatch(markDepartmentNotificationRead(item._id));
        if (item.complaint?._id) navigate(`/department/complaints?open=${item.complaint._id}`);
    };

    return (
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur print:hidden">
            <div className="flex h-18 items-center gap-3 px-4 sm:px-6">
                <button
                    type="button"
                    onClick={onMenu}
                    aria-label={t("deptDash.openMenu")}
                    className="rounded-xl p-2 text-[#003893] hover:bg-slate-100 lg:hidden"
                >
                    <LuMenu size={22} />
                </button>

                <div className="min-w-0 flex-1">
                    <h1 className="truncate text-lg font-bold text-slate-900 sm:text-xl">{t(`deptDash.titles.${menu.titleKey}.title`)}</h1>
                    <p className="hidden truncate text-sm text-slate-500 sm:block">{t(`deptDash.titles.${menu.titleKey}.text`)}</p>
                </div>

                <span className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 xl:flex">
                    <LuCalendarDays className="text-[#003893]" />
                    {formatBS(new Date(), isEn, "YYYY MMMM DD, ddd")}
                </span>

                <div className="hidden sm:block">
                    <LanguageSwitcher variant="light" />
                </div>

                {/* Notification */}
                <div className="relative" ref={panelRef}>
                    <button
                        type="button"
                        onClick={() => setOpen((value) => !value)}
                        aria-label={t("deptDash.notifications.title")}
                        aria-expanded={open}
                        className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-[#003893]/10 hover:text-[#003893]"
                    >
                        <LuBell size={19} />
                        {unreadCount > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#dc143c] px-1 text-[10px] font-bold text-white ring-2 ring-white">
                                {unreadCount > 9 ? "9+" : num(unreadCount)}
                            </span>
                        )}
                    </button>

                    {open && (
                        <div className="dropdown-in fixed left-3 right-3 top-20 z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-96">
                            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
                                <div>
                                    <p className="font-bold text-slate-900">{t("deptDash.notifications.title")}</p>
                                    <p className="text-xs text-slate-500">{t("deptDash.notifications.unread", { count: num(unreadCount) })}</p>
                                </div>
                                {unreadCount > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => dispatch(markAllDepartmentNotificationsRead())}
                                        className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-[#003893] hover:bg-[#003893]/10"
                                    >
                                        <LuCheckCheck />
                                        {t("deptDash.notifications.markAll")}
                                    </button>
                                )}
                            </div>

                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="flex flex-col items-center py-12 text-slate-400">
                                        <LuBellOff size={36} />
                                        <p className="mt-2 text-sm">{t("deptDash.notifications.empty")}</p>
                                    </div>
                                ) : (
                                    notifications.slice(0, 8).map((item, index) => (
                                        <button
                                            key={item._id}
                                            type="button"
                                            onClick={() => openNotification(item)}
                                            style={{ "--delay": `${index * 30}ms` }}
                                            className={`dropdown-item-in flex w-full gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 ${
                                                item.isRead ? "" : "bg-[#003893]/5"
                                            }`}
                                        >
                                            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.isRead ? "bg-transparent" : "bg-[#dc143c]"}`} />
                                            <span className="min-w-0 flex-1">
                                                <span className="block text-sm font-semibold text-slate-900">{item.complaint?.title || item.title}</span>
                                                <span className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                                                    {item.complaint?.complaintId && (
                                                        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-600">{item.complaint.complaintId}</span>
                                                    )}
                                                    {item.complaint?.priority && (
                                                        <span className={`rounded px-1.5 py-0.5 font-medium ${PRIORITY_STYLE[item.complaint.priority]?.badge}`}>
                                                            {t(`userDash.priority.${item.complaint.priority}`)}
                                                        </span>
                                                    )}
                                                </span>
                                                <span className="mt-1 block text-xs text-slate-400">{formatBS(item.createdAt, isEn, "MMMM DD")}</span>
                                            </span>
                                        </button>
                                    ))
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setOpen(false);
                                    navigate("/department/complaints");
                                }}
                                className="w-full bg-slate-50 py-3 text-sm font-semibold text-[#003893] hover:bg-slate-100"
                            >
                                {t("deptDash.notifications.viewAll")}
                            </button>
                        </div>
                    )}
                </div>

                {/* Department */}
                <button
                    type="button"
                    onClick={() => navigate("/department/profile")}
                    className="flex items-center gap-2.5 rounded-xl p-1 transition hover:bg-slate-100"
                    title={department?.name}
                >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#003893] text-sm font-bold text-white">
                        {initials(department?.name)}
                    </span>
                    <span className="hidden max-w-44 text-left md:block">
                        <span className="block truncate text-sm font-semibold text-slate-900">{department?.name}</span>
                        <span className="block truncate text-xs text-slate-500">{department?.email}</span>
                    </span>
                </button>
            </div>
        </header>
    );
};

export default Navbar;
