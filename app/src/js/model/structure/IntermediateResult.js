import fileManager from "../FileManager.js";
import { studies } from "../studiesInstance.js";

class IntermediateResult {

    constructor(name = "int", weight = 1, grade = null, id = null) {
        this.name = name;

        this.weight = weight;
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
        this.calculateGrade();
        fileManager.addEventListener("on-study-loaded", e => {
            if (window.location.hash === "#grade-calculator") {
                this.calculateGrade();
            }
        });
    }

    addChild(moduleId) {
        this.kids.push(moduleId);
        this.calculateGrade();
    }

    removeChild(childID, childIsUpdated = false) {
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
        if (this.kids.length === 0 && !childIsUpdated) {
            console.log("Delete self");
            studies.deleteIntermediateResult(this.ID);
        }
    }

    calculateGrade() {
        let weightSum = 0,
            gradeSum = 0;
        for (let childID of this.kids) {
            if (studies) {
                let child = studies.getChild(childID);
                if (child) {
                    if (child.grade !== null) {
                        weightSum += child.weight;
                        gradeSum += child.grade * child.weight;
                    }
                }
            }
        }
        if (weightSum !== 0 || gradeSum !== 0) {
            this.grade = Number((gradeSum / weightSum).toFixed(2));
            if (studies) {
                let parent = studies.getParent(this.ID);
                if (parent) {
                    parent.calculateGrade();
                }
            }
        }
        else if (weightSum === 0 && gradeSum !== 0) {
            this.grade = null;
        }
    }

    //checks if itself or its kids contain a kid with the given ID
    containsID(childID) {
        if (this.ID === childID) {
            return true;
        }
        for (let childid of this.kids) {
            let child = studies.getChild(childid);
            if (child) {
                if (child.containsID(childID)) {
                    return true;
                }
            }

        }
        return false;
    }

    //checks if it is the parent or grandparent and so on of a child
    isParent(childID) {
        for (let childid of this.kids) {
            if (studies !== undefined && studies !== null) {
                let child = studies.getChild(childid);
                if (child) {
                    if (child.ID === childID) {
                        return this;
                    }
                    else if (child instanceof IntermediateResult) {
                        if (child.containsID(childID)) {
                            return child.isParent(childID);
                        }
                    }
                }
            }
        }
        return null;
    }
}

//creates unique ID
//Quelle: https://stackoverflow.com/a/2117523
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export default IntermediateResult;
