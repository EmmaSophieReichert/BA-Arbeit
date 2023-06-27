/* eslint-env browser */

import { Observable, Event } from "../utils/Observable.js";

class RegisterView extends Observable {

    constructor() {
        super();
        this.answerView = document.getElementById("server-answer");
        document.getElementById('registration-form').addEventListener('submit', this.onRegisterButtonClicked.bind(this));
    }

    onRegisterButtonClicked(event) {
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
            alert('Registrierung erfolgreich!');
            this.onSubmit(email, password, username);
            // Beispiel: Weiterleitung zu einer anderen Seite
            //window.location.href = '#schedule';
        }
    }

    // User wants to create an account
    onSubmit(email, password, username) {
        // Data as JSON object stores email and password and the username
        let data = {
            email: email,
            password: password,
            username: username,
        },
        // Data is send with an new account-submit event
        event = new Event("account-submit", data);
        this.notifyAll(event);
    }

    setServerAnswer(string) {
        this.answerView.innerText = string;
    }
}

export default RegisterView;