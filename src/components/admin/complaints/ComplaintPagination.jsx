import {
    LuChevronLeft,
    LuChevronRight,
} from "react-icons/lu";


const ComplaintPagination = ({
    currentPage,
    totalPages,
    onPageChange,
    totalComplaints,
    complaintsPerPage,
}) => {

    if (totalPages <= 1) return null;

    const start =
        (currentPage - 1) * complaintsPerPage + 1;

    const end =
        Math.min(
            currentPage * complaintsPerPage,
            totalComplaints
        );

    const pages = Array.from(
        { length: totalPages },
        (_, index) => index + 1
    );

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8">

            {/* Result Count */}
            <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-700">
                    {start}-{end}
                </span>

                {" "}of{" "}

                <span className="font-semibold text-slate-700">
                    {totalComplaints}
                </span>
                {" "}complaints
            </p>

            {/* Pagination */}
            <div className="flex items-center gap-2">
                {/* Previous */}
                <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() =>
                        onPageChange(currentPage - 1)
                    }
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center transition

                    ${currentPage === 1
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            :
                            "border-slate-300 hover:bg-blue-50"
                        }

                    `}
                >
                    <LuChevronLeft size={18} />

                </button>

                {/* Page Numbers */}
                {
                    pages.map((page) => (

                        <button
                            key={page}
                            type="button"
                            onClick={() =>
                                onPageChange(page)
                            }
                            className={`w-10 h-10 rounded-xl font-semibold transition

                            ${currentPage === page
                                    ? "bg-blue-600 text-white"
                                    :
                                    "border border-slate-300 hover:bg-slate-100"
                                }
                            `}
                        >
                            {page}

                        </button>

                    ))
                }

                {/* Next */}
                <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                        onPageChange(currentPage + 1)
                    }
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center transition

                    ${currentPage === totalPages
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            :
                            "border-slate-300 hover:bg-blue-50"
                        }

                    `}
                >
                    <LuChevronRight size={18} />
                </button>
            </div>

        </div>
    );
};


export default ComplaintPagination;