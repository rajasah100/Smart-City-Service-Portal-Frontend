import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FaCheckCircle, FaCrosshairs, FaExclamationCircle, FaExclamationTriangle, FaHome, FaMapMarkerAlt } from "react-icons/fa";
import { nepalLocations } from "../../data/nepalLocation";
import LocationMap from "./LocationMap";
import { reverseGeocode, searchPlace } from "./reverseGeocode";

const selectClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#003893] focus:ring-2 focus:ring-[#003893]/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

const Select = ({ id, label, value, onChange, options, disabled, placeholder }) => (
    <div>
        <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-700">
            {label} <span className="text-[#dc143c]">*</span>
        </label>
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} className={selectClass}>
            <option value="">{placeholder}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
    </div>
);

// Step 2: naksa pahile (GPS / click / drag), tyaspachhi thegana (naksa bata aafai bharincha)
const LocationStep = ({ data, updateField }) => {
    const { t, i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage === "en";
    const num = (n) => n.toLocaleString(isEn ? "en-US" : "ne-NP");

    const [locating, setLocating] = useState(false);
    const [geoStatus, setGeoStatus] = useState("idle"); // idle | filling | filled | outside
    const [focus, setFocus] = useState(null);
    const abortRef = useRef(null);
    const searchRef = useRef(null);

    useEffect(() => () => {
        abortRef.current?.abort();
        searchRef.current?.abort();
    }, []);

    // Dropdown bata thau chhanda naksa tyaha laijane (pin chai manche aafai lagaune)
    const focusPlace = async (query, zoom) => {
        searchRef.current?.abort();
        const controller = new AbortController();
        searchRef.current = controller;

        try {
            const center = await searchPlace(`${query}, Nepal`, controller.signal);
            if (center && !controller.signal.aborted) setFocus({ center, zoom });
        } catch {
            // Naksa nasare pani form chalcha
        }
    };

    // "Pokhara Metropolitan City" -> "Pokhara" (OSM ma khojna)
    const shortName = (name) => name.replace(/ (Rural |Sub-)?(Metropolitan City|Municipality)$/, "");

    // Dropdown haru sidhai form data bata (pahile local state le gardaa pachhadi farkida reset hunthyo)
    const province = nepalLocations.find((item) => item.province === data.province);
    const districts = province?.districts || [];
    const district = districts.find((item) => item.name === data.district);
    const municipalities = district?.municipalities || [];
    const municipality = municipalities.find((item) => item.name === data.municipality);
    const wards = municipality?.wards || [];

    // Value English (save hune), label bhasha anusar, kram pani tehi bhasha ko
    const toOptions = (items, valueKey, neKey) =>
        items
            .map((item) => ({ value: item[valueKey], label: isEn ? item[valueKey] : item[neKey] }))
            .sort((a, b) => a.label.localeCompare(b.label, isEn ? "en" : "ne"));

    const position = data.latitude && data.longitude ? [Number(data.latitude), Number(data.longitude)] : null;

    const fillAddress = async (lat, lng) => {
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;
        setGeoStatus("filling");

        try {
            const found = await reverseGeocode(lat, lng, controller.signal);
            if (controller.signal.aborted) return;

            if (!found) {
                updateField("pinMunicipality", "");
                setGeoStatus("outside");
                return;
            }

            // Pin kun palika ma parchha (pachhi dropdown badlida mel nakhae chetawani dina)
            updateField("pinMunicipality", found.municipality);

            updateField("province", found.province);
            updateField("district", found.district);
            updateField("municipality", found.municipality);
            // OSM le wada diyo bhane tyo, natra palika badliyo bhane khali
            if (found.ward) updateField("ward", found.ward);
            else if (found.municipality !== data.municipality) updateField("ward", "");
            // Naksa le bhareko tol matra badalne (manche le aafai lekheko tol nachhune)
            if (!data.tole.trim() || data.tole === data.autoTole) {
                updateField("autoTole", found.tole);
                updateField("tole", found.tole);
            }

            setGeoStatus("filled");
        } catch {
            // Internet chaina wa Nominatim le fail garyo: thegana aafai chhanna milcha
            if (!controller.signal.aborted) setGeoStatus("idle");
        }
    };

    const pin = ([lat, lng]) => {
        updateField("latitude", lat);
        updateField("longitude", lng);
        fillAddress(lat, lng);
    };

    const useMyLocation = () => {
        if (!navigator.geolocation) {
            toast.error(t("complaintForm.location.geoUnsupported"));
            return;
        }

        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                setLocating(false);
                pin([coords.latitude, coords.longitude]);
            },
            () => {
                setLocating(false);
                toast.error(t("complaintForm.location.geoDenied"));
            },
            { enableHighAccuracy: true, timeout: 15000 }
        );
    };

    const status = {
        filling: { icon: null, className: "border-[#003893]/20 bg-[#003893]/5 text-[#003893]", text: t("complaintForm.location.filling") },
        filled: { icon: FaCheckCircle, className: "border-green-200 bg-green-50 text-green-800", text: t("complaintForm.location.autoFilled") },
        outside: { icon: FaExclamationCircle, className: "border-amber-200 bg-amber-50 text-amber-800", text: t("complaintForm.location.notCovered") },
    }[geoStatus];

    // Pin ek palika ma, dropdown arkai palika
    const mismatch = Boolean(position && data.pinMunicipality && data.municipality && data.pinMunicipality !== data.municipality);

    return (
        <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">{t("complaintForm.location.title")}</h2>
                    <p className="mt-1 max-w-xl text-sm text-slate-500">{t("complaintForm.location.text")}</p>
                </div>

                <button
                    type="button"
                    onClick={useMyLocation}
                    disabled={locating}
                    className="flex items-center gap-2 rounded-xl bg-[#003893] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#002a6e] disabled:opacity-70"
                >
                    {locating ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                        <FaCrosshairs />
                    )}
                    {locating ? t("complaintForm.location.locating") : t("complaintForm.location.useMy")}
                </button>
            </div>

            {/* Naksa */}
            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                <LocationMap position={position} focus={focus} onChange={pin} />

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 px-4 py-2.5 text-xs">
                    <span className="text-slate-500">{t("complaintForm.location.mapHint")}</span>
                    {position ? (
                        <span className="flex items-center gap-1.5 font-medium text-green-700">
                            <FaMapMarkerAlt />
                            {t("complaintForm.location.pinned")}: {num(Number(position[0].toFixed(5)))}, {num(Number(position[1].toFixed(5)))}
                        </span>
                    ) : (
                        <span className="flex items-center gap-1.5 font-medium text-amber-600">
                            <FaMapMarkerAlt />
                            {t("complaintForm.location.notPinned")}
                        </span>
                    )}
                </div>
            </div>

            {status && (
                <p className={`animate-fade-up mt-4 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${status.className}`}>
                    {status.icon ? (
                        <status.icon className="shrink-0" />
                    ) : (
                        <span className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    )}
                    {status.text}
                </p>
            )}

            {mismatch && (
                <p role="alert" className="animate-fade-up mt-4 flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    <FaExclamationTriangle className="mt-0.5 shrink-0 text-amber-600" />
                    {t("complaintForm.location.mismatch")}
                </p>
            )}

            {/* Thegana */}
            <h3 className="mt-6 text-sm font-bold uppercase tracking-wide text-slate-500">{t("complaintForm.location.addressTitle")}</h3>

            <div className="mt-3 grid gap-5 sm:grid-cols-2">
                <Select
                    id="province"
                    label={t("complaintForm.location.province")}
                    value={data.province}
                    placeholder={t("complaintForm.location.select")}
                    options={nepalLocations.map((item) => ({ value: item.province, label: isEn ? item.province : item.provinceNe }))}
                    onChange={(value) => {
                        updateField("province", value);
                        updateField("district", "");
                        updateField("municipality", "");
                        updateField("ward", "");
                        if (value) focusPlace(value, 8);
                    }}
                />

                <Select
                    id="district"
                    label={t("complaintForm.location.district")}
                    value={data.district}
                    placeholder={t("complaintForm.location.select")}
                    options={toOptions(districts, "name", "nameNe")}
                    disabled={!province}
                    onChange={(value) => {
                        updateField("district", value);
                        updateField("municipality", "");
                        updateField("ward", "");
                        if (value) focusPlace(`${value} District`, 11);
                    }}
                />

                <Select
                    id="municipality"
                    label={t("complaintForm.location.municipality")}
                    value={data.municipality}
                    placeholder={t("complaintForm.location.select")}
                    options={toOptions(municipalities, "name", "nameNe")}
                    disabled={!district}
                    onChange={(value) => {
                        updateField("municipality", value);
                        updateField("ward", "");
                        if (data.tole && data.tole === data.autoTole) updateField("tole", "");
                        if (value) focusPlace(`${shortName(value)}, ${data.district}`, 14);
                    }}
                />

                <div>
                    <label htmlFor="ward" className="mb-1.5 block text-sm font-semibold text-slate-700">
                        {t("complaintForm.location.ward")} <span className="text-[#dc143c]">*</span>
                    </label>
                    <select
                        id="ward"
                        value={data.ward}
                        onChange={(e) => updateField("ward", e.target.value)}
                        disabled={!municipality}
                        className={selectClass}
                    >
                        <option value="">{t("complaintForm.location.select")}</option>
                        {wards.map((ward) => (
                            <option key={ward} value={ward}>{num(ward)}</option>
                        ))}
                    </select>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="tole" className="mb-1.5 block text-sm font-semibold text-slate-700">
                        {t("complaintForm.location.tole")} <span className="text-[#dc143c]">*</span>
                    </label>
                    <div className="relative">
                        <FaHome className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            id="tole"
                            type="text"
                            value={data.tole}
                            onChange={(e) => updateField("tole", e.target.value)}
                            placeholder={t("complaintForm.location.tolePlaceholder")}
                            className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#003893] focus:ring-2 focus:ring-[#003893]/20"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationStep;
