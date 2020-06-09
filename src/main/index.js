/**
 * Main electron process.
 * In charge of spinning the renderer and background processes.
 */
const { app, BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");

const IS_DEV_BUILD = false;

// GLOBALS
global.rendererWindow = null;
global.backgroundWindow = null;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

let backgroundWindow, rendererWindow;

const startApp = () => {
  backgroundWindow = createBackgroundWindow();
  global.backgroundWindow = backgroundWindow;

  rendererWindow = createRendererWindow();
  global.rendererWindow = rendererWindow;

  setupGoogleAnalytics();
};

function createRendererWindow() {
  const devSettings = {
    width: 1060,
    height: 1080,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      backgroundThrottling: false,
    },
  };

  const prodSettings = {
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      backgroundThrottling: false,
    },
  };

  let window = new BrowserWindow(isDev ? devSettings : prodSettings);

  // Load index.html from webpack entry path
  window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Close background window on close
  window.on("closed", () => {
    if (backgroundWindow) backgroundWindow.close();
  });

  if (isDev || IS_DEV_BUILD) {
    window.setPosition(1200, 0);

    // Add react dev tools https://www.electronjs.org/docs/tutorial/devtools-extension
    const path = require("path");
    const os = require("os");
    const reactExtension = BrowserWindow.addDevToolsExtension(
      path.join(
        os.homedir(),
        "/.config/google-chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.7.0_0"
      )
    );
    // BrowserWindow.removeDevToolsExtension(reactExtension);

    // Add redux dev tools https://stackoverflow.com/questions/59538654/electron-add-redux-devtools
    const reduxExtension = BrowserWindow.addDevToolsExtension(
      path.join(
        os.homedir(),
        "/.config/google-chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0"
      )
    );
    // BrowserWindow.removeDevToolsExtension(reduxExtension);

    // Open the DevTools.
    window.webContents.openDevTools();

    return window;
  }

  // Remove menu
  window.removeMenu();

  return window;
}

function createBackgroundWindow() {
  const devSettings = {
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      nodeIntegrationInWorker: true,
      preload: HIDDEN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      backgroundThrottling: false,
    },
  };

  const prodSettings = {
    show: IS_DEV_BUILD,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      nodeIntegrationInWorker: true,
      preload: HIDDEN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      backgroundThrottling: false,
    },
  };

  let window = new BrowserWindow(isDev ? devSettings : prodSettings);

  window.loadURL(HIDDEN_WINDOW_WEBPACK_ENTRY);
  // TODO: bug: webgl not working in linux when nodeIntegration enabled
  // window.loadURL("https://get.webgl.org/webgl2/");

  if (isDev || IS_DEV_BUILD) {
    // Open the DevTools.
    window.webContents.openDevTools();
  }

  // Reset reference on close
  window.on("closed", () => {
    backgroundWindow = null;
  });

  // hiddenWindow.hide();

  return window;
}

const setupGoogleAnalytics = () => {
  // Setup Google Analytics. Triggers events only in non-dev envs
  const { trackEvent } = require("./analytics");
  global.trackEvent = trackEvent;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", startApp);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    startApp();
  }
});