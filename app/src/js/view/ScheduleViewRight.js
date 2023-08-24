import Config from '../utils/Config.js';
import { Observable, Event } from '../utils/Observable.js';

class ScheduleViewRight extends Observable {

    constructor() {
        super();
        this.studyBoxesContainer = document.getElementById("study-boxes-container");
        this.filterContainer = document.getElementById('filter-container');
        this.inPlanProgress = document.getElementById('in-plan-progress');
        this.inPlanProgressText = document.getElementById('in-plan-progress-text');
        this.passedProgress = document.getElementById('passed-progress');
        this.passedProgressText = document.getElementById('passed-progress-text');
    }

    showStudy(study) {
        this.studyBoxesContainer.innerHTML = "";
        for (let subject of study.subjects) {
            this.showSubject(subject);
        }
        this.fillTotalProgress(study);
    }

    fillTotalProgress(study) {
        let inPlanECTS = 0, passedECTS = 0, colourRow = "";
        for (let subject of study.subjects) {
            passedECTS += subject.currentECTS;
            for (let module of subject.modules) {
                if (module.selectedSemester.length !== 0) {
                    inPlanECTS += module.ECTS;
                }
            }
            colourRow += ", " + Config.COLOUR_CODES[subject.colourCode];
        }
        if (study.subjects.length > 1) {
            this.inPlanProgress.style.backgroundImage = "linear-gradient(to right" + colourRow + ")";
            this.passedProgress.style.backgroundImage = "linear-gradient(to right" + colourRow + ")";
        }
        else {
            this.inPlanProgress.style.backgroundColor = Config.COLOUR_CODES[0];
            this.passedProgress.style.backgroundColor = Config.COLOUR_CODES[0];
        }
        this.inPlanProgress.style.width = (inPlanECTS / study.totalECTS) * 100 + '%';
        this.inPlanProgressText.textContent = inPlanECTS + '/' + study.totalECTS + ' ECTS';
        this.passedProgress.style.width = (passedECTS / study.totalECTS) * 100 + '%';
        this.passedProgressText.textContent = passedECTS + '/' + study.totalECTS + ' ECTS';
    }

    async showSubject(subject) {
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

        div.innerHTML = h2.outerHTML + progressBar.outerHTML + addModuleButton.outerHTML;
        await this.studyBoxesContainer.appendChild(div);

        addModuleButton = document.getElementById(subject.title + "-button");
        addModuleButton.addEventListener('click', () => {
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
        progress.style.width = (currentECTS / totalECTS) * 100 + '%';
        progressText.textContent = currentECTS + '/' + totalECTS + ' ECTS';
        progressBar.innerHTML = progress.outerHTML + progressText.outerHTML;
        return progressBar;
    }
}

export default ScheduleViewRight;