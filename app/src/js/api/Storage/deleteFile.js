import Config from "../../utils/Config.js";
import appwrite from "../appwrite.js";

// Delete a stored file
function deleteFile(id) {
    let promise = appwrite.storage.deleteFile(Config.BUCKET_ID, id);
    return promise;
}

export { deleteFile };