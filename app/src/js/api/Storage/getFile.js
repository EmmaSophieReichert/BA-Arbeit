import appwrite from "../appwrite.js";

// Retrieve a stored file
function getFile(id){
    let promise = appwrite.storage.getFileView(id);
    return promise;
}

export {getFile};