import appwrite from "../appwrite.js";

// Create a document in a Collection 
function createDocument(collection, data) {
    let promise = appwrite.database.createDocument(collection, "unique()", data);
    return promise;
}

export { createDocument };