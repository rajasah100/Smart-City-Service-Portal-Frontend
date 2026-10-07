import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { MdEmergency } from "react-icons/md";
import { FaMapMarkedAlt, FaPhoneAlt, FaSearch, FaTimes } from "react-icons/fa";
import { IoIosRadio } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";
import { normalizeServiceType } from "./serviceType";

import { getEmergencyServices } from "../../../redux/slices/emergencyServiceSlice";

import PageHero from "../../common/PageHero";

const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

const HeroSection = () => {

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [search, setSearch] = useState("");
    const [showResults, setShowResults] = useState(false);

    const { services = [], loading } = useSelector(
        (state) => state.emergencyService
    );

    // EmergencyAlerts section le load gareko high-priority notice
    const { notices = [] } = useSelector((state) => state.notice);

    const liveAlerts = Array.isArray(notices)
        ? notices.filter((notice) => notice.priority === "high").slice(0, 3)
        : [];


    const handleSearch = async () => {

        if (!search.trim()) return;

        try {
            const result = await dispatch(
                getEmergencyServices({ search: search.trim() })
            ).unwrap();

            setShowResults(true);

            if (result.length === 0) {
                toast.info(t("emergency.noSearchResult"));
            }
        } catch {
            toast.error(t("emergency.searchFailed"));
        }

    };


    return (

        <>

            <PageHero
                icon={MdEmergency}
                badge={t("hero.emergency.badge")}
                title={t("hero.emergency.title")}
                description={t("hero.emergency.description")}
            >

                {/* SEARCH */}
                <div className="relative mx-auto max-w-xl">

                    <FaSearch
                        onClick={handleSearch}
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch();
                            }
                        }}
                        placeholder={t("emergency.searchPlaceholder")}
                        className="w-full rounded-xl border border-white/20 bg-white/5 py-4 pl-14 pr-5 text-white placeholder:text-slate-400 outline-none focus:border-[#d9a441]"
                    />

                </div>


                {/* BUTTONS */}
                <div className="flex flex-wrap justify-center gap-4 mt-6">

                    <a
                        href="tel:100"
                        className="flex gap-2 items-center bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition"
                    >
                        <FaPhoneAlt />
                        {t("emergency.callPolice")}
                    </a>

                    <a
                        href="tel:102"
                        className="flex gap-2 items-center bg-[#d9a441] text-[#10151c] px-6 py-3 rounded-xl font-semibold hover:bg-[#c8932f] transition"
                    >
                        <FaPhoneAlt />
                        {t("emergency.ambulance")}
                    </a>

                    <button
                        onClick={() => scrollTo("nearby-services")}
                        className="flex items-center gap-2 border border-white/60 text-white px-6 py-3 rounded-xl hover:bg-white hover:text-[#10151c] transition"
                    >
                        <FaMapMarkedAlt />
                        {t("emergency.findNearby")}
                    </button>

                </div>

            </PageHero>


            {/* LIVE ALERT (asli high-priority notice) */}
            {/* Home ko सूचना ticker jastai: seto patti, baya rato label */}
            <section className="flex items-stretch border-b border-slate-200 bg-white">

                <span className="flex shrink-0 items-center gap-2 bg-[#dc143c] px-4 py-2.5 text-sm font-semibold text-white">
                    <IoIosRadio className="animate-pulse" />
                    {t("emergency.liveAlerts")}
                </span>

                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3 px-4 py-2">

                    {liveAlerts.length > 0 ? (
                        liveAlerts.map((alert) => (
                            <Link
                                key={alert._id}
                                to={`/notices/${alert._id}`}
                                className="flex max-w-xs items-center gap-2 truncate text-sm text-slate-700 hover:text-[#dc143c] hover:underline"
                            >
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#dc143c]" />
                                {alert.title}
                            </Link>
                        ))
                    ) : (
                        <span className="text-sm text-slate-500">
                            {t("emergency.noLiveAlerts")}
                        </span>
                    )}

                    <button
                        onClick={() => scrollTo("safety-guide")}
                        className="ml-auto text-sm font-medium text-[#003893] underline-offset-4 hover:underline"
                    >
                        {t("emergency.safetyGuideLink")}
                    </button>

                </div>

            </section>


            {/* SEARCH RESULT */}
            {showResults && services.length > 0 && (

                <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-10">

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">
                                {t("emergency.searchResults")}
                            </h2>

                            <button
                                onClick={() => setShowResults(false)}
                                className="text-slate-400 hover:text-slate-700"
                                aria-label={t("emergency.closeResults")}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {loading ? (
                            <p className="py-6 text-center text-slate-500">{t("emergency.searching")}</p>
                        ) : (
                            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {services.map((service) => (
                                    <div
                                        key={service._id}
                                        className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-4"
                                    >
                                        <div className="min-w-0">
                                            <h3 className="truncate font-semibold text-slate-900">
                                                {service.name}
                                            </h3>

                                            <p className="text-sm text-slate-500">
                                                {t(`emergency.nearby.types.${normalizeServiceType(service.type)}`)}
                                                {service.address && ` · ${service.address}`}
                                            </p>
                                        </div>

                                        <a
                                            href={`tel:${service.phone}`}
                                            className="flex shrink-0 items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                                        >
                                            <FaPhoneAlt />
                                            {service.phone}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>

                </div>
            )}

        </>

    );
};


export default HeroSection;
