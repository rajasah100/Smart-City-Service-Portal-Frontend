import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import departmentApiRequest from "../../utils/departmentApiRequest";

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

export const getDepartmentNotifications = createAsyncThunk(
  "departmentNotification/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await departmentApiRequest.get(
        "/department-notifications",
      );

      return data.notifications;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// Mark All Notifications as Read
export const markAllDepartmentNotificationsRead = createAsyncThunk(
  "departmentNotification/readAll",
  async (_, { rejectWithValue }) => {
    try {
      await departmentApiRequest.put("/department-notifications/read-all");

      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const departmentNotificationSlice = createSlice({
  name: "departmentNotification",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(getDepartmentNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDepartmentNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter((n) => !n.isRead).length;
      })
      .addCase(getDepartmentNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    //   Mark all notification as read
      .addCase(markAllDepartmentNotificationsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((item) => ({
          ...item,
          isRead: true,
        }));

        state.unreadCount = 0;
      });
  },
});

export default departmentNotificationSlice.reducer;
