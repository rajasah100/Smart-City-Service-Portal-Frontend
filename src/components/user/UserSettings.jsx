import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { LuCamera, LuEye, LuEyeOff, LuLock, LuSave, LuShieldCheck, LuUser } from "react-icons/lu";

import { updateProfile, changePassword } from "../../redux/slices/authSlice";
import apiRequest from "../../utils/apiRequest";
import UserPageHeader from "./UserPageHeader";

const inputClass =
    "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#003893] focus:ring-2 focus:ring-[#003893]/20";

const PasswordInput = ({ label, value, onChange, show, autoComplete }) => (
    <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
        <input type={show ? "text" : "password"} value={value} onChange={onChange} autoComplete={autoComplete} className={inputClass} />
    </div>
);

const UserSettings = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { userInfo, loading } = useSelector((state) => state.auth);

    const [activeTab, setActiveTab] = useState("profile");

    const [profile, setProfile] = useState({
        name: userInfo?.name || "",
        phone: userInfo?.phone || "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(userInfo?.avatar || "");

    const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState(false);
    // Google account ma purano password hudaina (null = thaha chaina)
    const [hasPassword, setHasPassword] = useState(null);

    useEffect(() => {
        let ignore = false;

        apiRequest
            .get("/users/profile")
            .then(({ data }) => {
                if (!ignore) setHasPassword(data.hasPassword !== false);
            })
            .catch(() => {
                if (!ignore) setHasPassword(true);
            });

        return () => {
            ignore = true;
        };
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
            toast.error(t("userPages.settings.photoHint"));
            return;
        }

        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleProfileSave = async (e) => {
        e.preventDefault();

        if (!profile.name.trim()) {
            toast.error(t("userPages.settings.nameRequired"));
            return;
        }

        const formData = new FormData();
        formData.append("name", profile.name.trim());
        formData.append("phone", profile.phone.trim());
        if (imageFile) formData.append("avatar", imageFile);

        try {
            await dispatch(updateProfile(formData)).unwrap();
            setImageFile(null);
            toast.success(t("userPages.settings.saved"));
        } catch (error) {
            toast.error(error?.message || t("userPages.settings.saveFailed"));
        }
    };

    const handlePasswordSave = async (e) => {
        e.preventDefault();

        const { currentPassword, newPassword, confirmPassword } = passwordData;

        if ((hasPassword && !currentPassword) || !newPassword || !confirmPassword) {
            toast.error(t("userPages.settings.fillAll"));
            return;
        }
        if (newPassword.length < 6) {
            toast.error(t("userPages.settings.tooShort"));
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error(t("userPages.settings.mismatch"));
            return;
        }

        try {
            await dispatch(changePassword({ currentPassword, newPassword, confirmPassword })).unwrap();
            toast.success(t("userPages.settings.passwordChanged"));
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setHasPassword(true);
        } catch (error) {
            toast.error(error?.message || t("userPages.settings.passwordFailed"));
        }
    };

    const tabs = [
        { key: "profile", icon: LuUser },
        { key: "security", icon: LuLock },
    ];

    return (
        <div className="space-y-6">
            <UserPageHeader icon={LuShieldCheck} title={t("userPages.settings.title")} text={t("userPages.settings.text")} />

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* Tabs */}
                <div role="tablist" className="flex border-b border-slate-100">
                    {tabs.map(({ key, icon: Icon }) => (
                        <button
                            key={key}
                            role="tab"
                            aria-selected={activeTab === key}
                            onClick={() => setActiveTab(key)}
                            className={`flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-semibold transition ${
                                activeTab === key ? "border-[#003893] text-[#003893]" : "border-transparent text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            <Icon />
                            {t(`userPages.settings.${key}`)}
                        </button>
                    ))}
                </div>

                {/* Profile */}
                {activeTab === "profile" && (
                    <form key="profile" onSubmit={handleProfileSave} className="animate-fade-up p-6 sm:p-8">
                        <div className="flex flex-col items-center gap-5 sm:flex-row">
                            <div className="relative">
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt=""
                                        referrerPolicy="no-referrer"
                                        className="h-24 w-24 rounded-full border-4 border-[#003893]/10 object-cover"
                                    />
                                ) : (
                                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#003893] text-3xl font-bold text-white">
                                        {userInfo?.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}

                                <label className="absolute -bottom-1 -right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#d9a441] text-[#10151c] shadow transition hover:scale-110">
                                    <LuCamera />
                                    <span className="sr-only">{t("userPages.settings.changePhoto")}</span>
                                    <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                                </label>
                            </div>

                            <div className="text-center sm:text-left">
                                <p className="font-semibold text-slate-900">{t("userPages.settings.changePhoto")}</p>
                                <p className="text-sm text-slate-500">{t("userPages.settings.photoHint")}</p>
                            </div>
                        </div>

                        <div className="mt-8 grid gap-5 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">{t("userPages.settings.name")}</label>
                                <input
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    maxLength={80}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">{t("userPages.settings.email")}</label>
                                <input value={userInfo?.email || ""} readOnly className={`${inputClass} cursor-not-allowed bg-slate-50 text-slate-500`} />
                                <p className="mt-1 text-xs text-slate-400">{t("userPages.settings.emailHint")}</p>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">{t("userPages.settings.phone")}</label>
                                <input
                                    value={profile.phone}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    inputMode="tel"
                                    maxLength={15}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-8 flex items-center gap-2 rounded-xl bg-[#003893] px-6 py-3 font-semibold text-white transition hover:bg-[#002a6e] disabled:opacity-60"
                        >
                            <LuSave />
                            {loading ? t("userPages.settings.saving") : t("userPages.settings.save")}
                        </button>
                    </form>
                )}

                {/* Security */}
                {activeTab === "security" && (
                    <form key="security" onSubmit={handlePasswordSave} className="animate-fade-up max-w-xl p-6 sm:p-8">
                        <h2 className="text-lg font-bold text-slate-900">
                            {hasPassword === false ? t("userPages.settings.setPasswordTitle") : t("userPages.settings.passwordTitle")}
                        </h2>

                        {hasPassword === false && (
                            <p className="mt-2 rounded-lg bg-[#003893]/5 px-3 py-2 text-sm text-[#003893]">{t("userPages.settings.googleHint")}</p>
                        )}

                        <div className="mt-6 space-y-4">
                            {hasPassword !== false && (
                                <PasswordInput
                                    label={t("userPages.settings.current")}
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    show={showPassword}
                                    autoComplete="current-password"
                                />
                            )}
                            <PasswordInput
                                label={t("userPages.settings.newPassword")}
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                show={showPassword}
                                autoComplete="new-password"
                            />
                            <PasswordInput
                                label={t("userPages.settings.confirm")}
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                show={showPassword}
                                autoComplete="new-password"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((value) => !value)}
                                className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#003893]"
                            >
                                {showPassword ? <LuEyeOff /> : <LuEye />}
                                {showPassword ? t("userPages.settings.hide") : t("userPages.settings.show")}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 flex items-center gap-2 rounded-xl bg-[#003893] px-6 py-3 font-semibold text-white transition hover:bg-[#002a6e] disabled:opacity-60"
                        >
                            <LuLock />
                            {loading
                                ? t("userPages.settings.saving")
                                : hasPassword === false
                                  ? t("userPages.settings.setPassword")
                                  : t("userPages.settings.changePassword")}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UserSettings;
