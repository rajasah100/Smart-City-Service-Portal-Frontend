import { useEffect } from "react";
import { FaPencilAlt, FaPlus, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux"
import { deleteDepartment, getDepartments } from "../../redux/slices/departmentSlice";
import { useState } from "react";
import DepartmentModal from "../../components/admin/departments/DepartmentModal";


const AdminDepartmentPage = () => {
    const dispatch = useDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editDepartment, setEditDepartment] = useState(null);

    const { departments, loading, error } = useSelector((state) => state.department);

    useEffect(() => {
        dispatch(getDepartments());
    }, [dispatch]);

    const handleDelete = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this department?")

        if (confirmDelete) {
            dispatch(deleteDepartment(id));
        }
    }

    return (
        <div className="p-6">
            {/* Heading */}
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-bold sm:text-2xl">
                        Department Management
                    </h1>

                    <p className="text-sm text-gray-500 sm:text-base">
                        Manage all Municipality departments.
                    </p>
                </div>

                <button
                    onClick={() => {
                        setEditDepartment(null);
                        setIsModalOpen(true);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 sm:w-auto"
                >
                    <FaPlus size={18} />
                    Add Department
                </button>
            </div>

            {/* Error */}
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
                            <th className="sm:px-4 px-2 py-3 text-left">#</th>
                            <th className="sm:px-4 px-2 py-3 text-left">Department</th>
                            <th className="sm:px-4 px-2 py-3 text-left">Email</th>
                            <th className="sm:px-4 px-2 py-3 text-left">Phone</th>
                            <th className="sm:px-4 px-2 py-3 text-left">Address</th>
                            <th className="sm:px-4 px-2 py-3 text-left">Action</th>

                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="py-6 text-center text-gray-500"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : departments.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="py-6 text-center text-gray-500"
                                >
                                    No departments found.
                                </td>
                            </tr>
                        ) : (
                            departments.map((department, index) => (
                                <tr
                                    key={department._id}
                                    className="border-t hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3">{index + 1}</td>
                                    <td className="px-4 py-3 font-medium">
                                        {department.name}
                                    </td>
                                    <td className="px-4 py-3">
                                        {department.email}
                                    </td>
                                    <td className="px-4 py-3">
                                        {department.phone}
                                    </td>
                                    <td className="px-4 py-3">
                                        {department.address}
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditDepartment(department);
                                                    setIsModalOpen(true);
                                                }}
                                                className="rounded bg-yellow-500 p-2 text-white hover:bg-yellow-600 cursor-pointer">
                                                <FaPencilAlt size={16} />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(department._id)}
                                                className="rounded bg-red-600 p-2 text-white hover:bg-red-700 cursor-pointer">
                                                <FaTrash size={16} />
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))
                        )}
                    </tbody>
                </table>


            </div>
            {/* Department Modal */}
            <DepartmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editDepartment={editDepartment}
            />
        </div>
    )
}

export default AdminDepartmentPage
