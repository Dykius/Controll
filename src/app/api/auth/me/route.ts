import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'your-super-secret-key-that-is-long');

export async function GET(request: NextRequest) {
  const sessionCookie = cookies().get('session');

  if (!sessionCookie) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(sessionCookie.value, SECRET_KEY);
    return NextResponse.json({ user: payload });
  } catch (error) {
    return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 });
  }
}
