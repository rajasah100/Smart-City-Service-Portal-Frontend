import { LuSearch, LuFilter, LuX } from "react-icons/lu";

const UserSearch = ({
    search,
    setSearch,
    role,
    setRole,
}) => {
    const clearFilters = () => {
        setSearch("");
        setRole("all");
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Search */}
                <div className="relative md:col-span-2">
                    <LuSearch
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, email or phone..."
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Role Filter */}
                <div className="flex gap-3">

                    <div className="relative flex-1">
                        <LuFilter
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        >
                            <option value="all">All Roles</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button
                        onClick={clearFilters}
                        className="px-5 rounded-xl border border-slate-300 hover:bg-slate-100 transition flex items-center gap-2"
                    >
                        <LuX size={18} />
                        Clear
                    </button>

                </div>

            </div>
        </div>
    );
};

export default UserSearch;