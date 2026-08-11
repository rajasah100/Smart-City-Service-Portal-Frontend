import { Link } from "react-router-dom";
import {
  FaChevronRight,
  FaCalendarAlt,
  FaUser,
} from "react-icons/fa";
import { FcDepartment } from "react-icons/fc";
import { AiFillNotification } from "react-icons/ai";
import { GrDocumentText } from "react-icons/gr";

const actions = [
  {
    title: "Manage Departments",
    desc: "Add or update departments",
    icon: <FcDepartment size={24} />,
    link: "/admin/departments",
  },
  {
    title: "Manage Complaints",
    desc: "Review all complaints",
    icon: <GrDocumentText size={22} className="text-blue-600" />,
    link: "/admin/complaints",
  },
  {
    title: "Publish Notice",
    desc: "Create new notice",
    icon: <AiFillNotification size={22} className="text-orange-500" />,
    link: "/admin/notices",
  },
  {
    title: "Manage Events",
    desc: "Add city events",
    icon: <FaCalendarAlt size={20} className="text-green-600" />,
    link: "/admin/events",
  },
  {
    title: "Manage Users",
    desc: "View registered users",
    icon: <FaUser size={20} className="text-purple-600" />,
    link: "/admin/users",
  },
];

const QuickActions = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-5">
        Quick Actions
      </h2>

      <div className="space-y-3">
        {actions.map((action) => (
          <Link
            key={action.title}
            to={action.link}
            className="group flex items-center justify-between rounded-xl border border-slate-200 px-4 py-4 hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                {action.icon}
              </div>

              <div>
                <h3 className="font-semibold text-slate-800 group-hover:text-blue-600">
                  {action.title}
                </h3>

                <p className="text-sm text-slate-500">
                  {action.desc}
                </p>
              </div>
            </div>

            <FaChevronRight className="text-slate-400 group-hover:text-blue-600 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;