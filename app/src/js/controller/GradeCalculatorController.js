import fileManager from "../model/FileManager.js";
import { studies} from "../model/studiesInstance.js";
import GradeCalculatorView from "../view/GradeCalculatorView.js";
import GradeCalculatorViewRight from "../view/GradeCalculatorViewRight.js";

class GradeCalculatorController {

    constructor() {
        this.gradeCalculatorView = new GradeCalculatorView();
        this.gradeCalculatorViewRight = new GradeCalculatorViewRight();

        if (studies !== null) {
            this.gradeCalculatorViewRight.showStudy(studies);
            this.gradeCalculatorView.show();
        }
        else {
            fileManager.addEventListener("on-study-loaded", e => {
                if (window.location.hash === "#grade-calculator") {
                    let study = e.data;
                    this.gradeCalculatorView.show();
                    this.gradeCalculatorViewRight.showStudy(study);
                }
            });
            fileManager.getStudy();
        }

    }
}

export default GradeCalculatorController;