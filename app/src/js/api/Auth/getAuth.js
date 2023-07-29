// Returns if a user is currently logged in
// A user is if a session exists

import { getUser } from "../User/getUser.js";

async function getAuth(){
    let promise = getUser(),
        auth = null;
    await promise.then(res => {
        auth = {
            login: true,
            user: res,
        };
    }, error => {
        auth = {
            login: false,
            user: error,
        };
    });
    return auth;
}

export {getAuth};