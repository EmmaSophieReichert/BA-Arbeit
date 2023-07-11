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
            period = document.querySelector('input[name="start"]:checked').value;
        semester = semester === "" ? null : parseInt(semester);

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
            id = this.module.ID;
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
        setStudyInstance(stud);
        fileManager.updateFile(); 
        ;
        ev = new Event("onModuleChanged", data);
        this.notifyAll(ev);

        this.close();
    }

    close(){
        this.moduleForm.reset();
        this.module = null;
        this.errorMessage.textContent = "";
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
    }
}

var modalView = new ModalView();

export default modalView;