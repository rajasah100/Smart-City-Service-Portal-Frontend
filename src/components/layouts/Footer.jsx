import { FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaTiktok, FaYoutube } from "react-icons/fa"
import { Link } from "react-router-dom"
import { FiMail } from "react-icons/fi";
// import logo from "../../assets/logo.png"

const quickLinks = [
    { label: "Home", to: "/" },
    { label: "Services", to: "/servicepage" },
    { label: "Notices", to: "/notices" },
    { label: "Events", to: "/events" },
    { label: "File a Complaint", to: "/complaint" },
    { label: "Emergency Services", to: "/emergency" },
]

const citizen = [
    { label: 'Register Account', to: '/register' },
    { label: 'About Smart City', to: '/about' },
    { label: 'Government Services', to: "/government" }
]

// Array of objects combining the component and its brand hover class
const socialMedia = [
    { Icon: FaFacebook, hoverClass: "hover:bg-[#1877F2]" },
    { Icon: FaYoutube, hoverClass: "hover:bg-[#FF0000]" },
    { Icon: FaInstagram, hoverClass: "hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7]" },
    { Icon: FaTiktok, hoverClass: "hover:bg-[#000000] border border-transparent hover:border-slate-700" },
]

const Footer = () => {
    return (
        <footer className="bg-[#10151c] text-slate-300 print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="rounded-lg bg-transparent flex items-center gap-2 justify-center">
                                <div className="w-8 h-8 rounded-lg bg-[#d9a441] flex items-center justify-center">
                                    <span className="font-bold text-sm text-[#10151c]">SC</span>
                                </div>

                                {/* <img src={logo} alt="" className=" " /> */}
                                <span className="font-bold text-white text-lg flex">Smart <span className="text-[#d9a441]">City</span></span>
                            </div>

                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed mb-5">
                            Connecting citizens with smarter city services through one unified digital platform.
                            Access complaints, notices, events, emergency support, and more anytime, anywhere.
                        </p>

                        {/* Updated Social Links mapping */}
                        <div className="flex gap-3">
                            {socialMedia.map(({ Icon, hoverClass }, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className={`w-8 h-8 rounded-full bg-[#1e2a38] flex items-center justify-center text-slate-300 hover:text-white transition-all duration-300 ${hoverClass}`}
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm"> {/* Fixed typo: test-sm -> text-sm */}
                            {quickLinks.map((l) => (
                                <li key={l.to}>
                                    <Link
                                        to={l.to}
                                        className="text-slate-400 hover:text-[#d9a441] transition-colors"
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Citizen Services */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Citizen Services</h4>
                        <ul className="space-y-2 text-sm">
                            {citizen.map((c) => (
                                <li key={c.to}>
                                    <Link
                                        to={c.to}
                                        className="text-slate-400 hover:text-[#d9a441] transition-colors"
                                    >
                                        {c.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white mb-4 font-semibold ">Contact Us</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2 text-slate-400">
                                <FaMapMarkerAlt className="w-4 h-4 mt-0.5 shrink-0 text-[#d9a441]" />
                                Bhakatpur-03
                            </li>
                            <li className="flex items-center gap-2 text-slate-400">
                                <FaPhoneAlt className="w-4 h-4 shrink-0 text-[#d9a441]" />
                                9804702922 / 9812060473
                            </li>

                            <li className="flex items-center gap-2 text-slate-400">
                                <FiMail className="w-5 h-5 shrink-0 text-[#d9a441]" />
                                info@smartcity.gov.np
                            </li>
                        </ul>
                        <div className="mt-5 p-3 rounded-lg bg-red-900/30 border border-red-800/40">
                            <p className="text-sm text-red-300 font-semibold">Emergency Hotline</p>
                            <p className="text-white font-bold text-lg">100</p>
                        </div>
                    </div>
                </div>

                {/* copyright */}
                <div className="mt-10 pt-6 border-t border-[#1e2a38] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                    <p>&copy; 2026 Smart City Information Portal. All rights reserved.</p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-slate-300 transition-colors">Terms of Use</a>
                        <a href="#" className="hover:text-slate-300 transition-colors">Accessibility</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer