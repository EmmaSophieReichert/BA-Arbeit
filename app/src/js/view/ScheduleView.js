import { GridStack } from '../../../../node_modules/gridstack/dist/gridstack.js';
import modalView from './modals/ModalView.js';
import { Observable, Event } from '../utils/Observable.js';
import { studies, setStudyInstance } from '../model/studiesInstance.js';
import Config from '../utils/Config.js';
import moduleModalView from './modals/ModuleModalView.js';
import html2canvas from '../html2canvas/html2canvas.esm.js';
import errorModalView from './modals/ErrorModalView.js';


class ScheduleView extends Observable {

    constructor() {
        super();

        this.initNavView();

        modalView.addEventListener("onModuleChanged", e => {
            if (window.location.hash === "#schedule") {
                this.updateStudy();
                this.notifyAll(e);
            }
        });

        errorModalView.addEventListener("onModuleMoved", e => {
            if (window.location.hash === "#schedule") {
                this.changeWidgets(e.data);
                this.currentDraggedModuleID = null;
            }
        });
        errorModalView.addEventListener("onDecline", e => {
            if (window.location.hash === "#schedule") {
                this.show(studies);
                this.currentDraggedModuleID = null;
            }
        });

        this.grid = null;
        this.timerId = null;
        this.currentDraggedModuleID = null;

        this.gridContainer = document.querySelector('.grid-stack');
        this.gridContainer.addEventListener('click', (event) => {
            var widget = event.target.closest('.grid-stack-item');
            if (widget !== null) {
                if (widget.getAttribute("gs-y") !== "0") {
                    let id = widget.getAttribute("gs-id"),
                        data = studies.getModuleAndSubjectByID(id);
                    moduleModalView.show(data.module, data.subject);
                    moduleModalView.addEventListener("onModuleChanged", (e) => {
                        if (window.location.hash === "#schedule") {
                            this.updateStudy();
                            this.notifyAll(e);
                        }
                    });
                }
            }
        });

        document.getElementById("print-button").addEventListener("click", () => {
            this.printDiv();
        });
        document.getElementById("PNG-button").addEventListener("click", () => {
            this.savePNG();
        });
    }

    initNavView() {
        let navs = document.querySelectorAll(".navigation-button");
        for (let nav of navs) {
            nav.classList.remove("selected-side");
        }
        document.getElementById("nav-schedule").classList.add("selected-side");
    }

    showModal(subjectTitle) {
        modalView.show(subjectTitle);
    }

    updateStudy() {
        this.grid.removeAll();
        this.show(studies);
    }

    show(study) {
        let semesters = study.semesters;
        if (this.grid === null) {
            this.initGrid(semesters.length);
        }
        else {
            this.grid.removeAll();
            this.grid.column(semesters.length);
        }
        this.initSemesters(semesters);
        for (let subject of study.subjects) {
            for (let module of subject.modules) {
                this.addModule(module, subject.colourCode);
            }
        }
        this.adjustFontSizeToHeight();
    }

    adjustFontSizeToHeight() {
        let leftElements = document.querySelectorAll(".module-div-left");
        for (let moduleDivLeft of leftElements) {
            if (moduleDivLeft.scrollHeight > moduleDivLeft.clientHeight) { //&& moduleDivLeft.scrollTop === 0){
                this.adjustSize(moduleDivLeft);
            }
        }
    }

