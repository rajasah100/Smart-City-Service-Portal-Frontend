import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { LuEye, LuMegaphone, LuPaperclip, LuPencil, LuPlus, LuSearch, LuTrash2 } from "react-icons/lu";
import { deleteNotice, getDepartmentNotices } from "../../redux/slices/noticeSlice";
import NoticeForm from "../../components/department/NoticeForm";
import NoticeView from "../../components/department/NoticeView";
import { PRIORITY_STYLE, municipalityLabel } from "../../components/department/deptUtils";
import { formatBS } from "../../utils/nepaliDate";

// Department ko notice: khoj, tab, card list, banaune/sampadan/herne/hataune
const DepartmentNoticePage = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isEn = i18n.resolvedLanguage === "en";
  const num = (n) => Number(n).toLocaleString(isEn ? "en-US" : "ne-NP");

  const { departmentNotices: notices = [], loading } = useSelector((state) => state.notice);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  // { mode: "form" | "view", notice }
  const [modal, setModal] = useState(null);

  useEffect(() => {
    dispatch(getDepartmentNotices());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return notices
      .filter((n) => tab === "all" || n.status === tab)
      .filter((n) => !keyword || [n.title, n.description].some((v) => v?.toLowerCase().includes(keyword)));
  }, [notices, search, tab]);

  const handleDelete = async (notice) => {
    if (!window.confirm(t("deptDash.notices.deleteConfirm"))) return;

    try {
      await dispatch(deleteNotice(notice._id)).unwrap();
      toast.success(t("deptDash.notices.deleted"));
    } catch (error) {
      toast.error(error?.message || t("deptDash.notices.failed"));
    }
  };

  const tabs = [
    { value: "all", count: notices.length },
    { value: "active", count: notices.filter((n) => n.status === "active").length },
    { value: "archived", count: notices.filter((n) => n.status !== "active").length },
  ];

  const closeModal = () => setModal(null);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div role="tablist" className="flex gap-2">
          {tabs.map(({ value, count }) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={tab === value}
              onClick={() => setTab(value)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab === value ? "bg-[#003893] text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:text-[#003893]"
              }`}
            >
              {t(`deptDash.notices.${value}`)}
              <span className={`rounded-full px-1.5 text-xs ${tab === value ? "bg-white/20" : "bg-slate-100"}`}>{num(count)}</span>
            </button>
          ))}
        </div>

        <div className="relative flex-1">
          <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("deptDash.notices.search")}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#003893] focus:ring-2 focus:ring-[#003893]/20"
          />
        </div>

        <button
          type="button"
          onClick={() => setModal({ mode: "form", notice: null })}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#dc143c] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#b51031]"
        >
          <LuPlus />
          {t("deptDash.notices.add")}
        </button>
      </div>

      {loading && notices.length === 0 ? (
        <div className="space-y-3">{[1, 2, 3].map((item) => <div key={item} className="h-24 animate-pulse rounded-2xl bg-white" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <LuMegaphone className="text-4xl text-slate-300" />
          <p className="mt-3 font-semibold text-slate-700">{t("deptDash.notices.empty")}</p>
          <p className="mt-1 text-sm text-slate-500">{t("deptDash.notices.emptyText")}</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((notice, index) => {
            const date = new Date(notice.createdAt);
            const place = municipalityLabel(notice.municipality, isEn);
            return (
              <li
                key={notice._id}
                style={{ "--delay": `${Math.min(index, 8) * 40}ms` }}
                className={`animate-fade-up flex gap-4 rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md ${
                  notice.status === "active" ? "border-slate-200" : "border-slate-200 opacity-70"
                }`}
              >
                {/* Miti box */}
                <div className="hidden w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-[#003893]/5 py-2 text-[#003893] sm:flex">
                  <span className="text-2xl font-bold leading-none">{formatBS(date, isEn, "DD")}</span>
                  <span className="mt-1 text-xs font-medium">{formatBS(date, isEn, "MMMM")}</span>
                </div>

                <button type="button" onClick={() => setModal({ mode: "view", notice })} className="min-w-0 flex-1 text-left">
                  <span className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-700">{t(`noticeTabs.${notice.category || "notice"}`)}</span>
                    <span className={`rounded px-2 py-0.5 ${PRIORITY_STYLE[notice.priority]?.badge}`}>{t(`userDash.priority.${notice.priority}`)}</span>
                    {notice.status !== "active" && <span className="rounded bg-slate-200 px-2 py-0.5 text-slate-600">{t("deptDash.notices.archived")}</span>}
                    {notice.attachment?.[0]?.url && <LuPaperclip className="text-slate-400" />}
                  </span>
                  <span className="mt-1.5 block font-semibold text-slate-900 hover:text-[#003893]">{notice.title}</span>
                  <span className="mt-0.5 block truncate text-xs text-slate-500">
                    {[place, notice.ward && t("noticesPage.ward", { ward: /^\d+$/.test(notice.ward) ? num(notice.ward) : notice.ward }), formatBS(date, isEn)].filter(Boolean).join(" · ")}
                  </span>
                </button>

                <div className="flex shrink-0 items-start gap-1">
                  {[
                    { icon: LuEye, label: t("deptDash.notices.view"), onClick: () => setModal({ mode: "view", notice }), tone: "hover:bg-[#003893]/10 hover:text-[#003893]" },
                    { icon: LuPencil, label: t("deptDash.notices.edit"), onClick: () => setModal({ mode: "form", notice }), tone: "hover:bg-green-50 hover:text-green-700" },
                    { icon: LuTrash2, label: t("deptDash.notices.delete"), onClick: () => handleDelete(notice), tone: "hover:bg-red-50 hover:text-[#dc143c]" },
                  ].map(({ icon: Icon, label, onClick, tone }) => (
                    <button key={label} type="button" onClick={onClick} title={label} aria-label={label} className={`rounded-lg p-2 text-slate-500 transition ${tone}`}>
                      <Icon size={17} />
                    </button>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {modal?.mode === "form" && <NoticeForm key={modal.notice?._id || "new"} notice={modal.notice} onClose={closeModal} />}
      {modal?.mode === "view" && <NoticeView notice={modal.notice} onClose={closeModal} />}
    </div>
  );
};

export default DepartmentNoticePage;
