import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NepaliDate from "nepali-date-converter";
import {
    FaArrowLeft,
    FaBuilding,
    FaCalendarAlt,
    FaChevronRight,
    FaDownload,
    FaEnvelope,
    FaExclamationCircle,
    FaExternalLinkAlt,
    FaFileImage,
    FaFilePdf,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaUserTie,
} from "react-icons/fa";

import apiRequest from "../../utils/apiRequest";
import { applySeo, noticeJsonLd } from "../../utils/seo";
import useSiteSettings from "../../hooks/useSiteSettings";
import defaultLogo from "../../assets/logo-small.png";

const CATEGORY_STYLES = {
    notice: "bg-[#003893]/10 text-[#003893]",
    tender: "bg-amber-50 text-amber-700",
    news: "bg-green-50 text-green-700",
    press: "bg-purple-50 text-purple-700",
};

const bsDate = (date, isEn, format = "YYYY MMMM DD, ddd") => {
    try {
        return new NepaliDate(new Date(date)).format(format, isEn ? "en" : "np");
    } catch {
        return "";
    }
};

const MetaItem = ({ icon: Icon, label, children }) => (
    <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#003893]/10 text-[#003893]">
            <Icon className="text-sm" />
        </span>
        <div className="min-w-0">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="text-sm font-medium text-slate-800">{children}</p>
        </div>
    </div>
);

