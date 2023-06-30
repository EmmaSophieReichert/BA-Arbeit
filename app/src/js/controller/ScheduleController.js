import FileManager from "../model/FileManager.js";
import ScheduleModel from "../model/ScheduleModel.js";
import ScheduleView from "../view/ScheduleView.js";

class ScheduleController{
    
    constructor(){
        this.fileManager = new FileManager();
        this.fileManager.addEventListener("on-study-loaded", e => {
            console.log(e.data);
            this.scheduleView.show(e.data);
        });

        this.scheduleModel = new ScheduleModel(this.fileManager);
        this.scheduleView = new ScheduleView();

        this.fileManager.getStudy();
        
    }
}

export default ScheduleController;