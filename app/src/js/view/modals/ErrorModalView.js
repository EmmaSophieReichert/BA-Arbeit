import { Event, Observable } from '../../utils/Observable.js';

class ErrorModalView extends Observable {

    constructor() {
        super();
        this.modal = document.getElementById('error-modal');
        this.module = null;
        this.positionX = null;
        this.positionY = null;
        this.items = null;

        this.description = document.getElementById("error-modal-description");
        this.conditions = document.getElementById("conditions-error-box");

        this.declineButton = document.getElementById("error-decline-button");
        this.declineButton.addEventListener("click", () => {
            let e = new Event("onDecline", this.items);
            this.notifyAll(e);
            this.reset();
            this.modal.close();
        });
        this.submitButton = document.getElementById("error-submit-button");
        this.submitButton.addEventListener("click", () => {
            let e = new Event("onModuleMoved", this.items);
            this.notifyAll(e);
            this.reset();
            this.modal.close();
        });
    }

    showTurnus(module, newTurnus, positionX, positionY, items) {
        this.module = module;
        this.positionX = positionX;
        this.positionY = positionY;
        this.items = items;

        this.description.innerHTML = "Du bist dabei, ein Modul, das im <b>" + module.period + "</b> startet, <br> in ein <b>" + newTurnus + "</b> zu verschieben.";

        this.modal.close();
        this.modal.showModal();
    }

    showConditions(module, positionX, positionY, items) {
        this.module = module;
        this.positionX = positionX;
        this.positionY = positionY;
        this.items = items;

        this.description.innerHTML = "In dem, Semester, in das du das Modul verschieben willst, <br> wurden folgende <b>Voraussetzungen</b> noch nicht erfüllt:";

        this.conditions.classList.remove("hidden");
        this.conditions.innerHTML = "<b>" + module.getConditionString() + "</b>";

        this.modal.close();
        this.modal.showModal();
    }

    reset() {
        this.module = null;
        this.position = null;
        this.conditions.classList.add("hidden");
    }
}

var errorModalView = new ErrorModalView();

export default errorModalView;