/* eslint-env browser */

import StudyView from "../view/StudyView.js";
import StudyManager from "../model/StudyManager.js";
import { studies } from "../model/studiesInstance.js";

class StudyController {

    constructor() {
        this.studyView = new StudyView();
        this.studyView.addEventListener("study-submit", this.onSubmit.bind(this));

        this.studyManager = new StudyManager();
        this.studyManager.addEventListener("studies-reached-cloud", this.onSaveResult.bind(this));
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

    // Get the data from the study and give it the studyManager to store in DB
    onSubmit(event) {
        this.studyManager.saveData(event.data);
    }

    // If the result from the login try is ready, the user will be taken to the home page (if login was successful)
    onSaveResult() {
        console.log("DATA Has been successfully changed");
        window.location.hash = "schedule";
    }

}

export default StudyController;