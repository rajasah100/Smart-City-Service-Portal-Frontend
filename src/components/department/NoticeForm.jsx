import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { LuFileUp, LuPaperclip, LuX } from "react-icons/lu";
import { createNotice, updateNotice } from "../../redux/slices/noticeSlice";
import { nepalLocations } from "../../data/nepalLocation";

const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#003893] focus:ring-2 focus:ring-[#003893]/20";

const Field = ({ label, required, children, className = "" }) => (
    <label className={`block ${className}`}>
        <span className="mb-1.5 block text-sm font-semibold text-slate-700">
            {label} {required && <span className="text-[#dc143c]">*</span>}
        </span>
        {children}
    </label>
);

// Department ko sewa kshetra bhitra ko jilla ra sthaniya taha matra
const areaOptions = (area = {}) => {
    const provinces = area.province ? nepalLocations.filter((p) => p.province === area.province) : nepalLocations;
    const districts = provinces.flatMap((p) => p.districts).filter((d) => !area.district || d.name === area.district);

    return districts.map((district) => ({
        ...district,
        municipalities: area.municipalities?.length
            ? district.municipalities.filter((m) => area.municipalities.includes(m.name))
            : district.municipalities,
    }));
};

// Sthaniya taha ko naam bata jilla
const districtOf = (districts, municipality) => districts.find((d) => d.municipalities.some((m) => m.name === municipality))?.name || "";

