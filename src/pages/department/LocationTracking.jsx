import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuMapPinned, LuSearch } from "react-icons/lu";

import { getDepartmentComplaints } from "../../redux/slices/complaintSlice";

import ComplaintMap from "../../components/department/ComplaintMap";
import ComplaintLocationList from "../../components/department/ComplaintLocationList";

const LocationTracking = () => {
  const dispatch = useDispatch();

  const {
    departmentComplaints = [],
    loading,
  } = useSelector((state) => state.complaint);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    dispatch(getDepartmentComplaints());
  }, [dispatch]);

  const filteredComplaints = useMemo(() => {
    return departmentComplaints.filter((complaint) => {
      const keyword = search.toLowerCase();

      const matchSearch =
        complaint.title?.toLowerCase().includes(keyword) ||
        complaint.complaintId?.toLowerCase().includes(keyword) ||
        complaint.user?.name?.toLowerCase().includes(keyword);

      const matchStatus =
        status === "all" || complaint.status === status;

      const matchPriority =
        priority === "all" ||
        complaint.priority === priority;

      return matchSearch && matchStatus && matchPriority;
    });
  }, [departmentComplaints, search, status, priority]);

  return (
    <div className="p-6 space-y-6">

      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div>

          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <LuMapPinned className="text-[#0f4c81]" />
            Complaint Location Tracking
          </h1>

          <p className="text-slate-500 mt-2">
            View complaint locations, monitor progress and navigate to the incident.
          </p>

        </div>

        <div className="bg-white border rounded-xl px-6 py-4 shadow-sm">

          <p className="text-sm text-slate-500">
            Showing Complaints
          </p>

          <h2 className="text-3xl font-bold text-[#0f4c81]">
            {filteredComplaints.length}
          </h2>

        </div>

      </div>

      {/* Search & Filters */}

      <div className="bg-white rounded-xl border shadow-sm p-5">

        <div className="grid lg:grid-cols-3 gap-4">

          <div className="relative">

            <LuSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />

            <input
              type="text"
              placeholder="Search complaint..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-[#0f4c81]"
            />

          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded-xl px-4 py-3 outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border rounded-xl px-4 py-3 outline-none"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

        </div>

      </div>

      {/* Main Layout */}

      <div className="grid xl:grid-cols-12 gap-6">

        {/* Complaint List */}

        <div className="xl:col-span-4">

          <ComplaintLocationList
            complaints={filteredComplaints}
            loading={loading}
            selectedComplaint={selectedComplaint}
            setSelectedComplaint={setSelectedComplaint}
          />

        </div>

        {/* Map */}

        <div className="xl:col-span-8">

          <ComplaintMap
            complaints={filteredComplaints}
            selectedComplaint={selectedComplaint}
            setSelectedComplaint={setSelectedComplaint}
          />

        </div>

      </div>

    </div>
  );
};

export default LocationTracking;