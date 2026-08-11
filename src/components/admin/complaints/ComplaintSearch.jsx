import {
    LuSearch,
    LuFilter,
} from "react-icons/lu";

const ComplaintSearch = ({
    search,
    setSearch,
    status,
    setStatus,
    priority,
    setPriority,
}) => {

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">

            <div className="flex items-center gap-2 mb-5">
                <LuFilter className="text-slate-600" />

                <h2 className="font-semibold text-slate-800">
                    Filter Complaints
                </h2>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Search */}
                <div className="relative">

                    <LuSearch
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={20}
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search complaint..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>


                {/* Status Filter */}
                <select
                    value={status}
                    onChange={(e) =>
                        setStatus(e.target.value)
                    }
                    className="px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">
                        All Status
                    </option>

                    <option value="pending">
                        Pending
                    </option>

                    <option value="assigned">
                        Assigned
                    </option>

                    <option value="in-progress">
                        In Progress
                    </option>

                    <option value="resolved">
                        Resolved
                    </option>

                </select>


                {/* Priority Filter */}
                <select
                    value={priority}
                    onChange={(e) =>
                        setPriority(e.target.value)
                    }
                    className="px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
                >

                    <option value="all">
                        All Priority
                    </option>

                    <option value="normal">
                        Normal
                    </option>

                    <option value="important">
                        Important
                    </option>

                    <option value="urgent">
                        Urgent
                    </option>

                </select>

            </div>

        </div>
    );
};


export default ComplaintSearch;