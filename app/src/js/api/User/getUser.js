import appwrite from "../appwrite.js";

// Function to get the currently logged in user
function getUser() {
    let promise = appwrite.account.get();
    return promise;
}

export { getUser };