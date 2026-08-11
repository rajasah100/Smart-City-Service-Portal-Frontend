import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Retrieve Department
let departmentFromStorage = null;

try {
  const storedDepartment = localStorage.getItem("departmentInfo");

  if (storedDepartment && storedDepartment !== "undefined") {
    departmentFromStorage = JSON.parse(storedDepartment);
  }
} catch (error) {
  console.error("Invalid department storage:", error);
  localStorage.removeItem("departmentInfo");
}

// Department Login
export const loginDepartment = createAsyncThunk(
  "department/loginDepartment",
  async (departmentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/departments/login`,
        departmentData,
      );

      localStorage.setItem("departmentToken", response.data.token);
      localStorage.setItem(
        "departmentInfo",
        JSON.stringify(response.data.department),
      );

      return response.data.department;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Department login failde");
    }
  },
);

// Get Department Profile
export const getDepartmentProfile = createAsyncThunk(
  "department/getDepartmentProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("departmentToken");

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/departments/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch profile");
    }
  },
);

// Get All Departments
export const getDepartments = createAsyncThunk(
  "department/getDepartments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/departments`,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch departments",
      );
    }
  },
);

// Register Department (Admin)
export const registerDepartment = createAsyncThunk(
  "department/registerDepartment",
  async (departmentData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/departments/register`,
        departmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data.department;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Department registration failed",
      );
    }
  },
);

// Update department (Admin)
export const updateDepartment = createAsyncThunk(
  "department/updateDepartment",
  async ({ id, departmentData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");

      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/departments/${id}`,
        departmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return data.department;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update department",
      );
    }
  },
);

// Delete Department (Admin)
export const deleteDepartment = createAsyncThunk(
  "department/deleteDepartment",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");

      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/departments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete department",
      );
    }
  },
);

// Logout Department
export const logoutDepartmentAsync = createAsyncThunk(
  "department/logoutDepartment",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("departmentToken");

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/departments/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Logout failed");
    }
  },
);

// Initial State
const initialState = {
  departments: [],
  department: departmentFromStorage,
  loading: false,
  error: null,
};

// Slice
const departmentSlice = createSlice({
  name: "department",
  initialState,

  reducers: {
    logoutDepartment: (state) => {
      state.department = null;

      localStorage.removeItem("departmentInfo");
      localStorage.removeItem("departmentToken");
    },
  },

  extraReducers: (builder) => {
    builder

      // Login
      .addCase(loginDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.department = action.payload;

        localStorage.setItem("departmentInfo", JSON.stringify(action.payload));
      })
      .addCase(loginDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Department login failed";
      })

      // Profile
      .addCase(getDepartmentProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDepartmentProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.department = action.payload;

        localStorage.setItem("departmentInfo", JSON.stringify(action.payload));
      })
      .addCase(getDepartmentProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fatch profile";
      })

      // Department List
      .addCase(getDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload.departments;
      })
      .addCase(getDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fatch departments";
      })

      // Register Department
      .addCase(registerDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.departments.push(action.payload);
      })
      .addCase(registerDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Department registration failed";
      })

      // Logout Department
      .addCase(logoutDepartmentAsync.fulfilled, (state) => {
        state.department = null;
        state.error = null;

        localStorage.removeItem("departmentToken");
        localStorage.removeItem("departmentInfo");
      })

      // Update Department (Admin)
      .addCase(updateDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.loading = false;

        state.departments = state.departments.map((dept) =>
          dept._id === action.payload._id ? action.payload : dept,
        );
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // Delete Deparment (Admin)
      .addCase(deleteDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.loading = false;

        state.departments = state.departments.filter(
          (dept) => dept._id !== action.payload,
        );
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export const { logoutDepartment } = departmentSlice.actions;
export default departmentSlice.reducer;
