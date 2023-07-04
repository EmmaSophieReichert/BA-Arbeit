import FileManager from "../model/FileManager.js";
import ScheduleModel from "../model/ScheduleModel.js";
import ScheduleView from "../view/ScheduleView.js";
import ScheduleViewRight from "../view/ScheduleViewRight.js";

class ScheduleController{
    
    constructor(){
        this.fileManager = new FileManager();
        this.scheduleModel = new ScheduleModel(this.fileManager);
        this.scheduleView = new ScheduleView();
        this.scheduleViewRight = new ScheduleViewRight();

        this.fileManager.addEventListener("on-study-loaded", e => {
            let study = e.data;
            this.scheduleView.show(study);
            this.scheduleViewRight.showStudy(study);
        });
        this.scheduleView.addEventListener("onModuleAdded", e => { this.fileManager.addModule(e.data) });
        this.scheduleView.addEventListener("positionsChanged", () => {this.fileManager.updateFile()} );

        this.fileManager.getStudy();
        
    }
}

export default ScheduleController;