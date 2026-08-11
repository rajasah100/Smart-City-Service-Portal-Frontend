import {  FaCalendarAlt, FaShieldAlt } from "react-icons/fa";
import Card from "../components/index/service/Card";
import { GoReport } from "react-icons/go";
import { PiNoteBold } from "react-icons/pi";
import { RiGovernmentLine } from "react-icons/ri";

const ServicePage = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-16">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#10151c] to-[#1e2a38] py-20">
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="h-full w-full"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle at 20% 50%, #4a6c8f 0%, transparent 50%), radial-gradient(circle at 80% 20%, #d9a441 0%, transparent 40%)",
                        }}
                    />
                </div>

                <div className="relative mx-auto max-w-4xl px-6 text-center">
                    <span className="inline-block rounded-full border border-white/60 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#d9a441]">
                        Smart City Portal
                    </span>

                    <h1 className="mt-5 text-4xl font-bold text-white md:text-5xl">
                        Smart City Services
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-300">
                        Access essential municipal and government services from one platform.
                        Fast, transparent, and designed to make public services easier for
                        every citizen.
                    </p>
                </div>
            </section>

            {/* Services */}
            <section className="mx-auto max-w-7xl px-6 py-16">
                <div className="mb-14 text-center">
                    <span className="text-sm font-semibold uppercase tracking-widest text-[#d9a441]">
                        Available Services
                    </span>

                    <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
                        Explore Our Digital Services
                    </h2>

                    <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-[#d9a441]"></div>

                    <p className="mx-auto mt-5 max-w-2xl text-gray-600">
                        Select a service below to continue. Each service is designed to
                        provide a simple, secure, and citizen-friendly digital experience.
                    </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

                    <Card
                        icon={<GoReport className="text-3xl" />}
                        title="Complaint Registration"
                        description="Submit complaints, upload evidence, and track progress until resolution."
                        link="/complaint"
                    />

                    <Card
                        icon={<PiNoteBold className="text-3xl" />}
                        title="Public Notices"
                        description="Read official announcements, public notices, and municipality updates."
                        link="/notices"
                    />

                   
                    <Card
                        icon={<FaCalendarAlt className="text-3xl" />}
                        title="Events"
                        description="Explore upcoming events, campaigns, and community programs."
                        link="/events"
                    />

                    <Card
                        icon={<FaShieldAlt className="text-3xl" />}
                        title="Emergency Services"
                        description="Quickly access emergency contacts and nearby emergency facilities."
                        link="/emergency"
                    />

                     <Card
                        icon={<RiGovernmentLine className="text-3xl" />}
                        title="Government Services"
                        description="Access municipal services and important citizen resources online."
                        link="/government"
                    />


                    {/* <Card
                        icon={<RiRobot2Line className="text-3xl" />}
                        title="AI Assistant"
                        description="Ask questions about city services and receive instant AI-powered assistance."
                        link="#"
                    /> */}


{/* 
                    <Card
                        icon={<FaBullhorn className="text-3xl" />}
                        title="Announcements"
                        description="Stay informed with the latest municipality news and public updates."
                        link="/announcements"
                    /> */}

                    {/* <Card
                        icon={<FaUsers className="text-3xl" />}
                        title="Citizen Dashboard"
                        description="Manage your profile, view complaints, registrations, and activity history."
                        link="/user"
                    /> */}

                </div>
            </section>
        </div>
    );
};

export default ServicePage;