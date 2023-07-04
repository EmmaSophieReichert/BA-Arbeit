import { GridStack } from 'gridstack';
import Module from '../model/structure/Module.js';
import ModalView from './ModalView.js';
import Config from '../utils/Config.js';

class ScheduleViewRight {

    constructor() {
        this.studyBoxesContainer = document.getElementById("study-boxes-container");
    }

    showStudy(study) {
        for(let subject of study.subjects){
            this.showSubject(subject);
        }
    }

    showSubject(subject) {
        let div = document.createElement("div");
        div.className = "subject-box";
        div.style.backgroundColor = Config.COLOUR_CODES[subject.colourCode] ;
        let h2 = document.createElement("h3");
        h2.innerHTML = subject.title;
        h2.className = "subject-box-title";

        let progressBar = this.getProgressbar(subject.ects, subject.currentECTS, subject.colourCode);
        div.innerHTML = h2.outerHTML + progressBar.outerHTML;
        this.studyBoxesContainer.appendChild(div);
    }

    getProgressbar(totalECTS, currentECTS, colourCode){
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
}

export default ScheduleViewRight;