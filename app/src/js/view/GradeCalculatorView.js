// import { GridStack } from 'gridstack';
import { GridStack } from '../../../../node_modules/gridstack/dist/gridstack.js';
import Module from '../model/structure/Module.js';
import modalView from './ModalView.js';
import { Observable, Event } from '../utils/Observable.js';
import { studies, setStudyInstance } from '../model/studiesInstance.js';
import Config from '../utils/Config.js';
import moduleModalView from './ModuleModalView.js';


class GradeCalculatorView extends Observable {

    constructor() {
        super();
        this.chart = null;

        this.nodes = null;

        this.currentClickedIDs = [];
        this.buttonContainer = document.getElementById("add-int-res-button-container");
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
                var nodeId = element.getAttribute("id");
                this.handleClick(nodeId);
                //var node = this.chart.tree.getNodeById(nodeId);
                //console.log("CLICK ON " + node);
                // if (node) {
                //     handleClick(node);
                // }
            });
        });
    }

    // different look, add to array
    handleClick(nodeID) {
        let nodeElement = document.getElementById(nodeID);
        // Prove if nodeID is in Array
        let index = this.currentClickedIDs.indexOf(nodeID);
        if (index === -1) {
            nodeElement.style.border = "2px solid pink";
            this.currentClickedIDs.push(nodeID);
            this.updateButton();
        } else {
            nodeElement.style.border = "";
            this.currentClickedIDs.splice(index, 1);
            this.updateButton();
        }
    }

    createButton() {
        // Überprüfen, ob der Button bereits vorhanden ist
        if (this.buttonContainer.querySelector("button")) {
            return;
        }

        var button = document.createElement("button");
        button.textContent = "Zwischenergebnis hinzufügen";
        button.classList.add("register-button");
        button.addEventListener("click", () => {
            studies.addIntermediateResult(this.currentClickedIDs);
            this.show()
            //this.show();
            this.currentClickedIDs = [];
            this.removeButton();
        });

        this.buttonContainer.appendChild(button);
    }

    removeButton() {
        var button = this.buttonContainer.querySelector("button");

        // Überprüfen, ob der Button vorhanden ist
        if (button) {
            this.buttonContainer.removeChild(button);
        }
    }

    updateButton() {
        console.log(this.currentClickedIDs);
        if (this.currentClickedIDs.length > 0) {
            this.createButton();
        } else {
            this.removeButton();
        }
    }

}

export default GradeCalculatorView;