    adjustSize(moduleDivLeft) {
        let currentFontSize = window.getComputedStyle(moduleDivLeft).fontSize,
            newFontSize = parseFloat(currentFontSize) - 1;
        moduleDivLeft.style.fontSize = newFontSize + "px";
        if (moduleDivLeft.scrollHeight > moduleDivLeft.clientHeight && parseFloat(currentFontSize) > 11) {
            this.adjustSize(moduleDivLeft);
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
        this.grid.offAll();
        this.grid.on('change', this.handleWidgetChange.bind(this));
        this.grid.on('dragstart', this.handleDragStart.bind(this));
        this.grid.on('dragstop', this.handleDragStop.bind(this));
    }

    initSemesters(semesters) {
        for (let semester of semesters) {
            let period = semester.period,
                count = semester.count,
                ects = semester.ECTS,
                semesterWidget = this.getSemesterWidget(period, count, ects);
            this.grid.addWidget(semesterWidget);
            this.grid.save();
            let div = document.getElementById("semester-" + count + "-div");
            this.adjustSize(div);
        }
    }

    getSemesterWidget(period, count, ects) {
        let div = document.createElement("div");

        let h3 = document.createElement("h3");
        h3.innerHTML = "<b>" + "Semester " + count + "</b>";

        let p = document.createElement("p");
        p.id = "sem" + count + "ects";
        p.innerHTML = ects + " ECTS";

        div.innerHTML = h3.outerHTML + p.outerHTML;
        div.className = "semester";
        div.id = "semester-" + count + "-div";
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
            moduleDivRight = ScheduleView.getModuleDivRight(module, colourCode);
        moduleDiv.classList.add('module-div');
        moduleDiv.id = module.ID + "-div";

        moduleDiv.appendChild(moduleDivLeft);
        moduleDiv.appendChild(moduleDivRight);

        return moduleDiv.outerHTML;
    }

    static getModuleDivLeft(module, colourCode) {
        let moduleDivLeft = document.createElement('div');
        moduleDivLeft.classList.add('module-div-left');

        if (module.passed) {
            moduleDivLeft.style.backgroundColor = "white";
            moduleDivLeft.style.borderTop = "4px solid " + Config.COLOUR_CODES[colourCode];
            moduleDivLeft.style.borderLeft = "4px solid " + Config.COLOUR_CODES[colourCode];
            moduleDivLeft.style.borderBottom = "4px solid " + Config.COLOUR_CODES[colourCode];
        }
        else {
            moduleDivLeft.style.backgroundColor = Config.COLOUR_CODES[colourCode];
        }

        let moduleAbbreviation = document.createElement('span');
        moduleAbbreviation.classList.add('module-abbreviation');
        moduleAbbreviation.textContent = module.ID;

        let moduleTitle = document.createElement('h3');
        moduleTitle.classList.add('module-title');
        moduleTitle.textContent = module.title;

        moduleDivLeft.appendChild(moduleAbbreviation);
        moduleDivLeft.appendChild(moduleTitle);

        return moduleDivLeft;
    }

    static getModuleDivRight(module, colourCode) {
        let moduleDivRight = document.createElement('div');
        moduleDivRight.classList.add('module-div-right');

        if (module.passed) {
            moduleDivRight.style.backgroundColor = Config.COLOUR_CODES[colourCode];
        }
        else {
            moduleDivRight.style.backgroundColor = Config.COLOUR_CODES_DARK[colourCode];
        }

        let ectsBox = document.createElement('div');
        let ectsCount = document.createElement('p');
        let ectsDescription = document.createElement('p');
        ectsCount.classList.add("ects-count");
        ectsCount.textContent = module.ECTS;
        ectsDescription.classList.add("ects-description");
        ectsDescription.textContent = "ECTS";
        ectsBox.classList.add('ects-box');
        ectsBox.innerHTML = ectsCount.outerHTML + ectsDescription.outerHTML;

        let turnusBox = document.createElement('div');
        turnusBox.classList.add('turnus-box');
        let symbol;
        switch (module.period) {
            case "Wintersemester": symbol = "❄️"; break;
            case "Sommersemester": symbol = "☀️"; break;
            case "beide": symbol = "<p>❄️</p><p>☀️</p>"; break;
            default: symbol = "<p>❄️</p><p>☀️</p>"; break;
        }
        turnusBox.innerHTML = symbol;

        moduleDivRight.appendChild(ectsBox);
        moduleDivRight.appendChild(turnusBox);

        return moduleDivRight;
    }

    handleWidgetChange(event, items) {
        if (this.checkForErrors(items)) {
            this.changeWidgets(items);
        }
    }

    changeWidgets(items) {
        let stud = studies;
        items.forEach(item => {
            stud.changeModulePosition(item.id, item.x, item.y);
            stud.calculateSemesterECTS();
        });
        if (stud) {
            setStudyInstance(stud);
        }
        for (let i = 1; i <= studies.semesters.length; i++) {
            this.updateSemesterECTS(i);
        }
        //if there are many events right after another, only one Event will be thrown for change
        //Otherwise: DB is overloaded
        if (this.timerId === null) {
            this.timerId = setTimeout(() => {
                let e = new Event("positionsChanged", "positionsChanged");
                this.notifyAll(e);
                this.timerId = null;
            }, 1500);
        }
    }

    checkForErrors(items) {
        for (let item of items) {
            let oldMod = studies.getModuleAndSubjectByID(this.currentDraggedModuleID),
                oldPosition = null;
            if (oldMod) {
                oldPosition = oldMod.module.selectedSemester[0];
            }
            if (item.id === this.currentDraggedModuleID && item.x + 1 !== oldPosition) {
                let semCount = item.x + 1,
                    semester = studies.getSemester(semCount),
                    module = studies.getModuleAndSubjectByID(item.id).module;
                if (semester && module) {
                    //check for turnus
                    if (module.period !== "beide" && semester.period !== module.period) {
                        errorModalView.showTurnus(module, semester.period, item.x, item.y, items);
                        return false;
                    }
                    //check for conditions
                    if (module.conditions) {
                        for (let con of module.conditions) {
                            let data = studies.getModuleAndSubjectByID(con);
                            if (data) {
                                let pos = data.module.selectedSemester[data.module.selectedSemester.length - 1];
                                if (semCount <= pos) {
                                    errorModalView.showConditions(module, item.x, item.y, items);
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
        }
        return true;
    }

    handleDragStart(event, el) {
        let data = studies.getModuleAndSubjectByID(el.getAttribute("gs-id")),
            module = data.module,
            subject = data.subject,
            recSem = [];
        //show recommended semester
        if (module.recommendedSemester) {
            for (let i = 0; i < module.minSemLength; i++) {
                recSem.push(module.recommendedSemester + i);
            }
            for (let i of recSem) {
                let semDiv = document.getElementById("semester-" + i + "-div");
                if (semDiv) {
                    semDiv.style.border = "none";
                    if (studies.getSemester(i).period === "Wintersemester") {
                        semDiv.style.background = "linear-gradient(120deg, #0079ccff, #97ead2ff)";
                    }
                    else {
                        semDiv.style.background = "linear-gradient(120deg, var(--apricot), var(--brilliant-rose))";
                    }
                    semDiv.style.color = "white";
                    semDiv.style.padding = "4px";
                }
            }
        }
        //show conditions
        if (!module.conditions) { return; }
        if (module.conditions.length !== 0) {
            for (let con of module.conditions) {
                let modDiv = document.getElementById(con + "-div");
                if (modDiv) {
                    modDiv.classList.add("dragging-condition");
                }
            }
        }
    }

    handleDragStop(event, el) {
        this.currentDraggedModuleID = el.getAttribute("gs-id");
        let module = studies.getModuleAndSubjectByID(el.getAttribute("gs-id")).module,
            recSem = [];
        if (module.recommendedSemester) {
            for (let i = 0; i < module.minSemLength; i++) {
                recSem.push(module.recommendedSemester + i);
            }
            for (let i of recSem) {
                let semDiv = document.getElementById("semester-" + i + "-div");
                if (semDiv) {
                    semDiv.removeAttribute("style");
                }
            }
        }
        if (!module.conditions) { return; }
        if (module.conditions.length !== 0) {
            for (let con of module.conditions) {
                let modDiv = document.getElementById(con + "-div");
                if (modDiv) {
                    modDiv.classList.remove("dragging-condition");
                }
            }
        }
    }

    updateSemesterECTS(semesterCount) {
        let semP = document.getElementById("sem" + semesterCount + "ects"),
            semester = studies.getSemester(semesterCount);
        if (semP) {
            semP.innerHTML = semester.ECTS + " ECTS";
        }
    }

    //save png
    savePNG() {
        let gr = document.querySelector(".grid-stack");
        html2canvas(gr).then(function (canvas) {
            var dataURL = canvas.toDataURL("image/png");
            var link = document.createElement('a');
            link.href = dataURL;
            link.download = 'mein-studienverlauf.png';
            link.click();
        });
    }

    //open new window to print div
    printDiv() {
        let gr = document.querySelector(".grid-stack");
        html2canvas(gr).then(function (canvas) {
            var dataURL = canvas.toDataURL("image/png");

            var windowContent = '<!DOCTYPE html>';
            windowContent += '<html>'
            windowContent += '<head><title>Mein Studienverlauf</title></head>';
            windowContent += '<body>'
            windowContent += '<img src="' + dataURL + '">';
            windowContent += '</body>';
            windowContent += '</html>';
            var printWin = window.open('', '', 'width=340,height=260');
            printWin.document.open();
            printWin.document.write(windowContent);
            printWin.document.close();
            printWin.focus();
            printWin.print();
        });
    }
}

export default ScheduleView;