import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";
import apiRequest from "../../utils/apiRequest";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await apiRequest.post("/users/forgot-password", {
        email: email.trim(),
      });

      toast.success(data.message);
      setSent(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-yellow-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900">Forgot Password</h1>

        {sent ? (
          <>
            <p className="text-gray-600 mt-4">
              If an account exists for <b>{email}</b>, we have sent a password
              reset link. Please check your inbox (and spam folder).
            </p>

            <p className="text-gray-500 text-sm mt-2">
              The link expires in 15 minutes.
            </p>
          </>
        ) : (
          <>
            <p className="text-gray-500 mt-2 mb-8">
              Enter your email and we will send you a link to reset your
              password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <label>Email Address *</label>

              <div className="relative">
                <FaEnvelope className="absolute left-4 top-4 text-gray-400" />

                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60 disabled:cursor-not-allowed py-3 rounded-lg font-semibold transition"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        )}

        <p className="text-center mt-6 text-gray-500">
          Remember your password?
          <Link to="/login" className="text-blue-600 ml-1">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
