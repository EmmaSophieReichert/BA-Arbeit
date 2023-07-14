import fileManager from '../model/FileManager.js';
import Module from '../model/structure/Module.js';
import { studies, setStudyInstance } from '../model/studiesInstance.js';
import Config from '../utils/Config.js';
import { Event, Observable } from '../utils/Observable.js';

class ModalView extends Observable {

    constructor() {
        super();
        this.root = "add";
        this.module = null;
        this.modal = document.getElementById('modal');
        this.closeModalButton = document.querySelector('.close');
        this.moduleForm = document.getElementById('module-form');
        this.errorMessage = document.getElementById('module-error-message');
        this.gradeInput = document.getElementById('grade');
        this.weightInput = document.getElementById('weight');
        this.gradeEl = document.getElementById('grade-el-div');
        this.weightEl = document.getElementById('weight-el-div');
        this.passedEl = document.getElementById('passed-el-div');
        this.subject = 1;

        this.closeModalButton.addEventListener('click', () => {
            this.close()
        });

        this.moduleForm.addEventListener('submit', (e) => {
            this.onSubmitButtonClicked(e);
        });
    }

    onSubmitButtonClicked(e) {
        e.preventDefault();
        console.log(this.root);
        let title = document.getElementById('module-title').value,
            shortname = document.getElementById('shortname').value,
            ects = parseInt(document.getElementById('ects').value),
            semester = document.getElementById('semester').value,
            length = parseInt(document.getElementById('length').value),
            period = document.querySelector('input[name="start"]:checked').value,
            passed = document.querySelector('input[name="module-passed-radio"]:checked').value === "true";
        semester = semester === "" ? null : parseInt(semester);

        console.log("PASS", passed);
        

        if(this.root !== "edit"){
            if(studies.getModuleAndSubjectByID(shortname) !== null){
                this.errorMessage.textContent = 'Diese Kurzform existiert schon. Bitte wählen Sie eine Kurzform, die noch nicht existiert.';
                return;
            }
        }

        let module,
            ev,
            id = null;
        if(this.module !== null){
            module = this.module;
            module.title = title;
            module.ID = shortname;
            module.ECTS = ects;
            module.period = period;
            module.recommendedSemester = semester;
            module.minSemLength = length;
            module.passed = passed;
            id = this.module.ID;
            if(passed){
                module.grade = this.gradeInput.value === "" ? null : parseFloat(this.gradeInput.value);
                module.weight = this.weightInput.value === "" ? null : parseFloat(this.weightInput.value);
            }
        }
        else{
            module = new Module(title, shortname, ects, period, semester, length);
        }
        
        for (let i = 0; i < length; i++) {
            module.addSelectedSemester(semester ? semester + i : 1 + i);
        }
        let data = {
            module: module,
            subject: this.subject,
            root: this.root,
            id: id,
        }

        let stud = studies;
        if(this.root === "edit"){
            console.log("EDIT");
            stud.deleteModule(id);
        }
        stud.subjects[this.subject].addModule(module);
        stud.kids.push(module.ID);
        setStudyInstance(stud);
        fileManager.updateFile(); 
        ev = new Event("onModuleChanged", data);
        this.notifyAll(ev);

        this.close();
    }

    close(){
        this.moduleForm.reset();
        this.module = null;
        this.errorMessage.textContent = "";
        this.gradeEl.classList.add("hidden");
        this.weightEl.classList.add("hidden");
        this.passedEl.classList.add("hidden");
        this.modal.close();
    }

    show(subjectTitle) {
        this.root = "add";
        this.modal.close();
        this.modal.showModal();
        this.subject = studies.getSubjectIndex(subjectTitle);
        let subject = studies.getSubject(subjectTitle);
        document.getElementById('ects').max = subject.ects;
        document.getElementById('length').max = studies.semesters.length;
        //this.modal.style.backgroundColor = Config.COLOUR_CODES_LIGHT[subject.colourCode];
        this.modal.style.border = "5px solid " + Config.COLOUR_CODES[subject.colourCode];
    }

    fill(module) {
        this.root = "edit";
        this.module = module;
        document.getElementById('module-title').value = module.title;
        document.getElementById('shortname').value = module.ID;
        document.getElementById('ects').value = module.ECTS;
        //document.getElementById('start').value = module.period;
        document.getElementById('semester').value = module.recommendedSemester;
        document.getElementById('length').value = module.minSemLength;

        let radioButtons = document.getElementsByName('start');
        for (var i = 0; i < radioButtons.length; i++) {
            if (radioButtons[i].id === module.period) {
                radioButtons[i].checked = true;
            } else {
                radioButtons[i].checked = false;
            }
        }

        document.getElementById('edit-module-h2').innerHTML = "Modul bearbeiten";

        if(module.passed){
            console.log("PASSED");
            console.log(this.gradeEl);
            this.gradeEl.classList.remove("hidden");
            this.weightEl.classList.remove("hidden");
            this.passedEl.classList.remove("hidden");
            if(module.grade){
                this.gradeInput.value = module.grade;
            }
            if(module.weight){
                this.weightInput.value = module.weight;
            }
        }
    }
}

var modalView = new ModalView();

export default modalView;