import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

const MonthlyChart = ({ complaints = [] }) => {
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

    const monthlyData = months.map((month, index) => ({
        month,
        complaints: complaints.filter((item) => {
            if (!item.createdAt) return false;

            return new Date(item.createdAt).getMonth() === index;
        }).length,
    }));

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="mb-5">
                <h2 className="text-xl font-bold text-slate-800">
                    Monthly Complaints
                </h2>

                <p className="text-sm text-slate-500">
                    Complaint trend throughout the year.
                </p>
            </div>

            <div className="h-[330px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="month" />

                        <YAxis allowDecimals={false} />

                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey="complaints"
                            stroke="#2563eb"
                            strokeWidth={3}
                            dot={{ r: 5 }}
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MonthlyChart;