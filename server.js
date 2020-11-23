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
app.use(express.static(__dirname + "/lib"));
app.use(express.static(__dirname + "/mode"));
app.use(express.static(__dirname + "/theme"));
app.use(express.static(__dirname + "/addon"));

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
        codedb.all(`SELECT id, code FROM allcode WHERE loginname ='${sessionValueName}'`,
                function(err,rows)
                {
                    const param_idAndUsercode = rows;
                    const paramsNeeded = {username: sessionValueName, codelist: param_idAndUsercode};
                    res.render("profile", paramsNeeded);
                })
    }
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
                db.run(
                    `INSERT INTO allusers(email,loginname, password) VALUES('${param_email}','${param_loginname}', '${hash}')`,
                function(err)
                {
                    // Hier verlinkung zur Seite bei erfolgreicher Registrierung 
                    res.sendFile(__dirname + "/views/index.html");
                });
            }
            else
                {
                    // Hier verlinkung zur Seite bei nicht erfolgreicher Registrierung 
                    res.sendFile(__dirname + "/views/welcome.html");
                }
        });
    });

    // Login
    app.post('/login', function(req,res)
{
    const param_loginname = req.body.loginname;
    const param_password = req.body.password;
    // login name wird benutzt für sessionValue
    const param_sessionValue = req.body.loginname;
    req.session.sessionValue = param_sessionValue;
    db.all(`SELECT password FROM allusers WHERE loginname ='${param_loginname}'`,
    function(err,rows)
    {
        if (rows.length==1)
        {
            const hash = rows[0].password;
            const isValid = bcrypt.compareSync(param_password, hash);
            if (isValid==true)
            {
                codedb.all(`SELECT id, code FROM allcode WHERE loginname ='${param_loginname}'`,
                function(err,rows)
                {
                    const param_idAndUsercode = rows;
                    const paramsNeeded = {username: param_loginname, codelist: param_idAndUsercode};
                    res.render("profile", paramsNeeded);
                })

            }
            else
            {
                res.redirect("/login");  // Hier verlinkung bei nicht erfolgreichem Login [passwort falsch]
            };
        }
        else{
            res.redirect("/login");   // Hier verlinkung bei nicht erfolgreichem Login [User existiert nicht]
        }
    });
});

// Code-Snippet löschen
app.post('/onDeleteCode/:i', function(req, res) {
    const id = req.params['i'];
    const sql = `DELETE FROM allcode WHERE id=${id}`;
    console.log(sql);
    codedb.run(sql, function(err) {
        res.redirect('/profile');
    });
});