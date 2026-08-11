import { FaArrowRight } from "react-icons/fa6";

const Card = ({ icon, title, description, category, link }) => {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#2c5d79] hover:shadow-xl">

      {/* Top */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2c5d79]/10 text-3xl text-[#2c5d79] transition-all duration-300 group-hover:bg-[#d9a441] group-hover:text-[#10151c]">
          {icon}
        </div>

        <span className="rounded-full bg-[#d9a441]/10 px-3 py-1 text-xs font-semibold text-[#b8871d]">
          {category}
        </span>
      </div>

      {/* Title */}
      <h2 className="mb-3 text-xl font-bold text-slate-800 transition-colors group-hover:text-[#2c5d79]">
        {title}
      </h2>

      {/* Description */}
      <p className="flex-grow text-sm leading-7 text-slate-600">
        {description}
      </p>

      {/* Divider */}
      <div className="my-6 h-px bg-slate-200"></div>

      {/* Button */}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-xl bg-[#d9a441] px-5 py-3 font-semibold text-[#10151c] transition-all duration-300 hover:bg-[#c7922d] hover:shadow-lg"
      >
        Visit Official Website
        <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
      </a>
    </div>
  );
};

export default Card;