require('dotenv').config();
const { Client, Databases } = require('node-appwrite');

async function setupUserLinks() {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);
    const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
    const collId = 'user_links';

    console.log(`Creating collection: ${collId}...`);
    try {
        await databases.createCollection(dbId, collId, 'User Links');
        console.log(`Collection ${collId} created.`);
    } catch (e) {
        console.log(`Collection ${collId} might already exist:`, e.message);
    }

    // Attributes
    const attributes = [
        { id: 'userId', type: 'string', size: 255, required: true },
        { id: 'studentId', type: 'string', size: 50, required: true }
    ];

    for (const attr of attributes) {
        try {
            await databases.createStringAttribute(dbId, collId, attr.id, attr.size, attr.required);
            console.log(`Attribute '${attr.id}' created.`);
            await new Promise(r => setTimeout(r, 2000));
        } catch (e) {
            console.log(`Attribute '${attr.id}' error:`, e.message);
        }
    }

    // Indexes
    try {
        await databases.createIndex(dbId, collId, 'userId_index', 'unique', ['userId'], ['asc']);
        console.log(`Index 'userId_index' created.`);
    } catch (e) {
        console.log(`Index 'userId_index' error:`, e.message);
    }

    console.log("Setup complete!");
}

setupUserLinks();
