import Router from "../utils/Router.js";

import ScheduleController from "./ScheduleController.js";

class AppController {

    init() {
        this.router = new Router();
        window.addEventListener("hashchange", this.onHashChanged.bind(this));
        window.addEventListener("load", this.onHashChanged.bind(this));
        this.router.addEventListener("template-ready", this.onTemplateReady.bind(this));
        
        this.container = document.querySelector(".content-container");
    }

    setHash(hash) {
        console.log(hash);
        window.location.hash = hash;
    }

    onHashChanged(event) {
        this.computeCurrentPage(event);
    }

    computeCurrentPage(event, loggedIn) {
        let currentHash = window.location.hash;
        // If a user is logged in, he should not be able to view login and register page
        // FROM HERE
        // If a user starts the app
        // if (currentHash === "") {
        //     this.setHash("login");
        // }
        // if (!this.router.isDynamicShareRoute(currentHash)) {
        //     if (loggedIn) {
        //         if (currentHash === "#login" || currentHash === "#register") {
        //             this.setHash("home");
        //         }
        //     } else {
        //         if (currentHash !== "#login" && currentHash !== "#register" && currentHash !== "#impressum" &&
        //             currentHash !== "#datenschutz") {
        //             this.setHash("landing");
        //         }
        //     }
        // }
        // TO HERE
        this.router.onHashChanged(event);
    }

    async onTemplateReady(event) {
        let template = event.data,
            shareData,
            computedID,
            accountData;

        console.log("TEMPLATE READY");

        // After a template is set, we init a controller which takes care of the functionality
        switch (template.route) {
            case "#schedule":
                this.container.innerHTML = template.template;
                this.controller = new ScheduleController();
                // this.controller.init(this.navView);
                // this.controller.addEventListener("on-view", this.onViewCastClicked.bind(this));
                // this.controller.addEventListener("ad-status", (event) => this.onAdStatusChanged(event));
                break;
            case "#impressum":
                console.log("IMPRESSUM");
                this.container.innerHTML = template.template;
                // this.controller = new ImpressumController();
                // this.controller.init(this.navView);
                break;
            default:
                // this.container.innerHTML = template.template;
                // this.controller = new ErrorController();
                // this.controller.init(this.navView);
        }
    }

}

export default AppController;