import { useTranslation } from "react-i18next";
import NepaliDate from "nepali-date-converter";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Pachhillo 12 BS mahina ma aaeka ra samadhan bhaeka gunaso
const MonthlyChart = ({ complaints }) => {
    const { t, i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage === "en";
    const today = new NepaliDate(new Date());

    const months = Array.from({ length: 12 }, (_, i) => {
        const date = new NepaliDate(today.getYear(), today.getMonth() - (11 - i), 1);
        return {
            key: `${date.getYear()}-${date.getMonth()}`,
            label: isEn ? date.format("MMM", "en") : date.format("MMMM", "np"),
            received: 0,
            resolved: 0,
        };
    });

    const bucket = (value) => {
        const date = new NepaliDate(new Date(value));
        return months.find((month) => month.key === `${date.getYear()}-${date.getMonth()}`);
    };

    complaints.forEach((complaint) => {
        const received = bucket(complaint.createdAt);
        if (received) received.received++;

        if (complaint.status === "resolved") {
            const resolved = bucket(complaint.resolvedAt || complaint.updatedAt);
            if (resolved) resolved.resolved++;
        }
    });

    const labels = { received: t("deptDash.home.received"), resolved: t("deptDash.home.resolved") };

    return (
        <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={months} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="dept-received" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#003893" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#003893" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="dept-resolved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value, name) => [value, labels[name]]} contentStyle={{ borderRadius: 12, fontSize: 13 }} />
                <Legend formatter={(name) => labels[name]} iconType="circle" wrapperStyle={{ fontSize: 13 }} />
                <Area type="monotone" dataKey="received" stroke="#003893" strokeWidth={2} fill="url(#dept-received)" />
                <Area type="monotone" dataKey="resolved" stroke="#16a34a" strokeWidth={2} fill="url(#dept-resolved)" />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default MonthlyChart;
