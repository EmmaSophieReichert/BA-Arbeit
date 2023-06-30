class Semester {
    constructor(period, count) {
        this.period = period;
        this.year = null;
        this.count = count;
        
        this.ECTS = null;
    }

    // toJSON(){
    //     return {
    //         period: this.period,
    //     }
    // }
}

export default Semester;