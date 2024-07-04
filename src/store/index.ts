import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./settingsSlice";
import chatReducer from "./chatSlice";
import projectsReducer from "./projectsSlice";
import { persistSettingsMiddleware } from "./persistSettingsMiddleware";

const store = configureStore({
  reducer: {
    settings: settingsReducer,
    chat: chatReducer,
    projects: projectsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistSettingsMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
