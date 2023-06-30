import Config from "../../utils/Config.js";
import appwrite from "../appwrite.js";

// Retrieve a stored file
function listFiles(){
    let promise = appwrite.storage.listFiles(Config.BUCKET_ID);
    return promise;
}

export {listFiles};