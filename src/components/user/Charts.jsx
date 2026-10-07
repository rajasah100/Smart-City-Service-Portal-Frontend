import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

// Pachhillo 6 mahina ko gunaso (mahina ra sal dubai milaera)
const Charts = () => {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage === "en" ? "en-US" : "ne-NP";
    const { myComplaints = [] } = useSelector((state) => state.complaint);

    const now = new Date();
    const filedLabel = t("userDash.chartFiled");
    const resolvedLabel = t("userDash.chartResolved");

    const activityData = Array.from({ length: 6 }, (_, index) => {
        const month = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);

        const inMonth = myComplaints.filter((item) => {
            const date = new Date(item.createdAt);
            return date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth();
        });

        return {
            month: month.toLocaleString(locale, { month: "short" }),
            [filedLabel]: inMonth.length,
            [resolvedLabel]: inMonth.filter((item) => item.status === "resolved").length,
        };
    });

    return (
        <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={activityData} margin={{ top: 10, right: 16, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="filedFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#003893" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#003893" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="resolvedFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />

                <Area type="monotone" dataKey={filedLabel} stroke="#003893" strokeWidth={2.5} fill="url(#filedFill)" />
                <Area type="monotone" dataKey={resolvedLabel} stroke="#16a34a" strokeWidth={2.5} fill="url(#resolvedFill)" />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default Charts;
