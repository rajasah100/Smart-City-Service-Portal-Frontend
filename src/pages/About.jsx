import { Link } from "react-router-dom";
import AboutHero from "../components/index/about/AboutHero";
import { FaArrowRight } from "react-icons/fa";
import CoreValue from "../components/index/about/CoreValue";
import OurPeople from "../components/index/about/OurPeople";
import GetTouch from "../components/index/about/GetTough";


const About = () => {
    return (
        <div className="min-h-screen bg-gray-50">

            <AboutHero />

            {/* Mission Section */}
            <section className="bg-white py-20 px-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">

                        {/* LEFT */}
                        <div>
                            <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-4">
                                Our Mission
                            </span>

                            <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-[#10151c] mb-6">
                                Empowering Citizens Technology
                            </h2>

                            <p className="text-lg leading-relaxed text-slate-500 mb-8">
                                SmartCity Portal was created to bridge the gap between citizens and
                                local government through a single digital platform. Our goal is to
                                make public services faster, easier, and more transparent for everyone.
                            </p>

                            <p className="text-lg leading-relaxed text-slate-500 mb-8">
                                Citizens can access government services, submit complaints, receive
                                announcements, explore community events, and stay connected with
                                their municipality anytime, anywhere.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to="/services"
                                    className="flex items-center justify-center gap-2 rounded-md bg-[#4a6c8f] px-5 py-1 text-white font-medium transition-all duration-300 hover:bg-[#36516d]"
                                >
                                    Explore Services
                                    <FaArrowRight className="text-sm" />
                                </Link>

                                <Link
                                    to="/complaint"
                                    className="inline-flex items-center rounded-md border border-[#4a6c8f] px-6 py-4 text-[#4a6c8f] font-medium transition-all duration-300 hover:bg-[#4a6c8f] hover:text-white"
                                >
                                    File a Complaint
                                </Link>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                {
                                    value: "48K+",
                                    title: "Registered Citizens",
                                },
                                {
                                    value: "324",
                                    title: "Active Services",
                                },
                                {
                                    value: "79.5%",
                                    title: "Resolution Rate",
                                },
                                {
                                    value: "24/7",
                                    title: "Emergency Support",
                                },
                            ].map((item) => (
                                <div
                                    key={item.title}
                                    className="rounded-3xl bg-linear-to-br from-[#1e2a38] to-[#10151c] p-6 shadow-lg transition duration-300 hover:-translate-y-2"
                                >
                                    <h2 className="text-center text-3xl font-bold text-[#d9a441] mb-2">
                                        {item.value}
                                    </h2>

                                    <p className="text-center text-sm text-slate-300">
                                        {item.title}
                                    </p>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </section>

            {/* Values */}
            <CoreValue />

            {/* Our People */}
            <OurPeople />

            {/* Get Tough */}
            <GetTouch />

        </div>
    );
};

export default About;