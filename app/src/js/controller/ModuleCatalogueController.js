import CatalogueManager from "../model/CatalogueManager.js";
import fileManager from "../model/FileManager.js";
import { studies } from "../model/studiesInstance.js";
import CatalogueView from "../view/CatalogueView.js";
import CatalogueViewRight from "../view/CatalogueViewRight.js";


class ModuleCatalogueController{
    
    constructor(){
        this.catalogueManager = new CatalogueManager();
        this.catalogueView = new CatalogueView();
        this.catalogueViewRight = new CatalogueViewRight();

        if(studies !== null){
            this.catalogueViewRight.show(studies);
            this.catalogueView.show(studies);
        }
        else{
            fileManager.addEventListener("on-study-loaded", e => {
                let study = e.data;
                this.catalogueView.show(study);
                this.catalogueViewRight.show(study);
            });
            fileManager.getStudy();
        }

        this.catalogueView.addEventListener("onModuleChanged", () =>{
            fileManager.updateFile()
        });

        this.catalogueViewRight.addEventListener("onFilterValues", (e) => {
            let study = this.catalogueManager.filterStudies(e.data);
            this.catalogueView.show(study);
        });

        this.catalogueViewRight.addEventListener("onAddModuleButtonClicked", e => {
            this.catalogueView.showModal(e.data);
        });

        this.catalogueView.addEventListener("onModuleAdded", e => { fileManager.addModule(e.data.module, e.data.subject) });
    }
}

export default ModuleCatalogueController;