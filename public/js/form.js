/* JS-Funktionen für Login- & Registrierungsformular */
/* JS-Funktion um POST-Requests über Javascript abzuwickeln */


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

  
/* Profil: Save-Button anzeigen, wenn Änderungen gemacht wurden. */
/* modifiziert von: https://www.w3schools.com/howto/howto_js_toggle_hide_show.asp */
  function showButtonSave(id) {
    var button = document.getElementById(`bHidden${id}`);
    if (button.style.display === "none") {
      button.style.display = "flex";
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


// Dynamisch <input>-Felder für ein Formular zum Submit erstellen
// Quelle: https://stackoverflow.com/questions/133925/javascript-post-request-like-a-form-submit
 /**
 * sends a request to the specified url from a form. this will change the window location.
 * @param {string} path the path to send the post request to
 * @param {object} params the paramiters to add to the url
 * @param {string} [method=post] the method to use on the form
 */

function post(path, params, method='post') {

  // The rest of this code assumes you are not using a library.
  // It can be made less wordy if you use one.
  const form = document.createElement('form');
  form.method = method;
  form.action = path;

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = key;
      hiddenField.value = params[key];

      form.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form);
  form.submit();
}

// Jetzigen Zeitpunkt erhalten YYYY-MM-DD HH:MM:SS

  // Mini-Funktion, um 0 darzustellen, falls Zeitangabe < 10 
  function displayZero(time) {
    if (time < 10) {
      time = "0" + time;
    }
    return time;
  }

  function timeStamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = displayZero(now.getMonth()+1);
    const day = displayZero(now.getDate());
    const hours = displayZero(now.getHours());
    const minutes = displayZero(now.getMinutes());
    const seconds = displayZero(now.getSeconds());
    const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return timestamp;
  }