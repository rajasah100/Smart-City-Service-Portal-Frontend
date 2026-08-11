import { Link } from "react-router-dom";
import {
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
    FaArrowRight,
    FaClock,
} from "react-icons/fa";

const contactInfo = [
    {
        icon: <FaMapMarkerAlt size={22} />,
        title: "Location",
        value: "Madan Bhandari College of Engineering\nUrlabari-03, Morang, Nepal",
    },
    {
        icon: <FaPhoneAlt size={22} />,
        title: "Phone",
        value: "+977 9804702922\n+977 9812060473",
    },
    {
        icon: <FaEnvelope size={22} />,
        title: "Email",
        value: "info@smartcity.gov.np\nrajakumarshah95@gmail.com",
    },
    {
        icon: <FaClock size={22} />,
        title: "Office Hours",
        value: "Sunday - Friday\n9:00 AM - 5:00 PM",
    },
];

const GetTouch = () => {
    return (
        <section className="bg-slate-50 py-20 px-4">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                {/* Heading */}
                <div className="max-w-3xl mx-auto text-center">
                    <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
                        Get In Touch
                    </span>

                    <h2 className="mt-5 text-4xl font-bold text-slate-900">
                        Contact Smart City Portal Team
                    </h2>

                    <p className="mt-6 text-lg leading-8 text-slate-600">
                        Have questions, suggestions, or feedback about the Smart City
                        Information Portal? We'd love to hear from you. Our team is always
                        ready to assist and improve your experience.
                    </p>
                </div>

                {/* Contact Section */}
                <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Left Side - Contact Details */}
                    <div className="space-y-6">
                        {contactInfo.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-5 rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-lg transition"
                            >
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                    {item.icon}
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-slate-900">
                                        {item.title}
                                    </h3>

                                    <p className="mt-2 whitespace-pre-line text-slate-600 leading-7">
                                        {item.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Side - Contact Form */}
                    <div className="rounded-2xl bg-white border border-slate-200 p-8 shadow-sm">
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">
                            Send us a Message
                        </h3>

                        <form className="space-y-5">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-700">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-700">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-700">
                                    Subject
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter subject"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-700">
                                    Message
                                </label>

                                <textarea
                                    rows="5"
                                    placeholder="Write your message..."
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 rounded-xl bg-[#4a6c8f] px-6 py-3 font-semibold text-white transition hover:bg-[#36516d]"
                            >
                                Send Message
                                <FaArrowRight />
                            </button>
                        </form>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-20 rounded-3xl bg-gradient-to-r from-[#1e2a38] to-[#10151c] px-8 py-14 text-center">
                    <h3 className="text-3xl font-bold text-white">
                        Need Immediate Assistance?
                    </h3>

                    <p className="mt-4 max-w-2xl mx-auto text-slate-300">
                        Whether you have technical questions, feature suggestions, or need
                        help using the Smart City Information Portal, our team is here to
                        assist you.
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link
                            to="/services"
                            className="inline-flex items-center gap-2 rounded-md bg-[#d9a441] px-7 py-3 font-semibold text-slate-900 transition hover:bg-[#c6912d]"
                        >
                            Explore Services
                            <FaArrowRight />
                        </Link>

                        <Link
                            to="/emergency"
                            className="inline-flex items-center rounded-md border border-white px-7 py-3 font-semibold transition text-red-500 hover:bg-red-500 hover:text-white"
                        >
                            Emergency Service
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GetTouch;