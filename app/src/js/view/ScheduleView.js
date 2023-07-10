// import { GridStack } from 'gridstack';
import { GridStack } from '../../../../node_modules/gridstack/dist/gridstack.js';
import Module from '../model/structure/Module.js';
import modalView from './ModalView.js';
import { Observable, Event } from '../utils/Observable.js';
import { studies, setStudyInstance } from '../model/studiesInstance.js';
import Config from '../utils/Config.js';
import moduleModalView from './ModuleModalView.js';


class ScheduleView extends Observable {

    constructor() {
        super();
        modalView.addEventListener("onModuleChanged", e => {
            console.log("Module added");
            // if(e.data.root === "edit"){
            //     this.updateStudy();
            // }
            // this.addModule(e.data.module, e.data.subject);
            this.updateStudy();
            this.notifyAll(e);
        });

        this.grid = null;
        this.timerId = null;

        this.gridContainer = document.querySelector('.grid-stack');
        this.gridContainer.addEventListener('click', (event) => {
            var widget = event.target.closest('.grid-stack-item');
            if (widget !== null) {
                if(widget.getAttribute("gs-y") !== "0"){
                    let id = widget.getAttribute("gs-id"),
                        data = studies.getModuleAndSubjectByID(id);
                    moduleModalView.show(data.module, data.subject);
                    moduleModalView.addEventListener("onModuleChanged", (e) => {
                        this.updateStudy();
                        this.notifyAll(e);
                    });
                }
            }
        });
    }

    showModal(subjectTitle) {
        modalView.show(subjectTitle);
    }

    updateStudy(){
        this.grid.removeAll();
        this.show(studies);
    }

    show(study) {
        console.log(study);
        let semesters = study.semesters;
        this.initGrid(semesters.length);
        this.initSemesters(semesters);
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
            float: false
        }
        this.grid = GridStack.init(options);
        this.grid.load([]);
        this.grid.on('change', this.handleWidgetChange.bind(this));
    }

    initSemesters(semesters) {
        for (let semester of semesters) {
            let period = semester.period,
                count = semester.count,
                ects = semester.ECTS,
                semesterWidget = this.getSemesterWidget(period, count, ects);
            this.grid.addWidget(semesterWidget);
        }
    }

    getSemesterWidget(period, count, ects) {
        let div = document.createElement("div");

        // let pPeriod = document.createElement("p");
        // pPeriod.id = "sem" + count + "period";
        // pPeriod.innerHTML = period;

        let h3 = document.createElement("h3");
        h3.innerHTML = "<b>" + "Semester " + count + "</b>";

        let p = document.createElement("p");
        p.id = "sem" + count + "ects";
        p.innerHTML = ects + " ECTS";

        //div.innerHTML = pPeriod.outerHTML + h3.outerHTML + p.outerHTML;
        div.innerHTML = h3.outerHTML + p.outerHTML;
        div.className = "semester";
        div.classList.add(period);

        let semesterWidget = {
            x: count - 1,
            y: 0,
            id: "sem" + count,
            locked: true,
            noResize: true,
            noMove: true,
            content: div.outerHTML
        }
        return semesterWidget;
    }


    setSemesters(number) {
        this.grid.column(number);
        for (let i = 1; i <= number; i++) {
            let div = document.createElement("div");
            let h3 = document.createElement("h3");
            h3.innerHTML = "<b>" + "Semester " + i + "</b>";
            let p = document.createElement("p");
            p.id = "sem" + i + "ects";
            p.innerHTML = "0 ECTS";
            div.innerHTML = h3.outerHTML + p.outerHTML;
            div.className = "semester";
            let semester = {
                x: i - 1,
                y: 0,
                id: "sem" + i,
                locked: true,
                noResize: true,
                noMove: true,
                content: div.outerHTML
            }
            this.grid.addWidget(semester);
        }
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
            moduleDiv.style.backgroundColor = Config.COLOUR_CODES_DARK[colourCode];
            //moduleDiv.style.border = "5px solid " + Config.COLOUR_CODES_DARK[colourCode];
        }
        else{
            moduleDiv.style.backgroundColor = Config.COLOUR_CODES[colourCode];
        }

        let ectsBox = document.createElement('div');
        ectsBox.classList.add('ects-box');
        ectsBox.textContent = module.ECTS + " ECTS";
        if(module.passed){
            ectsBox.style.backgroundColor = Config.COLOUR_CODES_DARKEST[colourCode];
        }
        else{
            ectsBox.style.backgroundColor = Config.COLOUR_CODES_DARK[colourCode];
        }
        

        // let turnusBox = document.createElement('div'); TODO: ADD sth here
        // turnusBox.classList.add('turnus-box');
        // let symbol;
        // switch(module.period){
        //     case "Wintersemester": symbol = "❄️"; break;
        //     case "Sommersemester": symbol = "☀️"; break;
        //     case "beide": symbol = "❄️☀️"; break;
        //     default: symbol = "❄️☀️"; break;
        // }
        // turnusBox.textContent = symbol;

        let moduleAbbreviation = document.createElement('span');
        moduleAbbreviation.classList.add('module-abbreviation');
        moduleAbbreviation.textContent = module.ID;

        let moduleTitle = document.createElement('h3');
        moduleTitle.classList.add('module-title');
        moduleTitle.textContent = module.title;

        moduleDiv.appendChild(ectsBox);
        //moduleDiv.appendChild(turnusBox);
        moduleDiv.appendChild(moduleAbbreviation);
        moduleDiv.appendChild(moduleTitle);

        return moduleDiv.outerHTML;
    }

    handleWidgetChange(event, items) {
        let stud = studies;
        items.forEach(item => {
            stud.changeModulePosition(item.id, item.x, item.y);
            stud.calculateSemesterECTS();
        });
        setStudyInstance(stud);
        for (let i = 1; i <= studies.semesters.length; i++) {
            this.updateSemesterECTS(i);
        }
        if (this.timerId === null) {
            this.timerId = setTimeout(() => {
                console.log("Timer finished");
                console.log(studies);
                let e = new Event("positionsChanged", "positionsChanged");
                this.notifyAll(e);
                this.timerId = null;
            }, 1000);
        }
    }

    updateSemesterECTS(semesterCount) {
        let semP = document.getElementById("sem" + semesterCount + "ects"),
            semester = studies.getSemester(semesterCount);
        if(semP){
            semP.innerHTML = semester.ECTS + " ECTS";
        }
    }
}

export default ScheduleView;