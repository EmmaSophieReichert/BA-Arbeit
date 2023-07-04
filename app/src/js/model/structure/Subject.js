import Config from "../../utils/Config";

class Subject {
    constructor(title, ECTS, colourCode = 0) {
        this.title = title;
        this.ects = ECTS;

        this.modules = [];
        //this.grade = null;
        this.currentECTS = 0;
        this.colourCode = colourCode;
    }

    setColourCode(i){
        this.colourCode = i;
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