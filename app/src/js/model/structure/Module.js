class Module {
    constructor(title, ID, ECTS, recommendedSemester = null, period = null, minSemLength = null) {
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