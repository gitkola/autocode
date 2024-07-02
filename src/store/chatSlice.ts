import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  activeService: "openai" | "anthropic";
}

const initialState: ChatState = {
  activeService: "openai",
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveService: (
      state,
      action: PayloadAction<"openai" | "anthropic">,
    ) => {
      state.activeService = action.payload;
    },
  },
});

export const { setActiveService } = chatSlice.actions;

export default chatSlice.reducer;
