class Studies {
    constructor(degree, totalECTS, semester, period, subjects, specialization = null) {
        this.degree = degree
        this.specialization = specialization,
        this.totalECTS = totalECTS;

        this.subjects = [];
        this.semesters = [];
        this.initSemesters(semester, period);
        this.initSubjects(subjects);
        
        //this.grade = null;
    }

    initSemesters(semester, period){

    }

    initSubjects(subjects){

    }
    
    toJSON(){
        return {
            degree = this.degree,
            specialization: this.specialization,
            totalECTS: this.totalECTS,
            subjects: JSON.stringify(this.subjects) ,
            semester: JSON.stringify(this.semesters),
        }
    }
}

export default Studies;