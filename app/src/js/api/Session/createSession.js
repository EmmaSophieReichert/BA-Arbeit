import appwrite from "../appwrite.js";

// Function to create a session -> authentication
function createSession(email, password) {
    let promise = appwrite.account.createEmailSession(email, password);
    return promise;
}

export {createSession};