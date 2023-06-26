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
            let title = document.getElementById('title').value,
                shortname = document.getElementById('shortname').value,
                ects = parseInt(document.getElementById('ects').value),
                semester = document.getElementById('semester').value,
                length = parseInt(document.getElementById('length').value);
            semester = semester === "" ? null : parseInt(semester);

            this.moduleForm.reset();

            let module = new Module(title, shortname, ects, semester, length),
                ev = new Event("onModuleAdded", module);
            this.notifyAll(ev);

            this.modal.close();
        });
    }
}

export default ModalView;