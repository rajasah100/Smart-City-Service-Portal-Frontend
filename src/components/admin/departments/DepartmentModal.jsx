import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
    registerDepartment,
    updateDepartment,
} from "../../../redux/slices/departmentSlice";

const DepartmentModal = ({
    isOpen,
    onClose,
    editDepartment = null,
}) => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        description: "",
    });

    useEffect(() => {
        if (editDepartment) {
            setFormData({
                name: editDepartment.name || "",
                email: editDepartment.email || "",
                password: "",
                phone: editDepartment.phone || "",
                address: editDepartment.address || "",
                description: editDepartment.description || "",
            });
        } else {
            setFormData({
                name: "",
                email: "",
                password: "",
                phone: "",
                address: "",
                description: "",
            });
        }
    }, [editDepartment, isOpen]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">

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