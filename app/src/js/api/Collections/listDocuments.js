import appwrite from "../appwrite.js";

// Get all documents in the Collection with a ID
function listDocuments(collection){
    let promise = appwrite.database.listDocuments(collection);
    return promise;
}

export {listDocuments};