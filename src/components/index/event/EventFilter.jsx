import { FaSearch } from "react-icons/fa";

const EventFilter = ({
    search,
    setSearch,
    category,
    setCategory,
    status,
    setStatus,
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-7xl mx-auto mt-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Search */}
                <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                        type="text"
                        placeholder="Search events..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                </div>

                {/* Category */}
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                    <option value="">All Categories</option>
                    <option>Health Camp</option>
                    <option>Blood Donation</option>
                    <option>Agriculture</option>
                    <option>Training</option>
                    <option>Meeting</option>
                    <option>Festival</option>
                    <option>Sports</option>
                    <option>Education</option>
                    <option>Culture</option>
                    <option>Environment</option>
                    <option>Other</option>
                </select>

                {/* Status */}
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                    <option value="">All Status</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>
        </div>
    );
};

export default EventFilter;