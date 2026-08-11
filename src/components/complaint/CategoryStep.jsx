import { useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getDepartments } from "../../redux/slices/departmentSlice";


const CategoryStep = ({ data, updateField }) => {
    const dispatch = useDispatch();

    const { departments, loading } = useSelector((state) => state.department);

    useEffect(() => {
        dispatch(getDepartments());
    }, [dispatch])


    return (
        <div className="">
            {/* Heading */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">
                    Complaint Department
                </h2>
                <p className="text-gray-500 mt-2">
                    Select the department responsible for your complaint.
                </p>
            </div>

            {loading ? (
                <div className="text-center py-10">
                    Loading departments...
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {departments.map((department) => {
                        const selected = data.department === department._id;

                        return (
                            <button
                                key={department._id}
                                type="button"
                                onClick={() =>
                                    updateField("department", department._id)
                                }
                                className={`relative border-2 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 cursor-pointer ${selected
                                    ? "border-[#0F4C81] bg-blue-50"
                                    : "border-gray-200 bg-white hover:border-[#0F4C81]"
                                    }`}
                            >
                                {selected && (
                                    <div className="absolute top-3 right-3">
                                        <div className="w-6 h-6 rounded-full bg-[#0F4C81] flex items-center justify-center">
                                            <FaCheck
                                                size={14}
                                                className="text-white"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="w-16 h-16 rounded-full bg-[#0F4C81] text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                                    {department.name.charAt(0)}
                                </div>

                                <h3 className="font-semibold text-lg text-center">
                                    {department.name}
                                </h3>

                                <p className="text-sm text-gray-500 mt-2 text-center">
                                    {department.email}
                                </p>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Selected Category */}
            {data.department && (
                <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-4">
                    <p className="text-green-700 font-medium">
                        Department selected successfully.
                    </p>
                </div>
            )}
        </div>
    );
}

export default CategoryStep
