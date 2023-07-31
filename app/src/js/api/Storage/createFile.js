import appwrite from "../appwrite.js";
import Config from "../../utils/Config.js";
import { getAuth } from "../Auth/getAuth.js";

const { Permission, Role } = Appwrite;

// Create a stored file
async function createFile(data) {
    await getAuth().then(res => {
        if(res.login){
            let promise = appwrite.storage.createFile(Config.BUCKET_ID, appwrite.ID.unique(), data, [
            Permission.read(Role.user(res.user.$id)),
            Permission.write(Role.user(res.user.$id)),
            ]);
            return promise;
        }
        else{
            window.location.hash = "login";
            location.reload();
            return null;
        }
    });
}

export { createFile };