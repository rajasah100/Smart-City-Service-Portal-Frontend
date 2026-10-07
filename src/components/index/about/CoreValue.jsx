import { useTranslation } from "react-i18next";
import { FaBalanceScale, FaEye, FaUniversalAccess, FaUsers } from "react-icons/fa";
import Reveal from "../../common/Reveal";

const VALUES = [
    { key: "transparency", icon: FaEye },
    { key: "citizen", icon: FaUsers },
    { key: "accountability", icon: FaBalanceScale },
    { key: "access", icon: FaUniversalAccess },
];

const CoreValue = () => {
    const { t } = useTranslation();

    return (
        <section className="bg-slate-50 py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="mb-12 text-center">
                    <span className="text-sm font-semibold uppercase tracking-widest text-[#d9a441]">
                        {t("aboutPage.valuesLabel")}
                    </span>
                    <h2 className="mt-2 text-3xl font-bold text-slate-900">{t("aboutPage.valuesTitle")}</h2>
                    <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-[#d9a441]" />
                </Reveal>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {VALUES.map(({ key, icon: Icon }, index) => (
                        <Reveal key={key} delay={index * 80}>
                            <div className="group h-full rounded-2xl border border-slate-200 border-t-4 border-t-[#003893] bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-t-[#dc143c] hover:shadow-lg">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#003893]/10 text-2xl text-[#003893] transition group-hover:bg-[#dc143c] group-hover:text-white">
                                    <Icon />
                                </div>
                                <h3 className="mt-5 text-lg font-bold text-slate-900">{t(`aboutPage.values.${key}.title`)}</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-500">{t(`aboutPage.values.${key}.text`)}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CoreValue;
