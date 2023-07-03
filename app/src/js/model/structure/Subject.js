class Subject {
    constructor(title, ECTS) {
        this.title = title;
        this.ects = ECTS;

        this.modules = [];
        //this.grade = null;
        this.currentECTS = 0;
    }

    addModule(module) {
        this.modules.push(module);
    }

    toJSON(){
        return {
            title: this.title,
            ects: this.ects,
            modules: this.modules,
            currentECTS: this.currentECTS,
        }
    }
}

export default Subject;