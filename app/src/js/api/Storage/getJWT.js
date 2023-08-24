import Config from "../../utils/Config.js";
import appwrite from "../appwrite.js";

// Retrieve a jwt promise
function getJWT(id) {
    const jwtPromise = appwrite.account.createJWT();
    return jwtPromise;
}

export { getJWT };