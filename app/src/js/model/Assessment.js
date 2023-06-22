class Assessment {
    constructor() {
        this.passed = null;
    }
}

class GradedAssessment extends Assessment {
    constructor() {
        super();
        this.mark = null;
        this.weighting = null;
    }
}