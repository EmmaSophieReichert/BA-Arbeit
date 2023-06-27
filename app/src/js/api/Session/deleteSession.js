import appwrite from "../appwrite.js";

// Function to delete a session -> mostly for testing the auth
function deleteSession() {
    let promise = appwrite.account.deleteSession("current");
    return promise;
}

export {deleteSession};