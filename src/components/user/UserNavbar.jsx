import { LuBell, LuFileText, LuLayoutDashboard } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const sidebarLinks = [
  {
    icon: LuLayoutDashboard,
    label: "Dashboard",
    to: "/user",
    end: true,
  },
  {
    icon: LuFileText,
    label: "My Complaints",
    to: "/user/complaints",
  },
  {
    icon: LuBell,
    label: "Notifications",
    to: "/user/notifications",
  },
  {
    icon: IoMdSettings,
    label: "Profile Settings",
    to: "/user/settings",
  },
];

const UserNavbar = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div>
      {/* User Profile */}
      <div className="bg-gradient-to-br from-[#1e2a38] to-[#10151c] rounded-2xl p-5 mb-5 text-white text-center">
        <div className="mb-3">
          {userInfo?.avatar ? (
            <img
              src={userInfo.avatar}
              alt={userInfo?.name}
              className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-[#FFD700]"
            />
          ) : (
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-yellow-500 text-black text-3xl font-bold border-2 border-[#FFD700]">
              {userInfo?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
        </div>

        <h3 className="font-bold text-base">
          {userInfo?.name || "Citizen"}
        </h3>

        <p className="text-sm text-slate-400 mb-4">
          {userInfo?.email || "example@gmail.com"}
        </p>

        <span className="text-[#D9A439] border border-[#627086] rounded-2xl px-5 py-1 text-sm">
          Verified Citizen
        </span>
      </div>

      {/* Sidebar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
        {sidebarLinks.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all ${isActive
                  ? "bg-[#4a6c8f] text-white"
                  : "text-slate-600 hover:bg-slate-50"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default UserNavbar;