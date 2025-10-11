// src/app/api/transactions/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
    try {
        // En una aplicación real, aquí obtendrías el ID del usuario de la sesión
        const user_id = 1; // Placeholder

        const connection = await pool.getConnection();
        const [rows] = await connection.query(
            'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC',
            [user_id]
        );
        connection.release();

        return NextResponse.json(rows);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error fetching transactions' }, { status: 500 });
    }
}
