// import { FaBuilding } from "react-icons/fa"
import { useState } from "react"
import { nepalLocations } from "../../data/nepalLocation"
import { FaHome } from "react-icons/fa";
import LocationMap from "./LocationMap";


const LocationStep = ({ data, updateField }) => {
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedMunicipality, setSelectedMunicipality] = useState("");
    const [position, setPosition] = useState([
        27.7172,
        85.324,
    ]);

    const province = nepalLocations.find((p) => p.province === selectedProvince);

    const districts = province?.districts || [];

    const district = districts.find((d) => d.name === selectedDistrict);

    const municipalities = district?.municipalities || [];

    const municipality = municipalities.find((m) => m.name === selectedMunicipality);

    const wards = municipality?.wards || []


    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const newPosition = [
                    pos.coords.latitude,
                    pos.coords.longitude,
                ];

                setPosition(newPosition);

                updateField("latitude", pos.coords.latitude);
                updateField("longitude", pos.coords.longitude);
            },
            () => {
                alert("Unable to get your location.");
            }
        );
    };

    return (
        <div>
            {/* Heading */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">
                    Complaint Location
                </h2>
                <p className="text-gray-500 mt-2">
                    Provide the exact location where the
                    issue occurred.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

                {/* Province */}
                <div>
                    <label className="block font-semibold mb-2">
                        Province
                    </label>

                    <select
                        value={selectedProvince}
                        onChange={(e) => {
                            setSelectedProvince(e.target.value);
                            setSelectedDistrict("");
                            setSelectedMunicipality("")

                            updateField("province", e.target.value);
                            updateField("district", "");
                            updateField("municipality", "");
                            updateField("ward", "");
                        }}
                        className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#0f4c81]"
                    >
                        <option value="">Select Province</option>

                        {nepalLocations.map((item) => (
                            <option
                                key={item.province}
                                value={item.province}
                            >
                                {item.province}
                            </option>
                        ))}
                    </select>
                </div>

                {/* District */}
                <div>
                    <label className="block font-semibold mb-2">
                        District
                    </label>

                    <select
                        value={selectedDistrict}
                        onChange={(e) => {
                            setSelectedDistrict(e.target.value);
                            setSelectedMunicipality("");

                            updateField("district", e.target.value);
                            updateField("municipality", "");
                            updateField("ward", "");
                        }}
                        className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#0f4c81]"
                    >
                        <option value="">Select District</option>

                        {districts.map((item) => (
                            <option key={item.name} value={item.name}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Municipality */}
                <div>
                    <label className="block font-semibold mb-2">
                        Municipality
                    </label>

                    <select
                        value={selectedMunicipality}
                        onChange={(e) => {
                            setSelectedMunicipality(e.target.value)

                            updateField("municipality", e.target.value);
                            updateField("ward", "");
                        }}
                        className="w-full border rounded-lg px-4 outline-none py-3 focus:ring-2 focus:ring-[#0f4c81]"
                    >
                        <option value="">Select Municipality</option>

                        {municipalities.map((item) => (
                            <option key={item.name} value={item.name}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Ward */}
                <div>
                    <label className="block font-semibold mb-2">
                        Ward No.
                    </label>
                    <select
                        value={data.ward}
                        onChange={(e) => updateField("ward", e.target.value)}
                        className="w-full border outline-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0f4c81]"
                    >
                        <option value="">Select Ward</option>

                        {wards.map((ward) => (
                            <option
                                key={ward}
                                value={ward}
                            >
                                {ward}
                            </option>
                        ))}

                    </select>
                </div>

                {/* Tole */}
                <div className="md:col-span-2">
                    <label className="block font-semibold mb-2">
                        Tole / Street
                    </label>

                    <div className="relative">
                        <FaHome className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                        <input
                            type="text"
                            placeholder="Enter Tole / Street"
                            value={data.tole}
                            onChange={(e) => updateField("tole", e.target.value)}
                            className="w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0f4c81] outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Current Location Button */}
            <div className="mt-8 mb-4">
                <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="bg-[#0F4C81] text-white px-4 py-2 rounded-lg hover:bg-[#0c3c66]"
                >
                    📍 Use My Current Location
                </button>
            </div>


            {/* Map */}
            <div className="mt-8">
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                    Select Complaint Location
                </label>

                <div className="rounded-xl overflow-hidden border border-gray-300 shadow-sm">
                    <LocationMap
                        position={position}
                        setPosition={(newPosition) => {
                            setPosition(newPosition);

                            updateField("latitude", newPosition[0]);
                            updateField("longitude", newPosition[1]);
                        }}
                    />
                </div>

                <p className="text-sm text-gray-500 mt-2">
                    Click anywhere on the map to pin the complaint location.
                </p>
            </div>


            {/* Latitude and Longitude */}
            <div className="grid grid-cols-2 gap-4 mt-9">
                <div>
                    <label className="block font-medium mb-2">
                        Latitude
                    </label>

                    <input
                        readOnly
                        value={position[0].toFixed(6)}
                        className="w-full border rounded-lg px-4 py-3 bg-gray-100"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-2">
                        Longitude
                    </label>

                    <input
                        readOnly
                        value={position[1].toFixed(6)}
                        className="w-full border rounded-lg px-4 py-3 bg-gray-100"
                    />
                </div>
            </div>
        </div>
    )
}

export default LocationStep
