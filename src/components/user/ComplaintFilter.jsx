

const ComplaintFilter = ({ status, setStatus }) => {
    const statuses = [
        {
            value: "all",
            label: "All Status",
        },
        {
            value: "pending",
            label: "Pending",
        },
        {
            value: "assigned",
            label: "Assigned",
        },
        {
            value: "in-progress",
            label: "In Progress",
        },
        {
            value: "resolved",
            label: "Resolved",
        },
        {
            value: "rejected",
            label: "Rejected",
        },
    ]


  return (
    <div className="w-full md:w-60">
        <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none bg-white focus:ring-2 focus:ring-[#4a6c8f] focus:border-[#]"
        >
            {statuses.map((item) => (
                <option
                key={item.value}
                value={item.value}
                >
                    {item.label}
                </option>
            ))}
        </select>
    </div>
  )
}

export default ComplaintFilter
