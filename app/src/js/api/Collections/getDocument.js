import appwrite from "../appwrite.js";

// Get a document in a Collection 
function getDocument(collection, docId){
    let promise = appwrite.database.getDocument(collection, docId);
    return promise;
}

export {getDocument};