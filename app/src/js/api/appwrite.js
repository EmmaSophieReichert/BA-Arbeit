const { Client, Account, ID, Databases, Storage} = Appwrite;
// const appwrite = new Client();

const client = new Client(),
     account = new Account(client),
     database = new Databases(client),
     storage = new Storage(client);

const appwrite = {
     client: client,
     account: account,
     database: database,
     ID: ID,
     storage: storage
}

appwrite.client
     .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite Endpoint process.env.APPWRITE_ENDPOINT
     .setProject("649ab3887121a935da21"); // Your project ID process.env.APPWRITE_KEY
     
export default appwrite;