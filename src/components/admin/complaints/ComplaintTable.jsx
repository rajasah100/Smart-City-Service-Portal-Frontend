import { LuEye } from "react-icons/lu";

import { FaUserCircle } from "react-icons/fa";

const ComplaintTable = ({ complaints = [], loading, onView }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-20 text-center">
        Loading complaints...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Complaints</h2>

          <p className="text-sm text-slate-500">Manage citizen complaints.</p>
        </div>

        <span className="bg-slate-100 px-4 py-2 rounded-xl text-sm font-semibold">
          {complaints.length} Complaints
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-sm text-slate-600">
              <th className="px-6 py-4">Complaint</th>

              <th className="px-6 py-4">Citizen</th>

              <th className="px-6 py-4">Department</th>

              <th className="px-6 py-4">Priority</th>

              <th className="px-6 py-4">Status</th>

              <th className="px-6 py-4">Date</th>

              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length > 0 ? (
              complaints.map((complaint) => (
                <tr
                  key={complaint._id}
                  className="border-t hover:bg-slate-50 transition"
                >
                  {/* Complaint */}
                  <td className="px-6 py-4">
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {complaint.title}
                      </h3>

                      <p className="text-sm text-slate-500">
                        ID: {complaint.complaintId}
                      </p>
                    </div>
                  </td>

                  {/* Citizen */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {complaint.user?.avatar ? (
                        <img
                          src={complaint.user?.avatar}
                          alt={complaint.user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <FaUserCircle size={38} className="text-slate-400" />
                      )}

                      <div>
                        <p className="font-medium text-slate-800">
                          {complaint.user?.name || "-"}
                        </p>
                        <p className="text-sm text-slate-500">
                          {complaint.user?.email || ""}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="px-6 py-4">
                    {complaint.department?.name || "-"}
                  </td>

                  {/* Priority */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                                                
                                                ${
                                                  complaint.priority ===
                                                  "urgent"
                                                    ? "bg-red-100 text-red-600"
                                                    : complaint.priority ===
                                                        "important"
                                                      ? "bg-orange-100 text-orange-600"
                                                      : "bg-green-100 text-green-600"
                                                }
                                                `}
                    >
                      {complaint.priority || "normal"}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold

                                                ${
                                                  complaint.status ===
                                                  "resolved"
                                                    ? "bg-green-100 text-green-600"
                                                    : complaint.status ===
                                                        "in-progress"
                                                      ? "bg-blue-100 text-blue-600"
                                                      : "bg-yellow-100 text-yellow-600"
                                                }
                                                `}
                    >
                      {complaint.status}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4">
                    {complaint.createdAt
                      ? new Date(complaint.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onView(complaint)}
                        className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center"
                      >
                        <LuEye />
                      </button>

                      
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-20 text-slate-500">
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

export default ComplaintTable;
