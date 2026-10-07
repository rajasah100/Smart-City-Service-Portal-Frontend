import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import {
    FaAmbulance,
    FaCar,
    FaClinicMedical,
    FaCrosshairs,
    FaDirections,
    FaGripfire,
    FaHospital,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaPills,
    FaShieldAlt,
} from "react-icons/fa";
import { MdLocalPolice } from "react-icons/md";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import apiRequest from "../../../utils/apiRequest";
import SectionHeading from "./SectionHeading";
import { NATIONAL_NUMBER, normalizeServiceType } from "./serviceType";

const typeIcons = {
    hospital: FaHospital,
    clinic: FaClinicMedical,
    pharmacy: FaPills,
    ambulance: FaAmbulance,
    police: MdLocalPolice,
    traffic: FaCar,
    fire: FaGripfire,
    other: FaShieldAlt,
};

// Service nabhae Nepal ko bich
const NEPAL_CENTER = [28.2, 84.1];
// "Mero najik": pahile 5 km, thorai bhae 15 km
const RADIUS_STEPS = [5000, 15000];

const directionsUrl = ([lat, lng]) => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

// Duita bindu bich ko duri (km)
const distanceKm = ([lat1, lng1], [lat2, lng2]) => {
    const rad = (deg) => (deg * Math.PI) / 180;
    const a = Math.sin(rad(lat2 - lat1) / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lng2 - lng1) / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const userIcon = L.divIcon({
    className: "",
    html: '<span style="display:block;width:18px;height:18px;border-radius:9999px;background:#003893;border:3px solid #fff;box-shadow:0 0 0 6px rgba(0,56,147,.25)"></span>',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
});

// boundsKey ("lat,lng|lat,lng") badlida sabai dekhine gari zoom; chhaneko ma udne
const MapView = ({ boundsKey, selectedKey }) => {
    const map = useMap();

    useEffect(() => {
        if (!boundsKey) return;
        const points = boundsKey.split("|").map((pair) => pair.split(",").map(Number));
        if (points.length === 1) map.setView(points[0], 15);
        else map.fitBounds(points, { padding: [40, 40], maxZoom: 15 });
    }, [map, boundsKey]);

    useEffect(() => {
        if (selectedKey) map.flyTo(selectedKey.split(",").map(Number), 16, { duration: 0.6 });
    }, [map, selectedKey]);

    return null;
};

// API ko service lai list/map ko format ma badalne
const toMapService = (service) => ({
    id: service._id,
    name: service.name,
    type: normalizeServiceType(service.type),
    address: service.address,
    phone: service.phone,
    source: service.source || "saved",
    position: [service.location.coordinates[1], service.location.coordinates[0]],
});

const NearbyServices = () => {
    const { t, i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage === "en";
    const num = (n, digits = 0) => Number(n).toLocaleString(isEn ? "en-US" : "ne-NP", { maximumFractionDigits: digits });

    const [services, setServices] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [type, setType] = useState("all");
    const [selectedId, setSelectedId] = useState(null);
    // Mero najik: { pos, radius, osm: [], osmFailed }
    const [near, setNear] = useState(null);
    const [locating, setLocating] = useState(false);
    const [denied, setDenied] = useState(false);

    // Admin le rakheka (jaanchieka) sewa
    useEffect(() => {
        let ignore = false;

        apiRequest
            .get("/emergency-services")
            .then(({ data }) => {
                if (ignore) return;
                setServices((data.services || []).filter((service) => service.location?.coordinates?.length === 2).map(toMapService));
            })
            .catch(() => {
                // Offline: service worker ko cache bata aaucha; tyo pani nabhae khali
            })
            .finally(() => !ignore && setLoaded(true));

        return () => {
            ignore = true;
        };
    }, []);

    // Najik ka OSM sthaan: 5 km ma thorai bhae 15 km samma
    const loadOsm = async (pos) => {
        for (const radius of RADIUS_STEPS) {
            const { data } = await apiRequest.get("/emergency-services/osm-nearby", { params: { lat: pos[0], lng: pos[1], radius } });
            const osm = (data.services || []).map(toMapService);
            if (osm.length >= 10 || radius === RADIUS_STEPS[RADIUS_STEPS.length - 1]) return { osm, radius };
        }
        return { osm: [], radius: RADIUS_STEPS[0] };
    };

    const findNearMe = () => {
        if (!navigator.geolocation) {
            setDenied(true);
            return;
        }

        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                const pos = [coords.latitude, coords.longitude];
                setDenied(false);
                setSelectedId(null);
                setType("all");

                try {
                    const { osm, radius } = await loadOsm(pos);
                    setNear({ pos, radius, osm, osmFailed: false });
                } catch {
                    setNear({ pos, radius: RADIUS_STEPS[RADIUS_STEPS.length - 1], osm: [], osmFailed: true });
                } finally {
                    setLocating(false);
                }
            },
            () => {
                setLocating(false);
                setDenied(true);
            },
            { enableHighAccuracy: true, timeout: 15000 }
        );
    };

    // Mero najik bhae: radius bhitra ka saved + OSM (ekai thau ko OSM duplicate hataune), duri anusar
    const pool = useMemo(() => {
        if (!near) return services.map((service) => ({ ...service, km: null }));

        const km = near.radius / 1000;
        const saved = services
            .map((service) => ({ ...service, km: distanceKm(near.pos, service.position) }))
            .filter((service) => service.km <= km);
        const osm = near.osm
            .filter((place) => !saved.some((s) => s.type === place.type && distanceKm(s.position, place.position) < 0.15))
            .map((place) => ({ ...place, km: distanceKm(near.pos, place.position) }));

        return [...saved, ...osm].sort((a, b) => a.km - b.km);
    }, [services, near]);

    const types = useMemo(() => ["all", ...Object.keys(typeIcons).filter((key) => pool.some((s) => s.type === key))], [pool]);
    const visible = useMemo(() => pool.filter((service) => type === "all" || service.type === type), [pool, type]);

    // Mero najik: najikka 8 ota ra aafu dekhine gari, natra sabai
    const focusPoints = near ? [near.pos, ...visible.slice(0, 8).map((s) => s.position)] : visible.map((s) => s.position);
    const boundsKey = focusPoints.map((p) => p.join(",")).join("|");
    const selected = visible.find((service) => service.id === selectedId);

    const phoneFor = (service) => service.phone || NATIONAL_NUMBER[service.type] || "";

    return (
        <section id="nearby-services" className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <SectionHeading label={t("emergency.nearby.label")} title={t("emergency.nearby.title")} description={t("emergency.nearby.description")} />

                {/* Filter */}
                <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="-mx-6 overflow-x-auto px-6 lg:mx-0 lg:px-0">
                        <div className="flex min-w-max gap-2">
                            {types.map((value) => {
                                const Icon = typeIcons[value];
                                const count = value === "all" ? pool.length : pool.filter((s) => s.type === value).length;
                                return (
                                    <button
                                        key={value}
                                        type="button"
                                        aria-pressed={type === value}
                                        onClick={() => {
                                            setType(value);
                                            setSelectedId(null);
                                        }}
                                        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                                            type === value ? "bg-[#003893] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                        }`}
                                    >
                                        {Icon && <Icon />}
                                        {value === "all" ? t("emergency.nearby.all") : t(`emergency.nearby.types.${value}`)}
                                        <span className={`rounded-full px-1.5 text-xs ${type === value ? "bg-white/20" : "bg-white"}`}>{num(count)}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-col-reverse gap-2 sm:flex-row">
                        {near && (
                            <button
                                type="button"
                                onClick={() => {
                                    setNear(null);
                                    setType("all");
                                    setSelectedId(null);
                                }}
                                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                {t("emergency.nearby.showAll")}
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={findNearMe}
                            disabled={locating}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#dc143c] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#b51031] disabled:opacity-70"
                        >
                            {locating ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <FaCrosshairs />}
                            {locating ? t("emergency.nearby.searching") : t("emergency.nearby.nearMe")}
                        </button>
                    </div>
                </div>

                {denied && <p className="mb-4 text-sm text-amber-700">{t("emergency.nearby.denied")}</p>}
                {near && (
                    <div className="mb-4 space-y-1 text-sm">
                        <p className="font-semibold text-slate-700">
                            {t("emergency.nearby.found", { count: num(pool.length), km: num(near.radius / 1000) })} · {t("emergency.nearby.sorted")}
                        </p>
                        <p className={near.osmFailed ? "text-amber-700" : "text-slate-500"}>
                            {near.osmFailed ? t("emergency.nearby.osmFailed") : t("emergency.nearby.osmNote")}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
                    {/* List */}
                    <div className="space-y-3 lg:col-span-2 lg:max-h-150 lg:overflow-y-auto lg:pr-2">
                        {!loaded ? (
                            [1, 2, 3].map((item) => <div key={item} className="h-36 animate-pulse rounded-2xl bg-slate-100" />)
                        ) : visible.length === 0 ? (
                            <p className="rounded-2xl border border-dashed border-slate-300 py-12 text-center text-slate-500">{t("emergency.nearby.empty")}</p>
                        ) : (
                            visible.map((service) => {
                                const Icon = typeIcons[service.type] || typeIcons.other;
                                const isActive = selectedId === service.id;
                                const phone = phoneFor(service);

                                return (
                                    <div
                                        key={service.id}
                                        onClick={() => setSelectedId(service.id)}
                                        className={`cursor-pointer rounded-2xl border p-4 transition ${
                                            isActive ? "border-[#003893] bg-[#003893]/5 shadow-md" : "border-slate-200 bg-white hover:shadow-md"
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#dc143c]/10 text-lg text-[#dc143c]">
                                                <Icon />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3 className="font-semibold text-slate-900">{service.name}</h3>
                                                    {service.km !== null && (
                                                        <span className="shrink-0 rounded-full bg-[#003893]/10 px-2 py-0.5 text-xs font-semibold text-[#003893]">
                                                            {t("emergency.nearby.km", { km: num(service.km, service.km < 10 ? 1 : 0) })}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-1 flex flex-wrap gap-1.5 text-xs">
                                                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-600">{t(`emergency.nearby.types.${service.type}`)}</span>
                                                    {service.source === "osm" && (
                                                        <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-amber-700">{t("emergency.nearby.osmBadge")}</span>
                                                    )}
                                                </div>
                                                {service.address && (
                                                    <p className="mt-1.5 flex items-center gap-2 text-sm text-slate-500">
                                                        <FaMapMarkerAlt className="shrink-0 text-[#003893]" />
                                                        <span className="truncate">{service.address}</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-3 flex gap-2">
                                            {phone && (
                                                <a
                                                    href={`tel:${phone}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#dc143c] py-2.5 text-sm font-semibold text-white transition hover:bg-[#b51031]"
                                                >
                                                    <FaPhoneAlt />
                                                    {phone}
                                                </a>
                                            )}
                                            <a
                                                href={directionsUrl(service.position)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#003893] py-2.5 text-sm font-semibold text-[#003893] transition hover:bg-[#003893] hover:text-white"
                                            >
                                                <FaDirections />
                                                {t("emergency.nearby.directions")}
                                            </a>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Map */}
                    <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-lg lg:col-span-3">
                        <MapContainer center={NEPAL_CENTER} zoom={7} scrollWheelZoom={false} className="z-0 h-105 w-full lg:h-full lg:min-h-120">
                            <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <MapView boundsKey={boundsKey} selectedKey={selected ? selected.position.join(",") : ""} />

                            {near && (
                                <Marker position={near.pos} icon={userIcon}>
                                    <Popup>{t("emergency.nearby.you")}</Popup>
                                </Marker>
                            )}

                            {visible.map((service) => (
                                <Marker key={service.id} position={service.position} eventHandlers={{ click: () => setSelectedId(service.id) }}>
                                    <Popup>
                                        <div className="min-w-45 space-y-1">
                                            <h3 className="font-semibold">{service.name}</h3>
                                            <p className="text-sm text-gray-600">{t(`emergency.nearby.types.${service.type}`)}</p>
                                            {phoneFor(service) && <a href={`tel:${phoneFor(service)}`} className="block font-semibold">{phoneFor(service)}</a>}
                                            <a href={directionsUrl(service.position)} target="_blank" rel="noopener noreferrer">
                                                {t("emergency.nearby.getDirections")}
                                            </a>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NearbyServices;
