import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { FaWifi } from "react-icons/fa";

// Internet nabhaye pani phone call chalchha bhanera user lai bhanne
const OfflineBanner = () => {
    const { t } = useTranslation();
    const [isOffline, setIsOffline] = useState(() => !navigator.onLine);

    useEffect(() => {
        const goOffline = () => setIsOffline(true);
        const goOnline = () => setIsOffline(false);

        window.addEventListener("offline", goOffline);
        window.addEventListener("online", goOnline);

        return () => {
            window.removeEventListener("offline", goOffline);
            window.removeEventListener("online", goOnline);
        };
    }, []);

    if (!isOffline) return null;

    return (
        <div className="sticky top-16 z-40 bg-[#d9a441] text-[#10151c]">
            <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-3 text-sm lg:px-8">
                <FaWifi className="shrink-0" />

                <p>
                    <b>{t("emergency.offline.title")}</b> {t("emergency.offline.text")}
                </p>
            </div>
        </div>
    );
};

export default OfflineBanner;
