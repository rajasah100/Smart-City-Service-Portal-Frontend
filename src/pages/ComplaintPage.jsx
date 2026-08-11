import { useState } from "react"
import Header from "../components/complaint/Header"
import Stepper from "../components/complaint/Stepper"
import CitizenInfo from "../components/complaint/CitizenInfo"
import SuccessPage from "../components/complaint/SuccessPage"
import CategoryStep from "../components/complaint/CategoryStep"
import ComplaintDetails from "../components/complaint/ComplaintDetails"
import LocationStep from "../components/complaint/LocationStep"
import ReviewStep from "../components/complaint/ReviewStep"
import { useDispatch, useSelector } from "react-redux";
import { createComplaint } from "../redux/slices/complaintSlice"
import { toast } from "react-toastify"
import { useEffect } from "react"
// import { Navigate } from "react-router-dom"


const STEPS = [
  "Citizen Info",
  "Category",
  "Details",
  "Location",
  "Review",
]

const ComplaintPage = () => {

  const dispatch = useDispatch();


  const { loading } = useSelector(
    (state) => state.complaint
  );

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const { userInfo } = useSelector((state) => state.auth);

  const { complaintData } = useSelector((state) => state.ai);

  useEffect(() => {
    if (!complaintData) return;

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
    }))
  }, [complaintData]);

  const [formData, setFormData] = useState({
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
  })


  const validateStep = () => {
    switch (step) {
      // Citizen Information
      case 0: {
        if (!formData.fullName.trim()) {
          toast.error("Please enter your full name.");
          return false;
        }

        if (formData.fullName.trim().length < 3) {
          toast.error("Full name must be at least 3 characters.");
          return false;
        }

        if (!formData.phone.trim()) {
          toast.error("Please enter your phone number.");
          return false;
        }

        // Nepali mobile validation
        if (!/^9[678]\d{8}$/.test(formData.phone.trim())) {
          toast.error("Please enter a valid Nepali mobile number.");
          return false;
        }

        if (!formData.email.trim()) {
          toast.error("Please enter your email.");
          return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(formData.email)) {
          toast.error("Please enter a valid email address.");
          return false;
        }

        break;
      }

      // Department
      case 1:
        if (!formData.department) {
          toast.error("Please select a department.");
          return false;
        }
        break;

      // Complaint Details
      case 2:
        if (!formData.title.trim()) {
          toast.error("Please enter complaint title.");
          return false;
        }

        if (formData.title.trim().length < 5) {
          toast.error("Complaint title must be at least 5 characters.");
          return false;
        }

        if (!formData.description.trim()) {
          toast.error("Please enter complaint description.");
          return false;
        }

        if (formData.description.trim().length < 20) {
          toast.error(
            "Complaint description must be at least 20 characters."
          );
          return false;
        }

        if (formData.images.length === 0) {
          toast.error("Please upload at least one image.");
          return false;
        }

        if (formData.images.length > 5) {
          toast.error("Maximum 5 images are allowed.");
          return false;
        }

        break;

      // Location
      case 3:
        if (!formData.province) {
          toast.error("Please select province.");
          return false;
        }

        if (!formData.district) {
          toast.error("Please select district.");
          return false;
        }

        if (!formData.municipality) {
          toast.error("Please select municipality.");
          return false;
        }

        if (!formData.ward) {
          toast.error("Please enter ward.");
          return false;
        }

        if (!formData.tole.trim()) {
          toast.error("Please enter your tole.");
          return false;
        }

        if (!formData.latitude || !formData.longitude) {
          toast.error("Please select your location on the map.");
          return false;
        }

        break;

      default:
        return true;
    }

    return true;
  };


  const nextStep = () => {
    if (!validateStep()) return;

    if (step < STEPS.length - 1) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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

      for (let pair of submitData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const result = await dispatch(createComplaint(submitData)).unwrap();

      setSubmittedData(result);

      toast.success("Complaint Submitted successfully 🎉");

      setTimeout(() => {
        setSubmitted(true);
      }, 800);

    } catch (error) {
      toast.error(error?.message || "Failed to submit complaint.");
      console.error(error);
    }
  }

  if (submitted) {
    return <SuccessPage data={submittedData} />
  }

  return (
    <div className="min-h-screen ">
      <Header />

      <div className="max-w-7xl mx-auto py-8 px-4">
        <Stepper
          steps={STEPS}
          currentStep={step}
        />

        {complaintData && (
          <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
            <h3 className="text-lg font-semibold text-[#0f4c81]">
              🤖 AI Complaint Assistant
            </h3>

            <p className="mt-2 text-sm">
              Your complaint information has been collected by AI.
            </p>

            <div className="mt-4 space-y-2 text-sm">

              <p><strong>Department:</strong> {formData.department}</p>

              <p><strong>Priority:</strong> {formData.priority}</p>

              <p>
                <strong>Location:</strong>{" "}
                {formData.province},
                {formData.district},
                {formData.municipality},
                Ward {formData.ward}
              </p>

            </div>

          </div>
        )}

        <div className="bg-white rounded-xl shadow-md mt-8 p-8">
          {step === 0 && (
            <CitizenInfo
              data={formData}
              updateField={updateField}
            />
          )}

          {step === 1 && (
            <CategoryStep
              data={formData}
              updateField={updateField}
            />
          )}

          {step === 2 && (
            <ComplaintDetails
              data={formData}
              updateField={updateField}
            />
          )}
          {step === 3 && (
            <LocationStep
              data={formData}
              updateField={updateField}
            />
          )}
          {step === 4 && (
            <ReviewStep
              data={formData}
              updateField={updateField}
            />
          )}
        </div>


        <div className="flex justify-between mt-10">
          <button
            onClick={prevStep}
            disabled={step === 0}
            className="px-6 py-3 rounded-lg border disabled:opacity-40 cursor-pointer"
          >
            Previous
          </button>

          {step === STEPS.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#0f4c81] text-white px-6 py-3 rounded-lg hover:bg-[#0c416f] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      opacity="0.2"
                    />
                    <path
                      d="M22 12a10 10 0 0 1-10 10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                  </svg>

                  Submitting...
                </>
              ) : (
                "Submit Complaint"
              )}
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="border bg-[#0f4c81] border-[#0f4c81] text-white hover:bg-[#0c416f]  px-6 py-3 rounded-lg cursor-pointer"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div >
  )
}

export default ComplaintPage

