import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getAllComplaints } from "../../redux/slices/complaintSlice";
import { getDepartments } from "../../redux/slices/departmentSlice";
import { getUsers } from "../../redux/slices/userSlice";
// import { getAllNotices } from "../../redux/slices/noticeSlice";
import { getEvents } from "../../redux/slices/eventSlice";

import DashboardCards from "../../components/admin/DashboardCards";
import ComplaintChart from "../../components/admin/ComplaintChart";
import MonthlyChart from "../../components/admin/MonthlyChart";
import RecentComplaintTable from "../../components/admin/RecentComplaintTable";
import RecentActivity from "../../components/admin/RecentActivity";
import DepartmentPerformance from "../../components/admin/DepartmentPerformance";
import QuickActions from "../../components/admin/QuickActions";
import ComplaintViewModal from "../../components/admin/complaints/ComplaintViewModal";
import { getNotices } from "../../redux/slices/noticeSlice";

const AdminHomePage = () => {
    const dispatch = useDispatch();
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [openModal, setOpenModal] = useState(false);



    const { allComplaints = [], loading } = useSelector(
        (state) => state.complaint
    );

    // console.log(allComplaints)

    const { departments = [] } = useSelector(
        (state) => state.department
    );

    // console.log(departments);

    const { users = [] } = useSelector((state) => state.user);
    const { notices = [] } = useSelector((state) => state.notice);
    const { events = [] } = useSelector((state) => state.event);

    useEffect(() => {
        const loadDashboardData = () => {
            dispatch(getAllComplaints());
            dispatch(getDepartments());
            dispatch(getUsers());
            dispatch(getNotices());
            dispatch(getEvents())
        };

        loadDashboardData();

    }, [dispatch]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                Loading...
            </div>
        );
    }

    const handleViewComplaint = (complaint) => {
        setSelectedComplaint(complaint);
        setOpenModal(true);
    };

    return (
        <div className="p-6 space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800">
                    Admin Dashboard
                </h1>

                <p className="text-slate-500 mt-1">
                    Welcome back! Here's what's happening today.
                </p>
            </div>

            {/* Statistics */}
            <DashboardCards
                complaints={allComplaints}
                departments={departments}
                users={users}        // users
                notices={notices}      // notices
                events={events}       // events
            />

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ComplaintChart complaints={allComplaints} />

                <MonthlyChart complaints={allComplaints} />
            </div>

            {/* Recent Complaint Table */}
            <RecentComplaintTable
                complaints={allComplaints}
                onView={handleViewComplaint}
            />

            <ComplaintViewModal
                open={openModal}
                complaint={selectedComplaint}
                onClose={() => {
                    setOpenModal(false);
                    setSelectedComplaint(null);
                }}
            />

            {/* Bottom */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                <RecentActivity
                    complaints={allComplaints}
                />

                <DepartmentPerformance
                    complaints={allComplaints}
                />

                <QuickActions />

            </div>

        </div>
    );
};

export default AdminHomePage;