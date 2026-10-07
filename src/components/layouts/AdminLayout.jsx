import { useState } from "react"
import { Link, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { LuCalendarDays, LuMenu } from "react-icons/lu";
import AdminSidebar from "./AdminSidebar";
import LanguageSwitcher from "../common/LanguageSwitcher";
import useSosPushAlerts from "../../hooks/useSosPushAlerts";
import apiRequest from "../../utils/apiRequest";
import { formatBS } from "../../utils/nepaliDate";

// Admin: sthir chauda ko sidebar + mathi sano bar. Page ko shirshak page aafai dinchha.
// Note: main ma transform animation narakhne (bhitra ka fixed modal lai thunchha)
const AdminLayout = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { t, i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage === "en";
    const { userInfo } = useSelector((state) => state.auth);

    // SOS aauda dashboard band bhae pani phone/browser ma notification aaos
    useSosPushAlerts({
        api: apiRequest,
        endpoint: "/users/fcm-token",
        method: "put",
        sosPath: "/admin/sos",
    });

    return (
        <div className="min-h-screen bg-slate-100">
            <AdminSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

            <div className="lg:ml-72 print:ml-0">
                <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur print:hidden">
                    <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
                        <button
                            type="button"
                            onClick={() => setMenuOpen(true)}
                            aria-label={t("adminDash.openMenu")}
                            className="rounded-xl p-2 text-[#003893] hover:bg-slate-100 lg:hidden"
                        >
                            <LuMenu size={22} />
                        </button>

                        <span className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 sm:flex">
                            <LuCalendarDays className="text-[#003893]" />
                            {formatBS(new Date(), isEn, "YYYY MMMM DD, ddd")}
                        </span>

                        <div className="flex-1" />

                        <LanguageSwitcher variant="light" />

                        <Link to="/admin/users" className="flex items-center gap-2.5 rounded-xl p-1 transition hover:bg-slate-100">
                            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#003893] text-sm font-bold text-white">
                                {userInfo?.avatar ? (
                                    <img src={userInfo.avatar} alt="" className="h-full w-full object-cover" />
                                ) : (
                                    userInfo?.name?.charAt(0).toUpperCase() || "A"
                                )}
                            </span>
                            <span className="hidden text-left md:block">
                                <span className="block max-w-40 truncate text-sm font-semibold text-slate-900">{userInfo?.name}</span>
                                <span className="block text-xs text-slate-500">{t("adminDash.role")}</span>
                            </span>
                        </Link>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl p-4 sm:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
