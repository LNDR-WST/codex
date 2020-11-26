/*
###############################################
####       Initialisierung Extensions      ####
###############################################
*/

// Initialisierung von Express, Body-Parser, EJS, sqlite Datenbank, bcrypt, cookie-parser, express-session
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.engine("ejs", require("ejs").__express);
app.set("view engine", "ejs");

const DATABASE = "users.db"; // hier wird Datenbank Name festgelegt
const CODEBASE = "code.db";
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(DATABASE);
const codedb = new sqlite3.Database(CODEBASE);


const bcrypt = require("bcrypt");

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const session = require('express-session');
app.use(session({
    secret: 'thisisoursecretsessioncode',
    saveUninitialized: false,
    resave:false
}));

/*
###############################################
####              Server-Start             ####
###############################################
*/
app.listen(3000, function()
{
    console.log("listening in port 3000");
});

/*
###############################################
####            Ordner-Freigaben           ####
###############################################
*/
// Freigabe Public
app.use(express.static(__dirname + "/public"));

// Freigabe der Ordner für CodeMirror-Editor
app.use('/editCode', express.static(__dirname + "/lib"));
app.use('/editCode', express.static(__dirname + "/mode"));
app.use('/editCode', express.static(__dirname + "/theme"));
app.use('/editCode', express.static(__dirname + "/addon"));

/*
###############################################
####              GET-Requests             ####
###############################################
*/
app.get("/index", function(req,res)
{
    res.sendFile(__dirname + "/views/index.html");
});

app.get("/welcome", function(req, res)
{
    res.render("welcome", {session: req.session.sessionValue});
});

app.get("/register", function(req, res)
{
    res.sendFile(__dirname + "/views/register.html");
});

app.get("/registration-complete", function(req, res)
{
    res.sendFile(__dirname + "/views/reg-success.html");
});



/* Login-Seite wird nur aufgerufen, wenn keine Session aktiv ist.
   ansonsten wird direkt aufs Profil umgeleitet. */
app.get("/login", function(req, res)
{
    console.log(req.session);
    if (!req.session.sessionValue) {
        res.sendFile(__dirname + "/views/login.html");
    } else {
        res.redirect("/profile");
    }
});

app.get("/logout", function(req, res)
{
    req.session.destroy(); // Session wird gelöscht
    res.sendFile(__dirname + "/views/logout.html");
});

// Profil-Aufruf ist geschützt: Nur bei gesetzter sessionValue (Username) ist Aufruf möglich!
app.get("/profile", function(req, res)
{
    console.log(req.session);
    if (!req.session.sessionValue) {
        res.redirect("/login");
    } else {
        const sessionValueName = req.session.sessionValue;
        codedb.all(`SELECT id, headline, description, code, edited FROM ${sessionValueName}`,
                function(err,rows)
                {
                    const param_userCodeInfo = rows;
                    res.render("profile", {username: sessionValueName, codelist: param_userCodeInfo});
                })
    }
});

// Editier-Ansicht für Code-Snippets
app.get("/edit", function(req, res)
{
    if (!req.session.sessionValue) {
        res.redirect("/login");
    } else {
        res.render("edit-snippet", {snippetId: null, snippetCode: null, snippetHead: null, snippetDesc: null, timestamp: null});
    } 
});

// Favoriten-Seite
app.get("/favorites", function(req, res)
{
    if (!req.session.sessionValue) {
        res.redirect("/login");
    } else {
        res.render("favorites") // ToDo: hier ggf. zusätzliche Parameter übergeben: {param_x: x, param_y: y, param_z: z});
    }
    
});

// Benutzerübersicht/-verwaltung
app.get("/userlist", function(req, res)
{
    if (!req.session.sessionValue) {
        res.redirect("/login");
    } 
    else if(req.session.sessionValue == "admin")
    {
        db.all(
            `SELECT * FROM allusers`,
            function(err, rows){
                res.render("adminpanel", {"allusers": rows});
            } 
        );
    }
    else {
        db.all(
            `SELECT * FROM allusers WHERE role = "user"`,
            function(err, rows){
                res.render("userlist", {"allusers": rows});
            } 
        );
    }
    
});
// Settings-Seite
app.get("/settings", function(req, res)
{
    if (!req.session.sessionValue) {
        res.redirect("/login");
    } else {
        res.render("settings") // ToDo: hier ggf. zusätzliche Parameter übergeben: {param_x: x, param_y: y, param_z: z});
    }
});
// Impressum-Seite
app.get("/impressum", function(req, res)
{
    res.render("impressum", {session: req.session.sessionValue});
});

/*
###############################################
####             POST-Requests             ####
###############################################
*/

