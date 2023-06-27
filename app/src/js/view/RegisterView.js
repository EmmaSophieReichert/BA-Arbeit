/* eslint-env browser */

import {Observable, Event} from "../utils/Observable.js";

class RegisterView extends Observable {

    constructor(){
        super();
        console.log("WHohoooo");
        // this.viewEmail = document.getElementById("input-email");
        // this.viewPassword = document.getElementById("input-password");
        // this.viewUsername = document.getElementById("input-username");
        // this.viewBtn = document.getElementById("input-btn");
        // this.viewBtn.addEventListener("click", this.onSubmit.bind(this));
        // this.answerView = document.getElementById("server-answer");
        document.getElementById('registration-form').addEventListener('submit', function(event) {
            console.log("SUBMIT REGISTRATION");
            event.preventDefault();
            var username = document.getElementById('username').value;
            var email = document.getElementById('email').value;
            var password = document.getElementById('password').value;
            var confirmPassword = document.getElementById('confirm-password').value;
      
            if (username === '' || email === '' || password === '' || confirmPassword === '') {
              alert('Bitte füllen Sie alle Felder aus.');
            } else if (password !== confirmPassword) {
              alert('Die Passwörter stimmen nicht überein.');
            } else {
              // Alle Felder wurden ausgefüllt und die Passwörter stimmen überein
              // Fügen Sie hier den Code ein, um die Registrierung fortzusetzen oder eine andere Aktion auszuführen.
              alert('Registrierung erfolgreich!');
              // Beispiel: Weiterleitung zu einer anderen Seite
              window.location.href = '#schedule';
            }
        });
    }

    // User wants to create an account
    onSubmit(){
        // Data as JSON object stores email and password and the username
        let data = {
                email: this.viewEmail.value,
                password: this.viewPassword.value,
                username: this.viewUsername.value,
        },
        // Data is send with an new account-submit event
        event = new Event("account-submit",data);
        this.notifyAll(event);
    }

    setServerAnswer(string){
        this.answerView.innerText = string; 
    }

}

export default RegisterView;