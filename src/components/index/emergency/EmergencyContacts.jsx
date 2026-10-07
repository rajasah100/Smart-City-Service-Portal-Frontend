import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import {
    FaCar,
    FaChild,
    FaFemale,
    FaGripfire,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaPlaneArrival,
} from "react-icons/fa";
import { MdLocalHospital, MdLocalPolice } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getDepartments } from "../../../redux/slices/departmentSlice";
import SectionHeading from "./SectionHeading";
import { departmentIcon } from "../../complaint/departmentKind";
import { serviceAreaText } from "../../department/deptUtils";

// Nepal ko rashtriya hotline (toll-free)
const hotlines = [
    { key: "police", number: "100", icon: MdLocalPolice },
    { key: "fire", number: "101", icon: FaGripfire },
    { key: "ambulance", number: "102", icon: MdLocalHospital },
    { key: "traffic", number: "103", icon: FaCar },
    { key: "child", number: "1098", icon: FaChild },
    { key: "tourist", number: "1144", icon: FaPlaneArrival },
    { key: "women", number: "1145", icon: FaFemale },
];

const EmergencyContacts = () => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage === "en";

    const { departments: allDepartments = [], loading } = useSelector(
        (state) => state.department
    );
    // Banda gareko department nadekhaune
    const departments = allDepartments.filter((department) => department.isActive !== false);

    useEffect(() => {
        dispatch(getDepartments());
    }, [dispatch]);

    return (
        <section id="emergency-contacts" className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">

                <SectionHeading
                    label={t("emergency.contacts.label")}
                    title={t("emergency.contacts.title")}
                    description={t("emergency.contacts.description")}
                />

                {/* National hotlines */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {hotlines.map(({ key, number, icon: Icon }) => (
                        <a
                            key={number}
                            href={`tel:${number}`}
                            className="group flex items-center gap-4 rounded-2xl border border-slate-200 border-l-4 border-l-[#dc143c] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#dc143c]/10 text-2xl text-[#dc143c] transition group-hover:bg-[#dc143c] group-hover:text-white">
                                <Icon />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm text-slate-500">
                                    {t(`emergency.contacts.hotlines.${key}`)}
                                </p>

                                <p className="text-3xl font-bold tracking-wide text-[#003893]">
                                    {number}
                                </p>
                            </div>

                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dc143c] text-white transition group-hover:scale-110 group-hover:bg-[#b51031]">
                                <FaPhoneAlt className="text-sm" />
                            </span>
                        </a>
                    ))}
                </div>

                {/* Municipality departments */}
                <div className="mt-16">
                    <h3 className="text-xl font-bold text-slate-900">
                        {t("emergency.contacts.departmentsTitle")}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        {t("emergency.contacts.departmentsText")}
                    </p>

                    {loading ? (
                        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="h-24 animate-pulse rounded-2xl bg-slate-100"
                                />
                            ))}
                        </div>
                    ) : departments.length === 0 ? (
                        <p className="mt-6 rounded-xl border border-dashed border-slate-300 py-8 text-center text-slate-500">
                            {t("emergency.contacts.noDepartments")}
                        </p>
                    ) : (
                        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {departments.map((department) => {
                                const Icon = departmentIcon(department.name);

                                return (
                                    <div
                                        key={department._id}
                                        className="flex min-w-0 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-lg"
                                    >
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#003893]/10 text-xl text-[#003893]">
                                            <Icon />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="line-clamp-2 font-semibold leading-snug text-slate-800">
                                                {department.name}
                                            </p>

                                            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500">
                                                <FaMapMarkerAlt className="shrink-0 text-[#dc143c]" />
                                                <span className="truncate">{serviceAreaText(department.serviceArea, t, isEn)}</span>
                                            </p>

                                            <p className="text-sm text-slate-500">
                                                {department.phone || t("emergency.contacts.phoneNotAvailable")}
                                            </p>
                                        </div>

                                        {department.phone && (
                                            <a
                                                href={`tel:${department.phone}`}
                                                className="shrink-0 whitespace-nowrap rounded-lg border border-[#003893] px-4 py-2 text-sm font-medium text-[#003893] transition hover:bg-[#003893] hover:text-white"
                                            >
                                                {t("emergency.contacts.call")}
                                            </a>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
};

export default EmergencyContacts;
