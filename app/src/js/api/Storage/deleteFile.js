import appwrite from "../appwrite.js";

// Create a stored file
function deleteFile(id){
    let promise = appwrite.storage.deleteFile(id);
    return promise;
}

export {deleteFile};