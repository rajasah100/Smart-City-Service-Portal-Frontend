import { useEffect, useState } from "react"


const InstallPWAButton = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener("beforeInstallPrompt", handler);

        return () => {
            window.removeEventListener("beforeInstallPrompt", handler);
        };
    }, []);

    const installApp = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log("App Installed");
        }

        setDeferredPrompt(null);
    }

    if (!deferredPrompt) return null;

    return (
        <button
            onClick={installApp}
            className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow-lg z-50"
        >
            📲 Install App
        </button>
    )
}

export default InstallPWAButton
