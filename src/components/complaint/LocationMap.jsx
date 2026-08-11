import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";

function LocationMarker({ position, setPosition }) {
    const map = useMap();

    useMapEvents({
        click(e) {
            const newPosition = [e.latlng.lat, e.latlng.lng];

            setPosition(newPosition);

            map.flyTo(newPosition, 17, {
                animate: true,
            });
        },
    });

    return position ? (
        <Marker position={position} />
    ) : null;
}

export default function LocationMap({
    position,
    setPosition,
}) {

    return (
        <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={true}
            className="w-full h-112.5 rounded-xl border border-gray-300 shadow-md z-0"
        >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <LocationMarker
                position={position}
                setPosition={setPosition}
            />
        </MapContainer>
    );
}