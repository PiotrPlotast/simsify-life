import sqlite3 from "sqlite3";
console.log("Initializing database...");
const db = new sqlite3.Database("db.sqlite", (err) => {
  if (err) {
    console.error("Error opening database", err);
  } else {
    console.log("Database opened successfully");
  }
});
db.run(
  "CREATE TABLE IF NOT EXISTS skills (id INTEGER PRIMARY KEY, name TEXT, icon TEXT, level INTEGER, progress INTEGER)",
  (err) => {
    if (err) {
      console.error("Error creating table", err);
    } else {
      console.log("Table created successfully");
    }
  }
);
console.log("Database initialization script executed.");
export default db;
