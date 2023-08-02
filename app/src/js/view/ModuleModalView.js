import fileManager from '../model/FileManager.js';
import Module from '../model/structure/Module.js';
import { studies, setStudyInstance } from '../model/studiesInstance.js';
import Config from '../utils/Config.js';
import { Event, Observable } from '../utils/Observable.js';
import gradeModalView from './GradeModalView.js';
import modalView from './ModalView.js';

class ModuleModalView extends Observable {

    constructor() {
        super();
        this.modal = document.getElementById('show-modal');
        this.closeModalButton = document.querySelector('.close-module-show');
        this.module = null;
        this.subject = null;

        this.recommendedSemester = document.getElementById('recommended-semester-show-div');
        this.conditionsDiv = document.getElementById('conditions-show-div');
        this.passed = document.getElementById('passed-show-div');
        this.grade = document.getElementById('grade-show-div');

        this.closeModalButton.addEventListener('click', () => {
            this.reset();
            this.modal.close();
            this.passedModalButton.removeAttribute("hidden");
        });

        this.editModalButton = document.getElementById("edit-module-button");
        this.editModalButton.addEventListener("click", () => {
            let e = new Event("onModuleEdited", "onModuleEdited");
            this.notifyAll(e);
            this.reset();
            this.modal.close();
            this.passedModalButton.removeAttribute("hidden");
            modalView.show(this.subject.title);
            modalView.fill(this.module);
        
            // let modalView = new ModalView();
            // modalView.showModule(this.module, this.subject);
            // this.modal.close();
            // modalView.addEventListener("onModuleEdited", (e) => {
            //     let stud = studies;
            //     stud.deleteModule(this.module.ID);
            //     // let subjectIndex = studies.getSubjectIndex(e.data.subject.title);
            //     // stud.subjects[subjectIndex].addModule(e.data.module);
            //     // setStudyInstance(stud);
            //     // this.onModuleChanged();
            // });
        });

        this.deleteModalButton = document.getElementById("delete-module-button");
        this.deleteModalButton.addEventListener("mousedown", (event) => {
            if (event.button === 0) {
                let stud = studies;
                stud.deleteModule(this.module.ID);
                if(stud){
                    setStudyInstance(stud);
                    fileManager.updateFile();
                }
                this.onModuleChanged();
            } else {
                event.preventDefault();
            }
        });

        this.passedModalButton = document.getElementById("passed-module-button");
        this.passedModalButton.addEventListener("click", (event) => {
            let stud = studies;
            stud.setModulePassed(this.module.ID, true);
            if(stud){
               setStudyInstance(stud);
                fileManager.updateFile(); 
            }
            this.onModuleChanged();
            gradeModalView.show(this.module, this.subject);
            gradeModalView.addEventListener("onModuleChanged", (e) => {this.notifyAll(e)});
        });
    }

    onModuleChanged(){
        let e = new Event("onModuleChanged", "onModuleChanged");
        this.notifyAll(e);
        this.reset();
        this.modal.close();
        this.passedModalButton.removeAttribute("hidden");
    }

    show(module, subject) {
        this.module = module;
        this.subject = subject;
        //this.modal.style.backgroundColor = Config.COLOUR_CODES_LIGHT[subject.colourCode];
        document.getElementById('module-title-module-show').textContent = module.title;
        document.getElementById('shortname-module-show').textContent = module.ID;
        document.getElementById('ects-module-show').textContent = module.ECTS;
        document.getElementById('start-module-show').textContent = module.period;
        document.getElementById('length-module-show').textContent = module.minSemLength;

        //console.log(module);
        if(module.recommendedSemester !== null){
            this.recommendedSemester.classList.remove("hidden");
            document.getElementById('semester-module-show').textContent = module.recommendedSemester;
        }
        if(module.conditions){
            if(module.conditions.length !== 0){
                this.conditionsDiv.classList.remove("hidden");
                document.getElementById('condition-module-show').textContent = module.conditions.join(", ");
            }
        }
        if(module.passed){
            this.passed.classList.remove("hidden");
            document.getElementById('passed-module-show').textContent = "bestanden";
        }
        if(module.grade !== null){
            this.grade.classList.remove("hidden");
            document.getElementById('grade-module-show').textContent = module.grade;
        }

        this.modal.close();
        this.modal.showModal();
        if(module.passed){
            this.passedModalButton.setAttribute("hidden", true);
        }
    }

    reset(){
        this.recommendedSemester.classList.add("hidden");
        this.conditionsDiv.classList.add("hidden");
        this.passed.classList.add("hidden");
        this.grade.classList.add("hidden");
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