// Parent le khulda matra mount garchha, tyasaile state sidhai props bata
const NoticeForm = ({ notice, onClose }) => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage === "en";
    const { loading } = useSelector((state) => state.notice);
    const { department } = useSelector((state) => state.department);

    const districts = areaOptions(department?.serviceArea);
    const firstDistrict = districts.length === 1 ? districts[0] : null;

    const [formData, setFormData] = useState(() => ({
        title: notice?.title || "",
        description: notice?.description || "",
        municipality: notice?.municipality || (firstDistrict?.municipalities.length === 1 ? firstDistrict.municipalities[0].name : ""),
        ward: notice?.ward || "",
        priority: notice?.priority || "medium",
        category: notice?.category || "notice",
        status: notice?.status || "active",
    }));
    const [district, setDistrict] = useState(() => districtOf(districts, notice?.municipality) || firstDistrict?.name || "");
    const [file, setFile] = useState(null);

    // Esc le band
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    const selectedDistrict = districts.find((d) => d.name === district);
    const municipality = selectedDistrict?.municipalities.find((m) => m.name === formData.municipality);
    const label = (item) => (isEn ? item.name : item.nameNe);

    const set = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => data.append(key, value));
        if (file) data.append("attachment", file);

        try {
            if (notice) {
                await dispatch(updateNotice({ id: notice._id, formData: data })).unwrap();
                toast.success(t("deptDash.notices.updated"));
            } else {
                await dispatch(createNotice(data)).unwrap();
                toast.success(t("deptDash.notices.created"));
            }
            onClose();
        } catch (error) {
            toast.error(error?.message || t("deptDash.notices.failed"));
        }
    };

    const f = (key) => t(`deptDash.notices.form.${key}`);

    // Body ma render: layout ko animation (transform) le fixed modal lai main bhitra nathunos
    return createPortal(
        <div className="fixed inset-0 z-60 flex items-end justify-center bg-slate-900/60 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
            <div
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
                className="animate-fade-up flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
            >
                <header className="relative flex shrink-0 items-center justify-between bg-linear-to-r from-[#002a6e] to-[#003893] px-6 py-4 text-white">
                    <div className="absolute inset-x-0 top-0 h-1 bg-[#dc143c]" />
                    <h2 className="text-lg font-bold">{notice ? t("deptDash.notices.editTitle") : t("deptDash.notices.createTitle")}</h2>
                    <button type="button" onClick={onClose} aria-label={f("cancel")} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
                        <LuX size={18} />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
                    <div className="flex-1 space-y-4 overflow-y-auto p-6">
                        <Field label={f("title")} required>
                            <input value={formData.title} onChange={(e) => set("title", e.target.value)} required maxLength={200} placeholder={f("titlePlaceholder")} className={inputClass} />
                        </Field>

                        <Field label={f("description")} required>
                            <textarea
                                rows={6}
                                value={formData.description}
                                onChange={(e) => set("description", e.target.value)}
                                required
                                placeholder={f("descriptionPlaceholder")}
                                className={`${inputClass} resize-y leading-6`}
                            />
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <Field label={f("district")} required>
                                <select
                                    value={district}
                                    onChange={(e) => {
                                        setDistrict(e.target.value);
                                        set("municipality", "");
                                        set("ward", "");
                                    }}
                                    required
                                    disabled={districts.length === 1}
                                    className={`${inputClass} disabled:bg-slate-50`}
                                >
                                    <option value="">{f("select")}</option>
                                    {districts.map((item) => (
                                        <option key={item.name} value={item.name}>{label(item)}</option>
                                    ))}
                                </select>
                            </Field>

                            <Field label={f("municipality")} required>
                                <select
                                    value={formData.municipality}
                                    onChange={(e) => {
                                        set("municipality", e.target.value);
                                        set("ward", "");
                                    }}
                                    required
                                    disabled={!selectedDistrict}
                                    className={`${inputClass} disabled:bg-slate-50`}
                                >
                                    <option value="">{f("select")}</option>
                                    {selectedDistrict?.municipalities.map((item) => (
                                        <option key={item.name} value={item.name}>{label(item)}</option>
                                    ))}
                                </select>
                            </Field>

                            <Field label={f("ward")}>
                                <select value={formData.ward} onChange={(e) => set("ward", e.target.value)} disabled={!municipality} className={`${inputClass} disabled:bg-slate-50`}>
                                    <option value="">{f("allWards")}</option>
                                    {municipality?.wards.map((ward) => (
                                        <option key={ward} value={ward}>{Number(ward).toLocaleString(isEn ? "en-US" : "ne-NP")}</option>
                                    ))}
                                </select>
                            </Field>
                        </div>

                        <div className={`grid gap-4 ${notice ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
                            <Field label={f("type")}>
                                <select value={formData.category} onChange={(e) => set("category", e.target.value)} className={inputClass}>
                                    {["notice", "tender", "news", "press"].map((value) => (
                                        <option key={value} value={value}>{t(`noticeTabs.${value}`)}</option>
                                    ))}
                                </select>
                            </Field>

                            <Field label={f("priority")}>
                                <select value={formData.priority} onChange={(e) => set("priority", e.target.value)} className={inputClass}>
                                    {["high", "medium", "low"].map((value) => (
                                        <option key={value} value={value}>{t(`userDash.priority.${value}`)}</option>
                                    ))}
                                </select>
                            </Field>

                            {notice && (
                                <Field label={f("status")}>
                                    <select value={formData.status} onChange={(e) => set("status", e.target.value)} className={inputClass}>
                                        <option value="active">{t("deptDash.notices.active")}</option>
                                        <option value="archived">{t("deptDash.notices.archived")}</option>
                                    </select>
                                </Field>
                            )}
                        </div>

                        {/* Sanlagna */}
                        <div>
                            <p className="mb-1.5 text-sm font-semibold text-slate-700">{f("attachment")}</p>
                            <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-4 transition hover:border-[#003893]/50">
                                <LuFileUp className="shrink-0 text-2xl text-[#003893]" />
                                <span className="min-w-0 flex-1 text-sm">
                                    <span className="block truncate font-medium text-slate-800">{file?.name || f("attachmentHint")}</span>
                                    {notice?.attachment?.[0]?.url && <span className="block text-xs text-slate-500">{f("replaceHint")}</span>}
                                </span>
                                <input type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" onChange={(e) => setFile(e.target.files[0] || null)} className="sr-only" />
                            </label>
                            {notice?.attachment?.[0]?.url && !file && (
                                <a href={notice.attachment[0].url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[#003893] hover:underline">
                                    <LuPaperclip />
                                    {t("deptDash.notices.openAttachment")}
                                </a>
                            )}
                        </div>
                    </div>

                    <footer className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
                        <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                            {f("cancel")}
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center gap-2 rounded-xl bg-[#003893] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#002a6e] disabled:opacity-60"
                        >
                            {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                            {loading ? f("saving") : notice ? f("save") : f("create")}
                        </button>
                    </footer>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default NoticeForm;
