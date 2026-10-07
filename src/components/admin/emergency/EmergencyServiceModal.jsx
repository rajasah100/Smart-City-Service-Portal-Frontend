import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaLocationArrow, FaTimes } from "react-icons/fa";
import {
    createEmergencyService,
    updateEmergencyService,
} from "../../../redux/slices/emergencyServiceSlice";
import { SERVICE_TYPES } from "./serviceTypes";

const getInitialForm = (service) => ({
    name: service?.name || "",
    type: service?.type || "hospital",
    phone: service?.phone || "",
    address: service?.address || "",
    // GeoJSON coordinates = [lng, lat]
    lat: service?.location?.coordinates?.[1] ?? "",
    lng: service?.location?.coordinates?.[0] ?? "",
    isActive: service?.isActive ?? true,
});

// Parent le key={service?._id} dinchha, tyasaile naya service ma form reset huncha
const EmergencyServiceModal = ({ onClose, editService }) => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.emergencyService);

    const [formData, setFormData] = useState(() => getInitialForm(editService));

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const useMyLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Location is not supported.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData((prev) => ({
                    ...prev,
                    lat: position.coords.latitude.toFixed(6),
                    lng: position.coords.longitude.toFixed(6),
                }));
            },
            () => toast.error("Please allow location permission.")
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const hasLat = formData.lat !== "";
        const hasLng = formData.lng !== "";

        if (hasLat !== hasLng) {
            toast.error("Please enter both latitude and longitude.");
            return;
        }

        const payload = {
            name: formData.name.trim(),
            type: formData.type,
            phone: formData.phone.trim(),
            address: formData.address.trim(),
            isActive: formData.isActive,
        };

        if (hasLat && hasLng) {
            const lat = Number(formData.lat);
            const lng = Number(formData.lng);

            if (Number.isNaN(lat) || Number.isNaN(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
                toast.error("Please enter a valid latitude and longitude.");
                return;
            }

            payload.lat = lat;
            payload.lng = lng;
        }

        try {
            if (editService) {
                await dispatch(
                    updateEmergencyService({ id: editService._id, serviceData: payload })
                ).unwrap();
                toast.success("Emergency service updated.");
            } else {
                await dispatch(createEmergencyService(payload)).unwrap();
                toast.success("Emergency service added.");
            }

            onClose();
        } catch (error) {
            toast.error(error?.message || "Something went wrong.");
        }
    };

    const inputClass =
        "w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-bold">
                        {editService ? "Edit Emergency Service" : "Add Emergency Service"}
                    </h2>

                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700" aria-label="Close">
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">Name *</label>
                        <input
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Janakpur Provincial Hospital"
                            className={inputClass}
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium">Type *</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                {SERVICE_TYPES.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">Phone *</label>
                            <input
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="e.g. 041-520133"
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Address</label>
                        <input
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="e.g. Janakpur-08, Dhanusha"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <div className="mb-1 flex items-center justify-between">
                            <label className="text-sm font-medium">Map Location</label>

                            <button
                                type="button"
                                onClick={useMyLocation}
                                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                            >
                                <FaLocationArrow size={12} />
                                Use my current location
                            </button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <input
                                name="lat"
                                value={formData.lat}
                                onChange={handleChange}
                                placeholder="Latitude (e.g. 26.7288)"
                                className={inputClass}
                            />
                            <input
                                name="lng"
                                value={formData.lng}
                                onChange={handleChange}
                                placeholder="Longitude (e.g. 85.925)"
                                className={inputClass}
                            />
                        </div>

                        <p className="mt-1 text-xs text-gray-500">
                            Tip: In Google Maps, right-click the place and click the coordinates to copy them.
                            Services with a location appear on the public map.
                        </p>
                    </div>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="h-4 w-4"
                        />
                        <span className="text-sm">Active (show on public website)</span>
                    </label>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border px-4 py-2 hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            {loading ? "Saving..." : editService ? "Update" : "Add Service"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmergencyServiceModal;
