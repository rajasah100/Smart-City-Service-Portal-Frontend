import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { updateSettings } from "../../redux/slices/settingSlice";
import useSiteSettings from "../../hooks/useSiteSettings";
import defaultLogo from "../../assets/logo-small.png";

const FIELDS = [
    { name: "nameNe", label: "Portal / organization name (Nepali)", placeholder: "स्मार्ट सिटी सेवा पोर्टल" },
    { name: "nameEn", label: "Portal / organization name (English)", placeholder: "Smart City Service Portal" },
    { name: "officeNe", label: "Office name (Nepali)", placeholder: "नगर कार्यपालिकाको कार्यालय" },
    { name: "officeEn", label: "Office name (English)", placeholder: "Office of the Municipal Executive" },
    { name: "addressNe", label: "Address (Nepali)", placeholder: "डेमो जिल्ला, मधेश प्रदेश, नेपाल" },
    { name: "addressEn", label: "Address (English)", placeholder: "Demo District, Madhesh Province, Nepal" },
    { name: "phone", label: "Office phone", placeholder: "041-XXXXXX" },
    { name: "email", label: "Office email", placeholder: "info@example.gov.np" },
    { name: "hotline", label: "Emergency hotline", placeholder: "100" },
    { name: "officeHoursNe", label: "Office hours (Nepali)", placeholder: "आइतबार - शुक्रबार, बिहान ९:०० - बेलुका ५:००" },
    { name: "officeHoursEn", label: "Office hours (English)", placeholder: "Sunday - Friday, 9:00 AM - 5:00 PM" },
    { name: "introNe", label: "Introduction (Nepali) - Home page", placeholder: "नगरपालिकाको छोटो परिचय", multiline: true },
    { name: "introEn", label: "Introduction (English) - Home page", placeholder: "Short introduction of the municipality", multiline: true },
    { name: "facebook", label: "Facebook page link", placeholder: "https://facebook.com/..." },
    { name: "youtube", label: "YouTube channel link", placeholder: "https://youtube.com/..." },
    { name: "instagram", label: "Instagram link", placeholder: "https://instagram.com/..." },
    { name: "tiktok", label: "TikTok link", placeholder: "https://tiktok.com/@..." },
];

const SettingsForm = ({ settings }) => {
    const dispatch = useDispatch();
    const { saving } = useSelector((state) => state.setting);

    const [formData, setFormData] = useState(() =>
        Object.fromEntries(FIELDS.map(({ name }) => [name, settings[name] || ""]))
    );
    const [logoFile, setLogoFile] = useState(null);
    const [preview, setPreview] = useState(settings.logo?.url || "");
    const [removeLogo, setRemoveLogo] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogo = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please choose an image file.");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Logo must be smaller than 2MB.");
            return;
        }

        setLogoFile(file);
        setRemoveLogo(false);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nameNe.trim() || !formData.nameEn.trim()) {
            toast.error("Municipality name is required.");
            return;
        }

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => data.append(key, value));

        if (logoFile) data.append("logo", logoFile);
        if (removeLogo) data.append("removeLogo", "true");

        try {
            await dispatch(updateSettings(data)).unwrap();
            setLogoFile(null);
            toast.success("Settings saved. The website header and footer are updated.");
        } catch (error) {
            toast.error(error?.message || "Failed to save settings.");
        }
    };

    const inputClass =
        "w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500";

    return (
        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">

            {/* Logo + preview */}
            <div className="space-y-4 rounded-xl border bg-white p-6">
                <h2 className="font-semibold">Logo</h2>

                <div className="flex justify-center rounded-lg bg-slate-50 p-6">
                    <img
                        src={(!removeLogo && preview) || defaultLogo}
                        alt="Logo preview"
                        className="h-28 w-28 object-contain"
                    />
                </div>

                <input type="file" accept="image/*" onChange={handleLogo} className="w-full text-sm" />

                {(preview || settings.logo?.url) && !removeLogo && (
                    <button
                        type="button"
                        onClick={() => {
                            setRemoveLogo(true);
                            setLogoFile(null);
                            setPreview("");
                        }}
                        className="text-sm text-red-600 hover:underline"
                    >
                        Remove logo (use default)
                    </button>
                )}

                <p className="text-xs text-gray-500">
                    Use your own logo. Do not use the Government of Nepal emblem unless this portal is
                    officially run by a government office.
                </p>
            </div>

            {/* Fields */}
            <div className="space-y-4 rounded-xl border bg-white p-6 lg:col-span-2">
                <h2 className="font-semibold">Municipality Profile</h2>

                <div className="grid gap-4 sm:grid-cols-2">
                    {FIELDS.map((field) => (
                        <div key={field.name} className={field.multiline ? "sm:col-span-2" : ""}>
                            <label className="mb-1 block text-sm font-medium">{field.label}</label>
                            {field.multiline ? (
                                <textarea
                                    name={field.name}
                                    rows={4}
                                    maxLength={1500}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    className={inputClass}
                                />
                            ) : (
                                <input
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    className={inputClass}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                        {saving ? "Saving..." : "Save Settings"}
                    </button>
                </div>
            </div>
        </form>
    );
};

const AdminSettingsPage = () => {
    const settings = useSiteSettings();
    const { loaded } = useSelector((state) => state.setting);

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-xl font-bold sm:text-2xl">Municipality Settings</h1>

                <p className="text-sm text-gray-500 sm:text-base">
                    Name, logo and contact details shown in the website header and footer.
                </p>
            </div>

            {loaded ? (
                <SettingsForm key={settings.updatedAt || "default"} settings={settings} />
            ) : (
                <p className="text-gray-500">Loading...</p>
            )}
        </div>
    );
};

export default AdminSettingsPage;
