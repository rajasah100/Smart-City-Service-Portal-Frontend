import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaArrowRight } from "react-icons/fa";
import useSiteSettings from "../../../hooks/useSiteSettings";
import Reveal from "../../common/Reveal";
import LatestEvent from "../LatestEvent";
import introImage from "../../../assets/cityImg.jpg";

// "नगरपालिकाको परिचय" (admin le settings bata badalna milcha) + karyakram
const MunicipalityIntro = () => {
    const { t, i18n } = useTranslation();
    const settings = useSiteSettings();
    const isEn = i18n.resolvedLanguage === "en";

    return (
        <section className="bg-slate-50 py-20">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
                <Reveal className="lg:col-span-2">
                    <span className="text-sm font-semibold uppercase tracking-widest text-[#d9a441]">
                        {t("homeGov.intro.label")}
                    </span>

                    <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                        {isEn ? settings.nameEn : settings.nameNe}
                    </h2>

                    <div className="mt-6 grid gap-6 sm:grid-cols-5">
                        <img
                            src={introImage}
                            alt=""
                            className="h-56 w-full rounded-xl object-cover shadow-md sm:col-span-2 sm:h-full"
                        />

                        <div className="sm:col-span-3">
                            <p className="whitespace-pre-line leading-8 text-slate-600">
                                {isEn ? settings.introEn : settings.introNe}
                            </p>

                            <Link
                                to="/about"
                                className="mt-6 inline-flex items-center gap-2 rounded-md border border-[#003893] px-5 py-2.5 text-sm font-semibold text-[#003893] transition hover:bg-[#003893] hover:text-white"
                            >
                                {t("homeGov.intro.readMore")}
                                <FaArrowRight className="text-xs" />
                            </Link>
                        </div>
                    </div>
                </Reveal>

                <Reveal delay={150}>
                    <LatestEvent />
                </Reveal>
            </div>
        </section>
    );
};

export default MunicipalityIntro;
