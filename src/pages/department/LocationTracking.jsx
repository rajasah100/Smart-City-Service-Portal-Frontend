import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { LuMapPinOff, LuSearch } from "react-icons/lu";
import { getDepartmentComplaints } from "../../redux/slices/complaintSlice";
import ComplaintMap from "../../components/department/ComplaintMap";
import { PRIORITY_STYLE, STATUSES, STATUS_STYLE, hasLocation, placeLine } from "../../components/department/deptUtils";

const selectClass =
  "rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#003893] focus:ring-2 focus:ring-[#003893]/20";

// Gunaso naksa: baya list, daya naksa (marker ko rang = avastha)
const LocationTracking = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isEn = i18n.resolvedLanguage === "en";
  const num = (n) => Number(n).toLocaleString(isEn ? "en-US" : "ne-NP");

  const { departmentComplaints: complaints = [], loading } = useSelector((state) => state.complaint);
  const [search, setSearch] = useState("");
  // Default: kaam baki bhaeka (samadhan/asvikrit bahek)
  const [status, setStatus] = useState("open");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    dispatch(getDepartmentComplaints());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return complaints
      .filter((c) =>
        status === "all" ? true : status === "open" ? ["pending", "assigned", "in-progress"].includes(c.status) : c.status === status
      )
      .filter((c) => !keyword || [c.complaintId, c.title, c.user?.name, c.location?.tole, c.location?.municipality].some((v) => v?.toLowerCase().includes(keyword)));
  }, [complaints, search, status]);

  const onMap = filtered.filter(hasLocation).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm md:flex-row md:items-center">
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
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass} aria-label={t("deptDash.complaints.cols.status")}>
          <option value="open">{`${t("userDash.status.pending")} + ${t("userDash.status.in-progress")}`}</option>
          <option value="all">{t("deptDash.complaints.all")}</option>
          {STATUSES.map((value) => (
            <option key={value} value={value}>{t(`userDash.status.${value}`)}</option>
          ))}
        </select>
        <span className="rounded-full bg-[#003893]/10 px-3 py-1.5 text-center text-sm font-semibold text-[#003893]">
          {t("deptDash.map.showing", { count: num(onMap) })}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* List */}
        <section className="flex max-h-[70vh] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-1">
          <header className="border-b border-slate-100 px-4 py-3">
            <h2 className="font-bold text-slate-900">{t("deptDash.map.listTitle")}</h2>
            <p className="text-xs text-slate-500">{t("deptDash.map.listText")}</p>
          </header>

          <ul className="flex-1 divide-y divide-slate-100 overflow-y-auto">
            {loading && complaints.length === 0 ? (
              [1, 2, 3].map((item) => <li key={item} className="m-3 h-16 animate-pulse rounded-xl bg-slate-100" />)
            ) : filtered.length === 0 ? (
              <li className="px-4 py-10 text-center text-sm text-slate-500">{t("deptDash.map.empty")}</li>
            ) : (
              filtered.map((complaint) => {
                const active = complaint._id === selectedId;
                const located = hasLocation(complaint);
                return (
                  <li key={complaint._id}>
                    <button
                      type="button"
                      disabled={!located}
                      onClick={() => setSelectedId(complaint._id)}
                      className={`flex w-full gap-3 px-4 py-3 text-left transition ${active ? "bg-[#003893]/5" : "hover:bg-slate-50"} disabled:cursor-default`}
                    >
                      <span className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ring-2 ring-white ${STATUS_STYLE[complaint.status]?.dot}`} />
                      <span className="min-w-0 flex-1">
                        <span className={`block truncate text-sm font-semibold ${active ? "text-[#003893]" : "text-slate-900"}`}>{complaint.title}</span>
                        <span className="block truncate text-xs text-slate-500">{placeLine(complaint.location, isEn, num)}</span>
                        <span className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold">
                          <span className={`rounded px-1.5 py-0.5 ${PRIORITY_STYLE[complaint.priority]?.badge}`}>{t(`userDash.priority.${complaint.priority}`)}</span>
                          {!located && (
                            <span className="flex items-center gap-1 text-slate-400">
                              <LuMapPinOff />
                              {t("deptDash.map.noLocation")}
                            </span>
                          )}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </section>

        {/* Naksa */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-slate-100 px-4 py-3 text-xs text-slate-600">
            {STATUSES.map((value) => (
              <span key={value} className="flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${STATUS_STYLE[value].dot}`} />
                {t(`userDash.status.${value}`)}
              </span>
            ))}
          </div>
          <div className="h-[65vh]">
            <ComplaintMap complaints={filtered} selectedId={selectedId} onSelect={setSelectedId} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default LocationTracking;
