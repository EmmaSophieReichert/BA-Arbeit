class Module {
    
    constructor(title, ID, ECTS, period = "beide", recommendedSemester = 1, minSemLength = 1, posY = 0, passed = false, grade = null, weight = 1) {
        this.title = title;
        this.ID = ID;
        this.ECTS = ECTS;

        this.recommendedSemester = recommendedSemester;
        this.period = period;
        this.minSemLength = minSemLength;

        this.selectedSemester = [];
        this.conditions = [];

        this.posY = posY;

        this.passed = passed;
        this.grade = grade ? parseFloat(grade) : null;
        this.weight = weight;
    }

    setPosition(x, y) {
        this.selectedSemester.splice(0, this.selectedSemester.length);
        for (let i = 1; i <= this.minSemLength; i++) {
            this.addSelectedSemester(x + i);
        }
        this.selectedSemester.sort();
        this.posY = y;
    }

    addSelectedSemester(sem) {
        this.selectedSemester.push(sem);
    }

    addCondition(con) {
        this.conditions.push(con);
    }

    setPassed(passed) {
        this.passed = passed;
    }

    containsID(childID) {
        if (this.ID === childID) {
            return true;
        }
        return false;
    }

    getConditionString() {
        let condString = ""
        for (let i = 0; i < this.conditions.length; i++) {
            if ((i + 1) === this.conditions.length) {
                condString += this.conditions[i];
            }
            else {
                condString += this.conditions[i] + ", ";
            }
        }
        return condString;
    }

    isParent(childID) {
        return null;
    }
}

export default Module;