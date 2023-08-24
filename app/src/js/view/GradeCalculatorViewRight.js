import Config from '../utils/Config.js';
import { Observable, Event } from '../utils/Observable.js';

class GradeCalculatorViewRight extends Observable {

    constructor() {
        super();
        this.studyBoxesContainer = document.getElementById("study-boxes-container");
        this.filterContainer = document.getElementById('filter-container');
    }

    showStudy(study) {
        this.studyBoxesContainer.innerHTML = "";
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

        let progressBar = this.getProgressbar(subject.ects, subject.currentECTS, subject.colourCode);

        div.innerHTML = h2.outerHTML + progressBar.outerHTML;
        await this.studyBoxesContainer.appendChild(div);
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

export default GradeCalculatorViewRight;