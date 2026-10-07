import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    FaBullhorn,
    FaCalendarAlt,
    FaClipboardList,
    FaExclamationCircle,
    FaUniversity,
} from "react-icons/fa";
import { MdSos } from "react-icons/md";
import Reveal from "../../common/Reveal";

const SERVICES = [
    { key: "complaint", to: "/complaint", icon: FaExclamationCircle, color: "text-[#dc143c] bg-[#dc143c]/10" },
    { key: "track", to: "/user/complaints", icon: FaClipboardList, color: "text-[#003893] bg-[#003893]/10" },
    { key: "notices", to: "/notices", icon: FaBullhorn, color: "text-[#2c5d79] bg-[#2c5d79]/10" },
    { key: "events", to: "/events", icon: FaCalendarAlt, color: "text-[#b7791f] bg-[#d9a441]/15" },
    { key: "sos", to: "/emergency", icon: MdSos, color: "text-red-600 bg-red-50" },
    { key: "government", to: "/government", icon: FaUniversity, color: "text-[#003893] bg-[#003893]/10" },
];

// Sarkari site jastai sana service tile (chhito click garna milne)
const CitizenServices = () => {
    const { t } = useTranslation();

    return (
        <section className="bg-white py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="mb-10 text-center">
                    <span className="text-sm font-semibold uppercase tracking-widest text-[#d9a441]">
                        {t("homeGov.services.label")}
                    </span>

                    <h2 className="mt-2 text-3xl font-bold text-slate-900">
                        {t("homeGov.services.title")}
                    </h2>

                    <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-[#d9a441]" />

                    <p className="mt-4 text-slate-500">{t("homeGov.services.description")}</p>
                </Reveal>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    {SERVICES.map(({ key, to, icon: Icon, color }, index) => (
                        <Reveal key={key} delay={index * 60}>
                            <Link
                                to={to}
                                className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#d9a441] hover:shadow-lg"
                            >
                                <span className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition group-hover:scale-110 ${color}`}>
                                    <Icon />
                                </span>

                                <span className="text-sm font-semibold text-slate-800">
                                    {t(`homeGov.services.items.${key}`)}
                                </span>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CitizenServices;
