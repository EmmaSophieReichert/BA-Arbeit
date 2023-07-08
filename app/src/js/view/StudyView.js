import fileManager from "../model/FileManager.js";
import Studies from "../model/structure/Studies.js";
import { setStudyInstance, studies } from "../model/studiesInstance.js";
import { Observable, Event } from "../utils/Observable.js";

// Subject depending on degree
let subjectOptions = {
    Bachelor: [
        'B.A.',// - Bachelor of Arts',
        'B.Sc.', // - Bachelor of Science',
        'B.Edu.',// - Bachelor of Education',
        'B.Eng.',// - Bachelor of Engineering',
        'LL.B.', // - Bachelor of Laws',
        'B.Mus.', // - Bachelor of Music',
        'B.F.A.', // - Bachelor of Fine Arts',
    ],
    Master: [
        'M.A.', // - Master of Arts',
        'M.Sc.', // - Master of Science',
        'M.Edu.', // - Master of Education',
        'M.Eng.', // - Master of Engineering',
        'LL.M.', // - Master of Laws',
        'M.Mus.', // - Master of Music',
        'M.F.A.', // - Master of Fine Arts',
    ],
    // Weitere Studienabschlüsse ?
};

let ectsOptions = {
    Bachelor: 180,
    Master: 120,
    Staatsexamen: 240,
}

let semesterOptions = {
    Bachelor: 6,
    Master: 4,
    Staatsexamen: 9,
}

let MAX_NUM_SUBJECTS = 5;

class StudyView extends Observable {

    constructor() {
        super();

        this.editMode = false;

        fileManager.addEventListener("on-study-loaded", e => {
            let study = e.data;
            this.fill(study);
        });

        this.specializationOptions = document.getElementById('specialization-options');
        this.ectsInput = document.getElementById('ects');
        this.semesterInput = document.getElementById('semester');
        this.studyBoxes = document.querySelectorAll('.study-input-box');
        this.errorMessage = document.getElementById('error-message');
        this.specializationLabel = document.getElementById("specialization-label");
        this.specializationRadio = document.getElementById("specialization-radio");

        this.addSubjectButton = document.getElementById("add-study");
        this.addSubjectButton.addEventListener("click", this.onAddSubjectButtonClicked.bind(this));

        this.declineButton = document.getElementById("decline-study-button");

        this.degreeRadioButtons = document.querySelectorAll('input[name="degree"]');
        this.degreeRadioButtons.forEach((radio) => { radio.addEventListener('change', this.onDegreeChanged.bind(this)); });

        document.getElementById('study-form').addEventListener('submit', this.onSubmitButtonClicked.bind(this));

        if (studies !== null) {
            this.fill(studies);
        }
        else {
            this.handleNoStudies();
        }
    }

    async handleNoStudies() {
        let res = fileManager.getList();
        if (res.total !== 0) {
            await fileManager.getStudy();
        }
    }

    fill(data) {
        this.editMode = true;
        console.log("FILL");
        this.declineButton.removeAttribute("hidden");
        this.declineButton.addEventListener("click", () => { window.location.hash = "schedule" });

        let degreeRadios = document.querySelectorAll('input[name="degree"]'),
            degreeRadio;
        degreeRadios.forEach(radio => {
            if (radio.value === data.degree) {
                radio.checked = true;
                degreeRadio = radio;
            }
        });

        // specialization
        if (data.specialization[0]) {
            this.updateSpecializationOptions(degreeRadio);
            let specializationRadios = document.querySelectorAll('input[name="specialization"]');
            specializationRadios.forEach(radio => {
                if (radio.value === data.specialization[0]) {
                    radio.checked = true;
                }
            });
        }

        // totalECTS
        this.ectsInput.value = data.totalECTS;
        // semesters
        this.semesterInput.value = data.semesters.length;

        // turnus start
        let startRadios = document.querySelectorAll('input[name="start"]'),
            firstSemester;
        for (let sem of data.semesters) {
            if (sem.count === 1) {
                firstSemester = sem;
            }
        }
        console.log(firstSemester);
        startRadios.forEach(radio => {
            console.log(radio.value);
            if (radio.value === firstSemester.period) {
                radio.checked = true;
            }
        });

        let studBoxes = document.getElementById("add-subjects-div")

        studBoxes.setAttribute("hidden", true);

        // // Studiengang hinzufügen
        // let studyBox = this.studyBoxes[0];
        // let studyTitleInput = studyBox.querySelector('.study-title');
        // studyTitleInput.value = data.subjects[0].title;

        // // Weitere Studiengang-Boxen
        // for (let i = 1; i < this.studyBoxes.length; i++) {
        //     let additionalStudyBox = studyBoxes[i];
        //     let additionalStudyTitleInput = additionalStudyBox.querySelector('.study-title');
        //     additionalStudyTitleInput.value = data.subjects[i].title;
        // }
    }


    onDegreeChanged() {
        let selectedDegree = document.querySelector('input[name="degree"]:checked');
        this.updateSpecializationOptions(selectedDegree);
        this.updateECTSandSemester(selectedDegree);
    }

