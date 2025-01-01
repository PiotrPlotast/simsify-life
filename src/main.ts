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
    maxHeight: 700,
    maxWidth: 1000,
    minWidth: 600,
    minHeight: 600,
    title: "Skill Time Tracker",
    titleBarStyle: "hidden",
    ...(process.platform !== "darwin"
      ? {
          titleBarOverlay: {
            color: "#2f3241",
            symbolColor: "#74b1be",
            height: 30,
          },
        }
      : {}),
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
      "INSERT INTO skills (name, time, icon) VALUES (?, 0, ?)",
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

ipcMain.handle("skill-time", async (event, skillNames) => {
  if (!Array.isArray(skillNames)) {
    return Promise.reject(new TypeError("skillNames must be an array"));
  }

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION", (beginErr) => {
        if (beginErr) {
          if (
            beginErr.message.includes(
              "cannot start a transaction within a transaction"
            )
          ) {
            // If a transaction is already in progress, just update the skills
            const placeholders = skillNames.map(() => "?").join(",");
            db.run(
              `UPDATE skills SET time = time + 1 WHERE name IN (${placeholders})`,
              skillNames,
              (updateErr) => {
                if (updateErr) {
                  reject(updateErr);
                } else {
                  resolve(void 0);
                }
              }
            );
          } else {
            reject(beginErr);
          }
          return;
        }

        const placeholders = skillNames.map(() => "?").join(",");
        db.run(
          `UPDATE skills SET time = time + 1 WHERE name IN (${placeholders})`,
          skillNames,
          (updateErr) => {
            if (updateErr) {
              db.run("ROLLBACK", (rollbackErr) => {
                if (rollbackErr) {
                  console.error("Error rolling back transaction:", rollbackErr);
                }
                reject(updateErr);
              });
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
});

ipcMain.handle("get-total-time", async () => {
  return new Promise((resolve, reject) => {
    db.get("SELECT total_time FROM dashboard_data", [], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
});

ipcMain.handle("set-total-time", async (event, totalTime) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION", (beginErr) => {
        if (beginErr) {
          if (
            beginErr.message.includes(
              "cannot start a transaction within a transaction"
            )
          ) {
            // If a transaction is already in progress, just update the total_time
            db.run(
              "UPDATE dashboard_data SET total_time = ?",
              [totalTime],
              (updateErr) => {
                if (updateErr) {
                  reject(updateErr);
                } else {
                  resolve(void 0);
                }
              }
            );
          } else {
            reject(beginErr);
          }
          return;
        }

        db.run(
          "UPDATE dashboard_data SET total_time = ?",
          [totalTime],
          (updateErr) => {
            if (updateErr) {
              db.run("ROLLBACK", (rollbackErr) => {
                if (rollbackErr) {
                  console.error("Error rolling back transaction:", rollbackErr);
                }
                reject(updateErr);
              });
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
});

ipcMain.handle("get-dark-mode", async () => {
  return new Promise((resolve, reject) => {
    db.get("SELECT dark_mode FROM user_preferences", [], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
});

ipcMain.handle("set-dark-mode", async (event, darkMode) => {
  return new Promise((resolve, reject) => {
    db.run("UPDATE user_preferences SET dark_mode = ?", [darkMode], (err) => {
      if (err) {
        reject(err);
      } else {
        console.log("Dark mode set to", darkMode);
        resolve(void 0);
      }
    });
  });
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
