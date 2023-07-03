class Module {
    constructor(title, ID, ECTS, recommendedSemester = null, minSemLength = null, posY = 0) {
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

    setPosition(x, y){
        this.selectedSemester = x + 1;
        this.posY = y;
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