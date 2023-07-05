import { GridStack } from 'gridstack';
import Module from '../model/structure/Module.js';
import ModalView from './ModalView.js';
import Config from '../utils/Config.js';
import { Observable, Event } from '../utils/Observable.js';
import { studies } from '../model/studiesInstance.js';

class CatalogueViewRight extends Observable {

    constructor() {
        super();
        this.studyBoxesContainer = document.getElementById("study-boxes-container");
        this.filterContainer = document.getElementById('filter-container');
        this.checkboxes = null;
    }

    showStudy(study) {
        this.fillFilters();
        this.checkboxes = this.filterContainer.querySelectorAll('input[type="checkbox"]');
        this.checkboxes.forEach((checkbox) => {
            checkbox.addEventListener('change', () => { this.getFilteredValues(); });
        });
        for (let subject of study.subjects) {
            this.showSubject(subject);
        }
    }

    showSubject(subject) {
        let div = document.createElement("div");
        div.className = "subject-box";
        div.style.backgroundColor = Config.COLOUR_CODES[subject.colourCode];
        let h2 = document.createElement("h3");
        h2.innerHTML = subject.title;
        h2.className = "subject-box-title";

        let progressBar = this.getProgressbar(subject.ects, subject.currentECTS, subject.colourCode);

        let addModuleButton = document.createElement("button");
        addModuleButton.className = "add-module-button";
        addModuleButton.id = subject.title + "-button";
        addModuleButton.style.backgroundColor = Config.COLOUR_CODES_DARK[subject.colourCode];
        addModuleButton.textContent = "Modul hinzufügen";


        // div.innerHTML = h2.outerHTML + progressBar.outerHTML + addModuleButton.outerHTML; TODO: enable
        div.innerHTML = h2.outerHTML + addModuleButton.outerHTML;
        this.studyBoxesContainer.appendChild(div);

        addModuleButton = document.getElementById(subject.title + "-button");
        addModuleButton.addEventListener('click', () => {
            console.log("Clickes");
            let e = new Event("onAddModuleButtonClicked", subject.title);
            this.notifyAll(e);
        });
    }

    getProgressbar(totalECTS, currentECTS, colourCode) {
        let progressBar = document.createElement("div"),
            progress = document.createElement("div"),
            progressText = document.createElement("div");
        progress.className = "progress";
        progress.style.backgroundColor = Config.COLOUR_CODES_DARK[colourCode];
        progressBar.className = "progress-bar";
        progressText.className = "progress-text";
        //progress.style.width = (currentECTS / totalECTS) * 100 + '%';
        progress.style.width = "50%"; //TODO: Remove this
        progressText.textContent = currentECTS + '/' + totalECTS + ' ECTS';
        progressBar.innerHTML = progress.outerHTML + progressText.outerHTML;
        return progressBar;
    }

    getSemesterWidget(period, count) {


        let pPeriod = document.createElement("p");
        pPeriod.id = "sem" + count + "period";
        pPeriod.innerHTML = period;

        let h3 = document.createElement("h3");
        h3.innerHTML = "<b>" + "Semester " + count + "</b>";

        let p = document.createElement("p");
        p.id = "sem" + count + "ects";
        p.innerHTML = "0 ECTS";

        div.innerHTML = pPeriod.outerHTML + h3.outerHTML + p.outerHTML;
        div.className = "semester";
        div.classList.add(period);
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

    getFilteredValues() {
        let filterValues = {
            inPlan: this.filterContainer.querySelector('input[name="plan"][value="inPlan"]').checked,
            notInPlan: this.filterContainer.querySelector('input[name="plan"][value="notInPlan"]').checked,
            subjects: Array.from(this.filterContainer.querySelectorAll('input[name="subject"]:checked')).map(function (checkbox) {
                return checkbox.value;
            }),
            turnusWinter: this.filterContainer.querySelector('input[name="turnus"][value="winter"]').checked,
            turnusSommer: this.filterContainer.querySelector('input[name="turnus"][value="sommer"]').checked,
            turnusBoth: this.filterContainer.querySelector('input[name="turnus"][value="beide"]').checked,
            recommendedSemester: Array.from(this.filterContainer.querySelectorAll('input[name="recommended-semester"]:checked')).map(function (checkbox) {
               return parseInt(checkbox.value);
            }),
            selectedSemester: Array.from(this.filterContainer.querySelectorAll('input[name="selected-semester"]:checked')).map(function (checkbox) {
                return parseInt(checkbox.value);
            })
        };

        console.log(filterValues);

        //return filterValues;

    }

    fillFilters() {
        let subjectsContainer = document.getElementById('subjects-container');
        let recommendedSemesterContainer = document.getElementById('recommended-semester-container');
        let selectedSemesterContainer = document.getElementById('selected-semester-container');


        // subjects
        studies.subjects.forEach(function (subject) {  
            let label = document.createElement('label');         

            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'subject';
            checkbox.value = subject.title;
            checkbox.id = 'subject-' + subject.title;

            label.innerHTML = checkbox.outerHTML + " "  + subject.title;
            console.log(label);
            subjectsContainer.appendChild(label);
        });

        // semesters
        studies.semesters.forEach(function (semester) {
            let label = document.createElement('label');

            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'recommended-semester';
            checkbox.value = semester.count;
            checkbox.id = 'recommended-semester-' + semester.count;

            label.innerHTML = checkbox.outerHTML + " "  + semester.count;
            recommendedSemesterContainer.appendChild(label);

            label = document.createElement('label');

            checkbox.name = 'selected-semester';
            checkbox.id = 'selected-semester-' + semester;

            label.innerHTML = checkbox.outerHTML + " "  + semester.count;
            selectedSemesterContainer.appendChild(label);
        });

    }
}

export default CatalogueViewRight;