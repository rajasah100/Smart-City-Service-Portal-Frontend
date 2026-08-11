import { Link } from "react-router-dom";
import {
  LuArrowRight,
  LuClock3,
  LuCheckCheck,
  LuLoader,
} from "react-icons/lu";
import { useSelector } from "react-redux";

const RecentComplaints = () => {
  const {
    departmentComplaints = [],
    loading,
  } = useSelector((state) => state.complaint);

  const recentComplaints = departmentComplaints.slice(0, 5);

  const statusBadge = {
    pending: "bg-yellow-100 text-yellow-700",
    assigned: "bg-blue-100 text-blue-700",
    inProgress: "bg-purple-100 text-purple-700",
    "in-progress": "bg-purple-100 text-purple-700",
    resolved: "bg-green-100 text-green-700",
  };

  const statusIcon = {
    pending: LuClock3,
    assigned: LuLoader,
    inProgress: LuLoader,
    "in-progress": LuLoader,
    resolved: LuCheckCheck,
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <div className="flex justify-center items-center">
          <p className="text-slate-500">Loading complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-[#10151c]">
            Recent Complaints
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Latest complaints assigned to your department
          </p>
        </div>

        <Link
          to="/department/complaints"
          className="flex items-center gap-1 text-[#4a6c8f] text-sm font-semibold hover:underline"
        >
          View All
          <LuArrowRight size={16} />
        </Link>
      </div>

      {/* Complaint List */}
      <div className="divide-y divide-slate-100">
        {recentComplaints.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            No complaints found.
          </div>
        ) : (
          recentComplaints.map((complaint) => {
            const Icon = statusIcon[complaint.status] || LuClock3;

            return (
              <div
                key={complaint._id}
                className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition"
              >
                <div>
                  <h3 className="font-semibold text-[#10151c]">
                    {complaint.title}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    {complaint.trackingId || complaint.complaintId}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                    statusBadge[complaint.status] ||
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  <Icon size={14} />
                  {complaint.status}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentComplaints;