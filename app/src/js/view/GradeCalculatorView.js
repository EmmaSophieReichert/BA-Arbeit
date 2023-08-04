// import { GridStack } from 'gridstack';
import { GridStack } from '../../../../node_modules/gridstack/dist/gridstack.js';
import Module from '../model/structure/Module.js';
import modalView from './modals/ModalView.js';
import { Observable, Event } from '../utils/Observable.js';
import { studies, setStudyInstance } from '../model/studiesInstance.js';
import Config from '../utils/Config.js';
import moduleModalView from './modals/ModuleModalView.js';
import IntermediateResult from '../model/structure/IntermediateResult.js';
import fileManager from '../model/FileManager.js';
import intResModalView from './modals/IntResModalView.js';


class GradeCalculatorView extends Observable {

    constructor() {
        super();

        this.initNavView();
        this.chart = null;

        this.nodes = null;

        this.currentClickedIDs = [];
        this.buttonContainer = document.getElementById("add-int-res-button-container");

        this.hint = document.getElementById("int-res-hint");

        intResModalView.addEventListener("onIntResSubmit", () => {
            this.show();
        })
    }

    initNavView(){
        let navs = document.querySelectorAll(".navigation-button");
        for(let nav of navs){
            nav.classList.remove("selected-side");
        }
        document.getElementById("nav-grade").classList.add("selected-side");
    }

    show() {
        console.log(studies);
        let config = studies.toTreeData();
        this.chart = new Treant(config, () => { this.onTreeLoaded() });
    }

    onTreeLoaded() {
        this.nodes = document.querySelectorAll(".grade-module");
        this.nodes.forEach((element) => {
            element.addEventListener("click", () => {
                let nodeId = element.getAttribute("id");
                this.handleClick(nodeId);
                //let node = this.chart.tree.getNodeById(nodeId);
                // if (node) {
                //     handleClick(node);
                // }
            });
        });
    }

    // different look, add to array
    handleClick(nodeID) {
        this.hint.style.display = "none";
        let nodeElement = document.getElementById(nodeID);
        let wrap = nodeElement.querySelector(".grade-module-wrap");
        // Prove if nodeID is in Array
        let index = this.currentClickedIDs.indexOf(nodeID);
        if (index === -1) {
            if(wrap){
                wrap.style.border = "2px solid rgb(171, 89, 226)";
            }
            this.currentClickedIDs.push(nodeID);
            this.updateButton();
        } else {
            if(wrap){
                wrap.style.border = "";
            }
            this.currentClickedIDs.splice(index, 1);
            this.updateButton();
        }
    }

    createButton() {
        // prove if button is already appended
        if (this.buttonContainer.querySelector("button")) {
            return;
        }

        let button = document.createElement("button");
        button.textContent = "Zwischenergebnis hinzufügen";
        button.classList.add("register-button");
        button.id = "add-int-res-button";
        button.addEventListener("click", () => {
            intResModalView.show(this.currentClickedIDs);
            //this.show();
            this.currentClickedIDs = [];
            this.removeButton();
            this.removeDeleteButton();
        });

        this.buttonContainer.appendChild(button);
    }

    removeButton() {
        let button = this.buttonContainer.querySelector("#add-int-res-button");

        // Überprüfen, ob der Button vorhanden ist
        if (button) {
            this.buttonContainer.removeChild(button);
        }
    }

    updateButton() {
        if (this.currentClickedIDs.length > 0) {
            this.createButton();
            if (this.isIntermediateResultSelected()) {
                this.createDeleteButton();
            } else {
                this.removeDeleteButton();
            }
        } else {
            this.removeButton();
            this.removeDeleteButton();
        }
    }

    isIntermediateResultSelected() {
        if(this.currentClickedIDs.length !== 1){
            return false;
        }
        let node = this.currentClickedIDs[0],
        child = studies.getChild(node);
        return child instanceof IntermediateResult;
    }

    createDeleteButton() {
        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Zwischenergebnis löschen";
        deleteButton.classList.add("red-button");
        deleteButton.id = "delete-int-res-button";

        deleteButton.addEventListener("click", () => {
            let stud = studies;
            stud.deleteIntermediateResult(this.currentClickedIDs[0]);
            if(stud){
                setStudyInstance(stud);
            }
            console.log("SOURCE 3");
            fileManager.updateFile();
            this.currentClickedIDs = [];
            this.removeButton();
            this.removeDeleteButton();
            this.show();
            // Hier können Sie den Code für die Aktion des zweiten Buttons einfügen
        });
        let addButton = this.buttonContainer.querySelector("#add-int-res-button");
        if(addButton){
            this.buttonContainer.insertBefore(deleteButton, addButton);
        }
        else{
            this.buttonContainer.appendChild(deleteButton);
        }
    }

    removeDeleteButton() {
        let deleteButton = this.buttonContainer.querySelector("#delete-int-res-button");

        if (deleteButton) {
            this.buttonContainer.removeChild(deleteButton);
        }
    }
}

export default GradeCalculatorView;