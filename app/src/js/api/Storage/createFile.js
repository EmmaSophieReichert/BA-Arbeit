import appwrite from "../appwrite.js";

// Create a stored file
function createFile(id, data) {
    let promise = appwrite.storage.createFile(id, data, ["role:all"], ["role:all"]);
    return promise;
}

export { createFile };
