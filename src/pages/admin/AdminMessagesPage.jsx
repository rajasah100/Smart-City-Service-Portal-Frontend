import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import { FaEnvelope, FaEnvelopeOpen, FaPhoneAlt, FaReply, FaTrash } from "react-icons/fa";
import apiRequest from "../../utils/apiRequest";

// About page ko "सम्पर्क" form bata aayeka message
const AdminMessagesPage = () => {
    const [messages, setMessages] = useState(null);
    const [selectedId, setSelectedId] = useState(null);

    const load = useCallback(
        () =>
            apiRequest
                .get("/contact")
                .then(({ data }) => setMessages(data.messages || []))
                .catch(() => {
                    setMessages([]);
                    toast.error("Failed to load messages.");
                }),
        []
    );

    useEffect(() => {
        const timer = setTimeout(load, 0);
        return () => clearTimeout(timer);
    }, [load]);

    const setRead = async (message, isRead) => {
        try {
            await apiRequest.put(`/contact/${message._id}/read`, { isRead });
            setMessages((prev) => prev.map((m) => (m._id === message._id ? { ...m, isRead } : m)));
        } catch {
            toast.error("Update failed.");
        }
    };

    const open = (message) => {
        setSelectedId(message._id);
        if (!message.isRead) setRead(message, true);
    };

    const remove = async (message) => {
        if (!window.confirm("Delete this message?")) return;

        try {
            await apiRequest.delete(`/contact/${message._id}`);
            setMessages((prev) => prev.filter((m) => m._id !== message._id));
            if (selectedId === message._id) setSelectedId(null);
            toast.success("Message deleted.");
        } catch {
            toast.error("Delete failed.");
        }
    };

    const selected = messages?.find((m) => m._id === selectedId);
    const unread = messages?.filter((m) => !m.isRead).length || 0;

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-xl font-bold sm:text-2xl">Contact Messages</h1>
                <p className="text-sm text-gray-500 sm:text-base">
                    Messages sent from the About page contact form. {unread > 0 && <b>{unread} unread.</b>}
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-5">
                {/* List */}
                <div className="overflow-hidden rounded-lg border bg-white lg:col-span-2">
                    {messages === null ? (
                        <p className="py-10 text-center text-gray-500">Loading...</p>
                    ) : messages.length === 0 ? (
                        <p className="py-10 text-center text-gray-500">No messages yet.</p>
                    ) : (
                        <ul className="max-h-[70vh] divide-y overflow-y-auto">
                            {messages.map((message) => (
                                <li key={message._id}>
                                    <button
                                        onClick={() => open(message)}
                                        className={`block w-full px-4 py-3 text-left transition hover:bg-gray-50 ${
                                            selectedId === message._id ? "bg-blue-50" : ""
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <span className={`truncate ${message.isRead ? "text-gray-700" : "font-bold text-gray-900"}`}>
                                                {!message.isRead && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-600" />}
                                                {message.name}
                                            </span>
                                            <span className="shrink-0 text-xs text-gray-400">
                                                {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className="mt-0.5 truncate text-sm text-gray-500">{message.subject}</p>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Detail */}
                <div className="rounded-lg border bg-white p-6 lg:col-span-3">
                    {!selected ? (
                        <p className="py-10 text-center text-gray-500">Select a message to read it.</p>
                    ) : (
                        <div>
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <h2 className="text-lg font-bold">{selected.subject}</h2>
                                    <p className="mt-1 text-sm text-gray-600">
                                        {selected.name} · <a href={`mailto:${selected.email}`} className="text-blue-600 hover:underline">{selected.email}</a>
                                        {selected.phone && (
                                            <> · <a href={`tel:${selected.phone}`} className="inline-flex items-center gap-1 text-blue-600 hover:underline"><FaPhoneAlt size={10} />{selected.phone}</a></>
                                        )}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-400">{new Date(selected.createdAt).toLocaleString()}</p>
                                </div>

                                <div className="flex gap-2">
                                    <a
                                        href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`}
                                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                                    >
                                        <FaReply size={12} />
                                        Reply
                                    </a>
                                    <button
                                        onClick={() => setRead(selected, !selected.isRead)}
                                        className="rounded-lg border p-2 text-gray-600 hover:bg-gray-50"
                                        title={selected.isRead ? "Mark as unread" : "Mark as read"}
                                    >
                                        {selected.isRead ? <FaEnvelope /> : <FaEnvelopeOpen />}
                                    </button>
                                    <button
                                        onClick={() => remove(selected)}
                                        className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700"
                                        aria-label="Delete"
                                    >
                                        <FaTrash size={13} />
                                    </button>
                                </div>
                            </div>

                            <p className="mt-6 whitespace-pre-line border-t pt-6 leading-7 text-gray-700">{selected.message}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminMessagesPage;
