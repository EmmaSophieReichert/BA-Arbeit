import appwrite from "../appwrite.js";

// Update the username from the currently logged in user
function updateUsername(username) {
    let promise = appwrite.account.updateName(username);
    return promise;
}
// Update the password from the currently logged in user
function updatePassword(password) {
    let promise = appwrite.account.updatePassword(password);
    return promise;
}
// Update the email from the currently logged in user
function updateEmail(email, password) {
    let promise = appwrite.account.updateEmail(email, password);
    return promise;
}

export { updateUsername, updatePassword, updateEmail };