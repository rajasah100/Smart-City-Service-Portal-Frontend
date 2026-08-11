import {
  FaCheckCircle,
  FaClock,
  FaSpinner,
} from "react-icons/fa";

const timeline = [
  {
    key: "pending",
    title: "Complaint Submitted",
    description: "Your complaint has been received.",
    icon: FaClock,
  },
  {
    key: "assigned",
    title: "Assigned to Department",
    description: "The complaint has been assigned to the responsible department.",
    icon: FaClock,
  },
  {
    key: "in-progress",
    title: "Work In Progress",
    description: "The department is currently working on your complaint.",
    icon: FaSpinner,
  },
  {
    key: "resolved",
    title: "Complaint Resolved",
    description: "The complaint has been successfully resolved.",
    icon: FaCheckCircle,
  },
];

const ComplaintTimeline = ({ status }) => {
  const currentIndex = timeline.findIndex((item) => item.key === status);

  return (
    <div className="bg-white rounded-xl border shadow">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <h2 className=" text-lg font-bold">
          Complaint Timeline
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Track the progress of your complaint.
        </p>
      </div>

      {/* Timeline */}
      <div className="p-6">
        {timeline.map((item, index) => {
          const Icon = item.icon;

          const completed = index < currentIndex;
          const active = index === currentIndex;

          return (
            <div key={item.key} className="relative flex gap-5 pb-8 last:pb-0">
              {/* Vertical Line */}
              {index !== timeline.length - 1 && (
                <div
                  className={`absolute left-5 top-10 w-0.5 h-full ${
                    completed ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}

              {/* Icon */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10
                ${
                  completed
                    ? "bg-green-500 text-white"
                    : active
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {active && item.key === "in-progress" ? (
                  <FaSpinner className="animate-spin" />
                ) : completed ? (
                  <FaCheckCircle />
                ) : (
                  <Icon />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-[#10151c]">
                    {item.title}
                  </h3>

                  {completed && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Completed
                    </span>
                  )}

                  {active && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      Current
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-500 mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComplaintTimeline;