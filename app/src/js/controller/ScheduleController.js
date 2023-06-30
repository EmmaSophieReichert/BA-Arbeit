import FileManager from "../model/FileManager.js";
import ScheduleModel from "../model/ScheduleModel.js";
import ScheduleView from "../view/ScheduleView.js";

class ScheduleController{
    
    constructor(){
        this.fileManager = new FileManager();

        this.scheduleModel = new ScheduleModel(this.fileManager);
        this.scheduleView = new ScheduleView();

        this.fileManager.getStudy();
        console.log("Hier bin ich");
    }
}

export default ScheduleController;