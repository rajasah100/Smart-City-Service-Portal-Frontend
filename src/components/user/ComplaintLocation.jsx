import "leaflet/dist/leaflet.css";

import { FaFolderOpen } from "react-icons/fa";
import { MapContainer, TileLayer, Marker } from "react-leaflet";


const Location = ({ icon: Icon, label, value }) => (
    <div className="flex gap-3 py-3 border-b last:border-b-0">
        <Icon className="text-[#0f4c81] mt-1" />
        <div>
            <p className="text-gray-500">{label}</p>
            <p className="font-semibold capitalize">{value || "-"}</p>
        </div>
    </div>
);

const ComplaintLocation = ({ complaint }) => {
    return (
        <div className="">
            <div className="mt-2 border shadow bg-white rounded-xl">
                <div className="border-b py-4 px-6">
                    <h2 className="font-bold text-lg">
                        Complaint Location
                    </h2>
                </div>

                <div className="p-6">
                    <Location
                        icon={FaFolderOpen}
                        label="Province"
                        value={complaint.province}
                    />
                    <Location
                        icon={FaFolderOpen}
                        label="Municipality"
                        value={complaint.municipality}
                    />
                    <Location
                        icon={FaFolderOpen}
                        label="District"
                        value={complaint.district}
                    />
                    <Location
                        icon={FaFolderOpen}
                        label="Ward No."
                        value={complaint.ward}
                    />
                    <Location
                        icon={FaFolderOpen}
                        label="Tole / Street"
                        value={complaint.tole}
                    />
                </div>
            </div>

            {/* Location */}
            <div className="bg-white border rounded-xl mt-2">
                <div className="px-6 py-4 border-b bg-gray-50 rounded-t-xl">
                    <h3 className="font-semibold text-lg">
                        Location Preview
                    </h3>
                </div>

                <div className="p-6">
                    <MapContainer
                        center={
                            complaint.latitude && complaint.longitude ? [
                                Number(complaint.latitude),
                                Number(complaint.longitude),
                            ] : [27.7172, 85.324]}
                        zoom={16}
                        scrollWheelZoom={false}
                        className="w-full h-87.5 rounded-xl relative z-0"
                    >
                        <TileLayer
                            attribution="&copy; OpenStreetMap contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {complaint.latitude && complaint.longitude && (
                            <Marker
                                position={[
                                    Number(complaint.latitude) || 27.7172,
                                    Number(complaint.longitude) || 85.324,
                                ]}
                            />
                        )}

                    </MapContainer>
                </div>
            </div>
        </div>
    )
}

export default ComplaintLocation
