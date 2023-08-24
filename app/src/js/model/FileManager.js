import { listFiles } from "../api/Storage/listFiles.js";
import { getJWT } from "../api/Storage/getJWT.js";
import Studies from "./structure/Studies.js";
import appwrite, { reloadClient } from "../api/appwrite.js";
import Config from "../utils/Config.js";
import { Observable, Event } from "../utils/Observable.js";
import { deleteFile } from "../api/Storage/deleteFile.js";
import { createFile } from "../api/Storage/createFile.js";
import { studies, setStudyInstance } from "./studiesInstance.js";
import { getUser } from "../api/User/getUser.js";
import { getAuth } from "../api/Auth/getAuth.js";

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
        let auth = await getAuth();
        if(!auth.login){
            window.location.hash = "login";
            location.reload();
            return;
        }
        let res = await this.getList();
        if(res){
            if (res.total === 0) {
                console.log("NO STUDY FOUND");
                if(studies === null){
                    window.location.hash = "study";
                }
                return;
            }
            let id = res.files[0].$id,
                jwtPromise = getJWT(id),
                reader = new FileReader(),
                data,
                currentFile = res.files[0];
            for(let file of res.files){
                let currentDate = new Date(currentFile.$updatedAt),
                    newDate = new Date(file.$updatedAt);
                if(newDate > currentDate){
                    currentFile = file;
                } 
            }
            id = currentFile.$id;
            this.fileID = id;
            this.timerID = setTimeout(() => {
                this.timerID = null;
                this.getStudy();
                console.log("STUDY RELOADED");
            }, 800000);
            //}, 30000);
    
            jwtPromise.then(async function (response) {
                //appwrite.client.setJWT(response.jwt);
                reloadClient(response.jwt);
                let headers = new Headers();
                headers.append('X-Appwrite-JWT', response.jwt);
                data = appwrite.storage.getFileDownload(Config.BUCKET_ID, id);
                return await fetch(data.href, { headers: headers });
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
    }

    translateObject(obj) {
        let stud = new Studies(obj.degree, obj.totalECTS, obj.semesters, obj.subjects, obj.specialization, obj.intermediateResults, obj.kids);
        if(stud){
            setStudyInstance(stud);
            let e = new Event("on-study-loaded", studies);
            this.notifyAll(e);
        };
    }

    addModule(module, subjectIndex) {
        let stud = studies;
        stud.subjects[subjectIndex].addModule(module);
        if(stud){
            setStudyInstance(stud);
            console.log("SOURCE 2");
            this.updateFile();
        }
    }

    async updateFile() {
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

        console.log("UPDATE");
        //id = res.files[0].$id,
        //deletePromise = deleteFile(id);

        // if (res.files !== undefined && res.files !== null && res.files !== []) {
        //     for (let file of res.files) {
        //         let id = file.$id,
        //             deletePromise = deleteFile(id);
        //         await computePromise(deletePromise).then(() => {
                    
        //         }, (error) => { console.log(error) });
        //     }
        // }

        // let studyJSON = JSON.stringify(studies),
        //     blob = new Blob([studyJSON], { type: "text/plain" }),
        //     file = new File([blob], studies.subjects[0].title);
        // await createFile(file).then(() => {
        //     this.inProcess = false;
        //     console.log("Change gas been successfully saved.")
        // });

        let studyJSON = JSON.stringify(studies),
            blob = new Blob([studyJSON], { type: "text/plain" }),
            fileF = new File([blob], studies.subjects[0].title),
            auth = await getAuth();
        
        if(auth.login){
            let promise = createFile(fileF, auth);
            await promise.then(async() => {
                await this.deleteFiles(res);
                this.inProcess = false;
                console.log("Change has been successfully saved.")
            }, (error) => { console.log(error) }).catch((error) => {
                console.log(error);
            });
        }
        else{
            window.location.hash = "login";
            location.reload();
        }

        
    }

    async deleteFiles(res){
        if (res.files !== undefined && res.files !== null && res.files.length !== 0) {
            for (let file of res.files) {
                let id = file.$id,
                    deletePromise = deleteFile(id);
                if(deletePromise){
                    await deletePromise.then(() => {
                        console.log("FILE DELETED", id);
                    }, (error) => { console.log(error) }).catch((error) => {
                        console.log(error);
                    });
                }
            }
        }
    }

}

async function computePromise(promise) {
    let res = await promise.then((res) => {
        return res;
    }, (error) => {
        console.log(error);
    }).catch((error) => {
        console.log(error);
    });
    return res;
}

var fileManager = new FileManager()

export default fileManager;