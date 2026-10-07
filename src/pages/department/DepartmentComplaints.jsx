import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { LuChevronRight, LuInbox, LuSearch, LuX } from "react-icons/lu";
import { getDepartmentComplaints } from "../../redux/slices/complaintSlice";
import ComplaintView from "../../components/department/complaintView";
import { PRIORITY_RANK, PRIORITY_STYLE, STATUSES, STATUS_STYLE, daysSince, placeLine } from "../../components/department/deptUtils";
import { formatBS } from "../../utils/nepaliDate";

const selectClass =
  "rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#003893] focus:ring-2 focus:ring-[#003893]/20";

// Department ko gunaso list: status tab, khoj, priority, kram. ?status= ra ?open=<id> URL bata
const DepartmentComplaints = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isEn = i18n.resolvedLanguage === "en";
  const num = (n) => Number(n).toLocaleString(isEn ? "en-US" : "ne-NP");
  const [params, setParams] = useSearchParams();

  const { departmentComplaints: complaints = [], loading, error } = useSelector((state) => state.complaint);
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("all");
  const [sort, setSort] = useState("newest");

  const status = STATUSES.includes(params.get("status")) ? params.get("status") : "all";
  const openId = params.get("open");
  const selected = complaints.find((complaint) => complaint._id === openId);

  useEffect(() => {
    dispatch(getDepartmentComplaints());
  }, [dispatch]);

  const setParam = (key, value) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    }, { replace: key === "open" ? false : true });
  };

  const counts = useMemo(
    () => Object.fromEntries(STATUSES.map((value) => [value, complaints.filter((c) => c.status === value).length])),
    [complaints]
  );

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return complaints
      .filter((c) => status === "all" || c.status === status)
      .filter((c) => priority === "all" || c.priority === priority)
      .filter((c) =>
        !keyword ||
        [c.complaintId, c.title, c.description, c.user?.name, c.user?.phone, c.location?.tole, c.location?.municipality]
          .some((value) => value?.toLowerCase().includes(keyword))
      )
      .sort((a, b) => {
        if (sort === "priority") return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || new Date(a.createdAt) - new Date(b.createdAt);
        const diff = new Date(b.createdAt) - new Date(a.createdAt);
        return sort === "oldest" ? -diff : diff;
      });
  }, [complaints, status, priority, search, sort]);

  const hasFilter = search || priority !== "all" || status !== "all";
  const tabs = [{ value: "all", count: complaints.length }, ...STATUSES.map((value) => ({ value, count: counts[value] }))];

  return (
    <div className="space-y-5">
      {/* Status tab */}
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div role="tablist" className="flex min-w-max gap-2">
          {tabs.map(({ value, count }) => {
            const active = status === value;
            return (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setParam("status", value === "all" ? "" : value)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active ? "bg-[#003893] text-white shadow-sm" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:text-[#003893]"
                }`}
              >
                {value !== "all" && <span className={`h-2 w-2 rounded-full ${STATUS_STYLE[value].dot}`} />}
                {value === "all" ? t("deptDash.complaints.all") : t(`userDash.status.${value}`)}
                <span className={`rounded-full px-1.5 text-xs ${active ? "bg-white/20" : "bg-slate-100"}`}>{num(count)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Khoj ra filter */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm md:flex-row">
        <div className="relative flex-1">
          <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("deptDash.complaints.search")}
            className={`${selectClass} w-full pl-10`}
          />
        </div>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className={selectClass} aria-label={t("deptDash.complaints.cols.priority")}>
          <option value="all">{t("deptDash.complaints.allPriority")}</option>
          {["high", "medium", "low"].map((value) => (
            <option key={value} value={value}>{t(`userDash.priority.${value}`)}</option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectClass} aria-label="sort">
          {["newest", "oldest", "priority"].map((value) => (
            <option key={value} value={value}>{t(`deptDash.complaints.sort.${value}`)}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>{t("deptDash.complaints.count", { count: num(filtered.length) })}</span>
        {hasFilter && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setPriority("all");
              setParam("status", "");
            }}
            className="flex items-center gap-1 font-semibold text-[#003893] hover:underline"
          >
            <LuX />
            {t("deptDash.complaints.clear")}
          </button>
        )}
      </div>

      {/* List */}
      {loading && complaints.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3].map((item) => <div key={item} className="h-20 animate-pulse rounded-2xl bg-white" />)}
        </div>
      ) : error && complaints.length === 0 ? (
        <p className="rounded-2xl bg-red-50 p-5 text-sm text-red-700">{error}</p>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white py-14 text-center">
          <LuInbox className="text-4xl text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">
            {complaints.length === 0 ? t("deptDash.complaints.empty") : t("deptDash.complaints.emptyFilter")}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Desktop table */}
          <table className="hidden w-full text-sm lg:table">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                {["id", "subject", "citizen", "priority", "status", "date"].map((key) => (
                  <th key={key} className="px-4 py-3">{t(`deptDash.complaints.cols.${key}`)}</th>
                ))}
                <th className="px-4 py-3"><span className="sr-only">{t("deptDash.complaints.cols.action")}</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((complaint) => {
                const days = daysSince(complaint.createdAt);
                const open = ["pending", "assigned", "in-progress"].includes(complaint.status);
                return (
                  <tr
                    key={complaint._id}
                    onClick={() => setParam("open", complaint._id)}
                    className="cursor-pointer transition hover:bg-[#003893]/5"
                  >
                    <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs font-semibold text-[#003893]">{complaint.complaintId}</td>
                    <td className="max-w-xs px-4 py-3.5">
                      <p className="truncate font-semibold text-slate-900">{complaint.title}</p>
                      <p className="truncate text-xs text-slate-500">{placeLine(complaint.location, isEn, num)}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="whitespace-nowrap font-medium text-slate-800">{complaint.user?.name || t("deptDash.complaints.unknownUser")}</p>
                      <p className="text-xs text-slate-500">{complaint.phone || complaint.user?.phone}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${PRIORITY_STYLE[complaint.priority]?.badge}`}>
                        {t(`userDash.priority.${complaint.priority}`)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${STATUS_STYLE[complaint.status]?.badge}`}>
                        {t(`userDash.status.${complaint.status}`)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-xs">
                      <p className="text-slate-700">{formatBS(complaint.createdAt, isEn, "YYYY MMMM DD")}</p>
                      {open && days >= 3 && <p className="font-medium text-[#dc143c]">{t("deptDash.home.waiting", { count: num(days) })}</p>}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#003893]">
                        {t("deptDash.complaints.view")}
                        <LuChevronRight />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Mobile card */}
          <ul className="divide-y divide-slate-100 lg:hidden">
            {filtered.map((complaint) => (
              <li key={complaint._id}>
                <button type="button" onClick={() => setParam("open", complaint._id)} className="flex w-full gap-3 p-4 text-left transition hover:bg-slate-50">
                  <span className={`w-1 shrink-0 rounded-full ${STATUS_STYLE[complaint.status]?.dot}`} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-semibold text-[#003893]">{complaint.complaintId}</span>
                      <span className="text-xs text-slate-400">{formatBS(complaint.createdAt, isEn, "MMMM DD")}</span>
                    </span>
                    <span className="mt-1 block font-semibold text-slate-900">{complaint.title}</span>
                    <span className="mt-0.5 block truncate text-xs text-slate-500">{placeLine(complaint.location, isEn, num)}</span>
                    <span className="mt-2 flex flex-wrap gap-1.5 text-xs font-semibold">
                      <span className={`rounded-full px-2 py-0.5 ring-1 ${STATUS_STYLE[complaint.status]?.badge}`}>{t(`userDash.status.${complaint.status}`)}</span>
                      <span className={`rounded-full px-2 py-0.5 ${PRIORITY_STYLE[complaint.priority]?.badge}`}>{t(`userDash.priority.${complaint.priority}`)}</span>
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selected && <ComplaintView key={selected._id} complaint={selected} onClose={() => setParam("open", "")} />}
    </div>
  );
};

export default DepartmentComplaints;
