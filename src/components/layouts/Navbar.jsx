import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../common/Button";
import { RiMenuFill } from "react-icons/ri";
import { FiX } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { FaChevronDown, FaUser } from "react-icons/fa";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { MdLogout } from "react-icons/md";
import { getNotifications } from "../../redux/slices/notificationSlice";
import logo from "../../assets/logo-small.png"
import GovHeader from "./GovHeader";
import NotificationBell from "./NotificationBell";
import LanguageSwitcher from "../common/LanguageSwitcher";
import { useTranslation } from "react-i18next";


const navLinks = [
    {
        labelKey: "nav.home",
        to: "/",
    },
    {
        labelKey: "nav.services",
        to: "/services",
    },
    {
        labelKey: "nav.notices",
        to: "/notices",
    },
    {
        labelKey: "nav.events",
        to: "/events",
    },
    {
        labelKey: "nav.emergency",
        to: "/emergency",
    },
    {
        labelKey: "downloads.navLabel",
        to: "/downloads",
    },
    {
        labelKey: "nav.about",
        to: "/about",
    },
];

const Navbar = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.auth);


    const isAuthenticated = !!userInfo;
    const isAdmin = userInfo?.role === "admin";

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isAuthenticated && userInfo?.role === "user") {
            dispatch(getNotifications());
        }
    }, [dispatch, isAuthenticated, userInfo]);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#003893] shadow-md print:hidden">
            {/* Sarkari header (nagarpalika ko naam, miti, hotline) */}
            <GovHeader />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* min-h-20: desktop ma logo nabhae pani uchai usai rahos (page haru yahi uchai anusar baneka chhan) */}
                <div className="flex min-h-20 items-center justify-between gap-3 lg:gap-10">
                    {/* Logo: mobile ma matra (desktop ma GovHeader le pahichan dekhaucha) */}
                    <Link to="/" className="flex min-w-0 shrink items-center gap-2 group md:hidden">
                        <img
                            src={logo}
                            alt="Smart City Service Portal"
                            className="h-12 w-12 shrink-0 rounded-lg bg-white object-contain p-0.5"
                        />

                        <div className="min-w-0 leading-tight">
                            <h1 className="whitespace-nowrap text-lg font-bold text-white">
                                Smart <span className="text-[#d9a441]">City</span>
                            </h1>

                            <p className="text-[11px] text-slate-400">
                                Service Portal
                            </p>
                        </div>
                    </Link>

                    {/* Mobile: notification ghanti */}
                    {userInfo?.role === "user" && (
                        <div className="ml-auto lg:hidden">
                            <NotificationBell mobile />
                        </div>
                    )}

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(link.to) ? "text-[#d9a441] bg-white/10" : "text-slate-300 hover:text-white hover:bg-white/5"}`}
                            >
                                {t(link.labelKey)}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    {/* <div className="hidden lg:flex items-center gap-2">
                        // Emergency Toggle
                        <Link to="/emergency">
                            <button
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs gap-2 px-3 rounded-md flex py-3 cursor-pointer"
                            >
                                <GoAlert className="w-3.5 h-3.5" />
                                Emergency
                            </button>
                        </Link>
                    </div> */}

                    {/* Auth area - desktop */}
                    <div className="hidden lg:flex items-center gap-3">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-3">
                                {/* Notification */}
                                {userInfo?.role === "user" && <NotificationBell />}

                                {/* User Menu */}
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-white/10 border-[#4a6c8f] hover:border-slate-300 hover:bg-white/15 transition-colors"
                                    >
                                        {userInfo?.avatar ? (
                                            <img
                                                src={userInfo.avatar}
                                                alt={userInfo.name}
                                                referrerPolicy="no-referrer"
                                                className="w-7 h-7 rounded-full object-cover border border-gray-300"
                                            />
                                        ) : (
                                            <div className="w-7 h-7 rounded-full bg-yellow-500 flex items-center justify-center text-black font-medium">
                                                {userInfo?.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3 pl-1">
                                            <span className="text-white text-sm font-medium max-w-25 tracking-widest">
                                                {userInfo?.name?.split(" ")[0]}
                                            </span>

                                            <FaChevronDown
                                                size={14}
                                                className={`text-slate-500 transition-transform ${userMenuOpen ? "rotate-180" : ""
                                                    }`}
                                            />
                                        </div>
                                    </button>

                                    {userMenuOpen && (
                                        <div className="absolute right-0 mt-3 w-62 bg-[#1e2a38] text-white rounded-lg shadow border border-[#4a6c8f]/30 overflow-hidden">
                                            <div className="py-1">
                                                {userInfo?.role === "user" && (
                                                    <Link
                                                        to="/user"
                                                        onClick={() => setUserMenuOpen(false)}
                                                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-white/30"
                                                    >
                                                        <FaUser size={14} />
                                                        {t("auth.myDashboard")}
                                                    </Link>
                                                )}

                                                {isAdmin && (
                                                    <Link
                                                        to="/admin"
                                                        onClick={() => setUserMenuOpen(false)}
                                                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-white/30"
                                                    >
                                                        <TbLayoutDashboardFilled size={14} />
                                                        {t("auth.adminDashboard")}
                                                    </Link>
                                                )}
                                            </div>

                                            <div className="border-t border-white/10 py-1">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-white/30 cursor-pointer"
                                                >
                                                    <MdLogout size={20} />
                                                    {t("auth.signOut")}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="gap-4 flex">
                                <Link to="/login">
                                    <Button props={{ text: t("auth.login"), bg: "bg-[#4a6c8f]/20" }} />
                                </Link>

                                <Link to="/register">
                                    <Button props={{ text: t("auth.register"), bg: "bg-green-500" }} />
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile: bhasha switch (desktop ma GovHeader ma cha) */}
                    <div className="md:hidden">
                        <LanguageSwitcher variant="dark" />
                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        className="text-white lg:hidden cursor-pointer"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? (
                            <FiX className="w-6 h-6" />
                        ) : (
                            <RiMenuFill className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {mobileOpen && (
                <div className="lg:hidden bg-[#10151c]/95 backdrop-blur-lg border-t border-[#4a6c8f]/20">
                    <div className="px-4 py-4 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMobileOpen(false)}
                                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(link.to) ? "text-[#d9a441] bg-white/30" : "text-slate-300 hover:text-white hover:bg-white/5"}`}
                            >
                                {t(link.labelKey)}
                            </Link>
                        ))}
                        <div className="pt-3 border-t border-[#4a6c8f]/20 flex flex-col gap-2">
                            {/* <Link
                                to="/emergency"
                                onClick={() => setMobileOpen(false)}
                            >
                                <button className="w-full bg-red-600 text-white hover:bg-red-700 cursor-pointer py-2 rounded-md font-medium flex items-center gap-2 justify-center transition-colors">
                                    <GoAlert className="w-4 h-4" />
                                    Emergency Services
                                </button>
                            </Link> */}

                            <div className="mt-2">
                                {isAuthenticated ? (
                                    <>
                                        {/* User Info */}
                                        <div className="px-4 py-2.5 mb-2 flex items-center gap-3">
                                            {userInfo?.avatar ? (
                                                <img
                                                    src={userInfo.avatar}
                                                    alt={userInfo.name}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold text-lg">
                                                    {userInfo?.name?.charAt(0).toUpperCase()}
                                                </div>
                                            )}

                                            <div className="min-w-0">
                                                <p className="text-white font-semibold truncate">
                                                    {userInfo?.name}
                                                </p>
                                                <p className="text-white/60 text-sm truncate">
                                                    {userInfo?.email}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Dashboard */}
                                        {userInfo?.role === "user" && (
                                            <Link
                                                to="/user"
                                                onClick={() => setMobileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 rounded-md hover:bg-white/10 text-white"
                                            >
                                                <FaUser size={15} />
                                                <span>{t("auth.myDashboard")}</span>
                                            </Link>
                                        )}

                                        {isAdmin && (
                                            <Link
                                                to="/admin"
                                                onClick={() => setMobileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 rounded-md hover:bg-white/10 text-white"
                                            >
                                                <TbLayoutDashboardFilled size={15} />
                                                <span>{t("auth.adminDashboard")}</span>
                                            </Link>
                                        )}

                                        {/* Sign Out */}
                                        <button
                                            onClick={() => {
                                                setMobileOpen(false);
                                                handleLogout();
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 mt-2 rounded-md hover:bg-white/10 text-red-400 cursor-pointer"
                                        >
                                            <MdLogout size={18} />
                                            <span>{t("auth.signOut")}</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex gap-2">
                                            <Link
                                                to="/login"
                                                className="flex-1"
                                                onClick={() => setMobileOpen(false)}
                                            >
                                                <button className="w-full py-2 border border-[#4a6c8f] rounded-md text-white hover:bg-[#4a6c8f]/20 transition cursor-pointer">
                                                    {t("auth.login")}
                                                </button>
                                            </Link>

                                            <Link
                                                to="/register"
                                                className="flex-1"
                                                onClick={() => setMobileOpen(false)}
                                            >
                                                <button className="w-full py-2 rounded-md bg-green-500 hover:bg-green-600 text-[#10151c] font-medium transition cursor-pointer">
                                                    {t("auth.register")}
                                                </button>
                                            </Link>
                                        </div>

                                        {/* Department Login */}
                                        <div className="mt-3">
                                            <Link
                                                to="/department/login"
                                                onClick={() => setMobileOpen(false)}
                                            >
                                                <button className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition cursor-pointer">
                                                    {t("auth.departmentLogin")}
                                                </button>
                                            </Link>
                                        </div>

                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
