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

INSERT INTO allusers (time, email, loginname, password ,role ,favorites ,status) 
VALUES (datetime('now'),'admin@admin.de' , 'admin','$2b$10$1qd0/8ogWCeGYGle2.sw7.rr851zjo7HgDIMSi.0Eq7pMin8xEF4.','admin','/admin',1);

