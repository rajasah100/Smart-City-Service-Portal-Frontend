import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NepaliDate from "nepali-date-converter";
import { FaArrowRight, FaPhoneAlt, FaRegCalendarAlt } from "react-icons/fa";
import apiRequest from "../../../utils/apiRequest";

const TABS = ["notice", "tender", "news", "press"];

const HOTLINES = [
    { key: "police", number: "100" },
    { key: "fire", number: "101" },
    { key: "ambulance", number: "102" },
];

// Slider ko daya tira सूचना / बोलपत्र / समाचार / प्रेस विज्ञप्ति tab ra aapatkalin number
const HeroNoticePanel = () => {
    const { t, i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage === "en";

    const [active, setActive] = useState("notice");
    // Har tab ko data ekchoti matra load garne: { notice: [...], tender: [...] }
    const [lists, setLists] = useState({});

    const items = lists[active];
    const loading = items === undefined;

    useEffect(() => {
        if (lists[active] !== undefined) return;

        let ignore = false;

        apiRequest
            .get("/notices", { params: { category: active, limit: 5 } })
            .then(({ data }) => {
                if (!ignore) setLists((prev) => ({ ...prev, [active]: Array.isArray(data) ? data : [] }));
            })
            .catch(() => {
                if (!ignore) setLists((prev) => ({ ...prev, [active]: [] }));
            });

        return () => {
            ignore = true;
        };
    }, [active, lists]);

    const bsDate = (date) => {
        try {
            return new NepaliDate(new Date(date)).format("YYYY-MM-DD", isEn ? "en" : "np");
        } catch {
            return "";
        }
    };

    return (
        <div className="flex h-full flex-col gap-4">
            {/* Notices */}
            <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                {/* Tabs */}
                <div role="tablist" className="grid grid-cols-4 bg-[#003893] text-white">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            role="tab"
                            aria-selected={active === tab}
                            onClick={() => setActive(tab)}
                            className={`border-b-4 px-1 py-3 text-xs font-semibold transition sm:text-sm ${
                                active === tab
                                    ? "border-[#dc143c] bg-white/15"
                                    : "border-transparent text-white/80 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            {t(`noticeTabs.${tab}`)}
                        </button>
                    ))}
                </div>

                <ul role="tabpanel" className="flex-1 divide-y divide-slate-100">
                    {loading &&
                        [1, 2, 3, 4].map((item) => (
                            <li key={item} className="space-y-2 px-4 py-3">
                                <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
                                <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                            </li>
                        ))}

                    {!loading &&
                        items.map((notice) => (
                            <li key={notice._id}>
                                <Link
                                    to={`/notices/${notice._id}`}
                                    className="group block px-4 py-3 transition hover:bg-slate-50"
                                >
                                    <span className="flex items-center gap-1.5 text-xs text-[#dc143c]">
                                        <FaRegCalendarAlt />
                                        {bsDate(notice.createdAt)}
                                        {notice.department?.name && (
                                            <span className="truncate text-slate-400">· {notice.department.name}</span>
                                        )}
                                    </span>

                                    <span className="mt-1 line-clamp-2 text-sm font-medium text-slate-800 group-hover:text-[#003893]">
                                        {notice.title}
                                    </span>
                                </Link>
                            </li>
                        ))}

                    {!loading && items.length === 0 && (
                        <li className="px-4 py-10 text-center text-sm text-slate-500">
                            {t("noticeTabs.empty")}
                        </li>
                    )}
                </ul>

                <Link
                    to="/notices"
                    className="flex items-center justify-center gap-2 border-t border-slate-100 py-2.5 text-sm font-medium text-[#003893] hover:bg-slate-50"
                >
                    {t("homeGov.board.viewAll")}
                    <FaArrowRight className="text-xs" />
                </Link>
            </div>

            {/* Emergency */}
            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                <p className="mb-3 text-sm font-semibold text-[#dc143c]">
                    {t("homeGov.heroGov.emergencyContacts")}
                </p>

                <div className="grid grid-cols-3 gap-2">
                    {HOTLINES.map(({ key, number }) => (
                        <a
                            key={key}
                            href={`tel:${number}`}
                            className="flex flex-col items-center rounded-lg bg-white py-2 text-center shadow-sm transition hover:bg-[#dc143c] hover:text-white"
                        >
                            <span className="flex items-center gap-1 text-base font-bold">
                                <FaPhoneAlt className="text-xs" />
                                {number}
                            </span>
                            <span className="text-xs">{t(`homeGov.heroGov.${key}`)}</span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HeroNoticePanel;
