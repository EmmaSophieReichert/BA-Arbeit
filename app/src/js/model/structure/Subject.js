class Subject {
    constructor(title, ECTS) {
        this.title = title;
        this.ECTS = ECTS;

        this.modules = [];
        //this.grade = null;
        this.currentECTS = 0;
    }

    addModule(module) {
        this.modules.push(module);
    }
}

export default Subject;