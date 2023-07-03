import appwrite from "../appwrite.js";
import Config from "../../utils/Config.js";
import { getAuth } from "../Auth/getAuth.js";

const { Permission, Role } = Appwrite;

// Create a stored file
async function createFile(data, id) {
    let headers = new Headers();
        headers.append('Content-Type', 'text/plain');
    getAuth().then(res => {
        let promise = appwrite.storage.createFile(Config.BUCKET_ID, id, data, [
            Permission.read(Role.user(res.user.$id)),
            Permission.write(Role.user(res.user.$id)),
        ]);//, { headers: headers});
        return promise;
    });
}

export { createFile };
