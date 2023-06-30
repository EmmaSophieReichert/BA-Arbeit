import { listFiles } from "../api/Storage/listFiles.js";
import { getFile } from "../api/Storage/getFile.js";
import Studies from "./structure/Studies.js";

class FileManager{

    constructor(){
        this.study = null;
    }

    async getStudy(){
        let promise = listFiles(),
            res = await computePromise(promise);
        console.log(res);
        if(res.total === 0){
            window.location.hash = "study";
            return;
        }
        let id = res.files[0].$id,
            data = getFile(id),
            reader = new FileReader();
        console.log(data);
        console.log(data.href);
        fetch(data.href).then(dat => {
            dat.blob();
        }).then(blob => {
            let file = new File([blob], "CodeFile");
            console.log(file);
            reader.readAsText(file);
        }).catch(error => {
            console.error(error);
        });       

        reader.onload = (res) => {
            let text = res.target.result;
                //obj = JSON.parse(text);
            console.log(text);
            //this.translateObject(obj);
            
            //this.notifyAll(new Event("codeHTML-downloaded", text));
        };
    }

    translateObject(obj){
        this.study = new Studies(obj.degree, obj.totalECTS)
    }

    //{"degree":"Bachelor","specialization":{},"totalECTS":180,"subjects":[{"title":"bedf","ECTS":180,"modules":[],"currentECTS":null}],"semesters":[{"period":"Wintersemester"},{"period":"Sommersemester"},{"period":"Wintersemester"},{"period":"Sommersemester"},{"period":"Wintersemester"},{"period":"Sommersemester"}]}

    updateFile(){

    }

}

async function computePromise(promise){
    let res = await promise.then((res) => {
        return res;
    }, (error) => {
        console.log(error);
    });
    return res;
}

export default FileManager;