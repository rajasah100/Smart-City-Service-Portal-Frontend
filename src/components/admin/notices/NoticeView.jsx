import { FaBuilding, FaCalendarAlt, FaMapMarkerAlt, FaFilePdf } from "react-icons/fa";
import { LuX } from "react-icons/lu";

const NoticeView = ({ notice, onClose }) => {
  if (!notice) return null;

  const attachment = notice.attachment?.[0];

  const isImage =
    attachment &&
    (attachment.type === "image" ||
      /\.(jpg|jpeg|png|gif|webp)$/i.test(attachment.url));

  const isPdf =
    attachment &&
    (attachment.type === "pdf" || /\.pdf$/i.test(attachment.url));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center p-4">

      <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold">
            Notice Details
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <LuX size={22} />
          </button>
        </div>

        {/* Attachment */}

        {attachment && (
          <div className="border-b">

            {isImage ? (
              <img
                src={attachment.url}
                alt={attachment.altText}
                className="w-full h-96 object-cover"
              />
            ) : isPdf ? (
              <div className="p-5">

                <div className="flex items-center gap-3 mb-4">
                  <FaFilePdf className="text-red-600 text-4xl" />

                  <h3 className="text-xl font-semibold">
                    PDF Attachment
                  </h3>
                </div>

                <iframe
                  src={attachment.url}
                  title="Notice PDF"
                  className="w-full h-[600px] border rounded-lg"
                />
              </div>
            ) : (
              <div className="h-72 flex items-center justify-center text-gray-500">
                Unsupported Attachment
              </div>
            )}
          </div>
        )}

        {/* Body */}

        <div className="p-6">

          {/* Title */}

          <h1 className="text-3xl font-bold text-gray-800">
            {notice.title}
          </h1>

          {/* Badges */}

          <div className="flex flex-wrap gap-3 mt-5">

            <span
              className={`px-4 py-1 rounded-full text-white text-sm
                ${
                  notice.priority === "high"
                    ? "bg-red-600"
                    : notice.priority === "medium"
                    ? "bg-yellow-500"
                    : "bg-green-600"
                }`}
            >
              {notice.priority}
            </span>

            <span
              className={`px-4 py-1 rounded-full text-white text-sm
                ${
                  notice.status === "active"
                    ? "bg-blue-600"
                    : "bg-gray-600"
                }`}
            >
              {notice.status}
            </span>

          </div>

          {/* Information */}

          <div className="grid md:grid-cols-2 gap-5 mt-8 text-gray-700">

            <div className="flex items-center gap-3">
              <FaBuilding className="text-[#0f4c81]" />
              <span>
                <strong>Department:</strong>{" "}
                {notice.department?.name}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-[#0f4c81]" />
              <span>
                <strong>Municipality:</strong>{" "}
                {notice.municipality}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-[#0f4c81]" />
              <span>
                <strong>Ward:</strong>{" "}
                {notice.ward}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <FaCalendarAlt className="text-[#0f4c81]" />
              <span>
                <strong>Published:</strong>{" "}
                {new Date(notice.createdAt).toLocaleDateString()}
              </span>
            </div>

          </div>

          {/* Description */}

          <div className="mt-10">

            <h2 className="text-2xl font-semibold mb-4">
              Description
            </h2>

            <p className="leading-8 whitespace-pre-line text-gray-700">
              {notice.description}
            </p>

          </div>

          {/* Buttons */}

          {attachment && (
            <div className="flex justify-end gap-4 mt-10">

              <a
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-lg bg-[#0f4c81] text-white hover:bg-[#0d3d67]"
              >
                Open Attachment
              </a>

              <a
                href={attachment.url}
                download
                className="px-5 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Download
              </a>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default NoticeView;