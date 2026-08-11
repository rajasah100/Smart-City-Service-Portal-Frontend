import { Link } from "react-router-dom";
import { LuEye } from "react-icons/lu";
import { useSelector } from "react-redux";

const RecentComplaints = () => {
    const { complaints } = useSelector((state) => state.complaint);

    const recentComplaints = [...complaints]
        .sort(
            (a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
        )
        .slice(0, 5);

    const statusColor = {
        pending: "bg-yellow-100 text-yellow-700",
        assigned: "bg-blue-100 text-blue-700",
        "in-progress": "bg-purple-100 text-purple-700",
        resolved: "bg-green-100 text-green-700",
        rejected: "bg-red-100 text-red-700",
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between p-5 border-b">
                <div>
                    <h2 className="font-bold text-lg text-slate-800">
                        Recent Complaints
                    </h2>

                    <p className="text-sm text-slate-500">
                        Your latest submitted complaints
                    </p>
                </div>

                <Link
                    to="/user/complaints"
                    className="text-blue-600 text-sm font-semibold hover:underline"
                >
                    View All
                </Link>
            </div>

            <div className="divide-y">

                {recentComplaints.length > 0 ? (

                    recentComplaints.map((item) => (

                        <div
                            key={item._id}
                            className="flex items-center justify-between p-4 hover:bg-slate-50"
                        >
                            <div>
                                <h3 className="font-semibold text-slate-800">
                                    {item.title}
                                </h3>

                                <p className="text-sm text-slate-500">
                                    {item.department?.name}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">

                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[item.status]
                                        }`}
                                >
                                    {item.status}
                                </span>

                                <Link
                                    to={`/user/complaints/${item.complaintId}`}
                                    className="w-9 h-9 rounded-lg bg-blue-100 hover:bg-blue-200 flex items-center justify-center text-blue-600"
                                >
                                    <LuEye />
                                </Link>

                            </div>
                        </div>

                    ))

                ) : (

                    <div className="text-center py-10 text-slate-500">
                        No complaints found.
                    </div>

                )}
            </div>
        </div>
    );
};

export default RecentComplaints;