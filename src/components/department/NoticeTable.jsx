import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const NoticeTable = ({ notices, loading, onView, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center">
        Loading notices...
      </div>
    );
  }

  if (!notices || notices.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center text-slate-500">
        No notices found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[#0f4c81] text-white">
            <tr>
              <th className="px-6 py-4 text-left">Title</th>
              <th className="px-6 py-4 text-left">Priority</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Ward</th>
              <th className="px-6 py-4 text-left">Published</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {notices.map((notice) => (
              <tr key={notice._id} className="border-b hover:bg-slate-50">
                <td className="px-6 py-4 font-medium">{notice.title}</td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold
                    ${
                      notice.priority === "high"
                        ? "bg-red-100 text-red-600"
                        : notice.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {notice.priority}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold capitalize
                    ${
                      notice.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {notice.status}
                  </span>
                </td>

                <td className="px-6 py-4">{notice.ward}</td>

                <td className="px-6 py-4">
                  {new Date(notice.createdAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => onView(notice)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEye size={18} />
                    </button>

                    <button
                      onClick={() => onEdit(notice)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaEdit size={18} />
                    </button>

                    <button
                      onClick={() => onDelete(notice._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NoticeTable;
