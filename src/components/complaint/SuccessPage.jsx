
import { FaCalendarDay, FaCheckCircle, FaHashtag, FaPrint } from "react-icons/fa"
import { FiRotateCcw } from "react-icons/fi";


const SuccessPage = ({ data }) => {
  const trackingId = data?.complaintId;

  const handlePrint = () => {
    window.print();
  }

  const handleNewComplaint = () => {
    window.location.reload(true);
  }

  if (!data) {
    return (
      <div className="text-center py-10">
        No complaint data found.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-20  print:mt-0">
      {/* Success Card */}
      <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
        {/* Heading */}
        <div className="bg-green-600 print:bg-green-600 text-white text-center py-6 print:hidden">
          <FaCheckCircle size={70} className="mx-auto mb-4" />
          <h1 className="text-3xl font-bold">
            Complaint Submitted Successfully
          </h1>

          <p className="mt-3 text-green-100">
            Your complaint has been successfully registered
          </p>
        </div>

        {/* Body */}
        <div className="p-5 print:p-2">

          {/* Print Header */}
          <div className="hidden print:block text-center border-b-2 border-gray-300 pb-5 mb-6 print:mb-2">
            {/* <img
              src={logo}
              alt="Logo"
              className="w-20 h-20 mx-auto mb-3"
            /> */}

            <h1 className="text-3xl font-bold text-gray-800">
              Smart City Service Portal
            </h1>

            <p className="text-lg text-gray-600">
              Government of Nepal
            </p>

            <p className="font-semibold mt-2">
              Complaint Submission Receipt
            </p>
          </div>

          {/* Tracking */}
          <div className="border rounded-xl p-4 bg-gray-50 mb-6 print:mb-3">
            <div className="flex items-center gap-3 mb-4">
              <FaHashtag className="text-[#0f4c81]" />
              <h3 className="text-xl font-semibold">
                Tracking Number
              </h3>
            </div>

            <div className="border-2 border-dashed border-[#0f4c81] rounded-xl p-6 bg-blue-50 mb-6">
              {trackingId}
            </div>
          </div>

          {/* Date */}
          <div className="border rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <FaCalendarDay className="text-[#0f4c81]" />

              <div>
                <p className="text-sm text-gray-500">
                  Submitted On
                </p>
                <p className="font-semibold">
                  {new Date(data.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="border rounded-xl overflow-hidden mb-8 ">
            <div className="bg-gray-100 px-6 py-4 font-semibold">
              Complaint Summary
            </div>

            <div className="p-6 space-y-2">
              <div className="flex justify-between border-b pb-2 pr-2">
                <span>Citizen</span>
                <span>{data.user?.name || "N/A"}</span>
              </div>

              <div className="flex justify-between border-b pb-2 pr-2">
                <span>Phone</span>
                <span>{data.user?.phone || "-"}</span>
              </div>

              <div className="flex justify-between border-b pb-2 pr-2">
                <span>Department</span>
                <div className="flex justify-between  pb-2">
                  <span>{data.department?.name || "-"}</span>
                </div>
              </div>

              <div className="flex justify-between border-b pb-2 pr-2">
                <span>Priority</span>

                <span>
                  {data.priority}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2 pr-2">
                <span>Province</span>
                <span>{data.location?.province}</span>
              </div>
              <div className="flex justify-between border-b pb-2 pr-2">
                <span>District</span>
                <span>{data.location?.district}</span>
              </div>
              <div className="flex justify-between border-b pb-2 pr-2">
                <span>Municipality</span>
                <span>{data.location?.municipality}</span>
              </div>
              <div className="flex justify-between border-b pb-2 pr-2">
                <span>Ward No.</span>
                <span>{data.location?.ward}</span>
              </div>
              <div className="flex justify-between border-b pb-2 pr-2">
                <span>Tole / Street</span>
                <span>{data.location?.tole}</span>
              </div>

            </div>
          </div>

          {/* Notice */}
         

          <div className="hidden print:block mt-10 border-t pt-5 text-center text-sm text-gray-600">
            <p className="font-semibold">
              This is a computer-generated complaint receipt.
            </p>

            <p>
              Please keep this receipt for future reference.
            </p>

            <p className="mt-2">
              Website: www.smartcity.gov.np
            </p>

            <p>
              Email: support@smartcity.gov.np
            </p>
          </div>

          {/* Button */}
          <div className="flex flex-wrap gap-4 print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-[#0f4c81] text-white px-6 py-3 rounded-lg transition"
            >
              <FaPrint size={18} />
              Print Receipt
            </button>

            <button
              onClick={handleNewComplaint}
              className="flex items-center gap-2 border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100 transition print:hidden"
            >
              <FiRotateCcw size={18} />
              Submit Another Complaint
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuccessPage
