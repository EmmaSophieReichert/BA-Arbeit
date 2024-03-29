/* eslint-env browser */

import { Observable, Event } from "../utils/Observable.js";

class LoginView extends Observable {

    constructor() {
        super();
        this.loginForm = document.getElementById('login-form');
        this.loginForm.addEventListener('submit', this.onLogInButtonClicked.bind(this));
        this.answerView = document.getElementById("server-answer");
        this.viewEmail = document.getElementById('email');
        this.viewPassword = document.getElementById("password");
    }

    onLogInButtonClicked(event) {
        event.preventDefault();
        let email = this.viewEmail.value,
            password = this.viewPassword.value;
        this.onSubmit(email, password);
    }

    // User wants to login -> event to controller
    onSubmit(email, password) {
        let data = {
            email: email,
            password: password,
        },
            event = new Event("login-submit", data);
        this.notifyAll(event);
    }

    setServerAnswer(string) {
        this.answerView.innerText = string;
    }

    clearInputs() {
        this.loginForm.reset();
    }

}

export default LoginView;