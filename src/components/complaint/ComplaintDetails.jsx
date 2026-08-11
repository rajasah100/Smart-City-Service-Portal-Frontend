import { FiFileText, FiAlertTriangle } from "react-icons/fi";
import ImageUploader from "./ImageUploader";


const priorities = [
    {
        id: "low",
        label: "Low",
        color: "bg-green-100 border-green-500 text-green-700",
    },
    {
        id: "medium",
        label: "Medium",
        color: "bg-yellow-100 border-yellow-500 text-yellow-700",
    },
    {
        id: "high",
        label: "High",
        color: "bg-red-100 border-red-500 text-red-700",
    },
];


const ComplaintDetails = ({ data, updateField }) => {
    return (
        <div>
            {/* Heading */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold">
                    Complaint Details
                </h2>
                <p className="text-gray-500 mt-2">
                    Please provide detailed information about your complaint.
                </p>
            </div>
            {/* Complaint Title */}
            <div className="mb-6">
                <label className="block font-semibold text-gray-700 mb-2">Complaint Title</label>

                <div className="relative">
                    <FiFileText size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                    <input
                        type="text"
                        value={data.title}
                        required
                        onChange={(e) => updateField("title", e.target.value)}
                        placeholder="Enter complaint title"
                        className="w-full pl-12 pr-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-[#0f4c81] focus:border-[#0f4c81] outline-none"
                    />
                </div>
            </div>

            {/* Description Title */}
            <div className="mb-6">
                <label className="block font-semibold text-gray-700 mb-2">Description</label>

                <textarea
                    rows={6}
                    required
                    maxLength={500}
                    value={data.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Describe the issue, when it occurred, and any other useful information..."
                    className="w-full border rounded-lg border-gray-300 p-3 resize-none focus:ring-2 focus:ring-[#0f4c81] focus:border-[#0f4c81] outline-none "
                />

                <div className="flex justify-between mt-2">
                    <p className="text-xs text-gray-400">
                        Minimum 20 characters recommended.
                    </p>

                    <p className="text-xs text-gray-500">
                        {data.description.length}/500
                    </p>
                </div>

            </div>

            {/* Priority */}
            <div className="mb-8">
                <label className="block font-semibold text-gray-700 mb-3">
                    Complaint Priority
                </label>

                <div className="grid grid-cols-3 gap-4">
                    {priorities.map((priority) => (
                        <button
                            key={priority.id}
                            type="button"
                            onClick={() => updateField("priority", priority.id)}
                            className={`border-2 rounded-xl p-4 transition-all ${data.priority === priority.id ? priority.color : "border-gray-200 bg-white hover:border-[#0f4c81]"}`}
                        >
                            <FiAlertTriangle size={22} className="mx-auto mb-2" />
                            <p className="font-semibold">
                                {priority.label}
                            </p>

                        </button>
                    ))}
                </div>
            </div>

            {/* Image Upload */}
            <ImageUploader
                images={data.images}
                updateField={updateField}
            />
        </div>
    )
}

export default ComplaintDetails
