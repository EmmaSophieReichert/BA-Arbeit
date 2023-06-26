import { GridStack } from 'gridstack';
import Module from '../model/structure/Module.js';
import ModalView from './ModalView.js';

class ScheduleView {

    constructor() {
        this.modalView = new ModalView();
        this.modalView.addEventListener("onModuleAdded", e => {this.addModule(e.data)});
        var items = [
            {
                x: 0, y: 1,
                content: 'my first widget',
                //locked: true
            }, // will default to location (0,0) and 1x1
            {
                x: 2, y: 1,
                w: 2, content: 'another longer widget!',
                //locked: true
            } // will be placed next at (1,0) and 2x1
        ];
        var options = {
            column: 6, 
            cellHeight: "100px",
            disableOneColumnMode: true,
            float: false
        }
        this.grid = GridStack.init(options);
        this.grid.load(items);
        this.setSemesters(6);
    }

    setSemesters(number){
        this.grid.column(number);
        for(let i = 1; i <= number; i++){
            let div = document.createElement("div");
            let h3 = document.createElement("h3");
            h3.innerHTML = "<b>" + "Semester " + i + "</b>";
            let p = document.createElement("p");
            p.id = "sem" + i + "ects";
            p.innerHTML = "0 ECTS";
            div.innerHTML = h3.outerHTML + p.outerHTML;
            div.className = "semester";
            let semester = {
                x: i-1,
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

    addModule(module){
        let div = document.createElement("div");
        div.className = "module";
        let moduleWidget = {
            x: module.selectedSemester[0],
            id: module.ID,
            w: module.minSemLength,
            noResize: true,
            content: module.title
        }
        console.log(module);
        this.grid.addWidget(moduleWidget);
        this.grid.save();
    }
}

export default ScheduleView;