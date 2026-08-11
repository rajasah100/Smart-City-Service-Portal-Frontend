import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Initial State
const initialState = {
  complaints: [], // User complaints
  myComplaints: [],
  departmentComplaints: [], // Department complaints
  allComplaints: [], // Admin complaints
  trackedComplaint: null,
  complaint: null,
  loading: false,
  updateLoading: false,
  error: null,
};

// Create Complaint
export const createComplaint = createAsyncThunk(
  "complaint/createComplaint",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/complaints`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data.complaint;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Complaint submission failed",
      );
    }
  },
);

// Get My Complaints
export const getMyComplaints = createAsyncThunk(
  "complaint/getMyComplaints",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/complaints/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch complaints",
      );
    }
  },
);

// Get All Complaints (Admin)
export const getAllComplaints = createAsyncThunk(
  "complaint/getAllComplaints",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/complaints`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch complaints",
      );
    }
  },
);

// Get Department Complaints
export const getDepartmentComplaints = createAsyncThunk(
  "complaint/getDepartmentComplaints",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("departmentToken");

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/complaints/department`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data.complaints;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fatch complaints",
      );
    }
  },
);

// Update Complaint Status (Department)
export const updateComplaintStatus = createAsyncThunk(
  "complaint/updateComplaintStatus",
  async ({ id, status, resolutionNote }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("departmentToken");

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/complaints/${id}/status`,
        { status, resolutionNote },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data.complaint;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update complaint",
      );
    }
  },
);

// Track Complaint
export const trackComplaint = createAsyncThunk(
  "complaint/trackComplaint",
  async (complaintId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/complaints/track/${complaintId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data.complaint; // <-- IMPORTANT
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to track complaint",
      );
    }
  },
);

// Delete complaint
export const deleteComplaint = createAsyncThunk(
  "complaint/deleteComplaint",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");

      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/complaints/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Delete failed");
    }
  },
);

// Slice
const complaintSlice = createSlice({
  name: "complaint",
  initialState,

  reducers: {
    clearComplaint: (state) => {
      state.complaint = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Create complaint
      .addCase(createComplaint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComplaint.fulfilled, (state, action) => {
        state.loading = false;
        state.complaint = action.payload;
      })
      .addCase(createComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // My Complaints
      .addCase(getMyComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.myComplaints = action.payload;
      })
      .addCase(getMyComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // Admin Complaints
      .addCase(getAllComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.allComplaints = action.payload;
      })
      .addCase(getAllComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // Department Complaints
      .addCase(getDepartmentComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDepartmentComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.departmentComplaints = action.payload;
      })
      .addCase(getDepartmentComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // Update Complaint Status (Department)
      .addCase(updateComplaintStatus.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })

      .addCase(updateComplaintStatus.fulfilled, (state, action) => {
        state.updateLoading = false;

        state.myComplaints = state.myComplaints.map((item) =>
          item._id === action.payload._id ? action.payload : item,
        );

        state.departmentComplaints = state.departmentComplaints.map((item) =>
          item._id === action.payload._id ? action.payload : item,
        );

        state.allComplaints = state.allComplaints.map((item) =>
          item._id === action.payload._id ? action.payload : item,
        );

        state.complaint = action.payload;
      })
      .addCase(updateComplaintStatus.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload?.message || action.payload;
      })

      // Track Complaint
      .addCase(trackComplaint.pending, (state) => {
        state.loading = true;
      })

      .addCase(trackComplaint.fulfilled, (state, action) => {
        state.loading = false;
        state.complaint = action.payload;
      })

      .addCase(trackComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete complaint
      .addCase(deleteComplaint.fulfilled, (state, action) => {
        state.allComplaints = state.allComplaints.filter(
          (complaint) => complaint._id !== action.payload.id,
        );
      });
  },
});

export const { clearComplaint } = complaintSlice.actions;

export default complaintSlice.reducer;
