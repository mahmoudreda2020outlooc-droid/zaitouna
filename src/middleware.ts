import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Since we are using localStorage on the client, we can't easily check auth on the server middleware
    // Without cookies. For simplicity in this early phase, we'll handle redirects on the client.
    // But we can add a basic check here if we decide to use cookies later.
    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)'],
}
