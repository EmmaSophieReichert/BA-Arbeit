const { Client, Account, ID } = Appwrite;
const appwrite = new Client();

appwrite
     .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite Endpoint process.env.APPWRITE_ENDPOINT
     .setProject("649ab3887121a935da21"); // Your project ID process.env.APPWRITE_KEY
     
export default appwrite;