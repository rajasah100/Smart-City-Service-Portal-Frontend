import { FaPhone, FaUser } from "react-icons/fa"
import { MdEmail } from "react-icons/md"
import { useSelector } from "react-redux";


const CitizenInfo = ({ data, updateField }) => {
    const { userInfo } = useSelector((state) => state.auth)

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Citizen Information</h2>
                <p className="text-gray-500 mt-2">
                    Your information has been automatically loaded from your account.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                    </label>
                    <div className="relative">
                        <FaUser
                            size={20}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={userInfo?.name || ""}
                            readOnly
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#0fac81]"
                        />
                    </div>
                </div>

                {/* Phone */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Mobile Number
                    </label>
                    <div className="relative">
                        <FaPhone
                            size={20}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="tel"
                            value={data.phone}
                            onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, ""); // numbers मात्र

                                if (value.length <= 10) {
                                    updateField("phone", value);
                                }
                            }}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={10}
                            placeholder="98XXXXXXXXX"
                            readOnly={!!userInfo?.phone}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#0fac81]"
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                    </label>
                    <div className="relative">
                        <MdEmail
                            size={20}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="email"
                            value={userInfo?.email}
                            readOnly
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#0fac81]"
                        />
                    </div>
                </div>
            </div>

            {/* Information Box */}
            <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <h3 className="font-semibold text-[#0f4c81]">
                    Privacy Notice
                </h3>

                <p className="text-sm text-gray-600 mt-2 leading-6">
                    Your personal information will only be used to process your complaint and communicate updates. It will not be shared with unauthorized third parties.
                </p>
            </div>
        </div>
    )
}

export default CitizenInfo
