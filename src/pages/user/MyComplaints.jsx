import { useEffect, useState } from "react";
import ComplaintSearch from "../../components/user/ComplaintSearch"
import ComplaintFilter from "../../components/user/ComplaintFilter"
import { useDispatch, useSelector } from "react-redux"
import { getMyComplaints } from "../../redux/slices/complaintSlice"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import ComplaintCard from "../../components/user/ComplaintCard";


const MyComplaints = () => {
  const dispatch = useDispatch();

  const {
    myComplaints = [],
    loading,
    error,
  } = useSelector((state) => state.complaint);


  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    dispatch(getMyComplaints());
  }, [dispatch]);

  const filteredComplaints = myComplaints.filter((complaint) => {
    const matchSearch =
      complaint.title.toLowerCase().includes(search.toLowerCase()) ||
      complaint.department?.name?.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      status === "all" ? true : complaint.status === status;

    return matchSearch && matchStatus;
  });


  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    )
  }


  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold text-[#10151c]">
          My Commplaints
        </h1>
        <p className="text-slate-500 mt-1">
          View and track all your submitted complaints.
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <ComplaintSearch
          search={search}
          setSearch={setSearch}
        />

        <ComplaintFilter
          status={status}
          setStatus={setStatus}
        />

      </div>

      {/* Total */}
      <div>
        <p className="text-slate-500">
          Total Complaints :
          <span className="font-bold text-[#10151c] ml-2">
            {filteredComplaints.length}
          </span>
        </p>
      </div>

      {/* Complaint List */}
      {filteredComplaints.length === 0 ? (
        <div className="bg-white rounded-xl border p-10 text-center">
          <h3 className="text-lg font-semibold">
            No Complaints Found
          </h3>

          <p className="text-slate-500 mt-2">
            You haven't submitted any complaint yet.
          </p>
        </div>
      ) : (
        <ComplaintCard complaints={filteredComplaints} />
      )}
    </div>
  )
}

export default MyComplaints
