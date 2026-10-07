import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FaCheck, FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa";
import { getDepartments } from "../../redux/slices/departmentSlice";
import { departmentIcon } from "./departmentKind";
import { coversLocation } from "../../utils/serviceArea";
import { localizePlace } from "../../data/nepalLocation";

// Step 3: chhaneko thau herne vibhag matra dekhaune
const CategoryStep = ({ data, updateField }) => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const place = localizePlace(data, i18n.resolvedLanguage === "en");
    const { departments = [], loading } = useSelector((state) => state.department);

    useEffect(() => {
        dispatch(getDepartments());
    }, [dispatch]);

    const active = departments.filter((dept) => dept.isActive !== false && coversLocation(dept.serviceArea, data));
    const selected = active.find((dept) => dept._id === data.department);

    return (
        <div>
            <h2 className="text-xl font-bold text-slate-900">{t("complaintForm.department.title")}</h2>
            <p className="mt-1 text-sm text-slate-500">{t("complaintForm.department.text")}</p>

            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#003893]/10 px-3.5 py-1.5 text-sm font-medium text-[#003893]">
                <FaMapMarkerAlt />
                {t("complaintForm.department.areaLabel")}: {[place.municipality, place.district].filter(Boolean).join(", ")}
            </p>

            {loading && active.length === 0 ? (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((item) => <div key={item} className="h-36 animate-pulse rounded-2xl bg-slate-100" />)}
                </div>
            ) : active.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-amber-300 bg-amber-50 px-6 py-10 text-center">
                    <p className="font-semibold text-amber-900">{t("complaintForm.department.noneInArea")}</p>
                    <p className="mt-1 text-sm text-amber-800">{t("complaintForm.department.noneInAreaHint")}</p>
                </div>
            ) : (
                <div role="radiogroup" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {active.map((department, index) => {
                        const isSelected = data.department === department._id;
                        const Icon = departmentIcon(department.name);

                        return (
                            <button
                                key={department._id}
                                type="button"
                                role="radio"
                                aria-checked={isSelected}
                                onClick={() => updateField("department", department._id)}
                                style={{ "--delay": `${index * 50}ms` }}
                                className={`animate-fade-up group relative rounded-2xl border-2 p-5 text-left transition duration-200 hover:-translate-y-0.5 ${
                                    isSelected
                                        ? "border-[#003893] bg-[#003893]/5 shadow-md"
                                        : "border-slate-200 bg-white hover:border-[#003893]/40 hover:shadow-sm"
                                }`}
                            >
                                {isSelected && (
                                    <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#003893] text-xs text-white">
                                        <FaCheck />
                                    </span>
                                )}

                                <span
                                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl transition ${
                                        isSelected ? "bg-[#003893] text-white" : "bg-[#003893]/10 text-[#003893] group-hover:scale-110"
                                    }`}
                                >
                                    <Icon />
                                </span>

                                <h3 className="mt-4 font-semibold text-slate-900">{department.name}</h3>

                                {(department.description || department.phone) && (
                                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                                        {department.description || department.phone}
                                    </p>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            {selected && (
                <p className="animate-fade-up mt-6 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                    <FaCheckCircle className="shrink-0 text-green-600" />
                    {t("complaintForm.department.selectedText", { name: selected.name })}
                </p>
            )}
        </div>
    );
};

export default CategoryStep;
