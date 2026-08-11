import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#FACC15", // Pending
  "#3B82F6", // Assigned
  "#8B5CF6", // In Progress
  "#22C55E", // Resolved
];

const ComplaintChart = ({ complaints = [] }) => {
  const pending = complaints.filter(
    (c) => c.status?.toLowerCase() === "pending"
  ).length;

  const assigned = complaints.filter(
    (c) => c.status?.toLowerCase() === "assigned"
  ).length;

  const inProgress = complaints.filter(
    (c) => c.status?.toLowerCase() === "in-progress"
  ).length;

  const resolved = complaints.filter(
    (c) =>
      c.status?.toLowerCase() === "resolved" ||
      c.status?.toLowerCase() === "completed"
  ).length;

  const data = [
    {
      name: "Pending",
      value: pending,
    },
    {
      name: "Assigned",
      value: assigned,
    },
    {
      name: "In Progress",
      value: inProgress,
    },
    {
      name: "Resolved",
      value: resolved,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-800">
          Complaint Status
        </h2>

        <p className="text-sm text-slate-500">
          Distribution of complaints by current status.
        </p>
      </div>

      <div className="h-82.5">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={65}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComplaintChart;