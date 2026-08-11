import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Get All Notices
export const getNotices = createAsyncThunk(
  "notice/fetchNotices",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/notices`,
        { params },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fatch notices");
    }
  },
);

// Get Single Notice
export const getNoticeById = createAsyncThunk(
  "notice/getNoticeById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/notices/${id}`,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch notice");
    }
  },
);

// Create Notice
export const createNotice = createAsyncThunk(
  "notice/createNotice",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("departmentToken");

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/notices`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create notice");
    }
  },
);

// Update Notice
export const updateNotice = createAsyncThunk(
  "notice/updateNotice",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("departmentToken");

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/notices/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update notice");
    }
  },
);

// New Arrivals
export const getNewArrivals = createAsyncThunk(
  "notice/getNewArrivals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/notices/new-arrivals`,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch latest notices",
      );
    }
  },
);

//Delete Notice
export const deleteNotice = createAsyncThunk(
  "notice/deleteNotice",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("departmentToken");

      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/notices/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete notice");
    }
  },
);

// Get each department
export const getDepartmentNotices = createAsyncThunk(
  "notice/getDepartmentNotices",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("departmentToken");

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/notices/department/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data.notices;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch department notices",
      );
    }
  },
);

// Get all notices (Admin)
export const getAllNotices = createAsyncThunk(
  "notice/getAllNotices",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/notices/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data.notices;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch notices");
    }
  },
);

// Initial State
const initialState = {
  notices: [],
  newArrivals: [],
  notice: null,
  departmentNotices: [],

  loading: false,
  error: null,
};

// Slice
const noticeSlice = createSlice({
  name: "notice",
  initialState,

  reducers: {
    clearNotice: (state) => {
      state.notice = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Get Notices
      .addCase(getNotices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotices.fulfilled, (state, action) => {
        state.loading = false;
        state.notices = action.payload;
      })
      .addCase(getNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch notices";
      })

      // Get Notice By ID
      .addCase(getNoticeById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNoticeById.fulfilled, (state, action) => {
        state.loading = false;
        state.notice = action.payload;
      })
      .addCase(getNoticeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch notice";
      })

      // Create Notice
      .addCase(createNotice.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNotice.fulfilled, (state, action) => {
        state.loading = false;

        state.notices.unshift(action.payload.notice);
        state.departmentNotices.unshift(action.payload.notice);
      })
      .addCase(createNotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create notice";
      })

      // Update Notice
      .addCase(updateNotice.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateNotice.fulfilled, (state, action) => {
        state.loading = false;

        state.notices = state.notices.map((notice) =>
          notice._id === action.payload._id ? action.payload : notice,
        );

        state.departmentNotices = state.departmentNotices.map((notice) =>
          notice._id === action.payload._id ? action.payload : notice,
        );
      })

      .addCase(updateNotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update notice";
      })

      // Delete Notice
      .addCase(deleteNotice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNotice.fulfilled, (state, action) => {
        state.loading = false;

        state.notices = state.notices.filter(
          (notice) => notice._id !== action.payload,
        );

        state.departmentNotices = state.departmentNotices.filter(
          (notice) => notice._id !== action.payload,
        );
      })
      .addCase(deleteNotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete notice";
      })

      // New Arrivals
      .addCase(getNewArrivals.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNewArrivals.fulfilled, (state, action) => {
        state.loading = false;
        state.newArrivals = action.payload;
      })
      .addCase(getNewArrivals.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch latest notices";
      })

      // get each department
      .addCase(getDepartmentNotices.pending, (state) => {
        state.loading = true;
      })

      .addCase(getDepartmentNotices.fulfilled, (state, action) => {
        state.loading = false;
        state.departmentNotices = action.payload;
      })

      .addCase(getDepartmentNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // Get all notices (Admin)
      .addCase(getAllNotices.pending, (state) => {
        state.loading = true;
      })

      .addCase(getAllNotices.fulfilled, (state, action) => {
        state.loading = false;
        state.notices = action.payload;
      })

      .addCase(getAllNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export const { clearNotice } = noticeSlice.actions;

export default noticeSlice.reducer;
