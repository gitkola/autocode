import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as url from "url";

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.NODE_ENV === "development") {
    // Load the url of the dev server if in development mode
    win.loadURL("http://localhost:9000");
    // Open the DevTools.
    win.webContents.openDevTools();
  } else {
    // Load the index.html when not in development
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, "../renderer/index.html"),
        protocol: "file:",
        slashes: true,
      }),
    );
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
