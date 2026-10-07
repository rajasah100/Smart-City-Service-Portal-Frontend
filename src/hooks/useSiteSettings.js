import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSettings } from "../redux/slices/settingSlice";

// Nagarpalika ko naam/logo/thegana. Pahilo patak matra API bata load garcha
const useSiteSettings = () => {
  const dispatch = useDispatch();
  const { settings, loaded } = useSelector((state) => state.setting);

  useEffect(() => {
    if (!loaded) {
      dispatch(getSettings());
    }
  }, [dispatch, loaded]);

  return settings;
};

export default useSiteSettings;
