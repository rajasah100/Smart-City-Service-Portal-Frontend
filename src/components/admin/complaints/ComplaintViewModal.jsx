import {
  LuX,
  LuUser,
  LuBuilding2,
  LuMail,
  LuPhone,
  LuCalendarDays,
  LuMapPin,
} from "react-icons/lu";
import { FaLocationDot } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";

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

const statusColor = {
  pending: "bg-yellow-100 text-yellow-700",
  assigned: "bg-blue-100 text-blue-700",
  "in-progress": "bg-purple-100 text-purple-700",
  resolved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const priorityColor = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

const ComplaintViewModal = ({ open, complaint, onClose }) => {
  if (!open || !complaint) return null;

  console.log(complaint)

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="
            bg-slate-50
            w-full
            max-w-7xl
            rounded-3xl
            shadow-2xl
            overflow-hidden
            max-h-[95vh]
            flex
            flex-col
        "
      >
        {/* Header */}

        <div
          className="
                bg-[#0f4c81]
                text-white
                px-8
                py-6
                flex
                justify-between
                items-center
            "
        >
          <div>
            <h1 className="text-3xl font-bold">Complaint Details</h1>

            <p className="text-blue-100 mt-2">{complaint.complaintId}</p>
          </div>

          <button
            onClick={onClose}
            className="
                    w-10
                    h-10
                    rounded-full
                    bg-white/20
                    hover:bg-white/30
                    flex
                    items-center
                    justify-center
                    "
          >
            <LuX size={22} />
          </button>
        </div>

        {/* Scroll Body */}

        <div
          className="
                overflow-y-auto
                p-8
                space-y-8
            "
        >

          {/* Citizen + Department */}

          <div
            className="
                    grid
                    lg:grid-cols-2
                    gap-6
                "
          >
            {/* Citizen */}

            <div
              className="
                        bg-white
                        rounded-2xl
                        border
                        shadow-sm
                    "
            >
              <div
                className="
                            px-6
                            py-4
                            border-b
                        "
              >
                <h2
                  className="
                                font-bold
                                text-lg
                                flex
                                items-center
                                gap-2
                            "
                >
                  <LuUser />
                  Citizen Information
                </h2>
              </div>

              <div className="p-6">
                <div
                  className="
                                flex
                                items-center
                                gap-4
                            "
                >
                  {complaint.user?.avatar ? (
                    <img
                      src={complaint.user.avatar}
                      alt={complaint.user.name}
                      className="
                                        w-16
                                        h-16
                                        rounded-full
                                        object-cover
                                        "
                    />
                  ) : (
                    <FaUserCircle size={60} className="text-slate-300" />
                  )}

                  <div>
                    <h3
                      className="
                                        text-xl
                                        font-bold
                                    "
                    >
                      {complaint.user?.name || "Unknown User"}
                    </h3>

                    <p
                      className="
                                        text-slate-500
                                    "
                    >
                      Citizen
                    </p>
                  </div>
                </div>

                <div
                  className="
                                mt-6
                                space-y-4
                            "
                >
                  <p
                    className="
                                    flex
                                    gap-3
                                    items-center
                                "
                  >
                    <LuMail className="text-[#0f4c81]" />

                    {complaint.user?.email || "-"}
                  </p>

                  <p
                    className="
                                    flex
                                    gap-3
                                    items-center
                                "
                  >
                    <LuPhone className="text-[#0f4c81]" />

                    {complaint.user?.phone || "-"}
                  </p>

                  <p
                    className="
                                    flex
                                    gap-3
                                    items-center
                                "
                  >
                    <LuCalendarDays className="text-[#0f4c81]" />

                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Department */}

            <div
              className="
                        bg-white
                        rounded-2xl
                        border
                        shadow-sm
                    "
            >
              <div
                className="
                            px-6
                            py-4
                            border-b
                        "
              >
                <h2
                  className="
                                font-bold
                                text-lg
                                flex
                                items-center
                                gap-2
                            "
                >
                  <LuBuilding2 />
                  Department Information
                </h2>
              </div>

              <div className="p-6">
                <div
                  className="
                                flex
                                items-center
                                gap-4
                            "
                >
                  <div
                    className="
                                    w-16
                                    h-16
                                    rounded-full
                                    bg-[#0f4c81]
                                    text-white
                                    flex
                                    items-center
                                    justify-center
                                    text-2xl
                                    font-bold
                                "
                  >
                    {complaint.department?.name?.charAt(0) || "D"}
                  </div>

                  <div>
                    <h3
                      className="
                                        text-xl
                                        font-bold
                                    "
                    >
                      {complaint.department?.name || "Not Assigned"}
                    </h3>

                    <p className="text-slate-500">Responsible Department</p>
                  </div>
                </div>

                <div
                  className="
                                mt-6
                                space-y-4
                            "
                >
                  <p
                    className="
                                    flex
                                    gap-3
                                    items-center
                                "
                  >
                    <LuMail />

                    {complaint.department?.email || "-"}
                  </p>

                  <p
                    className="
                                    flex
                                    gap-3
                                    items-center
                                "
                  >
                    <LuPhone />

                    {complaint.department?.phone || "-"}
                  </p>

                  <p
                    className="
                                    flex
                                    gap-3
                                    items-center
                                "
                  >
                    <FaLocationDot />

                    {complaint.department?.address || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Complaint Information */}

          <div
            className="
                    bg-white
                    rounded-2xl
                    border
                    shadow-sm
                "
          >
            <div
              className="
                        px-6
                        py-4
                        border-b
                    "
            >
              <h2
                className="
                            text-xl
                            font-bold
                        "
              >
                Complaint Information
              </h2>
            </div>

            <div
              className="
                        p-6
                        space-y-6
                    "
            >
              {/* Title */}

              <div>
                <label
                  className="
                                font-semibold
                                text-slate-700
                            "
                >
                  Complaint Title
                </label>

                <div
                  className="
                                mt-2
                                p-4
                                rounded-xl
                                bg-slate-50
                                border
                            "
                >
                  {complaint.title}
                </div>
              </div>

              {/* Description */}

              <div>
                <label
                  className="
                                font-semibold
                                text-slate-700
                            "
                >
                  Description
                </label>

                <div
                  className="
                                mt-2
                                p-4
                                rounded-xl
                                bg-slate-50
                                border
                                leading-7
                            "
                >
                  {complaint.description}
                </div>
              </div>

              {/* Priority */}

              <div>
                <label
                  className="
                                font-semibold
                            "
                >
                  Priority
                </label>

                <div className="mt-3">
                  <span
                    className={`
                                    px-4
                                    py-2
                                    rounded-full
                                    font-semibold
                                    capitalize
                                    ${priorityColor[complaint.priority]}
                                    `}
                  >
                    {complaint.priority}
                  </span>
                </div>
              </div>

              {/* Update Status */}

              <div>
                <label
                  className="
                                font-semibold
                                block
                                mb-2
                            "
                >
                  Update Complaint Status
                </label>

                <div className="mt-3">
                  <span
                    className={`px-4 py-2 rounded-full font-semibold capitalize ${statusColor[complaint.status]}`}
                  >
                    {complaint.status}
                  </span>
                </div>
              </div>

              
            </div>
          </div>

          {/* Complaint Location */}

          <div
            className="
                    bg-white
                    rounded-2xl
                    border
                    shadow-sm
                "
          >
            <div
              className="
                        px-6
                        py-4
                        border-b
                    "
            >
              <h2
                className="
                            text-xl
                            font-bold
                            flex
                            items-center
                            gap-2
                        "
              >
                <LuMapPin />
                Complaint Location
              </h2>
            </div>

            <div
              className="
                        p-6
                        grid
                        lg:grid-cols-2
                        gap-6
                    "
            >
              {/* Location Details */}

              <div
                className="
                            space-y-4
                        "
              >
                <div
                  className="
                                grid
                                grid-cols-2
                                gap-4
                            "
                >
                  <div
                    className="
                                    bg-slate-50
                                    p-4
                                    rounded-xl
                                "
                  >
                    <p
                      className="
                                        text-sm
                                        text-slate-500
                                    "
                    >
                      Province
                    </p>

                    <p
                      className="
                                        font-semibold
                                    "
                    >
                      {complaint.location?.province || "-"}
                    </p>
                  </div>

                  <div
                    className="
                                    bg-slate-50
                                    p-4
                                    rounded-xl
                                "
                  >
                    <p
                      className="
                                        text-sm
                                        text-slate-500
                                    "
                    >
                      District
                    </p>

                    <p
                      className="
                                        font-semibold
                                    "
                    >
                      {complaint.location?.district || "-"}
                    </p>
                  </div>

                  <div
                    className="
                                    bg-slate-50
                                    p-4
                                    rounded-xl
                                "
                  >
                    <p
                      className="
                                        text-sm
                                        text-slate-500
                                    "
                    >
                      Municipality
                    </p>

                    <p
                      className="
                                        font-semibold
                                    "
                    >
                      {complaint.location?.municipality || "-"}
                    </p>
                  </div>

                  <div
                    className="
                                    bg-slate-50
                                    p-4
                                    rounded-xl
                                "
                  >
                    <p
                      className="
                                        text-sm
                                        text-slate-500
                                    "
                    >
                      Ward
                    </p>

                    <p
                      className="
                                        font-semibold
                                    "
                    >
                      {complaint.location?.ward || "-"}
                    </p>
                  </div>
                </div>

                <div
                  className="
                                bg-slate-50
                                p-4
                                rounded-xl
                            "
                >
                  <p
                    className="
                                    text-sm
                                    text-slate-500
                                "
                  >
                    Tole
                  </p>

                  <p
                    className="
                                    font-semibold
                                "
                  >
                    {complaint.location?.tole || "-"}
                  </p>
                </div>

                <div
                  className="
                                grid
                                grid-cols-2
                                gap-4
                            "
                >
                  <div
                    className="
                                    bg-slate-50
                                    p-4
                                    rounded-xl
                                "
                  >
                    <p
                      className="
                                        text-sm
                                        text-slate-500
                                    "
                    >
                      Latitude
                    </p>

                    <p
                      className="
                                        font-semibold
                                    "
                    >
                      {complaint.location?.latitude || "-"}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="text-sm text-slate-500">Longitude</p>

                    <p
                      className="
                                        font-semibold
                                    "
                    >
                      {complaint.location?.longitude || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Map */}

              <div
                className="
                            h-105
                            rounded-xl
                            overflow-hidden
                            border
                        "
              >
                {complaint.location?.latitude &&
                complaint.location?.longitude ? (
                  <MapContainer
                    center={[
                      Number(complaint.location.latitude),

                      Number(complaint.location.longitude),
                    ]}
                    zoom={16}
                    className="
                                    h-full
                                    w-full
                                "
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
                        <div>
                          <h3 className="font-bold">{complaint.title}</h3>

                          <p>{complaint.location?.municipality}</p>

                          <p>Ward {complaint.location?.ward}</p>
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <div
                    className="
                                h-full
                                flex
                                items-center
                                justify-center
                                text-slate-500
                            "
                  >
                    Location not available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Complaint Images */}

          {complaint.images?.length > 0 && (
            <div
              className="
                        bg-white
                        rounded-2xl
                        border
                        shadow-sm
                    "
            >
              <div
                className="
                            px-6
                            py-4
                            border-b
                        "
              >
                <h2
                  className="
                                text-xl
                                font-bold
                            "
                >
                  Complaint Images
                </h2>
              </div>

              <div
                className="
                            p-6
                            grid
                            grid-cols-2
                            md:grid-cols-3
                            lg:grid-cols-4
                            gap-5
                        "
              >
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
                      className="
                                            h-44
                                            w-full
                                            object-cover
                                            rounded-xl
                                            hover:scale-105
                                            transition
                                        "
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}

          <div
            className="
                    bg-white
                    rounded-2xl
                    border
                    shadow-sm
                "
          >
            <div
              className="
                        px-6
                        py-4
                        border-b
                    "
            >
              <h2
                className="
                            text-xl
                            font-bold
                        "
              >
                Complaint Timeline
              </h2>
            </div>

            <div
              className="
                        p-6
                        space-y-6
                    "
            >
              <div
                className="
                            flex
                            gap-4
                        "
              >
                <div
                  className="
                                w-4
                                h-4
                                rounded-full
                                bg-green-500
                                mt-2
                            "
                ></div>

                <div>
                  <p
                    className="
                                    font-semibold
                                "
                  >
                    Complaint Submitted
                  </p>

                  <p
                    className="
                                    text-sm
                                    text-slate-500
                                "
                  >
                    {new Date(complaint.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div
                className="
                            flex
                            gap-4
                        "
              >
                <div
                  className="
                                w-4
                                h-4
                                rounded-full
                                bg-blue-500
                                mt-2
                            "
                ></div>

                <div>
                  <p
                    className="
                                    font-semibold
                                "
                  >
                    Last Updated
                  </p>

                  <p
                    className="
                                    text-sm
                                    text-slate-500
                                "
                  >
                    {new Date(complaint.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}

          <div className="flex justify-end pb-4">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-[#0f4c81] text-white"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintViewModal;
