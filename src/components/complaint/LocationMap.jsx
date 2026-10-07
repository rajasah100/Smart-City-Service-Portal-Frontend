import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";

// Default: Bhaktapur (portal ko thegana)
const DEFAULT_CENTER = [27.6722, 85.428];

// Position badlida (GPS, click, drag) naksa tyahi sarne
function FollowPosition({ position }) {
    const map = useMap();
    const lat = position?.[0];
    const lng = position?.[1];

    useEffect(() => {
        if (lat == null || lng == null) return;
        map.flyTo([lat, lng], Math.max(map.getZoom(), 17), { duration: 0.8 });
    }, [map, lat, lng]);

    return null;
}

// Dropdown bata thau chhanda pin nalagai tyo thau ma zoom (focus: { center, zoom })
function FollowFocus({ focus }) {
    const map = useMap();
    const lat = focus?.center[0];
    const lng = focus?.center[1];
    const zoom = focus?.zoom;

    useEffect(() => {
        if (lat == null || lng == null) return;
        map.flyTo([lat, lng], zoom, { duration: 0.8 });
    }, [map, lat, lng, zoom]);

    return null;
}

function ClickToPin({ onChange }) {
    useMapEvents({
        click(e) {
            onChange([e.latlng.lat, e.latlng.lng]);
        },
    });

    return null;
}

// position: [lat, lng] wa null. Marker tanera pani sarna milcha
export default function LocationMap({ position, focus, onChange }) {
    return (
        <MapContainer center={position || DEFAULT_CENTER} zoom={position ? 17 : 14} scrollWheelZoom className="z-0 h-80 w-full sm:h-96">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <ClickToPin onChange={onChange} />
            <FollowFocus focus={focus} />
            <FollowPosition position={position} />

            {position && (
                <Marker
                    position={position}
                    draggable
                    eventHandlers={{
                        dragend: (e) => {
                            const { lat, lng } = e.target.getLatLng();
                            onChange([lat, lng]);
                        },
                    }}
                />
            )}
        </MapContainer>
    );
}
