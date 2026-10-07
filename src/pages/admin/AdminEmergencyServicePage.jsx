import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaMapMarkerAlt, FaPencilAlt, FaPlus, FaTrash } from "react-icons/fa";
import {
    deleteEmergencyService,
    getEmergencyServices,
} from "../../redux/slices/emergencyServiceSlice";
import EmergencyServiceModal from "../../components/admin/emergency/EmergencyServiceModal";
import { SERVICE_TYPES } from "../../components/admin/emergency/serviceTypes";

const typeLabel = (value) =>
    SERVICE_TYPES.find((type) => type.value === value)?.label || value;

const AdminEmergencyServicePage = () => {
    const dispatch = useDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editService, setEditService] = useState(null);
    const [typeFilter, setTypeFilter] = useState("");

    const { services, loading, error } = useSelector(
        (state) => state.emergencyService
    );

    useEffect(() => {
        dispatch(getEmergencyServices({ includeInactive: true }));
    }, [dispatch]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this emergency service?"
        );

        if (!confirmDelete) return;

        try {
            await dispatch(deleteEmergencyService(id)).unwrap();
            toast.success("Emergency service deleted.");
        } catch (err) {
            toast.error(err?.message || "Delete failed.");
        }
    };

    const filteredServices = typeFilter
        ? services.filter((service) => service.type === typeFilter)
        : services;

    return (
        <div>
            {/* Heading */}
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-bold sm:text-2xl">
                        Emergency Services
                    </h1>

                    <p className="text-sm text-gray-500 sm:text-base">
                        Manage hospitals, police stations and fire brigades shown on the Emergency page.
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2"
                    >
                        <option value="">All types</option>
                        {SERVICE_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => {
                            setEditService(null);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                    >
                        <FaPlus size={16} />
                        Add Service
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-600">
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border bg-white">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left">#</th>
                            <th className="px-4 py-3 text-left">Name</th>
                            <th className="px-4 py-3 text-left">Type</th>
                            <th className="px-4 py-3 text-left">Phone</th>
                            <th className="px-4 py-3 text-left">Address</th>
                            <th className="px-4 py-3 text-left">Map</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading && services.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="py-6 text-center text-gray-500">
                                    Loading...
                                </td>
                            </tr>
                        ) : filteredServices.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="py-6 text-center text-gray-500">
                                    No emergency services found.
                                </td>
                            </tr>
                        ) : (
                            filteredServices.map((service, index) => {
                                const hasLocation = service.location?.coordinates?.length === 2;

                                return (
                                    <tr key={service._id} className="border-t hover:bg-gray-50">
                                        <td className="px-4 py-3">{index + 1}</td>
                                        <td className="px-4 py-3 font-medium">{service.name}</td>
                                        <td className="px-4 py-3">{typeLabel(service.type)}</td>
                                        <td className="px-4 py-3">{service.phone}</td>
                                        <td className="px-4 py-3">{service.address || "-"}</td>
                                        <td className="px-4 py-3">
                                            {hasLocation ? (
                                                <a
                                                    href={`https://www.google.com/maps?q=${service.location.coordinates[1]},${service.location.coordinates[0]}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                                                >
                                                    <FaMapMarkerAlt />
                                                    View
                                                </a>
                                            ) : (
                                                <span className="text-sm text-gray-400">Not set</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                    service.isActive
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-200 text-gray-600"
                                                }`}
                                            >
                                                {service.isActive ? "Active" : "Hidden"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditService(service);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="cursor-pointer rounded bg-yellow-500 p-2 text-white hover:bg-yellow-600"
                                                    aria-label="Edit"
                                                >
                                                    <FaPencilAlt size={14} />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(service._id)}
                                                    className="cursor-pointer rounded bg-red-600 p-2 text-white hover:bg-red-700"
                                                    aria-label="Delete"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <EmergencyServiceModal
                    key={editService?._id || "new"}
                    onClose={() => setIsModalOpen(false)}
                    editService={editService}
                />
            )}
        </div>
    );
};

export default AdminEmergencyServicePage;
