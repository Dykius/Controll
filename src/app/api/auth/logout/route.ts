import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Remove the session cookie
    cookies().set('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: -1, // Expire the cookie immediately
      path: '/',
    });

    return NextResponse.json({ message: 'Cierre de sesión exitoso' });

  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
