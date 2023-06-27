/* eslint-env browser */

import { createSession } from "../api/Session/createSession.js";
import {Observable, Event} from "../utils/Observable.js";

class LoginManager extends Observable {

    constructor() {
        super();
    }

    // If a user wants to login, the database is asked to create a session with this user
    // If this is not possible -> user account is not real
    async createSession(email, password) {
        let promise = createSession(email, password),
            res = await computePromise(promise),
            // res is either true or false and is passed to the controller
            event = new Event("login-result", res);
        this.notifyAll(event);
    }

}

// If the account credentials are real -> return true (User is granted access)
// Returns the reason why login was not successful too -> use for validation/ error animations in view
// On success it returns the user, which could be used to greet him or such stuff
async function computePromise(promise) {
    let res = await promise.then((res) => {
        return {
            login: true,
            answer: res,
        };
    }, (error) => {
        return {
            login: false,
            answer: error,
        };
    });
    return res;
}

export default LoginManager;