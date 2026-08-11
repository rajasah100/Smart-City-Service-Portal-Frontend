import { useSelector } from "react-redux";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Legend,
} from "recharts";

const Charts = () => {
    const { myComplaints = [] } = useSelector((state) => state.complaint);

    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    const currentMonth = new Date().getMonth();

    const activityData = [];

    for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;

        const monthComplaints = myComplaints.filter((item) => {
            const date = new Date(item.createdAt); // ✅ Fixed
            return date.getMonth() === monthIndex;
        });

        activityData.push({
            month: months[monthIndex],
            complaints: monthComplaints.length,
            resolved: monthComplaints.filter(
                (item) => item.status === "resolved"
            ).length,
        });
    }

    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    data={activityData}
                    margin={{
                        top: 10,
                        right: 20,
                        left: -15,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient
                            id="complaintsGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop offset="5%" stopColor="#4a6c8f" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#4a6c8f" stopOpacity={0} />
                        </linearGradient>

                        <linearGradient
                            id="resolvedGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e5e7eb"
                    />

                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />

                    <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />

                    <Tooltip
                        contentStyle={{
                            borderRadius: "12px",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                        }}
                    />

                    <Legend />

                    <Area
                        type="monotone"
                        dataKey="complaints"
                        name="Filed"
                        stroke="#4a6c8f"
                        strokeWidth={3}
                        fill="url(#complaintsGradient)"
                        activeDot={{ r: 6 }}
                    />

                    <Area
                        type="monotone"
                        dataKey="resolved"
                        name="Resolved"
                        stroke="#22c55e"
                        strokeWidth={3}
                        fill="url(#resolvedGradient)"
                        activeDot={{ r: 6 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Charts;