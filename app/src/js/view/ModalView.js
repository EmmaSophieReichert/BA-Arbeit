import Module from '../model/structure/Module.js';
import { studies } from '../model/studiesInstance.js';
import {Event, Observable} from '../utils/Observable.js';

class ModalView extends Observable{

    constructor() {
        super();
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
            for(let i = 0; i < length; i++){
                module.addSelectedSemester(semester ? semester + i : 1 + i);
            }
            let data = {
                module: module,
                subject: this.subject,
            }
            ev = new Event("onModuleAdded", data);
            this.notifyAll(ev);

            this.modal.close();
        });
    }

    show(subjectTitle){
        this.modal.showModal();
        this.subject = studies.getSubjectIndex(subjectTitle);
    }
}

export default ModalView;