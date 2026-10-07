// Gunaso ko status ra priority ko rang (dashboard ka sabai page ma ekai)
export const STATUS_STYLES = {
    pending: { badge: "bg-amber-50 text-amber-700", dot: "bg-amber-500", border: "border-l-amber-500" },
    assigned: { badge: "bg-sky-50 text-sky-700", dot: "bg-sky-500", border: "border-l-sky-500" },
    "in-progress": { badge: "bg-[#003893]/10 text-[#003893]", dot: "bg-[#003893]", border: "border-l-[#003893]" },
    resolved: { badge: "bg-green-50 text-green-700", dot: "bg-green-600", border: "border-l-green-600" },
    rejected: { badge: "bg-red-50 text-[#dc143c]", dot: "bg-[#dc143c]", border: "border-l-[#dc143c]" },
};

export const PRIORITY_STYLES = {
    low: "bg-slate-100 text-slate-600",
    medium: "bg-amber-50 text-amber-700",
    high: "bg-red-50 text-[#dc143c]",
};

export const COMPLAINT_STATUSES = ["pending", "assigned", "in-progress", "resolved", "rejected"];

export const statusStyle = (status) => STATUS_STYLES[status] || STATUS_STYLES.pending;
