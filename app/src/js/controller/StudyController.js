/* eslint-env browser */

import StudyView from "../view/StudyView.js";
import StudyManager from "../model/StudyManager.js";

class StudyController {

    constructor() {
        this.studyView = new StudyView();
        this.studyView.addEventListener("login-submit", this.onSubmit.bind(this));

        this.studyManager = new StudyManager();
        this.studyManager.addEventListener("save-result", this.onSaveResult.bind(this));
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
        this.studyManager.createSession(email, password);
    }

    // If the result from the login try is ready, the user will be taken to the home page (if login was successful)
    onSaveResult(event) {
        let bool = event.data.login;
        if (bool) {
            window.location.hash = "schedule";
            //this.navView.showNavView(); show again?
        } else {
            this.studyView.clearInputs();
            this.studyView.setServerAnswer(event.data.answer.message);
        }
    }

}

export default StudyController;