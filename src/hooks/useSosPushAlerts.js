import { useCallback } from "react";
import { toast } from "react-toastify";
import useFirebaseNotification from "./useFirebaseNotification";

// Department/Admin dashboard khulla huda SOS push aaye toast dekhaune
// (dashboard band huda browser/phone ko notification aafai dekhincha)
const useSosPushAlerts = ({ api, endpoint, method, storageKey, sosPath }) => {
  const onMessage = useCallback(
    (payload) => {
      if (payload?.data?.type !== "sos") return;

      toast.error(
        `${payload.notification?.title || "New SOS"}: ${payload.notification?.body || ""}`,
        {
          autoClose: false,
          onClick: () => {
            window.location.href = sosPath;
          },
        }
      );
    },
    [sosPath]
  );

  useFirebaseNotification({ api, endpoint, method, storageKey, onMessage });
};

export default useSosPushAlerts;
