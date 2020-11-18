// Initialisierung von Express , Body-Parser , EJS , sqlite Datenbank, bcrypt
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.engine("ejs", require("ejs").__express);
app.set("view engine", "ejs");

const DATABASE = "users.db"; // hier wird Datenbank Name festgelegt
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(DATABASE);

const bcrypt = require("bcrypt");

// Server starten
app.listen(3000, function()
{
    console.log("listening in port 3000");
});

// public freigabe
app.use(express.static(__dirname + "/public"));

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

app.get("/profile", function(req, res)
{
    res.sendFile(__dirname + "/views/profile.html");
});

// POST Requests

// Registrierung
app.post('/newUser', function(req,res)
    {
        const param_email = req.body.email;
        const param_loginname = req.body.loginname;
        const param_password1 = req.body.password1;
        const param_password2 = req.body.password2;
        //hier brauchen wir eventuell noch einen Check ob die eingegebene Email "plausibel" ist.
        db.all(`SELECT * FROM allusers WHERE loginname='${param_loginname}'`,
        function (err, rows)
        {
            if (rows.length == 0 && param_password1 == param_password2)  // Test ob User bereits existiert und ob Passwort wiederholung korrekt
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
                res.sendFile(__dirname + "/views/profile.html");    // Hier verlinkung bei erfolgreichem Login
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