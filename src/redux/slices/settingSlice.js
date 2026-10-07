import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiRequest from "../../utils/apiRequest";

// API aauna dhilo bhae wa offline huda pani header khali nadekhiyos
export const DEFAULT_SETTINGS = {
  nameNe: "स्मार्ट सिटी सेवा पोर्टल",
  nameEn: "Smart City Service Portal",
  officeNe: "डिजिटल नागरिक सेवा प्लेटफर्म",
  officeEn: "Digital Citizen Service Platform",
  addressNe: "भक्तपुर-३, बागमती प्रदेश, नेपाल",
  addressEn: "Bhaktapur-3, Bagmati Province, Nepal",
  phone: "",
  email: "",
  hotline: "100",
  officeHoursNe: "आइतबार - शुक्रबार, बिहान ९:०० - बेलुका ५:००",
  officeHoursEn: "Sunday - Friday, 9:00 AM - 5:00 PM",
  introNe: "स्मार्ट सिटी सेवा पोर्टल नागरिकलाई छिटो, पारदर्शी र जवाफदेही सेवा दिन बनाइएको डिजिटल प्लेटफर्म हो। यस पोर्टलमार्फत नागरिकले घरबाटै गुनासो दर्ता गर्न, सूचना र कार्यक्रम हेर्न तथा आपतकालीन अवस्थामा तुरुन्त सहायता माग्न सक्नुहुन्छ।",
  introEn: "Smart City Service Portal is a digital platform built for fast, transparent and accountable public service. Through this portal, citizens can file complaints from home, read notices and events, and ask for help immediately in an emergency.",
  facebook: "",
  youtube: "",
  instagram: "",
  tiktok: "",
  logo: { url: "", publicId: "" },
};

export const getSettings = createAsyncThunk(
  "setting/getSettings",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiRequest.get("/settings");
      return data.settings;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to load settings");
    }
  },
  {
    // Header, footer duitai le ekai patak magda duichoti request napathaune
    condition: (_, { getState }) => {
      const { loading, loaded } = getState().setting;
      return !loading && !loaded;
    },
  },
);

// formData: FormData (logo file sahit)
export const updateSettings = createAsyncThunk(
  "setting/updateSettings",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await apiRequest.put("/settings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.settings;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update settings");
    }
  },
);

const settingSlice = createSlice({
  name: "setting",
  initialState: {
    settings: DEFAULT_SETTINGS,
    loading: false,
    loaded: false,
    saving: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSettings.fulfilled, (state, action) => {
        state.settings = { ...DEFAULT_SETTINGS, ...action.payload };
        state.loading = false;
        state.loaded = true;
      })
      .addCase(getSettings.rejected, (state) => {
        state.loading = false;
        state.loaded = true;
      })
      .addCase(updateSettings.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.saving = false;
        state.settings = { ...DEFAULT_SETTINGS, ...action.payload };
      })
      .addCase(updateSettings.rejected, (state) => {
        state.saving = false;
      });
  },
});

export default settingSlice.reducer;
