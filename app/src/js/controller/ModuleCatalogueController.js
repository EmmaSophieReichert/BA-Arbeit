import CatalogueManager from "../model/CatalogueManager";
import CatalogueView from "../view/CatalogueView";
import ScheduleViewRight from "../view/ScheduleViewRight";


class ModuleCatalogueController{
    
    constructor(){
        this.catalogueManager = new CatalogueManager();
        this.catalogueView = new CatalogueView();
        this.scheduleViewRight = new ScheduleViewRight();
        
    }
}

export default ModuleCatalogueController;