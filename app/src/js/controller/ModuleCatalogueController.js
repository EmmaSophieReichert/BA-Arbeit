import CatalogueManager from "../model/CatalogueManager.js";
import FileManager from "../model/FileManager.js";
import { studies } from "../model/studiesInstance.js";
import CatalogueView from "../view/CatalogueView.js";
import CatalogueViewRight from "../view/CatalogueViewRight.js";


class ModuleCatalogueController{
    
    constructor(){
        this.catalogueManager = new CatalogueManager();
        this.catalogueView = new CatalogueView();
        this.catalogueViewRight = new CatalogueViewRight();
        this.fileManager = new FileManager();

        if(studies !== null){
            this.catalogueViewRight.show(studies);
            this.catalogueView.show(studies);
        }
        else{
            this.fileManager.addEventListener("on-study-loaded", e => {
                let study = e.data;
                this.catalogueView.show(study);
                this.catalogueViewRight.show(study);
            });
            this.fileManager.getStudy();
        }

        this.catalogueView.addEventListener("onModuleChanged", () =>{
            this.fileManager.updateFile()
        })

        this.catalogueViewRight.addEventListener("onFilterValues", (e) => {
            let study = this.catalogueManager.filterStudies(e.data);
            this.catalogueView.show(study);
        })
    }
}

export default ModuleCatalogueController;