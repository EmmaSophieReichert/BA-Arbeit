//import { GridStack } from 'gridstack';
import { GridStack } from '../../../../node_modules/gridstack/dist/gridstack.js';
import Module from '../model/structure/Module.js';
import ModalView from './ModalView.js';
import {Observable, Event} from '../utils/Observable.js';
import { studies, setStudyInstance } from '../model/studiesInstance.js';
import Config from '../utils/Config.js';

class CatalogueView extends Observable{

    constructor() {
        super();
        // this.modalView = new ModalView();
        // this.modalView.addEventListener("onModuleAdded", e => { 
        //     this.addModule(e.data.module, Config.COLOUR_CODES[e.data.subject]);
        //     this.notifyAll(e);
        //  });

        this.grid = null;
        this.timerId = null;
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
        moduleDiv.style.backgroundColor = Config.COLOUR_CODES[colourCode];

        let ectsBox = document.createElement('div');
        ectsBox.classList.add('ects-box');
        ectsBox.textContent = module.ECTS + " ECTS";
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
        //         console.log("Timer finished");
        //         this.timerId = null;
        //         console.log(studies);
        //         let e = new Event("positionsChanged", "positionsChanged");
        //         this.notifyAll(e);
        //     }, 5000);
        // }
    }

    
    
}

export default CatalogueView;