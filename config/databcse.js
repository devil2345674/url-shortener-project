const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./urls.db", (err) => {

    if (err) {
        console.log(err.message);
    } else {
        console.log("SQLite Connected");
    }
});

db.run(`
CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    originalUrl TEXT,
    shortCode TEXT UNIQUE
)
`);

module.exports = db;