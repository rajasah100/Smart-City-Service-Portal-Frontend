import { LuTrash2, LuX } from "react-icons/lu";

const DeleteUserModal = ({
    isOpen,
    onClose,
    onDelete,
    user,
    loading = false,
}) => {
    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between border-b p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center">
                            <LuTrash2 className="text-red-600" size={22} />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-slate-800">
                                Delete User
                            </h2>
                            <p className="text-sm text-slate-500">
                                This action cannot be undone.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-red-600"
                    >
                        <LuX size={22} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-slate-600">
                        Are you sure you want to permanently delete this user?
                    </p>

                    <div className="mt-5 bg-slate-50 rounded-xl p-4 border">
                        <h3 className="font-semibold text-slate-800">
                            {user.name}
                        </h3>

                        <p className="text-sm text-slate-500">
                            {user.email}
                        </p>

                        <span className="inline-block mt-3 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold capitalize">
                            {user.role}
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t p-5">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 transition"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={loading}
                        onClick={() => onDelete(user._id)}
                        className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-50"
                    >
                        {loading ? "Deleting..." : "Delete User"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteUserModal;