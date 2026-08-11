import { LuSearch }from "react-icons/lu"

const ComplaintSearch = ( {search, setSearch}) => {
  return (
    <div className="flex-1">
      <div className="relative">
        <LuSearch
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input 
        type="text"
        placeholder="Search by complaint title or department..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#4a6c8f] focus:border-[#4a6c8f]"
        />
      </div>
    </div>
  )
}

export default ComplaintSearch
