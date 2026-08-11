import {
  LuFileText,
  LuClock3,
  LuCheckCheck,
  LuLoader,
  LuArrowUpRight,
} from "react-icons/lu";
import { FiAlertTriangle } from "react-icons/fi";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { getMyComplaints } from "../../redux/slices/complaintSlice";

import Charts from "../../components/user/Charts";
import Notification from "../../components/user/Notification";
import ComplaintCard from "../../components/user/ComplaintCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const UserDashboardHome = () => {
  const dispatch = useDispatch();

  const { myComplaints = [], loading } = useSelector(
    (state) => state.complaint
  );

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMyComplaints());
  }, [dispatch]);

  if (loading) return <LoadingSpinner />;

  const totalComplaints = myComplaints.length;

  const resolvedComplaints = myComplaints.filter(
    (item) => item.status === "resolved"
  ).length;

  const pendingComplaints = myComplaints.filter(
    (item) => item.status === "pending"
  ).length;

  const inProgressComplaints = myComplaints.filter(
    (item) => item.status === "in-progress"
  ).length;

  const rejectedComplaints = myComplaints.filter(
    (item) => item.status === "rejected"
  ).length;

  const resolutionRate =
    totalComplaints === 0
      ? 0
      : Math.round(
        (resolvedComplaints / totalComplaints) * 100
      );

  const latestComplaint =
    myComplaints.length > 0
      ? [...myComplaints].sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )[0]
      : null;

  const metricCards = [
    {
      title: "Total Complaints",
      value: totalComplaints,
      icon: LuFileText,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Resolved",
      value: resolvedComplaints,
      icon: LuCheckCheck,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Pending",
      value: pendingComplaints,
      icon: LuClock3,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      title: "In Progress",
      value: inProgressComplaints,
      icon: LuLoader,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Rejected",
      value: rejectedComplaints,
      icon: FiAlertTriangle,
      color: "bg-red-50 text-red-600",
    },
    {
      title: "Resolution Rate",
      value: `${resolutionRate}%`,
      icon: LuArrowUpRight,
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div>

          <h1 className="text-3xl font-bold text-slate-800 mt-1">
            Welcome back, {userInfo?.name?.split(" ")[0]} 👋
          </h1>

          <p className="text-slate-500 mt-2">
            Monitor your complaints, check progress and stay updated with city services.
          </p>
        </div>

        <Link
          to="/complaint"
          className="inline-flex items-center gap-2 bg-[#D9A441] hover:bg-yellow-500 transition px-6 py-3 rounded-xl font-semibold text-slate-900 shadow"
        >
          <LuFileText size={20} />
          File New Complaint
        </Link>

      </div>
      {/* Statistics */}

      <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-5">

        {metricCards.map((item) => (
          <div
            key={item.title}
            className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-5"
          >

            <div className="flex items-center justify-between">

              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color}`}
              >
                <item.icon size={24} />
              </div>

              <span className="text-xs font-semibold text-slate-400 uppercase">
                Stats
              </span>

            </div>

            <h2 className="text-4xl font-bold text-slate-800 mt-6">
              {item.value}
            </h2>

            <p className="text-slate-500 mt-2">
              {item.title}
            </p>

          </div>
        ))}

      </div>

      {/* Charts + Notifications */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Chart */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm">

          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Complaint Analytics
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Complaint activity for the last 6 months.
              </p>
            </div>
          </div>

          <div className="p-6 h-90">
            <Charts />
          </div>

        </div>

        {/* Notification */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col">

          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Notifications
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Latest updates about your complaints.
              </p>
            </div>

            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
              Recent
            </span>

          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <Notification />
          </div>

        </div>

      </div>

      {/* Bottom Section */}

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Latest Complaint */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          <h2 className="text-lg font-bold mb-5">
            Latest Complaint
          </h2>

          {latestComplaint ? (
            <div className="space-y-3">

              <h3 className="font-semibold">
                {latestComplaint.title}
              </h3>

              <p className="text-sm text-slate-500">
                Complaint ID :
                {" "}
                {latestComplaint.complaintId}
              </p>

              <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                {latestComplaint.status}
              </span>

              <p className="text-sm text-slate-500">
                {new Date(
                  latestComplaint.createdAt
                ).toLocaleDateString()}
              </p>

            </div>
          ) : (
            <p className="text-slate-500">
              No complaints found.
            </p>
          )}

        </div>

        {/* Quick Actions */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          <h2 className="text-lg font-bold mb-5">
            Quick Actions
          </h2>

          <div className="space-y-3">

            <Link
              to="/complaint"
              className="block bg-blue-50 hover:bg-blue-100 p-4 rounded-xl font-medium"
            >
              📝 File Complaint
            </Link>

            <Link
              to="/user/complaints"
              className="block bg-green-50 hover:bg-green-100 p-4 rounded-xl font-medium"
            >
              📄 My Complaints
            </Link>

            <Link
              to="/notice"
              className="block bg-yellow-50 hover:bg-yellow-100 p-4 rounded-xl font-medium"
            >
              📢 Notices
            </Link>

          </div>

        </div>

        {/* Summary */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          <h2 className="text-lg font-bold mb-5">
            Summary
          </h2>

          <div className="space-y-4 text-sm">

            <div className="flex justify-between">
              <span>Total Filed</span>
              <strong>{totalComplaints}</strong>
            </div>

            <div className="flex justify-between">
              <span>Resolved</span>
              <strong>{resolvedComplaints}</strong>
            </div>

            <div className="flex justify-between">
              <span>Pending</span>
              <strong>{pendingComplaints}</strong>
            </div>

            <div className="flex justify-between">
              <span>In Progress</span>
              <strong>{inProgressComplaints}</strong>
            </div>

            <div className="flex justify-between">
              <span>Rejected</span>
              <strong>{rejectedComplaints}</strong>
            </div>

            <div className="flex justify-between border-t pt-3 text-base">
              <span>Resolution Rate</span>
              <strong>{resolutionRate}%</strong>
            </div>

          </div>

        </div>

      </div>

      {/* Recent Complaints */}

      <div>
        <h1 className="text-2xl font-bold p-2">Recent complaint</h1>
        <ComplaintCard
          complaints={myComplaints.slice(0, 5)}
        />
      </div>

    </div>
  );
};

export default UserDashboardHome;