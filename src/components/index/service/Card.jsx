import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const Card = ({ icon, title, description, link }) => {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#4a6c8f] hover:shadow-2xl">

      {/* Top Accent Line */}
      <div className="absolute left-0 top-0 h-1 w-full origin-left scale-x-0 bg-[#4a6c8f] transition-transform duration-300 group-hover:scale-x-100"></div>

      {/* Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4a6c8f]/10 text-3xl text-[#4a6c8f] transition-all duration-300 group-hover:bg-[#4a6c8f] group-hover:text-white">
        {icon}
      </div>

      {/* Title */}
      <h3 className="mt-6 text-2xl font-bold text-slate-900">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-4 leading-7 text-slate-600">
        {description}
      </p>

      {/* Bottom */}
      <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
        <span className="text-sm font-semibold uppercase tracking-wide text-[#4a6c8f]">
          Explore
        </span>

        <Link
          to={link}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#4a6c8f] text-white transition-all duration-300 hover:bg-[#36516d] group-hover:translate-x-1"
        >
          <FaArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default Card;