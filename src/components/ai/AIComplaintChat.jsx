import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    FiAlertTriangle,
    FiBell,
    FiFileText,
    FiSend,
} from "react-icons/fi";
import { FaBuildingColumns } from "react-icons/fa6";
import { BsRobot } from "react-icons/bs";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

import {
    addAIMessage,
    addUserMessage,
    sendAIMessage,
} from "../../redux/slices/aiSlice";

const quickActions = [
    {
        title: "Register Complaint",
        icon: FiFileText,
    },
    {
        title: "Latest Notices",
        icon: FiBell,
    },
    {
        title: "Departments",
        icon: FaBuildingColumns,
    },
    {
        title: "Emergency",
        icon: FiAlertTriangle,
    },
];

const AIComplaintChat = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userInfo } = useSelector((state) => state.auth);

    const {
        messages,
        loading,
    } = useSelector(
        (state) => state.ai
    );

    const [input, setInput] = useState("");

    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, loading]);

    // Send Message
    const handleSend = () => {
        if (!input.trim()) return;

        dispatch(addUserMessage(input));
        dispatch(sendAIMessage(input));

        setInput("");
    };

    // Quick Action
    const handleQuickAction = (text) => {
        // Login required actions
        if (
            !userInfo &&
            (text === "Register Complaint" ||
                text === "My Complaint Status")
        ) {
            dispatch(addUserMessage(text));

            dispatch({
                type: "ai/addAIMessage",
                payload:
                    "🔐 Please login first to use this feature.\n\nAfter login, I can help you register and track your complaints.",
            });

            return;
        }

        let message;

        switch (text) {
            case "Register Complaint":
                dispatch(addUserMessage(text));

                dispatch(
                    addAIMessage({
                        text: `📝 I can help you register a new complaint.

Click the button below to open the Complaint Registration page.

There you can:
• Fill complaint details
• Upload images
• Select location
• Review before submitting`,
                        action: "new_complaint",
                    })
                );

                return;

            case "Latest Notices":
                message = "Show latest notices";
                break;

            case "Departments":
                message = "List all departments";
                break;

            case "Emergency":
                message = "Show emergency services";
                break;

            default:
                message = text;
        }

        dispatch(addUserMessage(text));
        dispatch(sendAIMessage(message));
    };


    return (
        <div className="flex flex-col h-full">

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-5">

                {/* Quick Action */}
                {messages.length === 1 && (
                    <div className="grid grid-cols-2 gap-3 mb-6">

                        {quickActions.map((item) => (
                            <button
                                key={item.title}
                                onClick={() => handleQuickAction(item.title)}
                                className="bg-white border rounded-xl p-4 hover:bg-[#0f4c81] hover:text-white transition-all duration-200 shadow-sm flex flex-col items-center gap-2 cursor-pointer"
                            >
                                <item.icon size={20} />

                                <span className="text-sm font-medium text-center">
                                    {item.title}
                                </span>

                            </button>
                        ))}

                    </div>
                )}

                {/* Chat */}

                <div className="space-y-4">

                    {messages.map((msg, index) => (

                        <div
                            key={index}
                            className={`flex ${msg.sender === "user"
                                ? "justify-end"
                                : "justify-start"
                                }`}
                        >

                            <div
                                className={`flex gap-2 max-w-[85%] ${msg.sender === "user"
                                    ? "flex-row-reverse"
                                    : ""
                                    }`}
                            >

                                {/* Avatar */}

                                <div
                                    className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shrink-0 ${msg.sender === "user"
                                        ? "bg-[#0f4c81]"
                                        : "bg-white border"
                                        }`}
                                >
                                    {msg.sender === "user" ? (
                                        userInfo?.avatar ? (
                                            <img
                                                src={userInfo.avatar}
                                                alt={userInfo.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <HiOutlineUserCircle size={24} className="text-white" />
                                        )
                                    ) : (
                                        <BsRobot size={20} />
                                    )}
                                </div>

                                {/* Bubble */}

                                <div
                                    className={`px-4 py-3 rounded-2xl shadow-sm whitespace-pre-line text-sm ${msg.sender === "user"
                                            ? "bg-[#0f4c81] text-white"
                                            : "bg-white border"
                                        }`}
                                >
                                    {msg.text}

                                    {msg.action === "new_complaint" && (
                                        <button
                                            onClick={() => navigate("/complaint")}
                                            className="mt-4 w-full bg-[#0f4c81] hover:bg-[#0b3c66] text-white py-2 rounded-lg font-medium transition"
                                        >
                                            📝 New Complaint
                                        </button>
                                    )}
                                </div>

                            </div>

                        </div>

                    ))}

                    {loading && (
                        <div className="flex">

                            <div className="flex gap-2 items-center bg-white border rounded-2xl px-4 py-3 shadow-sm">

                                <BsRobot />

                                <span className="text-sm text-gray-500">
                                    AI is thinking...
                                </span>

                            </div>

                        </div>
                    )}

                    <div ref={bottomRef}></div>

                </div>

            </div>

            {/* Input */}

            <div className="border-t bg-white p-4">

                <div className="flex gap-3">

                    <input
                        type="text"
                        placeholder="Ask anything..."
                        value={input}
                        onChange={(e) =>
                            setInput(e.target.value)
                        }
                        onKeyDown={(e) =>
                            e.key === "Enter" && handleSend()
                        }
                        className="flex-1 border rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-[#0f4c81]"
                    />

                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className="w-12 h-12 rounded-full bg-[#0f4c81] text-white flex items-center justify-center hover:bg-[#0b3c66] disabled:opacity-50 cursor-pointer"
                    >
                        <FiSend size={20} />
                    </button>

                </div>

            </div>

        </div>
    );
};

export default AIComplaintChat;