import { Middleware } from "redux";
import { RootState } from "../store";

export const persistSettingsMiddleware: Middleware<{}, RootState> =
  (store) => (next) => (action) => {
    const result = next(action);
    const state = store.getState();

    // Persist settings to local storage whenever they change
    localStorage.setItem("autoCodeSettings", JSON.stringify(state.settings));

    return result;
  };
