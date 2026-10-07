import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import {
    LuArrowLeft,
    LuBuilding2,
    LuCheck,
    LuCircleAlert,
    LuClipboardCheck,
    LuExternalLink,
    LuFlag,
    LuImage,
    LuLoader,
    LuMapPin,
    LuSend,
    LuX,
} from "react-icons/lu";

import apiRequest from "../../utils/apiRequest";
import { formatBS } from "../../utils/nepaliDate";
import { PRIORITY_STYLES, statusStyle } from "../../components/user/complaintStyles";

const STEPS = [
    { key: "pending", icon: LuSend },
    { key: "assigned", icon: LuBuilding2 },
    { key: "in-progress", icon: LuLoader },
    { key: "resolved", icon: LuClipboardCheck },
];

const Card = ({ title, children, className = "" }) => (
    <div className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
        {title && (
            <h2 className="flex items-center gap-3 border-b border-slate-100 px-6 py-4 font-bold text-slate-900">
                <span className="h-5 w-1 rounded-full bg-[#dc143c]" />
                {title}
            </h2>
        )}
        {children}
    </div>
);

const ComplaintDetailPage = () => {
    const { complaintId } = useParams();
    const { t, i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage === "en";

    // Kun ID ko data ho tyo pani rakhne (purano gunaso nadekhiyos)
    const [result, setResult] = useState({ id: null, complaint: null, status: "loading" });

    useEffect(() => {
        let ignore = false;

        apiRequest
            .get(`/complaints/track/${encodeURIComponent(complaintId)}`)
            .then(({ data }) => {
                if (!ignore) setResult({ id: complaintId, complaint: data.complaint, status: "ok" });
            })
            .catch((error) => {
                if (!ignore) setResult({ id: complaintId, complaint: null, status: error.response?.status === 404 ? "notFound" : "failed" });
            });

        return () => {
            ignore = true;
        };
    }, [complaintId]);

    const complaint = result.id === complaintId ? result.complaint : null;
    const status = result.id === complaintId ? result.status : "loading";

    if (status === "loading") {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-36 rounded-2xl bg-white" />
                <div className="h-48 rounded-2xl bg-white" />
                <div className="h-64 rounded-2xl bg-white" />
            </div>
        );
    }

    if (!complaint) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                <LuCircleAlert className="mx-auto text-5xl text-[#dc143c]" />
                <p className="mt-3 font-semibold text-slate-800">
                    {status === "notFound" ? t("userPages.detail.notFound") : t("userPages.detail.failed")}
                </p>
                <Link to="/user/complaints" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#003893] px-5 py-2.5 text-sm font-semibold text-white">
                    <LuArrowLeft />
                    {t("userPages.detail.back")}
                </Link>
            </div>
        );
    }

    const style = statusStyle(complaint.status);
    const rejected = complaint.status === "rejected";
    const currentIndex = STEPS.findIndex((step) => step.key === complaint.status);
    const loc = complaint.location || {};
    const lat = Number(loc.latitude);
    const lng = Number(loc.longitude);
    const hasMap = Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0);

    return (
        <div className="space-y-6">
            <Link to="/user/complaints" className="inline-flex items-center gap-2 text-sm font-semibold text-[#003893] hover:underline">
                <LuArrowLeft />
                {t("userPages.detail.back")}
            </Link>

            {/* Header */}
            <div className={`animate-fade-up rounded-2xl border border-slate-200 border-l-4 bg-white p-6 shadow-sm ${style.border}`}>
                <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-[#003893]/10 px-3 py-1 font-mono text-sm font-bold text-[#003893]">{complaint.complaintId}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${style.badge}`}>
                        {t(`userDash.status.${complaint.status}`, { defaultValue: complaint.status })}
                    </span>
                </div>

                <h1 className="mt-3 text-2xl font-bold text-slate-900">{complaint.title}</h1>

                <p className="mt-1 text-sm text-slate-500">
                    {t("userPages.detail.filedOn")}: {formatBS(complaint.createdAt, isEn, "YYYY MMMM DD, ddd")}
                </p>
            </div>

            {/* Timeline */}
            <Card title={t("userPages.detail.timeline")} className="animate-fade-up">
                <div className="p-6">
                    {rejected ? (
                        <div className="flex items-start gap-4 rounded-xl bg-red-50 p-4">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dc143c] text-white">
                                <LuX />
                            </span>
                            <div>
                                <p className="font-semibold text-[#dc143c]">{t("userPages.detail.rejectedTitle")}</p>
                                <p className="text-sm text-slate-600">{t("userPages.detail.rejectedText")}</p>
                            </div>
                        </div>
                    ) : (
                        <ol className="relative grid gap-6 md:grid-cols-4 md:gap-4">
                            {STEPS.map(({ key, icon: Icon }, index) => {
                                const done = index < currentIndex || complaint.status === "resolved";
                                const active = index === currentIndex && complaint.status !== "resolved";

                                return (
                                    <li key={key} className="relative flex gap-4 md:flex-col md:items-center md:text-center">
                                        {/* Jodne rekha */}
                                        {index < STEPS.length - 1 && (
                                            <span
                                                aria-hidden="true"
                                                className={`absolute left-5 top-11 h-[calc(100%-1rem)] w-0.5 md:left-[calc(50%+1.5rem)] md:top-5 md:h-0.5 md:w-[calc(100%-3rem)] ${
                                                    index < currentIndex || complaint.status === "resolved" ? "bg-green-500" : "bg-slate-200"
                                                }`}
                                            />
                                        )}

                                        <span
                                            className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                                done
                                                    ? "bg-green-600 text-white"
                                                    : active
                                                      ? "bg-[#003893] text-white ring-4 ring-[#003893]/20"
                                                      : "bg-slate-100 text-slate-400"
                                            }`}
                                        >
                                            {done ? <LuCheck /> : <Icon className={active && key === "in-progress" ? "animate-spin" : ""} />}
                                        </span>

                                        <div>
                                            <p className={`font-semibold ${done || active ? "text-slate-900" : "text-slate-400"}`}>
                                                {t(`userPages.detail.steps.${key}.title`)}
                                            </p>
                                            <p className="mt-0.5 text-xs text-slate-500">{t(`userPages.detail.steps.${key}.text`)}</p>
                                            {(done || active) && (
                                                <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${done ? "bg-green-50 text-green-700" : "bg-[#003893]/10 text-[#003893]"}`}>
                                                    {done ? t("userPages.detail.done") : t("userPages.detail.current")}
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>
                    )}

                    {complaint.resolutionNote && (
                        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                            <p className="text-sm font-semibold text-amber-800">{t("userPages.detail.note")}</p>
                            <p className="mt-1 whitespace-pre-line text-sm text-slate-700">{complaint.resolutionNote}</p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Info */}
            <Card title={t("userPages.detail.info")} className="animate-fade-up">
                <div className="grid gap-4 p-6 sm:grid-cols-3">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#003893]/10 text-[#003893]"><LuBuilding2 /></span>
                        <div>
                            <p className="text-xs text-slate-500">{t("userPages.detail.department")}</p>
                            <p className="text-sm font-semibold text-slate-900">{complaint.department?.name || "-"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#003893]/10 text-[#003893]"><LuFlag /></span>
                        <div>
                            <p className="text-xs text-slate-500">{t("userPages.detail.priority")}</p>
                            <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${PRIORITY_STYLES[complaint.priority] || PRIORITY_STYLES.low}`}>
                                {complaint.priority ? t(`userDash.priority.${complaint.priority}`) : "-"}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`h-3 w-3 rounded-full ${style.dot}`} />
                        <div>
                            <p className="text-xs text-slate-500">{t("userPages.detail.status")}</p>
                            <p className="text-sm font-semibold text-slate-900">{t(`userDash.status.${complaint.status}`, { defaultValue: complaint.status })}</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-100 p-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("userPages.detail.description")}</p>
                    <p className="mt-2 whitespace-pre-line leading-7 text-slate-700">{complaint.description}</p>
                </div>
            </Card>

            {/* Photos */}
            <Card title={t("userPages.detail.photos")} className="animate-fade-up">
                <div className="p-6">
                    {complaint.images?.length ? (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            {complaint.images.map((img) => (
                                <a key={img._id || img.publicId || img.url} href={img.url} target="_blank" rel="noopener noreferrer" className="group overflow-hidden rounded-xl border border-slate-200">
                                    <img src={img.url} alt="" className="h-40 w-full object-cover transition duration-300 group-hover:scale-105" />
                                </a>
                            ))}
                        </div>
                    ) : (
                        <p className="flex items-center gap-2 text-sm text-slate-500"><LuImage />{t("userPages.detail.noPhotos")}</p>
                    )}
                </div>
            </Card>

            {/* Location */}
            <Card title={t("userPages.detail.location")} className="animate-fade-up">
                <div className="grid gap-4 p-6 sm:grid-cols-3">
                    {[
                        ["province", loc.province],
                        ["district", loc.district],
                        ["municipality", loc.municipality],
                        ["ward", loc.ward],
                        ["tole", loc.tole],
                    ].map(([key, value]) => (
                        <div key={key}>
                            <p className="text-xs text-slate-500">{t(`userPages.detail.${key}`)}</p>
                            <p className="text-sm font-medium text-slate-900">{value || "-"}</p>
                        </div>
                    ))}
                </div>

                {hasMap ? (
                    <div className="border-t border-slate-100 p-6">
                        <MapContainer center={[lat, lng]} zoom={16} scrollWheelZoom={false} className="z-0 h-80 w-full rounded-xl">
                            <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={[lat, lng]} />
                        </MapContainer>

                        <a
                            href={`https://www.google.com/maps?q=${lat},${lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#003893] hover:underline"
                        >
                            <LuMapPin />
                            {t("userPages.detail.openMap")}
                            <LuExternalLink className="text-xs" />
                        </a>
                    </div>
                ) : (
                    <p className="border-t border-slate-100 px-6 py-4 text-sm text-slate-500">{t("userPages.detail.noMap")}</p>
                )}
            </Card>
        </div>
    );
};

export default ComplaintDetailPage;
