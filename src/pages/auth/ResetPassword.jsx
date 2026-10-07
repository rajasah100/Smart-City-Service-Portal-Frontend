import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import apiRequest from "../../utils/apiRequest";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await apiRequest.put(
        `/users/reset-password/${token}`,
        formData,
      );

      toast.success(data.message);
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-lg py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-yellow-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>

        <p className="text-gray-500 mt-2 mb-8">Enter your new password.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label>New Password *</label>

          <div className="relative">
            <FaLock className="absolute left-4 top-4 text-gray-400" />
            <input
              type="password"
              name="password"
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <label>Confirm Password *</label>

          <div className="relative">
            <FaLock className="absolute left-4 top-4 text-gray-400" />
            <input
              type="password"
              name="confirmPassword"
              required
              autoComplete="new-password"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60 disabled:cursor-not-allowed py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500">
          <Link to="/forgot-password" className="text-blue-600">
            Request a new link
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
