import { FiX } from "react-icons/fi";
import { RiRobot2Fill } from "react-icons/ri";
import { IoSparkles, IoShieldCheckmarkOutline } from "react-icons/io5";
import AIComplaintChat from "./AIComplaintChat";

const AIChatDrawer = ({ open, onClose }) => {
    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                className={`fixed inset-0 z-9998 bg-black/40 backdrop-blur-sm transition-opacity duration-300  ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 z-9999 h-screen w-full sm:w-[430px] bg-white shadow-2xl transition-transform duration-300 flex flex-col ${open ? "translate-x-0" : "translate-x-full"}`}
            >

                {/* Heading */}
                <div className="bg-gradient-to-r from-[#0f4c81] to-[#0c365c]  text-white px-6 py-5">

                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center">
                                <RiRobot2Fill size={28} />
                            </div>

                            <div>
                                <h2 className="text-lg font-bold">Smart City AI</h2>

                                <div className="flex items-center gap-2 text-sm text-white/90">
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                    Online

                                    <span className="opacity-70">• Official Assistant</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="hover:bg-white/10 cursor-pointer p-2 rounded-lg transition"
                        >
                            <FiX size={24} />
                        </button>
                    </div>
                </div>

                {/* Welcome */}
                <div className="border-b bg-slate-50 px-5 py-4
                ">
                    <div className="flex items-start gap-3 mt-1">
                        <IoSparkles
                            size={23}
                            className="text-amber-500 mt-1"
                        />

                        <div>

                            <h3 className="font-semibold">
                                Welcome 👋
                            </h3>

                            <p className="text-sm text-gray-600 mt-1">
                                I'm your official Smart City Assistant.
                                I can help you register complaints,
                                check notices, departments,
                                emergency contacts and much more.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="px-5 py-2.5 bg-blue-50 border-b">
                    <div className="flex gap-2 items-center text-sm text-[#0f4c81]">

                        <IoShieldCheckmarkOutline size={18} />
                        Secure & Official Government AI Assistant
                    </div>
                </div>

                {/* Chat */}
                <div className="flex-1 overflow-hidden">
                    <AIComplaintChat />
                </div>
            </div>
        </>
    )
}

export default AIChatDrawer
