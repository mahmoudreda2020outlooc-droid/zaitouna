import { Client, Databases } from 'node-appwrite';

async function clear() {
    const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject('69662d2200214465b1d3')
        .setKey('standard_96dc2441291ebaecb390aa6768280e280a85805c7c81317d7a82583ae1beb812e644475c368aed8bde042a2dd45a516f1ac67bfd371caa4fcba56d8412466a6551155e623f44eb6c9953957affb48eaea28e3a0f14583a626f613b46083fa09466715153b2c3fd4ae7b24f8573d245b9c86eb87159d38817fe3b491451b55390');

    const databases = new Databases(client);
    const dbId = 'MainDatabase';
    const collId = 'user_links';

    console.log("Fetching all documents in user_links...");
    const response = await databases.listDocuments(dbId, collId);

    console.log(`Found ${response.total} documents.`);
    let count = 0;
    for (const doc of response.documents) {
        await databases.deleteDocument(dbId, collId, doc.$id);
        count++;
    }
    console.log(`Deleted ${count} documents. All Gmail links cleared.`);
}

clear().catch(console.error);
