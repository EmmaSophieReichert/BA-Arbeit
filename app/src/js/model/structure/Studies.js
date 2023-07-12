import Config from "../../utils/Config.js";
import Module from "./Module.js";
import Semester from "./Semester.js";
import Subject from "./Subject.js";
import IntermediateResult from "./IntermediateResult.js";

class Studies {

    constructor(degree, totalECTS, semesters, subjects, specialization = null, intermediateResults = [], children = null, id = "study-ID") {
        this.degree = degree;
        this.specialization = specialization;
        this.totalECTS = totalECTS;

        this.subjects = [];
        this.semesters = [];
        this.initSemesters(semesters);
        this.initSubjects(subjects);
        this.calculateSemesterECTS();
        this.calculateSubjectECTS();
        this.intermediateResults = [];
        this.initIntermediateResults(intermediateResults);
        this.children = children;
        if (children === null) {
            this.children = [];
            this.addAllModulesToChildren();
        }
        console.log("WORLD", this.children);
        console.log(this.toTreeData());
        this.grade = null;
        this.calculateGrade();

        this.ID = id;
        //this.addIntermediateResult([this.children[0], this.children[1]]);
    }

    getID() {
        return this.ID;
    }

    getChild(id){
        let data = this.getModuleAndSubjectByID(id);
        if(data !== null){
            return data.module;
        }
        data = this.findIntermediateResultById(id)
        if(data !== null){
            return data;
        }
        return null;
    }

    calculateGrade() {
        let weightSum = 0,
            gradeSum = 0;
        for (let childID of this.children) {
            let child = this.getChild(childID);
            console.log(child);
            if (child.grade !== null) {
                weightSum += child.weight;
                gradeSum += child.grade;
            }
        }
        console.log(weightSum, gradeSum);
        if (weightSum !== 0 || gradeSum !== 0) {
            this.grade = gradeSum / weightSum;
        }
    }

    addAllModulesToChildren() {
        for (let subject of this.subjects) {
            for (let module of subject.modules) {
                this.children.push(module.ID);
            }
        }
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

    initIntermediateResults(intermediateResults){
        console.log("Inter");
        for(let intermediateResult of intermediateResults){
            console.log("INTER", intermediateResult);
            let intRes = new IntermediateResult(intermediateResult.children, intermediateResult.name, intermediateResult.weight, intermediateResult.grade, intermediateResult.ID)
            this.intermediateResults.push(intRes);
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

    deleteModule(id) {
        for (let subject of this.subjects) {
            subject.modules = subject.modules.filter(function (module) {
                return module.ID !== id;
            });
        }
        this.children = this.children.filter(function (child) {
            return child !== id;
        });
        for(let childID of this.children){
            let child = this.getChild(childID);
            if(child instanceof IntermediateResult){
                child.removeChild(id);
            }
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
                if (module.passed) {
                    subjectECTS += module.ECTS;
                }
            });
            subject.currentECTS = subjectECTS;
        });
    }

    getSemester(count) {
        for (let semester of this.semesters) {
            if (semester.count === count) {
                return semester;
            }
        }
        return null;
    }

    getSubject(subjectTitle) {
        for (let subject of this.subjects) {
            if (subject.title === subjectTitle) {
                return subject;
            }
        }
    }

