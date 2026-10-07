import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FaBullhorn } from "react-icons/fa";
import { getNewArrivals } from "../../redux/slices/noticeSlice";

// Sarkari website jastai navbar muni chalne "सूचना" patti. Mouse rakhda rokincha
const NoticeTicker = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { newArrivals = [] } = useSelector((state) => state.notice);

    useEffect(() => {
        if (newArrivals.length === 0) {
            dispatch(getNewArrivals());
        }
    }, [dispatch, newArrivals.length]);

    if (newArrivals.length === 0) return null;

    // Ekai list duichoti rakhda animation bina rokaai ghumcha
    const items = [...newArrivals, ...newArrivals];

    return (
        <div className="ticker flex items-stretch border-b border-slate-200 bg-white">
            <Link
                to="/notices"
                className="flex shrink-0 items-center gap-2 bg-[#dc143c] px-4 py-2 text-sm font-semibold text-white"
            >
                <FaBullhorn />
                {t("homeGov.ticker")}
            </Link>

            <div className="relative flex-1 overflow-hidden">
                <div
                    className="ticker-track flex w-max items-center gap-10 py-2 pl-6"
                    style={{ "--ticker-duration": `${Math.max(20, newArrivals.length * 10)}s` }}
                >
                    {items.map((notice, index) => (
                        <Link
                            key={`${notice._id}-${index}`}
                            to={`/notices/${notice._id}`}
                            aria-hidden={index >= newArrivals.length}
                            tabIndex={index >= newArrivals.length ? -1 : undefined}
                            className="flex items-center gap-2 whitespace-nowrap text-sm text-slate-700 hover:text-[#003893] hover:underline"
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-[#dc143c]" />
                            {notice.title}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NoticeTicker;
