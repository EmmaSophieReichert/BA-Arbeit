import Module from '../model/structure/Module.js';
import {Event, Observable} from '../utils/Observable.js';

class ModalView extends Observable{

    constructor() {
        super();
        this.openModalButton = document.getElementById('open-modal-btn');
        this.modal = document.getElementById('modal');
        this.closeModalButton = document.querySelector('.close');
        this.moduleForm = document.getElementById('module-form');
        
        this.openModalButton.addEventListener('click', () => {
            this.modal.showModal();
        });

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
                length = parseInt(document.getElementById('length').value);
            semester = semester === "" ? null : parseInt(semester);

            this.moduleForm.reset();

            let module = new Module(title, shortname, ects, semester, length),
                ev;
            module.addSelectedSemester(semester ? semester : 1);
            let data = {
                module: module,
                subject: 1,
            }
            ev = new Event("onModuleAdded", data);
            this.notifyAll(ev);

            this.modal.close();
        });
    }
}

export default ModalView;