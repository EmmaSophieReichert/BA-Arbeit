import Studies from "./structure/Studies.js";
import { studies } from "./studiesInstance.js";

class CatalogueManager {

    constructor() {

    }

    filterStudies(filterValues) {
        let study = structuredClone(studies) ;
        // Filtern der Subjects
        var filteredSubjects = study.subjects.filter(function (subject) {
            // Filtern nach Fachname (wenn ausgewählt)
            if (filterValues.subjects.length !== 0) {
                return filterValues.subjects.includes(subject.title);
            }
            return true; // Wenn kein Fach ausgewählt wurde, alle Subjects zurückgeben
        });

        // Filtern der Modules in den gefilterten Subjects
        var filteredModules = [];
        filteredSubjects.forEach(function (subject) {
            var filteredSubjectModules = subject.modules.filter(function (module) {
                let willBeShown = true;
                if (filterValues.inPlan) {
                    willBeShown = willBeShown && module.selectedSemester.length !== 0;
                }
                if (filterValues.notInPlan) {
                    willBeShown = willBeShown && module.selectedSemester.length === 0;
                }
                if (filterValues.passed.length !== 0) {
                    willBeShown = willBeShown && filterValues.passed.includes(module.passed.toString());
                }
                if (filterValues.turnus.length !== 0) {
                    willBeShown = willBeShown && filterValues.turnus.includes(module.period); //||  filterValues.turnus === "beide" ;
                }
                if (filterValues.recommendedSemester.length !== 0) {
                    willBeShown = willBeShown && filterValues.recommendedSemester.includes(module.recommendedSemester);
                }
                if (filterValues.selectedSemester.length !== 0) {
                    let inSelSem = false;
                    for(let selectedSemester of module.selectedSemester){
                        inSelSem = inSelSem || filterValues.selectedSemester.includes(selectedSemester);
                    }
                    willBeShown = willBeShown && inSelSem;
                }
                return willBeShown; // No Filter -> all Modules
            });
            subject.modules = filteredModules.concat(filteredSubjectModules);
        });

        // Erstellen einer neuen Instanz von Studies mit den gefilterten Daten
        var filteredStudies = new Studies(studies.degree, studies.totalECTS, studies.semesters, filteredSubjects, studies.specialization);

        return filteredStudies;
    }

}

export default CatalogueManager;