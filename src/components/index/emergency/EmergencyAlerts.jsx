import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    FaBolt,
    FaExclamationTriangle,
    FaRoad,
    FaTint,
} from "react-icons/fa";
import { getNotices } from "../../../redux/slices/noticeSlice";

const EmergencyAlerts = () => {
    const dispatch = useDispatch();

    const { notices, loading } = useSelector((state) => state.notice);

    // console.log(notices)

    useEffect(() => {
        dispatch(getNotices({ category: "Emergency" }));
    }, [dispatch]);

    const getIcon = (departmentName = "") => {
        const name = departmentName.toLowerCase();

        if (name.includes("water")) {
            return <FaTint />;
        }

        if (name.includes("electric")) {
            return <FaBolt />;
        }

        if (name.includes("road") || name.includes("transport")) {
            return <FaRoad />;
        }

        return <FaExclamationTriangle />;
    };

    if (loading) {
        return (
            <section className="py-10 text-center">
                Loading emergency alerts...
            </section>
        );
    }

    return (
        <section className="py-8 bg-white">
            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-12">
                    <span className="text-red-600 font-semibold uppercase">
                        Latest Alerts
                    </span>

                    <h2 className="text-4xl font-bold text-green-800 mt-2">
                        Emergency Alerts
                    </h2>

                    <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
                        Stay informed with the latest emergency announcements issued by the municipality.
                    </p>
                </div>

                {notices.length === 0 ? (
                    <div className="text-center text-gray-500">
                        No emergency alerts available.
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {notices.slice(0, 6).map((notice) => (
                            <div
                                key={notice._id}
                                className="border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
                            >
                                <div className="flex items-start gap-4">

                                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl bg-red-100 text-red-600">
                                        {getIcon(notice.department?.name)}
                                    </div>

                                    <div className="flex-1">

                                        <div className="flex justify-between items-center flex-wrap gap-2">

                                            <h3 className="font-semibold text-lg">
                                                {notice.title}
                                            </h3>

                                            <span className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-full">
                                                {notice.department?.name}
                                            </span>

                                        </div>

                                        <p className="text-gray-600 mt-3">
                                            {notice.description}
                                        </p>

                                        <p className="text-sm text-gray-500 mt-3">
                                            {notice.ward}
                                        </p>

                                        <p className="text-xs text-gray-400 mt-2">
                                            Updated: {new Date(notice.createdAt).toLocaleDateString()}
                                        </p>

                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </section>
    );
};

export default EmergencyAlerts;