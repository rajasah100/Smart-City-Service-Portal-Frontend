import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { localizePlace } from "../../data/nepalLocation";
import { FaBuilding, FaEdit, FaFileAlt, FaImages, FaMapMarkerAlt, FaUser } from "react-icons/fa";

const URGENCY_CLASS = {
    low: "bg-green-100 text-green-800",
    medium: "bg-amber-100 text-amber-800",
    high: "bg-red-100 text-[#dc143c]",
};

const Section = ({ icon: Icon, title, step, goToStep, editLabel, delay, children }) => (
    <section style={{ "--delay": `${delay}ms` }} className="animate-fade-up overflow-hidden rounded-2xl border border-slate-200">
        <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <Icon className="text-[#003893]" />
                {title}
            </h3>
            <button
                type="button"
                onClick={() => goToStep(step)}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-[#003893] transition hover:bg-[#003893]/10"
            >
                <FaEdit />
                {editLabel}
            </button>
        </header>
        <div className="px-5 py-4">{children}</div>
    </section>
);

const Row = ({ label, children }) => (
    <div className="grid gap-1 py-2 text-sm sm:grid-cols-3 sm:gap-4">
        <dt className="text-slate-500">{label}</dt>
        <dd className="font-medium text-slate-900 sm:col-span-2">{children || "-"}</dd>
    </div>
);

// Step 5: sabai vivaran heri, chahiye section anusar sampadan, ani swaghoshana
const ReviewStep = ({ data, updateField, goToStep }) => {
    const { t, i18n } = useTranslation();
    const num = (n) => Number(n).toLocaleString(i18n.resolvedLanguage === "en" ? "en-US" : "ne-NP");
    const { departments = [] } = useSelector((state) => state.department);
    const department = departments.find((dept) => dept._id === data.department);
    const edit = t("complaintForm.review.edit");
    const place = localizePlace(data, i18n.resolvedLanguage === "en");
    const position = data.latitude && data.longitude ? [Number(data.latitude), Number(data.longitude)] : null;

    return (
        <div>
            <h2 className="text-xl font-bold text-slate-900">{t("complaintForm.review.title")}</h2>
            <p className="mt-1 text-sm text-slate-500">{t("complaintForm.review.text")}</p>

            <div className="mt-6 space-y-4">
                <Section icon={FaUser} title={t("complaintForm.review.applicant")} step={0} goToStep={goToStep} editLabel={edit} delay={0}>
                    <dl className="divide-y divide-slate-100">
                        <Row label={t("complaintForm.citizen.name")}>{data.fullName}</Row>
                        <Row label={t("complaintForm.citizen.phone")}>{data.phone}</Row>
                        <Row label={t("complaintForm.citizen.email")}>{data.email}</Row>
                    </dl>
                </Section>

                <Section icon={FaMapMarkerAlt} title={t("complaintForm.review.place")} step={1} goToStep={goToStep} editLabel={edit} delay={60}>
                    <p className="text-sm font-medium text-slate-900">
                        {[data.tole, `${place.municipality}-${num(data.ward)}`, place.district, place.province].filter(Boolean).join(", ")}
                    </p>

                    {position && (
                        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                            {/* Herna matra: tanna/zoom garna mildaina */}
                            <MapContainer
                                center={position}
                                zoom={16}
                                dragging={false}
                                scrollWheelZoom={false}
                                doubleClickZoom={false}
                                touchZoom={false}
                                zoomControl={false}
                                keyboard={false}
                                className="z-0 h-48 w-full"
                            >
                                <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={position} />
                            </MapContainer>
                        </div>
                    )}
                </Section>

                <Section icon={FaBuilding} title={t("complaintForm.steps.department")} step={2} goToStep={goToStep} editLabel={edit} delay={120}>
                    <p className="text-sm font-semibold text-slate-900">{department?.name || "-"}</p>
                </Section>

                <Section icon={FaFileAlt} title={t("complaintForm.review.complaint")} step={3} goToStep={goToStep} editLabel={edit} delay={180}>
                    <dl className="divide-y divide-slate-100">
                        <Row label={t("complaintForm.details.subjectLabel")}>{data.title}</Row>
                        <Row label={t("complaintForm.details.descriptionLabel")}>
                            <span className="whitespace-pre-line font-normal leading-6 text-slate-700">{data.description}</span>
                        </Row>
                        <Row label={t("complaintForm.review.urgency")}>
                            <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${URGENCY_CLASS[data.priority]}`}>
                                {t(`complaintForm.details.urgency.${data.priority}.title`)}
                            </span>
                        </Row>
                    </dl>

                    {data.images.length > 0 && (
                        <div className="mt-3">
                            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                <FaImages />
                                {t("complaintForm.review.photos")} ({num(data.images.length)})
                            </p>
                            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                                {data.images.map((img) => (
                                    <img key={img.id} src={img.preview} alt={img.file.name} className="aspect-square w-full rounded-lg border border-slate-200 object-cover" />
                                ))}
                            </div>
                        </div>
                    )}
                </Section>
            </div>

            {/* Swaghoshana */}
            <label
                className={`mt-6 flex cursor-pointer gap-3 rounded-2xl border-2 p-4 transition ${
                    data.agree ? "border-green-600 bg-green-50" : "border-amber-300 bg-amber-50"
                }`}
            >
                <input
                    type="checkbox"
                    checked={!!data.agree}
                    onChange={(e) => updateField("agree", e.target.checked)}
                    className="mt-0.5 h-5 w-5 shrink-0 accent-[#003893]"
                />
                <span className="text-sm leading-6 text-slate-800">{t("complaintForm.review.declaration")}</span>
            </label>
        </div>
    );
};

export default ReviewStep;
