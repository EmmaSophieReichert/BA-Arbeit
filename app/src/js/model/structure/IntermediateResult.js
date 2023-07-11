class IntermediateResult {
    constructor(name, weight, id = crypto.randomUUID()) {
        this.name = name;
        this.id = id;
        this.weight = weight;
        this.children = [];
        this.grade = null;
        this.calculateGrade();
    }

    addChild(moduleId) {
        this.children.push(moduleId);
    }

    calculateGrade(){
        let weightSum = 0,
            gradeSum = 0;
        for(let child of this.children){
            if(child.grade !== null){
                weightSum += child.weight;
                gradeSum += child.grade;
            }
        }
        if(weightSum !== 0 || gradeSum !== 0){
            this.grade= gradeSum / weightSum;
        }
    }
}


