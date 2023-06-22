class Subject {
    constructor(title, ECTS) {
        this.title = title;
        this.ECTS = ECTS;

        this.modules = [];
        //this.grade = null;
        this.currentECTS = null;
    }

    addModule(module) {
        this.modules.push(module);
    }
}