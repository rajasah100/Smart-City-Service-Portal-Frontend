import { FaBolt, FaBuilding, FaBus, FaRoad, FaTint, FaTrashAlt } from "react-icons/fa";

// Department ko naam herera kun kisim ho (icon ra samanya samasya chip ko lagi)
export const departmentKind = (name = "") => {
    const lower = name.toLowerCase();

    if (lower.includes("water") || lower.includes("खानेपानी")) return "water";
    if (lower.includes("electric") || lower.includes("बिजुली")) return "electricity";
    if (lower.includes("road") || lower.includes("सडक")) return "road";
    if (lower.includes("waste") || lower.includes("फोहोर")) return "waste";
    if (lower.includes("transport") || lower.includes("यातायात")) return "transport";

    return "other";
};

const ICONS = {
    water: FaTint,
    electricity: FaBolt,
    road: FaRoad,
    waste: FaTrashAlt,
    transport: FaBus,
    other: FaBuilding,
};

export const departmentIcon = (name) => ICONS[departmentKind(name)];
