import {
    FaShieldAlt,
    FaUsers,
    FaLightbulb,
    FaGlobeAsia,
} from "react-icons/fa";

const values = [
    {
        icon: FaShieldAlt,
        title: "Transparency",
        description:
            "We ensure openness by providing citizens with easy access to public information, notices, and government services.",
    },
    {
        icon: FaUsers,
        title: "Citizen-Centric",
        description:
            "Our platform is designed with citizens in mind, making public services simple, accessible, and user-friendly.",
    },
    {
        icon: FaLightbulb,
        title: "Innovation",
        description:
            "We embrace modern technology to deliver smarter, faster, and more efficient digital public services.",
    },
    {
        icon: FaGlobeAsia,
        title: "Accessibility",
        description:
            "Essential government services are available anytime, anywhere, ensuring equal access for every citizen.",
    },
];

const CoreValue = () => {
    return (
        <section className="bg-slate-50 py-20 px-4">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                {/* Heading */}
                <div className="mb-14 text-center">
                    <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 mb-4">
                        Core Values
                    </span>

                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                        Principles That Drive Our Platform
                    </h2>

                    <p className="text-md leading-8 text-slate-600">
                        Our Smart City Information Portal is built on values that strengthen
                        trust, improve public services, and encourage active citizen
                        participation.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((value) => {
                        const Icon = value.icon;

                        return (
                            <div
                                key={value.title}
                                className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 text-center"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5 mx-auto">
                                    <Icon size={30} className="w-7 h-7" />
                                </div>

                                <h3 className="text-xl font-bold mb-3 text-slate-900">
                                    {value.title}
                                </h3>

                                <p className="text-slate-600 leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CoreValue;