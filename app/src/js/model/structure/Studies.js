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
        //this.grade = null;
    }

    static initFirstSemesters(semester, period) {
        let periodCount = 0,
            semesters = [];
        if (period === "summer") {
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
        for (let subject of subjects) {
            let sub = new Subject(subject.title, subject.ects);
            if(subject.modules !== null && subject.modules !== undefined){
                for (let mod of subject.modules){
                    console.log(mod);
                    let m = new Module(mod.title, mod.ID, mod.ECTS, mod.recommendedSemester, mod.minSemLength, mod.posY);
                    sub.addModule(m);
                }
            }
            this.subjects.push(sub);
        }
    }

    getModuleByID(id){
        for(let subject of this.subjects){
            for(let module of subject.modules){
                if(module.ID === id){
                    return module;
                }
            }
        }
        return null;
    }

    changeModulePosition(id, x, y){
        for(let subject of this.subjects){
            for(let module of subject.modules){
                if(module.ID === id){
                    module.setPosition(x, y);
                }
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