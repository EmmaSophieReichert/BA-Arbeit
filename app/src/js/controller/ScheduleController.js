import fileManager from "../model/FileManager.js";
import ScheduleModel from "../model/ScheduleModel.js";
import ScheduleView from "../view/ScheduleView.js";
import ScheduleViewRight from "../view/ScheduleViewRight.js";

class ScheduleController{
    
    constructor(){
        this.scheduleModel = new ScheduleModel(fileManager);
        this.scheduleView = new ScheduleView();
        this.scheduleViewRight = new ScheduleViewRight();

        fileManager.addEventListener("on-study-loaded", e => {
            let study = e.data;
            this.scheduleView.show(study);
            this.scheduleViewRight.showStudy(study);
        });
        this.scheduleView.addEventListener("onModuleAdded", e => { fileManager.addModule(e.data.module, e.data.subject) });
        this.scheduleView.addEventListener("positionsChanged", () => {
            fileManager.updateFile();
            ;
        } );
        this.scheduleViewRight.addEventListener("onAddModuleButtonClicked", e => {
            this.scheduleView.showModal(e.data);
        });
        this.scheduleView.addEventListener("onModuleChanged", () => {fileManager.updateFile()});

        fileManager.getStudy();
        
    }
}

export default ScheduleController;