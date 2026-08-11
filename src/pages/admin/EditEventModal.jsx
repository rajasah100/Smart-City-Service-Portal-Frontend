import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateEvent } from "../../redux/slices/eventSlice";
import { nepalLocations } from "../../data/nepalLocation";

const categories = [
    "Health Camp",
    "Blood Donation",
    "Agriculture",
    "Training",
    "Meeting",
    "Festival",
    "Sports",
    "Education",
    "Culture",
    "Environment",
    "Other",
];

const EditEventModal = ({ event, closeModal }) => {
    const dispatch = useDispatch();

    const [image, setImage] = useState(null);

    const [formData, setFormData] = useState({
        title: event.title || "",
        description: event.description || "",
        category: event.category || "Other",

        organizer: event.organizer || "",
        contact: event.contact || "",
        email: event.email || "",

        startDate: event.startDate
            ? event.startDate.slice(0, 10)
            : "",

        endDate: event.endDate
            ? event.endDate.slice(0, 10)
            : "",

        startTime: event.startTime || "",
        endTime: event.endTime || "",

        isRegistrationRequired:
            event.isRegistrationRequired || false,

        maxParticipants:
            event.maxParticipants || 0,

        isFeatured:
            event.isFeatured || false,

        province:
            event.location?.province || "",

        district:
            event.location?.district || "",

        municipality:
            event.location?.municipality || "",

        ward:
            event.location?.ward || "",

        tole:
            event.location?.tole || "",

        venue:
            event.location?.venue || "",
    });

    const selectedProvince = nepalLocations.find(
        (province) =>
            province.province === formData.province
    );

    const districts =
        selectedProvince?.districts || [];

    const selectedDistrict = districts.find(
        (district) =>
            district.name === formData.district
    );

    const municipalities =
        selectedDistrict?.municipalities || [];

    const selectedMunicipality =
        municipalities.find(
            (municipality) =>
                municipality.name ===
                formData.municipality
        );

    const wards =
        selectedMunicipality?.wards || [];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "province") {
            return setFormData((prev) => ({
                ...prev,
                province: value,
                district: "",
                municipality: "",
                ward: "",
            }));
        }

        if (name === "district") {
            return setFormData((prev) => ({
                ...prev,
                district: value,
                municipality: "",
                ward: "",
            }));
        }

        if (name === "municipality") {
            return setFormData((prev) => ({
                ...prev,
                municipality: value,
                ward: "",
            }));
        }

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = new FormData();

        // Basic fields
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("category", formData.category);
        data.append("organizer", formData.organizer);
        data.append("contact", formData.contact);
        data.append("email", formData.email);

        data.append("startDate", formData.startDate);
        data.append("endDate", formData.endDate);
        data.append("startTime", formData.startTime);
        data.append("endTime", formData.endTime);

        data.append(
            "isRegistrationRequired",
            formData.isRegistrationRequired
        );

        data.append(
            "maxParticipants",
            formData.maxParticipants
        );

        data.append(
            "isFeatured",
            formData.isFeatured
        );

        // Location fields
        data.append("province", formData.province);
        data.append("district", formData.district);
        data.append("municipality", formData.municipality);
        data.append("ward", formData.ward);
        data.append("tole", formData.tole);
        data.append("venue", formData.venue);

        // Image
        if (image) {
            data.append("image", image);
        }

        dispatch(
            updateEvent({
                id: event._id,
                formData: data,
            })
        )
            .unwrap()
            .then(() => {
                closeModal();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

            <div className="bg-white w-full max-w-4xl rounded-xl p-6 max-h-[90vh] overflow-y-auto">

                <h2 className="text-2xl font-bold mb-6">
                    Edit Event
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >

                    {/* Event Title */}
                    <input
                        type="text"
                        name="title"
                        placeholder="Event Title"
                        value={formData.title}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        required
                    />

                    {/* Category */}
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        required
                    >
                        <option value="">Select Category</option>

                        {categories.map((category) => (
                            <option
                                key={category}
                                value={category}
                            >
                                {category}
                            </option>
                        ))}
                    </select>

                    {/* Organizer */}
                    <input
                        type="text"
                        name="organizer"
                        placeholder="Organizer"
                        value={formData.organizer}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        required
                    />

                    {/* Contact */}
                    <input
                        type="text"
                        name="contact"
                        placeholder="Contact Number"
                        value={formData.contact}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        required
                    />

                    {/* Email */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />

                    {/* Max Participants */}
                    <input
                        type="number"
                        name="maxParticipants"
                        placeholder="Maximum Participants"
                        value={formData.maxParticipants}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />

                    {/* Start Date */}
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        required
                    />

                    {/* End Date */}
                    <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        required
                    />

                    {/* Start Time */}
                    <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        required
                    />

                    {/* End Time */}
                    <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        required
                    />

                    {/* Province */}
                    <select
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    >
                        <option value="">Select Province</option>

                        {nepalLocations.map((province) => (
                            <option
                                key={province.province}
                                value={province.province}
                            >
                                {province.province}
                            </option>
                        ))}
                    </select>

                    {/* District */}
                    <select
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        disabled={!formData.province}
                    >
                        <option value="">Select District</option>

                        {districts.map((district) => (
                            <option
                                key={district.name}
                                value={district.name}
                            >
                                {district.name}
                            </option>
                        ))}
                    </select>

                    {/* Municipality */}
                    <select
                        name="municipality"
                        value={formData.municipality}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        disabled={!formData.district}
                    >
                        <option value="">Select Municipality</option>

                        {municipalities.map((municipality) => (
                            <option
                                key={municipality.name}
                                value={municipality.name}
                            >
                                {municipality.name}
                            </option>
                        ))}
                    </select>

                    {/* Ward */}
                    <select
                        name="ward"
                        value={formData.ward}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        disabled={!formData.municipality}
                    >
                        <option value="">Select Ward</option>

                        {wards.map((ward) => (
                            <option
                                key={ward}
                                value={ward}
                            >
                                Ward {ward}
                            </option>
                        ))}
                    </select>

                    {/* Tole */}
                    <input
                        type="text"
                        name="tole"
                        placeholder="Tole"
                        value={formData.tole}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />

                    {/* Venue */}
                    <input
                        type="text"
                        name="venue"
                        placeholder="Venue"
                        value={formData.venue}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />

                    {/* Description */}
                    <textarea
                        name="description"
                        placeholder="Event Description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="border p-2 rounded md:col-span-2"
                        required
                    />

                    {/* Image */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="border p-2 rounded md:col-span-2"
                    />

                    {/* Registration Required */}
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="isRegistrationRequired"
                            checked={formData.isRegistrationRequired}
                            onChange={handleChange}
                        />
                        Registration Required
                    </label>

                    {/* Featured Event */}
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="isFeatured"
                            checked={formData.isFeatured}
                            onChange={handleChange}
                        />
                        Featured Event
                    </label>

                    {/* Buttons */}
                    <div className="md:col-span-2 flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-5 py-2 border rounded-lg hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg"
                        >
                            Update Event
                        </button>
                    </div>

                </form>

            </div>

        </div>
    );
};

export default EditEventModal;