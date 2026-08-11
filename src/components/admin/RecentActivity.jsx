import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import { useSelector } from "react-redux";

const RecentActivity = () => {
  const { allComplaints = [] } = useSelector((state) => state.complaint);

  const activities = [...allComplaints]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "bg-green-100 text-green-700";
      case "in progress":
        return "bg-blue-100 text-blue-700";
      case "assigned":
        return "bg-purple-100 text-purple-700";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow border border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b">
        <h2 className="text-xl font-bold text-slate-800">
          Recent Activity
        </h2>

        <Link
          to="/admin/complaints"
          className="text-blue-600 hover:underline text-sm"
        >
          View All
        </Link>
      </div>

      {/* Body */}
      <div className="divide-y">
        {activities.length > 0 ? (
          activities.map((complaint) => (
            <div
              key={complaint._id}
              className="flex justify-between items-center px-6 py-4 hover:bg-slate-50 transition"
            >
              <div className="min-w-0">
                <h3 className="font-semibold text-slate-800 truncate">
                  {complaint.title}
                </h3>

                <p className="text-sm text-slate-500">
                  {complaint.department?.name || "No Department"}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    complaint.status
                  )}`}
                >
                  {complaint.status}
                </span>

                <Link to={`/admin/complaints/${complaint._id}`}>
                  <FaChevronRight className="text-slate-400 hover:text-blue-600" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-500">
            No Recent Activity
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;