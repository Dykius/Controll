import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // DEVELOPMENT ONLY: Temporarily disable auth to view inner pages
    return NextResponse.next();
    
    /*
    const { pathname } = request.nextUrl;
    // In middleware, we can't access localStorage. We should rely on cookies for session management.
    // The browser will automatically send cookies with each request.
    const sessionCookie = request.cookies.get('session');
    const hasSession = !!sessionCookie;

    const isAuthPage = pathname.startsWith('/auth');

    // If the user has a session and tries to access an auth page (like login or sign-up),
    // redirect them to the dashboard.
    if (hasSession && isAuthPage) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // If the user does not have a session and is trying to access any page
    // that is NOT an auth page, redirect them to the login page.
    if (!hasSession && !isAuthPage) {
        return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }

    // Otherwise, allow the request to proceed.
    return NextResponse.next();
    */
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
