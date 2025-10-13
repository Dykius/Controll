import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/session';

// Obtener todas las transacciones de un usuario
export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const user_id = session.userId;

    try {
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
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const user_id = session.userId;

    try {
        const data = await request.json();
        const { id, accountId, categoryId, date, description, amount, type } = data;
        
        await pool.query(
            'INSERT INTO transactions (id, account_id, category_id, user_id, date, description, amount, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, accountId, categoryId, user_id, date, description, amount, type]
        );
        return NextResponse.json({ message: 'Transacción creada' }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: 'Error al crear transacción', details: error.message }, { status: 500 });
    }
}

// Actualizar transacción
export async function PUT(request: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const user_id = session.userId;

    try {
        const data = await request.json();
        const { id, accountId, categoryId, date, description, amount, type } = data;
        await pool.query(
            'UPDATE transactions SET account_id = ?, category_id = ?, date = ?, description = ?, amount = ?, type = ? WHERE id = ? AND user_id = ?',
            [accountId, categoryId, date, description, amount, type, id, user_id]
        );
        return NextResponse.json({ message: 'Transacción actualizada' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Error al actualizar transacción', details: error.message }, { status: 500 });
    }
}

// Eliminar transacción
export async function DELETE(request: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const user_id = session.userId;

    try {
        const { id } = await request.json();
        await pool.query('DELETE FROM transactions WHERE id = ? AND user_id = ?', [id, user_id]);
        return NextResponse.json({ message: 'Transacción eliminada' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Error al eliminar transacción', details: error.message }, { status: 500 });
    }
}
