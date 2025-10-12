import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// Obtener todas las cuentas de un usuario
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");
    if (!user_id)
      return NextResponse.json({ error: "user_id requerido" }, { status: 400 });
    const [rows] = await pool.query(
      "SELECT * FROM accounts WHERE user_id = ?",
      [user_id]
    );
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener cuentas", details: error },
      { status: 500 }
    );
  }
}

// Crear una cuenta
export async function POST(request: NextRequest) {
  try {
    const {
      id,
      user_id,
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
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear cuenta", details: error },
      { status: 500 }
    );
  }
}

// Actualizar una cuenta
export async function PUT(request: NextRequest) {
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
    await pool.query(
      "UPDATE accounts SET name = ?, currency = ?, initial_balance = ?, credit_limit = ?, closing_date = ?, initial_debt = ? WHERE id = ?",
      [
        name,
        currency,
        initial_balance,
        credit_limit,
        closing_date,
        initial_debt,
        id,
      ]
    );
    return NextResponse.json({ message: "Cuenta actualizada" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar cuenta", details: error },
      { status: 500 }
    );
  }
}

// Eliminar una cuenta
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await pool.query("DELETE FROM accounts WHERE id = ?", [id]);
    return NextResponse.json({ message: "Cuenta eliminada" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar cuenta", details: error },
      { status: 500 }
    );
  }
}
