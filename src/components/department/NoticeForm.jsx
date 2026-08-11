import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    createNotice,
    updateNotice,
} from "../../redux/slices/noticeSlice";
import { toast } from "react-toastify";
import { LuX } from "react-icons/lu";

const NoticeForm = ({ notice, onClose }) => {
    const dispatch = useDispatch();

    const { loading } = useSelector((state) => state.notice);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        municipality: "Kathmandu Metropolitan City",
        ward: "",
        priority: "low",
        status: "active",
    });

    const [file, setFile] = useState(null);

    useEffect(() => {
        if (notice) {
            setFormData({
                title: notice.title || "",
                description: notice.description || "",
                municipality:
                    notice.municipality || "Kathmandu Metropolitan City",
                ward: notice.ward || "",
                priority: notice.priority || "low",
                status: notice.status || "active",
            });
        }
    }, [notice]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();

        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });

        if (file) {
            data.append("attachment", file);
        }

        try {
            if (notice) {
                await dispatch(
                    updateNotice({
                        id: notice._id,
                        formData: data,
                    })
                ).unwrap();

                toast.success("Notice updated successfully");
            } else {
                await dispatch(createNotice(data)).unwrap();

                toast.success("Notice created successfully");
            }

            onClose();
        } catch (err) {
            toast.error(err?.message || "Operation failed");
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-xl shadow-xl flex flex-col">

                {/* Header */}
                <div className="sticky top-0 bg-white z-20 border-b flex justify-between items-center p-5 rounded-t-xl">
                    <h2 className="text-xl md:text-2xl font-bold">
                        {notice ? "Edit Notice" : "Create Notice"}
                    </h2>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        <LuX size={22} />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="flex-1 overflow-y-auto p-6 space-y-5"
                >
                    {/* Title */}
                    <div>
                        <label className="block mb-2 font-semibold">
                            Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block mb-2 font-semibold">
                            Description
                        </label>

                        <textarea
                            rows={5}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        />
                    </div>

                    {/* Municipality & Ward */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block mb-2 font-semibold">
                                Municipality
                            </label>

                            <input
                                type="text"
                                name="municipality"
                                value={formData.municipality}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold">
                                Ward
                            </label>

                            <input
                                type="text"
                                name="ward"
                                value={formData.ward}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            />
                        </div>
                    </div>

                    {/* Priority & Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block mb-2 font-semibold">
                                Priority
                            </label>

                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        {notice && (
                            <div>
                                <label className="block mb-2 font-semibold">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-3"
                                >
                                    <option value="active">Active</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Attachment */}
                    <div>
                        <label className="block mb-2 font-semibold">
                            Attachment (Image / PDF)
                        </label>

                        <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,.pdf"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="w-full border rounded-lg p-3"
                        />
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-white border-t pt-5 flex flex-col-reverse sm:flex-row justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto px-6 py-3 border rounded-lg hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto px-6 py-3 bg-[#0f4c81] text-white rounded-lg hover:bg-[#0d3d67] disabled:opacity-60"
                        >
                            {loading
                                ? "Saving..."
                                : notice
                                    ? "Update Notice"
                                    : "Create Notice"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NoticeForm;  