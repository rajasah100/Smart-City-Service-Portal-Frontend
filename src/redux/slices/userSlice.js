import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiRequest from "../../utils/apiRequest";

const API = import.meta.env.VITE_BACKEND_URL;

// GET ALL USERS

export const getUsers = createAsyncThunk(
  "user/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");

      const { data } = await axios.get(`${API}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data.users;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  },
);

// DELETE USER
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");

      await axios.delete(`${API}/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

// SAVE FCM TOKEN
export const saveFcmToken = createAsyncThunk(
  "user/saveFcmToken",
  async (fcmToken, { rejectWithValue }) => {
    try {
      const { data } = await apiRequest.put("/users/fcm-token", {
        fcmToken,
      });

      return data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

// INITIAL STATE

const initialState = {
  users: [],
  loading: false,
  error: null,
};

// SLICE

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // GET USERS
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
      })

      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })

      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE USER

      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user._id !== action.payload);
      })

      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // SAVE FCM TOKEN
      .addCase(saveFcmToken.pending, (state) => {
        state.loading = true;
      })

      .addCase(saveFcmToken.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(saveFcmToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
