import { LuBell, LuBuilding2, LuFileText, LuLayoutDashboard, LuMapPinned, LuSiren } from "react-icons/lu";

// Sidebar menu ra navbar ko shirshak ekai thau bata
export const DEPT_MENU = [
    { key: "dashboard", titleKey: "home", path: "/department", icon: LuLayoutDashboard },
    { key: "complaints", titleKey: "complaints", path: "/department/complaints", icon: LuFileText },
    { key: "map", titleKey: "map", path: "/department/location", icon: LuMapPinned },
    { key: "sos", titleKey: "sos", path: "/department/sos", icon: LuSiren },
    { key: "notices", titleKey: "notices", path: "/department/notices", icon: LuBell },
    { key: "profile", titleKey: "profile", path: "/department/profile", icon: LuBuilding2 },
];

// Hal ko URL ko menu (navbar ko shirshak ko lagi)
export const currentMenu = (pathname) =>
    [...DEPT_MENU].reverse().find((item) => pathname === item.path || pathname.startsWith(`${item.path}/`)) || DEPT_MENU[0];
