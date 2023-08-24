/* eslint-env browser */

import RegisterView from "../view/RegisterView.js";
import RegisterManager from "../model/RegisterManager.js";

class RegisterController {

    constructor() {
        this.registerView = new RegisterView();
        this.registerView.addEventListener("account-submit", this.onSubmit.bind(this));
        this.registerManager = new RegisterManager();
        this.registerManager.addEventListener("account-result", this.onAccountResult.bind(this));
    }

    // On submit button click the data from the inputs is used create an account in the database
    onSubmit(event) {
        let email = event.data.email,
            password = event.data.password,
            username = event.data.username;

        if (username.trim() === "") {
            username = email;
        }
        this.registerManager.createUser(email, password, username);
    }

    // If the result from the register try is ready, the user will be taken to the home page (if login was successful)
    onAccountResult(event) {
        let bool = event.data.register;
        if (bool) {
            // Instead of creating a session for the new user, we redirect to the login page where he/she can login
            alert('Registrierung erfolgreich!');
            window.location.hash = "login";
        }
        let message = event.data.answer.message;
        if (message) {
            if (event.data.answer.response.message === "Invalid email: Value must be a valid email address") {
                message = "Invalide Email."
            }
            else if (event.data.answer.response.message === "Invalid password: Password must be at least 8 characters") {
                message = "Invalides Passwort. Das Passwort muss mindestens 8 Zeichen lang sein."
            }
            this.registerView.setServerAnswer(message);
        }
    }

}

export default RegisterController;