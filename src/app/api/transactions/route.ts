// Actualizar transacción
export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();
        const { id, account_id, category_id, user_id, date, description, amount, type } = data;
        await pool.query(
            'UPDATE transactions SET account_id = ?, category_id = ?, user_id = ?, date = ?, description = ?, amount = ?, type = ? WHERE id = ?',
            [account_id, category_id, user_id, date, description, amount, type, id]
        );
        return NextResponse.json({ message: 'Transacción actualizada' });
    } catch (error) {
        return NextResponse.json({ error: 'Error al actualizar transacción', details: error }, { status: 500 });
    }
}

// Eliminar transacción
export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();
        await pool.query('DELETE FROM transactions WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Transacción eliminada' });
    } catch (error) {
        return NextResponse.json({ error: 'Error al eliminar transacción', details: error }, { status: 500 });
    }
}
// src/app/api/transactions/route.ts
import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';

// Obtener todas las transacciones
export async function GET() {
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

// Crear una nueva transacción
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { id, account_id, category_id, user_id, date, description, amount, type } = data;
        await pool.query(
            'INSERT INTO transactions (id, account_id, category_id, user_id, date, description, amount, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, account_id, category_id, user_id, date, description, amount, type]
        );
        return NextResponse.json({ message: 'Transacción creada' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Error al crear transacción', details: error }, { status: 500 });
    }
}
