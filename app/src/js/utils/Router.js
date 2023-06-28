/* eslint-env browser */

import { Observable, Event } from "./Observable.js";

const ROUTES = {
    "": "../app/src/html/schedule.html",
    "#login": "../app/src/html/login.html",
    "#register": "../app/src/html/register.html",
    "#study": "../app/src/html/study.html",
    "#impressum": "../app/src/html/impressum.html",
    "#schedule": "../app/src/html/schedule.html",
    "#home": "../app/src/html/schedule.html",
};

// Router Class to navigate between pages with templates
class Router extends Observable {

    constructor() {
        super();
    }

    // Pushes a route on the "stack" -> enables navigation via browser arrow keys
    pushRoute(event) {
        event.preventDefault();
        let url = event.target.href;
        history.pushState(null, null, url);
        // Push state does not fire hashchange -> dispatch the event on the window
        window.dispatchEvent(new HashChangeEvent("hashchange"));
    }

    // When the URL hash changes the linked html template is retrieved
    // When the route is not available a 404 Error page will be shown

    onHashChanged() {
        let hash = window.location.hash,
            route = ROUTES[hash] || ROUTES[404];
        if (this.isDynamicShareRoute(window.location.hash)) {
            hash = "#/share/:id";
            route = ROUTES[hash];
        } else if (this.isDynamicCreateRoute(window.location.hash)) {
            hash = "#create";
            route = ROUTES[hash];
        }

        fetch(route).then(res => {
            let data = res.text();
            data.then(res => {
                let template = {
                        route: hash,
                        template: res,
                    },
                    event = new Event("template-ready", template);
                this.notifyAll(event);
            });
        });
    }

    // Checks for a dynamic route like /#/share/[ID with length 20]
    // ID uses [a-z] && [0-9]
    isDynamicShareRoute(hash) {
        let route = hash,
            regex = /^#\/share\/[0-9a-z]{20}$/;
        return regex.test(route);
    }

    // Checks for a dynamic route like /#create/[ID with length 20]
    // ID uses [a-z] && [0-9]
    isDynamicCreateRoute(hash) {
        let route = hash,
            regex = /^#create\/[0-9a-z]{20}$/;
        return regex.test(route);
    }
}

export default Router;