const NoticeDetailsPage = () => {
    const { id } = useParams();
    const { t, i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage === "en";
    const settings = useSiteSettings();

    // Kun ID ko data ho tyo pani rakhne, natra arko notice kholda purano dekhincha
    const [result, setResult] = useState({ id: null, notice: null, status: "loading" });
    const [related, setRelated] = useState([]);

    useEffect(() => {
        let ignore = false;

        apiRequest
            .get(`/notices/${id}`)
            .then(({ data }) => {
                if (!ignore) setResult({ id, notice: data, status: "ok" });
            })
            .catch((error) => {
                if (!ignore) {
                    setResult({ id, notice: null, status: error.response?.status === 404 ? "notFound" : "failed" });
                }
            });

        window.scrollTo({ top: 0 });

        return () => {
            ignore = true;
        };
    }, [id]);

    const notice = result.id === id ? result.notice : null;
    const status = result.id === id ? result.status : "loading";
    const category = notice?.category || "notice";

    // Ekai prakar ka aru notice
    useEffect(() => {
        if (!notice) return;

        let ignore = false;

        apiRequest
            .get("/notices", { params: { category, limit: 6 } })
            .then(({ data }) => {
                if (!ignore) setRelated((Array.isArray(data) ? data : []).filter((item) => item._id !== notice._id).slice(0, 5));
            })
            .catch(() => {
                if (!ignore) setRelated([]);
            });

        return () => {
            ignore = true;
        };
    }, [notice, category]);

    // SEO: title, description ra Google ko NewsArticle structured data
    useEffect(() => {
        if (!notice?.title) return;
        applySeo({
            siteName: t("seo.siteName"),
            title: notice.title,
            description: notice.description,
            path: `/notices/${id}`,
            image: notice.attachment?.find?.((a) => a.type === "image")?.url,
            type: "article",
            lang: i18n.resolvedLanguage === "en" ? "en" : "ne",
            jsonLd: noticeJsonLd(notice, t("seo.siteName")),
        });
    }, [notice, id, t, i18n.resolvedLanguage]);

    const pageUrl = typeof window !== "undefined" ? window.location.href : "";

    // ===== Loading =====
    if (status === "loading") {
        return (
            <section className="min-h-screen bg-slate-100 pb-16 pt-28">
                <div className="mx-auto grid max-w-7xl animate-pulse gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
                    <div className="space-y-4 rounded-2xl bg-white p-8 lg:col-span-2">
                        <div className="h-4 w-40 rounded bg-slate-200" />
                        <div className="h-8 w-3/4 rounded bg-slate-200" />
                        <div className="h-4 w-full rounded bg-slate-200" />
                        <div className="h-4 w-5/6 rounded bg-slate-200" />
                        <div className="h-64 w-full rounded-xl bg-slate-200" />
                    </div>
                    <div className="h-64 rounded-2xl bg-white" />
                </div>
            </section>
        );
    }

    // ===== Not found / error =====
    if (!notice) {
        return (
            <section className="flex min-h-screen items-center justify-center bg-slate-100 px-4 pt-28">
                <div className="max-w-md rounded-2xl bg-white p-10 text-center shadow-sm">
                    <FaExclamationCircle className="mx-auto text-5xl text-[#dc143c]" />
                    <h1 className="mt-4 text-2xl font-bold text-slate-900">
                        {status === "notFound" ? t("noticeDetail.notFoundTitle") : t("noticeDetail.failed")}
                    </h1>
                    {status === "notFound" && <p className="mt-2 text-slate-500">{t("noticeDetail.notFoundText")}</p>}
                    <Link
                        to="/notices"
                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#003893] px-5 py-2.5 font-semibold text-white hover:bg-[#002a6e]"
                    >
                        <FaArrowLeft />
                        {t("noticeDetail.back")}
                    </Link>
                </div>
            </section>
        );
    }

    const attachment = notice.attachment?.[0];
    const isImage = attachment && (attachment.type === "image" || /\.(jpe?g|png|webp|gif)$/i.test(attachment.url));
    const isPdf = attachment && (attachment.type === "pdf" || /\.pdf$/i.test(attachment.url));
    const urgent = notice.priority === "high";
    const dept = notice.department;

    return (
        <section className="min-h-screen bg-slate-100 pb-16 pt-24 print:min-h-0 print:bg-white print:p-0">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 print:max-w-none print:px-0">

                {/* Print ma matra: letterhead (kasko suchana ho) */}
                <div className="mb-6 hidden items-center gap-4 border-b-4 border-[#dc143c] pb-4 print:flex">
                    <img src={settings.logo?.url || defaultLogo} alt="" className="h-16 w-16 object-contain" />
                    <div className="leading-tight">
                        <p className="text-sm text-[#003893]">{isEn ? settings.officeEn : settings.officeNe}</p>
                        <p className="text-2xl font-bold text-[#dc143c]">{isEn ? settings.nameEn : settings.nameNe}</p>
                        <p className="text-sm text-slate-600">{isEn ? settings.addressEn : settings.addressNe}</p>
                    </div>
                </div>

                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-slate-500 print:hidden">
                    <Link to="/" className="hover:text-[#003893]">{t("noticeDetail.home")}</Link>
                    <FaChevronRight className="text-[10px]" />
                    <Link to="/notices" className="hover:text-[#003893]">{t("noticeDetail.notices")}</Link>
                    <FaChevronRight className="text-[10px]" />
                    <span className="line-clamp-1 max-w-xs font-medium text-slate-700">{notice.title}</span>
                </nav>

                <div className="grid gap-8 lg:grid-cols-3 print:block">

                    {/* ===== Main ===== */}
                    <article className="animate-fade-up space-y-6 lg:col-span-2 print:animate-none print:space-y-4">

                        {/* Header card */}
                        <div className={`overflow-hidden rounded-2xl bg-white shadow-sm print:rounded-none print:shadow-none ${urgent ? "border-t-4 border-[#dc143c]" : "border-t-4 border-[#003893]"}`}>
                            <div className="p-6 sm:p-8 print:px-0 print:py-4">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${CATEGORY_STYLES[category] || CATEGORY_STYLES.notice}`}>
                                        {t(`noticeTabs.${category}`)}
                                    </span>

                                    {urgent && (
                                        <span className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-[#dc143c]">
                                            <FaExclamationCircle />
                                            {t("noticesPage.urgent")}
                                        </span>
                                    )}
                                </div>

                                <h1 className="mt-4 text-2xl font-bold leading-snug text-slate-900 sm:text-3xl">
                                    {notice.title}
                                </h1>

                                <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
                                    <MetaItem icon={FaCalendarAlt} label={t("noticeDetail.published")}>
                                        {bsDate(notice.createdAt, isEn)}
                                        <span className="block text-xs font-normal text-slate-500">
                                            {new Date(notice.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} AD
                                        </span>
                                    </MetaItem>

                                    {dept?.name && (
                                        <MetaItem icon={FaBuilding} label={t("noticeDetail.department")}>
                                            {dept.name}
                                        </MetaItem>
                                    )}

                                    {notice.ward && (
                                        <MetaItem icon={FaMapMarkerAlt} label={t("noticeDetail.ward")}>
                                            {t("noticesPage.ward", { ward: notice.ward })}
                                        </MetaItem>
                                    )}

                                    {notice.publishedBy && (
                                        <MetaItem icon={FaUserTie} label={t("noticeDetail.publishedBy")}>
                                            {notice.publishedBy}
                                        </MetaItem>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8 print:rounded-none print:p-0 print:shadow-none">
                            <h2 className="mb-4 flex items-center gap-3 text-lg font-bold text-slate-900">
                                <span className="h-6 w-1 rounded-full bg-[#dc143c]" />
                                {t("noticeDetail.description")}
                            </h2>

                            <p className="whitespace-pre-line text-[15px] leading-8 text-slate-700">
                                {notice.description}
                            </p>
                        </div>

                        {/* Attachment */}
                        {attachment && (isPdf || isImage) && (
                            <div className={`overflow-hidden rounded-2xl bg-white shadow-sm print:break-inside-avoid print:rounded-none print:shadow-none ${isPdf ? "print:hidden" : ""}`}>
                                <div className={`flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between ${isImage ? "border-b border-slate-100" : ""}`}>
                                    <div className="flex items-center gap-3">
                                        <span className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${isPdf ? "bg-red-50 text-[#dc143c]" : "bg-[#003893]/10 text-[#003893]"}`}>
                                            {isPdf ? <FaFilePdf /> : <FaFileImage />}
                                        </span>
                                        <div>
                                            <h2 className="font-bold text-slate-900">
                                                {isPdf ? t("noticeDetail.pdfTitle") : t("noticeDetail.imageTitle")}
                                            </h2>
                                            {isPdf && <p className="text-sm text-slate-500">{t("noticeDetail.pdfText")}</p>}
                                        </div>
                                    </div>

                                    <div className="flex gap-2 print:hidden">
                                        <a
                                            href={attachment.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 rounded-lg border border-[#003893] px-4 py-2 text-sm font-semibold text-[#003893] transition hover:bg-[#003893] hover:text-white"
                                        >
                                            <FaExternalLinkAlt className="text-xs" />
                                            {t("noticeDetail.open")}
                                        </a>
                                        <a
                                            href={attachment.url}
                                            download
                                            className="flex items-center gap-2 rounded-lg bg-[#003893] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#002a6e]"
                                        >
                                            <FaDownload className="text-xs" />
                                            {t("noticeDetail.download")}
                                        </a>
                                    </div>
                                </div>

                                {/* PDF page bhitra dekhaudaina, "खोल्नुहोस्" le naya tab ma kholcha */}
                                {isImage && (
                                    <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="block bg-slate-50 p-4 print:bg-white print:p-2">
                                        <img
                                            src={attachment.url}
                                            alt={attachment.altText || notice.title}
                                            className="mx-auto max-h-[75vh] rounded-lg object-contain print:max-h-[160mm]"
                                        />
                                    </a>
                                )}
                            </div>
                        )}

                        {/* Print ma matra: kahile ra kaha bata print bhayo */}
                        <p className="hidden border-t border-slate-300 pt-3 text-xs text-slate-500 print:block">
                            {t("noticeDetail.printedOn")}: {bsDate(new Date(), isEn, "YYYY MMMM DD")} · {pageUrl}
                        </p>

                        <Link
                            to="/notices"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#003893] hover:underline print:hidden"
                        >
                            <FaArrowLeft className="text-xs" />
                            {t("noticeDetail.back")}
                        </Link>
                    </article>

                    {/* ===== Sidebar ===== */}
                    <aside className="animate-fade-up space-y-6 print:hidden lg:sticky lg:top-28 lg:self-start" style={{ "--delay": "150ms" }}>

                        {/* Department contact */}
                        {dept && (dept.phone || dept.email || dept.address) && (
                            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                                <h2 className="bg-[#003893] px-5 py-3 font-semibold text-white">{t("noticeDetail.contact")}</h2>

                                <div className="space-y-3 p-5 text-sm">
                                    <p className="flex items-center gap-2 font-semibold text-slate-900">
                                        <FaBuilding className="text-[#003893]" />
                                        {dept.name}
                                    </p>
                                    {dept.phone && (
                                        <a href={`tel:${dept.phone}`} className="flex items-center gap-2 text-slate-600 hover:text-[#003893]">
                                            <FaPhoneAlt className="text-xs text-[#003893]" />
                                            {dept.phone}
                                        </a>
                                    )}
                                    {dept.email && (
                                        <a href={`mailto:${dept.email}`} className="flex items-center gap-2 break-all text-slate-600 hover:text-[#003893]">
                                            <FaEnvelope className="shrink-0 text-xs text-[#003893]" />
                                            {dept.email}
                                        </a>
                                    )}
                                    {dept.address && (
                                        <p className="flex items-center gap-2 text-slate-600">
                                            <FaMapMarkerAlt className="text-xs text-[#003893]" />
                                            {dept.address}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Related notices */}
                        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                            <h2 className="border-b border-slate-100 px-5 py-3 font-semibold text-slate-900">
                                {t("noticeDetail.related")}
                            </h2>

                            {related.length === 0 ? (
                                <p className="px-5 py-6 text-sm text-slate-500">{t("noticeDetail.noRelated")}</p>
                            ) : (
                                <ul className="divide-y divide-slate-100">
                                    {related.map((item) => (
                                        <li key={item._id}>
                                            <Link to={`/notices/${item._id}`} className="group block px-5 py-3 transition hover:bg-slate-50">
                                                <span className="text-xs text-[#dc143c]">{bsDate(item.createdAt, isEn, "YYYY MMMM DD")}</span>
                                                <span className="mt-0.5 line-clamp-2 block text-sm font-medium text-slate-800 group-hover:text-[#003893]">
                                                    {item.title}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
};

export default NoticeDetailsPage;
