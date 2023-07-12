// import { GridStack } from 'gridstack';
import { GridStack } from '../../../../node_modules/gridstack/dist/gridstack.js';
import Module from '../model/structure/Module.js';
import modalView from './ModalView.js';
import { Observable, Event } from '../utils/Observable.js';
import { studies, setStudyInstance } from '../model/studiesInstance.js';
import Config from '../utils/Config.js';
import moduleModalView from './ModuleModalView.js';


class GradeCalculatorView extends Observable {

    constructor() {
        super();
        this.chart = null;
    }

    show(){
        console.log(studies);
        let config = studies.toTreeData();
        this.chart = new Treant(config);
    }
    
}

export default GradeCalculatorView;