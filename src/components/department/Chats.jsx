import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useSelector } from "react-redux";

const Charts = () => {
  const { departmentComplaints = [] } = useSelector(
    (state) => state.complaint
  );

  const chartData = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));

    return {
      month: date.toLocaleString("default", { month: "short" }),
      monthNumber: date.getMonth(),
      year: date.getFullYear(),
      received: 0,
      resolved: 0,
    };
  });

  departmentComplaints.forEach((complaint) => {
    const createdDate = new Date(complaint.createdAt);

    const index = chartData.findIndex(
      (item) =>
        item.monthNumber === createdDate.getMonth() &&
        item.year === createdDate.getFullYear()
    );

    if (index !== -1) {
      chartData[index].received++;

      if (complaint.status === "resolved") {
        chartData[index].resolved++;
      }
    }
  });

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="received" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4a6c8f" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#4a6c8f" stopOpacity={0} />
          </linearGradient>

          <linearGradient id="resolved" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis allowDecimals={false} />
        <Tooltip />

        <Area
          type="monotone"
          dataKey="received"
          stroke="#4a6c8f"
          fill="url(#received)"
        />

        <Area
          type="monotone"
          dataKey="resolved"
          stroke="#22c55e"
          fill="url(#resolved)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Charts;