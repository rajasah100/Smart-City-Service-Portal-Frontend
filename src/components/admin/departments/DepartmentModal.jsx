import { useState } from "react";
import { useDispatch } from "react-redux";
import {
    registerDepartment,
    updateDepartment,
} from "../../../redux/slices/departmentSlice";
import { nepalLocations } from "../../../data/nepalLocation";

const emptyArea = { province: "", district: "", municipalities: [] };

// Modal khulda parent le naya mount garchha, tyasaile state sidhai props bata
const DepartmentModal = ({
    isOpen,
    onClose,
    editDepartment = null,
}) => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState(() => ({
        name: editDepartment?.name || "",
        email: editDepartment?.email || "",
        password: "",
        phone: editDepartment?.phone || "",
        address: editDepartment?.address || "",
        description: editDepartment?.description || "",
        serviceArea: {
            ...emptyArea,
            ...(editDepartment?.serviceArea || {}),
            municipalities: editDepartment?.serviceArea?.municipalities || [],
        },
    }));

    const area = formData.serviceArea;
    const province = nepalLocations.find((item) => item.province === area.province);
    const district = province?.districts.find((item) => item.name === area.district);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const setArea = (changes) => {
        setFormData((prev) => ({ ...prev, serviceArea: { ...prev.serviceArea, ...changes } }));
    };

    const toggleMunicipality = (name) => {
        setArea({
            municipalities: area.municipalities.includes(name)
                ? area.municipalities.filter((item) => item !== name)
                : [...area.municipalities, name],
        });
    };

    const areaSummary = !area.province
        ? "All of Nepal"
        : !area.district
          ? `Whole ${area.province}`
          : area.municipalities.length === 0
            ? `Whole ${area.district} district`
            : `${area.municipalities.length} local level(s) in ${area.district}`;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editDepartment) {
                await dispatch(
                    updateDepartment({
                        id: editDepartment._id,
                        departmentData: formData,
                    })
                ).unwrap();
            } else {
                await dispatch(registerDepartment(formData)).unwrap();
            }

            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl">

                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">
                        {editDepartment ? "Edit Department" : "Add Department"}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-2xl font-bold text-gray-500 hover:text-red-500"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="mb-1 block font-medium">
                            Department Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full rounded border p-3"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full rounded border p-3"
                            required
                        />
                    </div>

                    {!editDepartment && (
                        <div>
                            <label className="mb-1 block font-medium">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full rounded border p-3"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label className="mb-1 block font-medium">
                            Phone
                        </label>

                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full rounded border p-3"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block font-medium">
                            Address
                        </label>

                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full rounded border p-3"
                            required
                        />
                    </div>

                    {/* Sewa kshetra: yo department le kun thau ko gunaso herchha */}
                    <fieldset className="rounded border border-blue-200 bg-blue-50/50 p-4">
                        <legend className="px-1 font-medium">Service Area</legend>
                        <p className="mb-3 text-sm text-gray-500">
                            Citizens can send complaints to this department only from this area.
                        </p>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <select
                                value={area.province}
                                onChange={(e) => setArea({ province: e.target.value, district: "", municipalities: [] })}
                                className="w-full rounded border bg-white p-3"
                            >
                                <option value="">All of Nepal</option>
                                {nepalLocations.map((item) => (
                                    <option key={item.province} value={item.province}>{item.province}</option>
                                ))}
                            </select>

                            <select
                                value={area.district}
                                onChange={(e) => setArea({ district: e.target.value, municipalities: [] })}
                                disabled={!province}
                                className="w-full rounded border bg-white p-3 disabled:bg-gray-100"
                            >
                                <option value="">Whole province</option>
                                {province?.districts.map((item) => (
                                    <option key={item.name} value={item.name}>{item.name}</option>
                                ))}
                            </select>
                        </div>

                        {district && (
                            <div className="mt-3">
                                <p className="mb-1 text-sm font-medium">
                                    Local levels <span className="font-normal text-gray-500">(none selected = whole district)</span>
                                </p>
                                <div className="max-h-44 space-y-1 overflow-y-auto rounded border bg-white p-2">
                                    {district.municipalities.map((item) => (
                                        <label key={item.name} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm hover:bg-gray-50">
                                            <input
                                                type="checkbox"
                                                checked={area.municipalities.includes(item.name)}
                                                onChange={() => toggleMunicipality(item.name)}
                                            />
                                            {item.name}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <p className="mt-3 text-sm font-semibold text-blue-800">Covers: {areaSummary}</p>
                    </fieldset>

                    <div>
                        <label className="mb-1 block font-medium">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full rounded border p-3"
                            placeholder="Enter department description"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded bg-gray-200 px-5 py-2 hover:bg-gray-300"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                        >
                            {editDepartment ? "Update" : "Create"}
                        </button>

                    </div>
                </form>

            </div>
        </div>
    );
};

export default DepartmentModal;
