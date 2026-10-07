import { RiSparkling2Fill } from "react-icons/ri";

const SIZES = {
    sm: { box: "h-8 w-8", icon: 14 },
    md: { box: "h-11 w-11", icon: 20 },
    lg: { box: "h-16 w-16", icon: 28 },
};

// AI ko avatar: ghumne gradient ring bhitra seto gola ra chamkine tara
const AIOrb = ({ size = "md", className = "" }) => {
    const { box, icon } = SIZES[size];

    return (
        <span className={`ai-orb relative flex shrink-0 items-center justify-center rounded-full p-0.5 shadow-md ${box} ${className}`} aria-hidden="true">
            <span className="ai-orb-inner flex h-full w-full items-center justify-center rounded-full text-[#003893]">
                <RiSparkling2Fill size={icon} />
            </span>
        </span>
    );
};

export default AIOrb;
