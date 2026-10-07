import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { FaEnvelope, FaLock, FaPhoneAlt, FaShieldAlt, FaUser } from "react-icons/fa";

const Field = ({ icon: Icon, label, hint, badge, children }) => (
    <div>
        <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">{label}</label>
            {badge && (
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <FaLock className="text-[9px]" />
                    {badge}
                </span>
            )}
        </div>
        <div className="relative">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            {children}
        </div>
        {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
);

const inputBase = "w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition";
const readOnlyClass = `${inputBase} cursor-not-allowed bg-slate-50 text-slate-600`;
const editableClass = `${inputBase} focus:border-[#003893] focus:ring-2 focus:ring-[#003893]/20`;

// Step 1: account bata aaune nagarik ko vivaran (phone matra badalna milcha, account ma nabhae)
const CitizenInfo = ({ data, updateField }) => {
    const { t } = useTranslation();
    const { userInfo } = useSelector((state) => state.auth);
    const phoneLocked = !!userInfo?.phone;
    const fromAccount = t("complaintForm.citizen.fromAccount");

    return (
        <div>
            <h2 className="text-xl font-bold text-slate-900">{t("complaintForm.citizen.title")}</h2>
            <p className="mt-1 text-sm text-slate-500">{t("complaintForm.citizen.text")}</p>

            <div className="mt-6 space-y-5">
                <Field icon={FaUser} label={t("complaintForm.citizen.name")} badge={fromAccount}>
                    <input value={data.fullName || userInfo?.name || ""} readOnly className={readOnlyClass} />
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                        icon={FaPhoneAlt}
                        label={t("complaintForm.citizen.phone")}
                        hint={t("complaintForm.citizen.phoneHint")}
                        badge={phoneLocked ? fromAccount : null}
                    >
                        <input
                            type="tel"
                            value={data.phone}
                            onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                            inputMode="numeric"
                            maxLength={10}
                            placeholder="98XXXXXXXX"
                            readOnly={phoneLocked}
                            className={phoneLocked ? readOnlyClass : editableClass}
                        />
                    </Field>

                    <Field icon={FaEnvelope} label={t("complaintForm.citizen.email")} badge={fromAccount}>
                        <input type="email" value={data.email || userInfo?.email || ""} readOnly className={readOnlyClass} />
                    </Field>
                </div>
            </div>

            <div className="mt-8 flex gap-3 rounded-xl border border-[#003893]/15 bg-[#003893]/5 p-4">
                <FaShieldAlt className="mt-0.5 shrink-0 text-[#003893]" />
                <div>
                    <p className="text-sm font-semibold text-[#003893]">{t("complaintForm.citizen.privacyTitle")}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{t("complaintForm.citizen.privacyText")}</p>
                </div>
            </div>
        </div>
    );
};

export default CitizenInfo;
