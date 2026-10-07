import { useTranslation } from "react-i18next";
import {
    FaIdCard,
    FaCar,
    FaPassport,
    FaFileInvoiceDollar,
    FaBriefcase,
    FaHeartbeat,
} from "react-icons/fa";

import { RiGovernmentLine } from "react-icons/ri";
import Card from "../components/index/government/Card";
import PageHero from "../components/common/PageHero";

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
    const { t } = useTranslation();

    return (
        <section className="min-h-screen bg-slate-50">
            {/* Hero */}
            <PageHero
                icon={RiGovernmentLine}
                badge={t("hero.government.badge")}
                title={t("hero.government.title")}
                description={t("hero.government.description")}
            />

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