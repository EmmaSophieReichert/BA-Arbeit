import CatalogueManager from "../model/CatalogueManager";
import FileManager from "../model/FileManager";
import { studies } from "../model/studiesInstance";
import CatalogueView from "../view/CatalogueView";
import CatalogueViewRight from "../view/CatalogueViewRight";


class ModuleCatalogueController{
    
    constructor(){
        this.catalogueManager = new CatalogueManager();
        this.catalogueView = new CatalogueView();
        this.catalogueViewRight = new CatalogueViewRight();

        if(studies !== null){
            console.log("klein");
            this.catalogueViewRight.showStudy(studies);
            this.catalogueView.show(studies);
        }
        else{
            this.fileManager = new FileManager();
            this.fileManager.addEventListener("on-study-loaded", e => {
                let study = e.data;
                this.catalogueView.show(study);
                this.catalogueViewRight.showStudy(study);
            });
            this.fileManager.getStudy();
        }
    }
}

export default ModuleCatalogueController;