import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiRequest from "../../utils/apiRequest";

// Get All Events
export const getEvents = createAsyncThunk(
  "event/getEvents",
  async (_, thunkAPI) => {
    try {
      const response = await apiRequest.get("/events");

      return response.data.events;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch events.",
      );
    }
  },
);

// Get Single event
export const getEventById = createAsyncThunk(
  "event/getEventById",
  async (id, thunkAPI) => {
    try {
      const response = await apiRequest.get(`/events/${id}`);

      return response.data.event;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch event.",
      );
    }
  },
);

// Create Event
export const createEvent = createAsyncThunk(
  "event/createEvent",
  async (formData, thunkAPI) => {
    try {
      const response = await apiRequest.post("/events", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create event.",
      );
    }
  },
);

// Get All Event Registrations (Admin)
export const getAllRegistrations = createAsyncThunk(
  "event/getAllRegistrations",
  async (_, thunkAPI) => {
    try {
      const response = await apiRequest.get("/event-registrations");

      return response.data.registrations;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch registrations.",
      );
    }
  },
);

// Check Registration
export const checkRegistration = createAsyncThunk(
  "event/checkRegistration",
  async (id, thunkAPI) => {
    try {
      const response = await apiRequest.get(`/events/${id}/check`);

      return response.data.isRegistered;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to check registration.",
      );
    }
  },
);

// Register Event
export const registerEvent = createAsyncThunk(
  "event/registerEvent",
  async ({ id, phone }, thunkAPI) => {
    try {
      const response = await apiRequest.post(
        `/event-registrations/${id}/register`,
        { phone },
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to register event.",
      );
    }
  },
);

// Get Event Registrations (Admin)
export const getEventRegistrations = createAsyncThunk(
  "event/getEventRegistrations",
  async (id, thunkAPI) => {
    try {
      const response = await apiRequest.get(`/event-registrations/${id}`);

      return response.data.registrations;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch registrations.",
      );
    }
  },
);

// Cancel Event
export const cancelEvent = createAsyncThunk(
  "event/cancelEvent",
  async (id, thunkAPI) => {
    try {
      const response = await apiRequest.put(`/events/${id}`, {
        isCancelled: true,
      });

      return response.data.event;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to cancel event.",
      );
    }
  },
);

// Update Event
export const updateEvent = createAsyncThunk(
  "event/updateEvent",
  async ({ id, formData }, thunkAPI) => {
    try {
      const response = await apiRequest.put(`/events/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update event.",
      );
    }
  },
);

// Delete Event
export const deleteEvent = createAsyncThunk(
  "event/deleteEvent",
  async (id, thunkAPI) => {
    try {
      await apiRequest.delete(`/events/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete event.",
      );
    }
  },
);

// Initial State
const initialState = {
  events: [],
  event: null,

  isRegistered: false,

  loading: false,
  error: null,

  registration: null,
  registerLoading: false,
  registerError: null,

  registrations: [],
  registrationLoading: false,
};

const eventSlice = createSlice({
  name: "event",
  initialState,

  reducers: {
    clearEvent: (state) => {
      state.event = null;
    },

    clearRegistration: (state) => {
      state.registration = null;
      state.registerError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Get Events
      .addCase(getEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch events";
      })

      // Get Event By ID
      .addCase(getEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.event = action.payload;
      })
      .addCase(getEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch event";
      })

      // Create Event
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.unshift(action.payload.event);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create event";
      })

      // Register Event
      .addCase(registerEvent.pending, (state) => {
        state.registerLoading = true;
        state.registerError = null;
      })

      .addCase(registerEvent.fulfilled, (state, action) => {
        state.registerLoading = false;
        state.registration = action.payload.registration;
        
        state.isRegistered = true;

        if (state.event) {
          state.event.currentParticipants +=
            action.payload.registration.participants || 1;
        }
      })
      .addCase(registerEvent.rejected, (state, action) => {
        state.registerLoading = false;
        state.registerError =
          action.payload?.message || "Failed to register event";
      })

      // Cancel Event
      .addCase(cancelEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(cancelEvent.fulfilled, (state, action) => {
        state.loading = false;

        state.events = state.events.map((event) =>
          event._id === action.payload._id ? action.payload : event,
        );

        if (state.event) {
          state.event = action.payload;
        }
      })

      .addCase(cancelEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to cancel event";
      })

      // Update Event
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;

        state.events = state.events.map((event) =>
          event._id === action.payload.event._id ? action.payload.event : event,
        );

        state.event = action.payload.event;
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update event";
      })

      // Get All Registrations
      .addCase(getAllRegistrations.pending, (state) => {
        state.registrationLoading = true;
        state.error = null;
      })

      .addCase(getAllRegistrations.fulfilled, (state, action) => {
        state.registrationLoading = false;
        state.registrations = action.payload;
      })

      .addCase(getAllRegistrations.rejected, (state, action) => {
        state.registrationLoading = false;
        state.error =
          action.payload?.message || "Failed to fetch registrations";
      })

      // Get Event Registrations
      .addCase(getEventRegistrations.pending, (state) => {
        state.registrationLoading = true;
        state.error = null;
      })

      .addCase(getEventRegistrations.fulfilled, (state, action) => {
        state.registrationLoading = false;
        state.registrations = action.payload;
      })

      .addCase(getEventRegistrations.rejected, (state, action) => {
        state.registrationLoading = false;
        state.error =
          action.payload?.message || "Failed to fetch registrations";
      })

      // Delete Event
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;

        state.events = state.events.filter(
          (event) => event._id !== action.payload,
        );
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete event";
      })

      // Check Registration
      .addCase(checkRegistration.fulfilled, (state, action) => {
        state.isRegistered = action.payload;
      });
  },
});

export const { clearEvent, clearRegistration } = eventSlice.actions;

export default eventSlice.reducer;
