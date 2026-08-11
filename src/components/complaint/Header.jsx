

const Header = () => {
  return (
    <div className="pt-16 flex-1">
        <div className="relative bg-linear-to-br from-[#10151c] to-[#1e2a38] px-4 py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {/* Page Header */}
            <div className="w-full h-full" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #4a6c8f 0%, transparent 50%), radial-gradient(circle at 80% 20%, #d9a441 0%, transparent 40%)" }}>
            </div>
          </div>
          <div className="relative max-w-7xl mx-auto sm:px-6 lg:px-8 text-center">
            <span className=" text-[#d9a441] uppercase tracking-wider text-xs border border-white/70 px-2.5 py-1 rounded-2xl font-bold ">Complaint Services</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-center  text-white mb-3 mt-2">Complaint & Feedback System</h1>
          <p className="text-slate-400 text-center">File, track and manage your city complaints with full transparency and real-time status updates.</p>
        </div>
      </div>
  )
}

export default Header
