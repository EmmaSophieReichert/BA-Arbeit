class ModuleComponent {
    
    constructor(name, type, ECTS) {
        this.name = name;
        this.type = type;
        this.ECTS = ECTS;
        this.grade = null;
        this.weight = null;
        this.selectedSemester = null;
        this.assessments = [];
    }
}