import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import aiService from "../../utils/aiService";

let nextId = 1;

// Sandesh pathaune: pending ma user ko sandesh thapincha, history ma tyo bhanda agadi ka matra
export const sendAIMessage = createAsyncThunk(
  "ai/sendMessage",
  async ({ message, language }, { getState, rejectWithValue }) => {
    const history = getState()
      .ai.messages.slice(0, -1)
      .filter((m) => !m.errorCode && m.text)
      .slice(-10)
      .map((m) => ({ role: m.role, content: m.text }));

    try {
      return await aiService.sendAIMessage({ message, history, language });
    } catch (error) {
      const status = error.response?.status;
      const code = error.response?.data?.code || (status === 429 ? "RATE_LIMIT" : status === 503 ? "AI_UNAVAILABLE" : "GENERIC");
      return rejectWithValue(code);
    }
  },
);

const initialState = {
  // { id, role: "user" | "assistant", text, at, actions?, errorCode? }
  messages: [],
  loading: false,
  // AI le banaeko gunaso ko draft: ComplaintPage le form ma bharchha
  complaintData: null,
};

const aiSlice = createSlice({
  name: "ai",
  initialState,

  reducers: {
    clearChat: (state) => {
      state.messages = [];
      state.loading = false;
    },

    setComplaintData: (state, action) => {
      state.complaintData = action.payload;
    },

    clearComplaintData: (state) => {
      state.complaintData = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(sendAIMessage.pending, (state, action) => {
        state.loading = true;
        state.messages.push({ id: nextId++, role: "user", text: action.meta.arg.message, at: Date.now() });
      })

      .addCase(sendAIMessage.fulfilled, (state, action) => {
        state.loading = false;
        const reply = action.payload.reply || {};
        state.messages.push({
          id: nextId++,
          role: "assistant",
          at: Date.now(),
          text: reply.text || "",
          actions: reply.actions || [],
          ...(reply.text || reply.actions?.length ? {} : { errorCode: "GENERIC" }),
        });
      })

      .addCase(sendAIMessage.rejected, (state, action) => {
        state.loading = false;
        state.messages.push({ id: nextId++, role: "assistant", text: "", at: Date.now(), errorCode: action.payload || "GENERIC" });
      });
  },
});

export const { clearChat, setComplaintData, clearComplaintData } = aiSlice.actions;

export default aiSlice.reducer;
