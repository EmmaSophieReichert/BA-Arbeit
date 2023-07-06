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
                // Filtern nach Im-Plan/Nicht-Im-Plan (wenn ausgewählt)
                if (filterValues.inPlan) {
                    return module.selectedSemester.length !== 0;
                }
                if (filterValues.notInPlan) {
                    return module.selectedSemester.length === 0;
                }
                // Filtern nach Turnus (wenn ausgewählt)
                if (filterValues.turnus.length !== 0) {
                    return filterValues.turnus.includes(module.period); //||  filterValues.turnus === "beide" ;
                }
                // Filtern nach empfohlenem Semester (wenn ausgewählt)
                if (filterValues.recommendedSemester.length !== 0) {
                    return filterValues.recommendedSemester.includes(module.recommendedSemester);
                }
                // Filtern nach ausgewähltem Semester (wenn ausgewählt)
                if (filterValues.selectedSemester.length !== 0) {
                    for(let selectedSemester of module.selectedSemester)
                    return filterValues.selectedSemester.includes(selectedSemester);
                }
                return true; // Wenn keine Auswahl getroffen wurde, alle Modules zurückgeben
            });
            subject.modules = filteredModules.concat(filteredSubjectModules);
        });

        // Erstellen einer neuen Instanz von Studies mit den gefilterten Daten
        var filteredStudies = new Studies(studies.degree, studies.totalECTS, studies.semesters, filteredSubjects, studies.specialization);

        return filteredStudies;
    }

}

export default CatalogueManager;