import appwrite from "../appwrite.js";
import Config from "../../utils/Config.js";
import { getAuth } from "../Auth/getAuth.js";

const { Permission, Role } = Appwrite;

// Create a stored file
function createFile(data, res) {
    let promise = appwrite.storage.createFile(Config.BUCKET_ID, appwrite.ID.unique(), data, [
        Permission.read(Role.user(res.user.$id)),
        Permission.write(Role.user(res.user.$id)),
    ]);
    return promise;
}

export { createFile };