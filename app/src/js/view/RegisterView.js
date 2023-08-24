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
            this.setServerAnswer('Bitte fülle alle Felder aus.');
        } else if (password !== confirmPassword) {
            this.setServerAnswer('Die Passwörter stimmen nicht überein.');
        } else {
            this.onSubmit(email, password, username);
        }
    }

    // User wants to create an account -> event to controller
    onSubmit(email, password, username) {
        let data = {
            email: email,
            password: password,
            username: username,
        },
            event = new Event("account-submit", data);
        this.notifyAll(event);
    }

    setServerAnswer(string) {
        this.answerView.innerText = string;
    }
}

export default RegisterView;