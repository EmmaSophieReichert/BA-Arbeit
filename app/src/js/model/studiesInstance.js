//one instance of Study used in different components of the app
var studies = null;

//function to change the instance
function setStudyInstance(stud){
    studies = stud;
}

export {studies, setStudyInstance};