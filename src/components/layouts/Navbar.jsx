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
import { LuBell, LuBellOff } from "react-icons/lu";
import {
    getNotifications,
    markAllRead,
} from "../../redux/slices/notificationSlice";
import { formatDistanceToNow } from "date-fns";
import logo from "../../assets/logo.png"


const navLinks = [
    {
        label: "Home",
        to: "/",
    },
    {
        label: "Services",
        to: "/services",
    },
    {
        label: "Notices",
        to: "/notices",
    },
    {
        label: "Events",
        to: "/events",
    },
    {
        label: "Emergency",
        to: "/emergency",
    },
    {
        label: "About Us",
        to: "/about",
    },
];

const Navbar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    const navigate = useNavigate();
    const notificationRef = useRef(null);

    const [mobileNotificationOpen, setMobileNotificationOpen] = useState(false); // Mobile

    const [notificationOpen, setNotificationOpen] = useState(false);

    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.auth);

    const { notifications, unreadCount } = useSelector(
        (state) => state.notification,
    );

    // console.log(userInfo);

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

            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setNotificationOpen(false);
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
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f1a28] print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between gap-10 ">
                    {/* Logo */}
                    <Link to="/" className="flex items-center group">
                        <img
                            src={logo}
                            alt="Smart City Service Portal"
                            className="w-25 h-20 object-contain"
                        />

                        <div className="leading-tight -ml-4">
                            <h1 className="text-white font-bold text-2xl">
                                Smart <span className="text-[#d9a441]">City</span>
                            </h1>

                            <p className="text-[11px] text-slate-400">
                                Service Portal
                            </p>
                        </div>
                    </Link>

                    {userInfo?.role === "user" && (
                        <div className="flex lg:hidden justify-end mb-3 mt-4">
                            <div className="relative" ref={notificationRef}>
                                {/* Bell */}
                                <button
                                    onClick={() => {
                                        setMobileNotificationOpen(!mobileNotificationOpen);

                                        if (!mobileNotificationOpen) {
                                            dispatch(markAllRead());
                                        }
                                    }}
                                    className="relative p-2 rounded-full border border-white/20 hover:bg-white/10 transition"
                                >
                                    <LuBell className="w-5 h-5 text-white" />

                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center px-1 font-semibold">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {/* Dropdown */}
                                {mobileNotificationOpen && (
                                    <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[92vw] max-w-90 max-h-[75vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-9999">

                                        {/* Header */}
                                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
                                            <div>
                                                <h3 className="text-white font-semibold">Notifications</h3>
                                                <p className="text-xs text-slate-400">
                                                    {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => setMobileNotificationOpen(false)}
                                                className="text-slate-400 hover:text-white"
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        {/* List */}
                                        <div className="max-h-87.5 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="py-10 flex flex-col items-center">
                                                    <LuBellOff className="text-5xl text-slate-600" />
                                                    <p className="mt-3 text-slate-400 text-sm">
                                                        No notifications yet
                                                    </p>
                                                </div>
                                            ) : (
                                                notifications.map((item) => (
                                                    <div
                                                        key={item._id}
                                                        className={`flex gap-3 px-4 py-3 border-b border-slate-800 ${!item.isRead
                                                            ? "bg-blue-500/10 border-l-4 border-blue-500"
                                                            : "hover:bg-slate-800"
                                                            }`}
                                                    >
                                                        <div className="pt-2">
                                                            {!item.isRead && (
                                                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                            )}
                                                        </div>

                                                        <div className="flex-1">
                                                            <p className="text-white text-sm">
                                                                {item.message}
                                                            </p>

                                                            <p className="text-xs text-slate-400 mt-2">
                                                                {formatDistanceToNow(new Date(item.createdAt), {
                                                                    addSuffix: true,
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        {/* Footer */}
                                        {notifications.length > 0 && (
                                            <button
                                                onClick={() => {
                                                    setMobileNotificationOpen(false);
                                                    navigate("/user/notifications");
                                                }}
                                                className="w-full py-3 text-amber-400 hover:bg-slate-800 font-medium transition"
                                            >
                                                View All Notifications →
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
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
                                {link.label}
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
                                {userInfo?.role === "user" && (
                                    <div className="relative" ref={notificationRef}>
                                        {/* Bell */}
                                        <button
                                            onClick={() => {
                                                setNotificationOpen(!notificationOpen);

                                                if (!notificationOpen) {
                                                    dispatch(markAllRead());
                                                }
                                            }}
                                            className="relative p-2 rounded-full border border-white/20 hover:bg-white/10 transition"
                                        >
                                            <LuBell className="w-5 h-5 text-white" />

                                            {unreadCount > 0 && (
                                                <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center px-1 font-semibold">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </button>

                                        {/* Dropdown */}
                                        {notificationOpen && (
                                            <div className="absolute right-0 mt-4 w-95 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50">
                                                {/* Header */}
                                                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
                                                    <div>
                                                        <h3 className="text-white text-lg font-semibold">
                                                            Notifications
                                                        </h3>

                                                        <p className="text-xs text-slate-400 mt-1">
                                                            {unreadCount} unread notification
                                                            {unreadCount !== 1 ? "s" : ""}
                                                        </p>
                                                    </div>

                                                    {unreadCount > 0 && (
                                                        <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
                                                            New
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Notification List */}
                                                <div className="max-h-105 overflow-y-auto">
                                                    {notifications.length === 0 ? (
                                                        <div className="flex flex-col items-center justify-center py-12">
                                                            <LuBellOff className="text-5xl text-slate-600" />

                                                            <p className="mt-4 text-slate-400">
                                                                No notifications yet
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        notifications.map((item) => (
                                                            <div
                                                                key={item._id}
                                                                className={`flex gap-3 px-5 py-4 border-b border-slate-800 hover:bg-slate-800 transition cursor-pointer ${!item.isRead
                                                                    ? "bg-blue-500/10 border-l-4 border-blue-500"
                                                                    : ""
                                                                    }`}
                                                            >
                                                                {/* Unread Dot */}
                                                                <div className="pt-2">
                                                                    {!item.isRead && (
                                                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                                    )}
                                                                </div>

                                                                {/* Content */}
                                                                <div className="flex-1">
                                                                    <p className="text-white text-sm leading-6">
                                                                        {item.message}
                                                                    </p>

                                                                    <p className="text-xs text-slate-400 mt-2">
                                                                        {formatDistanceToNow(
                                                                            new Date(item.createdAt),
                                                                            {
                                                                                addSuffix: true,
                                                                            },
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>

                                                {/* Footer */}
                                                {notifications.length > 0 && (
                                                    <Link
                                                        to="/user/notifications"
                                                        onClick={() => setNotificationOpen(false)}
                                                        className="block text-center py-4 text-amber-400 font-medium hover:bg-slate-800 transition"
                                                    >
                                                        View All Notifications →
                                                    </Link>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

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
                                                        My Dashboard
                                                    </Link>
                                                )}

                                                {isAdmin && (
                                                    <Link
                                                        to="/admin"
                                                        onClick={() => setUserMenuOpen(false)}
                                                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-white/30"
                                                    >
                                                        <TbLayoutDashboardFilled size={14} />
                                                        Admin Dashboard
                                                    </Link>
                                                )}
                                            </div>

                                            <div className="border-t border-white/10 py-1">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-white/30 cursor-pointer"
                                                >
                                                    <MdLogout size={20} />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="gap-4 flex">
                                <Link to="/login">
                                    <Button props={{ text: "Login", bg: "bg-[#4a6c8f]/20" }} />
                                </Link>

                                <Link to="/register">
                                    <Button props={{ text: "Register", bg: "bg-green-500" }} />
                                </Link>
                            </div>
                        )}
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
                                {link.label}
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
                                                <span>My Dashboard</span>
                                            </Link>
                                        )}

                                        {isAdmin && (
                                            <Link
                                                to="/admin"
                                                onClick={() => setMobileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 rounded-md hover:bg-white/10 text-white"
                                            >
                                                <TbLayoutDashboardFilled size={15} />
                                                <span>Admin Dashboard</span>
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
                                            <span>Sign Out</span>
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
                                                    Login
                                                </button>
                                            </Link>

                                            <Link
                                                to="/register"
                                                className="flex-1"
                                                onClick={() => setMobileOpen(false)}
                                            >
                                                <button className="w-full py-2 rounded-md bg-green-500 hover:bg-green-600 text-[#10151c] font-medium transition cursor-pointer">
                                                    Register
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
                                                    Department Login
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
