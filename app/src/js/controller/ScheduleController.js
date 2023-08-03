import fileManager from "../model/FileManager.js";
import ScheduleModel from "../model/ScheduleModel.js";
import { studies } from "../model/studiesInstance.js";
import ScheduleView from "../view/ScheduleView.js";
import ScheduleViewRight from "../view/ScheduleViewRight.js";

class ScheduleController{
    
    constructor(){
        this.scheduleModel = new ScheduleModel(fileManager);
        this.scheduleView = new ScheduleView();
        this.scheduleViewRight = new ScheduleViewRight();

        fileManager.addEventListener("on-study-loaded", e => {
            if(window.location.hash === "#schedule"){
                let study = e.data;
                this.scheduleView.show(study);
                this.scheduleViewRight.showStudy(study);
            }
        });
        this.scheduleView.addEventListener("onModuleAdded", e => { 
            //fileManager.addModule(e.data.module, e.data.subject) 
        });
        this.scheduleView.addEventListener("positionsChanged", () => {
            fileManager.updateFile();
        });
        this.scheduleViewRight.addEventListener("onAddModuleButtonClicked", e => {
            this.scheduleView.showModal(e.data);
        });
        this.scheduleView.addEventListener("onModuleChanged", () => {
            //console.log("STUDIES", studies);
            this.scheduleViewRight.showStudy(studies);
        });
        if(studies === null){
            fileManager.getStudy();
        }
        else{
            this.scheduleView.show(studies);
            this.scheduleViewRight.showStudy(studies);
        }
        
        
    }
}

export default ScheduleController;