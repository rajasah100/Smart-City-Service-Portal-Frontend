import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { getDepartmentComplaints } from "../../redux/slices/complaintSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ComplaintTable from "../../components/department/ComplaintTable";
import { LuSearch } from "react-icons/lu";


const DepartmentComplaints = () => {
    const dispatch = useDispatch();

    const {
        departmentComplaints = [],
        loading,
        error,
    } = useSelector((state) => state.complaint);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");

    useEffect(() => {
        dispatch(getDepartmentComplaints());
    }, [dispatch])

    const filteredComplaints = departmentComplaints.filter((complaint) => {
        const keyword = search.toLowerCase();

        const matchSearch =
            complaint.trackingId?.toLowerCase()?.includes(keyword) ||
            complaint.title?.toLowerCase()?.includes(keyword) ||
            complaint.department?.name?.toLowerCase()?.includes(keyword) ||
            complaint.user?.name?.toLowerCase()?.includes(keyword);

        const matchStatus =
            status === "all" || complaint.status === status;

        return matchSearch && matchStatus;
    });

    {
        filteredComplaints.length === 0 ? (
            <div className="bg-white border rounded-xl p-10 text-center">
                <h3 className="text-lg font-semibold text-slate-700">
                    No Complaints Found
                </h3>
                <p className="text-slate-500 mt-2">
                    There are no complaints matching your search.
                </p>
            </div>
        ) : (
            <ComplaintTable complaints={filteredComplaints} />
        )
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <LoadingSpinner />
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-100 text-red-600 p-5 rounded-xl">
                {error}
            </div>
        );
    }

    return (
        <div className="mx-6 mt-2">
            <div className="space-y-4 ">
                {/* Heading */}
                <div>
                    <h1 className="text-3xl font-bold text-[#10151c]">
                        Department Complaints
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Manage and track all complaints assigned to your department
                    </p>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search complaints..."
                            className="w-full border rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#0f4c81]"
                        />
                    </div>

                    <select
                        value={status}
                        onChange={((e) => setStatus(e.target.value))}
                        className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#0f4c81]"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="assigned">Assigned</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                {/* Count */}
                <div>
                    <p className="text-slate-500">
                        Total Complaints :
                        <span className="ml-2 font-bold text-[#10151c]">
                            {filteredComplaints.length}
                        </span>
                    </p>
                </div>

                {/* Table */}
                <ComplaintTable complaints={filteredComplaints} />

            </div>
        </div>
    )
}

export default DepartmentComplaints
