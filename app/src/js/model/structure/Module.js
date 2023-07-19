class Module {
    constructor(title, ID, ECTS, period = "beide", recommendedSemester = 1, minSemLength = 1, posY = 0, passed = false, grade = null, weight = 1) {
        this.title = title;
        this.ID = ID;
        this.ECTS = ECTS;

        this.recommendedSemester = recommendedSemester;
        this.period = period;
        this.minSemLength = minSemLength;

        //this.moduleComponents = [];

        this.selectedSemester = [];

        this.posY = posY;

        this.passed = passed;
        this.grade = grade ? parseFloat(grade) : null;
        // this.weight = weight ? parseFloat(weight) : 1;
        this.weight = weight;
    }

    setPosition(x, y) {
        this.selectedSemester.splice(0, this.selectedSemester.length);
        for(let i = 1; i <= this.minSemLength; i++){
            this.addSelectedSemester(x+i);
        }
        this.selectedSemester.sort();
        this.posY = y;
    }

    addSelectedSemester(sem) {
        this.selectedSemester.push(sem);
    }

    setPassed(passed){
        this.passed = passed;
    }

    containsID(childID){
        if(this.ID === childID){
            return true;
        }
        return false;
    }

    isParent(childID){
        return null;
    }

    // setGrade(grade) {
    //     this.grade = grade;
    // }

    // setPassed(passed) {
    //     this.passed = passed;
    // }

    // addModuleComponent(component) {
    //     this.moduleComponents.push(component);
    // }
}

export default Module;