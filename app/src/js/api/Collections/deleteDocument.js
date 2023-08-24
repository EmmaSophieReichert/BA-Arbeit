import appwrite from "../appwrite.js";

// Delete a document in a Collection
function deleteDocument(collection, docId) {
    let promise = appwrite.database.deleteDocument(collection, docId);
    return promise;
}

export { deleteDocument };