    getSubjectIndex(subjectTitle) {
        for (let i = 0; i < this.subjects.length; i++) {
            if (this.subjects[i].title === subjectTitle) {
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
            children: this.children,
            intermediateResults: this.intermediateResults,
        }
    }

    toTreeData() {
        var treeData = {
            chart: {
                container: "#grade-tree",
                rootOrientation: "EAST",
                levelSeparation: 200,
                siblingSeparation: 5,
                subTeeSeparation: 15,
                padding: 20,
                connectors: {
                    style: {
                        'stroke-width': 1.5,
                        'stroke': "rgb(192, 192, 192)",
                    }
                },
            },
            
            node: {
                HTMLclass: "grade-view-element",
                drawLineThrough: true
            },
            nodeStructure: {
                text: {
                    name: "Gesamtergebnis " + this.grade,
                },
                HTMLclass: "root-grade-view-element",
                children: [],
            },
            
        };

        // Iterate over children of studies
        for (let childID of this.children) {
            let child = this.getChild(childID);
            if (child instanceof Module) {
                let data = this.getModuleAndSubjectByID(child.ID)
                var moduleNode = this.getModuleNode(data);
                treeData.nodeStructure.children.push(moduleNode);
            } else if (child instanceof IntermediateResult) {
                var intermediateResultNode = this.buildIntermediateResultNode(child);
                treeData.nodeStructure.children.push(intermediateResultNode);
            }
        }
        console.log(treeData);
        return treeData;
    }

    getModuleNode(data) {
        let gradeAddition = "";
        if(data.module.grade !== null){
            gradeAddition = "<div class='grade-module-number'><p>" + data.module.grade + "</p></div>"
        }

        return {
            // text: {
            //     name:  data.module.title,
            // },
            "parentConnector": {
                style: {
                    "stroke": Config.COLOUR_CODES_DARK[data.subject.colourCode].substring(0,7),
                    "stroke-width": 1.5,
                },
            },
            HTMLclass: "grade-module subject-" + data.subject.colourCode,
            innerHTML: "<div class='grade-module-wrap'><div class='grade-module-text'><p>" + data.module.title + "</p></div>" + gradeAddition + "</div>",
            data: {
                id: data.module.ID
            },
        };
    }

    buildIntermediateResultNode(intermediateResult) {
        let gradeAddition = "";
        if(intermediateResult.grade !== null){
            gradeAddition = "<div class='grade-module-number'><p>" + intermediateResult.grade + "</p></div>"
        }
        var intermediateResultNode = {
            // text: {
            //     name: "Zwischenergebnis " + gradeAddition,//intermediateResult.name,
            // },
            data: {
                id: intermediateResult.ID
            },
            innerHTML: "<div class='grade-module-wrap'><div class='grade-module-text'><p>" + "Zwischenergebnis" + "</p></div>" + gradeAddition + "</div>",
            children: []
        };
        let subjects = [];
        for (var child of intermediateResult.children) {
            var childModule = this.getModuleAndSubjectByID(child).module;
            var childIntermediateResult = this.findIntermediateResultById(child);

            if (childModule) {
                let data = this.getModuleAndSubjectByID(childModule.ID);
                var moduleNode = this.getModuleNode(data);
                subjects.push(data.subject);
                intermediateResultNode.children.push(moduleNode);
            } else if (childIntermediateResult) {
                var childIntermediateResultNode = this.buildIntermediateResultNode(childIntermediateResult);
                intermediateResultNode.children.push(childIntermediateResultNode);
            }
        }
        if(subjects.every((sub) => sub === subjects[0])){
            let sub = subjects[0];
            intermediateResultNode.HTMLclass = "grade-module subject-" + sub.colourCode;
            //intermediateResultNode.parentConnector.style.stroke = Config.COLOUR_CODES_DARK[sub.colourCode].substring(0,7);
            //intermediateResultNode.parentConnector.style.strokeWidth = 1.5; //TODO: Does not work
        }
        return intermediateResultNode;
    }

    findIntermediateResultById(intermediateResultId) {
        for(let intRes of this.intermediateResults){
            if(intRes.ID = intermediateResultId){
                return intRes;
            }
        }
        return null;
    }

    addIntermediateResult(childrenIDs) {
        // Check if children have the same parent
        var parentIDs = [],
            parent;
        for (let childID of childrenIDs) {
            parent = this.getParent(childID);
            var parentID = parent.ID;
            if (!parentID) {
                console.log(`Parent not found for child with ID: ${childID}`);
                return;
            }
            parentIDs.push(parentID);
        }

        if (!this.checkSameParent(parentIDs)) {
            console.log('Children do not have the same parent');
            return;
        }

        let childs = [];
        for (let childID of this.children) {
            if (childrenIDs.includes(childID)) {
                //let child = this.getChild(childID);
                childs.push(childID);
            }
        }

        // Remove children from parent
        //var parent = this.getParent(parentIDs[0]);
        for (var childID of childrenIDs) {
            parent.removeChild(childID);
        }

        // Create new IntermediateResult
        var intermediateResult = new IntermediateResult(childs);
        this.intermediateResults.push(intermediateResult);
        parent.addChild(intermediateResult.ID);
        console.log(this.children);
    }

    removeChild(childID) {
        this.children = this.children.filter(function (child) {
            return child !== childID;
        });
    }

    addChild(child) {
        this.children.push(child);
    }

    // Helper method to check if all parent IDs are the same
    checkSameParent(parentIDs) {
        return parentIDs.every((parentID) => parentID === parentIDs[0]);
    }

    // Helper method to get the parent object of a child ID
    getParent(childID) {
        for (let childid of this.children) {
            let child = this.getChild(childid);
            if (child.ID === childID) {
                return this;
            }
            if (child instanceof IntermediateResult && child.children !== null) {
                if (child.containsID(childID)) {
                    return child.isParent(childID);
                }
            }
        }
        return null;
    }
}

export default Studies;