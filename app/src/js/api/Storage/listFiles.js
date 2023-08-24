import Config from "../../utils/Config.js";
import appwrite from "../appwrite.js";

// get a promise to list all files of the user
function listFiles() {
    let promise = appwrite.storage.listFiles(Config.BUCKET_ID);
    return promise;
}

export { listFiles };