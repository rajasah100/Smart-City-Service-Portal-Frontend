import { LuEye } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { PRIORITY_STYLE, STATUS_STYLE } from "../../department/deptUtils";
import { formatBS } from "../../../utils/nepaliDate";

import { FaUserCircle } from "react-icons/fa";

const ComplaintTable = ({ complaints = [], loading, onView }) => {
  const { t, i18n } = useTranslation();
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
              <th className="px-4 py-3.5">Complaint</th>

              <th className="px-4 py-3.5">Citizen</th>

              <th className="px-4 py-3.5">Department</th>

              <th className="px-4 py-3.5">Priority</th>

              <th className="px-4 py-3.5">Status</th>

              <th className="px-4 py-3.5">Date</th>

              <th className="px-4 py-3.5 text-center">Action</th>
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
                  <td className="px-4 py-3.5">
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
                  <td className="px-4 py-3.5">
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

                      <div className="min-w-0">
                        <p className="whitespace-nowrap font-medium text-slate-800">
                          {complaint.user?.name || "-"}
                        </p>
                        <p className="max-w-44 truncate text-xs text-slate-500" title={complaint.user?.email}>
                          {complaint.user?.email || ""}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="px-4 py-3.5">
                    {complaint.department?.name || "-"}
                  </td>

                  {/* Priority */}
                  <td className="px-4 py-3.5">
                    <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${PRIORITY_STYLE[complaint.priority]?.badge || "bg-slate-100 text-slate-700"}`}>
                      {t(`userDash.priority.${complaint.priority}`, { defaultValue: complaint.priority })}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ring-1 ${STATUS_STYLE[complaint.status]?.badge || "bg-slate-100 text-slate-700 ring-slate-200"}`}>
                      {t(`userDash.status.${complaint.status}`, { defaultValue: complaint.status })}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="whitespace-nowrap px-4 py-3.5 text-sm">
                    {complaint.createdAt
                      ? formatBS(complaint.createdAt, i18n.resolvedLanguage === "en", "YYYY MMMM DD")
                      : "-"}
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3.5">
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
