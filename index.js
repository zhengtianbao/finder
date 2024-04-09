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
