const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { resetCursorId } = require("./reset");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, "renderer.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("index.html");
}

app.whenReady().then(createWindow);

// Handle the reset process when invoked from the renderer
ipcMain.handle("perform-reset", async () => {
  try {
    await resetCursorId(); // Call the exported reset function
    return "Reset successful";
  } catch (error) {
    console.error("Error during reset:", error);
    throw error;
  }
});

// Close app when "Finish" is clicked
ipcMain.on("close-app", () => {
  app.quit();
});
