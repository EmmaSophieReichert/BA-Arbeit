import Semester from "./Semester";
import Subject from "./Subject";

class Studies {

    constructor(degree, totalECTS, semesters, subjects, specialization = null) {
        this.degree = degree
        this.specialization = specialization,
        this.totalECTS = totalECTS;

        this.subjects = [];
        this.semesters = [];
        this.initSemesters(semesters)
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

    initSemesters(semesters){
        for (let semester of semesters) {
            let sem = new Semester(semester.period, semester.count);
            this.subjects.push(sem);
        }
    }

    initSubjects(subjects) {
        for (let subject of subjects) {
            let sub = new Subject(subject.title, subject.ects);
            this.subjects.push(sub);
        }
    }

    // toJSON() {
    //     return {
    //         degree: this.degree,
    //         specialization: this.specialization,
    //         totalECTS: this.totalECTS,
    //         subjects: JSON.stringify(this.subjects),
    //         semester: JSON.stringify(this.semesters),
    //     }
    // }
}

export default Studies;