import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSession } from "@/lib/session";

// Obtener presupuestos de un usuario
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const user_id = session.userId;

  try {
    const [rows] = await pool.query("SELECT * FROM budgets WHERE user_id = ?", [
      user_id,
    ]);
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al obtener presupuestos", details: error.message },
      { status: 500 }
    );
  }
}

// Crear presupuesto
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const user_id = session.userId;

  try {
    const { id, categoryId, amount, month } = await request.json();
    await pool.query(
      "INSERT INTO budgets (id, category_id, user_id, amount, month) VALUES (?, ?, ?, ?, ?)",
      [id, categoryId, user_id, amount, month]
    );
    return NextResponse.json(
      { message: "Presupuesto creado" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al crear presupuesto", details: error.message },
      { status: 500 }
    );
  }
}

// Actualizar presupuesto
export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const user_id = session.userId;

  try {
    const { id, categoryId, amount, month } = await request.json();
    await pool.query(
      "UPDATE budgets SET category_id = ?, amount = ?, month = ? WHERE id = ? AND user_id = ?",
      [categoryId, amount, month, id, user_id]
    );
    return NextResponse.json({ message: "Presupuesto actualizado" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al actualizar presupuesto", details: error.message },
      { status: 500 }
    );
  }
}

// Eliminar presupuesto
export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const user_id = session.userId;

  try {
    const { id } = await request.json();
    await pool.query("DELETE FROM budgets WHERE id = ? AND user_id = ?", [id, user_id]);
    return NextResponse.json({ message: "Presupuesto eliminado" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al eliminar presupuesto", details: error.message },
      { status: 500 }
    );
  }
}
