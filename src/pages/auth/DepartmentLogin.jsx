import { useState } from "react"
import { FaEnvelope, FaLock } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { loginDepartment } from "../../redux/slices/departmentSlice"
import { useNavigate } from "react-router-dom"
import { FiEye, FiEyeOff } from "react-icons/fi"
import { toast } from "react-toastify"


const DepartmentLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading } = useSelector((state) => state.auth);

    const [showPassword, setShowPassword] = useState();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const changeHandler = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value,
        });
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        const result = await dispatch(loginDepartment(formData));

        if (!formData.email || !formData.password) {
            toast.error("Please enter email and password.");
        }

        if (loginDepartment.fulfilled.match(result)) {
            toast.success("Welcome back 👋");

            setTimeout(() => {
                navigate("/department");
            }, 800)
        }

        if (loginDepartment.rejected.match(result)) {
            toast.error(result.payload?.message || "Invalid email or password");
        }
    }

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <div className="w-11 h-11 rounded-lg bg-[#d9a441] flex items-center justify-center mx-auto">
                        <span className="font-bold text-xl text-[#10151c]">SC</span>
                    </div>
                    <h1 className="text-3xl font-bold mt-3">
                        Department Login
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Login as Department Administrator
                    </p>

                </div>

                <form onSubmit={submitHandler} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label className="font-medium mb-2">Email Address</label>

                        <div className="relative ">
                            <FaEnvelope className="absolute left-4 top-1/2
                             -translate-y-1/2 text-slate-400" />

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={changeHandler}
                                autoComplete="username"
                                placeholder="department@example.com"
                                className="w-full border rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#0f4c81]"
                            />
                        </div>
                    </div>
                    {/* Email */}
                    <div>
                        <label className="font-medium mb-2">Password</label>

                        <div className="relative ">
                            <FaLock className="absolute left-4 top-1/2
                             -translate-y-1/2 text-slate-400" />

                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={changeHandler}
                                placeholder="*********"
                                autoComplete="current-password"
                                className="w-full border rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#0f4c81]"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2"
                            >
                                {!showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
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
            </div>
        </div>
    )
}

export default DepartmentLogin
