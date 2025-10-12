import { NextResponse } from "next/server";
import pool from "@/lib/db";

// Obtener todas las categorías (por defecto y personalizadas)
export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM categories");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener categorías", details: error },
      { status: 500 }
    );
  }
}
