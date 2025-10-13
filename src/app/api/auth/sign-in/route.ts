import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'your-super-secret-key-that-is-long');
const ALGORITHM = 'HS256';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
    }

    const [users]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (!users || users.length === 0) {
      return NextResponse.json({ error: 'Credenciales inválidas.' }, { status: 401 });
    }
    
    const user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Credenciales inválidas.' }, { status: 401 });
    }

    // Create JWT token
    const token = await new SignJWT({ userId: user.id, email: user.email, fullName: user.fullName })
      .setProtectedHeader({ alg: ALGORITHM })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(SECRET_KEY);

    // Set cookie
    cookies().set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
      sameSite: 'lax',
    });

    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({ 
        message: 'Inicio de sesión exitoso',
        user: userWithoutPassword 
    });

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Error interno del servidor.', details: error.message }, { status: 500 });
  }
}