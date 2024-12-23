import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import started from "electron-squirrel-startup";
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";
import db from "./db"; // Importing for side effects to initialize the database
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 600,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: true,
    },
  });
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }
  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log("An error occurred: ", err));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

const addReactDevTools = () => {
  app.whenReady().then(() => {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log("An error occurred: ", err));
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);
app.on("ready", addReactDevTools);
app.on("ready", () => console.log("db", db));

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle("get-skills", async () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM skills", [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

ipcMain.handle("add-skill", async (event, skillName, icon) => {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO skills (name, progress, level, icon) VALUES (?, 0, 1, ?)",
      [skillName, icon],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(void 0);
        }
      }
    );
  });
});

ipcMain.handle("lvl-up", async (event, skillName) => {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE skills SET level = level + 1, progress = 0 WHERE name = ?",
      [skillName],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(void 0);
        }
      }
    );
  });
});

ipcMain.handle("progress", async (event, skillName) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");
      db.run(
        "UPDATE skills SET progress = progress + (2 / level) WHERE name = ?",
        [skillName],
        (err) => {
          if (err) {
            db.run("ROLLBACK");
            reject(err);
          } else {
            db.run("COMMIT", (commitErr) => {
              if (commitErr) {
                reject(commitErr);
              } else {
                resolve(void 0);
              }
            });
          }
        }
      );
    });
  });
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
