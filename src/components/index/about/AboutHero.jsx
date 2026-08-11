import { FaCity } from "react-icons/fa";

const AboutHero = () => {
    return (
        <div className="pt-16">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#10151c] to-[#1e2a38] px-4 py-16">

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="w-full h-full"
                        style={{
                            backgroundImage: `
                radial-gradient(circle at 20% 50%, #4a6c8f 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, #d9a441 0%, transparent 40%)
              `,
                        }}
                    />
                </div>

                {/* Content */}
                <div className="relative max-w-3xl mx-auto text-center">

                    {/* Badge */}
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#d9a441]">
                        <FaCity />
                        About Us
                    </span>

                    {/* Title */}
                    <h1 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
                        Transforming Public Services for a Better Tomorrow
                    </h1>

                    {/* Description */}
                    <p className="mt-4 text-base leading-7 text-slate-400">
                        The Smart City Information Portal is the official digital gateway that connects citizens with their municipality. Our mission is to provide transparent, efficient, and citizen-centric services by offering easy access to notices, complaints, departments, emergency contacts, and community events-all through a single, user-friendly platform.
                    </p>

                </div>
            </div>
        </div>
    );
};

export default AboutHero;