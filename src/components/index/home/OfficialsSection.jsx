import { useTranslation } from "react-i18next";
import { FaEnvelope, FaPhoneAlt, FaUserTie } from "react-icons/fa";
import useHomeContent from "../../../hooks/useHomeContent";
import Reveal from "../../common/Reveal";

// Janapratinidhi tatha karmachari. Admin le data nahalunjel section nai dekhaudaina
const OfficialsSection = () => {
    const { t, i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage === "en";
    const officials = useHomeContent("/officials");

    if (!officials || officials.length === 0) return null;

    return (
        <section className="bg-white py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="mb-10 text-center">
                    <span className="text-sm font-semibold uppercase tracking-widest text-[#d9a441]">
                        {t("officials.label")}
                    </span>

                    <h2 className="mt-2 text-3xl font-bold text-slate-900">{t("officials.title")}</h2>

                    <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-[#d9a441]" />
                </Reveal>

                <div className="flex flex-wrap justify-center gap-6">
                    {officials.map((person, index) => {
                        const name = isEn ? person.nameEn || person.nameNe : person.nameNe;
                        const designation = isEn
                            ? person.designationEn || person.designationNe
                            : person.designationNe;

                        return (
                            <Reveal
                                key={person._id}
                                delay={index * 80}
                                className="w-full max-w-60 sm:w-60"
                            >
                                <div className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                                    <div className="border-b-4 border-[#dc143c] bg-linear-to-b from-[#003893]/10 to-white px-6 pt-6">
                                        {person.photo?.url ? (
                                            <img
                                                src={person.photo.url}
                                                alt={name}
                                                className="mx-auto h-36 w-36 rounded-full border-4 border-white object-cover shadow-md"
                                            />
                                        ) : (
                                            <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full border-4 border-white bg-slate-100 text-5xl text-slate-300 shadow-md">
                                                <FaUserTie />
                                            </div>
                                        )}

                                        <div className="h-4" />
                                    </div>

                                    <div className="p-5">
                                        <h3 className="text-lg font-bold text-slate-900">{name}</h3>
                                        <p className="mt-1 text-sm font-medium text-[#003893]">{designation}</p>

                                        {(person.phone || person.email) && (
                                            <div className="mt-4 space-y-1.5 text-sm text-slate-500">
                                                {person.phone && (
                                                    <a href={`tel:${person.phone}`} className="flex items-center justify-center gap-2 hover:text-[#003893]">
                                                        <FaPhoneAlt className="text-xs" />
                                                        {person.phone}
                                                    </a>
                                                )}
                                                {person.email && (
                                                    <a href={`mailto:${person.email}`} className="flex items-center justify-center gap-2 break-all hover:text-[#003893]">
                                                        <FaEnvelope className="shrink-0 text-xs" />
                                                        {person.email}
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default OfficialsSection;
