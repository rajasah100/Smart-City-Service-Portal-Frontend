import { Link } from "react-router-dom";
import { LuEye } from "react-icons/lu";

const RecentComplaintTable = ({ complaints = [], onView }) => {
  const recentComplaints = [...complaints]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "assigned":
        return "bg-blue-100 text-blue-700";

      case "in-progress":
        return "bg-purple-100 text-purple-700";

      case "resolved":
      case "completed":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-700";

      case "medium":
        return "bg-orange-100 text-orange-700";

      case "low":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Recent Complaints
          </h2>

          <p className="text-sm text-slate-500">
            Latest complaints submitted by citizens.
          </p>
        </div>

        <Link
          to="/admin/complaints"
          className="text-blue-600 text-sm font-semibold hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="text-left px-4 py-3">ID</th>
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3">Department</th>
              <th className="text-left px-4 py-3">Priority</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-center px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {recentComplaints.length > 0 ? (
              recentComplaints.map((item) => (
                <tr
                  key={item._id}
                  className="border-b hover:bg-slate-50"
                >
                  <td className="px-4 py-3">
                    #{item.complaintId}
                  </td>

                  <td className="px-4 py-3 font-medium">
                    {item.title}
                  </td>

                  <td className="px-4 py-3">
                    {item.department?.name || "N/A"}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityStyle(
                        item.priority
                      )}`}
                    >
                      {item.priority || "Low"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => onView(item)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                    >
                      <LuEye size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-10 text-slate-500"
                >
                  No complaints found.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default RecentComplaintTable;