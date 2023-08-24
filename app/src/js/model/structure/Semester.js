class Semester {
    constructor(period, count, ECTS = 0) {
        this.period = period;
        this.year = null;
        this.count = count;

        this.ECTS = ECTS;
    }
}

export default Semester;