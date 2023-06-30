import Config from "../../utils/Config.js";
import appwrite from "../appwrite.js";

// Retrieve a stored file
function getFile(id){
    const jwtPromise = appwrite.account.createJWT();
    return jwtPromise;
}

export {getFile};