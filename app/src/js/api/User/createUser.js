import appwrite from "../appwrite.js";

// Function to create a user
function createUser(email, password, username) {
    console.log("Blsdkab", appwrite.account);
    let promise = appwrite.account.create("unique()", email, password, username);
    return promise;
}

export {createUser};