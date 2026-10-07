import { FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaTiktok, FaYoutube } from "react-icons/fa"
import { Link } from "react-router-dom"
import { FiMail } from "react-icons/fi";
import useSiteSettings from "../../hooks/useSiteSettings";
import { useTranslation } from "react-i18next";
import defaultLogo from "../../assets/logo-small.png";
// import logo from "../../assets/logo-small.png"

const quickLinks = [
    { labelKey: "nav.home", to: "/" },
    { labelKey: "nav.services", to: "/services" },
    { labelKey: "nav.notices", to: "/notices" },
    { labelKey: "nav.events", to: "/events" },
    { labelKey: "footer.fileComplaint", to: "/complaint" },
    { labelKey: "footer.emergencyServices", to: "/emergency" },
]

const citizen = [
    { labelKey: "footer.registerAccount", to: "/register" },
    { labelKey: "footer.aboutPortal", to: "/about" },
    { labelKey: "footer.governmentServices", to: "/government" },
    { labelKey: "downloads.navLabel", to: "/downloads" },
]

// Social media: link admin le Settings bata halcha. Link nabhae icon dekhaudaina
const socialMedia = [
    { key: "facebook", label: "Facebook", Icon: FaFacebook, hoverClass: "hover:bg-[#1877F2]" },
    { key: "youtube", label: "YouTube", Icon: FaYoutube, hoverClass: "hover:bg-[#FF0000]" },
    { key: "instagram", label: "Instagram", Icon: FaInstagram, hoverClass: "hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7]" },
    { key: "tiktok", label: "TikTok", Icon: FaTiktok, hoverClass: "hover:bg-[#000000] border border-transparent hover:border-slate-700" },
]

const Footer = () => {
    const settings = useSiteSettings();
    const { t, i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage === "en";

    return (
        <footer className="bg-[#10151c] text-slate-300 print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                src={settings.logo?.url || defaultLogo}
                                alt={settings.nameEn}
                                className="h-12 w-12 rounded-lg bg-white object-contain p-1"
                            />

                            <div className="leading-tight">
                                <p className="font-bold text-white">{isEn ? settings.nameEn : settings.nameNe}</p>
                                <p className="text-xs text-slate-400">{isEn ? settings.officeEn : settings.officeNe}</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed mb-5">
                            {t("footer.description")}
                        </p>

                        {/* Updated Social Links mapping */}
                        <div className="flex gap-3">
                            {socialMedia.filter(({ key }) => settings[key]).map(({ key, label, Icon, hoverClass }) => (
                                <a
                                    key={key}
                                    href={settings[key]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className={`w-8 h-8 rounded-full bg-[#1e2a38] flex items-center justify-center text-slate-300 hover:text-white transition-all duration-300 ${hoverClass}`}
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">{t("footer.quickLinks")}</h4>
                        <ul className="space-y-2 text-sm"> {/* Fixed typo: test-sm -> text-sm */}
                            {quickLinks.map((l) => (
                                <li key={l.to}>
                                    <Link
                                        to={l.to}
                                        className="text-slate-400 hover:text-[#d9a441] transition-colors"
                                    >
                                        {t(l.labelKey)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Citizen Services */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">{t("footer.citizenServices")}</h4>
                        <ul className="space-y-2 text-sm">
                            {citizen.map((c) => (
                                <li key={c.to}>
                                    <Link
                                        to={c.to}
                                        className="text-slate-400 hover:text-[#d9a441] transition-colors"
                                    >
                                        {t(c.labelKey)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white mb-4 font-semibold ">{t("footer.contactUs")}</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2 text-slate-400">
                                <FaMapMarkerAlt className="w-4 h-4 mt-0.5 shrink-0 text-[#d9a441]" />
                                {isEn ? settings.addressEn : settings.addressNe}
                            </li>
                            <li className="flex items-center gap-2 text-slate-400">
                                <FaPhoneAlt className="w-4 h-4 shrink-0 text-[#d9a441]" />
                                {settings.phone || t("footer.notAvailable")}
                            </li>

                            <li className="flex items-center gap-2 text-slate-400">
                                <FiMail className="w-5 h-5 shrink-0 text-[#d9a441]" />
                                {settings.email || t("footer.notAvailable")}
                            </li>
                        </ul>
                        <div className="mt-5 p-3 rounded-lg bg-red-900/30 border border-red-800/40">
                            <p className="text-sm text-red-300 font-semibold">{t("footer.emergencyHotline")}</p>
                            <p className="text-white font-bold text-lg">{settings.hotline || "100"}</p>
                        </div>
                    </div>
                </div>

                {/* copyright */}
                <div className="mt-10 pt-6 border-t border-[#1e2a38] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                    <p>&copy; {new Date().getFullYear()} {isEn ? settings.nameEn : settings.nameNe}. {t("footer.rights")} {t("footer.poweredBy")}</p>
                    <div className="flex gap-4">
                        <Link to="/privacy" className="hover:text-slate-300 transition-colors">{t("footer.privacy")}</Link>
                        <Link to="/terms" className="hover:text-slate-300 transition-colors">{t("footer.terms")}</Link>
                        <Link to="/accessibility" className="hover:text-slate-300 transition-colors">{t("footer.accessibility")}</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer