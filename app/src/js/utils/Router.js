/* eslint-env browser */

import { Observable, Event } from "./Observable.js";

const ROUTES = {
    404: "../app/src/html/404.html",
    "": "../app/src/html/schedule.html",
    "#login": "../app/src/html/login.html",
    "#register": "../app/src/html/register.html",
    "#study": "../app/src/html/study.html",
    "#impressum": "../app/src/html/impressum.html",
    "#schedule": "../app/src/html/schedule.html",
    "#module-catalogue": "../app/src/html/module-catalogue.html",
    "#grade-calculator": "../app/src/html/grade-calculator.html",
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
    async onHashChanged() {
        let hash = window.location.hash,
            route = ROUTES[hash] || ROUTES[404];
        try {
            await fetch(route).then(res => {
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
        } catch (error) {
            console.log(error);
        }
    }
}

export default Router;