import { Client, Account, Databases, Users } from 'node-appwrite';

export function createAdminClient() {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '69662d2200214465b1d3')
        .setKey(process.env.APPWRITE_API_KEY || 'standard_96dc2441291ebaecb390aa6768280e280a85805c7c81317d7a82583ae1beb812e644475c368aed8bde042a2dd45a516f1ac67bfd371caa4fcba56d8412466a6551155e623f44eb6c9953957affb48eaea28e3a0f14583a626f613b46083fa09466715153b2c3fd4ae7b24f8573d245b9c86eb87159d38817fe3b491451b55390'); // مفتاح السيرفر (Admin API Key)

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
