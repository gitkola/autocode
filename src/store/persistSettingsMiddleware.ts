import { Middleware } from "redux";
import isEqual from "lodash/isEqual";
import { LOCAL_STORAGE_KEY_SETTINGS } from "../constants";

export const persistSettingsMiddleware: Middleware =
  (store) => (next) => (action) => {
    const prevSettings = store.getState().settings;
    const result = next(action);
    const { settings } = store.getState();
    if (!isEqual(prevSettings, settings)) {
      localStorage.setItem(
        LOCAL_STORAGE_KEY_SETTINGS,
        JSON.stringify(settings)
      );
    }

    return result;
  };
