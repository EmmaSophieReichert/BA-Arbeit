import Module from '../model/structure/Module.js';
import { studies } from '../model/studiesInstance.js';
import Config from '../utils/Config.js';
import { Event, Observable } from '../utils/Observable.js';

class ModalView extends Observable {

    constructor() {
        super();
        this.root = null;
        this.modal = document.getElementById('modal');
        this.closeModalButton = document.querySelector('.close');
        this.moduleForm = document.getElementById('module-form');
        this.subject = 1;

        this.closeModalButton.addEventListener('click', () => {
            this.moduleForm.reset();
            this.modal.close();
        });

        this.moduleForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let title = document.getElementById('module-title').value,
                shortname = document.getElementById('shortname').value,
                ects = parseInt(document.getElementById('ects').value),
                semester = document.getElementById('semester').value,
                length = parseInt(document.getElementById('length').value),
                period = document.querySelector('input[name="start"]:checked').value;
            semester = semester === "" ? null : parseInt(semester);

            this.moduleForm.reset();

            let module = new Module(title, shortname, ects, period, semester, length),
                ev;
            for (let i = 0; i < length; i++) {
                module.addSelectedSemester(semester ? semester + i : 1 + i);
            }
            let data = {
                module: module,
                subject: this.subject,
            }
            console.log("ROOT", this.root);
            ev = new Event("onModuleAdded", data);
            if(this.root === "edit"){
                ev = new Event("onModuleEdited", data);
            }
            this.notifyAll(ev);

            this.modal.close();
        });
    }

    show(subjectTitle) {
        this.root = "schedule";
        this.modal.showModal();
        this.subject = studies.getSubjectIndex(subjectTitle);
        let subject = studies.getSubject(subjectTitle);
        console.log(subject);
        //this.modal.style.backgroundColor = Config.COLOUR_CODES_LIGHT[subject.colourCode];
        this.modal.style.border = "5px solid " + Config.COLOUR_CODES[subject.colourCode];
    }

    showModule(module, subject) {
        this.root = "edit";
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

        this.modal.showModal();
        this.subject = studies.getSubjectIndex(subject.title);
        this.subject = subject;
        this.modal.style.border = "5px solid " + Config.COLOUR_CODES[subject.colourCode];
    }
}

export default ModalView;