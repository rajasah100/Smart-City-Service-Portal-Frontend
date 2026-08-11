import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    LuMenu,
    LuX,
    LuLayoutDashboard,
    LuFileText,
    LuMapPinned,
    LuBell,
    LuChartColumn,
    LuUser,
    LuSettings,
    LuLogOut,
} from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux"
import { logoutDepartment, logoutDepartmentAsync } from "../../redux/slices/departmentSlice"
import { toast } from "react-toastify";

const menus = [
    {
        title: "Dashboard",
        path: "/department",
        icon: LuLayoutDashboard,
    },
    {
        title: "Complaints",
        path: "/department/complaints",
        icon: LuFileText,
    },
    {
        title: "Location Tracking",
        path: "/department/location",
        icon: LuMapPinned,
    },
    {
        title: "Notices",
        path: "/department/notices",
        icon: LuBell,
    },
    {
        title: "Analytics",
        path: "/department/analytics",
        icon: LuChartColumn,
    },
    {
        title: "Profile",
        path: "/department/profile",
        icon: LuUser,
    },
    {
        title: "Settings",
        path: "/department/settings",
        icon: LuSettings,
    },
];



const Sidebar = () => {
    const [open, setOpen] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { department } = useSelector((state) => state.department);


    const handleLogout = async () => {
        try {
            await dispatch(logoutDepartmentAsync()).unwrap();

            dispatch(logoutDepartment());

            toast.success("Logged out successfully!")

            setTimeout(() => {
                navigate("/", { replace: true });
            }, 2000);

        } catch (error) {
            toast.error(error?.message || "Logout failed. Please try again.")
        }
    };

    return (
        <>
            {/* Mobile Menu */}
            <button
                onClick={() => setOpen(true)}
                className="lg:hidden fixed top-5 left-5 z-50 bg-[#10151c] text-white p-2 rounded-lg"
            >
                <LuMenu size={22} />
            </button>

            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-screen flex flex-col w-72 bg-[#10151c] text-white z-50 transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
            >
                {/* Header */}
                <div className="flex justify-between items-center px-6 h-20 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-[#d9a441] text-black flex items-center justify-center font-bold text-lg">
                            SC
                        </div>
                        <div className="">
                            <h1 className="text-2xl font-bold text-white">
                                Smart <span className="text-[#d9a441]">City</span>
                            </h1>
                            <p className="text-sm text-slate-400">
                                Department
                            </p>
                        </div>
                    </div>

                    <button
                        className="lg:hidden"
                        onClick={() => setOpen(false)}
                    >
                        <LuX size={24} />
                    </button>
                </div>

                {/* Menus */}
                <div className="p-4 space-y-2">
                    {menus.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.title}
                                to={item.path}
                                end={item.path === "/department"}
                                onClick={() => setOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive
                                        ? "bg-[#0f4c81]"
                                        : "hover:bg-slate-800"
                                    }`
                                }
                            >
                                <Icon size={20} />
                                {item.title}
                            </NavLink>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="mt-auto border-t border-slate-700 p-5">

                    <div className="flex items-center gap-3 mb-5">

                        <div className="w-11 h-11 rounded-full bg-[#0f4c81] flex items-center justify-center font-bold text-lg uppercase">
                            {department?.name?.split(" ").map((word) => word[0]).join("").slice(0, 2) || "DP"}
                        </div>

                        <div>
                            <h4 className="font-semibold">
                                {department?.name || "Department"}
                            </h4>

                            <p className="text-xs text-slate-400">
                                {department?.email || "department@smartcity.gov.np"}
                            </p>
                        </div>

                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 rounded-xl border border-red-500 py-3 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer"
                    >
                        <LuLogOut size={18} />
                        Logout
                    </button>

                </div>
            </aside>
        </>
    );
};

export default Sidebar;