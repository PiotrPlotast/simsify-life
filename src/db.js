import sqlite3 from "sqlite3";
const db = new sqlite3.Database("db.sqlite", (err) => {
  if (err) {
    console.error("Error opening database", err);
  }
});
db.run(
  "CREATE TABLE IF NOT EXISTS skills (id INTEGER PRIMARY KEY, name TEXT, icon TEXT, time INTEGER)",
  (err) => {
    if (err) {
      console.error("Error creating table", err);
    }
  }
);
db.run(
  "CREATE TABLE IF NOT EXISTS dashboard_data (id INTEGER PRIMARY KEY, total_skills INTEGER, time_today INTEGER, total_time INTEGER)",
  (err) => {
    if (err) {
      console.error("Error creating table", err);
    } else {
      db.run(
        "INSERT INTO dashboard_data (total_skills, time_today, total_time) VALUES (0, 0, 0)",
        (err) => {
          if (err) {
            console.error("Error inserting initial data", err);
          }
        }
      );
    }
  }
);
db.run(
  "CREATE TABLE IF NOT EXISTS user_preferences (id INTEGER PRIMARY KEY, notifications INTEGER, dark_mode INTEGER)",
  (err) => {
    if (err) {
      console.error("Error creating table", err);
    } else {
      db.run(
        "INSERT INTO user_preferences (id INTEGER PRIMARY KEY, notifications INTEGER, dark_mode INTEGER) VALUES (0, 1, 0)",
        (err) => {
          if (err) {
            console.error("Error inserting initial data", err);
          }
        }
      );
    }
  }
);
export default db;
