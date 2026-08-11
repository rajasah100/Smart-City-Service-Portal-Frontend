import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    FaArrowLeft,
    FaBuilding,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaExclamationCircle,
    FaDownload,
    FaExternalLinkAlt,
    FaFilePdf,
} from "react-icons/fa";

import { getNoticeById } from "../../redux/slices/noticeSlice";

const NoticeDetailsPage = () => {
    const { id } = useParams();

    const dispatch = useDispatch();

    const { notice, loading, error } = useSelector(
        (state) => state.notice
    );

    useEffect(() => {
        dispatch(getNoticeById(id));
    }, [dispatch, id]);


    if (!notice) return null;

    const attachment = notice.attachment?.[0];

    const isImage =
        attachment &&
        (
            attachment.type === "image" ||
            /\.(jpg|jpeg|png|webp|gif)$/i.test(attachment.url)
        );

    const isPdf =
        attachment &&
        (
            attachment.type === "pdf" ||
            /\.pdf$/i.test(attachment.url)
        );

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center text-red-600">
                {error}
            </div>
        );
    }

    if (!notice) return null;

    return (
        <section className="bg-gray-100 min-h-screen py-24">
            <div className="max-w-6xl mx-auto px-6 mt-2">

                {/* Back */}

                <Link
                    to="/notices"
                    className="inline-flex items-center gap-2 mb-6 text-[#d9a441] font-semibold"
                >
                    <FaArrowLeft />
                    Back to Notices
                </Link>

                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

                    {/* Attachment */}

                    {attachment && (
                        <>
                            {isImage ? (
                                <img
                                    src={attachment.url}
                                    alt={attachment.altText}
                                    className="w-full h-80 object-cover"
                                />
                            ) : isPdf ? (
                                <div className="bg-gray-100 p-6">

                                    {/* PDF Header */}

                                    <div className="flex items-center justify-between mb-5">

                                        <div className="flex items-center gap-3">

                                            <FaFilePdf className="text-red-600 text-4xl" />

                                            <div>
                                                <h2 className="text-xl font-bold">
                                                    PDF Document
                                                </h2>

                                                <p className="text-gray-500 text-sm">
                                                    Preview, open or download the attached document.
                                                </p>
                                            </div>

                                        </div>

                                        <div className="flex gap-3">

                                            <a
                                                href={attachment.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-5 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
                                            >
                                                <FaExternalLinkAlt className="inline mr-2" />
                                                Open PDF
                                            </a>

                                            <a
                                                href={attachment.url}
                                                download
                                                className="px-5 py-3 rounded-xl bg-[#d9a441] text-white hover:bg-yellow-600 transition"
                                            >
                                                <FaDownload className="inline mr-2" />
                                                Download
                                            </a>

                                        </div>

                                    </div>

                                    {/* PDF Preview */}

                                    <iframe
                                        src={attachment.url}
                                        title="Notice PDF"
                                        className="w-full h-212.5 rounded-xl border"
                                    />

                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-80 bg-gray-100 text-gray-500">
                                    Unsupported attachment
                                </div>
                            )}
                        </>
                    )}

                    {/* Body */}

                    <div className="p-5">

                        <div className="flex flex-wrap gap-3 mb-3">

                            <span
                                className={`px-4 py-1 rounded-full text-white text-sm ${notice.priority === "high"
                                    ? "bg-red-600"
                                    : notice.priority === "medium"
                                        ? "bg-yellow-500"
                                        : "bg-green-600"
                                    }`}
                            >
                                {notice.priority.toUpperCase()}
                            </span>

                        </div>

                        <h1 className="text-3xl font-bold text-gray-800">
                            {notice.title}
                        </h1>

                        <div className="grid md:grid-cols-2 gap-4 mt-3 text-gray-600">

                            <p className="flex items-center gap-2">
                                <FaBuilding className="text-[#d9a441]" />
                                {notice.department?.name}
                            </p>

                            <p className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-[#d9a441]" />
                                {notice.ward}
                            </p>

                            <p className="flex items-center gap-2">
                                <FaCalendarAlt className="text-[#d9a441]" />
                                {new Date(notice.createdAt).toLocaleDateString()}
                            </p>

                            <p className="flex items-center gap-2">
                                <FaExclamationCircle className="text-[#d9a441]" />
                                {notice.municipality}
                            </p>

                        </div>

                        <div className="mt-5">

                            <h2 className="text-2xl font-semibold mb-2">
                                Description
                            </h2>

                            <p className="text-gray-700 leading-8 whitespace-pre-line">
                                {notice.description}
                            </p>

                        </div>

                        {/* Image Download */}

                        {isImage && (

                            <div className="flex gap-4 mt-6">

                                <a
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="border border-[#d9a441] text-[#d9a441] px-6 py-3 rounded-xl hover:bg-[#d9a441] hover:text-white transition"
                                >
                                    <FaExternalLinkAlt className="inline mr-2" />
                                    View Image
                                </a>

                                <a
                                    href={attachment.url}
                                    download
                                    className="bg-[#d9a441] text-white px-6 py-3 rounded-xl hover:bg-yellow-600 transition"
                                >
                                    <FaDownload className="inline mr-2" />
                                    Download Image
                                </a>

                            </div>

                        )}

                    </div>

                </div>

            </div>
        </section>
    );
};

export default NoticeDetailsPage;