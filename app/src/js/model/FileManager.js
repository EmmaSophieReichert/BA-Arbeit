import { listFiles } from "../api/Storage/listFiles.js";
import { getFile } from "../api/Storage/getFile.js";
import Studies from "./structure/Studies.js";
import appwrite from "../api/appwrite.js";
import Config from "../utils/Config.js";
import { Observable, Event } from "../utils/Observable.js";
import { deleteFile } from "../api/Storage/deleteFile.js";
import { createFile } from "../api/Storage/createFile.js";
import { studies, setInstance } from "./studiesInstance.js";

class FileManager extends Observable {

    constructor() {
        super();
        this.fileID = null;
    }

    //https://cloud.appwrite.io/v1/storage/buckets/649d550640f146162c94/files/64a29e91469d373c11cf/download?project=649ab3887121a935da21&mode=admin
    //https://cloud.appwrite.io/v1/storage/buckets/649d550640f146162c94/files/64a29e91469d373c11cf/download?project=649ab3887121a935da21
    //https://cloud.appwrite.io/v1/storage/buckets/649d550640f146162c94/files/64a29e91469d373c11cf/download?project=649ab3887121a935da21&mode=admin
    //https://cloud.appwrite.io/v1/storage/buckets/649d550640f146162c94/files/64a29e91469d373c11cf/view?project=649ab3887121a935da21&mode=admin

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
            return fetch(data.href + "&mode=admin", {headers: headers});
        }, function (error) {
            console.log(error);
        }).then(data => data.blob()).then(blob => {
            let file = new File([blob], "CodeFile");
            reader.readAsText(file);
        });

        reader.onload = (res) => {
            let text = res.target.result,
                obj = JSON.parse(text);
            console.log(res);
            this.translateObject(obj);
            //this.notifyAll(new Event("codeHTML-downloaded", text));
        };
    }

    translateObject(obj) {
        console.log(obj);
        setInstance(new Studies(obj.degree, obj.totalECTS, obj.semesters, obj.subjects, obj.specialization));
        let e = new Event("on-study-loaded", studies);
        this.notifyAll(e);
    }

    addModule(module){
        let stud = studies
        stud.subjects[0].addModule(module);
        setInstance(stud);
        this.updateFile();
    }

    async updateFile() {
        let deletePromise = deleteFile(this.fileID); //TODO: ist delete hier nötig? Sollte bei create mit ID eigl überschrieben werden
        deletePromise.then(() => {
            console.log("Delete", studies);
            let studyJSON = JSON.stringify(studies),
                blob = new Blob([studyJSON], { type: "text/plain" }),
                file = new File([blob], "Study.txt", { type: 'text/plain' });
            console.log(file.type);
            return createFile(file, this.fileID);
        }).then((res) => { 
            console.log(res);
            console.log("Change gas been successfully saved.")
        })
        //await computePromise(deletePromise);
        
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