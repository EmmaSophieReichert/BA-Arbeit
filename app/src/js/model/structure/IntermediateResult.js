import { studies } from "../studiesInstance";

class IntermediateResult {
    
    constructor(name = "int", weight = 1, grade = null, id = null) {
        console.log("THIS", this);
        this.name = name;

        this.weight = weight;
        
        // console.log(this.kids);
        // //this.kids = kids;// ? kids : [];
        this.grade = grade;
        
        this.ID = null;
        if (id === null) {
            this.ID = uuidv4().toString();
        }
        else {
            this.ID = id;
        }
        this.kids = [];
        if (grade === null) {
            this.calculateGrade();
        }
        // console.log(this.ID, id, this.kids);
    }

    addChild(moduleId) {
        // let chil =  structuredClone(this.kids);
        // chil.push(moduleId);
        // this.kids[0] = "haha";
        // console.log("CHILL", chil, this.ID);
        this.kids.push(moduleId);
        this.calculateGrade();
    }

    removeChild(childID) {
        this.kids = this.kids.filter(function (child) {
            return child !== childID;
        });
        for (let childID of this.kids) {
            if (studies !== undefined && studies !== null) {
                let child = studies.getChild(childID);
                if (child instanceof IntermediateResult) {
                    child.removeChild(childID);
                }
            }
        }
        this.calculateGrade();
    }

    calculateGrade() {
        let weightSum = 0,
            gradeSum = 0;
        for (let childID of this.kids) {
            if (studies !== undefined && studies !== null) {
                let child = studies.getChild(childID);
                if (child.grade !== null) {
                    weightSum += child.weight;
                    gradeSum += child.grade;
                }
            }
        }
        if (weightSum !== 0 || gradeSum !== 0) {
            this.grade = gradeSum / weightSum;
        }
    }

    containsID(childID) {
        if (this.ID === childID) {
            return true;
        }
        for (let childid of this.kids) {
            let child = studies.getChild(childid);
            if (child.containsID(childID)) {
                return true;
            }
        }
        return false;
    }

    isParent(childID) {
        for (let childid of this.kids) {
            if (studies !== undefined && studies !== null) {
                let child = studies.getChild(childid);
                if (child.ID === childID) {
                    return this;
                }
                else if(child instanceof IntermediateResult) {
                    if (child.containsID(childID)) {
                        return child.isParent(childID);
                    }
                }
            }
        }
        return null;
    }
}

//Quelle: https://stackoverflow.com/a/2117523
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
}

export default IntermediateResult;
