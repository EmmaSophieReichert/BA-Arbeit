import Config from "../../utils/Config.js";
import Module from "./Module.js";
import Semester from "./Semester.js";
import Subject from "./Subject.js";
import IntermediateResult from "./IntermediateResult.js";

class Studies {

    constructor(degree, totalECTS, semesters, subjects, specialization = null, intermediateResults = [], kids = null, id = "study-ID") {
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
        this.kids = kids;
        if (kids === null) {
            this.kids = [];
            this.addAllModulesTokids();
        }
        this.grade = null;
        this.calculateGrade();

        this.ID = id;
        //this.addIntermediateResult([this.kids[0], this.kids[1]]);
    }

    // updateModule(id, mod){
    //     let data =  this.getModuleAndSubjectByID(id);
    //     let parent
    // }

    getID() {
        return this.ID;
    }

    getChild(id) {
        let data = this.getModuleAndSubjectByID(id);
        if (data !== null) {
            return data.module;
        }
        data = this.findIntermediateResultById(id)
        if (data !== null) {
            return data;
        }
        return null;
    }

    calculateGrade() {
        let weightSum = 0,
            gradeSum = 0;
        for (let childID of this.kids) {
            let child = this.getChild(childID);
            if (child) {
                if (child.grade !== null) {
                    weightSum += child.weight;
                    gradeSum += child.grade * child.weight;
                }
            }
        }
        if (weightSum !== 0 || gradeSum !== 0) {
            this.grade = Number((gradeSum / weightSum).toFixed(3));
        }
    }

