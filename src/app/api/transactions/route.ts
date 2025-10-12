import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';

// Obtener todas las transacciones de un usuario
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const user_id = searchParams.get("user_id");

        if (!user_id) {
            return NextResponse.json({ error: "user_id requerido" }, { status: 400 });
        }

        const [rows] = await pool.query(
            'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC',
            [user_id]
        );

        return NextResponse.json(rows);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: 'Error al obtener transacciones', details: error.message }, { status: 500 });
    }
}

// Crear una nueva transacción
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { id, account_id, category_id, user_id, date, description, amount, type } = data;
        
        // TODO: En una app real, deberíamos validar que la cuenta y categoría pertenecen al usuario.

        await pool.query(
            'INSERT INTO transactions (id, account_id, category_id, user_id, date, description, amount, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, account_id, category_id, user_id, date, description, amount, type]
        );
        return NextResponse.json({ message: 'Transacción creada' }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: 'Error al crear transacción', details: error.message }, { status: 500 });
    }
}

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
    } catch (error: any) {
        return NextResponse.json({ error: 'Error al actualizar transacción', details: error.message }, { status: 500 });
    }
}

// Eliminar transacción
export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();
        await pool.query('DELETE FROM transactions WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Transacción eliminada' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Error al eliminar transacción', details: error.message }, { status: 500 });
    }
}
