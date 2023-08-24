import fileManager from '../../model/FileManager.js';
import { studies, setStudyInstance } from '../../model/studiesInstance.js';
import { Event, Observable } from '../../utils/Observable.js';

class DeleteSubjectModalView extends Observable {

    constructor() {
        super();
        this.modal = document.getElementById('delete-subject-modal');
        this.subject = null;

        this.declineButton = document.getElementById("decline-delete-subject-button");
        this.declineButton.addEventListener("click", () => {
            this.modal.close();
        });
        this.deleteButton = document.getElementById("delete-subject-button");
        this.deleteButton.addEventListener("click", () => {
            let study = studies;
            study.deleteSubject(this.subject.title);
            if (study) {
                setStudyInstance(study);
                console.log("SOURCE 5");
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