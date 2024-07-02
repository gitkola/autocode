// src/main.ts
import { app, BrowserWindow } from "electron";
import * as path from "path";

// Hot reloading
if (process.env.NODE_ENV !== "production") {
  // This condition ensures that the reloader is only used in development mode
  try {
    require("electron-reloader")(module);
  } catch (_) {
    console.log("Error");
  }
}

function createWindow(): void {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile(path.join(__dirname, "..", "src", "index.html"));

  // Open the DevTools in development mode
  if (process.env.NODE_ENV !== "production") {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
