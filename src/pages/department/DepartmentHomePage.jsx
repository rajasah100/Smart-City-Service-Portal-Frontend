import { LuClipboardList, LuClock3, LuLoader, LuCheckCheck, LuLoaderCircle } from "react-icons/lu";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Charts from "../../components/department/Chats";
import RecentComplaints from "../../components/department/RecentComplaints";
import { getDepartmentComplaints } from "../../redux/slices/complaintSlice";


const DepartmentHomePage = () => {
  const dispatch = useDispatch();

  const { 
    departmentComplaints,
    loading,
  } = useSelector((state) => state.complaint)
  useEffect(() => {
    dispatch(getDepartmentComplaints());
  }, [dispatch]);

  const total = departmentComplaints.length;
  const pending = departmentComplaints.filter(
    (c) => c.status === "pending"
  ).length;

  const assigned = departmentComplaints.filter(
    (c) => c.status === "assigned"
  ).length;

  const inProgress = departmentComplaints.filter(
    (c) =>
      c.status === "inProgress" ||
      c.status === "in-progress"
  ).length;

  const resolved = departmentComplaints.filter(
    (c) => c.status === "resolved"
  ).length;


  const cards = [
    {
      title: "Total Complaints",
      value: total,
      icon: LuClipboardList,
      bg: "bg-blue-100",
      color: "text-blue-700",
    },
    {
      title: "Pending",
      value: pending,
      icon: LuClock3,
      bg: "bg-yellow-100",
      color: "text-yellow-700",
    },
    {
      title: "Assigned",
      value: assigned,
      icon: LuLoader,
      bg: "bg-purple-100",
      color: "text-purple-700",
    },
    {
      title: "In Progress",
      value: inProgress,
      icon: LuLoaderCircle,
      bg: "bg-purple-100",
      color: "text-purple-500",
    },
    {
      title: "Resolved",
      value: resolved,
      icon: LuCheckCheck,
      bg: "bg-green-100",
      color: "text-green-700",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 mt-2">
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-5">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg}`}>
                <Icon className={`text-2xl ${card.color}`} />
              </div>

              <h2 className="mt-4 text-3xl font-bold text-[#10151c]">
                {card.value}
              </h2>

              <p className="text-slate-500 mt-1">
                {card.title}
              </p>
            </div>
          )

        })}
      </div>

      {/* Charts + Recent Complaints */}
      <div className="grid lg:grid-cols-2 gap-6">

        <Charts />
        <RecentComplaints />
      </div>
    </div>
  )
}

export default DepartmentHomePage
