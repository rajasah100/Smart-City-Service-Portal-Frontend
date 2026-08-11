import { Link } from "react-router-dom";
import {
    FaArrowRight,
    FaRobot,
    FaShieldAlt,
    FaCalendarAlt,
    FaBullhorn,
    FaExclamationCircle,
    FaUniversity,
} from "react-icons/fa";

const services = [
    {
        icon: <FaExclamationCircle />,
        title: "Complaint Management",
        description:
            "Submit complaints, track their progress, and receive timely updates from the concerned department.",
        link: "/complaint",
    },
    {
        icon: <FaBullhorn />,
        title: "Latest Notices",
        description:
            "Stay informed with official announcements, public notices, and important city updates.",
        link: "/notices",
    },
    {
        icon: <FaCalendarAlt />,
        title: "City Events",
        description:
            "Explore upcoming community events, campaigns, and municipal programs happening in your city.",
        link: "/events",
    },
    {
        icon: <FaShieldAlt />,
        title: "Emergency Services",
        description:
            "Quickly access emergency contacts and essential public safety services whenever needed.",
        link: "/emergency",
    },
    {
        icon: <FaUniversity />,
        title: "Government Services",
        description:
            "Access essential municipal services and public information through a single digital platform.",
        link: "/government",
    },

    {
        icon: <FaRobot />,
        title: "AI Assistant",
        description:
            "Get instant answers to questions about government services and city information using AI.",
        link: "#",
    },
];

const FeaturedServices = () => {
    return (
        <section className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Heading */}
                <div className="max-w-3xl mx-auto text-center">
                    <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
                        Featured Services
                    </span>

                    <h2 className="mt-5 text-4xl font-bold text-slate-900">
                        Essential Services for Every Citizen
                    </h2>

                    <p className="mt-6 text-lg text-slate-600 leading-8">
                        Access the most frequently used government services through a single,
                        secure, and user-friendly digital platform.
                    </p>
                </div>

                {/* Service Cards */}
                <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <div
                            key={service.title}
                            className="group rounded-2xl bg-white p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600 text-2xl group-hover:bg-[#4a6c8f] group-hover:text-white transition">
                                {service.icon}
                            </div>

                            <h3 className="mt-6 text-xl font-semibold text-slate-900">
                                {service.title}
                            </h3>

                            <p className="mt-3 text-slate-600 leading-7">
                                {service.description}
                            </p>

                            <Link
                                to={service.link}
                                className="mt-6 inline-flex items-center gap-2 font-medium text-[#4a6c8f] hover:text-[#36516d]"
                            >
                                Learn More
                                <FaArrowRight className="text-sm" />
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Button */}
                <div className="mt-14 text-center">
                    <Link
                        to="/services"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#4a6c8f] px-8 py-3 text-white font-semibold transition hover:bg-[#36516d]"
                    >
                        View All Services
                        <FaArrowRight />
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default FeaturedServices;