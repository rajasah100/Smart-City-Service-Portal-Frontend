import {
    FaIdCard,
    FaCar,
    FaPassport,
    FaFileInvoiceDollar,
    FaBriefcase,
    FaHeartbeat,
} from "react-icons/fa";

import Card from "../components/index/government/Card";

const services = [
    {
        id: 1,
        title: "National Identity Card",
        description:
            "Apply for a National Identity Card or check your application status online.",
        category: "Citizen Services",
        icon: <FaIdCard />,
        link: "https://donidcr.gov.np/",
    },
    {
        id: 2,
        title: "Driving License",
        description:
            "Apply for a new driving license, renew your license, or check application status.",
        category: "Transport",
        icon: <FaCar />,
        link: "https://dotm.gov.np/",
    },
    {
        id: 3,
        title: "Passport",
        description:
            "Apply for a passport and access passport-related online services.",
        category: "Citizen Services",
        icon: <FaPassport />,
        link: "https://nepalpassport.gov.np/",
    },
    {
        id: 4,
        title: "PAN Registration",
        description:
            "Register for a Permanent Account Number (PAN) and tax-related services.",
        category: "Finance",
        icon: <FaFileInvoiceDollar />,
        link: "https://ird.gov.np/",
    },
    {
        id: 5,
        title: "Company Registration",
        description:
            "Register a new business or manage company registration services.",
        category: "Business",
        icon: <FaBriefcase />,
        link: "https://ocr.gov.np/",
    },
    {
        id: 6,
        title: "Health Insurance",
        description:
            "Access government health insurance information and enrollment services.",
        category: "Health",
        icon: <FaHeartbeat />,
        link: "https://hib.gov.np/",
    },
];

const GovernmentPage = () => {
    return (
        <section className="min-h-screen bg-slate-50 pt-16">
            {/* Hero */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#10151c] to-[#1e2a38] py-20 px-4">
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="w-full h-full"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle at 20% 50%, #4a6c8f 0%, transparent 50%), radial-gradient(circle at 80% 20%, #d9a441 0%, transparent 40%)",
                        }}
                    />
                </div>

                <div className="relative max-w-4xl mx-auto text-center">
                    <span className="text-[#d9a441] uppercase tracking-wider text-xs border border-white/70 px-3 py-1 rounded-full font-bold">
                        Government Services
                    </span>

                    <h1 className="mt-4 text-3xl md:text-5xl font-bold text-white">
                        Government Services Portal
                    </h1>

                    <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
                        Access official government services from one place. Select a service
                        and continue securely to the official government website.
                    </p>
                </div>
            </div>

            {/* Services */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center mb-14">
                    <span className="inline-block text-[#d9a441] font-semibold uppercase tracking-widest text-sm">
                        Services
                    </span>

                    <h2 className="mt-2 text-3xl md:text-4xl font-bold text-slate-900">
                        Available Government Services
                    </h2>

                    <div className="w-20 h-1 bg-[#d9a441] rounded-full mx-auto mt-4"></div>

                    <p className="mt-5 max-w-2xl mx-auto text-gray-600">
                        Choose any service below to continue to the official government
                        portal.
                    </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                        <Card
                            key={service.id}
                            icon={service.icon}
                            title={service.title}
                            description={service.description}
                            category={service.category}
                            link={service.link}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GovernmentPage;