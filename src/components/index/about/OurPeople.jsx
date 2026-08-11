import raja from "../../../assets/raja.jpeg"
import dipesh from "../../../assets/dipesh.jpeg"
import kajjal from "../../../assets/kajjal.jpeg"
import bunu from "../../../assets/bunu.jpeg"

const teamMembers = [
    {
        image: dipesh,
        name: "Dipesh Kumar Mahato",
        role: "Frontend Developer & System Designer",
    },
    {
        image: raja,
        name: "Raja Kumar Sah",
        role: "Backend Developer & AI Integration",
    },
    {
        image: bunu,
        name: "Bunu Khatiwada",
        role: "Frontend Developer",
    },
    {
        image: kajjal,
        name: "Kajjal Chamlagain",
        role: "UI/UX Designer",
    },
];

const OurPeople = () => {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">

                {/* Heading */}
                <div className="text-center max-w-3xl mx-auto">
                    <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
                        Our People
                    </span>

                    <h2 className="mt-5 text-4xl md:text-5xl font-bold text-slate-900">
                        Meet the Team Behind Smart City
                    </h2>

                    <p className="mt-6 text-lg leading-8 text-slate-600">
                        Our dedicated professionals work together to deliver transparent,
                        efficient, and citizen-focused digital services that improve the
                        quality of life in our community.
                    </p>
                </div>

                {/* Team */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {teamMembers.map((member) => (
                        <div
                            key={member.name}
                            className="text-center group"
                        >
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-24 h-24 mx-auto rounded-2xl object-cover shadow-md transition duration-300 group-hover:scale-105"
                            />

                            <h3 className="mt-5 font-semibold text-slate-900">
                                {member.name}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                {member.role}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default OurPeople;