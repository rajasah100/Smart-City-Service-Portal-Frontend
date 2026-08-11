import { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
    Tooltip,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import {
    LuNavigation,
    LuUser,
    LuCircleAlert,
} from "react-icons/lu";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function FlyToComplaint({ complaint }) {
    const map = useMap();

    useEffect(() => {
        if (!complaint) return;

        map.flyTo(
            [
                complaint.location.latitude,
                complaint.location.longitude,
            ],
            17,
            {
                duration: 1.5,
            }
        );
    }, [complaint, map]);

    return null;
}

const ComplaintMap = ({
    complaints,
    selectedComplaint,
}) => {

    const [currentLocation, setCurrentLocation] = useState(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCurrentLocation([
                    position.coords.latitude,
                    position.coords.longitude,
                ]);
            },
            (err) => console.log(err),
            {
                enableHighAccuracy: true,
            }
        );
    }, []);
    return (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

            <div className="border-b px-6 py-4">

                <h2 className="text-lg font-bold">
                    Complaint Map
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                    Click any complaint to locate it.
                </p>

            </div>

            <MapContainer
                center={currentLocation || [27.7172, 85.324]}
                zoom={7}
                scrollWheelZoom
                style={{
                    height: "700px",
                    width: "100%",
                }}
            >

                <TileLayer
                    attribution="OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <FlyToComplaint complaint={selectedComplaint} />

                {complaints.map((complaint) => (

                    <Marker
                        key={complaint._id}
                        position={[
                            complaint.location.latitude,
                            complaint.location.longitude,
                        ]}
                    >

                        <Tooltip
                            direction="top"
                            offset={[0, -20]}
                            opacity={1}
                            permanent
                        >
                            <div className="font-semibold text-xs">
                                {complaint.title}
                            </div>
                        </Tooltip>

                        <Popup>

                            <div className="w-64">

                                <h2 className="font-bold text-lg mb-2">
                                    {complaint.title}
                                </h2>

                                <p className="text-sm text-slate-600 mb-3">
                                    {complaint.description}
                                </p>

                                <div className="space-y-2">

                                    <div className="flex items-center gap-2">

                                        <LuUser />

                                        {complaint.user?.name}

                                    </div>

                                    <div className="flex items-center gap-2">

                                        <LuCircleAlert />

                                        {complaint.status}

                                    </div>

                                </div>

                                <button
                                    onClick={() =>
                                        window.open(
                                            `https://www.google.com/maps/dir/?api=1&destination=${complaint.location.latitude},${complaint.location.longitude}`,
                                            "_blank"
                                        )
                                    }
                                    className="mt-4 w-full bg-[#0f4c81] hover:bg-[#08365c] text-white py-2 rounded-lg flex items-center justify-center gap-2"
                                >

                                    <LuNavigation />

                                    Navigate

                                </button>

                            </div>

                        </Popup>

                    </Marker>

                ))}

                {currentLocation && (
                    <Marker position={currentLocation}>
                        <Popup>You are here</Popup>
                    </Marker>
                )}

            </MapContainer>

        </div>
    );
};

export default ComplaintMap;