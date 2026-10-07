import { localizePlace, nepalLocations } from "../../data/nepalLocation";

export const STATUSES = ["pending", "assigned", "in-progress", "resolved", "rejected"];

// Status ko rang (badge, dot, chart)
export const STATUS_STYLE = {
    pending: { badge: "bg-amber-100 text-amber-800 ring-amber-200", dot: "bg-amber-500", color: "#f59e0b" },
    assigned: { badge: "bg-sky-100 text-sky-800 ring-sky-200", dot: "bg-sky-500", color: "#0ea5e9" },
    "in-progress": { badge: "bg-indigo-100 text-indigo-800 ring-indigo-200", dot: "bg-indigo-500", color: "#6366f1" },
    resolved: { badge: "bg-green-100 text-green-800 ring-green-200", dot: "bg-green-600", color: "#16a34a" },
    rejected: { badge: "bg-red-100 text-red-800 ring-red-200", dot: "bg-red-600", color: "#dc2626" },
};

export const PRIORITY_STYLE = {
    low: { badge: "bg-slate-100 text-slate-700", color: "#94a3b8" },
    medium: { badge: "bg-amber-100 text-amber-800", color: "#f59e0b" },
    high: { badge: "bg-red-100 text-[#dc143c]", color: "#dc143c" },
};

export const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

// "Pokhara Metropolitan City" -> "Pokhara"
export const shortMunicipality = (name = "") => name.replace(/ (Rural |Sub-)?(Metropolitan City|Municipality)$/, "");

// Department ko sewa kshetra lai bhasha anusar ek line ma
export const serviceAreaText = (area, t, isEn) => {
    if (!area?.province) return t("deptDash.area.all");

    const place = localizePlace({ province: area.province, district: area.district }, isEn);
    if (!area.district) return t("deptDash.area.province", { province: place.province });
    if (!area.municipalities?.length) return t("deptDash.area.district", { district: place.district });

    const list = area.municipalities
        .map((name) => (isEn ? shortMunicipality(name) : localizePlace({ ...area, municipality: name }, false).municipality))
        .join(", ");
    return t("deptDash.area.municipalities", { district: place.district, list });
};

// Gunaso kati din dekhi (aaja = 0)
export const daysSince = (date) => Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 86400000));

// Thau ek line ma: "Urlabari-3, Morang" (num: wada lai Nepali ank ma)
export const placeLine = (location = {}, isEn, num = String) => {
    const place = localizePlace(location, isEn);
    const municipality = isEn ? shortMunicipality(location.municipality || "") : place.municipality;
    return [location.tole, municipality && `${municipality}${location.ward ? `-${num(location.ward)}` : ""}`, place.district]
        .filter(Boolean)
        .join(", ");
};

// "Water Supply Department" -> "WS"
export const initials = (name = "") =>
    name.split(" ").filter(Boolean).map((word) => word[0]).join("").slice(0, 2).toUpperCase() || "DP";

// Naksa ma dekhauna milne lat/lng chha ki
export const hasLocation = (complaint) => {
    const lat = Number(complaint.location?.latitude);
    const lng = Number(complaint.location?.longitude);
    return Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0);
};

// Sthaniya taha ko naam matra bata Nepali naam (notice ma pradesh/jilla hudaina)
const MUNICIPALITY_NE = new Map(
    nepalLocations.flatMap((p) => p.districts.flatMap((d) => d.municipalities.map((m) => [m.name, m.nameNe])))
);
export const municipalityLabel = (name, isEn) => (isEn ? name : MUNICIPALITY_NE.get(name) || name);
