import AppController from "./controller/AppController.js";

// Starting the App
function start() {
    // Init AppController and set the Starting page
    let app = new AppController();
    app.init();
}

start();