import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ================= Initial State =================
const initialState = {
  services: [],
  nearbyServices: [],
  service: null,
  loading: false,
  error: null,
};

// ================= Get All Emergency Services =================
export const getEmergencyServices = createAsyncThunk(
  "emergencyService/getEmergencyServices",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/emergency-services`,
        {
          params,
        },
      );

      return response.data.services;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch emergency services",
      );
    }
  },
);

// ================= Get Nearby Emergency Services =================
export const getNearbyServices = createAsyncThunk(
  "emergencyService/getNearbyServices",
  async ({ lat, lng, distance = 5000 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/emergency-services/nearby`,
        {
          params: {
            lat,
            lng,
            distance,
          },
        },
      );

      return response.data.services;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch nearby services",
      );
    }
  },
);

// ================= Get Single Emergency Service =================
export const getEmergencyServiceById = createAsyncThunk(
  "emergencyService/getEmergencyServiceById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/emergency-services/${id}`,
      );

      return response.data.service;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch emergency service",
      );
    }
  },
);

// ================= Create Emergency Service =================
export const createEmergencyService = createAsyncThunk(
  "emergencyService/createEmergencyService",
  async (serviceData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/emergency-services`,
        serviceData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data.service;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create emergency service",
      );
    }
  },
);

// ================= Update Emergency Service =================
export const updateEmergencyService = createAsyncThunk(
  "emergencyService/updateEmergencyService",
  async ({ id, serviceData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/emergency-services/${id}`,
        serviceData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data.service;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update emergency service",
      );
    }
  },
);

// ================= Delete Emergency Service =================
export const deleteEmergencyService = createAsyncThunk(
  "emergencyService/deleteEmergencyService",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");

      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/emergency-services/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete emergency service",
      );
    }
  },
);

// ================= Slice =================
const emergencyServiceSlice = createSlice({
  name: "emergencyService",
  initialState,

  reducers: {
    clearService: (state) => {
      state.service = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= Get All Services =================
      .addCase(getEmergencyServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmergencyServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(getEmergencyServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // ================= Get Nearby Services =================
      .addCase(getNearbyServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNearbyServices.fulfilled, (state, action) => {
        state.loading = false;
        state.nearbyServices = action.payload;
      })
      .addCase(getNearbyServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // ================= Get Single Service =================
      .addCase(getEmergencyServiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmergencyServiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.service = action.payload;
      })
      .addCase(getEmergencyServiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // ================= Create Service =================
      .addCase(createEmergencyService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmergencyService.fulfilled, (state, action) => {
        state.loading = false;
        state.services.unshift(action.payload);
      })
      .addCase(createEmergencyService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // ================= Update Service =================
      .addCase(updateEmergencyService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmergencyService.fulfilled, (state, action) => {
        state.loading = false;

        state.services = state.services.map((service) =>
          service._id === action.payload._id ? action.payload : service,
        );

        state.nearbyServices = state.nearbyServices.map((service) =>
          service._id === action.payload._id ? action.payload : service,
        );

        state.service = action.payload;
      })
      .addCase(updateEmergencyService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // ================= Delete Service =================
      .addCase(deleteEmergencyService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmergencyService.fulfilled, (state, action) => {
        state.loading = false;

        state.services = state.services.filter(
          (service) => service._id !== action.payload.id,
        );

        state.nearbyServices = state.nearbyServices.filter(
          (service) => service._id !== action.payload.id,
        );

        if (state.service?._id === action.payload.id) {
          state.service = null;
        }
      })
      .addCase(deleteEmergencyService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export const { clearService } = emergencyServiceSlice.actions;

export default emergencyServiceSlice.reducer;
