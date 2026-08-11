import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../../redux/slices/authSlice";
import registerImg from "../../assets/register.jpg";
import { toast } from "react-toastify"
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaLock
} from "react-icons/fa";


const Input = ({ icon: Icon, ...props }) => (
    <div className="relative">
        <Icon className="absolute left-4 top-4 text-gray-400" />
        <input
            {...props}
            className="w-full border border-gray-200 rounded-lg py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-yellow-400"
        />
    </div>
);

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading } = useSelector((state) => state.auth)

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""

    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        dispatch(clearError());

        if (
            !formData.firstName ||
            !formData.lastName ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            toast.error("Please fill all required fields.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        if (
            formData.phone &&
            !/^9\d{9}$/.test(formData.phone)
        ) {
            toast.warning("Enter valid Nepali mobile number.");
            return;
        }

        const userData = {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
        };

        const result = await dispatch(registerUser(userData));

        if (registerUser.fulfilled.match(result)) {
            toast.success("Account created successfully. Please login to continue.");

            setTimeout(() => {
                navigate("/login");
            }, 1200);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* LEFT SIDE */}
            <div className="hidden lg:flex w-1/2 relative">
                <div
                    className="absolute w-full h-full bg-center bg-cover"
                    style={{ backgroundImage: `url(${registerImg})` }}
                />
                <div className="absolute inset-0 bg-black/50" />

                <div className="relative z-10 text-white p-14 flex flex-col justify-center">
                    <h1 className="text-5xl font-bold mb-5">
                        Become a Registered Citizen
                    </h1>
                    <p className="text-lg leading-8">
                        Your account gives you access to the
                        smart city platform — from services
                        to emergency alerts.
                    </p>
                    <div className="mt-8 space-y-4 text-lg">
                        <p>
                            ✓ Access all city services in one portal
                        </p>
                        <p>
                            ✓ Real time complaint tracking
                        </p>
                        <p>
                            ✓ Personalized city notifications
                        </p>
                        <p>
                            ✓ Emergency alerts & updates
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-xl">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Create your account
                    </h1>
                    <p className="text-gray-500 mt-2 mb-8">
                        Join thousands of registered citizens of SmartCity
                    </p>
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label>
                                    First Name *
                                </label>
                                <Input
                                    icon={FaUser}
                                    name="firstName"
                                    placeholder="First name"
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>
                                    Last Name *
                                </label>
                                <Input
                                    icon={FaUser}
                                    name="lastName"
                                    placeholder="Last name"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <label>
                            Email Address *
                        </label>
                        <Input
                            icon={FaEnvelope}
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            onChange={handleChange}
                        />
                        <label>
                            Phone Number
                        </label>
                        <Input
                            icon={FaPhone}
                            name="phone"
                            type="tel"
                            maxLength={10}
                            placeholder="+977 98XXXXXXXX"
                            onChange={handleChange}
                        />
                        <label>Password *</label>
                        <Input
                            icon={FaLock}
                            type="password"
                            name="password"
                            placeholder="Create strong password"
                            onChange={handleChange}
                        />
                        <label>Confirm Password *</label>
                        <Input
                            icon={FaLock}
                            type="password"
                            name="confirmPassword"
                            placeholder="Repeat password"
                            onChange={handleChange}
                        />


                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60 transition py-3 rounded-lg font-semibold text-black"
                        >
                            {loading ? "Creating Account..." : "Create Account →"}
                        </button>
                        <p className="text-center mt-6 text-gray-500">
                            Already have an account?
                            <span
                                onClick={() => navigate("/login")}
                                className="text-blue-600 cursor-pointer ml-1"
                            >
                                Sign in
                            </span>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}


export default Register;