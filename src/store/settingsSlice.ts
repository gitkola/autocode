import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LOCAL_STORAGE_KEY_SETTINGS } from "../constants";

interface SettingsState {
  general: {
    theme: "light" | "dark" | "system";
    codeAutoSave: boolean;
  };
  openai: {
    apiKey: string;
    model: string;
    temperature: number;
  };
  anthropic: {
    apiKey: string;
    model: string;
    maxTokens: number;
  };
}

const defaultInitialState: SettingsState = {
  general: {
    theme: "system",
    codeAutoSave: false,
  },
  openai: {
    apiKey: "",
    model: "gpt-3.5-turbo",
    temperature: 0.7,
  },
  anthropic: {
    apiKey: "",
    model: "claude-2",
    maxTokens: 1000,
  },
};

const loadInitialState = (): SettingsState => {
  const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
  if (savedSettings) {
    return JSON.parse(savedSettings);
  }
  return defaultInitialState;
};

const settingsSlice = createSlice({
  name: "settings",
  initialState: loadInitialState(),
  reducers: {
    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.general.theme = action.payload;
    },
    setCodeAutoSave: (state, action: PayloadAction<boolean>) => {
      state.general.codeAutoSave = action.payload;
    },
    setOpenAISettings: (
      state,
      action: PayloadAction<Partial<SettingsState["openai"]>>
    ) => {
      state.openai = { ...state.openai, ...action.payload };
    },
    setAnthropicSettings: (
      state,
      action: PayloadAction<Partial<SettingsState["anthropic"]>>
    ) => {
      state.anthropic = { ...state.anthropic, ...action.payload };
    },
  },
});

export const {
  setTheme,
  setCodeAutoSave,
  setOpenAISettings,
  setAnthropicSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
