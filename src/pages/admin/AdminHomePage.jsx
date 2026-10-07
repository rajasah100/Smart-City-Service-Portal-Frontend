import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
    LuArrowRight,
    LuBuilding2,
    LuCalendarDays,
    LuCircleCheck,
    LuClipboardList,
    LuClock3,
    LuFileText,
    LuHammer,
    LuMail,
    LuMegaphone,
    LuSettings,
    LuShieldPlus,
    LuSiren,
    LuTriangleAlert,
    LuUsers,
} from "react-icons/lu";
import { getAllComplaints } from "../../redux/slices/complaintSlice";
import { getDepartments } from "../../redux/slices/departmentSlice";
import { getUsers } from "../../redux/slices/userSlice";
import { getEvents } from "../../redux/slices/eventSlice";
import { getNotices } from "../../redux/slices/noticeSlice";
import apiRequest from "../../utils/apiRequest";
import MonthlyChart from "../../components/department/MonthlyChart";
import ComplaintViewModal from "../../components/admin/complaints/ComplaintViewModal";
import { PRIORITY_RANK, PRIORITY_STYLE, STATUSES, STATUS_STYLE, daysSince, placeLine } from "../../components/department/deptUtils";
import { formatBS } from "../../utils/nepaliDate";

const Card = ({ title, text, action, children, className = "" }) => (
    <section className={`min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
        <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
                <h2 className="font-bold text-slate-900">{title}</h2>
                {text && <p className="mt-0.5 text-xs text-slate-500">{text}</p>}
            </div>
            {action}
        </header>
        <div className="p-5">{children}</div>
    </section>
);

const OPEN = ["pending", "assigned", "in-progress"];

// Admin ko mukhya page: pura portal ko sankhya, chart, vibhag anusar, jaruri gunaso
const AdminHomePage = () => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage === "en";
    const num = (n) => Number(n).toLocaleString(isEn ? "en-US" : "ne-NP");

    const [selected, setSelected] = useState(null);
    const [extra, setExtra] = useState({ sos: null, unread: null });

    const { allComplaints: complaints = [], loading } = useSelector((state) => state.complaint);
    const { departments = [] } = useSelector((state) => state.department);
    const { users = [] } = useSelector((state) => state.user);
    const { notices = [] } = useSelector((state) => state.notice);
    const { events = [] } = useSelector((state) => state.event);
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getAllComplaints());
        dispatch(getDepartments());
        dispatch(getUsers());
        dispatch(getNotices());
        dispatch(getEvents());

        // Sakriya SOS ra napadhieka sandesh (Redux ma chhainan, sidhai)
        let ignore = false;
        Promise.allSettled([apiRequest.get("/sos", { params: { status: "open" } }), apiRequest.get("/contact")]).then(([sos, contact]) => {
            if (ignore) return;
            setExtra({
                sos: sos.status === "fulfilled" ? (sos.value.data.alerts || []).length : null,
                unread: contact.status === "fulfilled" ? contact.value.data.unread ?? null : null,
            });
        });
        return () => {
            ignore = true;
        };
    }, [dispatch]);

    const byStatus = useMemo(() => Object.fromEntries(STATUSES.map((s) => [s, complaints.filter((c) => c.status === s).length])), [complaints]);
    const total = complaints.length;
    const closed = byStatus.resolved + byStatus.rejected;
    const rate = closed ? Math.round((byStatus.resolved / closed) * 100) : null;
    const today = new Date().setHours(0, 0, 0, 0);
    const upcoming = (Array.isArray(events) ? events : []).filter((e) => !e.isCancelled && new Date(e.startDate) >= today).length;

    // Vibhag anusar: jamma, baki, samadhan
    const performance = useMemo(() => {
        const rows = new Map();
        complaints.forEach((c) => {
            const id = c.department?._id || "none";
            const row = rows.get(id) || { id, name: c.department?.name || t("adminDash.home.noDepartment"), total: 0, open: 0, resolved: 0 };
            row.total++;
            if (OPEN.includes(c.status)) row.open++;
            if (c.status === "resolved") row.resolved++;
            rows.set(id, row);
        });
        return [...rows.values()].sort((a, b) => b.total - a.total).slice(0, 8);
    }, [complaints, t]);

    const attention = complaints
        .filter((c) => OPEN.includes(c.status) && (c.priority === "high" || daysSince(c.createdAt) >= 3))
        .sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || new Date(a.createdAt) - new Date(b.createdAt))
        .slice(0, 6);

    const stats = [
        { key: "total", value: total, icon: LuClipboardList, tone: "bg-[#003893]/10 text-[#003893]", to: "/admin/complaints" },
        { key: "pending", value: byStatus.pending, icon: LuClock3, tone: "bg-amber-100 text-amber-700", to: "/admin/complaints" },
        { key: "working", value: byStatus.assigned + byStatus["in-progress"], icon: LuHammer, tone: "bg-indigo-100 text-indigo-700", to: "/admin/complaints" },
        { key: "resolved", value: byStatus.resolved, icon: LuCircleCheck, tone: "bg-green-100 text-green-700", to: "/admin/complaints" },
    ];

    const small = [
        { key: "users", value: users.length, icon: LuUsers, to: "/admin/users" },
        { key: "departments", value: departments.length, icon: LuBuilding2, to: "/admin/departments" },
        { key: "notices", value: notices.length, icon: LuMegaphone, to: "/admin/notices" },
        { key: "upcoming", value: upcoming, icon: LuCalendarDays, to: "/admin/events" },
    ];

    const quick = [
        { key: "complaints", to: "/admin/complaints", icon: LuFileText },
        { key: "department", to: "/admin/departments", icon: LuBuilding2 },
        { key: "notice", to: "/admin/notices", icon: LuMegaphone },
        { key: "event", to: "/admin/events", icon: LuCalendarDays },
        { key: "emergency", to: "/admin/emergency-services", icon: LuShieldPlus },
        { key: "settings", to: "/admin/settings", icon: LuSettings },
    ];

    const blank = loading && total === 0;

    return (
        <div className="space-y-6">
            {/* Swagat */}
            <section className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#10151c] via-[#002a6e] to-[#003893] p-6 text-white shadow-md sm:p-8">
                <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/5" aria-hidden="true" />
                <div className="absolute -bottom-20 right-24 h-44 w-44 rounded-full bg-[#dc143c]/20" aria-hidden="true" />

                <div className="relative">
                    <p className="text-sm font-medium text-amber-300">
                        {t("adminDash.home.greeting")} · {formatBS(new Date(), isEn, "YYYY MMMM DD, ddd")}
                    </p>
                    <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{t("adminDash.home.welcome", { name: userInfo?.name || "" })}</h1>
                    <p className="mt-2 text-sm text-white/80">{t("adminDash.home.welcomeText")}</p>

                    <div className="mt-5 flex flex-wrap gap-3">
                        <Link
                            to="/admin/sos"
                            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ring-1 transition ${
                                extra.sos ? "bg-[#dc143c] ring-[#dc143c] hover:bg-[#b51031]" : "bg-white/10 ring-white/20 hover:bg-white/20"
                            }`}
                        >
                            {extra.sos ? (
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
                                </span>
                            ) : (
                                <LuSiren />
                            )}
                            {extra.sos ? t("adminDash.home.activeSos", { count: num(extra.sos) }) : t("adminDash.home.noSos")}
                        </Link>
                        <Link
                            to="/admin/messages"
                            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/20 transition hover:bg-white/20"
                        >
                            <LuMail />
                            {extra.unread ? t("adminDash.home.unread", { count: num(extra.unread) }) : t("adminDash.home.noUnread")}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Mukhya sankhya */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {stats.map(({ key, value, icon: Icon, tone, to }) => (
                    <Link key={key} to={to} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        <span className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl transition group-hover:scale-110 ${tone}`}>
                            <Icon />
                        </span>
                        <p className="mt-4 text-3xl font-bold text-slate-900">{blank ? "–" : num(value)}</p>
                        <p className="mt-0.5 text-sm text-slate-500">{t(`adminDash.home.stats.${key}`)}</p>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {small.map(({ key, value, icon: Icon, to }) => (
                    <Link key={key} to={to} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-[#003893]/40">
                        <Icon className="shrink-0 text-xl text-[#003893]" />
                        <span className="min-w-0">
                            <span className="block text-lg font-bold leading-tight text-slate-900">{num(value)}</span>
                            <span className="block truncate text-xs text-slate-500">{t(`adminDash.home.stats.${key}`)}</span>
                        </span>
                    </Link>
                ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
                <Card title={t("adminDash.home.chartTitle")} text={t("adminDash.home.chartText")} className="xl:col-span-2">
                    <MonthlyChart complaints={complaints} />
                </Card>

                <Card title={t("adminDash.home.statusTitle")}>
                    <div className="rounded-xl bg-green-50 p-3">
                        <p className="text-xs text-green-800">{t("adminDash.home.resolutionRate")}</p>
                        <p className="text-2xl font-bold text-green-700">{rate === null ? "–" : `${num(rate)}%`}</p>
                    </div>
                    <ul className="mt-5 space-y-3">
                        {STATUSES.map((status) => (
                            <li key={status}>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2 text-slate-700">
                                        <span className={`h-2.5 w-2.5 rounded-full ${STATUS_STYLE[status].dot}`} />
                                        {t(`userDash.status.${status}`)}
                                    </span>
                                    <span className="font-semibold text-slate-900">{num(byStatus[status])}</span>
                                </div>
                                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="h-full rounded-full transition-all duration-700"
                                        style={{ width: `${total ? (byStatus[status] / total) * 100 : 0}%`, background: STATUS_STYLE[status].color }}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
                {/* Vibhag ko kaam */}
                <Card title={t("adminDash.home.deptTitle")} text={t("adminDash.home.deptText")} className="xl:col-span-2">
                    <div className="-mx-5 -my-5 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                <tr>
                                    {["department", "total", "open", "resolved", "rate"].map((key) => (
                                        <th key={key} className={`px-5 py-3 ${key === "department" ? "" : "text-right"}`}>{t(`adminDash.home.deptCols.${key}`)}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {performance.map((row) => {
                                    const percent = row.total ? Math.round((row.resolved / row.total) * 100) : 0;
                                    return (
                                        <tr key={row.id}>
                                            <td className="max-w-56 truncate px-5 py-3 font-medium text-slate-800">{row.name}</td>
                                            <td className="px-5 py-3 text-right">{num(row.total)}</td>
                                            <td className={`px-5 py-3 text-right ${row.open ? "font-semibold text-amber-700" : "text-slate-400"}`}>{num(row.open)}</td>
                                            <td className="px-5 py-3 text-right text-green-700">{num(row.resolved)}</td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <div className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-slate-100 sm:block">
                                                        <div className="h-full rounded-full bg-green-600" style={{ width: `${percent}%` }} />
                                                    </div>
                                                    <span className="w-10 text-right text-xs font-semibold text-slate-600">{num(percent)}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {performance.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-8 text-center text-slate-500">{t("adminDash.home.noComplaints")}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Jaruri */}
                <Card
                    title={
                        <span className="flex items-center gap-2">
                            <LuTriangleAlert className="text-[#dc143c]" />
                            {t("adminDash.home.attentionTitle")}
                        </span>
                    }
                    text={t("adminDash.home.attentionText")}
                >
                    {attention.length === 0 ? (
                        <p className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-6 text-sm text-green-800">
                            <LuCircleCheck className="shrink-0 text-lg" />
                            {t("adminDash.home.attentionEmpty")}
                        </p>
                    ) : (
                        <ul className="-my-2 divide-y divide-slate-100">
                            {attention.map((complaint) => {
                                const days = daysSince(complaint.createdAt);
                                return (
                                    <li key={complaint._id}>
                                        <button type="button" onClick={() => setSelected(complaint)} className="block w-full py-3 text-left transition hover:opacity-80">
                                            <span className="line-clamp-1 text-sm font-semibold text-slate-900">{complaint.title}</span>
                                            <span className="mt-0.5 block truncate text-xs text-slate-500">{complaint.department?.name}</span>
                                            <span className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                                                <span className={`rounded px-1.5 py-0.5 font-medium ${PRIORITY_STYLE[complaint.priority]?.badge}`}>
                                                    {t(`userDash.priority.${complaint.priority}`)}
                                                </span>
                                                <span className={days >= 3 ? "font-medium text-[#dc143c]" : "text-slate-500"}>
                                                    {days === 0 ? t("deptDash.home.waitingToday") : t("deptDash.home.waiting", { count: num(days) })}
                                                </span>
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </Card>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
                {/* Haalaika */}
                <Card
                    title={t("adminDash.home.recentTitle")}
                    className="xl:col-span-2"
                    action={
                        <Link to="/admin/complaints" className="flex shrink-0 items-center gap-1 text-sm font-semibold text-[#003893] hover:underline">
                            {t("adminDash.home.viewAll")}
                            <LuArrowRight />
                        </Link>
                    }
                >
                    {complaints.length === 0 ? (
                        <p className="py-8 text-center text-sm text-slate-500">{loading ? "…" : t("adminDash.home.noComplaints")}</p>
                    ) : (
                        <ul className="-my-2 divide-y divide-slate-100">
                            {complaints.slice(0, 6).map((complaint) => (
                                <li key={complaint._id}>
                                    <button type="button" onClick={() => setSelected(complaint)} className="flex w-full items-center gap-4 py-3 text-left transition hover:bg-slate-50 sm:-mx-2 sm:rounded-xl sm:px-2">
                                        <span className={`h-10 w-1 shrink-0 rounded-full ${STATUS_STYLE[complaint.status]?.dot}`} />
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-sm font-semibold text-slate-900">{complaint.title}</span>
                                            <span className="mt-0.5 block truncate text-xs text-slate-500">
                                                {complaint.department?.name} · {placeLine(complaint.location, isEn, num)}
                                            </span>
                                        </span>
                                        <span className="hidden text-right sm:block">
                                            <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${STATUS_STYLE[complaint.status]?.badge}`}>
                                                {t(`userDash.status.${complaint.status}`)}
                                            </span>
                                            <span className="mt-1 block text-xs text-slate-400">{formatBS(complaint.createdAt, isEn, "MMMM DD")}</span>
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>

                {/* Chhito pahunch */}
                <Card title={t("adminDash.home.quickTitle")}>
                    <div className="grid grid-cols-2 gap-3">
                        {quick.map(({ key, to, icon: Icon }) => (
                            <Link
                                key={key}
                                to={to}
                                className="group flex flex-col items-start gap-2 rounded-xl border border-slate-200 p-3 text-sm font-semibold text-slate-800 transition hover:border-[#003893]/40 hover:text-[#003893]"
                            >
                                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#003893]/10 text-[#003893] transition group-hover:bg-[#003893] group-hover:text-white">
                                    <Icon />
                                </span>
                                {t(`adminDash.home.quick.${key}`)}
                            </Link>
                        ))}
                    </div>
                </Card>
            </div>

            <ComplaintViewModal open={!!selected} complaint={selected} onClose={() => setSelected(null)} />
        </div>
    );
};

export default AdminHomePage;
