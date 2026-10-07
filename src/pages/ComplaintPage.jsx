import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify"
import { FaArrowLeft, FaArrowRight, FaCheckCircle, FaExclamationTriangle, FaPaperPlane, FaRobot } from "react-icons/fa";
import Header from "../components/complaint/Header"
import Stepper from "../components/complaint/Stepper"
import CitizenInfo from "../components/complaint/CitizenInfo"
import SuccessPage from "../components/complaint/SuccessPage"
import CategoryStep from "../components/complaint/CategoryStep"
import ComplaintDetails from "../components/complaint/ComplaintDetails"
import LocationStep from "../components/complaint/LocationStep"
import ReviewStep from "../components/complaint/ReviewStep"
import { createComplaint } from "../redux/slices/complaintSlice"
import { clearComplaintData } from "../redux/slices/aiSlice"
import { coversLocation } from "../utils/serviceArea"

// Sthan pahile: tyo thau herne department matra dekhauna
const STEP_KEYS = ["citizen", "location", "department", "details", "review"];

const emptyForm = (userInfo) => ({
  // Citizen
  fullName: userInfo?.name || "",
  phone: userInfo?.phone || "",
  email: userInfo?.email || "",

  // Complaint
  department: "",
  title: "",
  description: "",
  priority: "medium",

  // Image
  images: [],

  // Location
  province: "",
  district: "",
  municipality: "",
  ward: "",
  tole: "",

  latitude: "",
  longitude: "",
  // Pin kun palika ma parchha (naksa bata, submit hudaina)
  pinMunicipality: "",
  // Naksa le aafai bhareko tol
  autoTole: "",

  // Swaghoshana
  agree: false,
});

const ComplaintPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { loading } = useSelector((state) => state.complaint);
  const { userInfo } = useSelector((state) => state.auth);
  const { departments = [] } = useSelector((state) => state.department);
  const { complaintData } = useSelector((state) => state.ai);

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const [formData, setFormData] = useState(() => emptyForm(userInfo));

  // AI chat le bhareko data form ma halne (naya data aauda matra, render bela nai)
  const [appliedAiData, setAppliedAiData] = useState(null);

  if (complaintData && complaintData !== appliedAiData) {
    setAppliedAiData(complaintData);
    setFormData((prev) => ({
      ...prev,

      department: complaintData.department || prev.department,
      title: complaintData.title || prev.title,
      description: complaintData.description || prev.description,
      priority: complaintData.priority?.toLowerCase() || prev.priority,

      province: complaintData.province || prev.province,
      district: complaintData.district || prev.district,
      municipality: complaintData.municipality || prev.municipality,
      ward: complaintData.ward || prev.ward,
      tole: complaintData.tole || prev.tole,
    }));
  }

  // Step badlida form ko mathi lagne
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, submitted]);

  const steps = STEP_KEYS.map((key) => t(`complaintForm.steps.${key}`));

  // Pahilo galti ko message key (galti chaina bhane null)
  const firstError = () => {
    const v = (key) => `complaintForm.validation.${key}`;

    switch (STEP_KEYS[step]) {
      case "citizen": {
        if (!formData.fullName.trim()) return v("nameRequired");
        if (formData.fullName.trim().length < 3) return v("nameShort");
        if (!formData.phone.trim()) return v("phoneRequired");
        if (!/^9[678]\d{8}$/.test(formData.phone.trim())) return v("phoneInvalid");
        if (!formData.email.trim()) return v("emailRequired");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return v("emailInvalid");
        return null;
      }

      case "department": {
        const department = departments.find((dept) => dept._id === formData.department);
        // Pachhi sthan badleko bhae purano department yo thau herdaina hola
        return department && coversLocation(department.serviceArea, formData) ? null : v("department");
      }

      case "details":
        if (!formData.title.trim()) return v("titleRequired");
        if (formData.title.trim().length < 5) return v("titleShort");
        if (!formData.description.trim()) return v("descriptionRequired");
        if (formData.description.trim().length < 20) return v("descriptionShort");
        if (formData.images.length === 0) return v("imageRequired");
        if (formData.images.length > 5) return v("imageMax");
        return null;

      case "location":
        if (!formData.province) return v("province");
        if (!formData.district) return v("district");
        if (!formData.municipality) return v("municipality");
        if (!formData.ward) return v("ward");
        if (!formData.tole.trim()) return v("tole");
        if (!formData.latitude || !formData.longitude) return v("map");
        return null;

      case "review":
        return formData.agree ? null : "complaintForm.review.declarationRequired";

      default:
        return null;
    }
  };

  const validateStep = () => {
    const error = firstError();

    if (error) {
      toast.error(t(error));
      return false;
    }

    return true;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    if (step < STEP_KEYS.length - 1) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  // Review bata section sampadan: pachhadi matra jana milcha
  const goToStep = (index) => {
    if (index < step) setStep(index);
  };

  // "Arko gunaso": form khali gari pahilo step
  const startNew = () => {
    formData.images.forEach((image) => URL.revokeObjectURL(image.preview));
    setFormData(emptyForm(userInfo));
    dispatch(clearComplaintData());
    setSubmittedData(null);
    setSubmitted(false);
    setStep(0);
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    try {
      const submitData = new FormData();

      submitData.append("phone", formData.phone);

      submitData.append("department", formData.department);
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("priority", formData.priority);

      submitData.append("province", formData.province);
      submitData.append("district", formData.district);
      submitData.append("municipality", formData.municipality);
      submitData.append("ward", formData.ward);
      submitData.append("tole", formData.tole);

      submitData.append("latitude", formData.latitude);
      submitData.append("longitude", formData.longitude);

      // Multiple Images
      formData.images.forEach((image) => {
        submitData.append("images", image.file);
      })

      const result = await dispatch(createComplaint(submitData)).unwrap();

      setSubmittedData(result);
      // AI ko draft pheri form ma nabharos
      dispatch(clearComplaintData());
      toast.success(t("complaintForm.submitted"));

      setTimeout(() => {
        setSubmitted(true);
      }, 800);
    } catch (error) {
      toast.error(error?.message || t("complaintForm.submitFailed"));
    }
  }

  if (submitted) {
    return <SuccessPage data={submittedData} onNewComplaint={startNew} />
  }

  const isLast = step === STEP_KEYS.length - 1;
  const aiDepartment = departments.find(
    (dept) => dept._id === formData.department || dept.name === formData.department
  );

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      <Header />

      <div className="mx-auto grid max-w-7xl gap-6 px-4 pt-8 sm:px-6 lg:grid-cols-3 lg:px-8">

        {/* ===== Form ===== */}
        <div className="space-y-6 lg:col-span-2">
          <Stepper steps={steps} currentStep={step} />

          {/* key={step}: step badlida halka animation */}
          <div key={step} className="animate-fade-up rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {step === 0 && <CitizenInfo data={formData} updateField={updateField} />}
            {step === 1 && <LocationStep data={formData} updateField={updateField} />}
            {step === 2 && <CategoryStep data={formData} updateField={updateField} />}
            {step === 3 && <ComplaintDetails data={formData} updateField={updateField} />}
            {step === 4 && <ReviewStep data={formData} updateField={updateField} goToStep={goToStep} />}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 0}
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FaArrowLeft className="text-xs" />
              {t("complaintForm.previous")}
            </button>

            {isLast ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                aria-disabled={!formData.agree}
                className={`flex items-center gap-2 rounded-xl bg-[#dc143c] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#b51031] disabled:cursor-not-allowed disabled:opacity-60 ${formData.agree ? "" : "opacity-60"}`}
              >
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <FaPaperPlane />
                )}
                {loading ? t("complaintForm.submitting") : t("complaintForm.submit")}
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                className="group flex items-center gap-2 rounded-xl bg-[#003893] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#002a6e]"
              >
                {t("complaintForm.next")}
                <FaArrowRight className="text-xs transition group-hover:translate-x-1" />
              </button>
            )}
          </div>
        </div>

        {/* ===== Sidebar ===== */}
        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          {complaintData && (
            <div className="animate-fade-up rounded-2xl border border-[#003893]/20 bg-[#003893]/5 p-5">
              <h3 className="flex items-center gap-2 font-semibold text-[#003893]">
                <FaRobot />
                {t("complaintForm.ai.title")}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{t("complaintForm.ai.text")}</p>
              <dl className="mt-3 space-y-1 text-sm">
                <div><dt className="inline font-medium">{t("complaintForm.ai.department")}: </dt><dd className="inline">{aiDepartment?.name || complaintData.departmentName || "-"}</dd></div>
                <div><dt className="inline font-medium">{t("complaintForm.ai.priority")}: </dt><dd className="inline">{t(`userDash.priority.${formData.priority}`, { defaultValue: formData.priority })}</dd></div>
                <div>
                  <dt className="inline font-medium">{t("complaintForm.ai.location")}: </dt>
                  <dd className="inline">{[formData.municipality, formData.district, formData.ward && `${t("userPages.detail.ward")} ${formData.ward}`].filter(Boolean).join(", ") || "-"}</dd>
                </div>
              </dl>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-slate-900">{t("complaintForm.help.title")}</h3>
            <ul className="mt-3 space-y-2.5">
              {(t("complaintForm.help.tips", { returnObjects: true }) || []).map((tip) => (
                <li key={tip} className="flex gap-2 text-sm leading-6 text-slate-600">
                  <FaCheckCircle className="mt-1 shrink-0 text-green-600" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="flex gap-2 text-sm font-medium text-[#dc143c]">
              <FaExclamationTriangle className="mt-0.5 shrink-0" />
              {t("complaintForm.help.emergency")}
            </p>
            <Link to="/emergency" className="mt-2 inline-block text-sm font-semibold text-[#dc143c] underline">
              {t("complaintForm.help.emergencyLink")}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default ComplaintPage
