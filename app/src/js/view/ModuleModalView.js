import fileManager from '../model/FileManager.js';
import Module from '../model/structure/Module.js';
import { studies, setStudyInstance } from '../model/studiesInstance.js';
import Config from '../utils/Config.js';
import { Event, Observable } from '../utils/Observable.js';
import modalView from './ModalView.js';

class ModuleModalView extends Observable {

    constructor() {
        super();
        this.modal = document.getElementById('show-modal');
        this.closeModalButton = document.querySelector('.close-module-show');
        this.module = null;
        this.subject = null;

        this.closeModalButton.addEventListener('click', () => {
            this.modal.close();
        });

        this.editModalButton = document.getElementById("edit-module-button");
        this.editModalButton.addEventListener("click", () => {
            let e = new Event("onModuleEdited", "onModuleEdited");
            this.notifyAll(e);
            this.modal.close();
            modalView.show(this.subject.title);
            modalView.fill(this.module);
        
            // let modalView = new ModalView();
            // modalView.showModule(this.module, this.subject);
            // this.modal.close();
            // modalView.addEventListener("onModuleEdited", (e) => {
            //     let stud = studies;
            //     stud.deleteModule(this.module.ID);
            //     console.log(stud);
            //     // let subjectIndex = studies.getSubjectIndex(e.data.subject.title);
            //     // stud.subjects[subjectIndex].addModule(e.data.module);
            //     // setStudyInstance(stud);
            //     // console.log("DIRECT", studies);
            //     // this.onModuleChanged();
            // });
        });

        this.deleteModalButton = document.getElementById("delete-module-button");
        this.deleteModalButton.addEventListener("mousedown", (event) => {
            if (event.button === 0) {
                let stud = studies;
                stud.deleteModule(this.module.ID);
                setStudyInstance(stud);
                fileManager.updateFile();
                this.onModuleChanged();
            } else {
                event.preventDefault();
            }
        });

        this.passedModalButton = document.getElementById("passed-module-button");
        this.passedModalButton.addEventListener("click", (event) => {
            let stud = studies;
            stud.setModulePassed(this.module.ID, true);
            setStudyInstance(stud);
            fileManager.updateFile();
            this.onModuleChanged();
        });
    }

    onModuleChanged(){
        let e = new Event("onModuleChanged", "onModuleChanged");
        this.notifyAll(e);
        this.modal.close();
    }

    show(module, subject) {
        console.log(module);
        this.module = module;
        this.subject = subject;
        //this.modal.style.backgroundColor = Config.COLOUR_CODES_LIGHT[subject.colourCode];
        document.getElementById('module-title-module-show').textContent = module.title;
        document.getElementById('shortname-module-show').textContent = module.ID;
        document.getElementById('ects-module-show').textContent = module.ECTS;
        document.getElementById('start-module-show').textContent = module.period;
        document.getElementById('semester-module-show').textContent = module.recommendedSemester;
        document.getElementById('length-module-show').textContent = module.minSemLength;
        this.modal.close();
        this.modal.showModal();
    }

    // show(subjectTitle) {
    //     this.modal.showModal();
    //     let subject = studies.getSubject(subjectTitle);
    //     console.log(subject);
    //     //this.modal.style.backgroundColor = Config.COLOUR_CODES_LIGHT[subject.colourCode];
    //     this.modal.style.border = "5px solid " + Config.COLOUR_CODES[subject.colourCode];
    // }
}

var moduleModalView = new ModuleModalView()

export default moduleModalView;