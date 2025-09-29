import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Si el usuario no está autenticado y no está en una página de autenticación,
    // redirigir a la página de inicio de sesión.
    // (Aquí estamos simulando la comprobación de la sesión. En una aplicación real,
    // verificarías un token o cookie de sesión)
    const hasSession = request.cookies.has('session');

    const isAuthPage = pathname.startsWith('/auth');

    if (!hasSession && !isAuthPage) {
        return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }

    if (hasSession && isAuthPage) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    
    // Si la ruta es la raíz y no hay sesión, redirigir a sign-in
    if (pathname === '/' && !hasSession) {
        return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
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
