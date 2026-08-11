import {
  LuBell,
  LuCheckCheck,
  LuClock3,
  LuArrowRight,
} from "react-icons/lu";

const Notification = () => {
  const notifications = [
    {
      id: 1,
      title: "Road repair on Oak Street completed",
      time: "2 hours ago",
      type: "success",
      unread: true,
    },
    {
      id: 2,
      title: "Complaint #CMP-2026-001 is now In Progress",
      time: "Yesterday",
      type: "progress",
      unread: true,
    },
    {
      id: 3,
      title: "New Health Camp announced by Municipality",
      time: "2 days ago",
      type: "announcement",
      unread: false,
    },
    {
      id: 4,
      title: "Water Supply maintenance scheduled tomorrow",
      time: "3 days ago",
      type: "warning",
      unread: false,
    },
    {
      id: 5,
      title: "Electricity issue in Ward 5 has been resolved",
      time: "4 days ago",
      type: "success",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  const getColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-600";
      case "progress":
        return "bg-blue-100 text-blue-600";
      case "warning":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full">

      {/* Header */}

      <div className="flex items-center justify-between p-5 border-b">
        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-yellow-100 flex items-center justify-center">
            <LuBell className="text-[#D9A441]" size={22} />
          </div>

          <div>
            <h2 className="font-bold text-slate-800">
              Notifications
            </h2>

            <p className="text-xs text-slate-500">
              Latest updates
            </p>
          </div>

        </div>

        {unreadCount > 0 && (
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-semibold">
            {unreadCount} New
          </span>
        )}
      </div>

      {/* Notification List */}

      <div className="max-h-90 overflow-y-auto">

        {notifications.map((item) => (

          <div
            key={item.id}
            className={`flex items-start gap-4 px-5 py-4 border-b last:border-none transition hover:bg-slate-50 ${item.unread ? "bg-blue-50/40" : ""
              }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${getColor(
                item.type
              )}`}
            >
              <LuCheckCheck size={18} />
            </div>

            <div className="flex-1">

              <p className="text-sm font-semibold text-slate-700 leading-6">
                {item.title}
              </p>

              <div className="flex items-center justify-between mt-2">

                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <LuClock3 size={13} />
                  {item.time}
                </div>

                {item.unread && (
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                )}

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* Footer */}

      <div className="p-4 border-t">

        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition font-semibold text-slate-700">
          View All Notifications
          <LuArrowRight size={18} />
        </button>

      </div>

    </div>
  );
};

export default Notification;