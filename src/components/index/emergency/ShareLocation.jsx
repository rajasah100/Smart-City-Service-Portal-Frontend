import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FaExclamationCircle } from "react-icons/fa";
import SosPanel from "./SosPanel";

// SOS live tracking + gair-jaruri samasya report garne card
const ShareLocation = () => {
    const { t } = useTranslation();

    return (
        <section id="sos" className="bg-white pt-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid gap-6 lg:grid-cols-3">

                    <SosPanel />

                    {/* Report non-urgent issue */}
                    <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-slate-50 p-8">
                        <div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#003893]/10 text-xl text-[#003893]">
                                <FaExclamationCircle />
                            </div>

                            <h3 className="mt-4 text-xl font-bold text-slate-900">
                                {t("emergency.report.title")}
                            </h3>

                            <p className="mt-2 text-slate-500">
                                {t("emergency.report.text")}
                            </p>
                        </div>

                        <Link
                            to="/complaint"
                            className="mt-6 rounded-xl bg-[#003893] py-3 text-center font-semibold text-white transition hover:bg-[#002a6e]"
                        >
                            {t("emergency.report.button")}
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ShareLocation;
