// Event card ra banner ko sajha constant/function
export const STATUS_STYLES = {
    upcoming: "bg-[#003893] text-white",
    ongoing: "bg-green-600 text-white",
    completed: "bg-slate-500 text-white",
    cancelled: "bg-[#dc143c] text-white",
};

export const eventLocation = (event) =>
    [event.location?.venue, event.location?.municipality].filter(Boolean).join(", ");
