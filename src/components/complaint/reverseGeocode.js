import { nepalLocations } from "../../data/nepalLocation";

// OSM ma kehi jilla ko arkai hijje
const DISTRICT_ALIASES = {
    Kavrepalanchok: ["kabhrepalanchok", "kavre"],
    Chitwan: ["chitawan"],
    Makwanpur: ["makawanpur"],
    Tanahun: ["tanahu"],
    Kapilvastu: ["kapilbastu"],
    Nawalpur: ["nawalparasi east", "nawalparasi (bardaghat susta east)"],
    Parasi: ["nawalparasi west", "nawalparasi (bardaghat susta west)"],
    Sindhupalchok: ["sindhupalchowk"],
    Ramechhap: ["ramechap"],
    Dhanusha: ["dhanusa"],
    Panchthar: ["pachthar"],
    Terhathum: ["tehrathum"],
    Achham: ["acham"],
    Parbat: ["parwat"],
    "Rukum East": ["eastern rukum"],
    "Rukum West": ["western rukum"],
};

const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Pura shabda matra milaune ("dang" le "dangihat" sanga milnu hudaina)
const hasWord = (haystack, word) => new RegExp(`(^|[^a-z])${escape(word.toLowerCase())}([^a-z]|$)`).test(haystack);

// "Madhyapur Thimi Municipality" -> "madhyapur thimi"
const baseName = (name) =>
    name
        .toLowerCase()
        .replace(/\b(sub-)?metropolitan city\b|\brural municipality\b|\bmunicipality\b/g, "")
        .trim();

// Lamo naam pahile (jastai "Rukum East" "Rukum" bhanda pahile)
const DISTRICTS = nepalLocations
    .flatMap((province) => province.districts.map((district) => ({ province, district })))
    .sort((a, b) => b.district.name.length - a.district.name.length);

// Lat/lng bata OSM (Nominatim) ko thegana ligera hamro list ko province/district/municipality khojne.
// Nepal bahira bhae null
export const reverseGeocode = async (lat, lng, signal) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=18&accept-language=en&lat=${lat}&lon=${lng}`;
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error("reverse geocode failed");

    const { address = {}, display_name: displayName = "" } = await response.json();
    if (address.country_code && address.country_code !== "np") return null;

    const haystack = `${Object.values(address).join(", ")}, ${displayName}`.toLowerCase();
    const tole = address.road || address.neighbourhood || address.quarter || address.suburb || address.hamlet || "";

    const match = DISTRICTS.find(({ district }) =>
        [district.name, ...(DISTRICT_ALIASES[district.name] || [])].some((name) => hasWord(haystack, name))
    );
    if (!match) return null;

    const municipalities = [...match.district.municipalities].sort((a, b) => baseName(b.name).length - baseName(a.name).length);

    // Pahile OSM ko palika field haru (janakpur ~ janakpurdham), napaye pura thegana ma khojne
    const fields = [address.municipality, address.city, address.town, address.village, address.city_district]
        .filter(Boolean)
        .map((field) => baseName(field).replace(/-\d+$/, ""));

    const municipality =
        fields
            .map((field) =>
                municipalities.find((item) => {
                    const name = baseName(item.name);
                    return name === field || name.startsWith(field) || field.startsWith(name);
                })
            )
            .find(Boolean) ||
        municipalities.find((item) => hasWord(haystack, baseName(item.name)) || hasWord(haystack, baseName(item.name).replace(/[- ]/g, "")));

    // "Kirtipur-10" jasto bhae wada pani
    const wardNumber = Number((address.city_district || address.suburb || "").match(/-(\d{1,2})$/)?.[1]);
    const ward = municipality?.wards.includes(wardNumber) ? String(wardNumber) : "";

    return {
        province: match.province.province,
        district: match.district.name,
        municipality: municipality?.name || "",
        ward,
        tole,
    };
};

// Thau ko naam bata naksa ko kendra (dropdown chhanda naksa tyaha laijana). Napaye null
export const searchPlace = async (query, signal) => {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=np&q=${encodeURIComponent(query)}`;
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error("search failed");

    const [first] = await response.json();
    return first ? [Number(first.lat), Number(first.lon)] : null;
};
