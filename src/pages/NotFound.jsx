import { Link } from "react-router-dom"
import NotFoundImg from "../assets/404.png"

const NotFound = () => {
    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-yellow-50 px-6 flex flex-col justify-center items-center">
            <div className="max-w-3xl w-full text-center">

                {/* Illustration */}
                <img
                    src={NotFoundImg}
                    alt="404 Not Found"
                    className="w-full max-w-md mx-auto mb-8"
                />

                {/* title */}
                <h1 className="text-5xl md:text-6xl font-bold text-gray-800">
                    Opps! Page Not Found
                </h1>

                <p className="mt-4 text-gray-500 text-lg leading-relaxed">
                    The page's you're looking for doesn't exist or may have been moved.
                </p>

                {/* Button */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                    <Link
                        to="/"
                        className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-xl transition"
                    >
                        🏠 Back to Home
                    </Link>

                    <button 
                    onClick={() => window.history.back()}
                    className="px-6 py-3 border border-gray-300 hover:bg-gray-100 rounded-xl font-semibold transition cursor-pointer"
                    >
                        ← Go Back
                    </button>
                </div>
            </div>

        </div>
    )
}

export default NotFound