// Registrierung
app.post('/newUser', function(req,res)
    {
        const param_email = req.body.email;
        const param_loginname = req.body.loginname;
        const param_password1 = req.body.password1;
        const param_password2 = req.body.password2;
        //hier wird gechecked ob die Email "plausibel" ist.
        const check = param_email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    
        db.all(`SELECT * FROM allusers WHERE loginname='${param_loginname}'`,
        function (err, rows)
        {// Test ob User bereits existiert und ob Passwort wiederholung korrekt und Passwort mehr als 7 zeichen hat
            if (rows.length == 0 && param_password1 == param_password2 &&  check != null && param_password1.length > 7)  
            {
                const hash = bcrypt.hashSync(param_password1,10);
                sql = 
                `CREATE TABLE '${param_loginname}'(
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    headline TEXT NOT NULL,
                    description TEXT NOT NULL,
                    code BLOB NOT NULL,
                    loginname TEXT NOT NULL,
                    format TEXT NOT NULL,
                    edited TEXT NOT NULL
                    )`
                codedb.run(sql,
                    function(err)
                    {
                        db.run(
                            `INSERT INTO allusers(time, email, loginname, password, role, favorites, status) VALUES(datetime('now'),'${param_email}','${param_loginname}', '${hash}','user','/${param_loginname}',1)`, 
                        function(err)
                        {
                            // Redirect bei erfolgreicher Registrierung 
                            res.redirect("/registration-complete");
                        });
                    });
            }
            else
                {
                    // Hier verlinkung zur Seite bei nicht erfolgreicher Registrierung 
                    res.send("Registrierung fehlgeschlagen.");
                }
        });
    });

// Login
app.post('/login', function(req,res)
{
    const param_loginname = req.body.loginname;
    const param_password = req.body.password;
    db.all(`SELECT password FROM allusers WHERE loginname ='${param_loginname}'`,
    function(err,rows)
    {
        if (rows.length==1)
        {
            const hash = rows[0].password;
            const isValid = bcrypt.compareSync(param_password, hash);
            if (isValid==true)
            {
                req.session.sessionValue = param_loginname;
                codedb.all(`SELECT id, headline, description, code, edited FROM allcode WHERE loginname ='${param_loginname}'`,
                function(err,rows)
                {
                    const param_userCodeInfo = rows;
                    res.render("profile", {username: param_loginname, codelist: param_userCodeInfo});
                })

            }
            else
            {
                res.send("Passwort falsch");  // Hier verlinkung bei nicht erfolgreichem Login [passwort falsch]
            };
        }
        else{
            res.send("Benutzername existiert nicht");   // Hier verlinkung bei nicht erfolgreichem Login [User existiert nicht]
        }
    });
});

// Code-Snippet löschen
app.post('/onDeleteCode/:id', function(req, res) {
    const id = req.params['id'];
    const param_loginname = req.session.sessionValue
    const sql = `DELETE FROM '${param_loginname}'  WHERE id=${id}`;
    console.log(sql);
    codedb.run(sql, function(err) {
        res.redirect('/profile');
    });
});

// Code-Snippet hinzufügen
app.post('/addCode', function(req,res)
{
    const param_loginname = req.session.sessionValue
    const sql = 
    `INSERT INTO '${param_loginname}' (headline, description, code, loginname, format, edited) 
    VALUES ('Überschrift','Kurze Beschreibung deines Codes','Dein Code','${param_loginname}','javascript', datetime('now'))`;
    codedb.run(sql, function(err)
    {
        res.redirect('/profile');
    })
})

// Code-Snippet ändern
app.post('/onChangeCode/', function(req, res) {
    const id = req.body.id;
    const head = req.body.head;
    const desc = req.body.desc;
    const code = req.body.code;
    const timestamp = req.body.edited;
    const param_loginname = req.session.sessionValue
    const sql = `UPDATE '${param_loginname}' SET code='${code}', headline='${head}', description='${desc}', edited='${timestamp}' WHERE id=${id}`;
    console.log(sql);
    codedb.run(sql, function(err) {
        console.log("Code-Snippet geändert"); // Message zum Debugging
        res.redirect(`/profile#code-heading${id}`); // Springt direkt zum geänderten Element
    });
});

// Edit-Page von Code-Snippet aufrufen
app.post('/editCode/', function(req, res) {
    const param_id = req.body.id;
    const param_head = req.body.headline;
    const param_desc = req.body.description;
    const param_code = req.body.code;
    const param_timestamp = req.body.timestamp;
    res.render('edit-snippet', {snippetCode: `${param_code}`, snippetId: param_id, snippetHead: param_head, snippetDesc: param_desc, timestamp: param_timestamp});
});

// User löschen
app.post("/delete/:id", function(req,res)
{
    db.run(
        `DELETE FROM allusers WHERE id=${req.params.id}`,
        function(err)
        {
            res.redirect("/userlist");
        }
    );
});
// User bearbeiten
app.post("/update/:id", function(req,res)
{
    db.all(
        `SELECT * FROM allusers WHERE id = ${req.params.id}`,
        function(err,rows)
        {
        res.render("userupdate", rows[0]);
        }
    );
});
// Userdaten speichern
app.post("/onupdate/:id", function(req,res)
{
    const id = req.params.id;
    const loginname = req.body.loginname;
    const password = req.body.password;
    const email = req.body.email;
    const favorites = req.body.favorites;
    const status = req.body.status;

console.log(id);
    db.run(
        `UPDATE allusers SET loginname = "${loginname}",password = "${password}",email = "${email}",favorites = "${favorites}",status = "${status}" WHERE id = ${id}`,
        function(err)
        {
            res.redirect("/userlist");
        }
    );
});