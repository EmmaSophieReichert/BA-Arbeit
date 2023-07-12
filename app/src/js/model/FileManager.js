import { listFiles } from "../api/Storage/listFiles.js";
import { getFile } from "../api/Storage/getFile.js";
import Studies from "./structure/Studies.js";
import appwrite from "../api/appwrite.js";
import Config from "../utils/Config.js";
import { Observable, Event } from "../utils/Observable.js";
import { deleteFile } from "../api/Storage/deleteFile.js";
import { createFile } from "../api/Storage/createFile.js";
import { studies, setStudyInstance } from "./studiesInstance.js";

class FileManager extends Observable {

    constructor() {
        super();
        this.fileID = null;
        this.inProcess = false;
        this.timerID = null;
    }

    async getList() {
        let promise = listFiles(),
            res = await computePromise(promise);
        return res;
    }

    async getStudy() {
        let res = await this.getList();
        if (res.total === 0) {
            console.log("NO STUDY FOUND");
            window.location.hash = "study";
            return;
        }
        let id = res.files[0].$id,
            jwtPromise = getFile(id),
            reader = new FileReader(),
            data;
        this.fileID = id;
        this.timerID = setTimeout(() => {
            this.timerID = null;
            location.reload();
        }, 800000);

        jwtPromise.then(function (response) {
            appwrite.client.setJWT(response.jwt);
            let headers = new Headers();
            headers.append('X-Appwrite-JWT', response.jwt);
            data = appwrite.storage.getFileDownload(Config.BUCKET_ID, id);
            return fetch(data.href, { headers: headers });
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
        console.log("OBJECT", obj);
        setStudyInstance(new Studies(obj.degree, obj.totalECTS, obj.semesters, obj.subjects, obj.specialization, obj.intermediateResults, obj.children));
        let e = new Event("on-study-loaded", studies);
        this.notifyAll(e);
    }

    addModule(module, subjectIndex) {
        let stud = studies;
        stud.subjects[subjectIndex].addModule(module);
        setStudyInstance(stud);
        this.updateFile();
    }

    async updateFile() {
        if(this.timerID === null){
            // location.reload();
            // let jwtPromise = getFile();
            // await jwtPromise.then((res) => {
            //     console.log(res);
            //     appwrite.client.setJWT(res.jwt);
            // })
        }
        if (this.inProcess) {
            setTimeout(async() => {
                await this.updateFile();
            }, 100)
            setTimeout(() => {
                this.inProcess = false;
            }, 30000)
        }
        else {
            await this.update();
        }
    }

    async update() {
        this.inProcess = true;
        let promise = listFiles(),
            res = await computePromise(promise);
        //id = res.files[0].$id,
        //deletePromise = deleteFile(id);
        if (res.files !== undefined && res.files !== null && res.files !== []) {
            for (let file of res.files) {
                let id = file.$id,
                    deletePromise = deleteFile(id);
                await computePromise(deletePromise).then(() => {
                    
                }, (error) => { console.log(error) });
            }
        }



        let studyJSON = JSON.stringify(studies),
            blob = new Blob([studyJSON], { type: "text/plain" }),
            file = new File([blob], studies.subjects[0].title);
        await createFile(file).then(() => {
            this.inProcess = false;
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

var fileManager = new FileManager()

export default fileManager;