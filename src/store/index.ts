import { configureStore, Middleware } from "@reduxjs/toolkit";
import settingsReducer from "./settingsSlice";
import chatReducer from "./chatSlice";
import projectsReducer from "./projectsSlice";

// Define the middleware first
const persistSettingsMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();

  // Persist settings to local storage whenever they change
  localStorage.setItem("autoCodeSettings", JSON.stringify(state.settings));

  return result;
};

// Create the store
const store = configureStore({
  reducer: {
    settings: settingsReducer,
    chat: chatReducer,
    projects: projectsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistSettingsMiddleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
