import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { LuLogOut, LuX } from "react-icons/lu";
import { logoutDepartment, logoutDepartmentAsync } from "../../redux/slices/departmentSlice";
import useSiteSettings from "../../hooks/useSiteSettings";
import defaultLogo from "../../assets/logo-small.png";
import { DEPT_MENU } from "./deptMenu";
import { initials } from "./deptUtils";

// Department ko sidebar: desktop ma sadhai, mobile ma navbar ko menu button le kholne
const Sidebar = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage === "en";
    const settings = useSiteSettings();
    const { department } = useSelector((state) => state.department);

    const handleLogout = async () => {
        try {
            await dispatch(logoutDepartmentAsync()).unwrap();
            dispatch(logoutDepartment());
            toast.success(t("deptDash.loggedOut"));
            navigate("/", { replace: true });
        } catch (error) {
            toast.error(error?.message || t("deptDash.logoutFailed"));
        }
    };

    return (
        <>
            {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} aria-hidden="true" />}

            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-[#002a6e] text-white shadow-xl transition-transform duration-300 lg:translate-x-0 print:hidden ${
                    open ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="h-1 bg-[#dc143c]" />

                {/* Logo */}
                <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white p-1">
                        <img src={settings.logo?.url || defaultLogo} alt="" className="h-full w-full object-contain" />
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="truncate font-bold leading-tight">{isEn ? settings.nameEn : settings.nameNe}</p>
                        <p className="mt-0.5 text-xs font-medium text-amber-300">{t("deptDash.portal")}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={t("deptDash.closeMenu")}
                        className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 lg:hidden"
                    >
                        <LuX size={20} />
                    </button>
                </div>

                {/* Menu */}
                <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                    {DEPT_MENU.map(({ key, path, icon: Icon }) => (
                        <NavLink
                            key={key}
                            to={path}
                            end={path === "/department"}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                                    isActive ? "bg-white text-[#003893] shadow-sm" : "text-white/85 hover:bg-white/10 hover:text-white"
                                }`
                            }
                        >
                            <Icon size={19} className="shrink-0" />
                            {t(`deptDash.menu.${key}`)}
                        </NavLink>
                    ))}
                </nav>

                {/* Department */}
                <div className="border-t border-white/10 p-4">
                    <div className="mb-3 flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-[#002a6e]">
                            {initials(department?.name)}
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">{department?.name}</p>
                            <p className="truncate text-xs text-white/60">{department?.email}</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 py-2.5 text-sm font-semibold text-white/90 transition hover:border-[#dc143c] hover:bg-[#dc143c] hover:text-white"
                    >
                        <LuLogOut size={16} />
                        {t("deptDash.logout")}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
