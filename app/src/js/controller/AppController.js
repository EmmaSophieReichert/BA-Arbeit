import Router from "../utils/Router.js";

import RegisterController from "./RegisterController.js";
import LoginController from "./LoginController.js";
import ScheduleController from "./ScheduleController.js";
import StudyController from "./StudyController.js";

import { getAuth } from "../api/Auth/getAuth.js";
import { deleteSession } from "../api/Session/deleteSession.js";
import ModuleCatalogueController from "./ModuleCatalogueController.js";
import GradeCalculatorController from "./GradeCalculatorController.js";
import { setStudyInstance, studies } from "../model/studiesInstance.js";

class AppController {

    init() {
        this.router = new Router();
        window.addEventListener("hashchange", this.onHashChanged.bind(this));
        window.addEventListener("load", this.onHashChanged.bind(this));
        this.router.addEventListener("template-ready", this.onTemplateReady.bind(this));

        this.container = document.querySelector(".content-container");

        this.logoutButton = document.getElementById("logout-button");
        this.logoutButton.addEventListener("click", async function () {
            let promise = deleteSession();
            await promise.then((res) => {
                console.log("Logged out", res);
                setStudyInstance(null);
                window.location.hash = "login";
                location.reload();
            }, (error) => {
                console.log("Failed to log out", error);
            });
        });

        this.navLinks = document.getElementById("nav-links");
    }

    setHash(hash) {
        console.log(hash);
        window.location.hash = hash;
    }

    // When the user routes through the application, he has to be authenticated to use some pages
    // Thats why u have to look for current sessions before giving access
    async onHashChanged(event) {
        await getAuth().then(res => {
            // The case we have a good result
            // Now we have to test if a user is logged in or not
            let logged = res.login;
            console.log("LOGGED: ", logged);
            console.log("USER: ", res.user);
            this.computeCurrentPage(event, logged);
        });

    }

    computeCurrentPage(event, loggedIn) {
        let currentHash = window.location.hash;
        console.log("HASH: ", currentHash);
        // If a user is logged in, he should not be able to view login and register page
        if (currentHash === "") {
            this.setHash("login");
        }
        if (loggedIn) {
            if (currentHash === "#login" || currentHash === "#register") {
                this.setHash("schedule");
            }
            this.logoutButton.style.display = "inline-block";
            this.navLinks.style.display = "flex";

        } else {
            this.logoutButton.style.display = "none";
            this.navLinks.style.display = "none";
            if (currentHash !== "#login" && currentHash !== "#register" && currentHash !== "#impressum" &&
                currentHash !== "#datenschutz") {
                this.setHash("login");
            }
        }
        if (currentHash === "#schedule") {
            setTimeout(() => {
                this.router.onHashChanged(event);
                return;
            }, 500);
        }
        else {
            this.router.onHashChanged(event);
        }
    }

    async onTemplateReady(event) {
        let template = event.data;
        if (template.route === "") {
            template.route = "#schedule";
        }
        this.container.innerHTML = template.template;

        // After a template is set, we init a controller which takes care of the functionality
        switch (template.route) {
            case "#login":
                this.controller = new LoginController();
                break;
            case "#register":
                this.controller = new RegisterController();
                break;
            case "#study":
                this.controller = new StudyController();
                break;
            case "#schedule":
                this.controller = new ScheduleController();
                break;
            case "#module-catalogue":
                this.controller = new ModuleCatalogueController();
                break;
            case "#grade-calculator":
                this.controller = new GradeCalculatorController();
                break;
            case "#impressum":
                break;
            default:
        }
    }

}

export default AppController;