/*Tabele erzeugen*/
CREATE TABLE allcode(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    headline TEXT NOT NULL,
    description TEXT NOT NULL,
    code BLOB NOT NULL,
    loginname TEXT NOT NULL
);

INSERT INTO allcode (headline, description, code, loginname) VALUES ('Überschrift 0', 
'Dieser Code ist vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
'var imgWidth=285, imgHeight=233;
var xStart=Math.floor(imgWidth/2), yStart=Math.floor(imgHeight/2);
var x=xStart, y=yStart;

// CODE 0
function show() {
if(status==1) {
    document.getElementById("image").style.clip=
        "rect("+y+" "+(x+clipWidth)+" "+(y+clipHeight)+" "+x+")";

    x-=1;
    clipWidth+=2;
    y-=1;
    clipHeight+=2;',
    'admin');
