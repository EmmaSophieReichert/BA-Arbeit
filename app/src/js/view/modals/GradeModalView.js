import fileManager from '../../model/FileManager.js';
import Module from '../../model/structure/Module.js';
import { studies, setStudyInstance } from '../../model/studiesInstance.js';
import Config from '../../utils/Config.js';
import { Event, Observable } from '../../utils/Observable.js';
import modalView from './ModalView.js';

class GradeModalView extends Observable {

    constructor() {
        super();
        this.modal = document.getElementById('grade-modal');
        this.closeModalButton = document.querySelector('.close-module-grade');
        this.gradeForm = document.getElementById("grade-form");
        this.module = null;
        this.subject = null;

        this.closeModalButton.addEventListener('click', () => {
            this.gradeForm.reset();
            this.modal.close();
        });

        this.gradeForm.addEventListener("submit", () => {
            let grade = document.getElementById("grade-input").value,
                weight = document.getElementById("weight-input").value,
                stud = studies;
            if(!weight){
                weight = 1;
            }
            if(!grade){
                grade = null;
            }

            grade === "" ? null : parseFloat(grade);
            weight === "" ? 1 : parseFloat(weight);

            stud.setModuleGrade(this.module.ID, grade, weight);
            if(stud){
                setStudyInstance(stud);
                console.log("SOURCE 6");
                fileManager.updateFile();
            }
            this.onModuleChanged();
        })

    }

    onModuleChanged(){
        // let e = new Event("onModuleChanged", "onModuleChanged");
        // this.notifyAll(e);
        this.gradeForm.reset();
        this.modal.close();
    }

    show(module, subject) {
        this.module = module;
        this.subject = subject;

        this.modal.close();
        this.modal.showModal();
    }
}

var gradeModalView = new GradeModalView()

export default gradeModalView;