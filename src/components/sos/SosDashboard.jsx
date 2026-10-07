import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import L from "leaflet";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import { FaDirections, FaPhoneAlt, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { MdSos } from "react-icons/md";
import { formatBS } from "../../utils/nepaliDate";

const POLL_MS = 10000;
// SOS nabhae Nepal ko bich
const NEPAL_CENTER = [28.2, 84.1];

const STATUS_STYLES = {
    active: { badge: "bg-red-100 text-red-700", color: "#dc2626" },
    responding: { badge: "bg-amber-100 text-amber-700", color: "#d97706" },
    resolved: { badge: "bg-green-100 text-green-700", color: "#16a34a" },
    cancelled: { badge: "bg-slate-100 text-slate-600", color: "#64748b" },
};

// active -> "waiting" text key
const STATUS_KEY = { active: "waiting", responding: "responding", resolved: "resolved", cancelled: "cancelled" };

const markerIcon = (status, isSelected) =>
    L.divIcon({
        className: "",
        html: `<span style="display:block;width:${isSelected ? 22 : 16}px;height:${isSelected ? 22 : 16}px;border-radius:9999px;background:${STATUS_STYLES[status]?.color || "#dc2626"};border:3px solid #fff;box-shadow:0 0 0 4px ${STATUS_STYLES[status]?.color || "#dc2626"}55"></span>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
    });

const toLatLng = (point) => [point.latitude, point.longitude];

// Naya SOS aauda sano beep awaj
const playAlertSound = () => {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();

        [0, 0.3, 0.6].forEach((offset) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.frequency.value = 880;
            gain.gain.value = 0.15;
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + offset);
            osc.stop(ctx.currentTime + offset + 0.18);
        });
    } catch {
        // Browser le awaj block garyo
    }
};

// Pahilo choti sabai SOS dekhine gari, chhaneko SOS ma udera
const MapFocus = ({ boundsKey, selected }) => {
    const map = useMap();
    const fittedRef = useRef(false);

    useEffect(() => {
        if (!boundsKey || fittedRef.current) return;
        fittedRef.current = true;
        const points = boundsKey.split("|").map((pair) => pair.split(",").map(Number));
        if (points.length === 1) map.setView(points[0], 15);
        else map.fitBounds(points, { padding: [40, 40], maxZoom: 15 });
    }, [map, boundsKey]);

    useEffect(() => {
        if (selected) map.flyTo(selected.split(",").map(Number), 16, { duration: 0.8 });
    }, [map, selected]);

    return null;
};

// api = axios instance (department wa admin ko token sahit). embedded: department layout ma (shirshak navbar mai)
const SosDashboard = ({ api, embedded = false }) => {
    const { t, i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage === "en";
    const num = (n) => Number(n).toLocaleString(isEn ? "en-US" : "ne-NP");
    const s = (key, options) => t(`deptDash.sos.${key}`, options);
    const typeLabel = (type) => t(`emergency.sos.types.${type}`, { defaultValue: type });
    const when = (date) =>
        date
            ? `${formatBS(date, isEn, "MMMM DD")}, ${new Date(date).toLocaleTimeString(isEn ? "en-US" : "ne-NP", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" })}`
            : "-";

    const [view, setView] = useState("open");
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    const [soundOn, setSoundOn] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const knownIdsRef = useRef(null);
    const soundOnRef = useRef(soundOn);
    // Toast ko text taja bhasha ma (callback badlina nadina ref)
    const tRef = useRef(t);

    useEffect(() => {
        soundOnRef.current = soundOn;
        tRef.current = t;
    }, [soundOn, t]);

    // Pahilo load pachi aayeko naya SOS ma awaj ra toast
    const announceNew = useCallback((list) => {
        const ids = new Set(list.map((alert) => alert._id));

        if (knownIdsRef.current) {
            const newAlerts = list.filter((alert) => !knownIdsRef.current.has(alert._id));

            if (newAlerts.length > 0) {
                const translate = tRef.current;
                if (soundOnRef.current) playAlertSound();
                toast.error(
                    translate("deptDash.sos.newSos", {
                        name: newAlerts[0].user?.name || translate("deptDash.sos.citizen"),
                        type: translate(`emergency.sos.types.${newAlerts[0].type}`, { defaultValue: newAlerts[0].type }),
                    })
                );
            }
        }

        knownIdsRef.current = ids;
    }, []);

    const fetchAlerts = useCallback(
        () =>
            api
                .get("/sos", { params: { status: view } })
                .then(({ data }) => {
                    if (view === "open") announceNew(data.alerts);
                    setAlerts(data.alerts);
                })
                .catch((error) => {
                    if (error.response?.status === 401 || error.response?.status === 403) {
                        toast.error(tRef.current("deptDash.sos.sessionExpired"));
                    }
                })
                .finally(() => setLoading(false)),
        [api, view, announceNew]
    );

    // Open SOS har 10 second ma refresh garne
    useEffect(() => {
        const first = setTimeout(fetchAlerts, 0);
        const timer = view === "open" ? setInterval(fetchAlerts, POLL_MS) : null;

        return () => {
            clearTimeout(first);
            if (timer) clearInterval(timer);
        };
    }, [fetchAlerts, view]);

    const selected = useMemo(() => alerts.find((alert) => alert._id === selectedId) || null, [alerts, selectedId]);

    const updateStatus = async (alert, status) => {
        let note = "";

        if (status === "resolved") {
            const input = window.prompt(s("notePrompt"), "");
            if (input === null) return;
            note = input.trim();
        }

        setUpdatingId(alert._id);

        try {
            await api.put(`/sos/${alert._id}/status`, { status, note });
            toast.success(status === "responding" ? s("respondingDone") : s("resolvedDone"));
            fetchAlerts();
        } catch (error) {
            toast.error(error.response?.data?.message || s("updateFailed"));
        } finally {
            setUpdatingId(null);
        }
    };

    const waitingCount = alerts.filter((alert) => alert.status === "active").length;
    const respondingCount = alerts.filter((alert) => alert.status === "responding").length;
    const boundsKey = alerts.map((alert) => `${alert.location.latitude},${alert.location.longitude}`).join("|");
    const selectedKey = selected ? `${selected.location.latitude},${selected.location.longitude}` : "";

    return (
        <div className={embedded ? "space-y-5" : "space-y-6"}>
            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {embedded ? (
                    <p className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                        </span>
                        {s("live")}
                    </p>
                ) : (
                    <div>
                        <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-800 sm:text-3xl">
                            <MdSos className="text-red-600" />
                            {t("deptDash.titles.sos.title")}
                        </h1>
                        <p className="mt-1 text-slate-500">
                            {t("deptDash.titles.sos.text")} · {s("live")}
                        </p>
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                    {view === "open" && (
                        <>
                            <div className="rounded-xl border border-red-100 bg-white px-5 py-2.5 shadow-sm">
                                <p className="text-xs text-slate-500">{s("waiting")}</p>
                                <p className="text-2xl font-bold text-red-600">{num(waitingCount)}</p>
                            </div>
                            <div className="rounded-xl border border-amber-100 bg-white px-5 py-2.5 shadow-sm">
                                <p className="text-xs text-slate-500">{s("responding")}</p>
                                <p className="text-2xl font-bold text-amber-600">{num(respondingCount)}</p>
                            </div>
                        </>
                    )}

                    <button
                        type="button"
                        onClick={() => setSoundOn((value) => !value)}
                        className="rounded-xl border bg-white p-3 text-slate-600 shadow-sm hover:bg-slate-50"
                        title={soundOn ? s("mute") : s("unmute")}
                        aria-label={soundOn ? s("mute") : s("unmute")}
                    >
                        {soundOn ? <FaVolumeUp /> : <FaVolumeMute />}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div role="tablist" className="flex gap-2">
                {["open", "closed"].map((value) => (
                    <button
                        key={value}
                        type="button"
                        role="tab"
                        aria-selected={view === value}
                        onClick={() => {
                            if (value === view) return;
                            setLoading(true);
                            setAlerts([]);
                            setView(value);
                            setSelectedId(null);
                        }}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                            view === value ? "bg-[#003893] text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:text-[#003893]"
                        }`}
                    >
                        {value === "open" ? s("open") : s("history")}
                    </button>
                ))}
            </div>

            <div className="grid gap-5 xl:grid-cols-12">
                {/* List */}
                <div className="space-y-3 xl:col-span-5 xl:max-h-[70vh] xl:overflow-y-auto xl:pr-1">
                    {loading ? (
                        [1, 2].map((item) => <div key={item} className="h-32 animate-pulse rounded-2xl bg-white" />)
                    ) : alerts.length === 0 ? (
                        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center">
                            <MdSos className="text-5xl text-slate-300" />
                            <p className="mt-2 text-sm text-slate-500">{view === "open" ? s("emptyOpen") : s("emptyHistory")}</p>
                        </div>
                    ) : (
                        alerts.map((alert) => {
                            const style = STATUS_STYLES[alert.status];
                            const isSelected = alert._id === selectedId;
                            const phone = alert.phone || alert.user?.phone;

                            return (
                                <div
                                    key={alert._id}
                                    onClick={() => setSelectedId(alert._id)}
                                    className={`cursor-pointer rounded-2xl border bg-white p-4 shadow-sm transition ${
                                        isSelected ? "border-[#003893] ring-2 ring-[#003893]/20" : "border-slate-200 hover:shadow-md"
                                    } ${alert.status === "active" ? "border-l-4 border-l-red-500" : ""}`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="truncate font-semibold text-slate-900">{alert.user?.name || s("citizen")}</p>
                                            <p className="text-sm text-slate-500">
                                                {typeLabel(alert.type)} · {s("sent", { time: when(alert.createdAt) })}
                                            </p>
                                        </div>
                                        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${style?.badge}`}>{s(STATUS_KEY[alert.status])}</span>
                                    </div>

                                    {alert.message && <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">“{alert.message}”</p>}

                                    <p className="mt-2 text-xs text-slate-400">
                                        {s("lastLocation", { time: when(alert.location?.at) })}
                                        {alert.location?.accuracy ? ` · ${s("accuracy", { meters: num(alert.location.accuracy) })}` : ""}
                                        {alert.responderName ? ` · ${alert.responderName}` : ""}
                                    </p>

                                    {alert.responseNote && <p className="mt-1 text-xs text-slate-500">{s("note", { note: alert.responseNote })}</p>}

                                    <div className="mt-3 flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                                        {phone && (
                                            <a href={`tel:${phone}`} className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700">
                                                <FaPhoneAlt />
                                                {phone}
                                            </a>
                                        )}

                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${alert.location.latitude},${alert.location.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 rounded-lg border border-[#003893]/30 px-3 py-1.5 text-xs font-semibold text-[#003893] hover:bg-[#003893]/5"
                                        >
                                            <FaDirections />
                                            {s("directions")}
                                        </a>

                                        {alert.status === "active" && (
                                            <button
                                                type="button"
                                                onClick={() => updateStatus(alert, "responding")}
                                                disabled={updatingId === alert._id}
                                                className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-60"
                                            >
                                                {s("respond")}
                                            </button>
                                        )}

                                        {(alert.status === "active" || alert.status === "responding") && (
                                            <button
                                                type="button"
                                                onClick={() => updateStatus(alert, "resolved")}
                                                disabled={updatingId === alert._id}
                                                className="rounded-lg bg-[#003893] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#002a6e] disabled:opacity-60"
                                            >
                                                {s("resolve")}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Map */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-7">
                    <MapContainer center={NEPAL_CENTER} zoom={7} className="z-0 h-[60vh] w-full xl:h-[70vh]">
                        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <MapFocus boundsKey={boundsKey} selected={selectedKey} />

                        {/* Select gareko SOS ko hideko bato */}
                        {selected?.path?.length > 1 && (
                            <Polyline positions={selected.path.map(toLatLng)} pathOptions={{ color: "#003893", weight: 4, opacity: 0.7 }} />
                        )}

                        {alerts.map((alert) => (
                            <Marker
                                key={alert._id}
                                position={toLatLng(alert.location)}
                                icon={markerIcon(alert.status, alert._id === selectedId)}
                                eventHandlers={{ click: () => setSelectedId(alert._id) }}
                            >
                                <Popup>
                                    <b>{alert.user?.name || s("citizen")}</b>
                                    <br />
                                    {typeLabel(alert.type)} · {s(STATUS_KEY[alert.status])}
                                    <br />
                                    {s("lastLocation", { time: when(alert.location?.at) })}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default SosDashboard;
