/* eslint-env browser */

import { createFile } from "../api/Storage/createFile.js";
import { Observable, Event } from "../utils/Observable.js";
import Studies from "./structure/Studies.js";

class StudyManager extends Observable {

    constructor() {
        super();
        this.studies = null;
    }
    // If a user wants to login, the database is asked to create a session with this user
    // If this is not possible -> user account is not real
    async createSession(email, password) {
        let promise = createSession(email, password),
            res = await computePromise(promise),
            // res is either true or false and is passed to the controller
            event = new Event("save-result", res);
        this.notifyAll(event);
    }

    async saveData(data) {
        let semesters = Studies.initFirstSemesters(data.semester, data.period);
        this.studies = new Studies(data.degree, data.ects, semesters, data.subjects, data.specializations);
        let studyJSON = JSON.stringify(this.studies),
            blob = new Blob([studyJSON], { type: "text/plain" }),
            file = new File([blob], "Study-ID-2");
        await createFile(file).then(() => { 
            this.notifyAll(new Event("studies-reached-cloud", "studies reached cloud")); 
        });
    }

}

// If the account credentials are real -> return true (User is granted access)
// Returns the reason why login was not successful too -> use for validation/ error animations in view
// On success it returns the user, which could be used to greet him or such stuff
async function computePromise(promise) {
    let res = await promise.then((res) => {
        return {
            login: true,
            answer: res,
        };
    }, (error) => {
        return {
            login: false,
            answer: error,
        };
    });
    return res;
}

export default StudyManager;