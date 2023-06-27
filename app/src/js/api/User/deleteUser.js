import appwrite from "../appwrite.js";

// Function to delete a currently logged in user
function deleteUser() {
    let promise = appwrite.account.delete();
    return promise;
}

export {deleteUser};