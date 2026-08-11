import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEye } from "react-icons/fa";

import { getAllNotices } from "../../redux/slices/noticeSlice";
import NoticeView from "../../components/admin/notices/NoticeView";

const AdminNoticePage = () => {
  const dispatch = useDispatch();

  const { notices, loading, error } = useSelector(
    (state) => state.notice
  );

  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showView, setShowView] = useState(false);

  useEffect(() => {
    dispatch(getAllNotices());
  }, [dispatch]);

  const handleView = (notice) => {
    setSelectedNotice(notice);
    setShowView(true);
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          All Notices
        </h1>

        <p className="text-gray-500 mt-1">
          View notices published by all departments.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-10">
          Loading...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-red-600 mb-4">
          {error}
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full">

            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-4 text-left">Title</th>
                <th className="px-6 py-4 text-left">Department</th>
                <th className="px-6 py-4 text-left">Priority</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Published</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>

              {notices.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-10 text-gray-500"
                  >
                    No notices found.
                  </td>
                </tr>
              ) : (
                notices.map((notice) => (
                  <tr
                    key={notice._id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium">
                      {notice.title}
                    </td>

                    <td className="px-6 py-4">
                      {notice.department?.name}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs font-medium
                        ${notice.priority === "high"
                            ? "bg-red-600"
                            : notice.priority === "medium"
                              ? "bg-yellow-500"
                              : "bg-green-600"
                          }`}
                      >
                        {notice.priority}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs font-medium
                        ${notice.status === "active"
                            ? "bg-blue-600"
                            : "bg-gray-500"
                          }`}
                      >
                        {notice.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleView(notice)}
                        className="inline-flex items-center gap-2 bg-[#0f4c81] hover:bg-[#0d3d67] text-white px-4 py-2 rounded-lg"
                      >
                        <FaEye />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}

            </tbody>

          </table>
        </div>
      )}

      {/* View Modal */}
      {showView && (
        <NoticeView
          notice={selectedNotice}
          onClose={() => {
            setShowView(false);
            setSelectedNotice(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminNoticePage;