require('dotenv').config();
const { Client, Databases, Query } = require('node-appwrite');

async function checkStudent() {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);
    const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
    const collId = 'students';
    const idToSearch = '2421132';

    console.log(`Checking Appwrite for studentId: ${idToSearch}...`);
    try {
        const response = await databases.listDocuments(dbId, collId, [
            Query.equal("studentId", idToSearch)
        ]);
        console.log(`Results found: ${response.total}`);
        if (response.total > 0) {
            console.log('Student Info:', response.documents[0]);
        } else {
            console.log('STUDENT NOT FOUND in Appwrite!');
        }
    } catch (e) {
        console.error('Appwrite Request Failed:', e.message);
    }
}

checkStudent();
