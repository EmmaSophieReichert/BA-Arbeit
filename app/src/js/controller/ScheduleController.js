import ScheduleModel from "../model/ScheduleModel.js";
import ScheduleView from "../view/ScheduleView.js";

class ScheduleController{
    
    constructor(){
        this.scheduleModel = new ScheduleModel();
        this.scheduleView = new ScheduleView();

        
    }
}

export default ScheduleController;