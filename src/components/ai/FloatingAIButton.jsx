import { LuMessageCircleMore } from "react-icons/lu";

const FloatingAIButton = ({ onClick }) => {
    return (
        <button
        onClick={onClick}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#d9a441] hover:bg-yellow-600 text-white rounded-full shadow-xl px-5 py-3 transition-all duration-300 hover:scale-105 cursor-pointer "
        >
            <LuMessageCircleMore size={22}  />

            <div className="text-left hidden md:block">
                <p className="text-sm font-semibold">
                    Smart AI
                </p>

                <p className="text-xs opacity-90">
                    Ask Anything
                </p>
            </div>
        </button>
    )
}

export default FloatingAIButton
