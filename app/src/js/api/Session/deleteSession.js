import appwrite from "../appwrite.js";

// delete a session
function deleteSession() {
    let promise = appwrite.account.deleteSession("current");
    return promise;
}

export { deleteSession };