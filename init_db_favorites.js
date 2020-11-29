/* Zur Initialisierung: Favoriten-Tabelle für jeden vorhandenen User erzeugen */
// Funktioniert noch nicht richtig...

const DATABASE = "code.db";
const sqlite3 = require("sqlite3").verbose();
const codedb = new sqlite3.Database(DATABASE);

function createFavTable(username) {
    sql = `CREATE TABLE ${username}(id INTEGER PRIMARY KEY AUTOINCREMENT, favid INTEGER);`
}

codedb.all(`SELECT * FROM allusers'`, function (err, rows) { 
    for (let i = 0; i < rows; i++) {
        createFavTable(rows[i].loginname);
        console.log("Created table " + rows[i].loginname)
    }
});