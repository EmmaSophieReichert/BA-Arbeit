import AppController from "./controller/AppController.js";

// Starting the App
function start() {
    // Init your App Controller and set the Starting page (Login in this case)
    let app = new AppController();
    app.init();
}

start();