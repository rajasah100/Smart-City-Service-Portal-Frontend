import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    LuX,
    LuUser,
    LuBuilding2,
    LuMail,
    LuPhone,
    LuCalendarDays,
} from "react-icons/lu";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

import { updateComplaintStatus } from "../../redux/slices/complaintSlice";
import { getDepartmentProfile } from "../../redux/slices/departmentSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";

const statusColor = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
    assigned: "bg-blue-100 text-blue-700 border-blue-300",
    "in-progress": "bg-purple-100 text-purple-700 border-purple-300",
    resolved: "bg-green-100 text-green-700 border-green-300",
    rejected: "bg-red-100 text-red-700 border-red-300",
};

const priorityColor = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-700",
};

const ComplaintView = ({ complaint, onClose }) => {
    const dispatch = useDispatch();

    const { department } = useSelector((state) => state.department)

    useEffect(() => {
        dispatch(getDepartmentProfile());
    }, [dispatch])

    const { updateLoading } = useSelector((state) => state.complaint);

    // Initialize hooks from complaint if available
    const [status, setStatus] = useState(complaint?.status || "pending");

    const [resolutionNote, setResolutionNote] = useState(
        complaint?.resolutionNote || ""
    );


    if (!complaint) return null;

    const handleSave = async () => {

        if (
            (status === "resolved" || status === "rejected") &&
            !resolutionNote.trim()
        ) {
            toast.error("Resolution note is required.");
            return;
        }

        try {

            await dispatch(
                updateComplaintStatus({
                    id: complaint._id,
                    status,
                    resolutionNote,
                })
            ).unwrap();

            toast.success("Complaint status updated successfully!");
            onClose();

        } catch (err) {
            toast.error(err || "Failed to update complaint.");
        }
    };



    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">

            <div className="bg-slate-50 w-full max-w-7xl rounded-2xl shadow-2xl overflow-y-auto max-h-[95vh] relative">

                {/* Close Button */}

                <button
                    onClick={onClose}
                    className="absolute right-5 top-5 bg-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center"
                >
                    <LuX size={20} />
                </button>

                {/* Header */}

                <div className="bg-linear-to-r from-[#0f4c81] to-[#2d6fa8] text-white p-8">

                    <div className="flex justify-between items-center flex-wrap gap-4">

                        <div>

                            <h1 className="text-3xl font-bold">
                                Complaint Details
                            </h1>

                            <p className="text-blue-100 mt-2">
                                {complaint.complaintId}
                            </p>

                        </div>

                        <div className="flex gap-3">

                            <span
                                className={`px-5 py-2 rounded-full border capitalize font-semibold ${statusColor[status]}`}
                            >
                                {status}
                            </span>

                            <span
                                className={`px-5 py-2 rounded-full capitalize font-semibold ${priorityColor[complaint.priority]}`}
                            >
                                {complaint.priority}
                            </span>

                        </div>

                    </div>

                </div>

                {/* Body */}

                <div className="p-8 space-y-8">

                    {/* Citizen + Department */}

                    <div className="grid lg:grid-cols-2 gap-6">

                        {/* Citizen */}

                        <div className="bg-white rounded-xl shadow border">

                            <div className="border-b px-6 py-4">
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    <LuUser />
                                    Citizen Information
                                </h2>
                            </div>

                            <div className="p-6">

                                <div className="flex items-center gap-4">

                                    <div className="w-16 h-16 rounded-full bg-[#0f4c81] text-white flex items-center justify-center text-2xl font-bold">

                                        {complaint.user?.name
                                            ? complaint.user.name.charAt(0).toUpperCase()
                                            : "U"}

                                    </div>

                                    <div>

                                        <h2 className="font-bold text-xl">
                                            {complaint.user?.name || "Unknown User"}
                                        </h2>

                                        <p className="text-slate-500">
                                            Registered Citizen
                                        </p>

                                    </div>

                                </div>

                                <div className="mt-8 space-y-5">

                                    <div className="flex gap-3 items-center">

                                        <LuMail className="text-[#0f4c81]" />

                                        <span>
                                            {complaint.user?.email || "N/A"}
                                        </span>

                                    </div>

                                    <div className="flex gap-3 items-center">

                                        <LuPhone className="text-[#0f4c81]" />

                                        <span>
                                            {complaint.user?.phone || "N/A"}
                                        </span>

                                    </div>

                                    <div className="flex gap-3 items-center">

                                        <LuCalendarDays className="text-[#0f4c81]" />

                                        <span>
                                            {new Date(
                                                complaint.createdAt
                                            ).toLocaleDateString()}
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* Department */}

                        <div className="bg-white rounded-xl border shadow-sm">

                            <div className="border-b px-6 py-4">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <LuBuilding2 />
                                    Department Information
                                </h3>
                            </div>

                            <div className="p-6">

                                <div className="flex items-center gap-4 mb-6">

                                    <div className="w-16 h-16 rounded-full bg-[#0f4c81] text-white flex items-center justify-center text-2xl font-bold">
                                        {department?.name?.charAt(0)}
                                    </div>

                                    <div>

                                        <h2 className="text-xl font-bold">
                                            {department?.name || "Department"}
                                        </h2>

                                        <p className="text-slate-500">
                                            Responsible Department
                                        </p>

                                    </div>

                                </div>

                                <div className="space-y-4">

                                    <div className="space-y-4">

                                        <div className="flex items-center gap-3">
                                            <LuMail className="text-[#0f4c81]" />
                                            <span>{department?.email || "N/A"}</span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <LuPhone className="text-[#0f4c81]" />
                                            <span>{department?.phone || "N/A"}</span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <LuBuilding2 className="text-[#0f4c81]" />
                                            <span>{department?.address || "N/A"}</span>
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Complaint Information */}

                    <div className="bg-white rounded-xl shadow border">

                        <div className="border-b px-6 py-4">
                            <h2 className="text-lg font-bold">
                                Complaint Information
                            </h2>
                        </div>

                        <div className="p-6 space-y-6">

                            {/* Title */}

                            <div>

                                <label className="font-semibold text-slate-700">
                                    Complaint Title
                                </label>

                                <div className="mt-2 p-4 rounded-lg bg-slate-50 border">
                                    {complaint.title}
                                </div>

                            </div>

                            {/* Description */}

                            <div>

                                <label className="font-semibold text-slate-700">
                                    Description
                                </label>

                                <div className="mt-2 p-4 rounded-lg bg-slate-50 border leading-7">
                                    {complaint.description}
                                </div>

                            </div>

                            {/* Priority */}

                            <div>

                                <label className="font-semibold text-slate-700">
                                    Priority
                                </label>

                                <div className="mt-2">

                                    <span
                                        className={`px-4 py-2 rounded-full font-semibold capitalize ${priorityColor[complaint.priority]}`}
                                    >
                                        {complaint.priority}
                                    </span>

                                </div>

                            </div>

                            {/* Status */}

                            <div>

                                <label className="font-semibold text-slate-700 block mb-2">
                                    Update Complaint Status
                                </label>

                                <select
                                    value={status}
                                    onChange={(e) => {
                                        const newStatus = e.target.value;

                                        setStatus(newStatus);

                                        if (
                                            newStatus !== "resolved" &&
                                            newStatus !== "rejected"
                                        ) {
                                            setResolutionNote("");
                                        }
                                    }}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium outline-none transition focus:ring-2 focus:ring-[#0f4c81] focus:border-[#0f4c81] cursor-pointer"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="assigned">Assigned</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="rejected">Rejected</option>
                                </select>

                            </div>

                            {/* Resolution */}

                            {(status === "resolved" || status === "rejected") && (
                                <div>
                                    <label className="font-semibold block mb-2">
                                        Resolution Note
                                    </label>

                                    <textarea
                                        rows={5}
                                        value={resolutionNote}
                                        onChange={(e) => setResolutionNote(e.target.value)}
                                        placeholder="Write resolution..."
                                        className="w-full border rounded-xl p-4"
                                    />
                                </div>
                            )}


                        </div>

                    </div>

                    {/* ================= Location ================= */}

                    <div className="bg-white rounded-xl shadow border">

                        <div className="border-b px-6 py-4">
                            <h2 className="text-xl font-bold">
                                📍 Complaint Location
                            </h2>
                        </div>

                        <div className="p-6 grid lg:grid-cols-2 gap-6">

                            {/* Location Details */}
                            <div className="space-y-4">

                                <div className="grid grid-cols-2 gap-4">

                                    <div className="bg-slate-50 p-4 rounded-lg">
                                        <p className="text-sm text-slate-500">Province</p>
                                        <p className="font-semibold">{complaint.location?.province}</p>
                                    </div>

                                    <div className="bg-slate-50 p-4 rounded-lg">
                                        <p className="text-sm text-slate-500">District</p>
                                        <p className="font-semibold">{complaint.location?.district}</p>
                                    </div>

                                    <div className="bg-slate-50 p-4 rounded-lg">
                                        <p className="text-sm text-slate-500">Municipality</p>
                                        <p className="font-semibold">{complaint.location?.municipality}</p>
                                    </div>

                                    <div className="bg-slate-50 p-4 rounded-lg">
                                        <p className="text-sm text-slate-500">Ward</p>
                                        <p className="font-semibold">{complaint.location?.ward}</p>
                                    </div>

                                </div>

                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <p className="text-sm text-slate-500">Tole</p>
                                    <p className="font-semibold">
                                        {complaint.location?.tole}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">

                                    <div className="bg-slate-50 p-4 rounded-lg">
                                        <p className="text-sm text-slate-500">
                                            Latitude
                                        </p>

                                        <p className="font-semibold">
                                            {complaint.location?.latitude}
                                        </p>
                                    </div>

                                    <div className="bg-slate-50 p-4 rounded-lg">
                                        <p className="text-sm text-slate-500">
                                            Longitude
                                        </p>

                                        <p className="font-semibold">
                                            {complaint.location?.longitude}
                                        </p>
                                    </div>

                                </div>

                            </div>

                            {/* Interactive Map */}

                            <div className="rounded-xl overflow-hidden border shadow h-105">

                                <MapContainer
                                    center={[
                                        Number(complaint.location.latitude),
                                        Number(complaint.location.longitude),
                                    ]}
                                    zoom={17}
                                    scrollWheelZoom={true}
                                    className="h-full w-full"
                                >

                                    <TileLayer
                                        attribution="&copy; OpenStreetMap contributors"
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />

                                    <Marker
                                        position={[
                                            Number(complaint.location.latitude),
                                            Number(complaint.location.longitude),
                                        ]}
                                    >

                                        <Popup>

                                            <div className="space-y-2">

                                                <h3 className="font-bold text-lg">
                                                    {complaint.title}
                                                </h3>

                                                <p>
                                                    {complaint.location.municipality}
                                                </p>

                                                <p>
                                                    Ward {complaint.location.ward}
                                                </p>

                                                <p className="text-red-500 font-semibold">
                                                    Complaint Location
                                                </p>

                                            </div>

                                        </Popup>

                                    </Marker>

                                </MapContainer>

                            </div>

                        </div>

                    </div>

                    {/* ================= Images ================= */}

                    {complaint.images?.length > 0 && (

                        <div className="bg-white rounded-xl shadow border mt-6">

                            <div className="border-b px-6 py-4">
                                <h2 className="text-lg font-bold">
                                    Complaint Images
                                </h2>
                            </div>

                            <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

                                {complaint.images.map((image, index) => (

                                    <a
                                        key={index}
                                        href={image.url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <img
                                            src={image.url}
                                            alt="Complaint"
                                            className="rounded-xl h-48 w-full object-cover hover:scale-105 transition"
                                        />
                                    </a>

                                ))}

                            </div>

                        </div>

                    )}

                    {/* ================= Timeline ================= */}

                    <div className="bg-white rounded-xl shadow border mt-6">

                        <div className="border-b px-6 py-4">
                            <h2 className="text-lg font-bold">
                                Complaint Timeline
                            </h2>
                        </div>

                        <div className="p-6 space-y-5">

                            <div className="flex gap-4">

                                <div className="w-4 h-4 rounded-full bg-green-500 mt-2"></div>

                                <div>

                                    <p className="font-semibold">
                                        Complaint Submitted
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        {new Date(
                                            complaint.createdAt
                                        ).toLocaleString()}
                                    </p>

                                </div>

                            </div>

                            <div className="flex gap-4">

                                <div className="w-4 h-4 rounded-full bg-blue-500 mt-2"></div>

                                <div>

                                    <p className="font-semibold">
                                        Last Updated
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        {new Date(
                                            complaint.updatedAt
                                        ).toLocaleString()}
                                    </p>

                                </div>

                            </div>

                            {complaint.resolutionNote && (

                                <div className="flex gap-4">

                                    <div className="w-4 h-4 rounded-full bg-green-600 mt-2"></div>

                                    <div>

                                        <p className="font-semibold">
                                            Resolution Note
                                        </p>

                                        <p className="text-sm text-slate-600">
                                            {complaint.resolutionNote}
                                        </p>

                                    </div>

                                </div>

                            )}

                        </div>

                    </div>

                    {/* ================= Footer ================= */}

                    <div className="flex justify-end gap-4 mt-8">

                        <button
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl border font-semibold hover:bg-slate-100"
                        >
                            Close
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={
                                updateLoading ||
                                (
                                    (status === "resolved" || status === "rejected")
                                    && !resolutionNote.trim()
                                )
                            }
                        >
                            {updateLoading ? "Saving..." : "Save Changes"}
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ComplaintView;