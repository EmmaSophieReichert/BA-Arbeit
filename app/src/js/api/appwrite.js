const { Client, Account, ID, Databases } = Appwrite;
// const appwrite = new Client();

const client = new Client(),
     account = new Account(client),
     database = new Databases(client);

const appwrite = {
     client: client,
     account: account,
     database: database,
     ID: ID,
}

appwrite.client
     .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite Endpoint process.env.APPWRITE_ENDPOINT
     .setProject("649ab3887121a935da21"); // Your project ID process.env.APPWRITE_KEY
     
export default appwrite;