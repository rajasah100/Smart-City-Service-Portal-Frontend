import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { LuArrowRight, LuBuilding2, LuFileText, LuMapPin, LuSearch, LuSquarePen } from "react-icons/lu";

import { getMyComplaints } from "../../redux/slices/complaintSlice";
import UserPageHeader from "../../components/user/UserPageHeader";
import Reveal from "../../components/common/Reveal";
import { COMPLAINT_STATUSES, PRIORITY_STYLES, statusStyle } from "../../components/user/complaintStyles";
import { formatBS } from "../../utils/nepaliDate";

const MyComplaints = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isEn = i18n.resolvedLanguage === "en";

  const { myComplaints = [], loading, error } = useSelector((state) => state.complaint);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("new");

  useEffect(() => {
    dispatch(getMyComplaints());
  }, [dispatch]);

  const keyword = search.trim().toLowerCase();

  const filtered = myComplaints
    .filter((complaint) => {
      const matchSearch =
        !keyword ||
        complaint.title?.toLowerCase().includes(keyword) ||
        complaint.complaintId?.toLowerCase().includes(keyword) ||
        complaint.department?.name?.toLowerCase().includes(keyword);

      return matchSearch && (!status || complaint.status === status);
    })
    .sort((a, b) =>
      sort === "new"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

  const countOf = (value) => myComplaints.filter((item) => item.status === value).length;
  const showSkeleton = loading && myComplaints.length === 0;

  return (
    <div className="space-y-6">
      <UserPageHeader icon={LuFileText} title={t("userPages.complaints.title")} text={t("userPages.complaints.text")}>
        <Link
          to="/complaint"
          className="flex items-center gap-2 rounded-xl bg-[#d9a441] px-5 py-2.5 text-sm font-semibold text-[#10151c] transition hover:bg-[#c8932f]"
        >
          <LuSquarePen />
          {t("userPages.complaints.file")}
        </Link>
      </UserPageHeader>

      {/* Status tabs + search */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div role="tablist" className="flex overflow-x-auto border-b border-slate-100">
          {["", ...COMPLAINT_STATUSES].map((value) => (
            <button
              key={value || "all"}
              role="tab"
              aria-selected={status === value}
              onClick={() => setStatus(value)}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
                status === value
                  ? "border-[#003893] text-[#003893]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {value ? t(`userDash.status.${value}`) : t("userPages.complaints.all")}
              <span className={`rounded-full px-2 py-0.5 text-[11px] ${status === value ? "bg-[#003893] text-white" : "bg-slate-100 text-slate-500"}`}>
                {(value ? countOf(value) : myComplaints.length).toLocaleString(isEn ? "en-US" : "ne-NP")}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 p-4 sm:flex-row">
          <div className="relative flex-1">
            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("userPages.complaints.search")}
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#003893] focus:ring-2 focus:ring-[#003893]/20"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#003893]"
          >
            <option value="new">{t("userPages.complaints.sortNew")}</option>
            <option value="old">{t("userPages.complaints.sortOld")}</option>
          </select>
        </div>
      </div>

      {/* List */}
      {showSkeleton ? (
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-28 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : error && myComplaints.length === 0 ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 py-10 text-center text-[#dc143c]">
          {t("userPages.complaints.failed")}
        </p>
      ) : myComplaints.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-14 text-center">
          <LuFileText className="mx-auto text-5xl text-slate-300" />
          <p className="mt-3 text-slate-500">{t("userPages.complaints.none")}</p>
          <Link to="/complaint" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#003893] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#002a6e]">
            <LuSquarePen />
            {t("userPages.complaints.file")}
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center text-slate-500">
          {t("userPages.complaints.empty")}
        </p>
      ) : (
        <>
          <p className="text-sm text-slate-500">{t("userPages.complaints.results", { count: filtered.length })}</p>

          <ul className="space-y-3">
            {filtered.map((complaint, index) => {
              const style = statusStyle(complaint.status);
              const place = [complaint.location?.municipality, complaint.location?.ward && `${t("userPages.detail.ward")} ${complaint.location.ward}`]
                .filter(Boolean)
                .join(", ");

              return (
                <Reveal as="li" key={complaint._id} delay={Math.min(index, 8) * 40}>
                  <Link
                    to={`/user/complaints/${complaint.complaintId}`}
                    className={`group flex flex-col gap-3 rounded-2xl border border-slate-200 border-l-4 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center ${style.border}`}
                  >
                    {complaint.images?.[0]?.url && (
                      <img src={complaint.images[0].url} alt="" className="h-20 w-full rounded-xl object-cover sm:w-24" />
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-[#003893]">{complaint.complaintId}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${style.badge}`}>
                          {t(`userDash.status.${complaint.status}`, { defaultValue: complaint.status })}
                        </span>
                        {complaint.priority && (
                          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${PRIORITY_STYLES[complaint.priority] || PRIORITY_STYLES.low}`}>
                            {t("userPages.complaints.priority")}: {t(`userDash.priority.${complaint.priority}`)}
                          </span>
                        )}
                      </div>

                      <h2 className="mt-1.5 truncate font-semibold text-slate-900 group-hover:text-[#003893]">{complaint.title}</h2>

                      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                        {complaint.department?.name && (
                          <span className="flex items-center gap-1"><LuBuilding2 />{complaint.department.name}</span>
                        )}
                        {place && <span className="flex items-center gap-1"><LuMapPin />{place}</span>}
                        <span>{formatBS(complaint.createdAt, isEn)}</span>
                      </div>
                    </div>

                    <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-[#003893]">
                      {t("userPages.complaints.view")}
                      <LuArrowRight className="transition group-hover:translate-x-1" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
};

export default MyComplaints;
