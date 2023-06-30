import Config from "../../utils/Config.js";
import appwrite from "../appwrite.js";

// Retrieve a stored file
function getFile(id){
    let data = appwrite.storage.getFileDownload(Config.BUCKET_ID, id);
    return data;
}

export {getFile};