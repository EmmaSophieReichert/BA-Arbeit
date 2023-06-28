import { Observable, Event } from "../utils/Observable.js";

// Subject depending on degree
const subjectOptions = {
    Bachelor: [
        'B.A. - Bachelor of Arts',
        'B.Sc. - Bachelor of Science',
        'B.Edu. - Bachelor of Education',
        'B.Eng. - Bachelor of Engineering',
        'LL.B. - Bachelor of Laws',
        'B.Mus. - Bachelor of Music',
        'B.F.A. - Bachelor of Fine Arts',
    ],
    Master: [
        'M.A. - Master of Arts',
        'M.Sc. - Master of Science',
        'M.Edu. - Master of Education',
        'M.Eng. - Master of Engineering',
        'LL.M. - Master of Laws',
        'M.Mus. - Master of Music',
        'M.F.A. - Master of Fine Arts',
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
        this.specialization = document.getElementById("specialization");

        this.degreeRadioButtons = document.querySelectorAll('input[name="degree"]');
        this.degreeRadioButtons.forEach((radio) => {radio.addEventListener('change', this.onDegreeChanged.bind(this));});

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
            this.specialization.style.display = "block";
            selectedOptions.forEach((option) => {
                let input = document.createElement('input');
                input.type = 'radio';
                input.id = option.replace(/\s+/g, '-').toLowerCase();
                input.name = 'specialization';
                input.value = option;

                let label = document.createElement('label');
                label.htmlFor = input.id;
                label.textContent = option;

                this.specializationOptions.appendChild(input);
                this.specializationOptions.appendChild(label);
            });
        }
        else {
            this.specialization.style.display = "none";
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

    onAddStudyButtonClicked() {
        if (this.studyBoxes.length >= MAX_NUM_SUBJECTS) {
            return; //Maximum number of subjects reached
        }
        //create new StudyBox
        let newStudyBox = document.createElement('div');
        newStudyBox.classList.add('study-input-box');
        newStudyBox.innerHTML = `
            <input type="text" id="title" name="title" placeholder="Titel">
            <input type="number" id="ects" name="ects" placeholder="ECTS Punkte" min="0">
        `;
        let section = document.querySelector('.section');
        section.insertBefore(newStudyBox, addStudyButton);
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
        let totalECTS = parseInt(this.ectsInput.value);
        this.studyBoxes.forEach(function (box) {
            let ects = box.querySelector('input[name="ects"]');
            totalECTS += parseInt(ects.value);
        });

        if (totalECTS !== parseInt(ectsInput.value)) {
            // Error: sum of ECTS is not equal
            this.errorMessage.textContent = 'Die Summe der ECTS stimmt nicht mit der Gesamt-ECTS-Zahl überein.';
            return false;
        }
        return true;
    }

    saveData() {
        console.log("SAVE STUDY DATA");
    }
}



export default StudyView;