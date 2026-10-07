import { useTranslation } from "react-i18next";
import { FaCode, FaServer } from "react-icons/fa";
import raja from "../../../assets/raja.jpeg";
import dipesh from "../../../assets/dipesh.jpeg";
import Reveal from "../../common/Reveal";

const TEAM = [
    { image: dipesh, name: "Dipesh Kumar Mahato", role: "frontendDesign", icon: FaCode },
    { image: raja, name: "Raja Kumar Sah", role: "backendAi", icon: FaServer },
];

// Portal banaune project team
const OurPeople = () => {
    const { t } = useTranslation();

    return (
        <section className="bg-white py-20">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <Reveal className="mx-auto mb-12 max-w-2xl text-center">
                    <span className="text-sm font-semibold uppercase tracking-widest text-[#d9a441]">
                        {t("aboutPage.teamLabel")}
                    </span>
                    <h2 className="mt-2 text-3xl font-bold text-slate-900">{t("aboutPage.teamTitle")}</h2>
                    <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-[#d9a441]" />
                    <p className="mt-4 text-slate-500">{t("aboutPage.teamText")}</p>
                </Reveal>

                <div className="grid gap-8 md:grid-cols-2">
                    {TEAM.map(({ image, name, role, icon: Icon }, index) => (
                        <Reveal key={name} delay={index * 120}>
                            <div className="group h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                                {/* Photo area */}
                                <div className="relative bg-linear-to-br from-[#003893] to-[#0b1b3a] px-6 pb-16 pt-8 text-center">
                                    <div
                                        className="pointer-events-none absolute inset-0 opacity-10"
                                        style={{
                                            backgroundImage:
                                                "radial-gradient(circle at 20% 20%, #d9a441 0%, transparent 40%), radial-gradient(circle at 80% 90%, #dc143c 0%, transparent 40%)",
                                        }}
                                    />
                                    <span className="relative inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
                                        <Icon className="text-[#d9a441]" />
                                        {t(`aboutPage.roles.${role}`)}
                                    </span>
                                </div>

                                <div className="-mt-14 px-6 pb-8 text-center">
                                    <img
                                        src={image}
                                        alt={name}
                                        className="relative mx-auto h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg transition duration-300 group-hover:scale-105"
                                    />

                                    <h3 className="mt-4 text-xl font-bold text-slate-900">{name}</h3>

                                    <div className="mx-auto mt-3 h-0.5 w-12 rounded-full bg-[#dc143c]" />

                                    <p className="mt-4 text-sm leading-6 text-slate-500">
                                        {t(`aboutPage.roleText.${role}`)}
                                    </p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OurPeople;
