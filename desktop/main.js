const { app, BrowserWindow, shell } = require("electron");

/**
 * Business OS desktop shell.
 *
 * The product itself stays on the server — this is a dedicated window for it,
 * not a copy of it. Point it somewhere else (staging, localhost) with
 * BUSINESS_OS_URL without rebuilding.
 */
const APP_URL =
  process.env.BUSINESS_OS_URL ||
  "https://business-os-ruddy.vercel.app/dashboard";
const APP_ORIGIN = new URL(APP_URL).origin;

/** True for anything that isn't our own app (Google, mailto, docs…). */
function isExternal(url) {
  try {
    return new URL(url).origin !== APP_ORIGIN;
  } catch {
    // Not a normal http(s) URL (mailto:, etc.) — hand it to the OS.
    return true;
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 900,
    minHeight: 600,
    // Matches the app's background so launching never flashes white.
    backgroundColor: "#090909",
    title: "Business OS",
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // Wait for the first paint instead of showing an empty frame.
  win.once("ready-to-show", () => win.show());
  win.loadURL(APP_URL);

  // Keep the window on the app. Everything else opens in the real browser,
  // where the user has their passwords and extensions.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (isExternal(url)) {
      void shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  win.webContents.on("will-navigate", (event, url) => {
    if (isExternal(url)) {
      event.preventDefault();
      void shell.openExternal(url);
    }
  });

  return win;
}

// A second launch should focus the existing window rather than open another.
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", () => {
    const [win] = BrowserWindow.getAllWindows();
    if (!win) return;
    if (win.isMinimized()) win.restore();
    win.focus();
  });

  app.whenReady().then(() => {
    createWindow();
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
}
