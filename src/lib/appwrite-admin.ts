import { Client, Account, Databases, Users } from 'node-appwrite';

export function createAdminClient() {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '69662d2200214465b1d3')
        .setKey(process.env.APPWRITE_API_KEY || ''); // مفتاح السيرفر (Admin API Key)

    return {
        get account() { return new Account(client); },
        get databases() { return new Databases(client); },
        get users() { return new Users(client); }
    };
}

export function createSessionClient(session: string) {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '69662d2200214465b1d3')
        .setSession(session);

    return {
        get account() { return new Account(client); }
    };
}
