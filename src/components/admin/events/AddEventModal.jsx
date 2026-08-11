import { useState } from "react";
import { useDispatch } from "react-redux";
import { createEvent } from "../../../redux/slices/eventSlice";
import { nepalLocations } from "../../../data/nepalLocation";


const AddEventModal = ({ closeModal }) => {

    const dispatch = useDispatch();

    const [image, setImage] = useState(null);


    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        organizer: "",
        contact: "",
        email: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        isRegistrationRequired: false,
        maxParticipants: 0,
        isFeatured: false,
        province: "",
        district: "",
        municipality: "",
        ward: "",
        tole: "",
        venue: "",
    });

    const selectedProvince = nepalLocations.find(
        (item) => item.province === formData.province
    );

    const districts = selectedProvince?.districts || [];

    const selectedDistrict = districts.find(
        (item) => item.name === formData.district
    );

    const municipalities = selectedDistrict?.municipalities || [];

    const selectedMunicipality = municipalities.find(
        (item) => item.name === formData.municipality
    );

    const wards = selectedMunicipality?.wards || [];


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "province") {
            setFormData((prev) => ({
                ...prev,
                province: value,
                district: "",
                municipality: "",
                ward: "",
            }));
            return;
        }

        if (name === "district") {
            setFormData((prev) => ({
                ...prev,
                district: value,
                municipality: "",
                ward: "",
            }));
            return;
        }

        if (name === "municipality") {
            setFormData((prev) => ({
                ...prev,
                municipality: value,
                ward: "",
            }));
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };



    const handleSubmit = (e) => {

        e.preventDefault();


        const data = new FormData();


        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });


        if (image) {
            data.append("image", image);
        }



        dispatch(createEvent(data))
            .unwrap()
            .then(() => {
                closeModal();
            });

    };



    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">


            <div className="bg-white w-full max-w-3xl rounded-xl p-6 max-h-[90vh] overflow-y-auto">


                <h2 className="text-xl font-bold mb-5">
                    Create New Event
                </h2>



                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >


                    <input
                        name="title"
                        placeholder="Event Title"
                        value={formData.title}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        required
                    />


                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        required
                    >
                        <option value="">
                            Select Category
                        </option>

                        <option value="Health Camp">
                            Health Camp
                        </option>

                        <option value="Blood Donation">
                            Blood Donation
                        </option>

                        <option value="Agriculture">
                            Agriculture
                        </option>

                        <option value="Training">
                            Training
                        </option>

                        <option value="Meeting">
                            Meeting
                        </option>

                        <option value="Festival">
                            Festival
                        </option>

                        <option value="Sports">
                            Sports
                        </option>

                        <option value="Education">
                            Education
                        </option>

                        <option value="Culture">
                            Culture
                        </option>

                        <option value="Environment">
                            Environment
                        </option>

                        <option value="Other">
                            Other
                        </option>

                    </select>



                    <input
                        name="organizer"
                        placeholder="Organizer"
                        value={formData.organizer}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        required
                    />



                    <input
                        name="contact"
                        placeholder="Contact Number"
                        value={formData.contact}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        required
                    />



                    <input
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />



                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        required
                    />



                    <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        required
                    />



                    <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />



                    <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />



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



                    <input
                        name="tole"
                        placeholder="Tole"
                        value={formData.tole}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />



                    <input
                        name="venue"
                        placeholder="Venue"
                        value={formData.venue}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />



                    <input
                        type="number"
                        name="maxParticipants"
                        placeholder="Max Participants"
                        value={formData.maxParticipants}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />



                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        className="border p-2 rounded md:col-span-2"
                        rows="4"
                        required
                    />



                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="border p-2 rounded md:col-span-2"
                    />



                    <label className="flex items-center gap-2">

                        <input
                            type="checkbox"
                            name="isRegistrationRequired"
                            checked={formData.isRegistrationRequired}
                            onChange={handleChange}
                        />

                        Registration Required

                    </label>



                    <label className="flex items-center gap-2">

                        <input
                            type="checkbox"
                            name="isFeatured"
                            checked={formData.isFeatured}
                            onChange={handleChange}
                        />

                        Featured Event

                    </label>




                    <div className="md:col-span-2 flex justify-end gap-3 mt-4">


                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 border rounded"
                        >
                            Cancel
                        </button>



                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-5 py-2 rounded"
                        >
                            Create Event
                        </button>


                    </div>


                </form>


            </div>


        </div>

    );

};


export default AddEventModal;