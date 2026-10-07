import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
    FaCheckCircle,
    FaCopy,
    FaExclamationCircle,
    FaMapMarkedAlt,
    FaPhoneAlt,
    FaShareAlt,
} from "react-icons/fa";
import { MdSos } from "react-icons/md";
import { useTranslation } from "react-i18next";
import apiRequest from "../../../utils/apiRequest";
import { registerPushToken } from "../../../hooks/useFirebaseNotification";

const SOS_TYPES = ["medical", "fire", "police", "accident", "disaster", "other"];

// Server lai kati-kati bela location pathaune
const SEND_INTERVAL_MS = 10000;

const getPosition = () =>
    new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("unsupported"));
            return;
        }

        navigator.geolocation.getCurrentPosition(resolve, () => reject(new Error("permission")), {
            enableHighAccuracy: true,
            timeout: 15000,
        });
    });

const toPayload = (position) => ({
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
});

const SosPanel = () => {
    const { t } = useTranslation();
    const { userInfo } = useSelector((state) => state.auth);
    const isCitizen = userInfo?.role === "user" && localStorage.getItem("userToken");

    const [sos, setSos] = useState(null);
    const [closedMessage, setClosedMessage] = useState("");
    const [type, setType] = useState("medical");
    const [message, setMessage] = useState("");
    const [starting, setStarting] = useState(false);
    const [lastPoint, setLastPoint] = useState(null);

    const watchIdRef = useRef(null);
    const latestRef = useRef(null);
    const sentAtRef = useRef(0);
    const wakeLockRef = useRef(null);

    const stopTracking = useCallback(() => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }

        wakeLockRef.current?.release?.().catch(() => {});
        wakeLockRef.current = null;
    }, []);

    const startTracking = useCallback(() => {
        if (watchIdRef.current !== null || !navigator.geolocation) return;

        watchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
                latestRef.current = toPayload(position);
                setLastPoint(latestRef.current);
            },
            () => toast.error(t("emergency.sos.locationLost")),
            { enableHighAccuracy: true, maximumAge: 5000 }
        );

        // Screen off bhaye browser le GPS rokcha, tyasaile screen on rakhne prayas
        navigator.wakeLock
            ?.request("screen")
            .then((lock) => {
                wakeLockRef.current = lock;
            })
            .catch(() => {});
    }, [t]);

    // Page refresh bhaye pachi pani chalirakheko SOS feri suru garne
    useEffect(() => {
        if (!isCitizen) return;

        apiRequest
            .get("/sos/my/active")
            .then(({ data }) => {
                if (data.sos) {
                    setSos(data.sos);
                    startTracking();
                }
            })
            .catch(() => {});

        return stopTracking;
    }, [isCitizen, startTracking, stopTracking]);

    // Har 10 second ma location pathaune (status pani yahi bata update huncha)
    useEffect(() => {
        if (!sos?._id) return;

        const timer = setInterval(async () => {
            const point = latestRef.current;

            if (!point || Date.now() - sentAtRef.current < SEND_INTERVAL_MS - 500) return;

            try {
                const { data } = await apiRequest.put(`/sos/${sos._id}/location`, point);
                sentAtRef.current = Date.now();

                setSos((prev) => {
                    if (prev?.status !== "responding" && data.sos.status === "responding") {
                        toast.success(t("emergency.sos.helpToast", { name: data.sos.responderName }));
                    }

                    return data.sos;
                });
            } catch (error) {
                // 404 = department le resolve garyo wa SOS band bhayo
                if (error.response?.status === 404) {
                    stopTracking();
                    setSos(null);
                    setClosedMessage(t("emergency.sos.closedByResponder"));
                }
            }
        }, SEND_INTERVAL_MS);

        return () => clearInterval(timer);
    }, [sos?._id, stopTracking, t]);

    const handleStart = async () => {
        setStarting(true);
        setClosedMessage("");

        try {
            const position = await getPosition();
            const point = toPayload(position);

            latestRef.current = point;
            setLastPoint(point);

            const { data } = await apiRequest.post("/sos", {
                ...point,
                type,
                message: message.trim(),
            });

            sentAtRef.current = Date.now();
            setSos(data.sos);
            startTracking();

            // Responder le accept garda push notification aaos (page band bhae pani)
            registerPushToken().catch(() => {});

            toast.success(t("emergency.sos.sent"));
        } catch (error) {
            const geoErrors = {
                unsupported: t("emergency.sos.geoUnsupported"),
                permission: t("emergency.sos.geoPermission"),
            };

            toast.error(
                error.response?.data?.message ||
                    geoErrors[error.message] ||
                    t("emergency.sos.failed")
            );
        } finally {
            setStarting(false);
        }
    };

    const handleCancel = async () => {
        if (!window.confirm(t("emergency.sos.stopConfirm"))) return;

        try {
            await apiRequest.put(`/sos/${sos._id}/cancel`);
        } catch {
            // Server ma pahile nai band bhaeko huna sakcha
        }

        stopTracking();
        setSos(null);
        setClosedMessage(t("emergency.sos.stopped"));
    };

    const mapsLink = lastPoint
        ? `https://www.google.com/maps?q=${lastPoint.latitude},${lastPoint.longitude}`
        : "";

    const shareText = lastPoint
        ? t("emergency.sos.shareText", { link: mapsLink })
        : "";

    const copyLocation = async () => {
        try {
            await navigator.clipboard.writeText(shareText);
            toast.success(t("emergency.sos.copied"));
        } catch {
            toast.error(t("emergency.sos.copyFailed"));
        }
    };

    const shareLocation = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: t("emergency.sos.shareTitle"), text: shareText });
            } catch {
                // User le cancel garyo
            }
        } else {
            copyLocation();
        }
    };

    const isResponding = sos?.status === "responding";

    return (
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#1e2a38] to-[#10151c] p-8 text-white shadow-xl lg:col-span-2">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#d9a441]/10" />

            <div className="relative">
                <span className="text-sm font-semibold uppercase tracking-widest text-[#d9a441]">
                    {t("emergency.sos.label")}
                </span>

                {/* ===== Not logged in ===== */}
                {!isCitizen && (
                    <>
                        <h3 className="mt-2 text-2xl font-bold">
                            {t("emergency.sos.guestTitle")}
                        </h3>

                        <p className="mt-2 max-w-xl text-slate-400">
                            {t("emergency.sos.guestText")}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            {userInfo?.role !== "admin" && (
                                <Link
                                    to="/login"
                                    className="rounded-xl bg-[#d9a441] px-6 py-3 font-semibold text-[#10151c] transition hover:bg-[#c8932f]"
                                >
                                    {t("emergency.sos.loginToUse")}
                                </Link>
                            )}

                            <a
                                href="tel:100"
                                className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold transition hover:bg-red-700"
                            >
                                <FaPhoneAlt />
                                {t("emergency.sos.call100")}
                            </a>
                        </div>
                    </>
                )}

                {/* ===== Ready to send ===== */}
                {isCitizen && !sos && (
                    <>
                        <h3 className="mt-2 text-2xl font-bold">
                            {t("emergency.sos.readyTitle")}
                        </h3>

                        <p className="mt-2 max-w-xl text-slate-400">
                            {t("emergency.sos.readyText")}
                        </p>

                        {closedMessage && (
                            <p className="mt-4 flex items-center gap-2 rounded-xl bg-green-500/10 px-4 py-3 text-sm text-green-300">
                                <FaCheckCircle />
                                {closedMessage}
                            </p>
                        )}

                        <div className="mt-6 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
                            <button
                                onClick={handleStart}
                                disabled={starting}
                                className="mx-auto flex h-32 w-32 flex-col items-center justify-center rounded-full bg-red-600 font-bold shadow-[0_0_0_10px_rgba(220,38,38,0.2)] transition hover:bg-red-700 disabled:opacity-60"
                            >
                                <MdSos className="text-6xl" />
                                <span className="text-xs">
                                    {starting ? t("emergency.sos.sending") : t("emergency.sos.tapToSend")}
                                </span>
                            </button>

                            <div className="space-y-3">
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#d9a441]"
                                >
                                    {SOS_TYPES.map((value) => (
                                        <option key={value} value={value} className="text-black">
                                            {t(`emergency.sos.types.${value}`)}
                                        </option>
                                    ))}
                                </select>

                                <input
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    maxLength={200}
                                    placeholder={t("emergency.sos.messagePlaceholder")}
                                    className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-[#d9a441]"
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* ===== SOS running ===== */}
                {isCitizen && sos && (
                    <>
                        <div className="mt-3 flex items-center gap-3">
                            <span className="relative flex h-3 w-3">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                                <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600" />
                            </span>

                            <h3 className="text-2xl font-bold">
                                {t("emergency.sos.sharingTitle")}
                            </h3>
                        </div>

                        {isResponding ? (
                            <p className="mt-4 flex items-center gap-2 rounded-xl bg-green-500/15 px-4 py-3 text-green-300">
                                <FaCheckCircle className="shrink-0" />
                                <span>
                                    <b>{t("emergency.sos.helpOnWay")}</b>{" "}
                                    {t("emergency.sos.isResponding", { name: sos.responderName })}
                                </span>
                            </p>
                        ) : (
                            <p className="mt-4 flex items-center gap-2 rounded-xl bg-[#d9a441]/15 px-4 py-3 text-[#f0c66b]">
                                <FaExclamationCircle className="shrink-0" />
                                {t("emergency.sos.waiting")}
                            </p>
                        )}

                        <p className="mt-3 text-xs text-slate-400">
                            {t("emergency.sos.keepOpen")}
                            {lastPoint?.accuracy && ` ${t("emergency.sos.accuracy", { meters: Math.round(lastPoint.accuracy) })}`}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-3">
                            <a
                                href="tel:100"
                                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 font-semibold transition hover:bg-red-700"
                            >
                                <FaPhoneAlt />
                                {t("emergency.sos.call100")}
                            </a>

                            {lastPoint && (
                                <>
                                    <button
                                        onClick={shareLocation}
                                        className="flex items-center gap-2 rounded-xl bg-[#d9a441] px-5 py-2.5 font-semibold text-[#10151c] transition hover:bg-[#c8932f]"
                                    >
                                        <FaShareAlt />
                                        {t("emergency.sos.share")}
                                    </button>

                                    <button
                                        onClick={copyLocation}
                                        className="flex items-center gap-2 rounded-xl border border-white/40 px-5 py-2.5 transition hover:bg-white hover:text-[#10151c]"
                                    >
                                        <FaCopy />
                                        {t("emergency.sos.copy")}
                                    </button>

                                    <a
                                        href={mapsLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 rounded-xl border border-white/40 px-5 py-2.5 transition hover:bg-white hover:text-[#10151c]"
                                    >
                                        <FaMapMarkedAlt />
                                        {t("emergency.sos.maps")}
                                    </a>
                                </>
                            )}

                            <button
                                onClick={handleCancel}
                                className="ml-auto rounded-xl border border-white/20 px-5 py-2.5 text-sm text-slate-300 transition hover:bg-white/10"
                            >
                                {t("emergency.sos.stop")}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SosPanel;
