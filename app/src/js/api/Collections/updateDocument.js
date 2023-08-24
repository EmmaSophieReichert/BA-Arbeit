import appwrite from "../appwrite.js";

// Update a document in a Collection 
function updateDocument(collection, docId, data) {
    let promise = appwrite.database.updateDocument(collection, docId, data);
    return promise;
}

export { updateDocument };