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

/* Formularfehleingaben sofort abfangen */
/* Code-Inspiration von https://www.mediaevent.de/javascript/formulare.html */

// Prüft, ob Email ein valdies Dateiformat hat
  function checkEmail() {
      var email = document.getElementById("email");
      if (email.value.match(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/)) {
          email.setAttribute('style','border:solid; border-color:#33cc33');
          document.querySelector('.error-msg.email').setAttribute('style','display:none');
      } else {
          email.setAttribute('style','border:solid; border-color:red');
          document.querySelector('.error-msg.email').setAttribute('style','display:block');
      }
  }

// Prüft, ob Passwort lang genug ist.
  function checkPass() {
      var password1 = document.getElementById("password1");
      if ((password1.value.length) > 7) {
          password1.setAttribute('style','border:solid; border-color:#33cc33');
          document.querySelector('.error-msg.password1').setAttribute('style','display:none');
      } else {
          password1.setAttribute('style','border:solid; border-color:red');
          document.querySelector('.error-msg.password1').setAttribute('style','display:block');
      }
  }

// Prüft, ob Passwort-Wdh mit Passwort übereinstimmt
  function checkMatch() {
      var password1 = document.getElementById("password1");
      var password2 = document.getElementById("password2");
      if (password1.value == password2.value) {
          password2.setAttribute('style','border:solid; border-color:#33cc33');
          document.querySelector('.error-msg.password2').setAttribute('style','display:none');
      } else {
          password2.setAttribute('style','border:solid; border-color:red');
          document.querySelector('.error-msg.password2').setAttribute('style','display:block');
      }
  }