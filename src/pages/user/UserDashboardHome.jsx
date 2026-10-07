import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";
import {
  LuArrowRight,
  LuBell,
  LuBellOff,
  LuCalendar,
  LuCheckCheck,
  LuClock3,
  LuDownload,
  LuFileText,
  LuLayoutGrid,
  LuLoader,
  LuMegaphone,
  LuSiren,
  LuSquarePen,
} from "react-icons/lu";

import { getMyComplaints } from "../../redux/slices/complaintSlice";
import { getNotifications } from "../../redux/slices/notificationSlice";
import Charts from "../../components/user/Charts";
import Reveal from "../../components/common/Reveal";
import { formatBS } from "../../utils/nepaliDate";

const STATUS_STYLES = {
  pending: { badge: "bg-amber-50 text-amber-700", bar: "bg-amber-500" },
  assigned: { badge: "bg-sky-50 text-sky-700", bar: "bg-sky-500" },
  "in-progress": { badge: "bg-[#003893]/10 text-[#003893]", bar: "bg-[#003893]" },
  resolved: { badge: "bg-green-50 text-green-700", bar: "bg-green-600" },
  rejected: { badge: "bg-red-50 text-[#dc143c]", bar: "bg-[#dc143c]" },
};

const STATUSES = ["pending", "assigned", "in-progress", "resolved", "rejected"];

