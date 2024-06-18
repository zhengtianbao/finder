import { app, BrowserWindow } from 'electron'

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
    },
  });
  mainWindow.loadFile('dist/index.html');
});

// for mac os
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// for windows and linux
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
