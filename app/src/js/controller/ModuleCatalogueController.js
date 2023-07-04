import CatalogueManager from "../model/CatalogueManager";
import { studies } from "../model/studiesInstance";
import CatalogueView from "../view/CatalogueView";
import ScheduleViewRight from "../view/ScheduleViewRight";


class ModuleCatalogueController{
    
    constructor(){
        this.catalogueManager = new CatalogueManager();
        this.catalogueView = new CatalogueView();
        this.scheduleViewRight = new ScheduleViewRight();
        
        console.log("klein");

        if(studies !== null){
            console.log("klein");
            this.scheduleViewRight.showStudy(studies);
        }
    }
}

export default ModuleCatalogueController;