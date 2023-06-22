import express from "express";
import open from "open";

const HTTP_PORT = 8080;

var app;

function init() {
    app = express();
    app.use("/", express.static("app"));
    app.listen(HTTP_PORT, function() {
        console.log("Server started. Opening application in browser ... [Press CTRL + C to stop server]");
        open("http://localhost:8080");
    });
}

init();