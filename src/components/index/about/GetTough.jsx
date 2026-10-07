import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FaClock, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaPhoneAlt } from "react-icons/fa";
import apiRequest from "../../../utils/apiRequest";
import useSiteSettings from "../../../hooks/useSiteSettings";
import Reveal from "../../common/Reveal";

const EMPTY = { name: "", email: "", phone: "", subject: "", message: "" };

// Sampark jankari (Settings bata) + sachchi kaam garne message form
const GetTouch = () => {
    const { t, i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage === "en";
    const settings = useSiteSettings();

    const [form, setForm] = useState(EMPTY);
    const [sending, setSending] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
            toast.error(t("aboutPage.form.required"));
            return;
        }

        setSending(true);

        try {
            await apiRequest.post("/contact", form);
            toast.success(t("aboutPage.form.success"));
            setForm(EMPTY);
        } catch (error) {
            toast.error(error.response?.data?.message || t("aboutPage.form.failed"));
        } finally {
            setSending(false);
        }
    };

    const na = t("aboutPage.notAvailable");

    const info = [
        { icon: FaMapMarkerAlt, label: t("aboutPage.address"), value: isEn ? settings.addressEn : settings.addressNe },
        { icon: FaPhoneAlt, label: t("aboutPage.phone"), value: settings.phone, href: settings.phone && `tel:${settings.phone}` },
        { icon: FaEnvelope, label: t("aboutPage.email"), value: settings.email, href: settings.email && `mailto:${settings.email}` },
        { icon: FaClock, label: t("aboutPage.hours"), value: isEn ? settings.officeHoursEn : settings.officeHoursNe },
    ];

    const inputClass =
        "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#003893] focus:ring-2 focus:ring-[#003893]/20";

    return (
        <section id="contact" className="bg-slate-50 py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="mx-auto mb-12 max-w-2xl text-center">
                    <span className="text-sm font-semibold uppercase tracking-widest text-[#d9a441]">
                        {t("aboutPage.contactLabel")}
                    </span>
                    <h2 className="mt-2 text-3xl font-bold text-slate-900">{t("aboutPage.contactTitle")}</h2>
                    <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-[#d9a441]" />
                    <p className="mt-4 text-slate-500">{t("aboutPage.contactText")}</p>
                </Reveal>

                <div className="grid gap-8 lg:grid-cols-5">
                    {/* Contact info */}
                    <Reveal className="space-y-4 lg:col-span-2">
                        {info.map(({ icon: Icon, label, value, href }) => (
                            <div key={label} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#003893]/10 text-lg text-[#003893]">
                                    <Icon />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-900">{label}</p>
                                    {value && href ? (
                                        <a href={href} className="mt-0.5 block break-all text-slate-600 hover:text-[#003893]">{value}</a>
                                    ) : (
                                        <p className="mt-0.5 text-slate-600">{value || na}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </Reveal>

                    {/* Form */}
                    <Reveal delay={120} className="lg:col-span-3">
                        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 border-t-4 border-t-[#003893] bg-white p-6 shadow-sm sm:p-8">
                            <h3 className="text-xl font-bold text-slate-900">{t("aboutPage.form.title")}</h3>

                            <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                                {t("aboutPage.form.complaintHint")}{" "}
                                <Link to="/complaint" className="font-semibold underline">{t("aboutPage.form.complaintLink")}</Link>
                            </p>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">{t("aboutPage.form.name")} *</label>
                                    <input name="name" value={form.name} onChange={handleChange} required maxLength={100} className={inputClass} />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">{t("aboutPage.form.email")} *</label>
                                    <input type="email" name="email" value={form.email} onChange={handleChange} required maxLength={150} className={inputClass} />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">{t("aboutPage.form.phone")}</label>
                                    <input name="phone" value={form.phone} onChange={handleChange} maxLength={20} className={inputClass} />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">{t("aboutPage.form.subject")} *</label>
                                    <input name="subject" value={form.subject} onChange={handleChange} required maxLength={150} className={inputClass} />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">{t("aboutPage.form.message")} *</label>
                                    <textarea name="message" rows={5} value={form.message} onChange={handleChange} required maxLength={2000} className={`${inputClass} resize-none`} />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#003893] py-3 font-semibold text-white transition hover:bg-[#002a6e] disabled:opacity-60 sm:w-auto sm:px-8"
                            >
                                <FaPaperPlane className="text-sm" />
                                {sending ? t("aboutPage.form.sending") : t("aboutPage.form.send")}
                            </button>
                        </form>
                    </Reveal>
                </div>
            </div>
        </section>
    );
};

export default GetTouch;
