// Initialisierung von Express , Body-Parser , EJS , sqlite Datenbank
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.engine("ejs", require("ejs").__express);
app.set("view engine", "ejs");

const DATABASE = "users.db"; // hier wird Datenbank Name festgelegt
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(DATABASE);

// Server starten
app.listen(3000, function(){
    console.log("listening in port 3000");
});

// public freigabe
app.use(express.static(__dirname + "/public"));

// GET Requests
app.get("/index", function(req,res){
    res.sendFile(__dirname + "/views/index.html");
});

app.get("/welcome", function(req, res) {
    res.sendFile(__dirname + "/views/welcome.html");
});