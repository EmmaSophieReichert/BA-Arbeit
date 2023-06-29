import appwrite from "../appwrite.js";
import Config from "../../utils/Config.js";

const {Permission, Role } = Appwrite;

// Create a stored file
function createFile(data) {
    let promise = appwrite.storage.createFile(Config.BUCKET_ID, appwrite.ID.unique(), data, [
        Permission.read(Role.any()),                  
        Permission.update(Role.any()),       
        Permission.delete(Role.any())        
    ]);
    return promise;
}

export { createFile };
