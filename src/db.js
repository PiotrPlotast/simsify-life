import sqlite3 from "sqlite3";
const db = new sqlite3.Database("db.sqlite", (err) => {
  if (err) {
    console.error("Error opening database", err);
  } else {
    console.log("Database opened successfully");
  }
});
db.run(
  "CREATE TABLE IF NOT EXISTS skills (id INTEGER PRIMARY KEY, name TEXT, icon TEXT, time INTEGER)",
  (err) => {
    if (err) {
      console.error("Error creating table", err);
    } else {
      console.log("Table skills created successfully");
    }
  }
);
db.run(
  "CREATE TABLE IF NOT EXISTS dashboard_data (id INTEGER PRIMARY KEY, total_skills INTEGER, time_today INTEGER, total_time INTEGER)",
  (err) => {
    if (err) {
      console.error("Error creating table", err);
    } else {
      console.log("Table dashboard_data created successfully");
      db.run(
        "INSERT INTO dashboard_data (total_skills, time_today, total_time) VALUES (0, 0, 0)",
        (err) => {
          if (err) {
            console.error("Error inserting initial data", err);
          } else {
            console.log(
              "Initial data inserted into dashboard_data successfully"
            );
          }
        }
      );
    }
  }
);
export default db;
