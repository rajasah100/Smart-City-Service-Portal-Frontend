import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiRequest from "../../utils/apiRequest";

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

// Get Notifications
export const getNotifications = createAsyncThunk(
  "notification/getNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiRequest.get("/notifications");

      return data.notifications;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// Mark One Notification Read
export const markAsRead = createAsyncThunk(
  "notification/markAsRead",
  async (id, { rejectWithValue }) => {
    try {
      await apiRequest.put(`/notifications/${id}/read`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// Mark All Read
export const markAllRead = createAsyncThunk(
  "notification/markAllRead",
  async (_, { rejectWithValue }) => {
    try {
      await apiRequest.put("/notifications/read-all");
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// Delete Notification
export const deleteNotification = createAsyncThunk(
  "notification/deleteNotification",
  async (id, { rejectWithValue }) => {
    try {
      await apiRequest.delete(`/notifications/${id}`);

      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // Get Notifications
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;

        state.notifications = action.payload || [];

        state.unreadCount = state.notifications.filter((n) => !n.isRead).length;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        ((state.loading = false), (state.error = action.payload));
      })

      // Mark One Road
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(
          (n) => n._id === action.payload,
        );

        if (notification) {
          notification.isRead = true;
        }

        state.unreadCount = state.notifications.filter((n) => !n.isRead).length;
      })

      // Mark All Read
      .addCase(markAllRead.fulfilled, (state) => {
        state.notifications.forEach((n) => {
          n.isRead = true;
        });

        state.unreadCount = 0;
      })

      // Delete
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          (n) => n._id !== action.payload,
        );

        state.unreadCount = state.notifications.filter((n) => !n.isRead).length;
      });
  },
});

export default notificationSlice.reducer;
