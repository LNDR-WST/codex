/*Tabele erzeugen*/
CREATE TABLE allusers(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    loginname TEXT NOT NULL,
    password TEXT NOT NULL
);