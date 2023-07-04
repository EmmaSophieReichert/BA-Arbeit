class Module {
    constructor(title, ID, ECTS, recommendedSemester = 1, minSemLength = 1, posY = 0) {
        this.title = title;
        this.ID = ID;
        this.ECTS = ECTS;

        this.recommendedSemester = recommendedSemester;
        //this.period = period;
        this.minSemLength = minSemLength;

        //this.moduleComponents = [];

        this.selectedSemester = [];
        //this.grade = null;
        //this.passed = null;
        this.posY = posY;
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