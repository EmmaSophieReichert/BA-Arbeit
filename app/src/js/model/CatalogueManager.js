import Studies from "./structure/Studies";
import { studies } from "./studiesInstance";

class CatalogueManager {

    constructor() {

    }

    filterStudies(filterValues) {
        // Filtern der Subjects
        var filteredSubjects = studies.subjects.filter(function (subject) {
            // Filtern nach Fachname (wenn ausgewählt)
            if (filterValues.subject) {
                return filterValues.subject.includes(subject.title);
            }
            return true; // Wenn kein Fach ausgewählt wurde, alle Subjects zurückgeben
        });

        // Filtern der Modules in den gefilterten Subjects
        var filteredModules = [];
        filteredSubjects.forEach(function (subject) {
            var filteredSubjectModules = subject.modules.filter(function (module) {
                // Filtern nach Im-Plan/Nicht-Im-Plan (wenn ausgewählt)
                if (filterValues.inPlan) {
                    return filterValues.inPlan === module.selectedSemester.length === 0;
                }
                // Filtern nach Turnus (wenn ausgewählt)
                if (filterValues.turnus) {
                    return filterValues.turnus === "beide" || filterValues.turnus === module.period;
                }
                // Filtern nach empfohlenem Semester (wenn ausgewählt)
                if (filterValues.recommendedSemester) {
                    return filterValues.recommendedSemester.includes(module.recommendedSemester);
                }
                // Filtern nach ausgewähltem Semester (wenn ausgewählt)
                if (filterValues.selectedSemester) {
                    return filterValues.selectedSemester.includes(module.selectedSemester.length);
                }
                return true; // Wenn keine Auswahl getroffen wurde, alle Modules zurückgeben
            });
            filteredModules = filteredModules.concat(filteredSubjectModules);
            subject.modules = filteredModules;
        });

        // Erstellen einer neuen Instanz von Studies mit den gefilterten Daten
        var filteredStudies = new Studies(studies.degree, studies.totalECTS, studies.semesters, filteredSubjects, studies.specialization);

        return filteredStudies;
    }

}

export default CatalogueManager;