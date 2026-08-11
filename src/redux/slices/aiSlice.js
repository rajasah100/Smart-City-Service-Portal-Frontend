import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import aiService from "../../utils/aiService";

// Send Message to AI
export const sendAIMessage = createAsyncThunk(
  "ai/sendMessage",
  async (message, thunkAPI) => {
    try {
      return await aiService.sendAIMessage(message);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to get AI response.",
      );
    }
  },
);

const initialState = {
  messages: [
    {
      sender: "ai",
      text: "👋 Hello! I am your Smart City AI Assistant. How can I help you today?",
    },
  ],

  loading: false,
  error: null,
};

const aiSlice = createSlice({
  name: "ai",
  initialState,

  reducers: {
    // User message immediately add
    addUserMessage: (state, action) => {
      state.messages.push({
        sender: "user",
        text: action.payload,
      });
    },

    // AI message manually add (optional)
    addAIMessage: (state, action) => {
      state.messages.push({
        sender: "ai",
        ...(typeof action.payload === "string"
          ? { text: action.payload }
          : action.payload),
      });
    },

    // Clear only messages
    clearChat: (state) => {
      state.messages = [
        {
          sender: "ai",
          text: "👋 Hello! I am your Smart City AI Assistant. How can I help you today?",
        },
      ];

      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Send Message
      .addCase(sendAIMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(sendAIMessage.fulfilled, (state, action) => {
        state.loading = false;

        const reply = action.payload.reply;

        if (typeof reply === "string") {
          state.messages.push({
            sender: "ai",
            text: reply,
          });
        } else {
          state.messages.push({
            sender: "ai",
            text: reply.message,
            action: reply.action,
          });
        }
      })

      .addCase(sendAIMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

        state.messages.push({
          sender: "ai",
          text:
            action.payload || "Sorry, something went wrong. Please try again.",
        });
      });
  },
});

export const { addUserMessage, addAIMessage, clearChat } = aiSlice.actions;

export default aiSlice.reducer;
