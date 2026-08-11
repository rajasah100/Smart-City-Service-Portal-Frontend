import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuClipboardList, LuRefreshCw } from "react-icons/lu";

import {
    getAllComplaints,
    deleteComplaint,
} from "../../redux/slices/complaintSlice";

import ComplaintStats from "../../components/admin/complaints/ComplaintStats";
import ComplaintSearch from "../../components/admin/complaints/ComplaintSearch";
import ComplaintTable from "../../components/admin/complaints/ComplaintTable";
import ComplaintPagination from "../../components/admin/complaints/ComplaintPagination";
import ComplaintViewModal from "../../components/admin/complaints/ComplaintViewModal";
import DeleteComplaintModal from "../../components/admin/complaints/DeleteComplaintModal";

const ComplaintsPage = () => {
    const dispatch = useDispatch();

    const { allComplaints = [], loading } = useSelector(
        (state) => state.complaint
    );

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [priority, setPriority] = useState("all");

    const [currentPage, setCurrentPage] = useState(1);
    const complaintsPerPage = 10;

    const [selectedComplaint, setSelectedComplaint] = useState(null);

    const [viewOpen, setViewOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    useEffect(() => {
        dispatch(getAllComplaints());
    }, [dispatch]);

    const filteredComplaints = useMemo(() => {
        return allComplaints.filter((complaint) => {
            const keyword = search.toLowerCase();

            const matchesSearch =
                complaint.title?.toLowerCase().includes(keyword) ||
                complaint.description?.toLowerCase().includes(keyword) ||
                complaint.user?.name?.toLowerCase().includes(keyword);

            const matchesStatus =
                status === "all"
                    ? true
                    : complaint.status === status;

            const matchesPriority =
                priority === "all"
                    ? true
                    : complaint.priority === priority;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority
            );
        });
    }, [allComplaints, search, status, priority]);

    const totalPages = Math.ceil(
        filteredComplaints.length / complaintsPerPage
    );

    const currentComplaints = filteredComplaints.slice(
        (currentPage - 1) * complaintsPerPage,
        currentPage * complaintsPerPage
    );

    const handleView = (complaint) => {
        setSelectedComplaint(complaint);
        setViewOpen(true);
    };

    const handleDelete = (complaint) => {
        setSelectedComplaint(complaint);
        setDeleteOpen(true);
    };

    const confirmDelete = async (id) => {
        try {

            await dispatch(deleteComplaint(id)).unwrap();

            setDeleteOpen(false);
            setSelectedComplaint(null);

            dispatch(getAllComplaints());

        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">

                <div>
                    <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                        <LuClipboardList />
                        Complaint Management
                    </h1>

                    <p className="text-slate-500 mt-1">
                        Manage and monitor all complaints.
                    </p>
                </div>

                <button
                    onClick={() => dispatch(getAllComplaints())}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                    <LuRefreshCw />
                    Refresh
                </button>

            </div>

            {/* Stats */}
            <ComplaintStats complaints={allComplaints} />

            {/* Search */}
            <ComplaintSearch
                search={search}
                setSearch={(value) => {
                    setSearch(value);
                    setCurrentPage(1);
                }}
                status={status}
                setStatus={(value) => {
                    setStatus(value);
                    setCurrentPage(1);
                }}
                priority={priority}
                setPriority={(value) => {
                    setPriority(value);
                    setCurrentPage(1);
                }}
            />

            {/* Table */}
            <ComplaintTable
                complaints={currentComplaints}
                loading={loading}
                onView={handleView}
                onDelete={handleDelete}
            />

            {/* Pagination */}
            <ComplaintPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalComplaints={filteredComplaints.length}
                complaintsPerPage={complaintsPerPage}
            />

            {/* View Modal */}
            <ComplaintViewModal
                open={viewOpen}
                complaint={selectedComplaint}
                onClose={() => setViewOpen(false)}
            />

            {/* Delete Modal */}
            <DeleteComplaintModal
                open={deleteOpen}
                complaint={selectedComplaint}
                loading={loading}
                onClose={() => setDeleteOpen(false)}
                onDelete={confirmDelete}
            />

        </div>
    );
};

export default ComplaintsPage;