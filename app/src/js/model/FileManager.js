import { listFiles } from "../api/Storage/listFiles.js";
import { getFile } from "../api/Storage/getFile.js";
import Studies from "./structure/Studies.js";
import appwrite from "../api/appwrite.js";
import Config from "../utils/Config.js";
import { Observable, Event } from "../utils/Observable.js";

class FileManager extends Observable {

    constructor() {
        super();
        this.study = null;
    }

    async getStudy() {
        let promise = listFiles(),
            res = await computePromise(promise);
        console.log(res);
        if (res.total === 0) {
            window.location.hash = "study";
            return;
        }
        console.log(res.files[0]);
        let id = res.files[0].$id,
            jwtPromise = getFile(id),
            reader = new FileReader(),
            data;

        jwtPromise.then(function (response) {
            console.log(response.jwt);
            appwrite.client.setJWT(response.jwt);
            let headers = new Headers();
            headers.append('X-Appwrite-JWT', response.jwt);
            data = appwrite.storage.getFileDownload(Config.BUCKET_ID, id);
            console.log(data);
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
        console.log(this.study);
        let e = new Event("on-study-loaded", this.study);
        this.notifyAll(e);
    }

    updateFile() {

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