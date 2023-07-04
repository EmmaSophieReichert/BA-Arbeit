import { GridStack } from 'gridstack';
import Module from '../model/structure/Module.js';
import ModalView from './ModalView.js';
import {Observable, Event} from '../utils/Observable.js';
import { studies, setStudyInstance } from '../model/studiesInstance.js';


class ScheduleView extends Observable {

    constructor() {
        super();
        this.modalView = new ModalView();
        this.modalView.addEventListener("onModuleAdded", e => { 
            this.addModule(e.data);
            this.notifyAll(e);
         });

        this.grid = null;
        this.timerId = null;
        // var items = [
        //     {
        //         x: 0, y: 1,
        //         content: 'my first widget',
        //         //locked: true
        //     }, // will default to location (0,0) and 1x1
        //     {
        //         x: 2, y: 1,
        //         w: 2, content: 'another longer widget!',
        //         //locked: true
        //     } // will be placed next at (1,0) and 2x1
        // ];
        // var options = {
        //     column: 6, 
        //     cellHeight: "100px",
        //     disableOneColumnMode: true,
        //     float: false
        // }
        // this.grid = GridStack.init(options);
        // this.grid.load(items);
        // this.setSemesters(6);
    }

    show(study) {
        console.log(study);
        let semesters = study.semesters;
        this.initGrid(semesters.length);
        this.initSemesters(semesters);
        for(let subject of study.subjects){
            for(let module of subject.modules){
                this.addModule(module);
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

    addModule(module) {
        let div = document.createElement("div");
        div.className = "module";
        let moduleWidget = {
            x: module.selectedSemester[0] - 1,
            y: module.posY,
            id: module.ID,
            w: module.minSemLength,
            noResize: true,
            content: this.getModuleDiv(module),
        }
        this.grid.addWidget(moduleWidget);
        this.grid.save();
    }

    getModuleDiv(module) {
        let moduleDiv = document.createElement('div');
        moduleDiv.classList.add('module-div');

        let ectsBox = document.createElement('div');
        ectsBox.classList.add('ects-box');
        ectsBox.textContent = module.ECTS + " ECTS";

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
        items.forEach(item => {
            let stud = studies;
            stud.changeModulePosition(item.id, item.x, item.y);
            stud.calculateSemesterECTS();
            setStudyInstance(stud);
        });
        for(let i = 1; i<= studies.semesters.length; i++){
            this.updateSemesterECTS(i);
        }
        if (this.timerId === null) {
            this.timerId = setTimeout(() => {
                console.log("Timer finished");
                this.timerId = null;
                console.log(studies);
                let e = new Event("positionsChanged", "positionsChanged");
                this.notifyAll(e);
            }, 5000);
        }
    }

    updateSemesterECTS(semesterCount){
        let semP = document.getElementById("sem" + semesterCount + "ects"),
            semester = studies.getSemester(semesterCount);
        semP.innerHTML = semester.ECTS+ " ECTS";
    }
}

export default ScheduleView;