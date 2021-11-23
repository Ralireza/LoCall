// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const path = require("path");
const { startServers } = require("./server/server.js");

async function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    // show: false,
    autoHideMenuBar: true,
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // mainWindow.maximize();
  // mainWindow.show();

  app.on(
    "certificate-error",
    (event, webContents, url, error, certificate, callback) => {
      // On certificate error we disable default behaviour (stop loading the page)
      // and we then say "it is all fine - true" to the callback
      event.preventDefault();
      callback(true);
    }
  );

  await startServers();

  const isProd = process.env.NODE_ENV === "prod";
  if (app.isPackaged || isProd) {
    mainWindow.loadURL("https://localhost:3000");
  } else {
    // you have to npm run start and start your dev server
    mainWindow.loadURL("http://localhost:8000");
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
