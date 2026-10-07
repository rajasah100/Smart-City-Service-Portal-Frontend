import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { QRCodeSVG } from "qrcode.react";
import { FaCheck, FaHome, FaPrint, FaRedo, FaSearch } from "react-icons/fa";
import useSiteSettings from "../../hooks/useSiteSettings";
import { formatBS } from "../../utils/nepaliDate";
import { localizePlace } from "../../data/nepalLocation";
import defaultLogo from "../../assets/logo-small.png";

const Row = ({ label, children }) => (
    <tr className="border-b border-slate-200 last:border-b-0">
        <th scope="row" className="w-36 py-2.5 pr-4 text-left align-top text-sm font-medium text-slate-500 sm:w-44">{label}</th>
        <td className="py-2.5 text-sm font-semibold text-slate-900">{children || "-"}</td>
    </tr>
);

// Gunaso pathaepachhi: sarkari dhaanchako "गुनासो दर्ता निस्सा" (print garna milne)
const SuccessPage = ({ data, onNewComplaint }) => {
    const { t, i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage === "en";
    const settings = useSiteSettings();
    const num = (n) => Number(n).toLocaleString(isEn ? "en-US" : "ne-NP");

    if (!data) return null;

    const trackUrl = `${window.location.origin}/user/complaints/${encodeURIComponent(data.complaintId)}`;
    const createdAt = data.createdAt || new Date();
    const time = new Date(createdAt).toLocaleTimeString(isEn ? "en-US" : "ne-NP", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
    const location = data.location || {};
    const names = localizePlace(location, isEn);
    const place = [location.tole, names.municipality && `${names.municipality}-${num(location.ward)}`, names.district]
        .filter(Boolean)
        .join(", ");

    return (
        <div className="min-h-screen bg-slate-100 px-4 pb-16 pt-28 print:min-h-0 print:bg-white print:p-0">
            <div className="mx-auto max-w-3xl">
                {/* Safal sandesh */}
                <div className="animate-fade-up text-center print:hidden">
                    <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-2xl text-white shadow-lg ring-8 ring-green-600/15">
                        <FaCheck />
                    </span>
                    <h1 className="mt-4 text-2xl font-bold text-slate-900">{t("complaintForm.success.title")}</h1>
                    <p className="mt-1 text-slate-500">{t("complaintForm.success.text")}</p>
                </div>

                {/* ===== Nissa ===== */}
                <article
                    style={{ "--delay": "120ms" }}
                    className="animate-fade-up mt-8 overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-lg print:mt-0 print:rounded-none print:border-2 print:border-slate-800 print:shadow-none"
                >
                    <div className="h-1.5 bg-[#dc143c]" />

                    {/* Letterhead */}
                    <header className="flex items-center gap-4 border-b-2 border-[#003893] px-6 py-5 sm:px-8">
                        <img src={settings.logo?.url || defaultLogo} alt="" className="h-16 w-16 shrink-0 object-contain" />
                        <div className="flex-1 text-center">
                            <p className="text-xs font-medium text-slate-500">{isEn ? settings.officeEn : settings.officeNe}</p>
                            <p className="text-xl font-bold text-[#003893] sm:text-2xl">{isEn ? settings.nameEn : settings.nameNe}</p>
                            <p className="text-xs text-slate-500">{isEn ? settings.addressEn : settings.addressNe}</p>
                        </div>
                        {/* Logo jatti nai thau, title bichma rahos */}
                        <span className="hidden h-16 w-16 shrink-0 sm:block" />
                    </header>

                    <div className="px-6 py-6 sm:px-8">
                        <h2 className="text-center">
                            <span className="inline-block border-b-2 border-[#dc143c] px-4 pb-1 text-lg font-bold text-slate-900">
                                {t("complaintForm.success.receipt")}
                            </span>
                        </h2>

                        <div className="mt-6 flex flex-col gap-6 sm:flex-row">
                            <div className="flex-1">
                                <div className="mb-4 rounded-xl border-2 border-dashed border-[#003893]/40 bg-[#003893]/5 px-4 py-3">
                                    <p className="text-xs font-medium text-slate-500">{t("complaintForm.success.number")}</p>
                                    <p className="font-mono text-2xl font-bold tracking-wider text-[#003893]">{data.complaintId}</p>
                                </div>

                                <table className="w-full">
                                    <tbody>
                                        <Row label={t("complaintForm.success.date")}>
                                            {formatBS(createdAt, isEn)}, {time}
                                        </Row>
                                        <Row label={t("complaintForm.success.applicant")}>{data.user?.name}</Row>
                                        <Row label={t("complaintForm.success.phone")}>{data.phone || data.user?.phone}</Row>
                                        <Row label={t("complaintForm.success.department")}>{data.department?.name}</Row>
                                        <Row label={t("complaintForm.success.subject")}>{data.title}</Row>
                                        <Row label={t("complaintForm.review.urgency")}>
                                            {t(`complaintForm.details.urgency.${data.priority}.title`, { defaultValue: data.priority })}
                                        </Row>
                                        <Row label={t("complaintForm.success.place")}>{place}</Row>
                                        <Row label={t("complaintForm.success.status")}>
                                            <span className="text-amber-700">{t("complaintForm.success.statusPending")}</span>
                                        </Row>
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex shrink-0 flex-col items-center sm:pt-1">
                                <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                                    <QRCodeSVG value={trackUrl} size={120} fgColor="#003893" level="M" />
                                </div>
                                <p className="mt-2 max-w-32 text-center text-xs text-slate-500">{t("complaintForm.success.scan")}</p>
                            </div>
                        </div>

                        <p className="mt-6 border-t border-slate-200 pt-4 text-center text-xs text-slate-500">
                            {t("complaintForm.success.printedNote")} {t("complaintForm.success.keep")}
                            {(settings.phone || settings.email) && (
                                <span className="mt-1 block">{[settings.phone, settings.email].filter(Boolean).join(" | ")}</span>
                            )}
                        </p>
                    </div>

                    <div className="h-1.5 bg-[#003893]" />
                </article>

                {/* Aba ke hunchha */}
                <section style={{ "--delay": "240ms" }} className="animate-fade-up mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:hidden">
                    <h3 className="font-bold text-slate-900">{t("complaintForm.success.next")}</h3>
                    <ol className="mt-4 space-y-3">
                        {(t("complaintForm.success.steps", { returnObjects: true }) || []).map((text, index) => (
                            <li key={text} className="flex items-start gap-3 text-sm text-slate-600">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#003893] text-xs font-bold text-white">
                                    {num(index + 1)}
                                </span>
                                <span className="pt-0.5">{text}</span>
                            </li>
                        ))}
                    </ol>
                </section>

                <div style={{ "--delay": "320ms" }} className="animate-fade-up mt-6 flex flex-wrap justify-center gap-3 print:hidden">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="flex items-center gap-2 rounded-xl bg-[#003893] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#002a6e]"
                    >
                        <FaPrint />
                        {t("complaintForm.success.print")}
                    </button>
                    <Link
                        to={`/user/complaints/${encodeURIComponent(data.complaintId)}`}
                        className="flex items-center gap-2 rounded-xl border border-[#003893] bg-white px-5 py-3 text-sm font-semibold text-[#003893] transition hover:bg-[#003893]/5"
                    >
                        <FaSearch />
                        {t("complaintForm.success.track")}
                    </Link>
                    <button
                        type="button"
                        onClick={onNewComplaint}
                        className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        <FaRedo />
                        {t("complaintForm.success.newComplaint")}
                    </button>
                    <Link to="/" className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-white">
                        <FaHome />
                        {t("complaintForm.success.home")}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
