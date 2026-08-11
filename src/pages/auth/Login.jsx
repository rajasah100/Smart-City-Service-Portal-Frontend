import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { loginUser, googleLogin, clearError } from "../../redux/slices/authSlice";
import cityImage from "../../assets/cityImg.jpg";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";


// Input Component (Outside Login)
const Input = ({ icon: Icon, ...props }) => {
    return (
        <div className="relative">
            <Icon
                className="absolute left-4 top-4 text-gray-400"
            />

            <input
                {...props}
                className="w-full border border-gray-200 rounded-lg py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
};

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading } = useSelector((state) => state.auth)

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });


    const handleChange = (e) => {
        setFormData({
            ...formData,

            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        dispatch(clearError());

        const result = await dispatch(loginUser(formData));

        if (!formData.email || !formData.password) {
            toast.error("Please enter email and password.")
        }

        if (loginUser.fulfilled.match(result)) {
            toast.success("Welcome back 👋")

            const role = result.payload.role;

            setTimeout(() => {
                if (role === 'admin') {
                    navigate("/admin", { replace: true });
                } else {
                    navigate("/", { replace: true });
                }
            }, 800);
        }

        if (loginUser.rejected.match(result)) {
            toast.error(result.payload?.message || "Invalid email or password");
        }
    };

    // Google connect
    const googleSuccess = async (credentialResponse) => {
        dispatch(clearError());

        const result = await dispatch(
            googleLogin(credentialResponse.credential)
        );

        if (googleLogin.fulfilled.match(result)) {
            toast.success("Google Login Successful 🎉");

            setTimeout(() => {
                navigate("/", { replace: true });
            }, 800);
        }

        if (googleLogin.rejected.match(result)) {
            toast.error(result.payload?.message || "Google Login Failed");
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* LEFT IMAGE SECTION */}

            <div
                className="hidden lg:flex w-1/2 relative"
            >
                <img
                    src={cityImage}
                    alt="Smart City"
                    className="absolute w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/50"
                />

                <div
                    className="relative z-10 text-white p-14 flex flex-col justify-center"
                >
                    <h1
                        className="text-5xl font-bold mb-5"
                    >
                        Smart City
                    </h1>

                    <p className="text-xl">Digital Citizen Service Management System</p>
                    <div
                        className="mt-8 space-y-4 text-lg"
                    >
                        <p>✓ Access city services</p>
                        <p>✓ Track complaints easily</p>
                        <p>✓ Emergency notifications</p>
                        <p>✓ Connect with departments</p>
                    </div>
                </div>
            </div>

            {/* LOGIN FORM */}

            <div
                className="w-full lg:w-1/2 flex items-center justify-center p-8"
            >
                <div
                    className="
                    w-full
                    max-w-md
                    "
                >
                    <h1 className="text-4xl font-bold text-gray-900">
                        Welcome Back
                    </h1>

                    <p
                        className="text-gray-500 mt-2 mb-8"
                    >
                        Login to access SmartCity dashboard
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <label>Email Address *</label>

                        <Input
                            icon={FaEnvelope}
                            type="email"
                            name="email"
                            required
                            placeholder="your@email.com"
                            value={formData.email}
                            autoComplete="email"
                            onChange={handleChange}
                        />

                        <label>Password *</label>

                        <Input
                            icon={FaLock}
                            type="password"
                            name="password"
                            autoComplete="current-password"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={handleChange}
                        />

                        <div
                            className="
                            flex
                            justify-between
                            text-sm
                            "
                        >

                            <button
                                type="button"
                                onClick={() => navigate("/forgot-password")}
                                className="text-blue-600 hover:underline"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60 disabled:cursor-not-allowed py-3 rounded-lg font-semibold transition"
                        >
                            {loading ? (
                                <span className="flex justify-center items-center gap-2">
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

                                    Signing In...
                                </span>
                            ) : (
                                "Login →"
                            )}
                        </button>
                    </form>

                    <div
                        className="
                        flex
                        items-center
                        gap-3
                        my-6
                        "
                    >
                        <div className="h-px bg-gray-300 flex-1" />

                        <span className="text-gray-400">OR</span>

                        <div className="h-px bg-gray-300 flex-1" />
                    </div>

                    <GoogleLogin
                        onSuccess={googleSuccess}
                        onError={() => toast.error("Google Login Failed")}
                        useOneTap={false}
                    />

                    <p
                        className="
                        text-center
                        mt-6
                        text-gray-500
                        "
                    >
                        Don't have account?
                        <span
                            onClick={() => navigate("/register")}
                            className="
                            text-blue-600
                            cursor-pointer
                            ml-1
                            "
                        >
                            Register
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
