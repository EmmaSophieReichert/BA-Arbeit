import fileManager from '../../model/FileManager.js';
import { studies, setStudyInstance } from '../../model/studiesInstance.js';
import { Event, Observable } from '../../utils/Observable.js';

class IntResModalView extends Observable {

    constructor() {
        super();
        this.modal = document.getElementById('int-res-modal');
        this.closeModalButton = document.querySelector('.close-module-int-res');
        this.intResForm = document.getElementById("int-res-form");
        this.children = null;

        this.closeModalButton.addEventListener('click', () => {
            this.intResForm.reset();
            this.modal.close();
        });

        this.intResForm.addEventListener("submit", (e) => {
            e.preventDefault();
            let title = document.getElementById("int-res-title").value,
                weight = parseFloat(document.getElementById("weight-input-int-res").value),
                stud = studies;
            stud.addIntermediateResult(this.children, title, weight);
            if(stud){
                setStudyInstance(stud);
                console.log("SOURCE 7");
                fileManager.updateFile();
            }
            this.onIntResSubmit();
        })

    }

    onIntResSubmit(){
        let e = new Event("onIntResSubmit", "onIntResSubmit");
        this.notifyAll(e);
        this.intResForm.reset();
        this.modal.close();
    }

    show(children) {
        this.children = children;

        this.modal.close();
        this.modal.showModal();
    }
}

var intResModalView = new IntResModalView()

export default intResModalView;