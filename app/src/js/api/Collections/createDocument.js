import appwrite from "../appwrite.js";
import Config from "../../utils/Config.js";

// Create a document in a Collection 
function createDocument(data) {
    let promise = appwrite.database.createDocument(Config.DATABASE_ID, Config.COLLECTION_ID, appwrite.ID.unique(), data);
    return promise;
}

export { createDocument };