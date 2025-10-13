import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
    }

    // 1. Buscar al usuario por email
    const [users]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (!users || users.length === 0) {
      return NextResponse.json({ error: 'Credenciales inválidas.' }, { status: 401 });
    }
    
    const user = users[0];

    // 2. Comparar la contraseña enviada con la contraseña hasheada en la BD
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Credenciales inválidas.' }, { status: 401 });
    }

    // 3. Autenticación exitosa.
    // En una app real, aquí se generaría un token (JWT) o una sesión.
    // Por ahora, solo devolvemos los datos del usuario sin la contraseña.
    const { password: _, ...userWithoutPassword } = user;
    
    const response = NextResponse.json({ 
        message: 'Inicio de sesión exitoso',
        user: userWithoutPassword 
    });

    // En una app real, configuraríamos una cookie de sesión aquí.
    // response.cookies.set('session', '...', { httpOnly: true, secure: process.env.NODE_ENV === 'production', ... });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Error interno del servidor.', details: error.message }, { status: 500 });
  }
}