    updateSpecializationOptions(selectedDegree) {
        this.specializationOptions.innerHTML = '';
        console.log("hi");
        if (selectedDegree && subjectOptions.hasOwnProperty(selectedDegree.value)) {
            var selectedOptions = subjectOptions[selectedDegree.value];
            this.specializationLabel.style.display = "grid";
            this.specializationRadio.style.display = "grid";
            selectedOptions.forEach((option) => {
                let div = document.createElement('div'),
                    input = document.createElement('input');
                input.type = 'radio';
                input.id = option.replace(/\s+/g, '-').toLowerCase();
                input.name = 'specialization';
                input.value = option;

                let label = document.createElement('label');
                label.htmlFor = input.id;
                label.textContent = option;

                div.appendChild(input);
                div.appendChild(label);
                this.specializationOptions.appendChild(div);
            });
        }
        else {
            this.specializationLabel.style.display = "none";
            this.specializationRadio.style.display = "none";
        }
    }

    updateECTSandSemester(selectedDegree) {
        if (selectedDegree && ectsOptions.hasOwnProperty(selectedDegree.value) && semesterOptions.hasOwnProperty(selectedDegree.value)) {
            this.ectsInput.value = ectsOptions[selectedDegree.value];
            this.semesterInput.value = semesterOptions[selectedDegree.value];
        } else {
            this.ectsInput.value = '';
            this.semesterInput.value = '';
        }
    }

    onAddSubjectButtonClicked() {
        if (this.studyBoxes.length === 1) {
            let input = document.createElement('input');
            input.type = 'number';
            input.classList.add("study-ects");
            input.id = "ects";
            input.name = 'ects';
            input.min = 0;
            input.placeholder = "ECTS Punkte";
            this.studyBoxes[0].appendChild(input);
        }
        //create new StudyBox
        let newStudyBox = document.createElement('div');
        newStudyBox.classList.add('study-input-box');
        newStudyBox.innerHTML = `
            <input class="study-title" type="text" id="title" name="title" placeholder="Titel">
            <input class="study-ects" type="number" id="ects" name="ects" placeholder="ECTS Punkte" min="0">
        `;
        let container = document.getElementById("additional-study-boxes");
        container.appendChild(newStudyBox);
        this.studyBoxes = document.querySelectorAll('.study-input-box');
        if (this.studyBoxes.length >= MAX_NUM_SUBJECTS) {
            this.addSubjectButton.style.display = "none";
        }
    }

    onSubmitButtonClicked() {
        if (this.proveData()) {
            this.saveData();
        }
    }

    proveData() {
        if (this.studyBoxes.length === 1) {
            return true; //No split of ECTS, one subject
        }
        let totalECTS = 0;
        this.studyBoxes.forEach(function (box) {
            let ects = box.querySelector('input[name="ects"]');
            totalECTS += parseInt(ects.value);
        });

        if (totalECTS !== parseInt(this.ectsInput.value)) {
            // Error: sum of ECTS is not equal
            this.errorMessage.textContent = 'Die Summe der ECTS stimmt nicht mit der Gesamt-ECTS-Zahl überein.';
            return false;
        }
        return true;
    }

    saveData() {
        let selectedDegree = document.querySelector('input[name="degree"]:checked'),
            selectedSpecializations = document.querySelectorAll('input[name="specialization"]:checked'),
            ectsValue = parseInt(this.ectsInput.value),
            semesterValue = parseInt(this.semesterInput.value),
            period = document.querySelector('input[name="start"]:checked').value,
            studyData = [];

        let degree = selectedDegree ? selectedDegree.value : null;
        let specializations = Array.from(selectedSpecializations).map(specialization => specialization.value);

        for (let studyBox of this.studyBoxes) {
            let title = studyBox.querySelector('.study-title').value,
                ects = ectsValue;
            if (this.studyBoxes.length !== 1) {
                ects = parseInt(studyBox.querySelector('.study-ects').value);
            }
            for (let studData of studyData) {
                if (studData.title === title) {
                    this.errorMessage.textContent = 'Die Studiengänge müssen unterschiedlich benannt werden!';
                    return;
                }
            }
            studyData.push({ title, ects });
        }

        //if (!degree || specializations.length === 0 || isNaN(ectsValue) || isNaN(semesterValue)) {
        if (!degree || isNaN(ectsValue) || isNaN(semesterValue)) {
            this.errorMessage.textContent = 'Bitte füllen Sie alle Felder aus.';
            return;
        }

        if (this.editMode) {
            let stud = studies;
            stud.degree = degree;
            stud.specialization = specializations;
            stud.totalECTS = ectsValue;
            stud.semesters = Studies.initFirstSemesters(semesterValue, period);
            console.log(stud);
            setStudyInstance(stud);
            fileManager.updateFile();
            window.location.hash = "#schedule";
        }
        else {
            let data = {
                degree: degree,
                specializations: specializations,
                ects: ectsValue,
                semester: semesterValue,
                subjects: studyData,
                period: period,
            },
                e = new Event("study-submit", data)
            this.notifyAll(e);
        }
    }
}

export default StudyView;