import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const authCookie = request.cookies.get('zaitouna_auth');
    const isLoginPage = request.nextUrl.pathname === '/login';
    const isAdminPath = request.nextUrl.pathname.startsWith('/admin');

    // Basic session presence check (signature verification happens in APIs/Server Components)
    const isAuthApi = request.nextUrl.pathname.startsWith('/api/auth');
    const isLookupApi = request.nextUrl.pathname === '/api/student-lookup';

    // Basic session presence check (signature verification happens in APIs/Server Components)
    if (!authCookie && !isLoginPage && !isAuthApi && !isLookupApi) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (authCookie) {
        // If they have a cookie, let's peek at it (unsigned check for routing purposes)
        try {
            const cookieValue = authCookie.value;
            const parts = cookieValue.split('.');
            if (parts.length === 2) {
                const sessionData = JSON.parse(parts[0]);
                if (isAdminPath && !sessionData.isAdmin) {
                    return NextResponse.redirect(new URL('/', request.url));
                }
                // Removed: auto-redirect from login page to allow switching
            } else if (!isLoginPage) {
                // Invalid cookie format
                const response = NextResponse.redirect(new URL('/login', request.url));
                response.cookies.delete('zaitouna_auth');
                return response;
            }
        } catch {
            if (!isLoginPage) return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api/student-lookup|_next/static|_next/image|favicon.ico|sw.*\\.js|manifest.json|icons/).*)'],
}
