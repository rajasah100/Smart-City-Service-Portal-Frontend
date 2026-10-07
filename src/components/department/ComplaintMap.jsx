import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { STATUS_STYLE, hasLocation, placeLine } from "./deptUtils";

// Default: Koshi/Nepal ko bich (gunaso nabhae)
const NEPAL_CENTER = [28.2, 84.1];

const pinIcon = (color, active) =>
    L.divIcon({
        className: "",
        html: `<span style="display:block;width:${active ? 26 : 20}px;height:${active ? 26 : 20}px;border-radius:9999px;background:${color};border:3px solid #fff;box-shadow:0 1px 6px rgba(0,0,0,.45)"></span>`,
        iconSize: active ? [26, 26] : [20, 20],
        iconAnchor: active ? [13, 13] : [10, 10],
        popupAnchor: [0, -12],
    });

// Sabai gunaso dekhine gari zoom, chhaneko gunaso ma udera jane
// boundsKey: "lat,lng|lat,lng" (array ko satta string: point nabadlie pheri zoom nahos)
function FitAndFly({ boundsKey, selected }) {
    const map = useMap();

    useEffect(() => {
        if (!boundsKey) return;
        const points = boundsKey.split("|").map((pair) => pair.split(",").map(Number));
        if (points.length === 1) map.setView(points[0], 15);
        else map.fitBounds(points, { padding: [40, 40], maxZoom: 15 });
    }, [map, boundsKey]);

    useEffect(() => {
        if (selected) map.flyTo(selected.split(",").map(Number), 17, { duration: 1 });
    }, [map, selected]);

    return null;
}

const ComplaintMap = ({ complaints, selectedId, onSelect }) => {
    const { t, i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage === "en";
    const num = (n) => Number(n).toLocaleString(isEn ? "en-US" : "ne-NP");

    const mapped = useMemo(() => complaints.filter(hasLocation), [complaints]);
    const boundsKey = mapped.map((c) => `${Number(c.location.latitude)},${Number(c.location.longitude)}`).join("|");
    const selected = mapped.find((c) => c._id === selectedId);
    const selectedPoint = selected ? `${Number(selected.location.latitude)},${Number(selected.location.longitude)}` : "";

    return (
        <MapContainer center={NEPAL_CENTER} zoom={7} scrollWheelZoom className="z-0 h-full min-h-105 w-full">
            <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <FitAndFly boundsKey={boundsKey} selected={selectedPoint} />

            {mapped.map((complaint) => {
                const lat = Number(complaint.location.latitude);
                const lng = Number(complaint.location.longitude);
                return (
                    <Marker
                        key={complaint._id}
                        position={[lat, lng]}
                        icon={pinIcon(STATUS_STYLE[complaint.status]?.color || "#003893", complaint._id === selectedId)}
                        eventHandlers={{ click: () => onSelect(complaint._id) }}
                    >
                        <Popup>
                            <div className="w-60 space-y-1.5">
                                <p className="font-mono text-xs text-slate-500">{complaint.complaintId}</p>
                                <p className="text-sm font-bold text-slate-900">{complaint.title}</p>
                                <p className="text-xs text-slate-600">{placeLine(complaint.location, isEn, num)}</p>
                                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${STATUS_STYLE[complaint.status]?.badge}`}>
                                    {t(`userDash.status.${complaint.status}`)}
                                </span>
                                <div className="flex gap-2 pt-1">
                                    <Link
                                        to={`/department/complaints?open=${complaint._id}`}
                                        className="flex-1 rounded-lg bg-[#003893] py-1.5 text-center text-xs font-semibold text-white! no-underline"
                                    >
                                        {t("deptDash.complaints.view")}
                                    </Link>
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex-1 rounded-lg border border-[#003893] py-1.5 text-center text-xs font-semibold text-[#003893]! no-underline"
                                    >
                                        {t("deptDash.view.directions")}
                                    </a>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default ComplaintMap;
