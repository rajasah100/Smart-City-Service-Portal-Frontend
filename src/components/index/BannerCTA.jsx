import { FaBell } from "react-icons/fa"
import { Link } from "react-router-dom"


const BannerCTA = () => {
    return (
        <section className="py-16 bg-[#1e2a38]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div>
                        <h2 className="font-sora text-2xl sm:text-3xl font-bold text-white mb-3">
                            Have a concern? <span className="text-[#d9a441]">We're listening.</span>
                        </h2>
                        <p className="text-slate-400 text-[17px] max-w-xl">
                            File a complaint, track its progress, and get updates. Our civic response team ensures every issue is addressed promptly.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link to="/complaint">
                            <button className="bg-green-500 rounded-lg hover:bg-yellow-600 text-[#10151c] font-bold px-8 py-3 cursor-pointer">
                                File a Complaint
                            </button>
                        </Link>
                        <Link to="/emergency">
                            <button className="bg-red-600 hover:bg-red-700 text-white font-semibold font-manrope px-8 py-3 gap-2 flex items-center rounded-lg cursor-pointer">
                                <FaBell className="w-4 h-4" /> Emergency
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BannerCTA
