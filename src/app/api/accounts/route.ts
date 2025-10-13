import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSession } from "@/lib/session";

// Obtener todas las cuentas de un usuario
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const user_id = session.userId;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM accounts WHERE user_id = ?",
      [user_id]
    );
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al obtener cuentas", details: error.message },
      { status: 500 }
    );
  }
}

// Crear una cuenta
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const user_id = session.userId;

  try {
    const {
      id,
      name,
      type,
      currency,
      initial_balance,
      credit_limit,
      closing_date,
      initial_debt,
    } = await request.json();
    await pool.query(
      "INSERT INTO accounts (id, user_id, name, type, currency, initial_balance, credit_limit, closing_date, initial_debt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        user_id,
        name,
        type,
        currency,
        initial_balance,
        credit_limit,
        closing_date,
        initial_debt,
      ]
    );
    return NextResponse.json({ message: "Cuenta creada" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al crear cuenta", details: error.message },
      { status: 500 }
    );
  }
}

// Actualizar una cuenta
export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const user_id = session.userId;

  try {
    const {
      id,
      name,
      currency,
      initial_balance,
      credit_limit,
      closing_date,
      initial_debt,
    } = await request.json();

    // TO-DO: Verify that the account belongs to the user
    await pool.query(
      "UPDATE accounts SET name = ?, currency = ?, initial_balance = ?, credit_limit = ?, closing_date = ?, initial_debt = ? WHERE id = ? AND user_id = ?",
      [
        name,
        currency,
        initial_balance,
        credit_limit,
        closing_date,
        initial_debt,
        id,
        user_id,
      ]
    );
    return NextResponse.json({ message: "Cuenta actualizada" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al actualizar cuenta", details: error.message },
      { status: 500 }
    );
  }
}

// Eliminar una cuenta
export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const user_id = session.userId;

  try {
    const { id } = await request.json();
    // Verify that the account belongs to the user before deleting
    await pool.query("DELETE FROM accounts WHERE id = ? AND user_id = ?", [id, user_id]);
    return NextResponse.json({ message: "Cuenta eliminada" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al eliminar cuenta", details: error.message },
      { status: 500 }
    );
  }
}
