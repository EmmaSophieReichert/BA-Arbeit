/* eslint-env browser */

import { Observable, Event } from "../utils/Observable.js";

class LoginView extends Observable {

    constructor() {
        super();
        document.getElementById('login-form').addEventListener('submit', this.onLogInButtonClicked.bind(this));
        this.answerView = document.getElementById("server-answer");
    }

    onLogInButtonClicked(event){
        event.preventDefault();
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;

        this.onSubmit(email, password);
    }

    // User wants to login
    onSubmit(email, password) {
        // Data as JSON Object stores email and password
        let data = {
                email: email,
                password: password,
            },
            // Data is send with an new login-submit event
            event = new Event("login-submit", data);
        this.notifyAll(event);
    }

    setServerAnswer(string) {
        this.answerView.innerText = string;
    }

    clearInputs() {
        this.viewEmail.value = "";
        this.viewPassword.value = "";
    }

}

export default LoginView;