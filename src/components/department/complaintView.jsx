import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import {
    LuCheck,
    LuNavigation,
    LuFileText,
    LuImage,
    LuMail,
    LuMapPin,
    LuPhone,
    LuSave,
    LuUser,
    LuX,
} from "react-icons/lu";
import { updateComplaintStatus } from "../../redux/slices/complaintSlice";
import { formatBS } from "../../utils/nepaliDate";
import { PRIORITY_STYLE, STATUSES, STATUS_STYLE, placeLine } from "./deptUtils";

const Section = ({ icon: Icon, title, children }) => (
    <section className="rounded-2xl border border-slate-200 bg-white">
        <h3 className="flex items-center gap-2 border-b border-slate-100 px-5 py-3 text-sm font-bold text-slate-800">
            <Icon className="text-[#003893]" />
            {title}
        </h3>
        <div className="p-5">{children}</div>
    </section>
);

// Gunaso ko pura vivaran ra avastha badalne (department)
const ComplaintView = ({ complaint, onClose }) => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage === "en";
    const num = (n) => Number(n).toLocaleString(isEn ? "en-US" : "ne-NP");
    const { updateLoading } = useSelector((state) => state.complaint);

    const [status, setStatus] = useState(complaint.status || "pending");
    const [note, setNote] = useState(complaint.resolutionNote || "");
    const needsNote = status === "resolved" || status === "rejected";

    // Esc le band
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    const lat = Number(complaint.location?.latitude);
    const lng = Number(complaint.location?.longitude);
    const hasMap = Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0);
    const dateTime = (value) =>
        `${formatBS(value, isEn)}, ${new Date(value).toLocaleTimeString(isEn ? "en-US" : "ne-NP", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" })}`;

    const handleSave = async () => {
        if (status === complaint.status && (!needsNote || note.trim() === (complaint.resolutionNote || ""))) {
            toast.info(t("deptDash.view.unchanged"));
            return;
        }

        if (needsNote && !note.trim()) {
            toast.error(t("deptDash.view.noteRequired"));
            return;
        }

        try {
            await dispatch(updateComplaintStatus({ id: complaint._id, status, resolutionNote: needsNote ? note : "" })).unwrap();
            toast.success(t("deptDash.view.saved"));
            onClose();
        } catch (error) {
            toast.error(error?.message || t("deptDash.view.failed"));
        }
    };

    const timeline = [
        { label: t("deptDash.view.submitted"), date: complaint.createdAt, dot: "bg-[#003893]" },
        complaint.updatedAt && complaint.updatedAt !== complaint.createdAt && { label: t("deptDash.view.updated"), date: complaint.updatedAt, dot: "bg-slate-400" },
        complaint.resolvedAt && { label: t("deptDash.view.resolvedAt"), date: complaint.resolvedAt, dot: "bg-green-600" },
    ].filter(Boolean);

    // Body ma render: layout ko animation (transform) le fixed modal lai main bhitra nathunos
    return createPortal(
        <div className="fixed inset-0 z-60 flex items-end justify-center bg-slate-900/60 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
            <div
                role="dialog"
                aria-modal="true"
                aria-label={t("deptDash.view.title")}
                onClick={(e) => e.stopPropagation()}
                className="animate-fade-up flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl bg-slate-50 shadow-2xl sm:rounded-2xl"
            >
                {/* Header */}
                <header className="relative shrink-0 bg-linear-to-r from-[#002a6e] to-[#003893] px-5 py-5 text-white sm:px-7">
                    <div className="absolute inset-x-0 top-0 h-1 bg-[#dc143c]" />
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={t("deptDash.view.close")}
                        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
                    >
                        <LuX size={18} />
                    </button>

                    <p className="font-mono text-sm text-white/70">{complaint.complaintId}</p>
                    <h2 className="mt-1 pr-10 text-xl font-bold sm:text-2xl">{complaint.title}</h2>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                        <span className={`rounded-full px-3 py-1 ring-1 ${STATUS_STYLE[complaint.status]?.badge}`}>{t(`userDash.status.${complaint.status}`)}</span>
                        <span className={`rounded-full px-3 py-1 ${PRIORITY_STYLE[complaint.priority]?.badge}`}>{t(`userDash.priority.${complaint.priority}`)}</span>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-white/90">{formatBS(complaint.createdAt, isEn)}</span>
                    </div>
                </header>

                {/* Body */}
                <div className="grid flex-1 gap-5 overflow-y-auto p-4 sm:p-6 lg:grid-cols-5">
                    <div className="space-y-5 lg:col-span-3">
                        <Section icon={LuFileText} title={t("deptDash.view.complaint")}>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("deptDash.view.description")}</p>
                            <p className="mt-1 whitespace-pre-line text-sm leading-7 text-slate-700">{complaint.description}</p>
                        </Section>

                        {complaint.images?.length > 0 && (
                            <Section icon={LuImage} title={t("deptDash.view.photos", { count: num(complaint.images.length) })}>
                                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                                    {complaint.images.map((image, index) => (
                                        <a key={image.url || index} href={image.url} target="_blank" rel="noreferrer" className="group block overflow-hidden rounded-xl border border-slate-200">
                                            <img src={image.url} alt="" className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105" />
                                        </a>
                                    ))}
                                </div>
                            </Section>
                        )}

                        <Section icon={LuMapPin} title={t("deptDash.view.place")}>
                            <p className="text-sm font-medium text-slate-800">{placeLine(complaint.location, isEn, num) || "-"}</p>

                            {hasMap ? (
                                <>
                                    <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                                        <MapContainer center={[lat, lng]} zoom={16} scrollWheelZoom={false} className="z-0 h-64 w-full">
                                            <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                            <Marker position={[lat, lng]} />
                                        </MapContainer>
                                    </div>
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-3 inline-flex items-center gap-2 rounded-xl border border-[#003893] px-4 py-2 text-sm font-semibold text-[#003893] transition hover:bg-[#003893] hover:text-white"
                                    >
                                        <LuNavigation />
                                        {t("deptDash.view.directions")}
                                    </a>
                                </>
                            ) : (
                                <p className="mt-2 text-sm text-slate-500">{t("deptDash.view.noLocation")}</p>
                            )}
                        </Section>
                    </div>

                    <div className="space-y-5 lg:col-span-2">
                        {/* Nagarik */}
                        <Section icon={LuUser} title={t("deptDash.view.citizen")}>
                            <div className="flex items-center gap-3">
                                <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#003893] text-lg font-bold text-white">
                                    {complaint.user?.avatar ? (
                                        <img src={complaint.user.avatar} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        complaint.user?.name?.charAt(0).toUpperCase() || "?"
                                    )}
                                </span>
                                <p className="font-semibold text-slate-900">{complaint.user?.name || t("deptDash.complaints.unknownUser")}</p>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {(complaint.phone || complaint.user?.phone) && (
                                    <a
                                        href={`tel:${complaint.phone || complaint.user.phone}`}
                                        className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                                    >
                                        <LuPhone />
                                        {complaint.phone || complaint.user.phone}
                                    </a>
                                )}
                                {complaint.user?.email && (
                                    <a
                                        href={`mailto:${complaint.user.email}`}
                                        className="inline-flex max-w-full items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                                    >
                                        <LuMail className="shrink-0" />
                                        <span className="truncate">{complaint.user.email}</span>
                                    </a>
                                )}
                            </div>
                        </Section>

                        {/* Avastha */}
                        <Section icon={LuCheck} title={t("deptDash.view.updateTitle")}>
                            <p className="-mt-1 mb-3 text-xs text-slate-500">{t("deptDash.view.updateText")}</p>

                            <div role="radiogroup" className="space-y-2">
                                {STATUSES.map((value) => {
                                    const active = status === value;
                                    return (
                                        <button
                                            key={value}
                                            type="button"
                                            role="radio"
                                            aria-checked={active}
                                            onClick={() => setStatus(value)}
                                            className={`flex w-full items-center gap-3 rounded-xl border-2 px-3.5 py-2.5 text-left text-sm font-medium transition ${
                                                active ? "border-[#003893] bg-[#003893]/5 text-slate-900" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                            }`}
                                        >
                                            <span className={`h-2.5 w-2.5 rounded-full ${STATUS_STYLE[value].dot}`} />
                                            <span className="flex-1">{t(`userDash.status.${value}`)}</span>
                                            {active && <LuCheck className="text-[#003893]" />}
                                        </button>
                                    );
                                })}
                            </div>

                            {needsNote && (
                                <div className="animate-fade-up mt-4">
                                    <label htmlFor="resolution-note" className="mb-1.5 block text-sm font-semibold text-slate-700">
                                        {t("deptDash.view.noteLabel")} <span className="text-[#dc143c]">*</span>
                                    </label>
                                    <textarea
                                        id="resolution-note"
                                        rows={4}
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder={t("deptDash.view.notePlaceholder")}
                                        className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none transition focus:border-[#003893] focus:ring-2 focus:ring-[#003893]/20"
                                    />
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={updateLoading}
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#003893] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#002a6e] disabled:opacity-60"
                            >
                                {updateLoading ? (
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : (
                                    <LuSave />
                                )}
                                {updateLoading ? t("deptDash.view.saving") : t("deptDash.view.save")}
                            </button>
                        </Section>

                        {/* Samayarekha */}
                        <Section icon={LuFileText} title={t("deptDash.view.timeline")}>
                            <ol className="relative space-y-4 border-l-2 border-slate-200 pl-5">
                                {timeline.map((item) => (
                                    <li key={item.label} className="relative">
                                        <span className={`absolute -left-6.5 top-1 h-3 w-3 rounded-full ring-4 ring-white ${item.dot}`} />
                                        <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                                        <p className="text-xs text-slate-500">{dateTime(item.date)}</p>
                                    </li>
                                ))}
                            </ol>

                            {complaint.resolutionNote && (
                                <div className="mt-4 rounded-xl bg-slate-50 p-3">
                                    <p className="text-xs font-semibold text-slate-500">{t("deptDash.view.note")}</p>
                                    <p className="mt-1 whitespace-pre-line text-sm text-slate-700">{complaint.resolutionNote}</p>
                                </div>
                            )}
                        </Section>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ComplaintView;
