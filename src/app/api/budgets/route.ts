import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// Obtener presupuestos de un usuario
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");
    if (!user_id)
      return NextResponse.json({ error: "user_id requerido" }, { status: 400 });
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
  try {
    const { id, category_id, user_id, amount, month } = await request.json();
    await pool.query(
      "INSERT INTO budgets (id, category_id, user_id, amount, month) VALUES (?, ?, ?, ?, ?)",
      [id, category_id, user_id, amount, month]
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
  try {
    const { id, category_id, user_id, amount, month } = await request.json();
    await pool.query(
      "UPDATE budgets SET category_id = ?, user_id = ?, amount = ?, month = ? WHERE id = ?",
      [category_id, user_id, amount, month, id]
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
  try {
    const { id } = await request.json();
    await pool.query("DELETE FROM budgets WHERE id = ?", [id]);
    return NextResponse.json({ message: "Presupuesto eliminado" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al eliminar presupuesto", details: error.message },
      { status: 500 }
    );
  }
}
