import { LuBell, LuFileText, LuLayoutDashboard, LuSettings, LuSiren, LuSquarePen } from "react-icons/lu";
import { NavLink, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const sidebarLinks = [
  { icon: LuLayoutDashboard, key: "dashboard", to: "/user", end: true },
  { icon: LuFileText, key: "complaints", to: "/user/complaints" },
  { icon: LuBell, key: "notifications", to: "/user/notifications" },
  { icon: LuSettings, key: "settings", to: "/user/settings" },
];

// Citizen dashboard ko baya sidebar
const UserNavbar = () => {
  const { t } = useTranslation();
  const { userInfo } = useSelector((state) => state.auth);
  const { unreadCount = 0 } = useSelector((state) => state.notification);

  return (
    <div className="space-y-4 lg:sticky lg:top-28">
      {/* Profile */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#003893] to-[#0b1b3a] p-5 text-center text-white shadow-md">
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 80% 10%, #d9a441 0%, transparent 40%)" }}
        />

        <div className="relative">
          {userInfo?.avatar ? (
            <img
              src={userInfo.avatar}
              alt={userInfo?.name}
              referrerPolicy="no-referrer"
              className="mx-auto h-16 w-16 rounded-full border-2 border-[#d9a441] object-cover"
            />
          ) : (
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#d9a441] bg-white text-2xl font-bold text-[#003893]">
              {userInfo?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          )}

          <h3 className="mt-3 font-bold">{userInfo?.name}</h3>
          <p className="truncate text-xs text-slate-300">{userInfo?.email}</p>

          <span className="mt-3 inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-[#f0c66b]">
            {t("userDash.verified")}
          </span>
        </div>
      </div>

      {/* Links */}
      <nav className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        {sidebarLinks.map(({ icon: Icon, key, to, end }) => (
          <NavLink
            key={key}
            to={to}
            end={end}
            className={({ isActive }) =>
              `mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition last:mb-0 ${
                isActive
                  ? "bg-[#003893] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-[#003893]"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span className="flex-1">{t(`userDash.nav.${key}`)}</span>
            {key === "notifications" && unreadCount > 0 && (
              <span className="rounded-full bg-[#dc143c] px-2 py-0.5 text-[11px] font-bold text-white">{unreadCount}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Actions */}
      <div className="grid gap-2">
        <Link
          to="/complaint"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#d9a441] py-2.5 text-sm font-semibold text-[#10151c] transition hover:bg-[#c8932f]"
        >
          <LuSquarePen />
          {t("userDash.nav.newComplaint")}
        </Link>
        <Link
          to="/emergency"
          className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-[#dc143c] transition hover:bg-red-100"
        >
          <LuSiren />
          {t("userDash.nav.emergency")}
        </Link>
      </div>
    </div>
  );
};

export default UserNavbar;
