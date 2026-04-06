import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client();

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || ''); // سيتم استكمالها من المتغيرات

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { client };
