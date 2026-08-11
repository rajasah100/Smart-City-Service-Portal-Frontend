import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const locations = [
    {
        id: 1,
        name: "Janakpur Provincial Hospital",
        position: [26.7288, 85.925],
        type: "Hospital",
    },
    {
        id: 2,
        name: "Janakpur Police Office",
        position: [26.7269, 85.9274],
        type: "Police Station",
    },
    {
        id: 3,
        name: "Janakpur Fire Brigade",
        position: [26.7297, 85.9282],
        type: "Fire Station",
    },
];

const EmergencyMap = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-12">
                    <span className="text-red-600 font-semibold uppercase">
                        Emergency Locations
                    </span>

                    <h2 className="text-4xl font-bold text-gray-800 mt-2">
                        Find Nearby Emergency Services
                    </h2>

                    <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
                        View nearby hospitals, police stations, and fire brigades on the map.
                    </p>
                </div>

                <div className="overflow-hidden rounded-3xl shadow-lg border border-gray-200">

                    <MapContainer
                        center={[26.7288, 85.925]}
                        zoom={14}
                        scrollWheelZoom={false}
                        className="h-125 w-full z-0"
                    >
                        <TileLayer
                            attribution='&copy; OpenStreetMap contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {locations.map((location) => (
                            <Marker
                                key={location.id}
                                position={location.position}
                            >
                                <Popup>
                                    <div className="space-y-2 min-w-45">
                                        <h3 className="font-semibold">{location.name}</h3>

                                        <p className="text-sm text-gray-600">
                                            {location.type}
                                        </p>

                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${location.position[0]},${location.position[1]}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block text-center bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                                        >
                                            🧭 Navigate
                                        </a>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>

                </div>

            </div>
        </section>
    );
};

export default EmergencyMap;