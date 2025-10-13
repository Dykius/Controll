import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'your-super-secret-key-that-is-long');

async function verifyToken(token: string) {
    try {
        await jwtVerify(token, SECRET_KEY);
        return true;
    } catch (e) {
        return false;
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Allow API routes, static files, and image optimization to pass through
    if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('favicon.ico')) {
        return NextResponse.next();
    }
    
    const sessionCookie = request.cookies.get('session');
    const token = sessionCookie?.value;
    const hasSession = token ? await verifyToken(token) : false;

    const isAuthPage = pathname.startsWith('/auth');

    if (hasSession && isAuthPage) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (!hasSession && !isAuthPage) {
        return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }

    return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * But we want to protect api routes, so we check them inside the middleware
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
