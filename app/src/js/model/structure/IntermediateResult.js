import { studies } from "../studiesInstance";

class IntermediateResult {
    constructor(children, name = "int", weight = 1, grade = null, id = crypto.randomUUID()) {
        this.name = name;
        this.ID = id;
        this.weight = weight;
        this.children = children ? children : [];
        this.grade = grade;
        console.log("GRADE", grade);
        if (grade === null) {
            this.calculateGrade();
        }
    }

    addChild(moduleId) {
        this.children.push(moduleId);
        this.calculateGrade();
    }

    removeChild(childID) {
        this.children = this.children.filter(function (child) {
            return child !== childID;
        });
        for (let childID of this.children) {
            if (studies !== undefined && studies !== null) {
                let child = studies.getChild(childID);
                if (child instanceof IntermediateResult) {
                    child.removeChild(id);
                }
            }
        }
        this.calculateGrade();
    }

    calculateGrade() {
        let weightSum = 0,
            gradeSum = 0;
        for (let childID of this.children) {
            if (studies !== undefined && studies !== null) {
                let child = studies.getChild(childID);
                console.log(child);
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
        for (let childid of this.children) {
            let child = studies.getChild(childid);
            if (child.containsID(childID)) {
                return true;
            }
        }
        return false;
    }

    isParent(childID) {
        for (let childid of this.children) {
            if (studies !== undefined && studies !== null) {
                let child = studies.getChild(childid);
                if (child.ID === childID) {
                    return this;
                }
                else {
                    if (child.containsID(childID)) {
                        return child.isParent();
                    }
                }
            }
        }
        return null;
    }
}

export default IntermediateResult;
