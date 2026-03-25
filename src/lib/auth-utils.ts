import { cookies } from 'next/headers';

const AUTH_COOKIE_NAME = 'zaitouna_auth';

export async function setAuthCookie(studentData: any) {
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(studentData), {
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
    try {
        return JSON.parse(cookie.value);
    } catch {
        return null;
    }
}

export async function clearAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);
}
