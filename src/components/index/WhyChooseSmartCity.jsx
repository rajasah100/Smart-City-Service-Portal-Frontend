import {
    FaShieldAlt,
    FaBolt,
    FaUsers,
    FaGlobe,
} from "react-icons/fa";

const features = [
    {
        icon: <FaShieldAlt />,
        title: "Secure & Reliable",
        description:
            "Advanced security measures protect citizen data while ensuring reliable access to government services.",
    },
    {
        icon: <FaBolt />,
        title: "Fast Digital Services",
        description:
            "Access essential municipal services quickly through a modern and easy-to-use digital platform.",
    },
    {
        icon: <FaUsers />,
        title: "Citizen-Centric",
        description:
            "Designed to improve citizen engagement by providing convenient access to services and information.",
    },
    {
        icon: <FaGlobe />,
        title: "Accessible Anytime",
        description:
            "Stay connected with your municipality 24/7 from anywhere using any internet-enabled device.",
    },
];

const WhyChooseSmartCity = () => {
    return (
        <section className="bg-slate-100 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Heading */}
                <div className="max-w-3xl mx-auto text-center">
                    <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
                        Why Choose Us
                    </span>

                    <h2 className="mt-5 text-4xl font-bold text-slate-900">
                        Why Choose Smart City Service Portal?
                    </h2>

                    <p className="mt-6 text-lg leading-8 text-slate-600">
                        Our platform simplifies public services by combining technology,
                        transparency, and accessibility into one secure digital solution
                        for every citizen.
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                        >
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-3xl text-blue-600 transition-all duration-300 group-hover:bg-[#4a6c8f] group-hover:text-white">
                                {feature.icon}
                            </div>

                            <h3 className="mt-6 text-xl font-semibold text-slate-900">
                                {feature.title}
                            </h3>

                            <p className="mt-4 leading-7 text-slate-600">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default WhyChooseSmartCity;