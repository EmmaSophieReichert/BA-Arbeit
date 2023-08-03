import fileManager from '../../model/FileManager.js';
import Module from '../../model/structure/Module.js';
import { studies, setStudyInstance } from '../../model/studiesInstance.js';
import Config from '../../utils/Config.js';
import { Event, Observable } from '../../utils/Observable.js';
import gradeModalView from './GradeModalView.js';
import modalView from './ModalView.js';

class DeleteSubjectModalView extends Observable {

    constructor() {
        super();
        this.modal = document.getElementById('delete-subject-modal');
        //this.closeModalButton = document.querySelector('.close-module-show');
        this.subject = null;

        /* this.closeModalButton.addEventListener('click', () => {
            this.reset()
            this.modal.close();
            this.passedModalButton.removeAttribute("hidden");
        }); */

        this.declineButton = document.getElementById("decline-delete-subject-button");
        this.declineButton.addEventListener("click", () => {
            this.modal.close();
        });
        this.deleteButton = document.getElementById("delete-subject-button");
        this.deleteButton.addEventListener("click", () => {
            let study = studies;
            study.deleteSubject(this.subject.title);
            if(study){
                setStudyInstance(study);
                fileManager.updateFile();
            }
            let e = new Event("onSubjectDeleted", this.subject.title);
            this.notifyAll(e);
            this.modal.close();
        });
    }

    show(subject) {
        this.subject = subject;
        this.modal.close();
        this.modal.showModal();
    }
}

var deleteSubjectModalView = new DeleteSubjectModalView()

export default deleteSubjectModalView;