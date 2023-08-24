const { Client, Account, ID, Databases, Storage } = Appwrite;

var client = new Client(),
     account = new Account(client),
     database = new Databases(client),
     storage = new Storage(client);

var appwrite = {
     client: client,
     account: account,
     database: database,
     ID: ID,
     storage: storage
}

appwrite.client
     .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite Endpoint process.env.APPWRITE_ENDPOINT
     .setProject("649ab3887121a935da21"); // Your project ID process.env.APPWRITE_KEY

function reloadClient(jwt) {
     client = new Client();
     account = new Account(client);
     database = new Databases(client);
     storage = new Storage(client);

     appwrite = {
          client: client,
          account: account,
          database: database,
          ID: ID,
          storage: storage
     }

     appwrite.client
          .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite Endpoint process.env.APPWRITE_ENDPOINT
          .setProject("649ab3887121a935da21") // Your project ID process.env.APPWRITE_KEY
          .setJWT(jwt);
}

export default appwrite;
export { reloadClient };