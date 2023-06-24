//import { GridStack } from "gridstack/dist/gridstack-all.js";
import AppController from "./controller/AppController.js";

// Starting the App
function start() {
    // Init your App Controller and set the Starting page (Login in this case)
    let app = new AppController();
    //let grid = GridStack.init();
    app.init();
}

start();