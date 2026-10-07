import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  LuArrowRight,
  LuBell,
  LuCircleCheck,
  LuCircleX,
  LuClipboardList,
  LuClock3,
  LuFileText,
  LuHammer,
  LuMapPin,
  LuMapPinned,
  LuSiren,
  LuTriangleAlert,
} from "react-icons/lu";
import { getDepartmentComplaints } from "../../redux/slices/complaintSlice";
import MonthlyChart from "../../components/department/MonthlyChart";
import {
  PRIORITY_RANK,
  PRIORITY_STYLE,
  STATUSES,
  STATUS_STYLE,
  daysSince,
  placeLine,
  serviceAreaText,
} from "../../components/department/deptUtils";
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

// Department ko mukhya page: sankhya, chart, jaruri gunaso, haalaika gunaso
const DepartmentHomePage = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isEn = i18n.resolvedLanguage === "en";
  const num = (n) => Number(n).toLocaleString(isEn ? "en-US" : "ne-NP");

  const { departmentComplaints: complaints = [], loading } = useSelector((state) => state.complaint);
  const { department } = useSelector((state) => state.department);

  useEffect(() => {
    dispatch(getDepartmentComplaints());
  }, [dispatch]);

  const count = (status) => complaints.filter((c) => c.status === status).length;
  const byStatus = Object.fromEntries(STATUSES.map((status) => [status, count(status)]));
  const total = complaints.length;
  const working = byStatus.assigned + byStatus["in-progress"];
  const closed = byStatus.resolved + byStatus.rejected;
  const rate = closed ? Math.round((byStatus.resolved / closed) * 100) : null;

  // Samadhan huna lageko aausat din
  const resolvedTimes = complaints
    .filter((c) => c.status === "resolved" && c.resolvedAt)
    .map((c) => (new Date(c.resolvedAt) - new Date(c.createdAt)) / 86400000);
  const avgDays = resolvedTimes.length ? Math.max(1, Math.round(resolvedTimes.reduce((a, b) => a + b, 0) / resolvedTimes.length)) : null;

  // Khula gunaso madhye uchcha priority ra puranai pahile
  const attention = complaints
    .filter((c) => ["pending", "assigned", "in-progress"].includes(c.status))
    .filter((c) => c.priority === "high" || daysSince(c.createdAt) >= 3)
    .sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || new Date(a.createdAt) - new Date(b.createdAt))
    .slice(0, 5);

  const stats = [
    { key: "total", value: total, icon: LuClipboardList, tone: "bg-[#003893]/10 text-[#003893]", to: "" },
    { key: "pending", value: byStatus.pending, icon: LuClock3, tone: "bg-amber-100 text-amber-700", to: "?status=pending" },
    { key: "working", value: working, icon: LuHammer, tone: "bg-indigo-100 text-indigo-700", to: "?status=in-progress" },
    { key: "resolved", value: byStatus.resolved, icon: LuCircleCheck, tone: "bg-green-100 text-green-700", to: "?status=resolved" },
    { key: "rejected", value: byStatus.rejected, icon: LuCircleX, tone: "bg-red-100 text-red-700", to: "?status=rejected" },
  ];

  const quick = [
    { key: "complaints", to: "/department/complaints", icon: LuFileText },
    { key: "map", to: "/department/location", icon: LuMapPinned },
    { key: "notice", to: "/department/notices", icon: LuBell },
    { key: "sos", to: "/department/sos", icon: LuSiren },
  ];

  const open = (complaint) => `/department/complaints?open=${complaint._id}`;

  return (
    <div className="space-y-6">
      {/* Swagat */}
      <section className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#002a6e] to-[#003893] p-6 text-white shadow-md sm:p-8">
        <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/5" aria-hidden="true" />
        <div className="absolute -bottom-20 right-24 h-44 w-44 rounded-full bg-[#dc143c]/20" aria-hidden="true" />

        <div className="relative">
          <p className="text-sm font-medium text-amber-300">
            {t("deptDash.home.greeting")} · {formatBS(new Date(), isEn, "YYYY MMMM DD, ddd")}
          </p>
          <h2 className="mt-1 text-2xl font-bold sm:text-3xl">{t("deptDash.home.welcome", { name: department?.name || "" })}</h2>
          <p className="mt-2 max-w-2xl text-sm text-white/80">{t("deptDash.home.welcomeText")}</p>

          {department && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm ring-1 ring-white/20">
              <LuMapPin className="text-amber-300" />
              {t("deptDash.area.label")}: <strong className="font-semibold">{serviceAreaText(department.serviceArea, t, isEn)}</strong>
            </p>
          )}
        </div>
      </section>

      {/* Sankhya */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {stats.map(({ key, value, icon: Icon, tone, to }, index) => (
          <Link
            key={key}
            to={`/department/complaints${to}`}
            style={{ "--delay": `${index * 60}ms` }}
            className="animate-fade-up group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl transition group-hover:scale-110 ${tone}`}>
              <Icon />
            </span>
            <p className="mt-4 text-3xl font-bold text-slate-900">{loading && !total ? "–" : num(value)}</p>
            <p className="mt-0.5 text-sm text-slate-500">{t(`deptDash.home.stats.${key}`)}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Chart */}
        <Card title={t("deptDash.home.chartTitle")} text={t("deptDash.home.chartText")} className="xl:col-span-2">
          <MonthlyChart complaints={complaints} />
        </Card>

        {/* Avastha ra priority */}
        <Card title={t("deptDash.home.statusTitle")}>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-green-50 p-3">
              <p className="text-xs text-green-800">{t("deptDash.home.resolutionRate")}</p>
              <p className="text-xl font-bold text-green-700">{rate === null ? "–" : `${num(rate)}%`}</p>
            </div>
            <div className="rounded-xl bg-[#003893]/5 p-3">
              <p className="text-xs text-[#003893]">{t("deptDash.home.avgTime")}</p>
              <p className="text-xl font-bold text-[#003893]">{avgDays === null ? "–" : t("deptDash.home.days", { count: num(avgDays) })}</p>
            </div>
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

          <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">{t("deptDash.home.priorityTitle")}</p>
          <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-slate-100">
            {["high", "medium", "low"].map((priority) => {
              const value = complaints.filter((c) => c.priority === priority).length;
              return value ? (
                <div key={priority} style={{ width: `${(value / total) * 100}%`, background: PRIORITY_STYLE[priority].color }} title={`${t(`userDash.priority.${priority}`)}: ${num(value)}`} />
              ) : null;
            })}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
            {["high", "medium", "low"].map((priority) => (
              <span key={priority} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: PRIORITY_STYLE[priority].color }} />
                {t(`userDash.priority.${priority}`)} ({num(complaints.filter((c) => c.priority === priority).length)})
              </span>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Jaruri */}
        <Card
          title={
            <span className="flex items-center gap-2">
              <LuTriangleAlert className="text-[#dc143c]" />
              {t("deptDash.home.attentionTitle")}
            </span>
          }
          text={t("deptDash.home.attentionText")}
        >
          {attention.length === 0 ? (
            <p className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-6 text-sm text-green-800">
              <LuCircleCheck className="shrink-0 text-lg" />
              {t("deptDash.home.attentionEmpty")}
            </p>
          ) : (
            <ul className="-my-2 divide-y divide-slate-100">
              {attention.map((complaint) => {
                const days = daysSince(complaint.createdAt);
                return (
                  <li key={complaint._id}>
                    <Link to={open(complaint)} className="block py-3 transition hover:opacity-80">
                      <p className="line-clamp-1 text-sm font-semibold text-slate-900">{complaint.title}</p>
                      <p className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                        <span className={`rounded px-1.5 py-0.5 font-medium ${PRIORITY_STYLE[complaint.priority]?.badge}`}>
                          {t(`userDash.priority.${complaint.priority}`)}
                        </span>
                        <span className={days >= 3 ? "font-medium text-[#dc143c]" : "text-slate-500"}>
                          {days === 0 ? t("deptDash.home.waitingToday") : t("deptDash.home.waiting", { count: num(days) })}
                        </span>
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        {/* Haalaika gunaso */}
        <Card
          title={t("deptDash.home.recentTitle")}
          text={t("deptDash.home.recentText")}
          className="xl:col-span-2"
          action={
            <Link to="/department/complaints" className="flex shrink-0 items-center gap-1 text-sm font-semibold text-[#003893] hover:underline">
              {t("deptDash.home.viewAll")}
              <LuArrowRight />
            </Link>
          }
        >
          {complaints.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">{loading ? "…" : t("deptDash.home.noComplaints")}</p>
          ) : (
            <ul className="-my-2 divide-y divide-slate-100">
              {complaints.slice(0, 5).map((complaint) => (
                <li key={complaint._id}>
                  <Link to={open(complaint)} className="flex items-center gap-4 py-3 transition hover:bg-slate-50 sm:-mx-2 sm:rounded-xl sm:px-2">
                    <span className={`h-10 w-1 shrink-0 rounded-full ${STATUS_STYLE[complaint.status]?.dot}`} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-slate-900">{complaint.title}</span>
                      <span className="mt-0.5 block truncate text-xs text-slate-500">
                        <span className="font-mono">{complaint.complaintId}</span> · {placeLine(complaint.location, isEn, num)}
                      </span>
                    </span>
                    <span className="hidden text-right sm:block">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${STATUS_STYLE[complaint.status]?.badge}`}>
                        {t(`userDash.status.${complaint.status}`)}
                      </span>
                      <span className="mt-1 block text-xs text-slate-400">{formatBS(complaint.createdAt, isEn, "MMMM DD")}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Chhito pahunch */}
      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">{t("deptDash.home.quickTitle")}</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {quick.map(({ key, to, icon: Icon }) => (
            <Link
              key={key}
              to={to}
              className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-[#003893]/40 hover:text-[#003893]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#003893]/10 text-lg text-[#003893] transition group-hover:bg-[#003893] group-hover:text-white">
                <Icon />
              </span>
              {t(`deptDash.home.quick.${key}`)}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DepartmentHomePage;
