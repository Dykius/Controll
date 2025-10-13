import { cookies } from 'next/headers';
import { jwtVerify, JWTPayload } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'your-super-secret-key-that-is-long');

export interface UserPayload extends JWTPayload {
    userId: number;
    email: string;
    fullName: string;
}

export async function getSession(): Promise<UserPayload | null> {
  const sessionCookie = cookies().get('session');

  if (!sessionCookie) {
    return null;
  }

  try {
    const { payload } = await jwtVerify<UserPayload>(sessionCookie.value, SECRET_KEY);
    return payload;
  } catch (error) {
    console.error('Failed to verify session:', error);
    return null;
  }
}
