import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FaCheck, FaExclamationTriangle, FaFileAlt, FaRegClock, FaRegSmile } from "react-icons/fa";
import ImageUploader from "./ImageUploader";
import { departmentKind } from "./departmentKind";

const MAX_DESCRIPTION = 500;

// low/medium/high: backend ko priority, card ma sarkari bhasa
const URGENCY = [
    { id: "low", icon: FaRegSmile, active: "border-green-600 bg-green-50", iconClass: "bg-green-600" },
    { id: "medium", icon: FaRegClock, active: "border-amber-500 bg-amber-50", iconClass: "bg-amber-500" },
    { id: "high", icon: FaExclamationTriangle, active: "border-[#dc143c] bg-red-50", iconClass: "bg-[#dc143c]" },
];

const inputClass = "w-full rounded-xl border border-slate-200 text-sm outline-none transition focus:border-[#003893] focus:ring-2 focus:ring-[#003893]/20";

// Step 4: gunaso ko vishaya, vivaran, jaruri ra photo
const ComplaintDetails = ({ data, updateField }) => {
    const { t } = useTranslation();
    const { departments = [] } = useSelector((state) => state.department);

    const department = departments.find((dept) => dept._id === data.department);
    const issues = t(`complaintForm.details.issues.${departmentKind(department?.name)}`, { returnObjects: true });
    const descriptionLength = data.description.trim().length;

    return (
        <div>
            <h2 className="text-xl font-bold text-slate-900">{t("complaintForm.details.title")}</h2>
            <p className="mt-1 text-sm text-slate-500">{t("complaintForm.details.text")}</p>

            {/* Samanya samasya: thichda title bharincha */}
            {Array.isArray(issues) && (
                <div className="mt-6">
                    <p className="text-sm font-semibold text-slate-700">{t("complaintForm.details.commonIssues")}</p>
                    <p className="text-xs text-slate-400">{t("complaintForm.details.commonHint")}</p>

                    <div className="mt-3 flex flex-wrap gap-2">
                        {issues.map((issue, index) => {
                            const active = data.title === issue;

                            return (
                                <button
                                    key={issue}
                                    type="button"
                                    aria-pressed={active}
                                    onClick={() => updateField("title", issue)}
                                    style={{ "--delay": `${index * 40}ms` }}
                                    className={`animate-fade-up flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition ${
                                        active
                                            ? "border-[#003893] bg-[#003893] text-white"
                                            : "border-slate-200 bg-white text-slate-700 hover:border-[#003893]/50 hover:text-[#003893]"
                                    }`}
                                >
                                    {active && <FaCheck className="text-[10px]" />}
                                    {issue}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Vishaya */}
            <div className="mt-6">
                <label htmlFor="complaint-title" className="mb-1.5 block text-sm font-semibold text-slate-700">
                    {t("complaintForm.details.subjectLabel")} <span className="text-[#dc143c]">*</span>
                </label>
                <div className="relative">
                    <FaFileAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        id="complaint-title"
                        type="text"
                        value={data.title}
                        maxLength={120}
                        onChange={(e) => updateField("title", e.target.value)}
                        placeholder={t("complaintForm.details.subjectPlaceholder")}
                        className={`${inputClass} py-3 pl-11 pr-4`}
                    />
                </div>
            </div>

            {/* Vivaran */}
            <div className="mt-5">
                <label htmlFor="complaint-description" className="mb-1.5 block text-sm font-semibold text-slate-700">
                    {t("complaintForm.details.descriptionLabel")} <span className="text-[#dc143c]">*</span>
                </label>
                <textarea
                    id="complaint-description"
                    rows={5}
                    maxLength={MAX_DESCRIPTION}
                    value={data.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder={t("complaintForm.details.descriptionPlaceholder")}
                    className={`${inputClass} resize-none p-4 leading-6`}
                />
                <div className="mt-1.5 flex items-center justify-between text-xs">
                    <span className={descriptionLength >= 20 ? "flex items-center gap-1 text-green-700" : "text-slate-400"}>
                        {descriptionLength >= 20 && <FaCheck className="text-[10px]" />}
                        {t("complaintForm.details.minChars")}
                    </span>
                    <span className={data.description.length > MAX_DESCRIPTION - 50 ? "text-amber-600" : "text-slate-400"}>
                        {data.description.length}/{MAX_DESCRIPTION}
                    </span>
                </div>
            </div>

            {/* Jaruri */}
            <div className="mt-6">
                <p className="mb-3 text-sm font-semibold text-slate-700">{t("complaintForm.details.urgencyLabel")}</p>

                <div role="radiogroup" className="grid gap-3 sm:grid-cols-3">
                    {URGENCY.map(({ id, icon: Icon, active, iconClass }) => {
                        const isSelected = data.priority === id;

                        return (
                            <button
                                key={id}
                                type="button"
                                role="radio"
                                aria-checked={isSelected}
                                onClick={() => updateField("priority", id)}
                                className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition ${
                                    isSelected ? `${active} shadow-sm` : "border-slate-200 bg-white hover:border-slate-300"
                                }`}
                            >
                                <span
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white transition ${
                                        isSelected ? iconClass : "bg-slate-300"
                                    }`}
                                >
                                    <Icon />
                                </span>
                                <span>
                                    <span className="block text-sm font-semibold text-slate-900">
                                        {t(`complaintForm.details.urgency.${id}.title`)}
                                    </span>
                                    <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                                        {t(`complaintForm.details.urgency.${id}.text`)}
                                    </span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <ImageUploader images={data.images} updateField={updateField} />
        </div>
    );
};

export default ComplaintDetails;
