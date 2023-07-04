/* eslint-env browser */

import LoginView from "../view/LoginView.js";
import LoginManager from "../model/LoginManager.js";

// Controls the Login page
// The Login Manager handles account validations
// The Login View is there to show proceedings to the user
class LoginController {

    constructor() {
        this.loginView = new LoginView();
        this.loginView.addEventListener("login-submit", this.onSubmit.bind(this));

        this.loginManager = new LoginManager();
        this.loginManager.addEventListener("login-result", this.onLoginResult.bind(this));
    }

    init(navView) {
        // Navbar View
        // Just because if you route back to the Login from another Page, the elements still show
        this.navView = navView;
        this.navView.hideLinks();
        this.navView.hideSafeBtn();
        this.navView.hideTitleInput();
        this.navView.hideNavView();
    }

    // On submit button click the data from the inputs is used to search for a account in the database
    onSubmit(event) {
        let email = event.data.email,
            password = event.data.password;
        this.loginManager.createSession(email, password);
    }

    // If the result from the login try is ready, the user will be taken to the home page (if login was successful)
    onLoginResult(event) {
        let bool = event.data.login;
        if (bool) {
            setTimeout(() => { //TODO: FIX this, error when log out and log in
                window.location.hash = "schedule";
                console.log("LogIn Success Session Created");
            }, 5000);
            //this.navView.showNavView(); show again?
        } else {
            console.log("Login failed");
            this.loginView.clearInputs();
            this.loginView.setServerAnswer(event.data.answer.message);
        }
    }

}

export default LoginController;