    addAllModulesTokids() {
        for (let subject of this.subjects) {
            for (let module of subject.modules) {
                this.kids.push(module.ID);
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
        let i = this.subjects.length;
        for (let subject of subjects) {
            let sub = new Subject(subject.title, subject.ects, subject.colourCode ? subject.colourCode : i);
            i++;
            if (subject.modules !== null && subject.modules !== undefined) {
                for (let mod of subject.modules) {
                    let m = new Module(mod.title, mod.ID, mod.ECTS, mod.period, mod.recommendedSemester, mod.minSemLength, mod.posY, mod.passed, mod.grade, mod.weight);
                    for (let s of mod.selectedSemester) {
                        m.addSelectedSemester(s);
                    }
                    m.conditions = mod.conditions;
                    sub.addModule(m);
                }
            }
            this.subjects.push(sub);
        }
    }

    initIntermediateResults(intermediateResults) {
        for (let intermediateResult of intermediateResults) {
            let intRes = new IntermediateResult(intermediateResult.name, intermediateResult.weight, intermediateResult.grade, intermediateResult.ID)
            for (let child of intermediateResult.kids) {
                intRes.addChild(child);
            }
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
        this.kids = this.kids.filter(function (child) {
            return child !== id;
        });
        for (let childID of this.kids) {
            let child = this.getChild(childID);
            if (child instanceof IntermediateResult) {
                child.removeChild(id);
            }
        }
        this.calculateGrade();
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

    setModuleGrade(id, grade, weight) {
        for (let subject of this.subjects) {
            for (let module of subject.modules) {
                if (module.ID === id) {
                    module.grade = grade ? parseFloat(grade) : grade;
                    module.weight = weight ? parseFloat(weight) : weight;
                    let parent = this.getParent(id);
                    parent.calculateGrade();
                }
            }
        }
        this.calculateGrade();
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

    deleteSubject(subjectTitle) {
        for (let subject of this.subjects) {
            if (subject.title === subjectTitle) {
                for(let mod of subject.modules){
                    this.deleteModule(mod.ID);
                }
            }
        }
        this.subjects = this.subjects.filter(function (sub) {
            return sub.title !== subjectTitle;
        });
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
            kids: this.kids,
            intermediateResults: this.intermediateResults,
        }
    }

    toTreeData() {
        let treeData = {
            chart: {
                container: "#grade-tree",
                rootOrientation: "EAST",
                levelSeparation: 30,
                siblingSeparation: 8,
                subTeeSeparation: 25,
                padding: 50,
                // scrollbar: "fancy",
                connectors: {
                    style: {
                        'stroke-width': 1.5,
                        'stroke': "rgb(192, 192, 192)",
                    }
                },
                node: {
                    HTMLclass: "grade-view-element",
                    drawLineThrough: true,
                },
            },
            nodeStructure: {
                text: {
                    name: "Gesamtergebnis " + (this.grade ? this.grade : ""),
                },
                HTMLclass: "root-grade-view-element",
                children: [],
            },

        };

        // Iterate over kids of studies
        for (let childID of this.kids) {
            let child = this.getChild(childID);
            if (child instanceof Module) {
                let data = this.getModuleAndSubjectByID(child.ID)
                let moduleNode = this.getModuleNode(data);
                treeData.nodeStructure.children.push(moduleNode);
            } else if (child instanceof IntermediateResult) {
                let intermediateResultNode = this.buildIntermediateResultNode(child);
                treeData.nodeStructure.children.push(intermediateResultNode);
            }
        }
        console.log(treeData);
        return treeData;
    }

    getModuleNode(data) {
        let gradeAddition = "",
            weightAddition = "";
        if (data.module.grade !== null) {
            gradeAddition = "<div class='grade-module-number'><p>" + data.module.grade + "</p></div>";
            weightAddition =  "<div class='grade-module-weight text-subject-"+ data.subject.colourCode +"'><p> x" + data.module.weight + "</p></div>";
        }

        return {
            // text: {
            //     name:  data.module.title,
            // },
            "parentConnector": {
                style: {
                    "stroke": Config.COLOUR_CODES_DARK[data.subject.colourCode].substring(0, 7),
                    "stroke-width": 1.5,
                },
            },
            connectors:{
                style: {
                    "stroke": Config.COLOUR_CODES_DARK[data.subject.colourCode].substring(0, 7),
                    "stroke-width": 1.5,
                },
            },
            HTMLclass: "grade-module",
            HTMLid: data.module.ID,
            innerHTML: "<div class='grade-module-div'><div class='grade-module-wrap subject-"+ data.subject.colourCode +"'><div class='grade-module-text'><p>" + data.module.title + "</p></div>" + gradeAddition + "</div>" + weightAddition + "</div>",
            data: {
                id: data.module.ID
            },
        };
    }

    buildIntermediateResultNode(intermediateResult) {
        let gradeAddition = "",
            weightAddition = "";
        if (intermediateResult.grade !== null) {
            gradeAddition = "<div class='grade-module-number'><p>" + intermediateResult.grade + "</p></div>";
            weightAddition = "<div class='grade-module-weight'><p> x" + intermediateResult.weight + "</p></div>";
        }
        let intermediateResultNode = {
            // text: {
            //     name: "Zwischenergebnis " + gradeAddition,//intermediateResult.name,
            // },
            data: {
                id: intermediateResult.ID
            },
            innerHTML: "<div class='grade-module-div'><div class='grade-module-wrap'><div class='grade-module-text'><p>" + intermediateResult.name + "</p></div>" + gradeAddition + "</div>" + weightAddition + "</div>",
            HTMLid: intermediateResult.ID,
            HTMLclass: "grade-module intermediate-result",
            children: []
        };
        let subjects = [];
        for (let child of intermediateResult.kids) {
            let data = this.getModuleAndSubjectByID(child);
            let childIntermediateResult = this.findIntermediateResultById(child);

            if (data) {
                let moduleNode = this.getModuleNode(data);
                subjects.push(data.subject);
                intermediateResultNode.children.push(moduleNode);
            } else if (childIntermediateResult) {
                let childIntermediateResultNode = this.buildIntermediateResultNode(childIntermediateResult);
                intermediateResultNode.children.push(childIntermediateResultNode);
            }
        }
        // if(subjects.every((sub) => sub === subjects[0]) && subjects.length !== 0){ //subjects the same?
        //     let sub = subjects[0];
        //     intermediateResultNode.HTMLclass = "grade-module subject-" + sub.colourCode;
        //     //intermediateResultNode.parentConnector.style.stroke = Config.COLOUR_CODES_DARK[sub.colourCode].substring(0,7);
        //     //intermediateResultNode.parentConnector.style.strokeWidth = 1.5; //TODO: Does not work
        // }
        return intermediateResultNode;
    }

    findIntermediateResultById(intermediateResultId) {
        for (let intRes of this.intermediateResults) {
            if (intRes.ID === intermediateResultId) {
                return intRes;
            }
        }
        return null;
    }

    addIntermediateResult(kidsIDs, title, weight) {
        // Check if kids have the same parent
        let parentIDs = [],
            parent;
        for (let childID of kidsIDs) {
            parent = this.getParent(childID);
            if (!parent) {
                console.log(`Parent not found for child with ID: ${childID}`);
                return;
            }
            let parentID = parent.ID;
            parentIDs.push(parentID);
        }

        if (!this.checkSameParent(parentIDs)) {
            console.log('kids do not have the same parent'); //TODO: show this in eror message!
            return;
        }

        // let childs = []; TODO: Was sollte hier geprüft werden?
        // for (let childID of this.kids) {
        //     if (kidsIDs.includes(childID)) {
        //         //let child = this.getChild(childID);
        //         childs.push(childID);
        //     }
        // }

        // Create new IntermediateResult
        let intermediateResult = new IntermediateResult(title, weight);
        for (let ch of kidsIDs) {
            intermediateResult.addChild(ch);
        }
        this.intermediateResults.push(intermediateResult);
        parent.addChild(intermediateResult.ID);

        // Remove kids from parent
        for (let childID of kidsIDs) {
            parent.removeChild(childID);
        }

        this.calculateGrade();
    }

    deleteIntermediateResult(intermediateResultID) {
        // Find the intermediateResult object with the given ID
        let intermediateResult = this.findIntermediateResultById(intermediateResultID);
        if (!intermediateResult) {
            console.log(`IntermediateResult with ID ${intermediateResultID} not found`);
            return;
        }

        // Get the parent of the intermediateResult
        let parent = this.getParent(intermediateResultID);
        if (!parent) {
            console.log(`Parent not found for IntermediateResult with ID: ${intermediateResultID}`);
            return;
        }

        // Move children of the intermediateResult to the parent
        for (let child of intermediateResult.kids) {
            parent.addChild(child);
        }

        // Remove the intermediateResult from the parent's children
        parent.removeChild(intermediateResultID);
        parent.calculateGrade();

        // Remove the intermediateResult from the intermediateResults list
        let index = this.intermediateResults.findIndex((result) => result.ID === intermediateResultID);
        if (index !== -1) {
            this.intermediateResults.splice(index, 1);
        }

        this.calculateGrade();
    }

    removeChild(childID) {
        this.kids = this.kids.filter(function (child) {
            return child !== childID;
        });
    }

    addChild(child) {
        this.kids.push(child);
        this.calculateGrade();
    }

    // Helper method to check if all parent IDs are the same
    checkSameParent(parentIDs) {
        return parentIDs.every((parentID) => parentID === parentIDs[0]);
    }

    // Helper method to get the parent object of a child ID
    getParent(childID) {
        for (let childid of this.kids) {
            let child = this.getChild(childid);
            if (child) {
                if (child.ID === childID) {
                    return this;
                }
                if (child instanceof IntermediateResult && child.kids !== null) {
                    if (child.containsID(childID)) {
                        return child.isParent(childID);
                    }
                }
            }
        }
        return null;
    }
}

export default Studies;