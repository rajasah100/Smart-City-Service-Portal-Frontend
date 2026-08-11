import { useParams, useNavigate } from "react-router-dom"
import ComplaintTimeline from "../../components/user/ComplaintTimeline"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { trackComplaint } from "../../redux/slices/complaintSlice"
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ComplaintInfo from "../../components/user/ComplaintInfo";
import ComplaintImages from "../../components/user/ComplaintImages";
import ComplaintLocation from "../../components/user/ComplaintLocation";
import { LuArrowLeft } from "react-icons/lu";


const ComplaintDetailPage = () => {
    const { complaintId } = useParams();

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const { complaint, loading, error } = useSelector((state) => state.complaint);

    useEffect(() => {
        dispatch(trackComplaint(complaintId));
    }, [dispatch, complaintId]);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <LoadingSpinner />
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-600">
                {error}
            </div>
        )
    }

    if (!complaint) {
        return (
            <div className="bg-white rounded-xl border p-6 text-center">
                Complaint not found.
            </div>
        );
    }


    return (
        <div className="space-y-6">
            {/* Heading */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h1 className="text-2xl font-bold text-[#10151c]">Complaint Details</h1>

                <p className="text-slate-500 mt-2">
                    Complaint ID:
                    <span className="font-semibold ml-2">
                        {complaint.complaintId}
                    </span>
                </p>

                {/* Timeline */}
                <ComplaintTimeline status={complaint.status} />

                {/* Complaint Information */}
                <ComplaintInfo complaint={complaint} />

                {/* Images */}
                <ComplaintImages images={complaint.images} />

                {/* Location */}
                <ComplaintLocation complaint={complaint.location} />
            </div>

            <button
                onClick={() => navigate("/user/complaints")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#4a6c8f] text-[#4a6c8f] hover:bg-[#4a6c8f] hover:text-white transition cursor-pointer"
            >
                <LuArrowLeft size={18} />
                Back to My Complaints
            </button>

        </div>
    )
}

export default ComplaintDetailPage
