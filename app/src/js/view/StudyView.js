import { Observable, Event } from "../utils/Observable.js";

// Subject depending on degree
const subjectOptions = {
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

const ectsOptions = {
    Bachelor: 180,
    Master: 120,
    Staatsexamen: 240,
}

const semesterOptions = {
    Bachelor: 6,
    Master: 4,
    Staatsexamen: 9,
}

const MAX_NUM_SUBJECTS = 5;

class StudyView extends Observable {

    constructor() {
        super();

        this.specializationOptions = document.getElementById('specialization-options');
        this.ectsInput = document.getElementById('ects');
        this.semesterInput = document.getElementById('semester');
        this.studyBoxes = document.querySelectorAll('.study-input-box');
        this.errorMessage = document.getElementById('error-message');
        this.specializationLabel = document.getElementById("specialization-label");
        this.specializationRadio = document.getElementById("specialization-radio");

        this.addSubjectButton = document.getElementById("add-study");
        this.addSubjectButton.addEventListener("click", this.onAddSubjectButtonClicked.bind(this));

        this.degreeRadioButtons = document.querySelectorAll('input[name="degree"]');
        this.degreeRadioButtons.forEach((radio) => { radio.addEventListener('change', this.onDegreeChanged.bind(this)); });

        document.getElementById('study-form').addEventListener('submit', this.onSubmitButtonClicked.bind(this));
    }

    onDegreeChanged() {
        let selectedDegree = document.querySelector('input[name="degree"]:checked');
        this.updateSpecializationOptions(selectedDegree);
        this.updateECTSandSemester(selectedDegree);
    }

    updateSpecializationOptions(selectedDegree) {
        this.specializationOptions.innerHTML = '';
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
        console.log("SAVE STUDY DATA");
        let selectedDegree = document.querySelector('input[name="degree"]:checked'),
            selectedSpecializations = document.querySelectorAll('input[name="specialization"]:checked'),
            ectsValue = parseInt(this.ectsInput.value),
            semesterValue = parseInt(this.semesterInput.value),
            period = document.querySelector('input[name="start"]:checked').value,
            studyData = [];

        let degree = selectedDegree ? selectedDegree.value : null;
        let specializations = Array.from(selectedSpecializations).map(specialization => specialization.value);

        this.studyBoxes.forEach(studyBox => {
            let title = studyBox.querySelector('.study-title').value,
                ects = ectsValue;
            if (this.studyBoxes.length !== 1) {
                ects = parseInt(studyBox.querySelector('.study-ects').value);
            }
            studyData.push({ title, ects });
        });

        if (!degree || specializations.length === 0 || isNaN(ectsValue) || isNaN(semesterValue)) {
            this.errorMessage.textContent = 'Bitte füllen Sie alle Felder aus.';
            return;
        }

        let data = {
            degree: degree,
            specializations: specialization,
            ects: ectsValue,
            semester: semesterValue,
            subjects: studyData,
            period: period,
        },
            e = new Event("study-submit", data)
        this.notifyAll(e);
    }
}



export default StudyView;