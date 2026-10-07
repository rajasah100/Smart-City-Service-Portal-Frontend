// Emergency service ko type lai ekai dhaanchama: purano import gareko data ma
// "Hospital", "Fire Station", "Water Supply" jasta naam chhan; OSM bata clinic/pharmacy pani aauchha
export const normalizeServiceType = (type = "") => {
    const value = String(type).toLowerCase();

    if (value.includes("pharmacy")) return "pharmacy";
    if (value.includes("clinic") || value.includes("health post") || value.includes("health centre")) return "clinic";
    if (value.includes("hospital") || value.includes("health")) return "hospital";
    if (value.includes("ambulance")) return "ambulance";
    if (value.includes("traffic")) return "traffic";
    if (value.includes("police")) return "police";
    if (value.includes("fire")) return "fire";

    return "other";
};

// Phone nabhae ko bela: type anusar rastriya aapatkalin number (pharmacy ma chhaina)
export const NATIONAL_NUMBER = {
    hospital: "102",
    clinic: "102",
    ambulance: "102",
    police: "100",
    traffic: "103",
    fire: "101",
};
