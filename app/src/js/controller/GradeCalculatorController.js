import fileManager from "../model/FileManager.js";
//import GradeCalculatorModel from "../model/GradeCalculatorModel.js";
import { studies, setStudyInstance } from "../model/studiesInstance.js";
import GradeCalculatorView from "../view/GradeCalculatorView.js";
import GradeCalculatorViewRight from "../view/GradeCalculatorViewRight.js";

class GradeCalculatorController{
    
    constructor(){
        //this.gradeCalculatorModel = new GradeCalculatorModel(fileManager);
        this.gradeCalculatorView = new GradeCalculatorView();
        this.gradeCalculatorViewRight = new GradeCalculatorViewRight();

        if(studies !== null){
            this.gradeCalculatorViewRight.showStudy(studies);
            this.gradeCalculatorView.show();
        }
        else{
            fileManager.addEventListener("on-study-loaded", e => {
                if(window.location.hash === "#grade-calculator"){
                    let study = e.data;
                    this.gradeCalculatorView.show();
                    this.gradeCalculatorViewRight.showStudy(study);
                    
                    // let stud = studies;
                    // stud.addIntermediateResult([stud.kids[0], stud.kids[1]]);
                    // setStudyInstance(stud);
                    // this.gradeCalculatorView.show();
                }
            });
            fileManager.getStudy();
        }
        
    }
}

export default GradeCalculatorController;