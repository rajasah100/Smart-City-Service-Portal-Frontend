import { LuX, LuTrash2 } from "react-icons/lu";
import { FiAlertTriangle } from "react-icons/fi";

const DeleteComplaintModal = ({
  open,
  complaint,
  loading,
  onClose,
  onDelete,
}) => {
  if (!open || !complaint) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b">
          <h2
            className="text-xl font-bold text-slate-800"
          >
            Delete Complaint
          </h2>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center"
          >
            <LuX size={22} />
          </button>
        </div>

        {/* Body */}
        <div
          className="p-6 text-center"
        >
          <div
            className="w-16 h-16 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-5"
          >
            <FiAlertTriangle size={32} />
          </div>
          <h3
            className="text-lg font-bold text-slate-800"
          >
            Are you sure?
          </h3>
          <p
            className="text-slate-500 mt-2 leading-6"
          >
            You want to delete this complaint?
            <br />
            This action cannot be undone.
          </p>

          <div
            className="mt-5 bg-slate-50 rounded-xl p-4 text-left"
          >
            <p
              className="text-sm text-slate-500"
            >
              Complaint ID
            </p>

            <p
              className="font-semibold text-slate-800"
            >
              {complaint.complaintId}
            </p>

            <p
              className="text-sm text-slate-500 mt-3"
            >
              Title
            </p>

            <p
              className="font-semibold text-slate-800"
            >
              {complaint.title}
            </p>
          </div>
        </div>

        {/* Footer */}

        <div
          className="px-6 py-5 border-t flex justify-end gap-3"
        >
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-3 rounded-xl border font-semibold hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={() => onDelete(complaint._id)}
            disabled={loading}
            className="px-5 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 flex items-center gap-2 disabled:opacity-50"
          >
            <LuTrash2 />

            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteComplaintModal;
