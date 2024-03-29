//import { GridStack } from 'gridstack';
import { GridStack } from '../../../../node_modules/gridstack/dist/gridstack.js';
import Module from '../model/structure/Module.js';
import modalView from './modals/ModalView.js';
import { Observable, Event } from '../utils/Observable.js';
import { studies, setStudyInstance } from '../model/studiesInstance.js';
import Config from '../utils/Config.js';
import moduleModalView from './modals/ModuleModalView.js';
import ScheduleView from './ScheduleView.js';

class CatalogueView extends Observable {

    constructor() {
        super();

        this.initNavView();

        modalView.addEventListener("onModuleChanged", e => {
            if (window.location.hash === "#module-catalogue") {
                this.show(studies);
            }

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
                    if (window.location.hash === "#module-catalogue") {
                        this.show(studies);
                    }
                });
            }
        });
    }

    showModal(subjectTitle) {
        modalView.show(subjectTitle);
    }

    initNavView() {
        let navs = document.querySelectorAll(".navigation-button");
        for (let nav of navs) {
            nav.classList.remove("selected-side");
        }
        document.getElementById("nav-catalogue").classList.add("selected-side");
    }

    show(study) {
        if (this.grid !== null) {
            this.grid.removeAll();
        }
        this.initGrid(1);
        for (let subject of study.subjects) {
            for (let module of subject.modules) {
                this.addModule(module, subject.colourCode);
            }
        }
    }

    initGrid(count) {
        var options = {
            column: count,
            cellHeight: "100px",
            disableOneColumnMode: true,
            float: false,
            margin: 8,
        }
        this.grid = GridStack.init(options);
        this.grid.load([]);
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
        let moduleDiv = document.createElement('div'),
            moduleDivLeft = ScheduleView.getModuleDivLeft(module, colourCode),
            moduleDivRight = ScheduleView.getModuleDivRight(module, colourCode),
            moduleDivMiddle = this.getModuleDivMiddle(module, colourCode);
        moduleDiv.classList.add('module-div');
        moduleDiv.appendChild(moduleDivLeft);
        if (module.conditions) {
            if (module.conditions.length !== 0) {
                let moduleDivConditions = this.getModuleDivConditions(module, colourCode);
                moduleDiv.appendChild(moduleDivConditions);
            }
        }
        moduleDiv.appendChild(moduleDivMiddle);
        moduleDiv.appendChild(moduleDivRight);

        return moduleDiv.outerHTML;
    }

    getModuleDivConditions(module, colourCode) {
        let conditionsDiv = document.createElement("div"),
            description = document.createElement("p"),
            cond = document.createElement("p");
        conditionsDiv.classList.add("module-div-middle");
        description.textContent = "Voraussetzungen: ";
        let condString = module.getConditionString();
        cond.textContent = condString;

        if (module.passed) {
            conditionsDiv.style.backgroundColor = "white";
            conditionsDiv.style.borderTop = "4px solid " + Config.COLOUR_CODES[colourCode];
            conditionsDiv.style.borderBottom = "4px solid " + Config.COLOUR_CODES[colourCode];
        }
        else {
            conditionsDiv.style.backgroundColor = Config.COLOUR_CODES[colourCode];
        }

        conditionsDiv.appendChild(description);
        conditionsDiv.appendChild(cond);

        return conditionsDiv;
    }

    getModuleDivMiddle(module, colourCode) {
        let middle = document.createElement("div"),
            recommendedSem = document.createElement("p"),
            selectedSem = document.createElement("p"),
            length = document.createElement("p");
        middle.classList.add("module-div-middle");
        if (module.recommendedSemester) {
            recommendedSem.textContent = "Empfohlenes Semester: " + module.recommendedSemester;
        }
        let selSem = "Ausgewählte Semester: ";
        for (let i = 0; i < module.selectedSemester.length; i++) {
            if ((i + 1) === module.selectedSemester.length) {
                selSem += module.selectedSemester[i];
            }
            else {
                selSem += module.selectedSemester[i] + ", ";
            }
        }
        selectedSem.textContent = selSem;
        length.textContent = "Länge in Semestern: " + module.minSemLength;

        if (module.passed) {
            middle.style.backgroundColor = "white";
            middle.style.borderTop = "4px solid " + Config.COLOUR_CODES[colourCode];
            middle.style.borderBottom = "4px solid " + Config.COLOUR_CODES[colourCode];
        }
        else {
            middle.style.backgroundColor = Config.COLOUR_CODES[colourCode];
        }

        middle.append(selectedSem);
        middle.append(recommendedSem);
        middle.append(length);

        return middle;
    }
}

export default CatalogueView;