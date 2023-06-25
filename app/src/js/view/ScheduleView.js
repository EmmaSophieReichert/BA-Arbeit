import { GridStack } from 'gridstack';

class ScheduleView {

    constructor() {
        var items = [
            {
                x: 0, y: 0,
                maxW: "10px", content: 'my first widget'
            }, // will default to location (0,0) and 1x1
            {
                x: 2, y: 0,
                w: 2, content: 'another longer widget!'
            } // will be placed next at (1,0) and 2x1
        ];
        var grid = GridStack.init({ column: 6 });
        grid.load(items);
    }
}

export default ScheduleView;