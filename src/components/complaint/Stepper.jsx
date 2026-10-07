import { useTranslation } from "react-i18next";
import { FaCheck } from "react-icons/fa";

// Form ko 5 step: desktop ma pura, mobile ma "चरण २ / ५" + progress bar
const Stepper = ({ steps, currentStep }) => {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage === "en" ? "en-US" : "ne-NP";
    const num = (n) => n.toLocaleString(locale);
    const percent = (currentStep / (steps.length - 1)) * 100;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            {/* Mobile */}
            <div className="sm:hidden">
                <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-[#003893]">{steps[currentStep]}</span>
                    <span className="text-slate-500">
                        {t("complaintForm.stepOf", { current: num(currentStep + 1), total: num(steps.length) })}
                    </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-[#003893] transition-all duration-500" style={{ width: `${percent}%` }} />
                </div>
            </div>

            {/* Desktop */}
            <ol className="hidden items-start sm:flex">
                {steps.map((label, index) => {
                    const completed = index < currentStep;
                    const active = index === currentStep;

                    return (
                        <li key={label} className="flex flex-1 items-start last:flex-none">
                            <div className="flex w-20 flex-col items-center text-center">
                                <span
                                    className={`flex h-11 w-11 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300 ${
                                        completed
                                            ? "border-green-600 bg-green-600 text-white"
                                            : active
                                              ? "border-[#003893] bg-[#003893] text-white ring-4 ring-[#003893]/15"
                                              : "border-slate-200 bg-white text-slate-400"
                                    }`}
                                >
                                    {completed ? <FaCheck /> : num(index + 1)}
                                </span>

                                <span
                                    className={`mt-2 text-xs font-semibold ${
                                        completed ? "text-green-700" : active ? "text-[#003893]" : "text-slate-400"
                                    }`}
                                >
                                    {label}
                                </span>
                            </div>

                            {index < steps.length - 1 && (
                                <div className="mx-1 mt-5 h-1 flex-1 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className={`h-full rounded-full bg-green-600 transition-all duration-500 ${completed ? "w-full" : "w-0"}`}
                                    />
                                </div>
                            )}
                        </li>
                    );
                })}
            </ol>
        </div>
    );
};

export default Stepper;
