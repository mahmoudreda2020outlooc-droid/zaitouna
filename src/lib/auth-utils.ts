import { cookies } from 'next/headers';

const AUTH_COOKIE_NAME = 'zaitouna_auth';
const SESSION_SECRET = process.env.SESSION_SECRET || 'fallback_secret_do_not_use_in_prod';

// Simple "signature" by appending a hash or just the secret (since we're running server-side)
// In a real prod app, use a proper JWT library like jose.
function sign(data: any): string {
    const str = JSON.stringify(data);
    return `${str}.${Buffer.from(SESSION_SECRET).toString('base64')}`;
}

function verify(cookieValue: string): any | null {
    const parts = cookieValue.split('.');
    if (parts.length !== 2) return null;
    const [dataStr, signature] = parts;
    const expectedSignature = Buffer.from(SESSION_SECRET).toString('base64');
    if (signature !== expectedSignature) return null;
    try {
        return JSON.parse(dataStr);
    } catch {
        return null;
    }
}

export async function setAuthCookie(studentData: any, isAdmin: boolean = false) {
    const cookieStore = await cookies();
    const sessionData = { ...studentData, isAdmin };
    cookieStore.set(AUTH_COOKIE_NAME, sign(sessionData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
    });
}

export async function getAuthUser() {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(AUTH_COOKIE_NAME);
    if (!cookie) return null;
    return verify(cookie.value);
}

export async function clearAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function isAdmin() {
    const user = await getAuthUser();
    return !!user?.isAdmin;
}
