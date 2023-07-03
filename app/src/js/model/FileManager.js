import { listFiles } from "../api/Storage/listFiles.js";
import { getFile } from "../api/Storage/getFile.js";
import Studies from "./structure/Studies.js";
import appwrite from "../api/appwrite.js";
import Config from "../utils/Config.js";
import { Observable, Event } from "../utils/Observable.js";
import { deleteFile } from "../api/Storage/deleteFile.js";
import { createFile } from "../api/Storage/createFile.js";

class FileManager extends Observable {

    constructor() {
        super();
        this.study = null;
        this.fileID = null;
    }

    async getStudy() {
        let promise = listFiles(),
            res = await computePromise(promise);
        if (res.total === 0) {
            window.location.hash = "study";
            return;
        }
        let id = res.files[0].$id,
            jwtPromise = getFile(id),
            reader = new FileReader(),
            data;
        this.fileID = id;

        jwtPromise.then(function (response) {
            appwrite.client.setJWT(response.jwt);
            let headers = new Headers();
            headers.append('X-Appwrite-JWT', response.jwt);
            data = appwrite.storage.getFileDownload(Config.BUCKET_ID, id);
            return fetch(data.href, {headers: headers});
        }, function (error) {
            console.log(error);
        }).then(data => data.blob()).then(blob => {
            let file = new File([blob], "CodeFile");
            reader.readAsText(file);
        });

        reader.onload = (res) => {
            let text = res.target.result,
                obj = JSON.parse(text);
            this.translateObject(obj);
            //this.notifyAll(new Event("codeHTML-downloaded", text));
        };
    }

    translateObject(obj) {
        this.study = new Studies(obj.degree, obj.totalECTS, obj.semesters, obj.subjects, obj.specialization);
        let e = new Event("on-study-loaded", this.study);
        this.notifyAll(e);
    }

    addModule(module){
        this.study.subjects[0].addModule(module);
        this.updateFile();
    }

    async updateFile() {
        let deletePromise = deleteFile(this.fileID);
        await computePromise(deletePromise);
        let studyJSON = JSON.stringify(this.study),
            blob = new Blob([studyJSON], { type: "text/plain" }),
            file = new File([blob], "Study-ID-2");
        await createFile(file)
            .then(() => { 
                console.log("Change gas been successfully saved.")
            });
    }

}

async function computePromise(promise) {
    let res = await promise.then((res) => {
        return res;
    }, (error) => {
        console.log(error);
    });
    return res;
}

export default FileManager;