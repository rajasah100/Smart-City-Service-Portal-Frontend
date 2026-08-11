import { useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { LuCalendar } from "react-icons/lu";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getNewArrivals } from "../../redux/slices/noticeSlice";

const LatestNotice = () => {
    const dispatch = useDispatch();

    const { newArrivals, loading } = useSelector((state) => state.notice);

    useEffect(() => {
        dispatch(getNewArrivals());
    }, [dispatch]);

    return (
        <div className="lg:col-span-2">
            {/* Heading */}
            <div className="mb-8 flex items-end justify-between">
                <div>
                    <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-[#d9a441]">
                        Latest News
                    </p>

                    <h2 className="text-2xl font-bold text-[#10151c] sm:text-3xl">
                        Announcements
                    </h2>
                </div>

                <Link
                    to="/notices"
                    className="flex items-center gap-2 text-sm font-semibold text-[#2c5d79] transition hover:text-[#234b61]"
                >
                    View All
                    <FaArrowRight className="text-xs" />
                </Link>
            </div>

            {/* Notices */}
            <div className="space-y-5">
                {loading ? (
                    [...Array(3)].map((_, index) => (
                        <div
                            key={index}
                            className="animate-pulse rounded-xl border border-gray-200 bg-white p-5"
                        >
                            <div className="mb-3 h-4 w-24 rounded bg-gray-200"></div>
                            <div className="mb-2 h-6 w-3/4 rounded bg-gray-200"></div>
                            <div className="mb-2 h-4 rounded bg-gray-200"></div>
                            <div className="h-4 w-2/3 rounded bg-gray-200"></div>
                        </div>
                    ))
                ) : newArrivals.length > 0 ? (
                    newArrivals.map((notice) => (
                        <Link
                            key={notice._id}
                            to={`/notices/${notice._id}`}
                            className="group flex gap-4 rounded-xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div className="w-1 rounded-full bg-[#d9a441]"></div>

                            <div className="flex-1">
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                                        {notice.department?.name}
                                    </span>

                                    <span className="flex items-center gap-1 text-xs text-slate-500">
                                        <LuCalendar />
                                        {new Date(notice.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <h3 className="mb-2 text-lg font-semibold text-slate-800 transition group-hover:text-[#2c5d79]">
                                    {notice.title}
                                </h3>

                                <p className="line-clamp-2 text-sm leading-6 text-slate-500">
                                    {notice.description}
                                </p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-white py-10 text-center">
                        <p className="text-gray-500">
                            No announcements available.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LatestNotice;