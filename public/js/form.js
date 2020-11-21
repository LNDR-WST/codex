/* Datei, um JS-Funktionen für Login- & Registrierungsformular auszulagern */


/* Registrierung: Button zeigen, wenn Nutzungsbedingungen akzeptiert */
/* modifiziert von: https://www.w3schools.com/howto/howto_js_toggle_hide_show.asp */

function showButton() {
    var button = document.getElementById("bHidden");
    if (button.style.display === "none") {
      button.style.display = "flex";
    }
}

/* Registrierung: Button verstecken, wenn Nutzungsbedingungen nicht akzeptiert */
/* modifiziert von: https://www.w3schools.com/howto/howto_js_toggle_hide_show.asp */

function hideButton() {
   var button = document.getElementById("bHidden");
    if (button.style.display === "flex") {
      button.style.display = "none";
    }
}

/* Versenden des Formulars 


/* Formularfehleingaben sofort abfangen */
/* Code-Inspiration von https://www.mediaevent.de/javascript/formulare.html */

// Überprüft, ob die Emailadresse ein valides Format hat
function checkMail() {
    var email = document.getElementById("email");
    if (email.value.match(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/)) {
        email.setAttribute('style','border:solid; border-color:#33cc33');
        document.querySelector('.msg.email').setAttribute('style','display:none');
    } else {
        email.setAttribute('style','border:solid; border-color:red');
        document.querySelector('.msg.email').setAttribute('style','display:block');
    }
}

// Überprüft, ob der Benutzername zulässig und noch frei ist
// Funktioniert beim besten Willen noch nicht. Wie bekomme ich übergeben, ob die Datenbank bereits einen Usernamen enthält?
// 'rows.length' funktioniert nur innerhalb der db.all-Funktion; returned erhält man nur ein Datenbank-Objekt
/*

    - - PLATZHALTER - - 

*/


// Überprüft, ob die Passwortanforderungen erfüllt sind
function checkPass() {
    var password1 = document.getElementByID("password1");
    if (password1.length > 7) {
        password1.setAttribute('style','border:solid; border-color:#33cc33');
        document.querySelector('.msg.password1').setAttribute('style','display:none');
    } else {
        password1.setAttribute('style','border:solid; border-color:red');
        document.querySelector('.msg.password1').setAttribute('style','display:block');
    }
}

// Überprüft, ob beide Passwortfelder identisch sind
function checkMatch() {
    var password1 = document.getElementById("password1");
    var password2 = document.getElementById("password2");
    if (password2.value == password1.value) {
        password2.setAttribute('style','border:solid; border-color:#33cc33')
        document.querySelector('.msg.password2').setAttribute('style','display:none');
    } else {
        password2.setAttribute('style','border:solid; border-color:red')
        document.querySelector('.msg.password2').setAttribute('style','display:block');
    }
}