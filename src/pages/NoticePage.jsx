import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    FaCalendarAlt,
    FaBuilding,
    FaSearch,
    FaArrowRight,
    FaMapMarkerAlt,
    FaFilePdf,
} from "react-icons/fa";

import { getNotices, getNewArrivals } from "../redux/slices/noticeSlice";
import city from "../assets/city1.webp";
import { getDepartments } from "../redux/slices/departmentSlice";
import { Link } from "react-router-dom";

const NoticePage = () => {
    const dispatch = useDispatch();

    const { notices, newArrivals, loading, error } = useSelector((state) => state.notice);
    const { departments } = useSelector((state) => state.department)

    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const latestRef = useRef(null);
    const noticeRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        dispatch(getDepartments());
        dispatch(getNewArrivals());
    }, [dispatch]);


    useEffect(() => {
        dispatch(
            getNotices({
                search: debouncedSearch,
                department,
            })
        );
    }, [dispatch, debouncedSearch, department]);


    return (
        <section className="bg-gray-100 min-h-screen py-26">
            <div className="max-w-7xl mx-auto px-8">
                {/* Header */}
                <section className="relative overflow-hidden rounded-3xl mb-10">
                    {/* Background Image */}
                    <img
                        src={city}
                        alt="City"
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Overlay */}

                    <div className="absolute inset-0 bg-black/70"></div>

                    {/* Content */}

                    <div className="relative z-10 px-10 py-20 md:px-16">
                        <span className="inline-block border border-slate-400 text-white px-5 py-2 rounded-full text-sm font-semibold">
                            Smart City Service Portal
                        </span>

                        <h1 className="text-white text-4xl md:text-6xl font-bold mt-6 leading-tight">
                            City Notices &
                            <br />
                            Public Announcements
                        </h1>

                        <p className="text-gray-200 mt-6 max-w-2xl text-lg leading-8">
                            Stay informed with official notices, emergency alerts, maintenance
                            updates, public events, and important announcements published by
                            municipal departments.
                        </p>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => noticeRef.current?.scrollIntoView({
                                    behavior: "smooth",
                                })}
                                className="bg-[#d9a441] hover:bg-yellow-600 transition px-6 py-3 rounded-xl font-semibold text-white"
                            >
                                Explore Notices
                            </button>

                            <button
                                onClick={() => latestRef.current?.scrollIntoView({
                                    behavior: "smooth"
                                })}
                                className="border border-white text-white px-6 py-3 rounded-xl hover:bg-white hover:text-black transition"
                            >
                                Latest Updates
                            </button>
                        </div>
                    </div>
                </section>


                <div ref={latestRef} className="mb-14">

                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">
                                Latest Updates
                            </h2>

                            <p className="text-gray-500 mt-1">
                                Recently published notices from different departments.
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                noticeRef.current?.scrollIntoView({
                                    behavior: "smooth",
                                })
                            }
                            className="flex items-center gap-2 text-[#d9a441] font-semibold hover:gap-3 transition"
                        >
                            View All
                            <FaArrowRight />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">

                        {newArrivals.map((notice) => (

                            <div
                                key={notice._id}
                                className="bg-white rounded-xl overflow-hidden shadow"
                            >

                                {!notice.attachment?.length ? (

                                    <div className="h-44 bg-gray-100 flex items-center justify-center text-gray-500">
                                        No Attachment
                                    </div>

                                ) : notice.attachment[0].type === "image" ? (

                                    <img
                                        src={notice.attachment[0].url}
                                        alt={notice.attachment[0].altText}
                                        className="h-44 w-full object-cover"
                                    />

                                ) : (

                                    <a
                                        href={notice.attachment[0].url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-44 flex flex-col justify-center items-center bg-red-50 hover:bg-red-100"
                                    >
                                        <FaFilePdf className="text-red-600 text-6xl" />

                                        <span className="mt-2 text-red-600">
                                            Open PDF
                                        </span>

                                    </a>

                                )}

                                <div className="p-5">

                                    <h3 className="font-semibold line-clamp-2">
                                        {notice.title}
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-2">
                                        {notice.department?.name}
                                    </p>

                                    <Link
                                        to={`/notices/${notice._id}`}
                                        className="text-[#d9a441] mt-4 inline-block"
                                    >
                                        Read More →
                                    </Link>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>


                {/* Filter */}

                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8">

                    <div className="flex items-center justify-between mb-5">

                        <h2 className="text-xl font-semibold text-gray-800">
                            Search Notices
                        </h2>

                        <button
                            onClick={() => {
                                setSearch("");
                                setDepartment("");
                            }}
                            className="text-sm text-[#d9a441] hover:underline"
                        >
                            Reset
                        </button>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* Search */}

                        <div className="relative md:col-span-2">

                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                            <input
                                type="text"
                                placeholder="Search by title..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-[#d9a441] focus:ring-2 focus:ring-[#d9a441]/20"
                            />

                            {loading && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <div className="h-5 w-5 rounded-full border-2 border-[#d9a441] border-t-transparent animate-spin"></div>
                                </div>
                            )}

                        </div>

                        {/* Department */}

                        <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#d9a441] focus:ring-2 focus:ring-[#d9a441]/20"
                        >

                            <option value="">All Departments</option>

                            {departments?.map((dept) => (
                                <option
                                    key={dept._id}
                                    value={dept._id}
                                >
                                    {dept.name}
                                </option>
                            ))}

                        </select>

                    </div>

                </div>
                {error && <p className="text-red-500 mb-5">{error}</p>}

                {/* Notice Cards */}
                <div ref={noticeRef}>
                    {notices.length === 0 ? (
                        <p className="text-center text-gray-500">No notices available</p>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-6">
                            {notices.map((notice) => (
                                <div
                                    key={notice._id}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                >

                                    {/* Attachment */}

                                    <div className="relative h-56 overflow-hidden">

                                        {!notice.attachment?.length ? (
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                No Attachment
                                            </div>
                                        ) : notice.attachment[0].type === "image" ? (
                                            <img
                                                src={notice.attachment[0].url}
                                                alt={notice.attachment[0].altText}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <a
                                                href={notice.attachment[0].url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full h-full bg-red-50 flex flex-col items-center justify-center hover:bg-red-100"
                                            >
                                                <FaFilePdf className="text-red-600 text-7xl" />
                                                <p className="mt-3 font-medium text-red-600">
                                                    Open PDF
                                                </p>
                                            </a>
                                        )}

                                        {/* Priority Badge */}
                                        <span
                                            className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white ${notice.priority === "high"
                                                    ? "bg-red-600"
                                                    : notice.priority === "medium"
                                                        ? "bg-yellow-500"
                                                        : "bg-green-600"
                                                }`}
                                        >
                                            {notice.priority.toUpperCase()}
                                        </span>

                                    </div>

                                    {/* Body */}

                                    <div className="p-6">

                                        <h2 className="text-xl font-bold text-gray-800 line-clamp-2">
                                            {notice.title}
                                        </h2>

                                        <p className="text-gray-600 mt-3 line-clamp-3">
                                            {notice.description}
                                        </p>

                                        {/* Info */}

                                        <div className="space-y-3 mt-5 text-sm text-gray-500">

                                            <div className="flex items-center gap-2">
                                                <FaBuilding className="text-[#d9a441]" />
                                                {notice.department?.name}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <FaMapMarkerAlt className="text-[#d9a441]" />
                                                {notice.ward}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="text-[#d9a441]" />
                                                {new Date(notice.createdAt).toLocaleDateString()}
                                            </div>

                                        </div>

                                        {/* Button */}

                                        <Link
                                            to={`/notices/${notice._id}`}
                                            className="mt-6 inline-flex items-center gap-2 text-[#d9a441] font-semibold hover:gap-3 transition-all"
                                        >
                                            Read More
                                            <FaArrowRight />
                                        </Link>

                                    </div>

                                </div>
                            ))}

                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default NoticePage;
