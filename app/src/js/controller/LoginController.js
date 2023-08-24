/* eslint-env browser */

import LoginView from "../view/LoginView.js";
import LoginManager from "../model/LoginManager.js";

class LoginController {

    constructor() {
        this.loginView = new LoginView();
        this.loginView.addEventListener("login-submit", this.onSubmit.bind(this));

        this.loginManager = new LoginManager();
        this.loginManager.addEventListener("login-result", this.onLoginResult.bind(this));
    }

    // On submit button click the data from the inputs is used to search for a account in the database
    onSubmit(event) {
        let email = event.data.email,
            password = event.data.password;
        this.loginManager.createSession(email, password);
    }

    // If the result from the login try is ready, the user will be taken to the home page (if login was successful). Otherwise Error Messages will be shown.
    onLoginResult(event) {
        let bool = event.data.login;
        if (bool) {
            setTimeout(() => {
                window.location.hash = "schedule";
                console.log("LogIn Success Session Created");
            }, 300);
        } else {
            console.log("Login failed");
            this.loginView.clearInputs();
            let message = event.data.answer.message;
            if (message) {
                if (event.data.answer.type === "user_invalid_credentials") {
                    message = "Invalide Eingabe. Bitte überprüfe E-Mail und Passwort."
                }
                else if (event.data.answer.response.message === "Invalid email: Value must be a valid email address") {
                    message = "Invalide Email."
                }
                else if (event.data.answer.response.message === "Invalid password: Password must be at least 8 characters") {
                    message = "Invalides Passwort. Das Passwort muss mindestens 8 Zeichen lang sein."
                }
                this.loginView.setServerAnswer(message);
            }
        }
    }

}

export default LoginController;