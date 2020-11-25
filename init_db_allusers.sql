/*Tabele erzeugen*/
CREATE TABLE allusers(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    time TEXT NOT NULL,
    email TEXT NOT NULL,
    loginname TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    favorites TEXT NOT NULL,
    status INTEGER NOT NULL
);