import Config from "../../utils/Config.js";
import Module from "./Module.js";
import Semester from "./Semester.js";
import Subject from "./Subject.js";

class Studies {

    constructor(degree, totalECTS, semesters, subjects, specialization = null) {
        this.degree = degree;
        this.specialization = specialization;
        this.totalECTS = totalECTS;

        this.subjects = [];
        this.semesters = [];
        this.initSemesters(semesters);
        this.initSubjects(subjects);
        this.calculateSemesterECTS();
        this.calculateSubjectECTS();
        //this.grade = null;
    }

    static initFirstSemesters(semester, period) {
        let periodCount = 0,
            semesters = [];
        if (period === "Sommersemester") {
            periodCount = 1;
        }
        for (let i = 1; i <= semester; i++) {
            let sem;
            if (i % 2 !== periodCount) {
                sem = new Semester("Wintersemester", i);
            }
            else {
                sem = new Semester("Sommersemester", i);
            }
            semesters.push(sem);
        }
        return semesters;
    }

    initSemesters(semesters) {
        for (let semester of semesters) {
            let sem = new Semester(semester.period, semester.count);
            this.semesters.push(sem);
        }
    }

    initSubjects(subjects) {
        let i = 0;
        for (let subject of subjects) {
            let sub = new Subject(subject.title, subject.ects, subject.colourCode ? subject.colourCode : i);
            i++;
            if (subject.modules !== null && subject.modules !== undefined) {
                for (let mod of subject.modules) {
                    let m = new Module(mod.title, mod.ID, mod.ECTS, mod.period, mod.recommendedSemester, mod.minSemLength, mod.posY, mod.passed, mod.grade);
                    for (let s of mod.selectedSemester) {
                        m.addSelectedSemester(s);
                    }
                    sub.addModule(m);
                }
            }
            this.subjects.push(sub);
        }
    }

    getModuleAndSubjectByID(id) {
        for (let subject of this.subjects) {
            for (let module of subject.modules) {
                if (module.ID === id) {
                    return {
                      module: module,
                      subject: subject, 
                    };
                }
            }
        }
        return null;
    }

    deleteModule(id){
        for (let subject of this.subjects) {
            subject.modules = subject.modules.filter(function(module) {
                return module.ID !== id;
            });
        }
    }

    changeModulePosition(id, x, y) {
        for (let subject of this.subjects) {
            for (let module of subject.modules) {
                if (module.ID === id) {
                    module.setPosition(x, y);
                }
            }
        }
    }

    setModulePassed(id, passed) {
        for (let subject of this.subjects) {
            for (let module of subject.modules) {
                if (module.ID === id) {
                    module.setPassed(passed);
                }
            }
        }
        this.calculateSubjectECTS();
    }

    setModuleGrade(id, grade) {
        for (let subject of this.subjects) {
            for (let module of subject.modules) {
                if (module.ID === id) {
                    module.grade = grade;
                }
            }
        }
    }

    calculateSemesterECTS() {
        this.semesters.forEach((semester) => {
            let semesterECTS = 0;
            this.subjects.forEach((subject) => {
                subject.modules.forEach((module) => {
                    if (module.selectedSemester[module.selectedSemester.length - 1] === semester.count) {
                        semesterECTS += module.ECTS;
                    }
                });
            });
            semester.ECTS = semesterECTS;
        });
    }

    calculateSubjectECTS() {
        this.subjects.forEach((subject) => {
            let subjectECTS = 0;
            subject.modules.forEach((module) => {
                if(module.passed){
                    subjectECTS += module.ECTS;
                }
            });
            subject.currentECTS = subjectECTS;
        });
    }

    getSemester(count){
        for(let semester of this.semesters){
            if(semester.count === count){
                return semester;
            }
        }
        return null;
    }

    getSubject(subjectTitle){
        for(let subject of this.subjects){
            if(subject.title === subjectTitle){
                return subject;
            }
        }
    }

    getSubjectIndex(subjectTitle){
        for(let i = 0; i <  this.subjects.length; i++){
            if(this.subjects[i].title === subjectTitle){
                return i;
            }
        }
    }

    toJSON() {

        return {
            degree: this.degree,
            specialization: this.specialization,
            totalECTS: this.totalECTS,
            subjects: this.subjects,
            semesters: this.semesters,
        }
    }

    /* get degree() {
        return this.degree;
    }

    get specialization() {
        return this.specialization;
    }

    get totalECTS() {
        return this.totalECTS;
    }

    get subjects() {
        return this.subjects;
    }

    get semesters() {
        return this.semesters;
    } */
}

export default Studies;