/* eslint-env browser */

import { Observable, Event } from "../utils/Observable.js";

class LoginView extends Observable {

    constructor() {
        super();
        // this.viewEmail = document.getElementById("input-email");
        // this.viewPassword = document.getElementById("input-password");
        // this.viewBtn = document.getElementById("input-btn");
        // this.viewBtn.addEventListener("click", this.onSubmit.bind(this));
        // this.registerBtn = document.getElementById("register-btn");
        // this.registerBtn.addEventListener("click", this.onRegister.bind(this));
        // this.viewPassword.addEventListener("change", this.onSubmit.bind(this));
        // this.answerView = document.getElementById("server-answer");
    }

    // User wants to login
    onSubmit() {
        // Data as JSON Object stores email and password
        let data = {
                email: this.viewEmail.value,
                password: this.viewPassword.value,
            },
            // Data is send with an new login-submit event
            event = new Event("login-submit", data);
        this.notifyAll(event);
    }

    // Switches to register page
    onRegister() {
        this.notifyAll(new Event("onRegisterClicked", ""));
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