import Config from '../utils/Config.js';
import { Observable, Event } from '../utils/Observable.js';
import { studies } from '../model/studiesInstance.js';

class CatalogueViewRight extends Observable {

    constructor() {
        super();
        this.studyBoxesContainer = document.getElementById("study-boxes-container");
        this.filterContainer = document.getElementById('filter-container');
        this.checkboxes = null;
        this.resetFilterButton = document.getElementById("reset-filter-button");
        this.resetFilterButton.addEventListener("click", () => {
            this.resetCheckboxes();
        })
    }

    show(study) {
        this.fillFilters();
        this.checkboxes = this.filterContainer.querySelectorAll('input[type="checkbox"]');
        this.checkboxes.forEach((checkbox) => {
            checkbox.addEventListener('change', () => {
                let e = new Event("onFilterValues", this.getFilteredValues());
                this.notifyAll(e);
            });
        });
        this.showStudy(study);
    }

    resetCheckboxes(){
        if(this.checkboxes){
            this.checkboxes.forEach((checkbox) => {
                checkbox.checked = false;
            });
            let e = new Event("onFilterValues", this.getFilteredValues());
            this.notifyAll(e);
        }
    }

    showStudy(study) {
        for (let subject of study.subjects) {
            this.showSubject(subject);
        }
    }

    async showSubject(subject) {
        let div = document.createElement("div");
        div.className = "subject-box";
        div.style.backgroundColor = Config.COLOUR_CODES[subject.colourCode];
        let h2 = document.createElement("h3");
        h2.innerHTML = subject.title;
        h2.className = "subject-box-title";

        let addModuleButton = document.createElement("button");
        addModuleButton.className = "add-module-button";
        addModuleButton.id = subject.title + "-button";
        addModuleButton.style.backgroundColor = Config.COLOUR_CODES_DARK[subject.colourCode];
        addModuleButton.textContent = "Modul hinzufügen";

        div.innerHTML = h2.outerHTML + addModuleButton.outerHTML;
        await this.studyBoxesContainer.appendChild(div);

        addModuleButton = document.getElementById(subject.title + "-button");
        addModuleButton.addEventListener('click', () => {
            let e = new Event("onAddModuleButtonClicked", subject.title);
            this.notifyAll(e);
        });
    }

    getFilteredValues() {
        let filterValues = {
            inPlan: this.filterContainer.querySelector('input[name="plan"][value="inPlan"]').checked,
            notInPlan: this.filterContainer.querySelector('input[name="plan"][value="notInPlan"]').checked,
            passed: Array.from(this.filterContainer.querySelectorAll('input[name="passed"]:checked')).map(function (checkbox) {
                return checkbox.value;
            }),
            subjects: Array.from(this.filterContainer.querySelectorAll('input[name="subject"]:checked')).map(function (checkbox) {
                return checkbox.value;
            }),
            turnus: Array.from(this.filterContainer.querySelectorAll('input[name="turnus"]:checked')).map(function (checkbox) {
                return checkbox.value;
            }),
            recommendedSemester: Array.from(this.filterContainer.querySelectorAll('input[name="recommended-semester"]:checked')).map(function (checkbox) {
                return parseInt(checkbox.value);
            }),
            selectedSemester: Array.from(this.filterContainer.querySelectorAll('input[name="selected-semester"]:checked')).map(function (checkbox) {
                return parseInt(checkbox.value);
            })
        };

        return filterValues;
    }

    fillFilters() {
        let subjectsContainer = document.getElementById('subjects-container');
        let recommendedSemesterContainer = document.getElementById('recommended-semester-container');
        let selectedSemesterContainer = document.getElementById('selected-semester-container');

        // subjects
        if (studies.subjects.length > 1 && subjectsContainer) {
            studies.subjects.forEach((subject) => {
                let label = document.createElement('label');

                let checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'subject';
                checkbox.value = subject.title;
                checkbox.id = 'subject-' + subject.title;

                label.innerHTML = checkbox.outerHTML + " " + subject.title;
                subjectsContainer.appendChild(label);
            });
            subjectsContainer.removeAttribute("hidden"); 
        }
        
        // semesters
        if(recommendedSemesterContainer && selectedSemesterContainer){
            studies.semesters.forEach((semester) => {
                let label = document.createElement('label');

                let checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'recommended-semester';
                checkbox.value = semester.count;
                checkbox.id = 'recommended-semester-' + semester.count;

                label.innerHTML = checkbox.outerHTML + " " + semester.count;
                recommendedSemesterContainer.appendChild(label);

                label = document.createElement('label');

                checkbox.name = 'selected-semester';
                checkbox.id = 'selected-semester-' + semester.count;

                label.innerHTML = checkbox.outerHTML + " " + semester.count;
                selectedSemesterContainer.appendChild(label);
            });
        }
    }
}

export default CatalogueViewRight;