import appwrite from "../appwrite.js";

// create a session
function createSession(email, password) {
    let promise = appwrite.account.createEmailSession(email, password);
    return promise;
}

export { createSession };