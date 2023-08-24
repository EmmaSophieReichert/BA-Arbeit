/* eslint-env browser */

import { createUser } from "../api/User/createUser.js";
import { Observable, Event } from "../utils/Observable.js";

class RegisterManager extends Observable {

    constructor() {
        super();
    }

    //If a user wants to create an account, the database is asked to create one with his inputs
    async createUser(email, password, username) {
        let promise = createUser(email, password, username),
            res = await computePromise(promise),
            event = new Event("account-result", res);
        this.notifyAll(event);
    }
}


// returns if creation is a success and server answer
async function computePromise(promise) {
    let res = await promise.then((res) => {
        return {
            register: true,
            answer: res,
        };
    }, (error) => {
        return {
            register: false,
            answer: error,
        };
    });
    return res;

}

export default RegisterManager;