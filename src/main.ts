import { app, BrowserWindow, ipcMain, dialog } from "electron";
import * as fs from "fs/promises";
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
    win.loadURL("http://localhost:9000");
    win.webContents.openDevTools();
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, "../renderer/index.html"),
        protocol: "file:",
        slashes: true,
      }),
    );
  }

  // Handle refresh by reloading the current URL
  win.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription, validatedURL) => {
      if (errorCode === -6) {
        // ERR_FILE_NOT_FOUND
        win.loadURL(validatedURL);
      }
    },
  );
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

// Add this new handler
ipcMain.handle("get-user-data-path", () => {
  return app.getPath("userData");
});

ipcMain.handle("create-directory", async (_, dirPath: string) => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    return { success: true };
  } catch (error) {
    console.error("Error creating directory:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});

ipcMain.handle("select-folder", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory", "createDirectory"],
  });

  if (result.canceled) {
    return { canceled: true };
  } else {
    return { canceled: false, filePath: result.filePaths[0] };
  }
});

ipcMain.handle("write-file", async (_, filePath: string, data: string) => {
  try {
    await fs.writeFile(filePath, data);
    return { success: true };
  } catch (error) {
    console.error("Error writing file:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});

ipcMain.handle("read-file", async (_, filePath: string) => {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return { success: true, data: content };
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return { success: false, error: "File not found", code: "ENOENT" };
    }
    console.error("Error reading file:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});
