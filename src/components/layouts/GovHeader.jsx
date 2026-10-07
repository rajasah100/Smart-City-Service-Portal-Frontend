import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NepaliDate from "nepali-date-converter";
import { FaPhoneAlt } from "react-icons/fa";
import useSiteSettings from "../../hooks/useSiteSettings";
import LanguageSwitcher from "../common/LanguageSwitcher";
import defaultLogo from "../../assets/logo-small.png";

// Sarkari website jasto mathi ko header (nagarpalika ko naam, miti, hotline, bhasha)
// Uchai h-19 sanga milnu parcha (HomeLayout ma tyati nai thau chhodiyeko cha)
const GovHeader = () => {
    const settings = useSiteSettings();
    const { t, i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage === "en";
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Browser tab ma nagarpalika ko naam
    useEffect(() => {
        document.title = `${isEn ? settings.nameEn : settings.nameNe} | Smart City Service Portal`;
    }, [isEn, settings.nameEn, settings.nameNe]);

    const today = new Date();
    const bsDate = new NepaliDate(today).format("YYYY MMMM DD, ddd", isEn ? "en" : "np");
    const adDate = today.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const office = isEn ? settings.officeEn : settings.officeNe;
    const name = isEn ? settings.nameEn : settings.nameNe;

    return (
        <div
            className={`hidden overflow-hidden border-b-4 border-[#dc143c] bg-white transition-[height] duration-300 md:block ${
                scrolled ? "md:h-0 md:border-b-0" : "md:h-19"
            }`}
        >
            <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">

                {/* Logo + Office name */}
                <Link to="/" className="flex min-w-0 items-center gap-3">
                    <img
                        src={settings.logo?.url || defaultLogo}
                        alt={settings.nameEn}
                        className="h-14 w-14 shrink-0 object-contain"
                    />

                    <div className="min-w-0 leading-tight">
                        <p className="truncate text-xs font-medium text-[#003893]">{office}</p>
                        <p className="truncate text-xl font-bold text-[#dc143c]">{name}</p>
                    </div>
                </Link>

                <div className="flex shrink-0 items-center gap-5">
                    {/* Date */}
                    <div className="hidden text-right leading-tight lg:block">
                        <p className="text-sm font-semibold text-[#003893]">
                            {t("gov.today")}: {bsDate} {isEn && "BS"}
                        </p>
                        <p className="text-xs text-slate-500">{adDate} AD</p>
                    </div>

                    <LanguageSwitcher variant="light" />

                    {/* Hotline */}
                    <a
                        href={`tel:${settings.hotline || "100"}`}
                        className="hidden items-center gap-2 rounded-lg bg-[#dc143c] px-4 py-2 text-white transition hover:bg-[#b51031] lg:flex"
                    >
                        <FaPhoneAlt className="text-sm" />

                        <span className="leading-tight">
                            <span className="block text-[10px] uppercase tracking-wider opacity-90">
                                {t("gov.emergency")}
                            </span>
                            <span className="block font-bold">{settings.hotline || "100"}</span>
                        </span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default GovHeader;
