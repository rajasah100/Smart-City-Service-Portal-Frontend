import { FaClock, FaFlag, FaFolderOpen } from "react-icons/fa";
import { AiFillFileText } from "react-icons/ai";


const Detail = ({ icon: Icon, label, value }) => (
    <div className="flex gap-3 py-3 border-b last:border-b-0">
        <Icon className="text-[#0f4c81] mt-1" />
        <div>
            <p className="text-gray-500">{label}</p>
            <p className="font-semibold capitalize">{value || "-"}</p>
        </div>
    </div>
);

const ComplaintInfo = ({ complaint }) => {
    return (
        <div className="bg-white rounded-xl shadow border mt-2">
            <div className="border-b px-6 py-4">

                <h2 className="font-bold text-lg">
                    Complaint Information
                </h2>
            </div>

            <div className="pl-6 pr-6">
                <Detail
                icon={FaFolderOpen}
                label="Department"
                value={complaint.department?.name}
                />

                <Detail
                icon={AiFillFileText}
                label="Title"
                value={complaint.title}
                />
                <Detail
                icon={AiFillFileText}
                label="Description"
                value={complaint.description}
                />
                <Detail
                icon={FaFlag}
                label="Priority"
                value={complaint.priority}
                />
                <Detail
                icon={FaClock}
                label="Status"
                value={complaint.status}
                />
            </div>
        </div>
    )
}

export default ComplaintInfo
