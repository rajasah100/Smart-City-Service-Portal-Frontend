import {
    LuBuilding2,
    LuCalendarDays,
    LuClipboardList,
    LuFileText,
    LuImage,
    LuLayoutDashboard,
    LuMail,
    LuMegaphone,
    LuSettings,
    LuShieldPlus,
    LuSiren,
    LuUsers,
} from "react-icons/lu";

// Admin sidebar: samuha anusar menu
export const ADMIN_MENU = [
    {
        group: "overview",
        items: [{ key: "dashboard", path: "/admin", icon: LuLayoutDashboard }],
    },
    {
        group: "services",
        items: [
            { key: "complaints", path: "/admin/complaints", icon: LuFileText },
            { key: "departments", path: "/admin/departments", icon: LuBuilding2 },
            { key: "emergency", path: "/admin/emergency-services", icon: LuShieldPlus },
            { key: "sos", path: "/admin/sos", icon: LuSiren },
        ],
    },
    {
        group: "content",
        items: [
            { key: "notices", path: "/admin/notices", icon: LuMegaphone },
            { key: "events", path: "/admin/events", icon: LuCalendarDays },
            { key: "registrations", path: "/admin/event-registrations", icon: LuClipboardList },
            { key: "homeContent", path: "/admin/home-content", icon: LuImage },
            { key: "messages", path: "/admin/messages", icon: LuMail },
        ],
    },
    {
        group: "system",
        items: [
            { key: "users", path: "/admin/users", icon: LuUsers },
            { key: "settings", path: "/admin/settings", icon: LuSettings },
        ],
    },
];
