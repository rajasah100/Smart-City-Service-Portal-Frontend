import { useTranslation } from "react-i18next";
import { FaBullseye, FaEye } from "react-icons/fa";
import AboutHero from "../components/index/about/AboutHero";
import CoreValue from "../components/index/about/CoreValue";
import OurPeople from "../components/index/about/OurPeople";
import GetTouch from "../components/index/about/GetTough";
import HomeStats from "../components/index/home/HomeStats";
import OfficialsSection from "../components/index/home/OfficialsSection";
import Reveal from "../components/common/Reveal";
import useSiteSettings from "../hooks/useSiteSettings";
import introImage from "../assets/cityImg.jpg";

const About = () => {
    const { t, i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage === "en";
    const settings = useSiteSettings();

    return (
        <div className="min-h-screen bg-slate-50">
            <AboutHero />

            {/* परिचय + उद्देश्य/दृष्टि */}
            <section className="bg-white py-20">
                <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
                    <Reveal>
                        <span className="text-sm font-semibold uppercase tracking-widest text-[#d9a441]">
                            {t("aboutPage.introLabel")}
                        </span>

                        <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                            {isEn ? settings.nameEn : settings.nameNe}
                        </h2>

                        <div className="mt-4 h-1 w-20 rounded-full bg-[#d9a441]" />

                        <p className="mt-6 whitespace-pre-line text-lg leading-8 text-slate-600">
                            {isEn ? settings.introEn : settings.introNe}
                        </p>

                        <div className="mt-8 grid gap-4 sm:grid-cols-2">
                            {[
                                { icon: FaBullseye, title: t("aboutPage.mission"), text: t("aboutPage.missionText") },
                                { icon: FaEye, title: t("aboutPage.vision"), text: t("aboutPage.visionText") },
                            ].map(({ icon: Icon, title, text }) => (
                                <div key={title} className="rounded-2xl border border-slate-200 border-l-4 border-l-[#dc143c] bg-slate-50 p-5">
                                    <h3 className="flex items-center gap-2 font-bold text-[#003893]">
                                        <Icon />
                                        {title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                                </div>
                            ))}
                        </div>
                    </Reveal>

                    <Reveal delay={150} className="relative">
                        <img
                            src={introImage}
                            alt=""
                            className="h-80 w-full rounded-2xl object-cover shadow-xl sm:h-112"
                        />
                        <div className="absolute -bottom-4 -left-4 -z-10 hidden h-full w-full rounded-2xl bg-[#003893]/10 lg:block" />
                    </Reveal>
                </div>
            </section>

            {/* Asli tathyanka */}
            <HomeStats />

            {/* मूल मान्यता */}
            <CoreValue />

            {/* जनप्रतिनिधि (admin le haleko bhae) */}
            <OfficialsSection />

            {/* परियोजना टोली */}
            <OurPeople />

            {/* सम्पर्क */}
            <GetTouch />
        </div>
    );
};

export default About;
