import { FaBell } from "react-icons/fa"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import Reveal from "../common/Reveal"


const BannerCTA = () => {
    const { t } = useTranslation();

    return (
        <section className="py-16 bg-[#1e2a38]">
            <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                            {t("homeGov.cta.title")}{" "}
                            <span className="text-[#d9a441]">{t("homeGov.cta.highlight")}</span>
                        </h2>
                        <p className="text-slate-400 text-[17px] max-w-xl">
                            {t("homeGov.cta.text")}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/complaint"
                            className="rounded-lg bg-[#d9a441] px-8 py-3 font-bold text-[#10151c] transition hover:bg-[#c8932f]"
                        >
                            {t("homeGov.cta.complaint")}
                        </Link>
                        <Link
                            to="/emergency"
                            className="flex items-center gap-2 rounded-lg bg-red-600 px-8 py-3 font-semibold text-white transition hover:bg-red-700"
                        >
                            <FaBell className="w-4 h-4" /> {t("homeGov.cta.emergency")}
                        </Link>
                    </div>
                </div>
            </Reveal>
        </section>
    )
}

export default BannerCTA
