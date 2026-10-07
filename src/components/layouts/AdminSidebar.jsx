import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { LuExternalLink, LuLogOut, LuX } from "react-icons/lu";
import { logout } from "../../redux/slices/authSlice";
import useSiteSettings from "../../hooks/useSiteSettings";
import defaultLogo from "../../assets/logo-small.png";
import { ADMIN_MENU } from "./adminMenu";

// Admin ko sidebar: desktop ma sadhai (sthir chauda), mobile ma topbar ko menu button le kholne
const AdminSidebar = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage === "en";
    const settings = useSiteSettings();

    const handleLogout = () => {
        dispatch(logout());
        window.location.replace("/");
    };

    return (
        <>
            {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} aria-hidden="true" />}

            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-[#10151c] text-white shadow-xl transition-transform duration-300 lg:translate-x-0 print:hidden ${
                    open ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="h-1 bg-linear-to-r from-[#dc143c] to-[#003893]" />

                {/* Logo */}
                <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white p-1">
                        <img src={settings.logo?.url || defaultLogo} alt="" className="h-full w-full object-contain" />
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="truncate font-bold leading-tight">{isEn ? settings.nameEn : settings.nameNe}</p>
                        <p className="mt-0.5 text-xs font-medium text-amber-300">{t("adminDash.portal")}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={t("adminDash.closeMenu")}
                        className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 lg:hidden"
                    >
                        <LuX size={20} />
                    </button>
                </div>

                {/* Menu */}
                <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
                    {ADMIN_MENU.map(({ group, items }) => (
                        <div key={group}>
                            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                                {t(`adminDash.groups.${group}`)}
                            </p>
                            <div className="space-y-0.5">
                                {items.map(({ key, path, icon: Icon }) => (
                                    <NavLink
                                        key={key}
                                        to={path}
                                        end={path === "/admin"}
                                        onClick={onClose}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                                                isActive
                                                    ? "bg-[#003893] text-white shadow-sm"
                                                    : "text-white/75 hover:bg-white/10 hover:text-white"
                                            }`
                                        }
                                    >
                                        <Icon size={18} className="shrink-0" />
                                        {t(`adminDash.menu.${key}`)}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="space-y-2 border-t border-white/10 p-3">
                    <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
                    >
                        <LuExternalLink size={18} />
                        {t("adminDash.menu.website")}
                    </a>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 py-2.5 text-sm font-semibold text-white/90 transition hover:border-[#dc143c] hover:bg-[#dc143c] hover:text-white"
                    >
                        <LuLogOut size={16} />
                        {t("adminDash.logout")}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
