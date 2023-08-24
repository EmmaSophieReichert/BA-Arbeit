/* eslint-env browser */

import { getAuth } from "../api/Auth/getAuth.js";
import { createFile } from "../api/Storage/createFile.js";
import { Observable, Event } from "../utils/Observable.js";
import Studies from "./structure/Studies.js";

class StudyManager extends Observable {

    constructor() {
        super();
    }

    //save study data in DB
    async saveData(data) {
        let semesters = Studies.initFirstSemesters(data.semester, data.period),
            studies = new Studies(data.degree, data.ects, semesters, data.subjects, data.specializations);
        let studyJSON = JSON.stringify(studies),
            blob = new Blob([studyJSON], { type: "text/plain" }),
            file = new File([blob], studies.subjects[0].title),
            auth = await getAuth();
        if(auth.login){
            let promise = createFile(file, auth);
            await promise.then(() => { 
                this.notifyAll(new Event("studies-reached-cloud", "studies reached cloud")); 
                console.log("Studies reached cloud StudyManager");
            });
        }
        else{
            window.location.hash = "login";
            location.reload();
        }
    }

}

export default StudyManager;