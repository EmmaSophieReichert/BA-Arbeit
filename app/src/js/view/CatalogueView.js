//import { GridStack } from 'gridstack';
import { GridStack } from '../../../../node_modules/gridstack/dist/gridstack.js';
import Module from '../model/structure/Module.js';
import modalView from './ModalView.js';
import {Observable, Event} from '../utils/Observable.js';
import { studies, setStudyInstance } from '../model/studiesInstance.js';
import Config from '../utils/Config.js';
import moduleModalView from './ModuleModalView.js';

class CatalogueView extends Observable{

    constructor() {
        super();

        modalView.addEventListener("onModuleChanged", e => {
            console.log("Module added");
            // if(e.data.root === "edit"){
            //     this.show(studies);
            // }
            // this.addModule(e.data.module, e.data.subject);
            this.show(studies);
            //this.notifyAll(e);
        });

        this.grid = null;
        this.timerId = null;

        this.gridContainer = document.querySelector('.grid-stack');
        this.gridContainer.addEventListener('click', (event) => {
            var widget = event.target.closest('.grid-stack-item');
            if (widget !== null) {
                let id = widget.getAttribute("gs-id"),
                    data = studies.getModuleAndSubjectByID(id);
                moduleModalView.show(data.module, data.subject);
                moduleModalView.addEventListener("onModuleChanged", (e) => {
                    this.show(studies);
                    //this.notifyAll(e);
                });
            }
        });
    }

    showModal(subjectTitle) {
        modalView.show(subjectTitle);
    }

    show(study) {
        if(this.grid !== null){
            this.grid.removeAll();
        }
        this.initGrid(1);
        for(let subject of study.subjects){
            for(let module of subject.modules){
                this.addModule(module, subject.colourCode);
            }
        }
    }

    initGrid(count) {
        var options = {
            column: count,
            cellHeight: "100px",
            disableOneColumnMode: true,
            float: false
        }
        this.grid = GridStack.init(options);
        this.grid.load([]);
        //this.grid.on('change', this.handleWidgetChange.bind(this));
    }

    addModule(module, colourCode) {
        let moduleWidget = {
            x: module.selectedSemester[0] - 1,
            y: module.posY,
            id: module.ID,
            w: module.minSemLength,
            noResize: true,
            content: this.getModuleDiv(module, colourCode),
        }
        this.grid.addWidget(moduleWidget);
        this.grid.save();
    }

    getModuleDiv(module, colourCode) {
        let moduleDiv = document.createElement('div');
        moduleDiv.classList.add('module-div');
        if(module.passed){
            moduleDiv.style.backgroundColor = "white";//Config.COLOUR_CODES[colourCode];
            //moduleDiv.style.boxShadow = "inset 0px 0px 20px " + Config.COLOUR_CODES[colourCode];
            moduleDiv.style.border = "4px solid " + Config.COLOUR_CODES[colourCode];
            // moduleDiv.style.backgroundColor = "white";
        }
        else{
            moduleDiv.style.backgroundColor = Config.COLOUR_CODES[colourCode];
        }

        let ectsBox = document.createElement('div');
        ectsBox.classList.add('ects-box');
        ectsBox.textContent = module.ECTS + " ECTS";
        if(module.passed){
            ectsBox.style.borderRadius = "0.3em";
        }
        else{
            //ectsBox.style.backgroundColor = Config.COLOUR_CODES_DARK[colourCode];
        }
        ectsBox.style.backgroundColor = Config.COLOUR_CODES_DARK[colourCode];

        let moduleAbbreviation = document.createElement('span');
        moduleAbbreviation.classList.add('module-abbreviation');
        moduleAbbreviation.textContent = module.ID;

        let moduleTitle = document.createElement('h3');
        moduleTitle.classList.add('module-title');
        moduleTitle.textContent = module.title;

        moduleDiv.appendChild(ectsBox);
        moduleDiv.appendChild(moduleAbbreviation);
        moduleDiv.appendChild(moduleTitle);

        return moduleDiv.outerHTML;
    }

    handleWidgetChange(event, items) {
        // items.forEach(item => {
        //     let stud = studies;
        //     stud.changeModulePosition(item.id, item.x, item.y);
        //     stud.calculateSemesterECTS();
        //     setStudyInstance(stud);
        // });
        // for(let i = 1; i<= studies.semesters.length; i++){
        //     this.updateSemesterECTS(i);
        // }
        // if (this.timerId === null) {
        //     this.timerId = setTimeout(() => {
        //         this.timerId = null;
        //         let e = new Event("positionsChanged", "positionsChanged");
        //         this.notifyAll(e);
        //     }, 5000);
        // }
    }

    
    
}

export default CatalogueView;