const UserDashboardHome = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isEn = i18n.resolvedLanguage === "en";

  const { myComplaints = [], loading } = useSelector((state) => state.complaint);
  const { notifications = [] } = useSelector((state) => state.notification);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMyComplaints());
    dispatch(getNotifications());
  }, [dispatch]);

  const count = (status) => myComplaints.filter((item) => item.status === status).length;
  const total = myComplaints.length;
  const resolved = count("resolved");
  const resolutionRate = total === 0 ? 0 : Math.round((resolved / total) * 100);

  const stats = [
    { key: "total", value: total, icon: LuFileText, color: "text-[#003893] bg-[#003893]/10", to: "/user/complaints" },
    { key: "waiting", value: count("pending") + count("assigned"), icon: LuClock3, color: "text-amber-600 bg-amber-50", to: "/user/complaints" },
    { key: "inProgress", value: count("in-progress"), icon: LuLoader, color: "text-sky-600 bg-sky-50", to: "/user/complaints" },
    { key: "resolved", value: resolved, icon: LuCheckCheck, color: "text-green-600 bg-green-50", to: "/user/complaints" },
  ];

  const recent = [...myComplaints].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const latestNotifications = notifications.slice(0, 5);
  const firstName = userInfo?.name?.split(" ")[0] || "";

  const quick = [
    { key: "notices", to: "/notices", icon: LuMegaphone },
    { key: "events", to: "/events", icon: LuCalendar },
    { key: "downloads", to: "/downloads", icon: LuDownload },
    { key: "services", to: "/services", icon: LuLayoutGrid },
  ];

  return (
    <div className="space-y-6">

      {/* Welcome */}
      <div className="animate-fade-up relative overflow-hidden rounded-2xl bg-linear-to-r from-[#003893] to-[#0b1b3a] p-6 text-white shadow-md sm:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 90% 20%, #d9a441 0%, transparent 35%), radial-gradient(circle at 10% 90%, #dc143c 0%, transparent 35%)" }}
        />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-[#f0c66b]">{formatBS(new Date(), isEn, "YYYY MMMM DD, ddd")}</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{t("userDash.welcome", { name: firstName })}</h1>
            <p className="mt-2 max-w-xl text-slate-300">{t("userDash.welcomeText")}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/complaint"
              className="flex items-center gap-2 rounded-xl bg-[#d9a441] px-5 py-3 font-semibold text-[#10151c] transition hover:bg-[#c8932f]"
            >
              <LuSquarePen />
              {t("userDash.fileComplaint")}
            </Link>
            <Link
              to="/emergency"
              className="flex items-center gap-2 rounded-xl border border-white/30 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              <LuSiren />
              {t("userDash.sos")}
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map(({ key, value, icon: Icon, color, to }, index) => (
          <Reveal key={key} delay={index * 60}>
            <Link
              to={to}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 border-t-4 border-t-[#003893] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${color}`}>
                <Icon />
              </span>
              <div>
                <p className="text-3xl font-bold text-slate-900">
                  {loading && total === 0 ? "–" : value.toLocaleString(isEn ? "en-US" : "ne-NP")}
                </p>
                <p className="text-sm text-slate-500">{t(`userDash.stats.${key}`)}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      {/* Chart + breakdown */}
      <div className="grid gap-6 xl:grid-cols-3">
        <Reveal className="rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="font-bold text-slate-900">{t("userDash.chartTitle")}</h2>
            <p className="text-sm text-slate-500">{t("userDash.chartText")}</p>
          </div>
          <div className="p-4">
            <Charts />
          </div>
        </Reveal>

        <Reveal delay={100} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-slate-900">{t("userDash.breakdownTitle")}</h2>

          <div className="mt-5 space-y-4">
            {STATUSES.map((status) => {
              const value = count(status);
              const percent = total === 0 ? 0 : Math.round((value / total) * 100);

              return (
                <div key={status}>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">{t(`userDash.status.${status}`)}</span>
                    <span className="font-semibold text-slate-900">{value.toLocaleString(isEn ? "en-US" : "ne-NP")}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full transition-all duration-700 ${STATUS_STYLES[status].bar}`} style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between rounded-xl bg-green-50 px-4 py-3">
            <span className="text-sm font-medium text-green-800">{t("userDash.resolutionRate")}</span>
            <span className="text-2xl font-bold text-green-700">{resolutionRate.toLocaleString(isEn ? "en-US" : "ne-NP")}%</span>
          </div>
        </Reveal>
      </div>

      {/* Recent complaints + notifications */}
      <div className="grid gap-6 xl:grid-cols-3">
        <Reveal className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h2 className="font-bold text-slate-900">{t("userDash.recentTitle")}</h2>
            <Link to="/user/complaints" className="flex items-center gap-1 text-sm font-semibold text-[#003893] hover:underline">
              {t("userDash.viewAll")}
              <LuArrowRight />
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-slate-500">{t("userDash.noComplaints")}</p>
              <Link to="/complaint" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#003893] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#002a6e]">
                <LuSquarePen />
                {t("userDash.firstComplaint")}
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recent.map((complaint) => (
                <li key={complaint._id}>
                  <Link
                    to={`/user/complaints/${complaint.complaintId}`}
                    className="group flex items-center gap-4 px-6 py-4 transition hover:bg-slate-50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-900 group-hover:text-[#003893]">{complaint.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {complaint.complaintId}
                        {complaint.department?.name && ` · ${complaint.department.name}`}
                        {` · ${formatBS(complaint.createdAt, isEn)}`}
                      </p>
                    </div>

                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[complaint.status]?.badge || STATUS_STYLES.pending.badge}`}>
                      {t(`userDash.status.${complaint.status}`, { defaultValue: complaint.status })}
                    </span>
                    <LuArrowRight className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#003893]" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Reveal>

        <Reveal delay={100} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h2 className="flex items-center gap-2 font-bold text-slate-900">
              <LuBell className="text-[#003893]" />
              {t("userDash.notificationsTitle")}
            </h2>
            <Link to="/user/notifications" className="text-sm font-semibold text-[#003893] hover:underline">
              {t("userDash.viewAll")}
            </Link>
          </div>

          {latestNotifications.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-12 text-slate-400">
              <LuBellOff className="text-4xl" />
              <p className="mt-3 text-sm">{t("userDash.noNotifications")}</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {latestNotifications.map((item) => (
                <li key={item._id} className={`flex gap-3 px-6 py-4 ${item.isRead ? "" : "bg-[#003893]/5"}`}>
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.isRead ? "bg-slate-300" : "bg-[#dc143c]"}`} />
                  <div className="min-w-0">
                    {item.title && <p className="text-sm font-semibold text-slate-900">{item.title}</p>}
                    <p className="line-clamp-2 text-sm text-slate-600">{item.message}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </div>

      {/* Quick services */}
      <Reveal className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-slate-900">{t("userDash.quickTitle")}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quick.map(({ key, to, icon: Icon }) => (
            <Link
              key={key}
              to={to}
              className="group flex flex-col items-center gap-2 rounded-xl border border-slate-100 p-4 text-center transition hover:border-[#003893]/30 hover:bg-[#003893]/5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#003893]/10 text-xl text-[#003893] transition group-hover:scale-110">
                <Icon />
              </span>
              <span className="text-sm font-medium text-slate-700">{t(`userDash.quick.${key}`)}</span>
            </Link>
          ))}
        </div>
      </Reveal>
    </div>
  );
};

export default UserDashboardHome;
