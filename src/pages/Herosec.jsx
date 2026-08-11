import { FaArrowRight, FaBuilding, FaRegClock } from 'react-icons/fa'
import { GoReport } from "react-icons/go";
import city from "../assets/city1.webp"
import { FiUsers, FiZap } from 'react-icons/fi';
import LatestNotice from '../components/index/LatestNotice';
import LatestEvent from '../components/index/LatestEvent';
import BannerCTA from '../components/index/BannerCTA';
import { Link } from 'react-router-dom';
import FeaturedServices from '../components/index/FeaturedServices';
import WhyChooseSmartCity from '../components/index/WhyChooseSmartCity';
// import video from "../assets/heroVideo.mp4"


const stats = [
  { value: "48K+", label: "Registered Citizens", icon: FiUsers },
  { value: "12,400", label: "Complaints Resolved", icon: FaRegClock },
  { value: "320+", label: "City Services", icon: FaBuilding },
  { value: "98%", label: "Uptime SLA", icon: FiZap },
];

const Herosec = () => {
  return (
    <div className="flex flex-col">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src={city}
          alt="Smart City"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* <video src={video} autoPlay loop muted></video> */}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-slate-900/75"></div>


        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 mt-10">
          <div className="flex flex-col items-center text-center ">

            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-white/10 backdrop-blur-md px-5 py-2 shadow-lg animate-pulse">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="text-sm font-medium tracking-wide text-cyan-50 capitalize">
                Digital Government Platform
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Smart City{" "}
              <span className="text-[#d9a441] italic font-serif font-normal">
                Service Portal
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 ">
              Digital government services for transparent, efficient, and
              citizen-centric governance. Accessible anytime, from anywhere.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex w-full flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/services" className="w-full sm:w-auto">
                <button className="group w-full sm:w-48 h-12 rounded-lg bg-[#d9a441] text-slate-900 font-semibold shadow-lg hover:bg-amber-600 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer">
                  Explore Service
                  <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Link>

              <Link to="/complaint" className="w-full sm:w-auto">
                <button className="w-full sm:w-48 h-12 rounded-lg border border-white/20 bg-white/10 backdrop-blur-md text-white font-medium hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer">
                  <GoReport className="text-amber-400 text-lg" />
                  File Complaint
                </button>
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* Stats Bar */}
      <section className="bg-[#1e2a38] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#4a6c8f]/30 flex items-center justify-center shrink-0">
                  <s.icon className="w-5 h-5 text-[#d9a441]" />
                </div>
                <div>
                  <p className="font-sora font-bold text-white text-xl">{s.value}</p>
                  <p className="font-manrope text-xs text-slate-400">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <FeaturedServices />


      {/* Notice and Event */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Latest Notice */}
            <LatestNotice />

            {/* Latest Event */}
            <LatestEvent />

          </div>
        </div>
      </section>

      {/* Why Choose */}
      <WhyChooseSmartCity />

      {/* Banner CTA */}
      <BannerCTA />


    </div>
  )
}

export default Herosec