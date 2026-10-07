import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    FaArrowRight,
    FaBolt,
    FaBus,
    FaExclamationTriangle,
    FaMapMarkerAlt,
    FaRoad,
    FaTint,
    FaTrashAlt,
} from "react-icons/fa";
import { getNotices } from "../../../redux/slices/noticeSlice";
import SectionHeading from "./SectionHeading";
import { departmentKind } from "../../complaint/departmentKind";
import { formatBS } from "../../../utils/nepaliDate";

// Department anusar icon (naam napaye chetawani chinha)
const KIND_ICONS = { water: FaTint, electricity: FaBolt, road: FaRoad, waste: FaTrashAlt, transport: FaBus, other: FaExclamationTriangle };

const EmergencyAlerts = () => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage === "en";
    const num = (n) => (/^\d+$/.test(String(n)) ? Number(n).toLocaleString(isEn ? "en-US" : "ne-NP") : n);

    const { notices = [], loading } = useSelector((state) => state.notice);

    // High priority notice lai emergency alert manne
    useEffect(() => {
        dispatch(getNotices({ priority: "high" }));
    }, [dispatch]);

    const alerts = Array.isArray(notices)
        ? notices.filter((notice) => notice.priority === "high").slice(0, 6)
        : [];

    return (
        <section id="emergency-alerts" className="bg-slate-50 py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">

                <SectionHeading
                    label={t("emergency.alerts.label")}
                    title={t("emergency.alerts.title")}
                    description={t("emergency.alerts.description")}
                />

                {loading ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        {[1, 2].map((item) => (
                            <div
                                key={item}
                                className="h-36 animate-pulse rounded-2xl bg-white"
                            />
                        ))}
                    </div>
                ) : alerts.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center">
                        <p className="font-semibold text-slate-700">
                            {t("emergency.alerts.emptyTitle")}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            {t("emergency.alerts.emptyText")}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {alerts.map((notice) => (
                            <Link
                                key={notice._id}
                                to={`/notices/${notice._id}`}
                                className="group rounded-2xl border-l-4 border-red-600 bg-white p-6 shadow-sm transition hover:shadow-lg"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-xl text-red-600">
                                        {(() => {
                                            const Icon = KIND_ICONS[departmentKind(notice.department?.name)];
                                            return <Icon />;
                                        })()}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <h3 className="font-semibold text-slate-900">
                                                {notice.title}
                                            </h3>

                                            {notice.department?.name && (
                                                <span className="rounded-full bg-[#003893]/10 px-3 py-1 text-xs font-medium text-[#003893]">
                                                    {notice.department.name}
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                                            {notice.description}
                                        </p>

                                        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                                            <span className="flex items-center gap-1">
                                                {notice.ward && (
                                                    <>
                                                        <FaMapMarkerAlt />
                                                        {t("emergency.alerts.ward", { ward: num(notice.ward) })} ·
                                                    </>
                                                )}
                                                {formatBS(notice.createdAt, isEn)}
                                            </span>

                                            <span className="flex items-center gap-1 font-semibold text-[#003893]">
                                                {t("emergency.alerts.readMore")}
                                                <FaArrowRight className="transition group-hover:translate-x-1" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

            </div>
        </section>
    );
};

export default EmergencyAlerts;
