import Semester from "./Semester";
import Subject from "./Subject";

class Studies {
    constructor(degree, totalECTS, semester, period, subjects, specialization = null) {
        this.degree = degree
        this.specialization = specialization,
            this.totalECTS = totalECTS;

        this.subjects = [];
        this.semesters = [];
        this.initSemesters(semester, period);
        this.initSubjects(subjects);

        console.log(JSON.stringify(this));
        //this.grade = null;
    }

    initSemesters(semester, period) {
        let periodCount = 0;
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
            this.semesters.push(sem);
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