// Initialisierung von Express , Body-Parser , EJS , sqlite Datenbank, bcrypt
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

// Server starten
app.listen(3000, function()
{
    console.log("listening in port 3000");
});

// public freigabe
app.use(express.static(__dirname + "/public"));

// Freigabe der Ordner für CodeMirror-Editor
app.use(express.static(__dirname + "/lib"));
app.use(express.static(__dirname + "/mode"));
app.use(express.static(__dirname + "/theme"));
app.use(express.static(__dirname + "/addon"));

// GET Requests
app.get("/index", function(req,res)
{
    res.sendFile(__dirname + "/views/index.html");
});

app.get("/welcome", function(req, res)
{
    res.sendFile(__dirname + "/views/welcome.html");
});

app.get("/register", function(req, res)
{
    res.sendFile(__dirname + "/views/register.html");
});

app.get("/login", function(req, res)
{
    res.sendFile(__dirname + "/views/login.html");
});

app.get("/logout", function(req, res)
{
    res.sendFile(__dirname + "/views/logout.html");
});
/*
app.get("/profile", function(req, res)
{
    res.render("profile", {username: req.body.loginname }); /* Username über Sessions/Cookie ziehen? */
//});

// POST Requests

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
    db.all(`SELECT password FROM allusers WHERE loginname ='${param_loginname}'`,
    function(err,rows)
    {
        if (rows.length==1)
        {
            const hash = rows[0].password;
            const isValid = bcrypt.compareSync(param_password, hash);
            if (isValid==true)
            {
                //res.redirect("/profile")   Hier Verlinkung bei erfolgreichem Login; ggf. mehr Parameter übergeben [tbd]

                codedb.all(`SELECT code FROM allcode WHERE loginname ='${param_loginname}'`,
                function(err,rows)
                {
                    const param_usercode = rows[0].code; // Hier später übergabe von Array mit Objekten anstelle von einzel String
                    res.render("profile", {username: param_loginname, usercode: param_usercode});  
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

