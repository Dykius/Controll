import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const session = request.cookies.get('session')?.value;

    const isAuthPage = pathname.startsWith('/auth');

    if (!session && !isAuthPage) {
        return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }

    if (session && isAuthPage) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth/sign-up (allow access to sign up page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
